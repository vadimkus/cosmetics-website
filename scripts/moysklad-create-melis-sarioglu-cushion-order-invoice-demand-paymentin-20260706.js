#!/usr/bin/env node

/**
 * Melis Sarioglu — Paloma Tower app 1204 — full retail cycle, paid:
 *   order → invoice → shipment → paymentin → retail PDF
 *
 *   00144 Cushion #2 Beige x1 @ 300 AED (retail)
 *   Excellent Delivery Dubai x1 @ 45 AED, 100% discount (free)
 *   Total: 300 AED
 *
 * Counterparty: 459c91ad-edf6-11ef-0a80-1637000fd433
 *
 *   node --import dotenv/config scripts/moysklad-create-melis-sarioglu-cushion-order-invoice-demand-paymentin-20260706.js
 *   node --import dotenv/config scripts/moysklad-create-melis-sarioglu-cushion-order-invoice-demand-paymentin-20260706.js --commit
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
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const AGENT_ID = '459c91ad-edf6-11ef-0a80-1637000fd433' // Melis Sarioglu

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const PHONE = '0504316552'
const SHIPMENT = {
  city: 'Dubai Marina',
  street: 'Paloma Tower, app 1204',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}6552`,
  moment: uaeMomentNow(),
  marker: `MELIS-SARIOGLU-CUSHION-RETAIL-${uaeToday()}`,
}

const PRODUCT_LINES = [['00144', 1, 300]]
const DELIVERY_AED = 45
const DELIVERY_DISCOUNT = 100
const EXPECTED_SUM_MINOR = 30000

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

function orgAccountHref(accountId) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${accountId}`,
      type: 'account',
      mediaType: 'application/json',
    },
  }
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
  return { country: countryHref(), city: SHIPMENT.city, street: SHIPMENT.street }
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

async function loadAndUpdateCounterparty() {
  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name} | ${agent.phone || '—'}`)
  console.log(`  Address: ${SHIPMENT.street}, ${SHIPMENT.city}`)
  if (!COMMIT) return agent
  const addr = shipmentAddress()
  await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    meta: agent.meta,
    phone: PHONE,
    actualAddressFull: addr,
    legalAddressFull: addr,
  })
  return agent
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

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(retailAed * 100)
    sumMinor += priceMinor * qty
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
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

async function exportInvoicePdf(invoiceId) {
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
  return Buffer.from(await pdfRes.arrayBuffer())
}

function ordersPdfPath(invoiceName) {
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  return path.join(ordersDir, `GENOSYS_Melis_Sarioglu_${safe}.pdf`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Melis Sarioglu — SO → invoice → shipment → paymentin (paid)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await loadAndUpdateCounterparty()
  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday()

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = shipmentAddress()

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(`    ${code} ${item.name} x${qty} @ ${retailAed.toFixed(2)} AED`)
  }
  console.log(
    `    Excellent Delivery Dubai x1 @ ${DELIVERY_AED.toFixed(2)} AED (${DELIVERY_DISCOUNT}% discount)`
  )
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
  const t3 = uaeMomentAddMinutes(5)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    shared: true,
    description: [
      ORDER.marker,
      'Cushion Beige 00144 x1 @ 300 retail; delivery Dubai 100% off. Paid — paymentin posted.',
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

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: t3,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: `Incoming payment for shipment ${demand.name} / ${ORDER.name} | ${ORDER.marker} | paid`,
    sum: sumMinor,
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${demand.id}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: sumMinor,
      },
    ],
  })
  console.log(`  4) Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  await api('PUT', `/entity/customerorder/${order.id}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const demandRead = await api('GET', `/entity/demand/${demand.id}`)
  console.log('\n  Verification:')
  console.log(`    Shipment payedSum: ${money(demandRead.payedSum)} / ${money(demandRead.sum)} AED`)
  console.log(`    Order → Доставлен`)

  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (pdfBuf) {
    const outPath = ordersPdfPath(invoice.name)
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`    PDF: ${outPath}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
