#!/usr/bin/env node

/**
 * Read-only Tatiana Aniskina consignment audit.
 *   node --import dotenv/config scripts/inspect-tatiana-aniskina-consignment-20260824.js
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const AGENT = '603f398e-bd3d-11eb-0a80-00570009cb13'
const CONTRACT = 'f68e2d8d-c3c5-11eb-0a80-05f500276179'

async function api(pathStr, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 700 * attempt))
      return api(pathStr, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} ${text.slice(0, 400)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 6 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET' || e.cause?.code === 'ETIMEDOUT')) {
      await new Promise((r) => setTimeout(r, 1200 * attempt))
      return api(pathStr, attempt + 1)
    }
    throw e
  }
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api(`${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
    await new Promise((r) => setTimeout(r, 80))
  }
  return rows
}

function cid(doc) {
  return (doc.contract?.meta?.href || '').split('/').pop() || ''
}
function onC(doc) {
  return cid(doc) === CONTRACT
}
function money(n) {
  return ((n || 0) / 100).toFixed(2)
}

async function add(ledger, type, id, sign) {
  const pos = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
  for (const p of pos) {
    const code = p.assortment?.code
    if (!code) continue
    const cur = ledger.get(code) || { name: p.assortment.name, qty: 0, inn: 0, sold: 0, ret: 0 }
    cur.qty += Number(p.quantity) * sign
    if (sign > 0) cur.inn += Number(p.quantity)
    if (type === 'commissionreportin') cur.sold += Number(p.quantity)
    if (type === 'salesreturn') cur.ret += Number(p.quantity)
    cur.name = p.assortment.name
    ledger.set(code, cur)
  }
  return pos
}

async function main() {
  const filter = encodeURIComponent(`agent=${API}/entity/counterparty/${AGENT}`)
  const [agent, contract, demands, reports, returns, invoices] = await Promise.all([
    api(`/entity/counterparty/${AGENT}`),
    api(`/entity/contract/${CONTRACT}`),
    fetchAll(`/entity/demand?filter=${filter}&order=moment,asc&expand=contract`),
    fetchAll(`/entity/commissionreportin?filter=${filter}&order=moment,asc&expand=contract,state`),
    fetchAll(`/entity/salesreturn?filter=${filter}&order=moment,asc&expand=contract`),
    fetchAll(`/entity/invoiceout?filter=${filter}&order=moment,asc&expand=contract`),
  ])

  console.log(`${agent.name} | agr ${contract.name} ${contract.contractType || ''}`)
  console.log(
    `demands ${demands.length} on=${demands.filter(onC).length} off=${demands.filter((d) => !onC(d)).length}`,
  )
  console.log(
    `reports ${reports.length} on=${reports.filter(onC).length} off=${reports.filter((d) => !onC(d)).length}`,
  )
  console.log(
    `returns ${returns.length} on=${returns.filter(onC).length} off=${returns.filter((d) => !onC(d)).length}`,
  )
  console.log(
    `invoices ${invoices.length} on=${invoices.filter(onC).length} off=${invoices.filter((d) => !onC(d)).length}`,
  )

  console.log('\n=== COMMISSION REPORTS ===')
  for (const r of reports) {
    console.log(
      [r.name, r.moment.slice(0, 10), money(r.sum), 'paid', money(r.payedSum), onC(r) ? 'ON-C' : 'NO-C', r.state?.name || ''].join(
        ' | ',
      ),
    )
  }

  const off2025 = demands.filter((d) => d.moment >= '2025-01-01' && !onC(d))
  console.log('\n=== 2025-2026 OFF-CONTRACT DEMANDS ===')
  for (const d of off2025) {
    console.log([d.name, d.moment.slice(0, 10), money(d.sum), 'paid', money(d.payedSum), d.id].join(' | '))
  }

  console.log('\n=== 2025-2026 INVOICES ===')
  for (const r of invoices.filter((d) => d.moment >= '2025-01-01')) {
    console.log(
      [r.name, r.moment.slice(0, 10), money(r.sum), 'paid', money(r.payedSum), onC(r) ? 'ON-C' : 'NO-C'].join(' | '),
    )
  }

  console.log('\n=== BOOK LEDGER (on-contract) ===')
  const ledger = new Map()
  for (const d of demands.filter(onC)) await add(ledger, 'demand', d.id, 1)
  for (const r of reports.filter(onC)) await add(ledger, 'commissionreportin', r.id, -1)
  for (const r of returns.filter(onC)) await add(ledger, 'salesreturn', r.id, -1)

  const positive = [...ledger.entries()].filter(([, r]) => r.qty > 0).sort((a, b) => a[0].localeCompare(b[0]))
  const negative = [...ledger.entries()].filter(([, r]) => r.qty < 0)
  let units = 0
  for (const [code, row] of positive) {
    units += row.qty
    console.log(`  ${code}  book ${row.qty}  in ${row.inn}  sold ${row.sold}  ret ${row.ret}  ${row.name}`)
  }
  console.log(`Total book units: ${units} across ${positive.length} SKUs`)
  if (negative.length) {
    console.log('NEGATIVE:')
    for (const [code, row] of negative) console.log(`  ${code}  ${row.qty}  ${row.name}`)
  }

  console.log('\n=== 2026 REPORT LINES ===')
  for (const r of reports.filter((d) => d.moment >= '2026-01-01')) {
    const pos = await fetchAll(`/entity/commissionreportin/${r.id}/positions?expand=assortment`)
    console.log(`REPORT ${r.name} ${r.moment.slice(0, 10)} ${money(r.sum)} ${onC(r) ? 'ON-C' : 'NO-C'}`)
    for (const p of pos) console.log(`   ${p.assortment?.code} ${p.assortment?.name} x${p.quantity} @ ${p.price / 100}`)
  }

  console.log('\n=== 2026 ON-CONTRACT DEMAND LINES ===')
  for (const d of demands.filter((x) => x.moment >= '2026-01-01' && onC(x))) {
    const pos = await fetchAll(`/entity/demand/${d.id}/positions?expand=assortment`)
    console.log(`DEMAND ${d.name} ${d.moment.slice(0, 10)} ${money(d.sum)}`)
    for (const p of pos) console.log(`   ${p.assortment?.code} ${p.assortment?.name} x${p.quantity} @ ${p.price / 100}`)
  }

  console.log('\n=== 2026 OFF-CONTRACT DEMAND LINES ===')
  for (const d of demands.filter((x) => x.moment >= '2026-01-01' && !onC(x))) {
    const pos = await fetchAll(`/entity/demand/${d.id}/positions?expand=assortment`)
    console.log(`DEMAND ${d.name} ${d.moment.slice(0, 10)} ${money(d.sum)} paid ${money(d.payedSum)}`)
    for (const p of pos) console.log(`   ${p.assortment?.code} ${p.assortment?.name} x${p.quantity} @ ${p.price / 100}`)
  }

  const pays = await fetchAll(`/entity/paymentin?filter=${filter}&order=moment,desc`)
  console.log('\n=== LAST 10 PAYMENTIN ===')
  for (const r of pays.slice(0, 10)) {
    console.log([r.name, r.moment.slice(0, 10), money(r.sum), (r.description || '').replace(/\s+/g, ' ').slice(0, 90)].join(' | '))
  }
  const pay0 = pays.find((p) => p.sum === 0 || p.name === '06118')
  if (pay0) {
    const full = await api(`/entity/paymentin/${pay0.id}`)
    console.log('\nZERO/06118 PAYMENTIN', full.name, full.moment, full.sum, full.applicable, full.description)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
