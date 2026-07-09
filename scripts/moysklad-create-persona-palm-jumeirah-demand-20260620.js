#!/usr/bin/env node

/**
 * Persona Palm Jumeirah — consignment replenishment отгрузка (Agreement 00078).
 * Based on May 2026 report 01365 velocity; last shipment 06261 on 2026-06-01.
 *
 *   node --import dotenv/config scripts/moysklad-create-persona-palm-jumeirah-demand-20260620.js
 *   node --import dotenv/config scripts/moysklad-create-persona-palm-jumeirah-demand-20260620.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const DEMAND = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: 'fd850df7-1cff-11ef-0a80-082e0017fa70', // First Person Ladies Salon LLC (Palm Jumeirah)
  contractId: '393d4076-1d00-11ef-0a80-028700179a4e', // 00078
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  moment: uaeMomentNow(),
  date: uaeToday(),
  marker: `Persona Palm Jumeirah replenishment Jun velocity ${uaeToday()}`,
}

/** ~1 month cover on May fast movers; skip slow one-offs (PDRN, hair box, EGF, Revita, EPI) */
const LINES = [
  ['00063', 12], // Collagen mask — 11/mo May
  ['00140', 10], // Sea algae — 10/mo
  ['00053', 6], // Eye patches — top AED seller
  ['00144', 6], // Cushion beige — 8/mo
  ['00052', 6], // HR shampoo — 6/mo
  ['00051', 5], // HR tonic — 5/mo
  ['00188', 3], // Mist
  ['54457', 4], // SPF50 — summer bump
  ['54464', 3], // Cushion camel — 4/mo May
  ['00012', 10], // Peptide gel mask — repeat Jun replenishment
  ['00021', 3], // Snow O₂ cleanser
  ['00022', 2], // Snow Booster toner
]

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    const id = row.meta?.href?.split('/').pop()?.split('?')[0]
    stock.set(row.code, {
      id,
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function fetchProductByCode(code) {
  const data = await api('GET', `/entity/product?filter=${encodeURIComponent(`code=${code}`)}&limit=1`)
  const product = data?.rows?.[0]
  if (!product) return null
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    available: 9999,
    price: Number(product.salePrices?.[0]?.value || 0),
  }
}

async function resolveLines(stock) {
  const resolved = []
  for (const [code, qty] of LINES) {
    let item = stock.get(code)
    if (!item?.id) item = await fetchProductByCode(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    resolved.push({ ...item, qty })
  }
  return resolved
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${DEMAND.agentId}`,
    `moment>=${DEMAND.date} 00:00:00`,
    `moment<=${DEMAND.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(DEMAND.marker))
  if (dup) throw new Error(`Duplicate: demand ${dup.name} (${dup.id})`)
}

function positions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))
}

async function main() {
  console.log('====================================================================')
  console.log('  Persona Palm Jumeirah — consignment replenishment (00078)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${DEMAND.agentId}`),
    api('GET', `/entity/contract/${DEMAND.contractId}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const stock = await fetchStockByCode()
  const resolved = await resolveLines(stock)
  const totalMinor = resolved.reduce((s, l) => s + l.qty * l.price, 0)

  console.log('\n  Lines:')
  for (const line of resolved) {
    console.log(
      `    ${line.code} ${line.name.slice(0, 50)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`
    )
  }
  console.log(
    `\n  Total: ${money(totalMinor)} AED | ${resolved.reduce((s, l) => s + l.qty, 0)} units | ${resolved.length} lines`
  )

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const created = await api('POST', '/entity/demand', {
    moment: DEMAND.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', DEMAND.organizationId),
    agent: href('counterparty', DEMAND.agentId),
    contract: href('contract', DEMAND.contractId),
    store: href('store', DEMAND.storeId),
    state: stateHref('demand', DEMAND.stateShippedId),
    description: [
      DEMAND.marker,
      'First Person Ladies Salon LLC (Palm Jumeirah) | Agreement 00078.',
      'Jun replenishment from May report 01365 velocity; fast movers + SPF summer.',
    ].join('\n'),
    positions: positions(resolved),
  })

  console.log(`\n  Shipment: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
