#!/usr/bin/env node

/**
 * Miss Vlada — retail SO → invoice → shipment (no paymentin).
 *
 *   00024 Snow O₂ Cleanser 500ml x1 @ 510 retail
 *   00144 Cushion #2 Beige x1 @ 300 retail
 *   54460 Moisture Replenishing Hyaluron Cream 250g x1 @ 420 retail
 *     (user: "230g" — mapped to pro 250g tub 54460; no 230g hyaluron SKU)
 *   00063 Collagen mask x1 @ 36 retail, 100% discount (free)
 *   00140 Sea algae mask x1 @ 36 retail, 100% discount (free)
 *   Excellent Delivery Dubai x1 @ 45, 100% discount (free)
 *   Total: 1230 AED
 *
 *   Ship: Arjan, Damac Lincoln Park Westside, flat 630, Dubai
 *
 *   node --import dotenv/config scripts/moysklad-create-miss-vlada-retail-order-invoice-demand-20260708.js
 *   node --import dotenv/config scripts/moysklad-create-miss-vlada-retail-order-invoice-demand-20260708.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const CUSTOMER = {
  name: 'Miss Vlada',
  phone: '+971585843363',
  city: 'Dubai',
  street: 'Arjan, Damac Lincoln Park Westside, flat 630',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}6363`,
  moment: uaeMomentNow(),
  marker: `MISS-VLADA-RETAIL-${uaeToday()}`,
}

/** [code, qty, retailAed, discountPercent] */
const PRODUCT_LINES = [
  ['00024', 1, 510, 0],
  ['00144', 1, 300, 0],
  ['54460', 1, 420, 0],
  ['00063', 1, 36, 100],
  ['00140', 1, 36, 100],
]

const DELIVERY_AED = 45
const DELIVERY_DISCOUNT = 100
const EXPECTED_SUM_MINOR = 123000

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
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
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

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function lineNet(priceMinor, qty, discountPct) {
  return Math.round((priceMinor * qty * (100 - discountPct)) / 100)
}

function shipmentAddress() {
  return { country: countryHref(), city: CUSTOMER.city, street: CUSTOMER.street }
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

async function findExistingCounterparty() {
  const byName = await api(
    'GET',
    `/entity/counterparty?filter=name=${encodeURIComponent(CUSTOMER.name)}&limit=10`
  )
  const exact = (byName?.rows || []).find((r) => r.name === CUSTOMER.name)
  if (exact) return exact

  const bySearch = await api(
    'GET',
    `/entity/counterparty?search=${encodeURIComponent(CUSTOMER.phone)}&limit=10`
  )
  return (
    (bySearch?.rows || []).find((r) => r.phone === CUSTOMER.phone || r.name === CUSTOMER.name) || null
  )
}

async function findOrCreateCounterparty() {
  const existing = await findExistingCounterparty()
  if (existing) {
    console.log(`  Counterparty (existing): ${existing.name} (${existing.id})`)
    if (COMMIT) {
      const addr = shipmentAddress()
      await api('PUT', `/entity/counterparty/${existing.id}`, {
        meta: existing.meta,
        phone: CUSTOMER.phone,
        actualAddressFull: addr,
        legalAddressFull: addr,
      })
    }
    return existing
  }

  if (!COMMIT) {
    console.log(`  DRY RUN: would create counterparty "${CUSTOMER.name}" (${CUSTOMER.phone})`)
    return { id: 'DRY-RUN', name: CUSTOMER.name }
  }

  const addr = shipmentAddress()
  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    companyType: 'individual',
    description: `Retail customer — created with order ${ORDER.name}`,
    actualAddressFull: addr,
    legalAddressFull: addr,
  })
  console.log(`  Counterparty (created): ${created.name} (${created.id})`)
  return created
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
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
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

async function exportInvoicePdf(invoiceId, invoiceName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_RETAIL_PRINT_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ordersDir, `GENOSYS_Miss_Vlada_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Vlada — SO → invoice → shipment (retail)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  ${CUSTOMER.name} | ${CUSTOMER.phone}`)
  console.log(`  Ship: ${CUSTOMER.street}, ${CUSTOMER.city}`)

  const agent = await findOrCreateCounterparty()
  await ensureOrderNameFree()
  if (COMMIT && agent.id !== 'DRY-RUN') await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = shipmentAddress()

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    const disc = discountPct ? `, ${discountPct}% off` : ''
    console.log(`    ${code} ${item.name} x${qty} @ ${retailAed.toFixed(2)} AED${disc}`)
  }
  console.log(`    Excellent Delivery Dubai x1 @ ${DELIVERY_AED.toFixed(2)} AED, ${DELIVERY_DISCOUNT}% off`)
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

  if (Math.abs(sumMinor - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Total mismatch: ${money(sumMinor)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

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
    shared: true,
    description: [
      ORDER.marker,
      '00024 cleanser 500ml, 00144 cushion beige, 54460 hyaluron 250g @ retail; collagen + sea algae masks FOC; delivery free.',
      `Ship: ${shipment.street}, ${shipment.city}.`,
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions,
  })
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  const invoice = await api('POST', '/entity/invoiceout', {
    moment: t1,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    customerOrder: href('customerorder', order.id),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  })

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

  const invPos = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
  const demandPositions = invPos.map((p) => ({
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
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull: shipment,
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  if (pdfPath) console.log(`\n  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
