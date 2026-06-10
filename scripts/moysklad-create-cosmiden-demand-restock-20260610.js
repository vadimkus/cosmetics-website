#!/usr/bin/env node

/**
 * Cosmiden Clinic — consignment отгрузка under agreement **15**.
 *
 * Request: restock ×1 each historical SKU + collagen ×20 + sea algae ×20.
 *
 *   node --import dotenv/config scripts/moysklad-create-cosmiden-demand-restock-20260610.js
 *   node --import dotenv/config scripts/moysklad-create-cosmiden-demand-restock-20260610.js --commit
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

const RUN_AT = new Date()

const COMMON = {
  date: uaeToday(RUN_AT),
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: 'd7b0a67f-d5a2-11ef-0a80-16cd0019b6b8', // COSMIDEN MEDICAL CENTER L.L.C
  contractId: '69b01872-d7dd-11ef-0a80-0725003ffada', // Agreement 15
}

const DEMAND = {
  moment: uaeMomentNow(RUN_AT),
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Cosmiden consignment restock historical x1 masks x20 ${uaeToday(RUN_AT)}`,
}

/** Historical assortment ×1 + masks ×20 (23g SKUs) */
const LINES = [
  ['00022', 1], // Snow Booster Toner 200ml
  ['00143', 1], // Skin Caring Blemish Balm Cushion #1 Ivory
  ['00144', 1], // Skin Caring Blemish Balm Cushion #2 Beige
  ['00038', 1], // Soothing Repair Post Cream 20g
  ['00063', 20], // Intensive Repair Collagen Mask 23g
  ['00140', 20], // Soothing Bomb Sea Algae Mask 23g
]

const EXPECTED_TOTAL_QTY = LINES.reduce((s, [, q]) => s + q, 0)

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
  const data = await api('GET', `/entity/product?filter=code=${encodeURIComponent(code)}&limit=1`)
  const row = data?.rows?.[0]
  if (!row) return null
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    available: 0,
    price: Number(row.salePrices?.[0]?.value || 0),
  }
}

async function resolveProduct(code, stock) {
  const hit = stock.get(code)
  if (hit?.id) {
    if (!hit.price) {
      const p = await fetchProductByCode(code)
      if (p?.price) hit.price = p.price
    }
    return hit
  }
  const p = await fetchProductByCode(code)
  if (!p?.id) throw new Error(`Unknown product code: ${code}`)
  return p
}

async function ensurePostCreamStock(stock, needed) {
  const POST_CREAM_LOOSE = '00038'
  const POST_CREAM_BOX = '00039'
  const VIALS_PER_BOX = 12

  const loose = stock.get(POST_CREAM_LOOSE) || (await resolveProduct(POST_CREAM_LOOSE, stock))
  stock.set(POST_CREAM_LOOSE, loose)
  if (loose.available >= needed) return

  const shortage = needed - loose.available
  const box = stock.get(POST_CREAM_BOX) || (await resolveProduct(POST_CREAM_BOX, stock))
  stock.set(POST_CREAM_BOX, box)
  const boxesNeeded = Math.ceil(shortage / VIALS_PER_BOX)
  if (box.available < boxesNeeded) {
    throw new Error(
      `Insufficient ${POST_CREAM_LOOSE}: need ${needed}, have ${loose.available} loose + ${box.available} boxes`
    )
  }

  console.log(`\n  Stock prep: unpack ${boxesNeeded}×${POST_CREAM_BOX} → ${shortage}×${POST_CREAM_LOOSE}`)
  const moment = uaeMomentNow()
  await api('POST', '/entity/loss', {
    moment,
    applicable: true,
    organization: href('organization', COMMON.organizationId),
    store: href('store', COMMON.storeId),
    description: `${DEMAND.marker} — unpack post cream box for Cosmiden demand`,
    positions: [{ quantity: boxesNeeded, assortment: href('product', box.id) }],
  })
  const looseProduct = await api('GET', `/entity/product/${loose.id}`)
  await api('POST', '/entity/enter', {
    moment,
    applicable: true,
    organization: href('organization', COMMON.organizationId),
    store: href('store', COMMON.storeId),
    description: `${DEMAND.marker} — enter loose post cream 20g from box`,
    positions: [
      {
        quantity: shortage,
        price: looseProduct.buyPrice?.value || 1866,
        assortment: href('product', loose.id),
      },
    ],
  })
  loose.available += shortage
  box.available -= boxesNeeded
}

async function resolveLines(stock) {
  const resolved = []
  let totalQty = 0
  for (const [code, qty] of LINES) {
    const item = await resolveProduct(code, stock)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    totalQty += qty
    resolved.push({ ...item, qty })
  }
  if (totalQty !== EXPECTED_TOTAL_QTY) {
    throw new Error(`Qty mismatch: expected ${EXPECTED_TOTAL_QTY}, got ${totalQty}`)
  }
  return resolved
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

function buildPositions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))
}

function verifyPositions(docPos, resolved) {
  if (docPos.length !== resolved.length) {
    throw new Error(`Position count ${docPos.length} ≠ ${resolved.length}`)
  }
  const byCode = new Map(resolved.map((l) => [l.code, l.qty]))
  for (const p of docPos) {
    const code = p.assortment?.code
    if (byCode.get(code) !== Number(p.quantity)) {
      throw new Error(`Qty mismatch on ${code}`)
    }
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Cosmiden — consignment restock (agreement 15)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Expected: ${LINES.length} lines / ${EXPECTED_TOTAL_QTY} pcs`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  if (COMMIT) await ensurePostCreamStock(stock, 1)
  const resolved = await resolveLines(stock)

  let sumMinor = 0
  console.log('\n  Lines (clinic salePrice, VAT incl.):')
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
      'Cosmiden restock: historical SKUs x1 (00022, 00143, 00144, 00038) + collagen 00063 x20 + sea algae 00140 x20.',
      'Masks mapped to 23g SKUs (00140, 00063).',
    ].join('\n'),
    positions: buildPositions(resolved),
  }

  const demand = await api('POST', '/entity/demand', payload)
  const docPos = await fetchAll(`/entity/demand/${demand.id}/positions?expand=assortment`)
  verifyPositions(docPos, resolved)
  console.log(`\n  Created demand: ${demand.name} | ${money(demand.sum)} AED | ${docPos.length} lines`)
  console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
