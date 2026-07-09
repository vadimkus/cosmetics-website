#!/usr/bin/env node

/**
 * GOCOSMO BEAUTY SALON — read-only consignment book stock (contract 13).
 * Use before physical stock recovery visit.
 *
 *   node --import dotenv/config scripts/moysklad-export-gocosmo-consignment-stock-20260620.js
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const AGENT_ID = '465093a9-8ae0-11ef-0a80-0b5e00108550'
const CONTRACT_ID = '4f49a970-8d22-11ef-0a80-157800079792'
const SINCE = '2024-01-01 00:00:00'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function api(pathStr) {
  await sleep(150)
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${text.slice(0, 400)}`)
  return text ? JSON.parse(text) : null
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
  }
  return rows
}

async function fetchPositions(metaHref) {
  return fetchAll(`${metaHref}/positions?expand=assortment`)
}

async function main() {
  const agentHref = `${API}/entity/counterparty/${AGENT_ID}`
  const contractHref = `${API}/entity/contract/${CONTRACT_ID}`
  const filter = encodeURIComponent(`agent=${agentHref};moment>=${SINCE}`)

  const agent = await api(`/entity/counterparty/${AGENT_ID}`)
  const demands = (await fetchAll(`/entity/demand?filter=${filter}`)).filter(
    (d) => d.contract?.meta?.href === contractHref
  )
  const reports = await fetchAll(`/entity/commissionreportin?filter=${filter}`)
  const returns = await fetchAll(`/entity/salesreturn?filter=${filter}`)

  const bal = new Map()
  const add = (code, name, qty, priceMinor) => {
    if (!code) return
    const x = bal.get(code) || { code, name, qty: 0, price: priceMinor || 0 }
    x.qty += qty
    if (priceMinor) x.price = priceMinor
    bal.set(code, x)
  }

  for (const d of demands) {
    for (const p of await fetchPositions(d.meta.href)) {
      add(p.assortment?.code, p.assortment?.name, p.quantity, p.price)
    }
  }
  for (const r of reports) {
    for (const p of await fetchPositions(r.meta.href)) {
      add(p.assortment?.code, p.assortment?.name, -p.quantity, p.price)
    }
  }
  for (const r of returns) {
    for (const p of await fetchPositions(r.meta.href)) {
      add(p.assortment?.code, p.assortment?.name, -p.quantity, p.price)
    }
  }

  const rows = [...bal.values()]
    .filter((x) => Math.abs(x.qty) > 0.001)
    .sort((a, b) => b.qty * (b.price / 100) - a.qty * (a.price / 100))

  let totalList = 0
  let totalPcs = 0

  console.log('====================================================================')
  console.log('  GOCOSMO BEAUTY SALON — consignment book stock (contract 13)')
  console.log('====================================================================')
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Phone:    ${agent.phone || '—'}`)
  console.log(`  Shipments: ${demands.length} | Reports: ${reports.length}`)
  console.log('')
  console.log('  Code     Qty    Unit AED   Line AED   Product')
  console.log('  ' + '-'.repeat(72))

  for (const r of rows) {
    const line = r.qty * (r.price / 100)
    totalList += line
    totalPcs += r.qty
    console.log(
      `  ${String(r.code).padEnd(8)} ${String(r.qty).padStart(4)}   ${(r.price / 100).toFixed(2).padStart(8)}   ${line.toFixed(2).padStart(9)}   ${(r.name || '').slice(0, 42)}`
    )
  }

  console.log('  ' + '-'.repeat(72))
  console.log(`  SKUs: ${rows.length} | Pcs: ${totalPcs} | List value: ${totalList.toFixed(2)} AED`)
  console.log('  Unpaid report 01253: 5,000.00 AED (verify bank before visit)')
  console.log(`  Combined: ${(totalList + 5000).toFixed(2)} AED`)
  console.log('')
  console.log('  Physical count tomorrow — tick actual qty vs book qty above.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
