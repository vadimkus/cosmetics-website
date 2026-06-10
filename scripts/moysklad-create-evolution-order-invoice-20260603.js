#!/usr/bin/env node

/**
 * Evolution Aesthetics Clinic — order + invoice.
 *
 *   node --import dotenv/config scripts/moysklad-create-evolution-order-invoice-20260603.js
 *   node --import dotenv/config scripts/moysklad-create-evolution-order-invoice-20260603.js --commit
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

const AGENT_ID = '89d4bfbd-81d1-11ed-0a80-0ffb0008d1c5' // Evolution Aesthetics Clinic

/** [code, qty] @ list salePrice from stock report */
const PRODUCT_LINES = [
  ['00021', 3], // Snow O₂ Cleanser 180ml
  ['00022', 3], // Snow Booster Toner 200ml
  ['00129', 2], // EPI Turnover Boosting Peeling Gel 100g
  ['00037', 2], // Skin Barrier Protecting Cream 100g
  ['54457', 4], // Ultra Shield Sun Cream SPF50
  ['00144', 2], // BB Cushion #2 Beige
  ['00053', 2], // EyeCell Eye Peptide Gel Patch (box)
  ['00063', 10], // Intensive Repair Collagen Mask 23g
  ['00140', 10], // Soothing Bomb Sea Algae Mask 23g
  ['00012', 10], // Peptide Gel Mask 39g
]

const ORDER = {
  name: `GENCardM${uaeShortDate()}5842`,
  moment: uaeMomentNow(),
  marker: `Evolution Aesthetics Clinic retail order invoice ${uaeToday()}`,
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
  const addInfo = full?.addInfo || agent.actualAddress?.addInfo || '49 Umm Al Sheif Rd, Jumeirah 3, Dubai'
  return {
    country: countryHref(),
    city: 'Dubai',
    street: addInfo,
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
  const positions = []
  let sumMinor = 0
  const lines = []

  for (const [code, qty] of PRODUCT_LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Product not found in stock report: ${code}`)
    if (row.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${row.available}`)
    }
    positions.push({
      quantity: qty,
      price: row.price,
      discount: 0,
      assortment: href('product', row.id),
      vat: 5,
      vatEnabled: true,
    })
    const lineMinor = row.price * qty
    sumMinor += lineMinor
    lines.push({ code, name: row.name, qty, price: row.price, lineMinor })
  }

  return { positions, sumMinor, lines }
}

async function main() {
  console.log('====================================================================')
  console.log('  Evolution Aesthetics Clinic — order + invoice')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name}`)
  console.log(`  Phone: ${agent.phone || '—'}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor, lines } = buildPositions(stock)
  const shipment = buildShipmentAddress(agent)

  console.log()
  for (const l of lines) {
    console.log(
      `    ${l.code} ${l.name.slice(0, 44).padEnd(44)} x${String(l.qty).padStart(2)} @ ${money(l.price)} → ${money(l.lineMinor)}`
    )
  }
  console.log(`  Expected total (VAT incl.): ${money(sumMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const orderPayload = {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [
      ORDER.marker,
      'Snow O2 180×3, Snow Booster 200×3, EPI peeling×2, Skin barrier×2, SPF50×4, Cushion Beige×2, Eyepatch×2, Collagen×10, Sea algae×10, Peptide×10.',
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
