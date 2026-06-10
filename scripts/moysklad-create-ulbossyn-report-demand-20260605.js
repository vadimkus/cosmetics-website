#!/usr/bin/env node

/**
 * Ulbossyn Saparbayeva — commission report + demand (agreement 00043), same lines.
 *
 *   node --import dotenv/config scripts/moysklad-create-ulbossyn-report-demand-20260605.js
 *   node --import dotenv/config scripts/moysklad-create-ulbossyn-report-demand-20260605.js --commit
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
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: 'a09d60ad-4eb7-11ec-0a80-08b3000e83a7', // Ulbossyn Saparbayeva
  contractId: 'b2b25665-af1a-11ec-0a80-03530002ffd7', // Agreement 00043
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
}

const MARKER = `Ulbossyn Saparbayeva consignment report shipment ${uaeToday()}`

const LINES = [
  ['00122', 1], // Multi-Vita Radiance Cream 50g
  ['00194', 1], // Multi Vita Radiance Serum 30ml
  ['00190', 1], // Multi Functional Anti-Wrinkle Cream 50g
  ['00129', 1], // EPI Turnover Boosting Peeling Gel 100g
  ['00145', 1], // Problem Control Toner 200ml
  ['00021', 1], // Snow O₂ Cleanser 180ml
  ['00063', 7], // Intensive Repair Collagen Mask 23g
  ['00140', 7], // Soothing Bomb Sea Algae Mask 23g
  ['54473', 1], // Revita Glow BB #02 Natural 50g
  ['54472', 1], // Revita Glow BB #01 Bright 50g
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

async function ensureNoDuplicate(entity) {
  const filter = [
    `agent=${API}/entity/counterparty/${COMMON.agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate ${entity}: ${dup.name} (${dup.id})`)
}

function resolveLines(stock, checkStock) {
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (checkStock && item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

function positions(resolved, withReward = false) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    ...(withReward ? { reward: 0 } : {}),
  }))
}

async function main() {
  console.log('====================================================================')
  console.log('  Ulbossyn Saparbayeva — report + demand (agreement 00043)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Customer : ${agent.name}`)
  console.log(`  Contract : ${contract.name}`)

  const stock = await fetchStockByCode()
  const reportLines = resolveLines(stock, false)
  const demandLines = resolveLines(stock, true)

  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Lines (list, VAT incl.):')
  for (const line of reportLines) {
    sumMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 48)} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)}`
    )
  }
  console.log(`\n  Total: ${money(sumMinor)} AED | ${totalQty} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate('commissionreportin')
  await ensureNoDuplicate('demand')

  const momentReport = uaeMomentNow()
  const momentDemand = uaeMomentAddMinutes(5)

  const report = await api('POST', '/entity/commissionreportin', {
    moment: momentReport,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    state: stateHref('commissionreportin', COMMON.stateNotPaidId),
    commissionPeriodStart: momentReport,
    commissionPeriodEnd: momentReport,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Sold: radiance cream/serum, anti-wrinkle cream, EPI peeling, PCT toner, Snow O2, collagen x7, sea algae x7, Revita Natural+Bright.',
    ].join('\n'),
    positions: positions(reportLines, true),
  })

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  const demand = await api('POST', '/entity/demand', {
    moment: momentDemand,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    store: href('store', COMMON.storeId),
    state: stateHref('demand', COMMON.stateShippedId),
    description: [
      MARKER,
      `Replenishment matching report ${report.name} — agreement 00043.`,
    ].join('\n'),
    positions: positions(demandLines),
  })

  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
