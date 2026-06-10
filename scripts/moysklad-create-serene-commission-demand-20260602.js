#!/usr/bin/env node

/**
 * Serene Skin Beauty Salon — commissioner report + consignment Отгрузка (contract 00060).
 *
 *   node --import dotenv/config scripts/moysklad-create-serene-commission-demand-20260602.js
 *   node --import dotenv/config scripts/moysklad-create-serene-commission-demand-20260602.js --commit
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
  agentId: '993395aa-8da2-11ec-0a80-006b0038cd99', // Serene Skin Beauty Salon LLC
  contractId: 'dc5c469a-d943-11ed-0a80-05bd0013eb27', // Contract 00060
  date: uaeToday(),
  commissionPeriodStart: '2026-05-01 00:00:00',
  commissionPeriodEnd: '2026-05-31 23:59:59',
}

const REPORT = {
  moment: uaeMomentNow(),
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  marker: `Serene Skin Beauty consignment sales ${uaeToday()}`,
}

const DEMAND = {
  moment: uaeMomentAddMinutes(3),
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Serene Skin Beauty shipment ${uaeToday()}`,
}

const LINES = [
  ['54457', 1], // Ultra Shield Sun Cream SPF50 50g
  ['00041', 1], // Multi Sun Cream SPF40/PA++ 40g
  ['00144', 1], // Skin Caring Blemish Balm Cushion #2 Biege
  ['00188', 2], // Microbiome Energy Infusing Mist 80ml
  ['54461', 1], // Skin Defender Lip & Eye Makeup Remover 200ml
  ['00140', 10], // Soothing Bomb Sea Algae Mask 23g
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

async function resolveLines(stock, { checkStock }) {
  const resolved = []
  for (const [code, qty] of LINES) {
    let item = stock.get(code)
    if (!item?.id) item = await fetchProductByCode(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (checkStock && item.available < qty) {
      throw new Error(`Insufficient stock for ${code} ${item.name}: need ${qty}, available ${item.available}`)
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
  if (dup) throw new Error(`Duplicate: ${entityType} ${dup.name} (${dup.id})`)
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
  const totalQty = resolved.reduce((s, l) => s + l.qty, 0)
  console.log(`\n${title}`)
  for (const line of resolved) {
    console.log(`  ${line.code} ${line.name.slice(0, 52)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`)
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} units | ${resolved.length} lines`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Serene Skin Beauty — report + отгрузка (contract 00060)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${COMMON.agentId}`),
    api('GET', `/entity/contract/${COMMON.contractId}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const stock = await fetchStockByCode()
  const reportResolved = await resolveLines(stock, { checkStock: false })
  const demandResolved = await resolveLines(stock, { checkStock: true })

  printLines('  Report + shipment (same lines):', reportResolved)

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
      'Serene Skin Beauty Salon LLC | Contract 00060 | May 2026 sold items.',
      'Mist = Microbiome Energy Infusing Mist 00188.',
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
      `Serene Skin Beauty Salon LLC | Contract 00060 | After report ${report.name}.`,
      'Same items and quantities as commissioner report.',
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
