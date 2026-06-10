#!/usr/bin/env node

/**
 * LODY ANA.SPA. LLC — customer order (no invoice).
 *
 * Snow Booster 200ml, Hyaluron cream 50g, cushions Ivory/Beige/Camel,
 * serums, mist, SPF50, blemish balm, overnight mask, Delivery Abu Dhabi 70 AED.
 *
 *   node --import dotenv/config scripts/moysklad-create-lodyana-spa-order-20260605.js
 *   node --import dotenv/config scripts/moysklad-create-lodyana-spa-order-20260605.js --commit
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

const AGENT_ID = '5746700f-455a-11f1-0a80-03c5003a244c' // LODY ANA.SPA. LLC
const DELIVERY_ABU_DHABI_ID = '212036af-814f-11ea-0a80-011700157c7d'
const DELIVERY_AED = 70

/** [code, qty] — clinic list (salePrice); qty 1 unless noted */
const PRODUCT_LINES = [
  ['00022', 1], // Snow Booster Toner 200ml
  ['54458', 1], // Moisture Replenishing Hyaluron Cream 50g
  ['00143', 1], // Cushion Ivory
  ['00144', 1], // Cushion Beige
  ['54464', 1], // Cushion Camel
  ['00030', 1], // All For Sensitive Serum 30ml
  ['00195', 1], // Moisture Replenishing Hyaluron Serum 30ml
  ['00188', 1], // Microbiome Energy Infusing Mist 80ml
  ['54457', 1], // Ultra Shield SPF50
  ['00040', 1], // Intensive Blemish Balm Cream 50g
  ['00189', 1], // Skin Rescue Overnight Cream Mask 100g
]

const ORDER = {
  name: `GENCardM${uaeShortDate()}LODY`,
  moment: uaeMomentNow(),
  marker: `Lodyana SPA order Abu Dhabi delivery 70 ${uaeToday()}`,
}

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

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && full.street) {
    return {
      country: { meta: full.country.meta },
      city: full.city,
      street: full.street,
    }
  }
  return {
    country: countryHref(),
    city: 'Abu Dhabi',
    street: full?.addInfo || agent.actualAddress?.addInfo || 'Abu Dhabi, UAE',
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
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    sumMinor += item.price * qty
    positions.push({
      quantity: qty,
      price: item.price,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }

  const deliveryMinor = Math.round(DELIVERY_AED * 100)
  sumMinor += deliveryMinor
  positions.push({
    quantity: 1,
    price: deliveryMinor,
    discount: 0,
    assortment: href('service', DELIVERY_ABU_DHABI_ID),
    vat: 5,
    vatEnabled: true,
  })

  return { positions, sumMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  LODY ANA.SPA. LLC — customer order')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = buildShipmentAddress(agent)

  console.log(`  Order name: ${ORDER.name}`)
  console.log()
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(`    ${code} ${item.name.slice(0, 46)} x${qty} @ ${money(item.price)}`)
  }
  console.log(`    Delivery Abu Dhabi x1 @ ${DELIVERY_AED.toFixed(2)}`)
  console.log(`  Expected sum: ${money(sumMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [
      ORDER.marker,
      'Snow booster, hyaluron cream, cushions x3, serums, mist, SPF50, blemish balm, overnight mask; Abu Dhabi delivery 70.',
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
  })

  console.log()
  console.log(`  Created order: ${order.name} | ${money(order.sum)} AED | id=${order.id}`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
