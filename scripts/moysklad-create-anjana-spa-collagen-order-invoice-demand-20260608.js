#!/usr/bin/env node

/**
 * ANJANA SPA - FZE — SO + invoice + shipment.
 *
 *   Collagen mask 00063 x100 @ clinic 18.00 AED + discount → 14.50 AED/pc net
 *   Deliver: Rixos Premium Saadiyat Island, Abu Dhabi
 *
 *   node --import dotenv/config scripts/moysklad-create-anjana-spa-collagen-order-invoice-demand-20260608.js
 *   node --import dotenv/config scripts/moysklad-create-anjana-spa-collagen-order-invoice-demand-20260608.js --commit
 *   node --import dotenv/config scripts/moysklad-create-anjana-spa-collagen-order-invoice-demand-20260608.js --commit --redo
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
const REDO = process.argv.includes('--redo')

/** Prior flat-price run — removed on --redo */
const PREVIOUS = {
  demandId: 'f2585224-6357-11f1-0a80-17b9009031bd',
  invoiceId: 'f1b288c1-6357-11f1-0a80-16c9008fc89b',
  orderId: 'f181f052-6357-11f1-0a80-0ba600919399',
}

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const AGENT_ID = 'd5532af5-6356-11f1-0a80-08090090f8b4' // ANJANA SPA - FZE

const PRODUCT_CODE = '00063'
const QTY = 100
const LIST_AED = 18
const NET_AED = 14.5
const DISCOUNT_PCT = Number((((LIST_AED - NET_AED) / LIST_AED) * 100).toFixed(4))

const ORDER = {
  name: `GENCardM${uaeShortDate()}ANJ`,
  moment: uaeMomentNow(),
  marker: `Anjana Spa collagen 00063 x100 list18 disc→14.5 ${uaeToday()}`,
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

async function fetchProduct() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const row = rows.find((r) => r.code === PRODUCT_CODE)
  if (!row) throw new Error(`Stock not found for ${PRODUCT_CODE}`)
  return {
    id: row.meta?.href?.split('/').pop()?.split('?')[0],
    code: row.code,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
    listPrice: Number(row.salePrice || 0),
  }
}

function buildShipmentAddress(agent) {
  const street =
    agent.actualAddress ||
    agent.legalAddress ||
    agent.actualAddressFull?.addInfo ||
    'Anjana Spa at Rixos Premium Saadiyat Island, Abu Dhabi'
  return {
    country: countryHref(),
    city: 'Abu Dhabi',
    street,
  }
}

async function deletePreviousDocs() {
  console.log('\n  --redo: deleting prior flat-price documents…')
  for (const [label, type, id] of [
    ['shipment 06323', 'demand', PREVIOUS.demandId],
    ['invoice 04645', 'invoiceout', PREVIOUS.invoiceId],
    ['order GENCardM260608ANJ', 'customerorder', PREVIOUS.orderId],
  ]) {
    try {
      await api('DELETE', `/entity/${type}/${id}`)
      console.log(`    deleted ${label}`)
    } catch (e) {
      console.log(`    skip ${label}: ${e.message.slice(0, 120)}`)
    }
  }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length && !(REDO && existing.rows[0].id === PREVIOUS.orderId)) {
    throw new Error(`Order name already taken: ${ORDER.name}`)
  }
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

function buildPositions(product) {
  if (product.available < QTY) {
    throw new Error(`Insufficient ${PRODUCT_CODE}: need ${QTY}, have ${product.available}`)
  }
  const priceMinor = Math.round(LIST_AED * 100)
  const lineMinor = Math.round(priceMinor * QTY * (1 - DISCOUNT_PCT / 100))
  const positions = [
    {
      quantity: QTY,
      price: priceMinor,
      discount: DISCOUNT_PCT,
      assortment: href('product', product.id),
      vat: 5,
      vatEnabled: true,
    },
  ]
  return { positions, sumMinor: lineMinor, unitNetMinor: Math.round(lineMinor / QTY) }
}

async function main() {
  console.log('====================================================================')
  console.log('  ANJANA SPA - FZE — SO + invoice + shipment')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name}`)

  if (COMMIT && REDO) await deletePreviousDocs()

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const product = await fetchProduct()
  const { positions, sumMinor, unitNetMinor } = buildPositions(product)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  console.log(`  Deliver: ${shipmentAddressFull.street}`)
  console.log(
    `    ${PRODUCT_CODE} ${product.name} x${QTY} @ ${LIST_AED.toFixed(2)} − ${DISCOUNT_PCT}% → ${(unitNetMinor / 100).toFixed(2)}/pc net → ${money(sumMinor)} AED`
  )

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = ORDER.moment
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    description: [
      ORDER.marker,
      `Collagen mask 00063 x${QTY} @ ${LIST_AED} AED list, ${DISCOUNT_PCT}% disc → ${NET_AED} AED/pc net.`,
      'Deliver: Rixos Premium Saadiyat Island, Abu Dhabi.',
      'Chain: invoice → shipment.',
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
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agent.id),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
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
      agent: href('counterparty', agent.id),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

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
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', DEMAND_STATE_SHIPPED_ID),
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
