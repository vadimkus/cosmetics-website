#!/usr/bin/env node

/**
 * Miss Heike Lutz — sales order only (existing customer, retail prices).
 *
 *   00042 EGF Repair Oxymask 50ml x1
 *   00189 Overnight Cream Mask 100g x1
 *   00191 Multi Functional Anti-Wrinkle Serum 30ml x1
 *   00195 Moisture Replenishing Hyaluron Serum 30ml x1
 *   00190 Multi Functional Anti-Wrinkle Cream 50g x1
 *   54458 Moisture Replenishing Hyaluron Cream 50g x1
 *   Excellent Delivery Dubai x1 @ 45 AED — 100% discount
 *
 *   node --import dotenv/config scripts/moysklad-create-heike-lutz-order-20260618.js
 *   node --import dotenv/config scripts/moysklad-create-heike-lutz-order-20260618.js --commit
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

const AGENT_ID = '4365dad0-a58d-11ef-0a80-0bc200331eaf' // Miss Heike Lutz 0507757940

const DELIVERY_AED = 45

const ORDER = {
  name: `GENCardW${uaeShortDate()}7940`,
  moment: uaeMomentNow(),
  marker: `HEIKE-LUTZ-RETAIL-${uaeToday()}`,
}

/** [code, qty, retailAed VAT incl.] — genosys.ae розничная */
const PRODUCT_LINES = [
  ['00042', 1, 290], // EGF Repair Oxymask Cream 50ml
  ['00189', 1, 340], // Skin Rescue Overnight Cream Mask 100g
  ['00191', 1, 330], // Multi Functional Anti-Wrinkle Serum 30ml
  ['00195', 1, 330], // Moisture Replenishing Hyaluron Serum 30ml
  ['00190', 1, 290], // Multi Functional Anti-Wrinkle Cream 50g
  ['54458', 1, 290], // Moisture Replenishing Hyaluron Cream 50g
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

function buildShipmentAddress(agent) {
  const street =
    agent.actualAddress ||
    agent.actualAddressFull?.addInfo ||
    agent.legalAddress ||
    'Green Community, Villa 111, Motor City, UAE'
  return {
    country: countryHref(),
    city: 'Dubai',
    street,
  }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday(agentId) {
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
  let goodsMinor = 0
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(retailAed * 100)
    goodsMinor += priceMinor * qty
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
    discount: 100,
    assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
  })

  return { positions, goodsMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Heike Lutz — sales order only (retail)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name} (${agent.phone || '—'})`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, goodsMinor } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  console.log(`  Deliver: ${shipmentAddressFull.street}`)
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(`    ${code} ${item.name} x${qty} @ ${retailAed.toFixed(2)} AED`)
  }
  console.log(`    Excellent Delivery Dubai x1 @ ${DELIVERY_AED.toFixed(2)} AED (100% discount)`)
  console.log(`  Goods total: ${money(goodsMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: ORDER.moment,
    shared: true,
    description: [
      ORDER.marker,
      '00042 x1, 00189 x1, 00191 x1, 00195 x1, 00190 x1, 54458 x1 @ retail.',
      'Excellent Delivery Dubai 45 AED — 100% discount.',
      'Deliver: Green Community, Villa 111, Motor City.',
      'SO only — invoice/shipment pending.',
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

  console.log(`\n  Order created: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
