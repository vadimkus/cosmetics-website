#!/usr/bin/env node

/**
 * Cosmiden — supplementary consignment отгрузка (agreement **15**).
 *
 * Stock sheet 31.05.2026: ship ×1 for every line at **0** stock.
 * Excludes: Soothing Repair Post Cream 20g (`00038`).
 * Skips lines already on consignment stock (>0 on sheet): 00037, 00035, 54464, 00053, 00129.
 * Skips lines already on demand **06333** (same-day restock): 00022, 00143, 00144, 00063×20, 00140×20.
 *
 *   node --import dotenv/config scripts/moysklad-create-cosmiden-demand-zero-fill-20260610.js
 *   node --import dotenv/config scripts/moysklad-create-cosmiden-demand-zero-fill-20260610.js --commit
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
  agentId: 'd7b0a67f-d5a2-11ef-0a80-16cd0019b6b8',
  contractId: '69b01872-d7dd-11ef-0a80-0725003ffada',
}

const DEMAND = {
  moment: uaeMomentNow(RUN_AT),
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Cosmiden zero-fill stock sheet 20260531 excl postcream ${uaeToday(RUN_AT)}`,
}

/** [code, qty, label] — zero on Cosmiden sheet 31.05.2026, not on demand 06333 */
const LINES = [
  ['00021', 1, 'Snow O₂ Cleanser 180ml'],
  ['00145', 1, 'Problem Control Toner 200ml'],
  ['00122', 1, 'Multi-Vita Radiance Cream 50g'],
  ['00031', 1, 'Intensive Hydro Soothing Cream 50g'],
  ['00190', 1, 'Multi Functional Anti-Wrinkle Cream 50g'],
  ['54458', 1, 'Moisture Replenishing Hyaluron Cream 50g'],
  ['00042', 1, 'EGF Repair Oxymask Cream 50ml'],
  ['54457', 1, 'Ultra Shield Sun Cream SPF50 50g'],
  ['00040', 1, 'Intensive Blemish Balm Cream 50g'],
  ['00054', 1, 'EyeCell Eye Contour Serum 10ml'],
  ['00041', 1, 'Multi Sun Cream SPF40 40g'],
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
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    const batch = data?.rows || []
    rows.push(...batch)
    if (batch.length < 1000) break
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

async function resolveLines(stock) {
  const resolved = []
  let totalQty = 0
  for (const [code, qty, label] of LINES) {
    const item = await resolveProduct(code, stock)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code} (${label}): need ${qty}, have ${item.available}`)
    }
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    totalQty += qty
    resolved.push({ ...item, qty, label })
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

async function main() {
  console.log('====================================================================')
  console.log('  Cosmiden — zero-fill demand (agreement 15, excl. post cream)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Lines: ${LINES.length} | pcs: ${EXPECTED_TOTAL_QTY}`)
  console.log('  Note: masks/cushions/booster on demand 06333 — not duplicated here.')

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = await resolveLines(stock)

  let sumMinor = 0
  console.log('\n  Lines (clinic salePrice, VAT incl.):')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.label.slice(0, 48)} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)} AED`
    )
  }
  console.log(`\n  Total: ${money(sumMinor)} AED | ${EXPECTED_TOTAL_QTY} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN complete. Re-run with --commit.')
    return
  }

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
      'Zero-fill per Cosmiden stock sheet 31.05.2026 — ×1 each line at 0 (excl. 00038 post cream).',
      'Masks/cushions/booster covered by demand 06333.',
    ].join('\n'),
    positions: buildPositions(resolved),
  })

  const docPos = await fetchAll(`/entity/demand/${demand.id}/positions?expand=assortment`)
  console.log(`\n  Created demand: ${demand.name} | ${money(demand.sum)} AED | ${docPos.length} lines`)
  console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
