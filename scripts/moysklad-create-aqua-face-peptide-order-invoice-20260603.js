#!/usr/bin/env node

/**
 * Aqua Face Facialbar Ltd — order + invoice.
 *
 * Lines: Peptide Gel Mask 39g (00012) ×10 @ list,
 *        Excellent Delivery Dubai ×1 @ 45 AED.
 *
 *   node --import dotenv/config scripts/moysklad-create-aqua-face-peptide-order-invoice-20260603.js
 *   node --import dotenv/config scripts/moysklad-create-aqua-face-peptide-order-invoice-20260603.js --commit
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

const AGENT_ID = '1404a0d3-3a3a-11f1-0a80-07a600082120' // Aqua Face Facialbar Ltd
const PRODUCT_ID = '3068531d-3444-11ea-0a80-06a300016deb' // 00012
const DELIVERY_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd' // Excellent Delivery Dubai

const MASK_QTY = 10
const DELIVERY_AED = 45

const ORDER = {
  name: `GENCardM${uaeShortDate()}5831`,
  moment: uaeMomentNow(),
  marker: `Aqua Face Facialbar peptide 00012 x10 + delivery 45 ${uaeToday()}`,
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

async function fetchStock00012() {
  const data = await api('GET', '/report/stock/all?stockMode=all&limit=1000')
  const row = (data.rows || []).find((r) => r.code === '00012')
  if (!row) throw new Error('Stock row not found for 00012')
  return {
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
    price: Number(row.salePrice || 0),
  }
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
    street: 'Park Towers, Level P4, DIFC',
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
  const data = await api('GET', `/entity/customerorder?filter=${encodeURIComponent(filter)}&limit=100`)
  const dup = (data.rows || []).find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate protection: order exists (${dup.name}, id=${dup.id})`)
}

function buildPositions(maskStock) {
  if (maskStock.available < MASK_QTY) {
    throw new Error(`Insufficient stock 00012: need ${MASK_QTY}, have ${maskStock.available}`)
  }
  const deliveryMinor = Math.round(DELIVERY_AED * 100)
  const positions = [
    {
      quantity: MASK_QTY,
      price: maskStock.price,
      discount: 0,
      assortment: href('product', PRODUCT_ID),
      vat: 5,
      vatEnabled: true,
    },
    {
      quantity: 1,
      price: deliveryMinor,
      discount: 0,
      assortment: href('service', DELIVERY_SERVICE_ID),
      vat: 5,
      vatEnabled: true,
    },
  ]
  const sumMinor = maskStock.price * MASK_QTY + deliveryMinor
  return { positions, sumMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  Aqua Face Facialbar Ltd — peptide mask order + invoice')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name}`)
  console.log(`  Phone: ${agent.phone || '—'}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const maskStock = await fetchStock00012()
  const { positions, sumMinor } = buildPositions(maskStock)
  const shipment = buildShipmentAddress(agent)

  console.log()
  console.log(`    00012 ${maskStock.name} x${MASK_QTY} @ ${money(maskStock.price)}`)
  console.log(`    Excellent Delivery Dubai x1 @ ${DELIVERY_AED.toFixed(2)} AED`)
  console.log(`  Expected total (VAT incl.): ${money(sumMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const orderPayload = {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [ORDER.marker, 'Peptide Gel Mask 39g x10; Excellent Delivery Dubai 45 AED.'].join(' | '),
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
    console.warn('  Invoice with positions failed, retry link-only:', e.message.slice(0, 180))
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
  }).catch(() => console.warn('  (Could not set state Выписан.)'))
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
