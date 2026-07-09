#!/usr/bin/env node

/**
 * Ingest + analyse the Wio USD account (9333280268) 1-year statement
 * (Jun 14, 2025 -> Jun 14, 2026), and reconcile Korea (DTS MG) payments
 * against MoySklad paymentouts to the DTSMG counterparty.
 *
 * The USD account is a pass-through for Korea supplier payments:
 *   AED -> USD (fund)  ->  To DTS MG Co LTD (pay)  ->  USD -> AED (sweep dust)
 *
 * Read-only. MoySklad reconciliation runs only if creds are present.
 *
 *   node --import dotenv/config scripts/ingest-wio-usd-statement-2025-2026.js
 */

const fs = require('fs')
const path = require('path')

const CSV = path.join(__dirname, '..', 'data', 'wio-statements-usd-2025-2026', 'statement(Jun 14, 2025 - Jun 14, 2026).csv')
const OUT = path.join(__dirname, '..', 'data', 'wio-statements-usd-2025-2026', 'wio-usd-2025-2026-summary.json')
const USD_IBAN = 'AE890860000009333280268'

function parseCsv(text) {
  const rows = []; let i = 0, f = '', row = [], q = false
  for (; i < text.length; i++) {
    const c = text[i]
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++ } else q = false } else f += c }
    else {
      if (c === '"') q = true
      else if (c === ',') { row.push(f); f = '' }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; if (f !== '' || row.length) { row.push(f); rows.push(row); row = []; f = '' } }
      else f += c
    }
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row) }
  return rows
}

async function moysklad(from, to) {
  const LOGIN = process.env.MOYSKLAD_LOGIN, PASSWORD = process.env.MOYSKLAD_PASSWORD
  if (!LOGIN || !PASSWORD) return null
  const API = 'https://api.moysklad.ru/api/remap/1.2'
  const H = { Authorization: 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64'), Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' }
  // find DTSMG counterparty
  const s = await fetch(`${API}/entity/counterparty?search=${encodeURIComponent('DTSMG')}&limit=10`, { headers: H })
  const sd = await s.json()
  const cp = (sd.rows || []).find(r => /dts/i.test(r.name)) || (sd.rows || [])[0]
  if (!cp) return { error: 'DTSMG counterparty not found' }
  let all = [], offset = 0
  const filter = `agent=${API}/entity/counterparty/${cp.id};moment>=${from} 00:00:00;moment<=${to} 23:59:59`
  while (true) {
    const r = await fetch(`${API}/entity/paymentout?limit=1000&offset=${offset}&filter=${encodeURIComponent(filter)}`, { headers: H })
    if (!r.ok) break
    const d = await r.json(); all = all.concat(d.rows || [])
    if ((d.rows || []).length < 1000) break; offset += 1000
  }
  const sumAed = all.reduce((s, r) => s + (r.sum || 0), 0) / 100
  return { counterparty: cp.name, id: cp.id, docs: all.length, sumAed }
}

async function main() {
  const rows = parseCsv(fs.readFileSync(CSV, 'utf8'))
  const head = rows[0].map(h => h.trim())
  const ix = (n) => head.findIndex(h => h.toLowerCase() === n.toLowerCase())
  const c = { iban: ix('Account IBAN'), type: ix('Transaction type'), date: ix('Date'), ref: ix('Ref. number'), desc: ix('Description'), amt: ix('Amount'), bal: ix('Balance'), notes: ix('Notes') }

  const txns = []
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]; if (!row || row.length < head.length) continue
    if ((row[c.iban] || '').trim() !== USD_IBAN) continue
    txns.push({
      date: (row[c.date] || '').trim(), type: (row[c.type] || '').trim(),
      ref: (row[c.ref] || '').trim(), desc: (row[c.desc] || '').trim(),
      amt: parseFloat((row[c.amt] || '0').replace(/[, ]/g, '')) || 0,
      notes: (row[c.notes] || '').trim(),
    })
  }

  const fmt = (n) => n.toFixed(2)
  const byMonth = {}, byType = {}
  let korea = { count: 0, usd: 0 }, fund = { count: 0, usd: 0 }, sweep = { count: 0, usd: 0 }, fees = { count: 0, usd: 0 }
  const koreaPayments = []
  for (const t of txns) {
    const mk = t.date.slice(0, 7)
    byMonth[mk] = byMonth[mk] || { in: 0, out: 0, n: 0 }
    byMonth[mk].n++; if (t.amt >= 0) byMonth[mk].in += t.amt; else byMonth[mk].out += t.amt
    byType[t.type] = byType[t.type] || { in: 0, out: 0, n: 0 }
    byType[t.type].n++; if (t.amt >= 0) byType[t.type].in += t.amt; else byType[t.type].out += t.amt
    if (/DTS MG/i.test(t.desc)) { korea.count++; korea.usd += t.amt; koreaPayments.push({ date: t.date, usd: t.amt, notes: t.notes }) }
    else if (/AED to USD/i.test(t.desc)) { fund.count++; fund.usd += t.amt }
    else if (/USD to AED/i.test(t.desc)) { sweep.count++; sweep.usd += t.amt }
    else if (/Swift|Fee/i.test(t.type) || /Fee/i.test(t.desc)) { fees.count++; fees.usd += t.amt }
  }

  console.log('=================================================================')
  console.log('  Wio USD account (9333280268) — Jun 14 2025 -> Jun 14 2026')
  console.log('=================================================================')
  console.log(`  Transactions: ${txns.length}`)
  console.log(`  Korea (To DTS MG Co LTD): ${korea.count} payments, USD ${fmt(-korea.usd)}`)
  console.log(`  AED->USD funding inflows: ${fund.count}, USD ${fmt(fund.usd)}`)
  console.log(`  USD->AED dust sweep      : ${sweep.count}, USD ${fmt(-sweep.usd)}`)
  console.log(`  Swift fees               : ${fees.count}, USD ${fmt(-fees.usd)}`)

  console.log('\n  By month (USD):')
  Object.keys(byMonth).sort().forEach(mk => {
    const m = byMonth[mk]
    console.log(`    ${mk}  in ${fmt(m.in).padStart(11)}  out ${fmt(m.out).padStart(12)}  net ${fmt(m.in + m.out).padStart(11)}  (${m.n})`)
  })

  console.log('\n  Korea payments (USD):')
  koreaPayments.forEach(k => console.log(`    ${k.date}  ${fmt(-k.usd).padStart(11)}  ${k.notes}`))

  // approx AED equivalent of Korea spend (Wio rate ~3.6725 USD->AED + fees)
  const RATE = 3.6725
  const koreaUsd = -korea.usd
  const koreaAedApprox = koreaUsd * RATE
  console.log(`\n  Korea USD total: ${fmt(koreaUsd)}  (~AED ${fmt(koreaAedApprox)} @ ${RATE})`)

  // MoySklad reconciliation
  const ms = await moysklad('2025-06-14', '2026-06-14')
  if (ms && !ms.error) {
    console.log('\n  === MoySklad reconciliation (DTSMG paymentouts, same window) ===')
    console.log(`    Counterparty: ${ms.counterparty} (${ms.docs} docs)`)
    console.log(`    MoySklad sum: AED ${fmt(ms.sumAed)}`)
    console.log(`    Bank Korea  : ~AED ${fmt(koreaAedApprox)} (USD ${fmt(koreaUsd)} @ ${RATE})`)
    console.log(`    Diff        : AED ${fmt(ms.sumAed - koreaAedApprox)}  (${((ms.sumAed - koreaAedApprox) / ms.sumAed * 100).toFixed(1)}%)`)
    console.log('    Note: bank window vs MoySklad doc dates differ slightly; FX rate approximate.')
  } else if (ms && ms.error) {
    console.log('\n  MoySklad recon skipped:', ms.error)
  } else {
    console.log('\n  MoySklad recon skipped (no creds).')
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    account: { iban: USD_IBAN, currency: 'USD', number: '9333280268' },
    period: { start: txns[0]?.date, end: txns[txns.length - 1]?.date },
    transactionCount: txns.length,
    korea: { count: korea.count, usd: Number(fmt(-korea.usd)), aedApprox: Number(fmt(koreaAedApprox)), rate: RATE },
    funding: { count: fund.count, usd: Number(fmt(fund.usd)) },
    sweep: { count: sweep.count, usd: Number(fmt(-sweep.usd)) },
    fees: { count: fees.count, usd: Number(fmt(-fees.usd)) },
    byMonth, byType, koreaPayments,
    moysklad: ms || null,
  }
  fs.writeFileSync(OUT, JSON.stringify(summary, null, 2))
  console.log(`\n  Summary written: ${path.relative(path.join(__dirname, '..'), OUT)}`)
}

main().catch(e => { console.error('FATAL', e.message); process.exit(1) })
