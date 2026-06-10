#!/usr/bin/env node

/**
 * Brau Ladies Salon LLC — 3× separate SO + invoice + shipment.
 * Peptide Gel Mask 39g (00012) @ clinic list (38 AED VAT incl.)
 *
 *   Order 1: 25 pcs — deliver Abu Dhabi
 *   Order 2: 25 pcs — deliver Jumeirah
 *   Order 3: 10 pcs — deliver Springs Souk
 *
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-peptide-orders-20260608.js
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-peptide-orders-20260608.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const AGENT_ID = 'ce7c406d-dadf-11ee-0a80-130f00597aa2' // Brau Ladies Salon LLC
const PRODUCT_CODE = '00012'
const BASE_MARKER = `Brau Ladies peptide gel mask ${uaeToday()}`

const ORDERS = [
  {
    suffix: 'AD25',
    qty: 25,
    location: 'Abu Dhabi',
    city: 'Abu Dhabi',
    street: 'Abu Dhabi — Brau Ladies Salon delivery',
  },
  {
    suffix: 'JM25',
    qty: 25,
    location: 'Jumeirah',
    city: 'Dubai',
    street: 'Jumeirah — Brau Ladies Salon delivery',
  },
  {
    suffix: 'SS10',
    qty: 10,
    location: 'Springs Souk',
    city: 'Dubai',
    street: 'Springs Souk — Brau Ladies Salon delivery',
  },
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

async function fetchPeptideStock() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const row = rows.find((r) => r.code === PRODUCT_CODE)
  if (!row) throw new Error(`Stock not found for ${PRODUCT_CODE}`)
  return {
    id: row.meta?.href?.split('/').pop()?.split('?')[0],
    code: row.code,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
    price: Number(row.salePrice || 0),
  }
}

function buildShipmentAddress(cfg) {
  return {
    country: countryHref(),
    city: cfg.city,
    street: cfg.street,
  }
}

function buildPositions(stock, qty, reserveStock = true) {
  if (stock.available < qty) {
    throw new Error(`Insufficient ${PRODUCT_CODE}: need ${qty}, have ${stock.available}`)
  }
  if (reserveStock) stock.available -= qty
  const positions = [
    {
      quantity: qty,
      price: stock.price,
      discount: 0,
      assortment: href('product', stock.id),
      vat: 5,
      vatEnabled: true,
    },
  ]
  return { positions, sumMinor: stock.price * qty }
}

async function ensureOrderNameFree(name) {
  const existing = await api('GET', `/entity/customerorder?filter=name=${encodeURIComponent(name)}&limit=1`)
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${name}`)
}

async function createChain(stock, cfg, index, commit) {
  const orderName = `GENCardM${uaeShortDate()}${cfg.suffix}`
  const marker = `${BASE_MARKER} ${cfg.location} x${cfg.qty}`
  const minuteOffset = index * 5
  const t0 = uaeMomentAddMinutes(minuteOffset)
  const t1 = uaeMomentAddMinutes(minuteOffset + 1)
  const t2 = uaeMomentAddMinutes(minuteOffset + 3)

  await ensureOrderNameFree(orderName)

  const { positions, sumMinor } = buildPositions(stock, cfg.qty, commit)
  const shipmentAddressFull = buildShipmentAddress(cfg)

  console.log(`\n--- Order ${index + 1}: ${cfg.location} (${cfg.qty} pcs) ---`)
  console.log(`  Name: ${orderName}`)
  console.log(`  ${PRODUCT_CODE} ${stock.name} x${cfg.qty} @ ${money(stock.price)} → ${money(sumMinor)} AED`)

  if (!commit) return null

  const order = await api('POST', '/entity/customerorder', {
    name: orderName,
    moment: t0,
    description: [
      marker,
      `Peptide Gel Mask 39g (00012) x${cfg.qty}. Delivery location: ${cfg.location}.`,
      'Chain: invoice → shipment.',
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
  console.log(`  SO: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${order.name} | ${cfg.location} | ${marker}`,
      positions,
    })
  } catch {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${order.name} | ${cfg.location} | ${marker}`,
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  console.log(`  Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

  const invPositions = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
  const demandPositions = invPositions.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  const demand = await api('POST', '/entity/demand', {
    moment: t2,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', DEMAND_STATE_SHIPPED_ID),
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} | ${cfg.location} | ${marker}`,
    positions: demandPositions,
  })
  console.log(`  Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  return { order, invoice, demand, cfg }
}

async function main() {
  console.log('====================================================================')
  console.log('  Brau Ladies Salon LLC — 3× peptide mask orders')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name}`)

  const stock = await fetchPeptideStock()
  const totalQty = ORDERS.reduce((s, o) => s + o.qty, 0)
  console.log(`  Product: ${stock.name} (${PRODUCT_CODE}) @ ${money(stock.price)} AED`)
  console.log(`  Total qty: ${totalQty} | Available: ${stock.available}`)

  if (stock.available < totalQty) {
    throw new Error(`Insufficient stock: need ${totalQty}, have ${stock.available}`)
  }

  const results = []
  for (let i = 0; i < ORDERS.length; i++) {
    if (!COMMIT) {
      await createChain(stock, ORDERS[i], i, false)
      continue
    }
    const r = await createChain(stock, ORDERS[i], i, true)
    if (r) results.push(r)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  console.log('\n  Done — 3 order / invoice / shipment chains created.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
