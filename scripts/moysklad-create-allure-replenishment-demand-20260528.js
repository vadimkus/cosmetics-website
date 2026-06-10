#!/usr/bin/env node

/**
 * Allure — отгрузка (demand) under commission agreement **00045**.
 *
 * Lines: Ultra Shield SPF50 (54457) ×2, Radiance cream 50g (00122) ×2,
 *        Radiance serum (00194) ×2, Cushion #2 Beige (00144) ×2.
 * Prices: MoySklad list (salePrice).
 *
 *   node --import dotenv/config scripts/moysklad-create-allure-replenishment-demand-20260528.js
 *   node --import dotenv/config scripts/moysklad-create-allure-replenishment-demand-20260528.js --commit
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
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: '9e0a2de1-b31e-11ec-0a80-05e20009d062', // Allure
  contractId: 'c1165028-bbc8-11ec-0a80-03f80018fdc3', // Agreement 00045
}

const DEMAND = {
  moment: uaeMomentNow(RUN_AT),
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Allure consignment replenishment SPF50 Radiance serum cushion ${uaeToday(RUN_AT)}`,
}

const LINES = [
  ['54457', 2], // Ultra Shield Sun Cream SPF50/PA++++ 50g
  ['00122', 2], // Multi-Vita Radiance Cream 50g
  ['00194', 2], // Multi Vita Radiance Serum 30ml
  ['00144', 2], // Skin Caring Blemish Balm Cushion #2 Beige
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
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${COMMON.agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((doc) => (doc.description || '').includes(DEMAND.marker))
  if (dup) throw new Error(`Duplicate demand today: ${dup.name} (${dup.id})`)
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
  console.log('  Allure — отгрузка (agreement 00045)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  let sumMinor = 0
  console.log('\n  Lines (list prices):')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 50)} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)} AED`
    )
  }
  console.log(`\n  Total: ${money(sumMinor)} AED | ${resolved.reduce((s, l) => s + l.qty, 0)} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN complete. Re-run with --commit.')
    return
  }

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
      'Agreement 00045 replenishment: SPF50 x2, Radiance cream 50g x2, Radiance serum x2, Cushion Beige x2.',
    ].join('\n'),
    positions: positions(resolved),
  }

  const demand = await api('POST', '/entity/demand', payload)
  const pos = await fetchAll(`/entity/demand/${demand.id}/positions`)
  console.log(`\n  Created demand: ${demand.name} | ${money(demand.sum)} AED | ${pos.length} lines`)
  console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
