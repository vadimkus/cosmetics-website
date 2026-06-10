#!/usr/bin/env node

/**
 * Khadija Ahmed Kagambo — new retail customer + sales order only.
 *
 *   Radiance Cream 230g (00123) x1 @ retail
 *   Snow O₂ Cleanser 180ml (00021) x1 @ retail
 *   Problem Control Toner 200ml (00145) x1 @ retail
 *   Excellent Delivery Dubai x1 @ 45 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-khadija-kagambo-order-20260608.js
 *   node --import dotenv/config scripts/moysklad-create-khadija-kagambo-order-20260608.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'

const CUSTOMER = {
  name: 'Khadija Ahmed Kagambo',
  phone: '+255652848300',
  city: 'Dubai',
  street: 'Kempinski Hotel, Mall of the Emirates, UAE',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}8300`,
  moment: uaeMomentNow(),
  marker: `Khadija Kagambo MOE Kempinski radiance cleanser toner ${uaeToday()}`,
}

/** [code, qty, retailAed VAT incl.] */
const PRODUCT_LINES = [
  ['00123', 1, 420], // Multi Vita Radiance Cream 230g
  ['00021', 1, 330], // Snow O₂ Cleanser 180ml
  ['00145', 1, 260], // Problem Control Toner 200ml
]
const DELIVERY_AED = 45

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
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
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
}

function stateHref(entityType, id) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${id}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
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
    })
  }
  return stock
}

async function findExistingCounterparty() {
  const byPhone = await api(
    'GET',
    `/entity/counterparty?filter=phone=${encodeURIComponent(CUSTOMER.phone)}&limit=5`
  )
  if (byPhone?.rows?.length) return byPhone.rows[0]

  const byName = await api(
    'GET',
    `/entity/counterparty?filter=${encodeURIComponent(`name=${CUSTOMER.name}`)}&limit=5`
  )
  const exact = (byName?.rows || []).find((r) => r.name === CUSTOMER.name)
  if (exact) return exact

  return null
}

async function findOrCreateCounterparty() {
  const existing = await findExistingCounterparty()
  if (existing) {
    console.log(`  Counterparty (existing): ${existing.name} (${existing.id})`)
    return existing
  }

  if (!COMMIT) {
    console.log(`  DRY RUN: would create counterparty "${CUSTOMER.name}" (${CUSTOMER.phone})`)
    return { id: 'DRY-RUN', name: CUSTOMER.name }
  }

  const addr = { country: countryHref(), city: CUSTOMER.city, street: CUSTOMER.street }
  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    companyType: 'individual',
    description: `Retail customer — Kempinski MOE — created with order ${ORDER.name}`,
    actualAddress: CUSTOMER.street,
    legalAddress: CUSTOMER.street,
    actualAddressFull: { addInfo: CUSTOMER.street, country: countryHref() },
    legalAddressFull: { addInfo: CUSTOMER.street, country: countryHref() },
  })
  console.log(`  Counterparty (created): ${created.name} (${created.id})`)
  console.log(`  https://online.moysklad.ru/app/#company/edit?id=${created.id}`)
  return created
}

function buildShipmentAddress() {
  return { country: countryHref(), city: CUSTOMER.city, street: CUSTOMER.street }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday(agentId) {
  if (agentId === 'DRY-RUN') return
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate: ${dup.name} (${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(retailAed * 100)
    sumMinor += priceMinor * qty
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  const deliveryMinor = Math.round(DELIVERY_AED * 100)
  positions.push({
    quantity: 1,
    price: deliveryMinor,
    discount: 0,
    assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
  })
  sumMinor += deliveryMinor
  return { positions, sumMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  Khadija Ahmed Kagambo — new customer + sales order')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  await ensureOrderNameFree()
  const agent = await findOrCreateCounterparty()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress()

  console.log(`\n  Customer: ${CUSTOMER.name} | ${CUSTOMER.phone}`)
  console.log(`  Address: ${CUSTOMER.street}`)
  console.log(`  Order: ${ORDER.name}\n`)
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(`    ${code} ${item.name} x${qty} @ ${retailAed.toFixed(2)} AED`)
  }
  console.log(`    Excellent Delivery Dubai x1 @ ${DELIVERY_AED.toFixed(2)} AED`)
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [
      ORDER.marker,
      'Radiance cream 230g 00123 x1, Snow O2 cleanser 00021 x1, Problem Control toner 00145 x1, delivery 45 AED.',
      'Deliver: Kempinski Hotel, Mall of the Emirates.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    positions,
  })

  console.log(`\n  Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
