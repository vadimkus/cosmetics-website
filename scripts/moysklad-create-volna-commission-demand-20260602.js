#!/usr/bin/env node

/**
 * Salon Volna — commissioner report + consignment Отгрузка (contract 19).
 * Shipment = report lines + EyeCell Eye Zone Care Kit (00059) ×1.
 *
 *   node --import dotenv/config scripts/moysklad-create-volna-commission-demand-20260602.js
 *   node --import dotenv/config scripts/moysklad-create-volna-commission-demand-20260602.js --commit
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
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: 'aeaaf63a-2985-11f0-0a80-0dfc0049a5f1', // Volna Beauty Salon L.L.C
  contractId: '40556e6d-2986-11f0-0a80-03d10049fb5c', // Contract 19
  date: uaeToday(),
  commissionPeriodStart: '2026-05-01 00:00:00',
  commissionPeriodEnd: '2026-05-31 23:59:59',
}

const REPORT = {
  moment: uaeMomentNow(),
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  marker: `Volna Beauty Salon consignment sales ${uaeToday()}`,
}

const DEMAND = {
  moment: uaeMomentAddMinutes(3),
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Volna Beauty Salon shipment ${uaeToday()}`,
}

/** Sold items — Hyaluron Cream 50g (54458); user sheet says 50ml */
const REPORT_LINES = [
  ['54457', 2], // Ultra Shield SPF50 50g
  ['54458', 2], // Moisture Replenishing Hyaluron Cream 50g
  ['00055', 1], // EyeCell Eye Contour Cream 20ml
  ['00012', 2], // Peptide Gel Mask 39g
  ['00063', 3], // Collagen Mask 23g
  ['00140', 3], // Sea Algae Mask 23g
  ['54472', 1], // Revita Glow BB #01 Bright 50g
]

const DEMAND_EXTRA = [['00059', 1]] // EyeCell Eye Zone Care Kit (box)

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

async function resolveLines(stock, lines, { checkStock }) {
  const resolved = []
  for (const [code, qty] of lines) {
    let item = stock.get(code)
    if (!item?.id) item = await fetchProductByCode(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (checkStock && item.available < qty) {
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
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate ${entityType}: ${dup.name} (${dup.id})`)
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
  const totalMinor = resolved.reduce((s, l) => s + l.qty * l.price, 0)
  console.log(`\n${title}`)
  for (const line of resolved) {
    console.log(`    ${line.code} ${line.name.slice(0, 55)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`)
  }
  console.log(`  → ${money(totalMinor)} AED | ${resolved.reduce((s, l) => s + l.qty, 0)} units | ${resolved.length} lines`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Salon Volna — отчет комиссионера + отгрузка (contract 19)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${COMMON.agentId}`),
    api('GET', `/entity/contract/${COMMON.contractId}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const stock = await fetchStockByCode()
  const reportResolved = await resolveLines(stock, REPORT_LINES, { checkStock: false })
  const demandLines = [...REPORT_LINES, ...DEMAND_EXTRA]
  const demandResolved = await resolveLines(stock, demandLines, { checkStock: true })

  printLines('  Report (sold items):', reportResolved)
  printLines('  Shipment (report + EyeCell kit):', demandResolved)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate('commissionreportin', REPORT.marker)
  await ensureNoDuplicate('demand', DEMAND.marker)

  const report = await api('POST', '/entity/commissionreportin', {
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
      'Volna Beauty Salon L.L.C | Contract 19 | May 2026 sold-items.',
      'Hyaluron Cream 50g (54458) — sheet label 50ml.',
    ].join('\n'),
    positions: positions(reportResolved, { reward: 0 }),
  })
  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

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
      `Volna Beauty Salon L.L.C | Contract 19 | After report ${report.name}.`,
      'Same sold lines + EyeCell Eye Zone Care Kit (00059) ×1 replenishment.',
    ].join('\n'),
    positions: positions(demandResolved),
  })
  console.log(`  Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
