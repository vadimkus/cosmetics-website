#!/usr/bin/env node

/**
 * Dr Malika Khodzhaeva (existing) — sales order ONLY @ clinic salePrice.
 *
 *   00024  Snow O₂ Cleanser 500ml                         x1
 *   00183  Problem Control Toner 500ml                    x1
 *   00022  Snow Booster Toner 200ml                       x1
 *   54460  Moisture Replenishing Hyaluron Cream 250g      x1  (210 AED clinic; pro tub)
 *   00011  EZ CO₂ MASK Professional Box                    x1
 *   00015  Skin Renewal Peeling System (SRS) 1 Vial        x10
 *   00040  Intensive Blemish Balm Cream 50g                x1
 *   54465  Soothing Repair Post Cream 100g               x1
 *   service Excellent Delivery Dubai                      x1 @ 45 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-malika-khodzhaeva-so-clinic-20260628.js
 *   node --import dotenv/config scripts/moysklad-create-malika-khodzhaeva-so-clinic-20260628.js --commit
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
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'

const AGENT_ID = '46484521-93c2-11ef-0a80-11430025628d' // Dr Malika Khodzhaeva

const ORDER = {
  name: `GENCardM${uaeShortDate()}8573`,
  moment: uaeMomentNow(),
  marker: `MALIKA-KHODZHAEVA-CLINIC-SO-${uaeToday()}`,
}

/** [code, qty] — clinic salePrice from stock report */
const PRODUCT_LINES = [
  ['00024', 1],
  ['00183', 1],
  ['00022', 1],
  ['54460', 1],
  ['00011', 1],
  ['00015', 10],
  ['00040', 1],
  ['54465', 1],
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

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && full.street) {
    return { country: { meta: full.country.meta }, city: full.city, street: full.street }
  }
  const addInfo = full?.addInfo || agent.actualAddress?.addInfo || 'Marquise square tower 1304'
  return { country: countryHref(), city: 'Dubai', street: addInfo }
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
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
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
  console.log('  Dr Malika Khodzhaeva — sales order only (clinic prices)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name} (${agent.phone || '—'})`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    const line = item.price * qty
    console.log(
      `    ${code} ${String(item.name).slice(0, 48).padEnd(48)} x${String(qty).padStart(2)} @ ${money(item.price)} = ${money(line)}`
    )
  }
  console.log(`    Excellent Delivery Dubai x1 @ ${DELIVERY_AED.toFixed(2)}`)
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

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
      'Clinic prices. SO only — invoice/shipment/payment pending.',
      'Hyaluron 250g pro tub (clinic 210 AED). SRS as 10 single vials (00015).',
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

  console.log(`\n  ✓ Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`    https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
