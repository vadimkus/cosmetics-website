#!/usr/bin/env node

/**
 * Mr. Dilman — new customer + retail SO only (no invoice/shipment).
 *
 *   00188 Microbiome Mist 80ml ×1 @ 160 −10%
 *   00122 Multi-Vita Radiance Cream 50g ×1 @ 290 −10%
 *   00194 Multi Vita Radiance Serum 30ml ×1 @ 330 −10%
 *   54457 Ultra Shield SPF50 50g ×1 @ 260 −10%
 *   Delivery Dubai ×1 @ 45 (no discount)
 *   Total: 981 AED
 *
 *   Phone: 0522774601
 *
 *   node --import dotenv/config scripts/moysklad-create-mr-dilman-retail-so-20260802.js
 *   node --import dotenv/config scripts/moysklad-create-mr-dilman-retail-so-20260802.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

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
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const CUSTOMER = {
  name: 'Mr. Dilman',
  phone: '+9715222774601',
  city: 'Dubai',
  street: 'UAE',
}

const ORDER_NAME = `GENCardM${uaeShortDate()}4601`
const MARKER = `MR-DILMAN-RETAIL-SO-10PCT-${uaeToday()}`

/** [code, qty, retailAed, discountPct] */
const PRODUCT_LINES = [
  ['00188', 1, 160, 10], // Microbiome Mist 80ml
  ['00122', 1, 290, 10], // Multi-Vita Radiance Cream 50g
  ['00194', 1, 330, 10], // Multi Vita Radiance Serum 30ml
  ['54457', 1, 260, 10], // Ultra Shield SPF50 (user price 260)
]
const DELIVERY_AED = 45
const DELIVERY_DISCOUNT = 0
const EXPECTED_SUM_MINOR = 98100 // 144+261+297+234+45

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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

function lineNet(priceMinor, qty, discountPct) {
  return Math.round((priceMinor * qty * (100 - discountPct)) / 100)
}

function shipmentAddress() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
    addInfo: '',
  }
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
    })
  }
  return stock
}

async function findOrCreateCustomer() {
  for (const q of [CUSTOMER.phone, '0522774601', 'Dilman']) {
    const d = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=15`)
    const hit = (d.rows || []).find(
      (r) =>
        /dilman/i.test(r.name || '') ||
        String(r.phone || '').replace(/\D/g, '').endsWith('5222774601') ||
        String(r.phone || '').replace(/\D/g, '').endsWith('22774601'),
    )
    if (hit) {
      console.log(`  Customer exists: ${hit.name} (${hit.id})`)
      return hit
    }
  }
  if (!COMMIT) {
    console.log(`  DRY RUN: would create ${CUSTOMER.name}`)
    return { id: 'DRY-RUN', name: CUSTOMER.name }
  }
  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    companyType: 'individual',
    actualAddress: 'Dubai, UAE',
    actualAddressFull: shipmentAddress(),
    description: `Retail customer. Phone ${CUSTOMER.phone}.`,
  })
  console.log(`  Created customer: ${created.name} (${created.id})`)
  return created
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER_NAME)}&limit=1`,
  )
  if (existing?.rows?.length) throw new Error(`Order name taken: ${ORDER_NAME}`)
}

async function ensureNoDuplicate(agentId) {
  if (agentId === 'DRY-RUN') return
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate order ${dup.name} (${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(retailAed * 100)
    sumMinor += lineNet(priceMinor, qty, discountPct)
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: discountPct,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
      _label: item.name,
      _avail: item.available,
    })
  }
  const deliveryMinor = Math.round(DELIVERY_AED * 100)
  sumMinor += lineNet(deliveryMinor, 1, DELIVERY_DISCOUNT)
  positions.push({
    quantity: 1,
    price: deliveryMinor,
    discount: DELIVERY_DISCOUNT,
    assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
  })
  return { positions, sumMinor }
}

async function exportOrderPdf(orderId, orderName) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const body = {
    template: {
      meta: {
        href: `${API}/entity/customerorder/metadata/customtemplate/${ORDER_PROFORMA_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/customerorder/${orderId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const out = path.join(ORDERS_DIR, `GENOSYS_Mr_Dilman_${orderName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Mr. Dilman — retail SO only (−10% products)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await findOrCreateCustomer()
  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicate(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)

  console.log(`  Order: ${ORDER_NAME}`)
  console.log(`  Phone: ${CUSTOMER.phone}`)
  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    const net = (retailAed * qty * (100 - discountPct)) / 100
    console.log(
      `    ${code} ${item.name.slice(0, 48)} x${qty} @ ${retailAed} −${discountPct}% → ${net.toFixed(2)} (avail ${item.available})`,
    )
  }
  console.log(`    Delivery Dubai x1 @ ${DELIVERY_AED} (no discount)`)
  console.log(`  Total: ${money(sumMinor)} AED | SO only`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const orderPositions = positions.map(({ quantity, price, discount, assortment, vat, vatEnabled }) => ({
    quantity,
    price,
    discount,
    assortment,
    vat,
    vatEnabled,
  }))

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER_NAME,
    moment: uaeMomentNow(),
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipmentAddress(),
    description: [
      MARKER,
      'Retail SO only — no invoice/shipment.',
      'Mist 80 + radiance cream 50g + radiance serum + SPF50 @ user prices; 10% off products; delivery 45 full.',
      `Phone ${CUSTOMER.phone}. Total ${money(sumMinor)} AED.`,
    ].join('\n'),
    positions: orderPositions,
  })

  if ((order.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Order sum ${money(order.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  const pdfPath = await exportOrderPdf(order.id, order.name)
  console.log(`\n  Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  Customer: https://online.moysklad.ru/app/#company/edit?id=${agent.id}`)
  console.log(`  Order:    https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
