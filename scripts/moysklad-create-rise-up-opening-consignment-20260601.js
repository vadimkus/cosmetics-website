#!/usr/bin/env node

/**
 * Rise UP — opening consignment Отгрузка under agreement 34.
 *
 *   node --import dotenv/config scripts/moysklad-create-rise-up-opening-consignment-20260601.js
 *   node --import dotenv/config scripts/moysklad-create-rise-up-opening-consignment-20260601.js --commit
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
  date: uaeToday(),
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: 'b83e0d80-5d8f-11f1-0a80-065d0075240c', // Rise UP
  contractId: 'c91330fa-5d90-11f1-0a80-1af00073b7c8', // Agreement 34
}

const DEMAND = {
  moment: uaeMomentNow(),
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Rise UP opening consignment shipment ${COMMON.date}`,
}

/** [code, qty] — clinic list salePrice from stock report */
const LINES = [
  ['00012', 5],
  ['00140', 10],
  ['00063', 10],
  ['00144', 3],
  ['00143', 3],
  ['54464', 3],
  ['00041', 4],
  ['54457', 4],
  ['00053', 4],
  ['00055', 2],
  ['00054', 2],
  ['00040', 2],
  ['00031', 2],
  ['00035', 2],
  ['54458', 2],
  ['00190', 2],
  ['00122', 2],
  ['54472', 2],
  ['54473', 2],
  ['00030', 2],
  ['00027', 2],
  ['00195', 2],
  ['00191', 2],
  ['00194', 2],
  ['00029', 2],
  ['00188', 6],
  ['00052', 2],
  ['00051', 2],
  ['00022', 2],
  ['00189', 2],
  ['00129', 2],
  ['00145', 2],
]

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
    `agent=${API}/entity/counterparty/${COMMON.agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(DEMAND.marker))
  if (dup) throw new Error(`Duplicate: demand ${dup.name} (${dup.id})`)
}

function resolveLines(stock) {
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

function printLines(resolved) {
  const totalMinor = resolved.reduce((s, l) => s + l.qty * l.price, 0)
  const totalQty = resolved.reduce((s, l) => s + l.qty, 0)
  console.log()
  console.log('  Lines (MoySklad salePrice, VAT incl.):')
  console.log('  ' + '-'.repeat(114))
  console.log(`  ${'Code'.padEnd(6)} | ${'Product'.padEnd(62)} | ${'Qty'.padStart(4)} | ${'Unit'.padStart(9)} | ${'Line'.padStart(10)} | ${'Avail'.padStart(6)}`)
  console.log('  ' + '-'.repeat(114))
  for (const line of resolved) {
    console.log(
      `  ${line.code.padEnd(6)} | ${line.name.slice(0, 62).padEnd(62)} | ${String(line.qty).padStart(4)} | ${money(line.price).padStart(9)} | ${money(line.price * line.qty).padStart(10)} | ${String(line.available).padStart(6)}`
    )
  }
  console.log('  ' + '-'.repeat(114))
  console.log(`  Total: ${totalQty} pcs | ${money(totalMinor)} AED | ${resolved.length} lines`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Rise UP — opening consignment Отгрузка (agreement 34)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Customer : ${agent.name}`)
  console.log(`  Contract : ${contract.name} (${contract.id})`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  printLines(resolved)

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
      'Rise UP opening consignment stock — Business Bay.',
      'Agreement 34. Clinic list (salePrice). 94 pcs / 28 lines per approved list.',
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  const pos = await fetchAll(`/entity/demand/${demand.id}/positions`)
  console.log(`\n  Shipment: ${demand.name} | ${money(demand.sum)} AED | ${pos.length} lines`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
