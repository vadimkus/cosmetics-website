#!/usr/bin/env node

/**
 * Ekaterina Petukhova — order + invoice.
 *
 * Lines: Snow O₂ Cleanser 180ml (00021) ×1,
 *        Multi-Vita Radiance Cream 50g (00122) ×2 @ clinic (оптовая).
 *
 *   node --import dotenv/config scripts/moysklad-create-ekaterina-petukhova-order-invoice-20260605.js
 *   node --import dotenv/config scripts/moysklad-create-ekaterina-petukhova-order-invoice-20260605.js --commit
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
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const AGENT_ID = '189657a7-ee67-11ed-0a80-078b00ae97d6' // miss Ekaterina Petukhova

const ORDER = {
  name: `GENCardM${uaeShortDate()}3433`,
  moment: uaeMomentNow(),
  marker: `Ekaterina Petukhova Snow O2 180 radiance cream 50g x2 ${uaeToday()}`,
}

const PRODUCT_LINES = [
  ['00021', 1],
  ['00122', 2],
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
    city: 'Dubai',
    street: full?.addInfo || agent.actualAddress?.addInfo || 'UAE',
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
  return { positions, sumMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  Ekaterina Petukhova — order + invoice')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name} (${agent.phone || '—'})`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = buildShipmentAddress(agent)

  console.log(`  Order name: ${ORDER.name}`)
  console.log()
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(
      `    ${code} ${item.name.slice(0, 52)} x${qty} @ ${money(item.price)} → ${money(item.price * qty)}`
    )
  }
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
      'Snow O2 Cleanser 180ml x1; Multi-Vita Radiance Cream 50g x2 (clinic list).',
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

  const invPayload = {
    moment: ORDER.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    customerOrder: href('customerorder', order.id),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  }

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  } catch (e) {
    console.warn('  Invoice retry link-only:', e.message.slice(0, 180))
    delete invPayload.positions
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  }

  console.log(`  Created invoice: ${invoice.name} | ${money(invoice.sum)} AED | id=${invoice.id}`)
  console.log(`  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/states/${INVOICE_STATE_ISSUED_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
  }).catch(() => {})
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
