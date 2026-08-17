#!/usr/bin/env node

/**
 * ANJANA SPA - FZE — SO + invoice + shipment (2026-08-04).
 *
 *   Collagen mask 00063 ×50 @ list 18 → 14.50 net
 *   Sea Algae mask 00140 ×50 @ list 18 → 14.50 net
 *   Delivery free
 *   Deliver: Rixos Premium Saadiyat Island, Abu Dhabi
 *   Total: 1,450.00 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-anjana-spa-masks-order-invoice-demand-20260804.js
 *   node --import dotenv/config scripts/moysklad-create-anjana-spa-masks-order-invoice-demand-20260804.js --commit
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

const AGENT_ID = 'd5532af5-6356-11f1-0a80-08090090f8b4' // ANJANA SPA - FZE

const LIST_AED = 18
const NET_AED = 14.5
const DISCOUNT_PCT = Number((((LIST_AED - NET_AED) / LIST_AED) * 100).toFixed(4))

/** [code, qty, label] — green → collagen (other 14.50 sheet mask); sea algae → 00140 */
const LINES = [
  ['00063', 50, 'Intensive Repair Collagen Mask'],
  ['00140', 50, 'Soothing Bomb Sea Algae Mask'],
]

const EXPECTED_SUM_MINOR = 145000 // 100 × 14.50

const ORDER = {
  name: `GENCardM${uaeShortDate()}ANJ`,
  moment: uaeMomentNow(),
  marker: `Anjana Spa collagen×50+sea×50 list18→14.5 free-del ${uaeToday()}`,
}

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
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

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`,
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
  if (dup) throw new Error(`Duplicate: ${dup.name} (${dup.id})`)
}

async function resolveProducts() {
  const stockRows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const byCode = new Map()
  for (const row of stockRows) {
    if (!row.code) continue
    byCode.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }
  return LINES.map(([code, qty, label]) => {
    const p = byCode.get(code)
    if (!p?.id) throw new Error(`Unknown product ${code}`)
    if (p.available < qty) throw new Error(`Insufficient ${code}: need ${qty}, have ${p.available}`)
    return { ...p, qty, label }
  })
}

function buildPositions(products) {
  const priceMinor = Math.round(LIST_AED * 100)
  const positions = products.map((p) => ({
    quantity: p.qty,
    price: priceMinor,
    discount: DISCOUNT_PCT,
    assortment: href('product', p.id),
    vat: 5,
    vatEnabled: true,
  }))
  const sumMinor = products.reduce(
    (s, p) => s + Math.round(priceMinor * p.qty * (1 - DISCOUNT_PCT / 100)),
    0,
  )
  return { positions, sumMinor }
}

function buildShipmentAddress(agent) {
  const street =
    agent.actualAddress ||
    agent.legalAddress ||
    'Anjana Spa at Rixos Premium Saadiyat Island, Abu Dhabi'
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: 'Abu Dhabi',
    street,
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  ANJANA SPA - FZE — SO + invoice + shipment (masks)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const products = await resolveProducts()
  const { positions, sumMinor } = buildPositions(products)
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  console.log(`  Deliver: ${shipmentAddressFull.street} (free delivery)`)
  for (const p of products) {
    console.log(
      `    ${p.code} ${p.label} x${p.qty} @ ${LIST_AED.toFixed(2)} − ${DISCOUNT_PCT}% → ${NET_AED.toFixed(2)}/pc`,
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED`)

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
      'Collagen 00063 x50 + Sea Algae 00140 x50 @ 18 list → 14.50 net.',
      'Free delivery — Rixos Premium Saadiyat Island, Abu Dhabi.',
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
    description: `Shipment for ${invoice.name} | ${ORDER.marker} | free delivery`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
