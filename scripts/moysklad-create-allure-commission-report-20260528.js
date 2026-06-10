#!/usr/bin/env node

/**
 * Allure — полученный отчёт комиссионера (продажи 06–25.05.2026).
 *
 * Quantities from handwritten sales list; **unit prices from MoySklad salePrice**.
 * Agreement 00045. Report only.
 *
 *   node --import dotenv/config scripts/moysklad-create-allure-commission-report-20260528.js
 *   node --import dotenv/config scripts/moysklad-create-allure-commission-report-20260528.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const RUN_AT = new Date()

const COMMON = {
  date: uaeToday(RUN_AT),
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  agentId: '9e0a2de1-b31e-11ec-0a80-05e20009d062', // Allure
  contractId: 'c1165028-bbc8-11ec-0a80-03f80018fdc3', // 00045
}

const REPORT = {
  moment: uaeMomentNow(RUN_AT),
  periodStart: '2026-05-06 00:00:00',
  periodEnd: '2026-05-25 23:59:59',
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  marker: `Allure consignment sold 06-25 May 2026 calc ${uaeToday(RUN_AT)}`,
}

/** code, qty sold (prices from MoySklad list) */
const REPORT_LINES = [
  ['00190', 1], // Multi Functional Anti-Wrinkle Cream 50g
  ['00144', 1], // Cushion #2 Beige
  ['00122', 3], // Multi-Vita Radiance Cream 50g (06 + 19 + 25 May)
  ['00129', 1], // EPI Turnover Boosting Peeling
  ['54457', 2], // Ultra Shield SPF50
  ['00194', 1], // Multi Vita Radiance Serum
  ['00041', 2], // Multi Sun Cream SPF40
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function resolveLines(stock) {
  return REPORT_LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (!item.price) throw new Error(`No salePrice in MoySklad for ${code}`)
    return { ...item, qty }
  })
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${COMMON.agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find(
    (doc) => (doc.description || '').includes('06-25 May') && doc.name !== '01362'
  )
  if (dup) throw new Error(`Duplicate report today: ${dup.name} (${dup.id})`)
}

function positions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    reward: 0,
  }))
}

async function main() {
  console.log('====================================================================')
  console.log('  Allure — отчёт комиссионера (продажи 06–25.05, list prices)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)
  console.log(`  Period  : ${REPORT.periodStart.slice(0, 10)} → ${REPORT.periodEnd.slice(0, 10)}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  let sumMinor = 0
  console.log('\n  Sold lines (MoySklad salePrice):')
  for (const line of resolved) {
    const lineMinor = line.price * line.qty
    sumMinor += lineMinor
    console.log(
      `    ${line.code} ${line.name.slice(0, 48)} x${line.qty} @ ${money(line.price)} AED`
    )
  }
  console.log(`\n  Total: ${money(sumMinor)} AED | qty ${resolved.reduce((s, l) => s + l.qty, 0)} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN complete. Re-run with --commit.')
    return
  }

  const payload = {
    moment: REPORT.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    state: stateHref('commissionreportin', REPORT.stateNotPaidId),
    commissionPeriodStart: REPORT.periodStart,
    commissionPeriodEnd: REPORT.periodEnd,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      REPORT.marker,
      'Customer: Allure | Agreement 00045 | Prices: MoySklad list (salePrice).',
      'Sales 06.05: AW cream, cushion #2, MVita cream, peeling, SPF50, MVita serum.',
      '19.05 MVita cream | 21.05 SPF50 | 25.05 SPF40 x2 + MVita cream.',
    ].join('\n'),
    positions: positions(resolved),
  }

  const report = await api('POST', '/entity/commissionreportin', payload)
  const pos = await fetchAll(`/entity/commissionreportin/${report.id}/positions`)
  console.log(`\n  Created report: ${report.name} | ${money(report.sum)} AED | ${pos.length} lines`)
  console.log(`  UI: https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
