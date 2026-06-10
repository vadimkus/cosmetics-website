#!/usr/bin/env node

/**
 * Anishyna Nataliia — полученный отчёт комиссионера + отгрузка (договор 00029).
 *
 * Lines (×1 each, list prices):
 *   Snow O₂ Cleanser 180ml (00021) — 165 AED
 *   Skin Rescue Overnight Cream Mask 100g (00189) — 170 AED
 *   EPI Turnover Boosting Peeling Gel 100g (00129) — 125 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-anishyna-nataliia-commission-demand-20260521.js
 *   node --import dotenv/config scripts/moysklad-create-anishyna-nataliia-commission-demand-20260521.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const RUN_AT = new Date()

const COMMON = {
  date: uaeToday(RUN_AT),
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: '6287f051-242b-11eb-0a80-0568000ea0f6', // Anishyna Nataliia
  contractId: '43bf5d39-c3ca-11eb-0a80-077e0026e97f', // Agreement 00029
}

const REPORT = {
  moment: uaeMomentNow(RUN_AT),
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  marker: `Anishyna Nataliia consignment sold Snow O2 Overnight Peeling ${uaeToday(RUN_AT)}`,
}

const DEMAND = {
  moment: uaeMomentAddMinutes(5, RUN_AT),
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Anishyna Nataliia demand same 3 lines as commission report ${uaeToday(RUN_AT)}`,
}

/** code, qty, expected list AED (sanity check) */
const LINES = [
  ['00021', 1, 165], // Snow O₂ Cleanser 180ml
  ['00189', 1, 170], // Skin Rescue Overnight Cream Mask 100g
  ['00129', 1, 125], // EPI Turnover Boosting Peeling Gel 100g
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
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function resolveLines(stock) {
  return LINES.map(([code, qty, expectedAed]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const actualAed = item.price / 100
    if (Math.abs(actualAed - expectedAed) > 0.01) {
      throw new Error(`Price mismatch ${code}: expected ${expectedAed} AED, list is ${actualAed} AED`)
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

async function main() {
  console.log('====================================================================')
  console.log('  Anishyna Nataliia — отчёт комиссионера + отгрузка (договор 00029)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  if (COMMIT) {
    await ensureNoDuplicate('commissionreportin', REPORT.marker)
    await ensureNoDuplicate('demand', DEMAND.marker)
  }

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  let sumMinor = 0
  console.log('\n  Lines:')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    console.log(`    ${line.code} ${line.name.slice(0, 52)} x${line.qty} @ ${money(line.price)} AED`)
  }
  console.log(`  Total: ${money(sumMinor)} AED (3 lines)`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — add --commit')
    return
  }

  const reportPayload = {
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
      'Snow O2 165 | Overnight mask 170 | EPI Peeling 125 AED ×1 each.',
    ].join('\n'),
    positions: positions(resolved, { reward: 0 }),
  }

  const report = await api('POST', '/entity/commissionreportin', reportPayload)
  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED | id=${report.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  const demandPayload = {
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
      `Paired with report ${report.name}. Same 3 SKU / 3 pcs.`,
    ].join('\n'),
    positions: positions(resolved),
  }

  const demand = await api('POST', '/entity/demand', demandPayload)
  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED | id=${demand.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
