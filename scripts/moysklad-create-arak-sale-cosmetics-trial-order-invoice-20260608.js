#!/usr/bin/env node

/**
 * ARAK SALE OF COSMETICS L.L.C — trial wholesale order + invoice (clinic list / proforma).
 * Prepaid trial — no shipment until payment.
 *
 *   node --import dotenv/config scripts/moysklad-create-arak-sale-cosmetics-trial-order-invoice-20260608.js
 *   node --import dotenv/config scripts/moysklad-create-arak-sale-cosmetics-trial-order-invoice-20260608.js --commit
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
const DELIVERY_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'

const AGENT_ID = '33c7fa5e-6325-11f1-0a80-1a4600828ae8' // ARAK SALE OF COSMETICS L.L.C

const ORDER = {
  name: `GENCardM${uaeShortDate()}ARAK`,
  moment: uaeMomentNow(),
  marker: `ARAK Korean House Ajman trial wholesale clinic list ${uaeToday()}`,
}

/** [code, qty] @ clinic salePrice from stock report */
const PRODUCT_LINES = [
  ['00063', 48],
  ['00140', 48],
  ['54467', 2],
  ['00021', 12],
  ['00022', 6],
  ['00041', 12],
  ['00188', 12],
  ['00129', 8],
  ['00122', 6],
  ['00194', 4],
  ['00189', 6],
  ['54458', 6],
  ['00040', 6],
  ['00144', 8],
  ['54464', 4],
]

/** FOC testers — 100% discount @ clinic list */
const TESTER_LINES = [
  ['00021', 1],
  ['00129', 1],
  ['00041', 1],
  ['00122', 1],
  ['00144', 1],
]

const DELIVERY_AED = 45

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
  const street = full?.addInfo || agent.actualAddress || 'Shop No. 17, Rashideya 3, Ajman'
  return {
    country: countryHref(),
    city: 'Ajman',
    street,
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

function productPosition(stock, code, qty, discount = 0) {
  const item = stock.get(code)
  if (!item?.id) throw new Error(`Unknown code: ${code}`)
  if (item.available < qty) throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
  if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
  return {
    quantity: qty,
    price: item.price,
    discount,
    assortment: href('product', item.id),
    vat: 5,
    vatEnabled: true,
    lineSum: Math.round(item.price * qty * (1 - discount / 100)),
  }
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0

  for (const [code, qty] of PRODUCT_LINES) {
    const pos = productPosition(stock, code, qty, 0)
    sumMinor += pos.lineSum
    positions.push(pos)
  }

  for (const [code, qty] of TESTER_LINES) {
    const pos = productPosition(stock, code, qty, 100)
    positions.push(pos)
  }

  const deliveryMinor = Math.round(DELIVERY_AED * 100)
  sumMinor += deliveryMinor
  positions.push({
    quantity: 1,
    price: deliveryMinor,
    discount: 0,
    assortment: href('service', DELIVERY_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
    lineSum: deliveryMinor,
  })

  return { positions: positions.map(({ lineSum, ...p }) => p), sumMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  ARAK SALE OF COSMETICS — trial order + proforma invoice')
  console.log('  Pricing: clinic list (stock report salePrice, VAT incl.)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = buildShipmentAddress(agent)

  console.log(`  Order: ${ORDER.name}\n`)
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    const line = (item.price * qty) / 100
    console.log(`    ${code} ${item.name.slice(0, 46)} x${qty} @ ${money(item.price)} → ${line.toFixed(2)}`)
  }
  for (const [code] of TESTER_LINES) {
    const item = stock.get(code)
    console.log(`    ${code} ${item.name.slice(0, 46)} x1 FOC (tester)`)
  }
  console.log(`    (service) Excellent Delivery x1 @ ${DELIVERY_AED.toFixed(2)} AED`)
  console.log(`\n  Total (paid lines + delivery): ${money(sumMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const desc = [
    ORDER.marker,
    'Korean House Ajman trial wholesale prepaid proforma.',
    '176 units + 5 FOC testers; clinic list; deliver after payment.',
    'Shop No. 17, Rashideya 3, Ajman.',
  ].join(' | ')

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: ORDER.moment,
    description: desc,
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

  console.log(`\n  Order: ${order.name} | ${money(order.sum)} AED`)
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
    description: `Proforma invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  }

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  } catch {
    delete invPayload.positions
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  }

  console.log(`  Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
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
