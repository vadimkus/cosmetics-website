#!/usr/bin/env node

/**
 * Love My Body — consignment Отгрузка (agr. 27).
 * All report 01367 lines ×2 (replenishment after May 2026 sales report).
 *
 *   node --import dotenv/config scripts/moysklad-create-love-my-body-consignment-demand-20260602.js
 *   node --import dotenv/config scripts/moysklad-create-love-my-body-consignment-demand-20260602.js --commit
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

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: '9c78fe86-be3b-11f0-0a80-007f0036b570',
  contractId: 'aaee7975-be3b-11f0-0a80-173e00383194',
  date: uaeToday(),
  reportId: '4c0e3e04-5e2a-11f1-0a80-147f000cdc74',
  reportName: '01367',
}

const DEMAND = {
  moment: uaeMomentNow(),
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Love My Body shipment 2x report ${uaeToday()}`,
}

/** Report 01367 quantities ×2 */
const LINES = [
  ['00053', 6],
  ['00012', 14],
  ['00054', 4],
  ['00063', 4],
  ['00055', 2],
  ['00031', 2],
  ['54458', 2],
  ['00144', 2],
  ['00041', 2],
  ['00140', 8],
  ['54472', 2],
  ['00195', 2],
  ['54457', 2],
  ['54461', 2],
  ['00129', 2],
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=${limit}&offset=${offset}`)
    const batch = data?.rows || []
    rows.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return rows
}

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
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
      stock: Number(row.stock || 0),
      reserve: Number(row.reserve || 0),
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
    available: 999,
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
      throw new Error(`Insufficient stock for ${code} ${item.name}: need ${qty}, available ${item.available}`)
    }
    resolved.push({ ...item, qty })
  }
  return resolved
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${COMMON.agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
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
  console.log('  Love My Body — Отгрузка 2× report 01367 (agr. 27)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${COMMON.agentId}`),
    api('GET', `/entity/contract/${COMMON.contractId}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)
  console.log(`  After report: ${COMMON.reportName}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = await resolveLines(stock)
  const totalMinor = resolved.reduce((s, l) => s + l.qty * l.price, 0)
  const totalQty = resolved.reduce((s, l) => s + l.qty, 0)

  console.log('\n  Shipment lines (2× report quantities):')
  for (const line of resolved) {
    console.log(
      `    ${line.code} ${line.name.slice(0, 50)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)} (avail ${line.available})`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} units | ${resolved.length} lines`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const demand = await api('POST', '/entity/demand', {
    moment: DEMAND.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    store: href('store', COMMON.storeId),
    state: stateHref('demand', DEMAND.stateShippedId),
    description: [
      DEMAND.marker,
      'LOVE MY BODY LADIES SPA CLUB L.L.C | Agreement 27.',
      `Replenishment after commissioner report ${COMMON.reportName}.`,
      'All report lines at double quantity (2× sold qty).',
    ].join('\n'),
    positions: positions(resolved),
  })

  const readback = await fetchAll(`/entity/demand/${demand.id}/positions`)
  console.log(`\n  Shipment: ${demand.name} | ${money(demand.sum)} AED | ${readback.length} lines`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
