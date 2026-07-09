#!/usr/bin/env node

/**
 * Cosmiden / Myline — consignment replenishment Отгрузка (agreement 15).
 * Same lines as commission report 01389 (stock sheet 30.06.2026 sold qty).
 *
 *   00190 Anti-Wrinkle Cream 50g ×1
 *   00035 Problem Control Cream 50g ×1
 *   00144 Cushion #2 Beige ×1
 *   54464 Cushion #3 Camel ×1
 *   00063 Collagen mask 23g ×13
 *   00140 Sea algae mask 23g ×16
 *   54457 Ultra Shield SPF50 ×1
 *   00038 Post Cream 20g ×1
 *
 *   node --import dotenv/config scripts/moysklad-create-cosmiden-consignment-demand-20260701.js
 *   node --import dotenv/config scripts/moysklad-create-cosmiden-consignment-demand-20260701.js --commit
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
  agentId: 'd7b0a67f-d5a2-11ef-0a80-16cd0019b6b8', // COSMIDEN MEDICAL CENTER L.L.C
  contractId: '69b01872-d7dd-11ef-0a80-0725003ffada', // Agreement 15
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  moment: uaeMomentNow(),
  date: uaeToday(),
  marker: `Cosmiden Myline consignment replenishment agreement 15 ${uaeToday()}`,
}

/** [code, qty] @ clinic salePrice */
const LINES = [
  ['00190', 1],
  ['00035', 1],
  ['00144', 1],
  ['54464', 1],
  ['00063', 13],
  ['00140', 16],
  ['54457', 1],
  ['00038', 1],
]

const EXPECTED_TOTAL_AED = 1339

async function api(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(path) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const data = await api('GET', `${path}${sep}limit=${limit}&offset=${offset}`)
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
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${DEMAND.agentId}`,
    `moment>=${DEMAND.date} 00:00:00`,
    `moment<=${DEMAND.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((doc) => (doc.description || '').includes(DEMAND.marker))
  if (dup) throw new Error(`Duplicate: demand ${dup.name} (${dup.id})`)
}

function resolveLines(stock) {
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code} ${item.name}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
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
  console.log('  Cosmiden / Myline — consignment Отгрузка (agreement 15)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${DEMAND.agentId}`),
    api('GET', `/entity/contract/${DEMAND.contractId}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  const totalMinor = resolved.reduce((s, l) => s + l.qty * l.price, 0)
  const totalQty = resolved.reduce((s, l) => s + l.qty, 0)

  console.log('\n  Lines (clinic salePrice VAT incl.):')
  for (const line of resolved) {
    console.log(`    ${line.code} ${line.name.slice(0, 55)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`)
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} pcs | ${resolved.length} lines`)

  if (Math.abs(totalMinor - EXPECTED_TOTAL_AED * 100) > 2) {
    throw new Error(`Total mismatch: ${money(totalMinor)} vs ${EXPECTED_TOTAL_AED}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

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
      'COSMIDEN / Myline / Mylene — Agreement 15.',
      'Replenishment matching report 01389 / stock sheet 30.06.2026 sold qty.',
      'Camel cushion → 54464. Masks sheet 16g → MoySklad 23g (00063, 00140).',
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
