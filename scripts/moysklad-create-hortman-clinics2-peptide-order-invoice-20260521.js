#!/usr/bin/env node

/**
 * HORTMAN CLINICS 2 L.L.C — order + invoice.
 *
 * Lines: Peptide Gel Mask 39g (00012) ×100 @ list 38 AED (VAT-incl total 3,990 AED).
 * Pattern matches prior order CODM2604206481 (100 pcs peptide mask).
 *
 *   node --import dotenv/config scripts/moysklad-create-hortman-clinics2-peptide-order-invoice-20260521.js
 *   node --import dotenv/config scripts/moysklad-create-hortman-clinics2-peptide-order-invoice-20260521.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const { uaeToday, uaeTodayDmy, uaeMomentNow, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const PRODUCT_ID = '3068531d-3444-11ea-0a80-06a300016deb' // 00012 Peptide Gel Mask 39g

const AGENT_ID = '1ac006c7-2687-11f0-0a80-094f001f888f' // HORTMAN CLINICS 2 L.L.C

const ORDER = {
  name: `CODM${uaeShortDate()}6482`,
  moment: uaeMomentNow(),
  marker: `Hortman Clinics 2 peptide gel mask 00012 x100 ${uaeToday()}`,
  paymentNote: `Payment 90 days: ${uaeTodayDmy()}`,
}

const QTY = 100

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

async function fetchStock00012() {
  const rows = await fetchAll('/report/stock/all?stockMode=all')
  const row = rows.find((r) => r.code === '00012')
  if (!row) throw new Error('Stock row not found for 00012')
  return {
    code: row.code,
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
  const addInfo = full?.addInfo || agent.actualAddress?.addInfo || ''
  return {
    country: countryHref(),
    city: 'Dubai',
    street: addInfo || '450 Jumeira St - Jumeirah 3 - Dubai',
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

function buildPositions(stock) {
  if (stock.available < QTY) {
    throw new Error(`Insufficient stock 00012: need ${QTY}, have ${stock.available}`)
  }
  const positions = [
    {
      quantity: QTY,
      price: stock.price,
      discount: 0,
      assortment: href('product', PRODUCT_ID),
      vat: 5,
      vatEnabled: true,
    },
  ]
  const sumMinor = stock.price * QTY
  return { positions, sumMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  HORTMAN CLINICS 2 L.L.C — peptide mask order + invoice')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name} (${agent.id})`)
  console.log(`  Phone: ${agent.phone || '—'}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStock00012()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = buildShipmentAddress(agent)

  console.log()
  console.log(
    `    00012 ${stock.name} x${QTY} @ ${money(stock.price)} → ${money(sumMinor)} AED (ex-VAT line base)`
  )
  console.log(`    Expected order sum (VAT incl.): ${money(Math.round(sumMinor * 1.05))} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN complete. Re-run with --commit.')
    return
  }

  const orderPayload = {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [ORDER.paymentNote, ORDER.marker, 'Peptide Gel Mask 39g (00012) x100'].join(' | '),
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
    vatIncluded: false,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions,
  }

  const order = await api('POST', '/entity/customerorder', orderPayload)
  console.log()
  console.log(`  Created order: ${order.name} | ${(order.sum / 100).toFixed(2)} AED | id=${order.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  const invPayload = {
    moment: ORDER.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: false,
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

  console.log(`  Created invoice: ${invoice.name} | ${(invoice.sum / 100).toFixed(2)} AED | id=${invoice.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

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
