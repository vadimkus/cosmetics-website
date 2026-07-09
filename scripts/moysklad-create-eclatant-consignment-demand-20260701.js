#!/usr/bin/env node

/**
 * ECLATANT&CO — consignment replenishment Отгрузка (contract 18).
 *
 *   00021 Snow O₂ Cleanser 180ml ×3
 *   54461 Skin Defender Lip & Eye Makeup Remover 200ml ×2
 *   00144 Cushion #2 Beige ×3
 *   54457 Ultra Shield Sun Cream SPF50 ×3
 *   00063 Intensive Repair Collagen Mask 23g ×10
 *   00140 Soothing Bomb Sea Algae Mask 23g ×10
 *
 *   node --import dotenv/config scripts/moysklad-create-eclatant-consignment-demand-20260701.js
 *   node --import dotenv/config scripts/moysklad-create-eclatant-consignment-demand-20260701.js --commit
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
  agentId: '0df9bafd-1a99-11f0-0a80-08b100073e9f', // ECLATANT&CO TRADING CO L.L.C
  contractId: '132684fd-1a99-11f0-0a80-071f0006a1ec', // Contract 18
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  moment: uaeMomentNow(),
  date: uaeToday(),
  marker: `Eclatant consignment replenishment contract 18 ${uaeToday()}`,
}

/** [code, qty] @ clinic salePrice */
const LINES = [
  ['00021', 3], // Snow O₂ Cleanser 180ml
  ['54461', 2], // Skin Defender Lip & Eye Makeup Remover 200ml
  ['00144', 3], // Cushion #2 Beige
  ['54457', 3], // Ultra Shield Sun Cream SPF50 50g
  ['00063', 10], // Intensive Repair Collagen Mask 23g
  ['00140', 10], // Soothing Bomb Sea Algae Mask 23g
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
  console.log('  Eclatant — consignment Отгрузка (contract 18)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${DEMAND.agentId}`),
    api('GET', `/entity/contract/${DEMAND.contractId}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  const totalMinor = resolved.reduce((s, l) => s + l.qty * l.price, 0)

  console.log('\n  Lines (clinic salePrice VAT incl.):')
  for (const line of resolved) {
    console.log(`    ${line.code} ${line.name.slice(0, 55)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`)
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${resolved.reduce((s, l) => s + l.qty, 0)} units`)

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
      'ECLATANT&CO TRADING CO L.L.C | Contract 18',
      'Snow cleanser x3, makeup remover x2, cushion Beige x3, SPF50 x3, collagen mask x10, sea algae mask x10.',
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
