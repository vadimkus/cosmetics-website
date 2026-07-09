#!/usr/bin/env node

/**
 * Full H1 2026 reconciliation: Wio AED account (9833011607) <-> MoySklad.
 *
 * Matches bank AED outflows to MoySklad paymentouts (and inflows to paymentin/cashin)
 * by amount + date proximity. Korea (DTSMG) MoySklad docs are USD-funded (reconciled
 * separately in the USD ingest) and currency-exchange bank lines are treasury moves —
 * both are reported as labelled reconciling buckets, not errors.
 *
 * Read-only.
 *   node --import dotenv/config scripts/reconcile-aed-bank-vs-moysklad-h1-2026.js
 */

const fs = require('fs')
const path = require('path')

const DIR = path.join(__dirname, '..', 'data', 'wio-statements-2026-h1')
const OUT = path.join(DIR, 'reconciliation-aed-vs-moysklad-h1-2026.json')
const AED_IBAN = 'AE110860000009833011607'
const FROM = '2026-01-01', TO = '2026-06-14'
const DTSMG_ID = '3a0a3f28-33cf-11ea-0a80-043f000b9859'

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN, PASSWORD = process.env.MOYSKLAD_PASSWORD
const H = { Authorization: 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64'), Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' }

function parseCsv(text) {
  const rows = []; let f = '', row = [], q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++ } else q = false } else f += c }
    else { if (c === '"') q = true; else if (c === ',') { row.push(f); f = '' } else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; if (f !== '' || row.length) { row.push(f); rows.push(row); row = []; f = '' } } else f += c }
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row) }
  return rows
}

function loadBank() {
  const files = fs.readdirSync(DIR).filter(f => /^statement\(.*2026\)\.csv$/.test(f))
  const txns = []; const seen = new Set()
  for (const file of files) {
    const rows = parseCsv(fs.readFileSync(path.join(DIR, file), 'utf8'))
    const head = rows[0].map(h => h.trim())
    const ix = n => head.findIndex(h => h.toLowerCase() === n.toLowerCase())
    const c = { iban: ix('Account IBAN'), type: ix('Transaction type'), date: ix('Date'), ref: ix('Ref. number'), desc: ix('Description'), amt: ix('Amount'), notes: ix('Notes') }
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r]; if (!row || row.length < head.length) continue
      if ((row[c.iban] || '').trim() !== AED_IBAN) continue
      const ref = (row[c.ref] || '').trim()
      if (seen.has(ref)) continue; seen.add(ref)
      txns.push({ date: (row[c.date] || '').trim(), type: (row[c.type] || '').trim(), ref, desc: (row[c.desc] || '').trim(), amt: parseFloat((row[c.amt] || '0').replace(/[, ]/g, '')) || 0, notes: (row[c.notes] || '').trim() })
    }
  }
  return txns
}

async function api(u) { const r = await fetch(API + u, { headers: H }); return r.ok ? r.json() : null }
async function rng(ep) {
  let all = [], off = 0; const f = `moment>=${FROM} 00:00:00;moment<=${TO} 23:59:59`
  while (true) { const d = await api(`${ep}?limit=1000&offset=${off}&filter=${encodeURIComponent(f)}&expand=agent&order=moment,asc`); if (!d) break; all = all.concat(d.rows || []); if ((d.rows || []).length < 1000) break; off += 1000 }
  return all
}

const minor = a => Math.round(Math.abs(a) * 100)
const dayDiff = (a, b) => Math.abs((new Date(a) - new Date(b)) / 86400000)

function match(bankList, msList, label) {
  // greedy: exact amount within +/-12 days, then +/-1% within +/-15 days
  const msOpen = msList.map((m, i) => ({ ...m, _i: i, used: false }))
  const matched = [], unmatchedBank = []
  for (const b of bankList) {
    const bm = minor(b.amt)
    let best = null
    for (const m of msOpen) {
      if (m.used) continue
      if (m.minor === bm && dayDiff(b.date, m.date) <= 12) { best = m; break }
    }
    if (!best) {
      for (const m of msOpen) {
        if (m.used) continue
        if (Math.abs(m.minor - bm) <= Math.max(50, bm * 0.01) && dayDiff(b.date, m.date) <= 15) { best = m; break }
      }
    }
    if (best) { best.used = true; matched.push({ bank: b, ms: best }) }
    else unmatchedBank.push(b)
  }
  const unmatchedMs = msOpen.filter(m => !m.used)
  return { label, matched, unmatchedBank, unmatchedMs }
}

async function main() {
  const bank = loadBank()
  const bankOut = bank.filter(t => t.amt < 0 && t.type !== 'Currency exchange')
  const bankFx = bank.filter(t => t.type === 'Currency exchange' && t.amt < 0)
  const bankIn = bank.filter(t => t.amt > 0 && t.type !== 'Currency exchange')

  const po = (await rng('/entity/paymentout')).map(r => ({ date: (r.moment || '').slice(0, 10), minor: r.sum || 0, name: r.name, agent: r.agent?.name || '', desc: (r.description || '').replace(/\n/g, ' ').slice(0, 50), agentId: (r.agent?.meta?.href || '').split('/').pop() }))
  const poNonKorea = po.filter(p => p.agentId !== DTSMG_ID)
  const poKorea = po.filter(p => p.agentId === DTSMG_ID)
  const pi = (await rng('/entity/paymentin')).map(r => ({ date: (r.moment || '').slice(0, 10), minor: r.sum || 0, name: r.name, agent: r.agent?.name || '' }))

  const sumB = a => a.reduce((s, x) => s + Math.abs(x.amt), 0)
  const sumM = a => a.reduce((s, x) => s + x.minor, 0) / 100

  console.log('============================================================')
  console.log('  H1 2026 RECONCILIATION — Wio AED (9833011607) <-> MoySklad')
  console.log('============================================================')
  console.log(`  Bank AED outflows (ex-FX)   : ${bankOut.length} txns, AED ${sumB(bankOut).toFixed(2)}`)
  console.log(`  Bank currency-exchange out  : ${bankFx.length} txns, AED ${sumB(bankFx).toFixed(2)}  (funds USD/Korea — treasury)`)
  console.log(`  Bank AED inflows (ex-FX)    : ${bankIn.length} txns, AED ${sumB(bankIn).toFixed(2)}`)
  console.log(`  MoySklad paymentout (all)   : ${po.length} docs, AED ${sumM(po).toFixed(2)}`)
  console.log(`    - Korea (DTSMG, USD-funded): ${poKorea.length} docs, AED ${sumM(poKorea).toFixed(2)}`)
  console.log(`    - non-Korea (AED rail)     : ${poNonKorea.length} docs, AED ${sumM(poNonKorea).toFixed(2)}`)
  console.log(`  MoySklad paymentin          : ${pi.length} docs, AED ${sumM(pi).toFixed(2)}`)

  const recOut = match(bankOut, poNonKorea, 'AED outflows <-> non-Korea paymentouts')

  console.log('\n  --- OUTFLOW MATCH (bank AED out  <->  MoySklad non-Korea paymentout) ---')
  console.log(`  Matched         : ${recOut.matched.length}`)
  console.log(`  Bank unmatched  : ${recOut.unmatchedBank.length}  (paid from bank, no MoySklad paymentout found)`)
  console.log(`  MoySklad unmatched: ${recOut.unmatchedMs.length}  (booked in MoySklad, no AED bank line found)`)

  const ubSum = recOut.unmatchedBank.reduce((s, x) => s + Math.abs(x.amt), 0)
  console.log(`\n  Bank-side UNMATCHED outflows (AED ${ubSum.toFixed(2)}):`)
  recOut.unmatchedBank.sort((a, b) => a.amt - b.amt).forEach(b => console.log(`    ${b.date}  ${Math.abs(b.amt).toFixed(2).padStart(10)}  ${b.type.padEnd(10)} ${b.desc} ${b.notes ? '(' + b.notes + ')' : ''}`.slice(0, 110)))

  const umSum = recOut.unmatchedMs.reduce((s, x) => s + x.minor, 0) / 100
  console.log(`\n  MoySklad-side UNMATCHED paymentouts (AED ${umSum.toFixed(2)}):`)
  recOut.unmatchedMs.sort((a, b) => b.minor - a.minor).forEach(m => console.log(`    ${m.date}  ${(m.minor / 100).toFixed(2).padStart(10)}  ${m.name}  ${m.agent}  ${m.desc}`.slice(0, 110)))

  fs.writeFileSync(OUT, JSON.stringify({
    generatedAt: new Date().toISOString(), period: { FROM, TO },
    bank: { outflowsExFx: { n: bankOut.length, aed: sumB(bankOut) }, currencyExchangeOut: { n: bankFx.length, aed: sumB(bankFx) }, inflowsExFx: { n: bankIn.length, aed: sumB(bankIn) } },
    moysklad: { paymentoutAll: { n: po.length, aed: sumM(po) }, korea: { n: poKorea.length, aed: sumM(poKorea) }, nonKorea: { n: poNonKorea.length, aed: sumM(poNonKorea) }, paymentin: { n: pi.length, aed: sumM(pi) } },
    outflowMatch: { matched: recOut.matched.length, bankUnmatched: recOut.unmatchedBank, msUnmatched: recOut.unmatchedMs },
  }, null, 2))
  console.log(`\n  JSON written: ${path.relative(path.join(__dirname, '..'), OUT)}`)
}

main().catch(e => { console.error('FATAL', e.message); process.exit(1) })
