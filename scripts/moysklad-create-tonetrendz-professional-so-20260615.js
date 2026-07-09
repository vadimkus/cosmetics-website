#!/usr/bin/env node

/**
 * TONETRENDZ — professional consumables sales order (invoice pending).
 *
 *   00024 Snow O₂ Cleanser 500ml ×1 @ clinic salePrice
 *   00011 EZ CO₂ MASK Professional Box ×1
 *   00018 Power Solution AWS vial ×10
 *
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-professional-so-20260615.js
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-professional-so-20260615.js --commit
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

const AGENT_ID = '74aa75cb-63db-11f1-0a80-111d001bbe72' // TONETRENDZ LADIES COSMETIC & PERSONAL CARE CENTER L.L.C

const ORDER = {
  name: `GENCardM${uaeShortDate()}2913`,
  moment: uaeMomentNow(),
  marker: `TONETRENDZ professional consumables SO ${uaeToday()}`,
}

/** [code, qty] — prices from MoySklad salePrice (clinic list) */
const LINES = [
  ['00024', 1], // Snow O₂ Cleanser 500ml
  ['00011', 1], // EZ CO₂ MASK Professional Box
  ['00018', 10], // Power Solution AWS 1 Vial 2ml
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday() {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
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
  const resolved = []

  for (const [code, qty] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    sumMinor += item.price * qty
    resolved.push({ ...item, qty })
    positions.push({
      quantity: qty,
      price: item.price,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }

  return { positions, sumMinor, resolved }
}

async function main() {
  console.log('====================================================================')
  console.log('  TONETRENDZ — professional consumables sales order')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name} | ${agent.phone}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday()

  const stock = await fetchStockByCode()
  const { positions, sumMinor, resolved } = buildPositions(stock)

  const shipmentAddressFull = agent.actualAddressFull || {
    addInfo: agent.actualAddress || 'JVC, Binghatti Azure, commercial unit, Dubai',
    country: href('country', COUNTRY_UAE_ID),
    city: 'Dubai',
  }
  if (!shipmentAddressFull.country) {
    shipmentAddressFull.country = href('country', COUNTRY_UAE_ID)
  }

  console.log(`\n  Order: ${ORDER.name}`)
  for (const line of resolved) {
    console.log(
      `    ${line.code} ${line.name.slice(0, 55)} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)} AED`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl. (clinic salePrice)`)

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
      'Professional consumables — invoice only (not consignment).',
      'Snow O2 cleanser 500ml x1, EZ CO2 box x1, AWS vials x10.',
      'SO only — invoice/shipment pending.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
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
