#!/usr/bin/env node

/**
 * Lips for Kiss Clinic — SO + invoice + shipment.
 *
 * Lines @ clinic salePrice:
 *   Soothing Repair Post Cream 20g (00038) x20
 *     — client text "2g"; catalog SKU is 20g tube (no 2g SKU).
 *   Multi Sun Cream SPF40/PA++ 40g (00041) x5
 *
 *   node --import dotenv/config scripts/moysklad-create-lips-for-kiss-postcream-spf40-order-invoice-demand-20260608.js
 *   node --import dotenv/config scripts/moysklad-create-lips-for-kiss-postcream-spf40-order-invoice-demand-20260608.js --commit
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

const AGENT_ID = '9038b70d-c52f-11f0-0a80-0bc5000a2226' // Lips for Kiss Clinic

const ORDER = {
  name: `GENCardM${uaeShortDate()}LFK`,
  moment: uaeMomentNow(),
  marker: `Lips for Kiss post cream 20g x20 SPF40 x5 ${uaeToday()}`,
}

const PRODUCT_LINES = [
  ['00038', 20], // Soothing Repair Post Cream 20g (client wrote 2g)
  ['00041', 5], // Multi Sun Cream SPF40/PA++ 40g
]

const POST_CREAM_LOOSE = '00038'
const POST_CREAM_BOX = '00039'
const VIALS_PER_BOX = 12

async function ensurePostCreamStock(stock, needed, commit) {
  const loose = stock.get(POST_CREAM_LOOSE)
  if (!loose?.id) throw new Error(`Missing ${POST_CREAM_LOOSE}`)
  if (loose.available >= needed) return

  const shortage = needed - loose.available
  const box = stock.get(POST_CREAM_BOX)
  if (!box?.id) throw new Error(`Missing ${POST_CREAM_BOX} for unpack`)
  const boxesNeeded = Math.ceil(shortage / VIALS_PER_BOX)
  if (box.available < boxesNeeded) {
    throw new Error(
      `Insufficient post cream: need ${needed}×${POST_CREAM_LOOSE}, have ${loose.available} loose + ${box.available} boxes (${POST_CREAM_BOX})`
    )
  }

  console.log(
    `\n  Stock prep: unpack ${boxesNeeded}×${POST_CREAM_BOX} → enter ${shortage}×${POST_CREAM_LOOSE} (have ${loose.available} loose)`
  )

  if (!commit) {
    loose.available += shortage
    box.available -= boxesNeeded
    return
  }

  const moment = uaeMomentNow()
  const lossPositions = [
    {
      quantity: boxesNeeded,
      assortment: href('product', box.id),
    },
  ]
  const enterPositions = [
    {
      quantity: shortage,
      price: Math.round((loose.price || 10200) * 0.183), // ~buy cost per vial from box economics; use product buyPrice
      assortment: href('product', loose.id),
    },
  ]

  const looseProduct = await api('GET', `/entity/product/${loose.id}`)
  enterPositions[0].price = looseProduct.buyPrice?.value || 1866

  const loss = await api('POST', '/entity/loss', {
    moment,
    applicable: true,
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    description: `Unpack ${boxesNeeded}× post cream box → ${shortage}×20g for ${ORDER.name}`,
    positions: lossPositions,
  })
  console.log(`  Stock: loss ${loss.name} (${boxesNeeded}× box ${POST_CREAM_BOX})`)

  const enter = await api('POST', '/entity/enter', {
    moment,
    applicable: true,
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    description: `Enter ${shortage}× post cream 20g from box unpack for ${ORDER.name}`,
    positions: enterPositions,
  })
  console.log(`  Stock: enter ${enter.name} (${shortage}× ${POST_CREAM_LOOSE})`)

  loose.available += shortage
  box.available -= boxesNeeded
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
  return {
    country: countryHref(),
    city: 'Dubai',
    street: full?.addInfo || agent.actualAddress || 'DIFC — Lips for Kiss Clinic',
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
  if (dup) throw new Error(`Duplicate: ${dup.name} (${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
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
  return { positions, sumMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  Lips for Kiss Clinic — SO + invoice + shipment')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const postQty = PRODUCT_LINES.find(([c]) => c === POST_CREAM_LOOSE)?.[1] || 0
  await ensurePostCreamStock(stock, postQty, COMMIT)
  const { positions, sumMinor } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(`    ${code} ${item.name} x${qty} @ ${money(item.price)} → ${money(item.price * qty)}`)
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

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
      'Post cream 00038 x20 (20g SKU; client text 2g), SPF40 00041 x5.',
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
  } catch (e) {
    console.warn('  Invoice with positions failed:', e.message.slice(0, 180))
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
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
