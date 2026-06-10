#!/usr/bin/env node

/**
 * **Admin Shakirovna Salon** — customer order only (no invoice / no delivery).
 *
 * Lines: Microbiome Infusing Mist ×6, cushion #2 Beige ×1, Multi Sun SPF40 ×1.
 * Prices: **clinic list** — MoySklad **`salePrice`** from stock report (same pattern as Hideaway / commission scripts), not genosys.ae retail.
 *
 *   node --import dotenv/config scripts/moysklad-create-admin-shakirovna-salon-sales-order-20260515.js
 *   node --import dotenv/config scripts/moysklad-create-admin-shakirovna-salon-sales-order-20260515.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const CUSTOMER = {
  name: 'Admin Shakirovna Salon',
  city: 'Dubai',
  street: 'UAE',
}

const ORDER = {
  name: 'GENCardM2605157382',
  moment: '2026-05-15 13:20:00',
  marker:
    'Admin Shakirovna Salon sales order infusing mist x6 cushion beige SPF40 2026-05-15',
}

/** [code, qty] — unit price from stock report salePrice (clinic), VAT incl. */
const PRODUCT_LINES = [
  ['00188', 6], // Microbiome Energy Infusing Mist 80ml
  ['00144', 1], // Skin Caring BB cushion #2 Beige
  ['00041', 1], // Multi Sun SPF40 40g
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1600)}`)
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

function countryHref() {
  return {
    meta: {
      href: `${API}/entity/country/${COUNTRY_UAE_ID}`,
      type: 'country',
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

async function findCounterparty() {
  const exact = await api(
    'GET',
    `/entity/counterparty?filter=${encodeURIComponent(`name=${CUSTOMER.name}`)}&limit=5`
  )
  const cp = exact?.rows?.find((r) => r.name === CUSTOMER.name)
  if (cp) {
    console.log(`  Counterparty: ${cp.name} (${cp.id})`)
    return cp
  }
  throw new Error(`Counterparty not found — create/use exact name "${CUSTOMER.name}" in MoySklad`)
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday(counterpartyId) {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${counterpartyId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate protection: order exists (${dup.name}, id=${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = item.price
    if (!priceMinor) throw new Error(`No sale/clinic price in MoySklad for ${code}`)
    const lineMinor = priceMinor * qty
    sumMinor += lineMinor
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  return { positions, sumMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  Admin Shakirovna Salon — customer order only')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await findCounterparty()
  if (COMMIT) {
    await ensureNoDuplicateToday(agent.id)
    await ensureOrderNameFree()
  }

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)

  console.log()
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(
      `    ${code} ${item.name.slice(0, 50)}… x${qty} @ ${money(item.price)} (clinic / stock sale) → ${money(item.price * qty)}`
    )
  }
  console.log(`  Expected sum (products): ${money(sumMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit.')
    return
  }

  const shipment = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }

  const orderPayload = {
    name: ORDER.name,
    moment: ORDER.moment,
    shared: true,
    description: [
      ORDER.marker,
      'Clinic list (MoySklad salePrice): Mist x6, cushion Beige x1, Multi Sun SPF40 x1.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: {
      meta: {
        href: `${API}/entity/customerorder/metadata/states/${STATE_NEW_ORDER_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions,
  }

  const order = await api('POST', '/entity/customerorder', orderPayload)
  console.log()
  console.log(`  Created order: ${order.name} | ${(order.sum / 100).toFixed(2)} AED | id=${order.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
