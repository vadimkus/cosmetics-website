#!/usr/bin/env node

/**
 * X BEAUTY CONSULTING - F.Z.C — same basket as Miss Nadi order @ clinic (оптовая) prices.
 *
 * Lines:
 *   Beige cushion (00144) ×1
 *   Camel cushion (54464) ×1
 *   PDRN mask pack (54467) ×1
 *   EZ CO₂ box (00011) ×1
 *   Overnight mask (00189) ×1
 *   Delivery Dubai ×1 @ 45
 *
 *   node --import dotenv/config scripts/moysklad-create-x-beauty-mirror-nadi-order-20260612.js
 *   node --import dotenv/config scripts/moysklad-create-x-beauty-mirror-nadi-order-20260612.js --commit
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
const AGENT_ID = '03c174b0-4581-11ea-0a80-01f80012b189'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const DELIVERY_AED = 45
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'

const CUSTOMER = {
  name: 'X BEAUTY CONSULTING - F.Z.C',
  phone: '+971585181778',
  city: 'Ajman',
  street: 'Office - BLV - 6F - SF60836, Ajman Boulevard-A Building',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}1778`,
  moment: uaeMomentNow(),
  marker: `X-BEAUTY-MIRROR-NADI-CLINIC-${uaeToday()}`,
}

/** [code, qty] — clinic price from MoySklad stock salePrice (оптовая) */
const PRODUCT_LINES = [
  ['00144', 1],
  ['54464', 1],
  ['54467', 1],
  ['00011', 1],
  ['00189', 1],
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

function stateHref(entityType, id) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${id}`,
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
      price: Number(row.salePrice || 0),
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }
  return stock
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  console.log('\n  Lines @ clinic (оптовая):')
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    if (item.available < qty) {
      console.warn(`  WARN: ${code} low stock — need ${qty}, have ${item.available}`)
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
    console.log(
      `    ${code} ${item.name.slice(0, 48)} x${qty} @ ${money(item.price)} → ${money(item.price * qty)} AED`
    )
  }
  const deliveryMinor = Math.round(DELIVERY_AED * 100)
  positions.push({
    quantity: 1,
    price: deliveryMinor,
    discount: 0,
    assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
  })
  sumMinor += deliveryMinor
  console.log(`    Delivery Dubai x1 @ ${DELIVERY_AED.toFixed(2)} AED`)
  return { positions, sumMinor }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday() {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

async function exportOrderPdf(orderId) {
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
  if (res.status === 412) {
    const t = await res.text()
    if (/33003|шаблон/i.test(t)) return null
    throw new Error(`Order export 412: ${t.slice(0, 600)}`)
  }
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Order export HTTP ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function ordersPdfPath(orderName) {
  const safe = String(orderName || 'order').replace(/[^\w.-]+/g, '_')
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  return path.join(ordersDir, `GENOSYS_X_Beauty_${safe}.pdf`)
}

async function main() {
  console.log('====================================================================')
  console.log('  X BEAUTY CONSULTING — customer order (Miss Nadi basket, clinic prices)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Customer: ${CUSTOMER.name}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (agent.name !== CUSTOMER.name) {
    console.warn(`  WARN: agent name is "${agent.name}"`)
  }

  if (COMMIT) {
    await ensureNoDuplicateToday()
    await ensureOrderNameFree()
  }

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = { country: countryHref(), city: CUSTOMER.city, street: CUSTOMER.street }

  console.log(`\n  Order: ${ORDER.name}`)
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: ORDER.moment,
    shared: true,
    description: [
      ORDER.marker,
      'Same lines as Miss Nadi GENCardM2606127701 @ clinic list (оптовая). Beige+Camel cushion, PDRN, EZ CO₂ box, overnight, delivery 45.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions,
  })

  console.log(`\n  Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  console.log('\n  Exporting order PDF (Genosys_Invoice_PROFORMA)...')
  const pdfBuf = await exportOrderPdf(order.id)
  if (!pdfBuf) {
    console.warn('  MoySklad returned no PDF — open order in UI to export.')
    return
  }
  const outPath = ordersPdfPath(order.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
