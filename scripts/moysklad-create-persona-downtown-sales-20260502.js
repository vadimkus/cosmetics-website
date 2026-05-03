#!/usr/bin/env node

/**
 * Create MoySklad documents for Persona Downtown / First Person Ladies Salon
 * (Downtown):
 *
 * 1. Received commissioner report for sold items.
 * 2. Shipment (demand) for the requested replenishment items only.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-create-persona-downtown-sales-20260502.js
 *   node scripts/moysklad-create-persona-downtown-sales-20260502.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const COMMON = {
  date: '2026-05-02',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738', // Genosys Middle East FZ-LLC
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a', // Genosys Warehouse
  agentId: '19f661fb-b43b-11ee-0a80-0d3b00075ace', // First Person Ladies Salon (Downtown)
  contractId: '2092d415-b43b-11ee-0a80-095a000715c8', // Contract 00077
}

const REPORT = {
  moment: '2026-05-02 16:55:00',
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  marker: 'Persona Downtown sales report 2026-05-02',
  lines: [
    ['00144', 1], // Skin Caring Blemish Balm Cushion #2 Beige
    ['00051', 2], // HR3 Matrix Hair Tonic 70ml
    ['00052', 1], // HR3 Matrix Scalp & Hair Shampoo 300ml
  ],
}

const DEMAND = {
  moment: '2026-05-02 16:58:00',
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: 'Persona Downtown shipment 2026-05-02',
  lines: [
    ['00051', 2], // HR3 Matrix Hair Tonic 70ml
    ['00052', 1], // HR3 Matrix Scalp & Hair Shampoo 300ml
  ],
}

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1000)}`)
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
      stock: Number(row.stock || 0),
      reserve: Number(row.reserve || 0),
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function resolveLines(stock, lines, { checkStock }) {
  return lines.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item) throw new Error(`Product code not found in stock report: ${code}`)
    if (!item.id) throw new Error(`Product ID missing for code: ${code}`)
    if (checkStock && item.available < qty) {
      throw new Error(`Insufficient stock for ${code} ${item.name}: need ${qty}, available ${item.available}`)
    }
    return { ...item, qty }
  })
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

function printLines(title, resolved) {
  const totalMinor = resolved.reduce((sum, line) => sum + line.qty * line.price, 0)
  const totalQty = resolved.reduce((sum, line) => sum + line.qty, 0)

  console.log()
  console.log(title)
  console.log('  ' + '-'.repeat(114))
  console.log(`  ${'Code'.padEnd(6)} | ${'Product'.padEnd(62)} | ${'Qty'.padStart(4)} | ${'Unit'.padStart(9)} | ${'Line'.padStart(10)} | ${'Avail'.padStart(6)}`)
  console.log('  ' + '-'.repeat(114))
  for (const line of resolved) {
    console.log(
      `  ${line.code.padEnd(6)} | ${line.name.slice(0, 62).padEnd(62)} | ${String(line.qty).padStart(4)} | ${money(line.price).padStart(9)} | ${money(line.price * line.qty).padStart(10)} | ${String(line.available).padStart(6)}`
    )
  }
  console.log('  ' + '-'.repeat(114))
  console.log(`  Total qty: ${totalQty} | Total incl. VAT: ${money(totalMinor)} AED | VAT: ${money(totalMinor - totalMinor / 1.05)} AED`)
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

async function createReport(resolved) {
  const payload = {
    moment: REPORT.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    state: stateHref('commissionreportin', REPORT.stateNotPaidId),
    commissionPeriodStart: REPORT.moment,
    commissionPeriodEnd: REPORT.moment,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      REPORT.marker,
      'Customer: First Person Ladies Salon (Downtown) / Persona Downtown',
      'Contract: 00077',
      'Sales report lines include cushion + HR3 hair items.',
    ].join('\n'),
    positions: positions(resolved, { reward: 0 }),
  }

  const created = await api('POST', '/entity/commissionreportin', payload)
  const readbackPositions = await fetchAll(`/entity/commissionreportin/${created.id}/positions`)
  return { ...created, positionsCount: readbackPositions.length }
}

async function createDemand(resolved, report) {
  const payload = {
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
      'Customer: First Person Ladies Salon (Downtown) / Persona Downtown',
      'Contract: 00077',
      `Created after sales report ${report.name}.`,
      'Shipment contains HR3 Matrix Hair Tonic x2 and Scalp & Hair Shampoo x1 only.',
    ].join('\n'),
    positions: positions(resolved),
  }

  const created = await api('POST', '/entity/demand', payload)
  const readbackPositions = await fetchAll(`/entity/demand/${created.id}/positions`)
  return { ...created, positionsCount: readbackPositions.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad Persona Downtown sales report + shipment')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Counterparty: ${agent.name} (${agent.id})`)
  console.log(`  Contract    : ${contract.name} (${contract.id})`)

  await ensureNoDuplicate('commissionreportin', REPORT.marker)
  await ensureNoDuplicate('demand', DEMAND.marker)

  const stock = await fetchStockByCode()
  const reportLines = resolveLines(stock, REPORT.lines, { checkStock: false })
  const demandLines = resolveLines(stock, DEMAND.lines, { checkStock: true })

  printLines('  Received commissioner report lines (sales)', reportLines)
  printLines('  Shipment lines (stock movement)', demandLines)

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit to create both live documents.')
    return
  }

  console.log()
  console.log('  Posting received commissioner report...')
  const report = await createReport(reportLines)
  console.log(`    Created report: ${report.name} | ${money(report.sum)} AED | lines=${report.positionsCount}`)
  console.log(`    UI: https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  console.log()
  console.log('  Posting shipment...')
  const demand = await createDemand(demandLines, report)
  console.log(`    Created demand: ${demand.name} | ${money(demand.sum)} AED | lines=${demand.positionsCount}`)
  console.log(`    UI: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
