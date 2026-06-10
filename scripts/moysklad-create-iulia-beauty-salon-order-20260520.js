#!/usr/bin/env node

/**
 * IULIA BEAUTY SALON LLC — Заказ покупателя по договору **28** (commission).
 *
 * Lines (clinic list — MoySklad salePrice):
 *   00013 Hydro Cool Modeling Mask 1kg               x1
 *   54465 Soothing Repair Post Cream 100g            x1
 *   00069 Power Solution CTS 1 Vial 2ml              x10
 *   00067 Power Solution CVS 1 Vial 2ml              x10
 *   00025 Snow Booster Toner 1000ml                  x1
 *
 *   node scripts/moysklad-create-iulia-beauty-salon-order-20260520.js
 *   node scripts/moysklad-create-iulia-beauty-salon-order-20260520.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const AGENT_ID = '96500719-c90e-11f0-0a80-19c8002d2932' // IULIA BEAUTY SALON LLC
const CONTRACT_ID = 'f2dad83f-c91f-11f0-0a80-09d3003136c5' // 28

const ORDER = {
  moment: '2026-05-20 11:00:00',
  marker: 'IULIA BEAUTY SALON salon order Hydro Cool 1kg + Postcream 100g + CTS x10 + CVS x10 + Snow Booster 1000ml 2026-05-20',
}

/** [code, qty] — unit price from stock report salePrice (clinic), VAT incl. */
const PRODUCT_LINES = [
  ['00013', 1],   // Hydro Cool Modeling Mask 1kg
  ['54465', 1],   // Soothing Repair Post Cream 100g
  ['00069', 10],  // Power Solution CTS 1 Vial 2ml
  ['00067', 10],  // Power Solution CVS 1 Vial 2ml
  ['00025', 1],   // Snow Booster Toner 1000ml
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

async function ensureNoDuplicate() {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate protection: order exists (${dup.name}, id=${dup.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad — IULIA BEAUTY SALON LLC (Заказ покупателя / договор 28)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const contract = await api('GET', `/entity/contract/${CONTRACT_ID}`)
  console.log(`  Counterparty: ${agent.name}`)
  console.log(`  Contract    : ${contract.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const positions = []
  let sumMinor = 0

  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    if (!item.price) throw new Error(`No salePrice in MoySklad for ${code}`)
    const lineMinor = item.price * qty
    sumMinor += lineMinor
    positions.push({
      quantity: qty,
      price: item.price,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
    console.log(`  ${code} | ${item.name.slice(0, 55)} | x${qty} @ ${money(item.price)} → ${money(lineMinor)} AED`)
  }
  console.log(`  Expected total: ${money(sumMinor)} AED VAT-incl.`)

  const shipment = {
    country: countryHref(),
    city: 'Dubai',
    street: 'City Walk, building 16',
  }

  const orderPayload = {
    moment: ORDER.moment,
    shared: true,
    description: [
      ORDER.marker,
      'Clinic list (MoySklad salePrice).',
      'Lines: Hydro Cool 1kg x1, Postcream 100g x1, CTS vials x10, CVS vials x10, Snow Booster 1000ml x1.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
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

  if (!COMMIT) {
    console.log('\n  DRY RUN complete. Re-run with --commit.')
    return
  }

  const order = await api('POST', '/entity/customerorder', orderPayload)
  console.log()
  console.log(`  Created order: ${order.name} | ${money(order.sum)} AED | id=${order.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
