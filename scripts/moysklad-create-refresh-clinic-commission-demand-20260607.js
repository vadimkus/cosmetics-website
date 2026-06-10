#!/usr/bin/env node

/**
 * Refresh Clinic — May sold-items commission report + replenishment shipment.
 *
 * Report lines come from the user screenshot "Sold products for May. 07.06.2026".
 * Shipment uses the same product set, with replenishment overrides:
 *   Beige cushion #2 = 5 pcs
 *   Camel cushion #3 = 3 pcs
 *
 *   node --import dotenv/config scripts/moysklad-create-refresh-clinic-commission-demand-20260607.js
 *   node --import dotenv/config scripts/moysklad-create-refresh-clinic-commission-demand-20260607.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const COMMON = {
  date: uaeToday(),
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738', // Genosys Middle East FZ-LLC
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a', // Genosys Warehouse
  agentId: 'a6e52a6a-a2d6-11f0-0a80-03b9004ee0de', // REFRESH BIOHACKING CLINIC L.L.C
  contractId: 'dc3ad805-a2d6-11f0-0a80-0d1c0051970b', // Agreement 24
  commissionPeriodStart: '2026-05-01 00:00:00',
  commissionPeriodEnd: '2026-05-31 23:59:59',
}

const REPORT = {
  moment: uaeMomentNow(),
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  marker: `Refresh Clinic May sold items commission report ${uaeToday()}`,
}

const DEMAND = {
  moment: uaeMomentAddMinutes(3),
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Refresh Clinic May replenishment shipment beige5 camel3 ${uaeToday()}`,
}

/** Report: [code, qty] from screenshot sold quantities */
const REPORT_LINES = [
  ['00145', 1], // Problem Control Toner 200ml
  ['00144', 2], // Skin Caring Blemish Balm Cushion #2 Beige
  ['00021', 1], // Snow O2 Cleanser 180ml
  ['54464', 1], // Skin Caring Blemish Balm Cushion #3 Camel
  ['54457', 1], // Ultra Shield Sun Cream SPF50/PA++++ 50g
  ['00031', 1], // Intensive Hydro Soothing Cream 50g
  ['54467', 2], // Skin Reboot PDRN mask Pack
  ['00063', 2], // Intensive Repair Collagen Mask 23g
]

/** Shipment: same product set, but replenishment quantities for beige/camel */
const DEMAND_LINES = [
  ['00145', 1], // Problem Control Toner 200ml
  ['00144', 5], // Beige cushion #2 replenishment
  ['00021', 1], // Snow O2 Cleanser 180ml
  ['54464', 3], // Camel cushion #3 replenishment
  ['54457', 1], // Ultra Shield Sun Cream SPF50/PA++++ 50g
  ['00031', 1], // Intensive Hydro Soothing Cream 50g
  ['54467', 2], // Skin Reboot PDRN mask Pack
  ['00063', 2], // Intensive Repair Collagen Mask 23g
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
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
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
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
    available: null,
    price: Number(product.salePrices?.[0]?.value || 0),
  }
}

async function resolveLines(stock, lines, { checkStock }) {
  const resolved = []
  for (const [code, qty] of lines) {
    let item = stock.get(code)
    if (!item?.id) item = await fetchProductByCode(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code} ${item.name}`)
    if (checkStock && item.available != null && item.available < qty) {
      throw new Error(`Insufficient stock ${code} ${item.name}: need ${qty}, have ${item.available}`)
    }
    resolved.push({ ...item, qty })
  }
  return resolved
}

async function ensureNoDuplicate(entityType, marker) {
  const filter = [
    `agent=${API}/entity/counterparty/${COMMON.agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entityType}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((doc) => (doc.description || '').includes(marker))
  if (dup) {
    throw new Error(`Duplicate protection: ${entityType} already exists today (${dup.name}, id=${dup.id})`)
  }
}

function positions(resolved, extra = {}) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    ...extra,
  }))
}

function printLines(title, resolved) {
  const totalMinor = resolved.reduce((sum, line) => sum + line.qty * line.price, 0)
  const totalQty = resolved.reduce((sum, line) => sum + line.qty, 0)

  console.log(`\n  ${title}`)
  for (const line of resolved) {
    const available = line.available == null ? 'n/a' : String(line.available)
    console.log(
      `    ${line.code} ${line.name.slice(0, 56)} x${line.qty} @ ${money(line.price)} = ${money(line.qty * line.price)} AED | avail ${available}`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} units | ${resolved.length} lines`)
}

async function createReport(resolved) {
  const created = await api('POST', '/entity/commissionreportin', {
    moment: REPORT.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    state: stateHref('commissionreportin', REPORT.stateNotPaidId),
    commissionPeriodStart: COMMON.commissionPeriodStart,
    commissionPeriodEnd: COMMON.commissionPeriodEnd,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      REPORT.marker,
      'REFRESH BIOHACKING CLINIC L.L.C | Agreement 24.',
      'May 2026 sold-products report from user screenshot dated 07.06.2026.',
      'Report uses screenshot sold quantities: beige x2, camel x1.',
    ].join('\n'),
    positions: positions(resolved, { reward: 0 }),
  })
  const readback = await fetchAll(`/entity/commissionreportin/${created.id}/positions`)
  return { ...created, positionsCount: readback.length }
}

async function createDemand(resolved, report) {
  const created = await api('POST', '/entity/demand', {
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
      'REFRESH BIOHACKING CLINIC L.L.C | Agreement 24.',
      `Created after received commissioner report ${report.name}.`,
      'Shipment uses same product set as May report, with replenishment override: beige cushion #2 x5, camel cushion #3 x3.',
    ].join('\n'),
    positions: positions(resolved),
  })
  const readback = await fetchAll(`/entity/demand/${created.id}/positions`)
  return { ...created, positionsCount: readback.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Refresh Clinic — commission report + replenishment shipment')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${COMMON.agentId}`),
    api('GET', `/entity/contract/${COMMON.contractId}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name} (${contract.id})`)
  console.log(`  Period  : ${COMMON.commissionPeriodStart} → ${COMMON.commissionPeriodEnd}`)

  await ensureNoDuplicate('commissionreportin', REPORT.marker)
  await ensureNoDuplicate('demand', DEMAND.marker)

  const stock = await fetchStockByCode()
  const reportLines = await resolveLines(stock, REPORT_LINES, { checkStock: false })
  const demandLines = await resolveLines(stock, DEMAND_LINES, { checkStock: true })

  printLines('Received commissioner report lines (sold May screenshot)', reportLines)
  printLines('Shipment lines (same products; beige x5, camel x3)', demandLines)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  console.log('\n  Posting received commissioner report...')
  const report = await createReport(reportLines)
  console.log(`    Report: ${report.name} | ${money(report.sum)} AED | lines=${report.positionsCount}`)
  console.log(`    https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  console.log('\n  Posting shipment...')
  const demand = await createDemand(demandLines, report)
  console.log(`    Shipment: ${demand.name} | ${money(demand.sum)} AED | lines=${demand.positionsCount}`)
  console.log(`    https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
