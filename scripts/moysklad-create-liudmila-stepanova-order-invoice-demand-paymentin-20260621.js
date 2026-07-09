#!/usr/bin/env node

/**
 * Liudmila Stepanova — fix partial MoySklad sync GENCardM2606211312 (1580.30 AED).
 *
 * Partial web sync kept only cushion + mist + promos (460 AED); beauty box was unmapped.
 * Trashes partial order, posts full chain with exploded Deep Moisturizing box.
 *
 *   node --import dotenv/config scripts/moysklad-create-liudmila-stepanova-order-invoice-demand-paymentin-20260621.js
 *   node --import dotenv/config scripts/moysklad-create-liudmila-stepanova-order-invoice-demand-paymentin-20260621.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const STATE_PAID_AWAITING_DELIVERY_ID = '909556cd-8f70-11ea-0a80-016b00219616'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const WEB_ORDER_NUMBER = 'GENCardM2606211312'
const PARTIAL_ORDER_ID = '3363b46c-6d98-11f1-0a80-17670068ccea'
const PARTIAL_INVOICE_ID = '33bf4564-6d98-11f1-0a80-17670068cd2e'
const PARTIAL_DEMAND_ID = '3433d746-6d98-11f1-0a80-194000685bba'
const PARTIAL_PAYMENTIN_ID = '34768103-6d98-11f1-0a80-16ec0067b514'
const CUSTOMER_EMAIL = 'stepanovaliudmila04@gmail.com'

const MARKER = `LIUDMILA-STEPANOVA-${WEB_ORDER_NUMBER}-FULL-CHAIN-${uaeToday()}`
const EXPECTED_TOTAL_AED = 1580.3

const SHIPMENT = {
  city: 'Dubai',
  street:
    'Al Furjan, Murooj Al Furjan East 2, villa 107, Dubai, United Arab Emirates. Landmark: gate 1 or gate 2',
}

/** [code, qty, retailAed, discountPercent] — genosys.ae retail VAT-incl. */
const PRODUCT_LINES = [
  ['00021', 1, 330, 15],
  ['00022', 1, 260, 15],
  ['00195', 1, 330, 15],
  ['54458', 1, 290, 15],
  ['00140', 3, 36, 15],
  ['00144', 1, 300, 0],
  ['00188', 1, 160, 0],
  ['00063', 1, 36, 100],
  ['00140', 1, 36, 100],
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

function lineTotalMinor(qty, priceMinor, discountPct) {
  return Math.round((qty * priceMinor * (100 - discountPct)) / 100)
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

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  const needByCode = new Map()

  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    needByCode.set(code, (needByCode.get(code) || 0) + qty)
    const priceMinor = Math.round(retailAed * 100)
    sumMinor += lineTotalMinor(qty, priceMinor, discountPct)
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: discountPct,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }

  for (const [code, need] of needByCode) {
    const item = stock.get(code)
    if (item.available < need) {
      throw new Error(`Insufficient stock ${code}: need ${need}, have ${item.available}`)
    }
  }

  return { positions, sumMinor }
}

async function findAgent() {
  const byEmail = await api(
    'GET',
    `/entity/counterparty?filter=email=${encodeURIComponent(CUSTOMER_EMAIL)}&limit=1`
  )
  if (byEmail.rows?.[0]) return byEmail.rows[0]

  const byPhone = await api(
    'GET',
    `/entity/counterparty?filter=phone=${encodeURIComponent('+971526800378')}&limit=1`
  )
  if (byPhone.rows?.[0]) return byPhone.rows[0]

  throw new Error(`Counterparty not found for ${CUSTOMER_EMAIL}`)
}

async function trashPartialChain() {
  for (const [label, type, id] of [
    ['paymentin', 'paymentin', PARTIAL_PAYMENTIN_ID],
    ['shipment', 'demand', PARTIAL_DEMAND_ID],
    ['invoice', 'invoiceout', PARTIAL_INVOICE_ID],
    ['order', 'customerorder', PARTIAL_ORDER_ID],
  ]) {
    const doc = await api('GET', `/entity/${type}/${id}`).catch(() => null)
    if (!doc || doc.deleted) {
      console.log(`  ${label} already trashed or missing (${id})`)
      continue
    }
    await api('DELETE', `/entity/${type}/${id}`)
    console.log(`  Trashed ${label} ${doc.name} (${money(doc.sum)} AED)`)
  }
}

async function ensureNoActiveChain() {
  const activeOrder = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(WEB_ORDER_NUMBER)}&limit=5`
  )
  const live = (activeOrder.rows || []).filter((r) => !r.deleted)
  if (live.length) {
    throw new Error(`Active order still exists: ${live.map((r) => `${r.name} (${r.id})`).join(', ')}`)
  }
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
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
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
  return path.join(ordersDir, `GENOSYS_Liudmila_Stepanova_${safe}.pdf`)
}

async function updateWebsiteOrder(moySkladOrderId) {
  const { PrismaClient } = require('@prisma/client')
  const dbUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
  let prisma
  if (dbUrl.startsWith('prisma+')) {
    prisma = new PrismaClient({ accelerateUrl: dbUrl })
  } else {
    const { PrismaPg } = require('@prisma/adapter-pg')
    const { Pool } = require('pg')
    prisma = new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: dbUrl })) })
  }
  await prisma.order.update({
    where: { orderNumber: WEB_ORDER_NUMBER },
    data: { moySkladOrderId, moySkladSyncedAt: new Date() },
  })
  await prisma.$disconnect()
}

async function main() {
  console.log('====================================================================')
  console.log('  Liudmila Stepanova — fix order + invoice + shipment + paymentin')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Web order: ${WEB_ORDER_NUMBER} | paid ${EXPECTED_TOTAL_AED.toFixed(2)} AED`)

  const agent = await findAgent()
  console.log(`  Counterparty: ${agent.name} | ${agent.email || agent.phone || '—'}`)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = shipmentAddress()

  if (Math.abs(sumMinor - Math.round(EXPECTED_TOTAL_AED * 100)) > 1) {
    throw new Error(`Total mismatch: built ${money(sumMinor)} vs expected ${EXPECTED_TOTAL_AED.toFixed(2)}`)
  }

  console.log('\n  Lines:')
  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    const line = lineTotalMinor(qty, Math.round(retailAed * 100), discountPct)
    console.log(
      `    ${code} ${item.name} x${qty} @ ${retailAed.toFixed(2)}` +
        (discountPct ? ` −${discountPct}%` : '') +
        ` = ${money(line)} AED`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await trashPartialChain()
  await ensureNoActiveChain()

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)
  const t3 = uaeMomentAddMinutes(5)

  const order = await api('POST', '/entity/customerorder', {
    name: WEB_ORDER_NUMBER,
    moment: t0,
    shared: true,
    description: [
      MARKER,
      `genosys.ae web order #${WEB_ORDER_NUMBER} | Stripe paid ${EXPECTED_TOTAL_AED.toFixed(2)} AED`,
      'Deep Moisturizing beauty box exploded; BB Cushion Beige; Microbiome Mist; 2 promo masks.',
      `Ship to: ${shipment.street}.`,
      `Replaces trashed partial sync ${PARTIAL_ORDER_ID}.`,
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_PAID_AWAITING_DELIVERY_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
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
      shipmentAddressFull: shipment,
      description: `Invoice for ${WEB_ORDER_NUMBER} | ${MARKER}`,
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
      shipmentAddressFull: shipment,
      description: `Invoice for ${WEB_ORDER_NUMBER} | ${MARKER}`,
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  invoice = await api('GET', `/entity/invoiceout/${invoice.id}`)
  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)

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
    description: `Shipment for ${invoice.name} / ${WEB_ORDER_NUMBER} | ${MARKER}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: t3,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: `Stripe payment for ${WEB_ORDER_NUMBER} / shipment ${demand.name} | ${MARKER}`,
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

  console.log('\n  Exporting invoice PDF...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (pdfBuf) {
    const outPath = ordersPdfPath(invoice.name)
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
  }

  await updateWebsiteOrder(order.id)
  console.log(`\n  Website DB: moySkladOrderId → ${order.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
