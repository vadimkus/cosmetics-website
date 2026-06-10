#!/usr/bin/env node

/**
 * Miss Hessa Abdullah — new customer + order → invoice → shipment + landscape PDF.
 *
 * Lines (ex-VAT — vatIncluded: false on all docs):
 *   Moisture Replenishing Hyaluron Cream 50g (54458) ×1 @ 276.19 AED (retail 290 incl.)
 *   Moisture Replenishing Hyaluron Serum 30ml (00195) ×1 @ 314.29 AED (retail 330 incl.)
 *   Excellent Delivery Dubai ×1 @ 45 AED ex-VAT
 *
 * PDF: Genosys_Invoice_Legal_TAX_RETAIL_PRINT → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-miss-hessa-abdullah-hyaluron-order-invoice-demand-20260610.js
 *   node --import dotenv/config scripts/moysklad-create-miss-hessa-abdullah-hyaluron-order-invoice-demand-20260610.js --commit
 *   node --import dotenv/config scripts/moysklad-create-miss-hessa-abdullah-hyaluron-order-invoice-demand-20260610.js --fix-invoice
 *   node --import dotenv/config scripts/moysklad-create-miss-hessa-abdullah-hyaluron-order-invoice-demand-20260610.js --fix-chain
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
const FIX_INVOICE = process.argv.includes('--fix-invoice')
const FIX_CHAIN = process.argv.includes('--fix-chain')

const EXISTING_DOCS = {
  customerOrderId: '6ef3de64-64bd-11f1-0a80-1120001b425e',
  invoiceOutId: '6f3647eb-64bd-11f1-0a80-1120001b426f',
  demandId: '701ebe8d-64bd-11f1-0a80-1efa001c50d8',
}

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
  name: 'Miss Hessa Abdullah',
  phone: '+971506445536',
  city: 'Dubai',
  street: 'Kas Residence, Villa 11',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}5536`,
  moment: uaeMomentNow(),
  marker: `MISS-HESSA-ABDULLAH-HYALURON-${uaeToday()}`,
}

/** [code, qty, exVatAed] — genosys.ae retail ÷ 1.05 */
const PRODUCT_LINES = [
  ['54458', 1, 276.19], // Moisture Replenishing Hyaluron Cream 50g (290 incl.)
  ['00195', 1, 314.29], // Moisture Replenishing Hyaluron Serum 30ml (330 incl.)
]
const DELIVERY_EX_VAT_AED = 45

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

function exVatToMinor(aed) {
  return Math.round(aed * 100)
}

function expectedPriceMinorByCode() {
  return {
    '54458': exVatToMinor(276.19),
    '00195': exVatToMinor(314.29),
    '00089': exVatToMinor(DELIVERY_EX_VAT_AED),
  }
}

function positionFingerprint(rows) {
  return rows
    .map((p) => `${p.assortment?.code}:${p.quantity}:${p.price}`)
    .sort()
    .join(' | ')
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    const id = row.meta?.href?.split('/').pop()?.split('?')[0]
    stock.set(row.code, {
      id,
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }
  return stock
}

async function resolveProduct(code, stock) {
  const hit = stock.get(code)
  if (hit?.id) return hit
  const data = await api('GET', `/entity/product?filter=code=${encodeURIComponent(code)}&limit=1`)
  const row = data?.rows?.[0]
  if (!row) throw new Error(`Unknown product code: ${code}`)
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    available: 0,
  }
}

function shipmentAddress() {
  return {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
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
  return (bySearch?.rows || []).find((r) => r.phone === CUSTOMER.phone) || null
}

async function findOrCreateCounterparty() {
  const existing = await findExistingCounterparty()
  if (existing) {
    console.log(`  Counterparty (existing): ${existing.name} (${existing.id})`)
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

async function buildPositions(stock) {
  const positions = []
  let sumExVatMinor = 0
  for (const [code, qty, exVatAed] of PRODUCT_LINES) {
    const item = await resolveProduct(code, stock)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = exVatToMinor(exVatAed)
    sumExVatMinor += priceMinor * qty
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  const deliveryMinor = exVatToMinor(DELIVERY_EX_VAT_AED)
  positions.push({
    quantity: 1,
    price: deliveryMinor,
    discount: 0,
    assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
  })
  sumExVatMinor += deliveryMinor
  const sumInclVatMinor = Math.round(sumExVatMinor * 1.05)
  return { positions, sumExVatMinor, sumInclVatMinor }
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

  if (res.status === 412) {
    const t = await res.text()
    if (/33003|шаблон/i.test(t)) return null
    throw new Error(`Invoice export 412: ${t.slice(0, 600)}`)
  }
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
  return path.join(ordersDir, `GENOSYS_Miss_Hessa_Abdullah_${safe}.pdf`)
}

function positionPayloadFromInvoiceRow(p) {
  return {
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: { meta: p.assortment.meta },
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }
}

async function syncDocPositionsFromInvoice(docType, docId, invoiceRows, label) {
  let doc = await api('GET', `/entity/${docType}/${docId}`)
  const wasApplicable = doc.applicable
  if (wasApplicable) {
    doc = await api('PUT', `/entity/${docType}/${docId}`, { meta: doc.meta, applicable: false })
  }

  let rows = await fetchAll(`/entity/${docType}/${docId}/positions?expand=assortment`)
  const invByCode = new Map(invoiceRows.map((p) => [p.assortment.code, p]))
  for (const p of rows) {
    if (!invByCode.has(p.assortment?.code)) {
      await api('DELETE', `/entity/${docType}/${docId}/positions/${p.id}`)
      console.log(`    ${label}: deleted stray ${p.assortment?.code}`)
    }
  }

  rows = await fetchAll(`/entity/${docType}/${docId}/positions?expand=assortment`)
  for (const invP of invoiceRows) {
    const code = invP.assortment.code
    const cur = rows.find((p) => p.assortment?.code === code)
    const payload = positionPayloadFromInvoiceRow(invP)
    if (!cur) {
      await api('POST', `/entity/${docType}/${docId}/positions`, payload)
      console.log(`    ${label}: added ${code} x${invP.quantity} @ ${money(invP.price)}`)
    } else if (cur.quantity !== invP.quantity || cur.price !== invP.price) {
      await api('PUT', `/entity/${docType}/${docId}/positions/${cur.id}`, {
        meta: cur.meta,
        ...payload,
      })
      console.log(
        `    ${label}: updated ${code} qty ${cur.quantity}→${invP.quantity}, price ${money(cur.price)}→${money(invP.price)}`
      )
    }
  }

  doc = await api('GET', `/entity/${docType}/${docId}`)
  await api('PUT', `/entity/${docType}/${docId}`, {
    meta: doc.meta,
    applicable: wasApplicable,
    vatEnabled: doc.vatEnabled,
    vatIncluded: doc.vatIncluded,
  })
}

async function verifyChain(customerOrderId, invoiceOutId, demandId) {
  const order = await api('GET', `/entity/customerorder/${customerOrderId}`)
  const inv = await api('GET', `/entity/invoiceout/${invoiceOutId}`)
  const demand = await api('GET', `/entity/demand/${demandId}`)
  const orderPos = await fetchAll(`/entity/customerorder/${customerOrderId}/positions?expand=assortment`)
  const invoicePos = await fetchAll(`/entity/invoiceout/${invoiceOutId}/positions?expand=assortment`)
  const demandPos = await fetchAll(`/entity/demand/${demandId}/positions?expand=assortment`)

  console.log(
    `\n  Sums — SO ${money(order.sum)} | invoice ${money(inv.sum)} | shipment ${money(demand.sum)} AED`
  )
  for (const [label, rows] of [
    ['SO', orderPos],
    ['Invoice', invoicePos],
    ['Shipment', demandPos],
  ]) {
    console.log(`  ${label} lines:`)
    for (const p of rows) {
      console.log(
        `    ${p.assortment?.code} x${p.quantity} @ ${money(p.price)} ex-VAT → ${money(p.price * p.quantity)}`
      )
    }
  }

  const match =
    positionFingerprint(orderPos) === positionFingerprint(invoicePos) &&
    positionFingerprint(invoicePos) === positionFingerprint(demandPos) &&
    order.sum === inv.sum &&
    inv.sum === demand.sum
  if (!match) throw new Error('Verification failed — SO / invoice / shipment still differ')
  console.log('  Verification OK — all three docs match.')
  return inv
}

async function fixChainFromInvoice() {
  const { customerOrderId, invoiceOutId, demandId } = EXISTING_DOCS
  console.log('  Sync SO + shipment from invoice 04651 (invoice unchanged)...')

  const invoiceRows = await fetchAll(`/entity/invoiceout/${invoiceOutId}/positions?expand=assortment`)
  await syncDocPositionsFromInvoice('customerorder', customerOrderId, invoiceRows, 'SO')
  await syncDocPositionsFromInvoice('demand', demandId, invoiceRows, 'Shipment')

  const inv = await verifyChain(customerOrderId, invoiceOutId, demandId)

  const pdfBuf = await exportInvoicePdf(invoiceOutId)
  if (!pdfBuf) {
    console.warn('  MoySklad returned no PDF.')
    return
  }
  const outPath = ordersPdfPath(inv.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF saved: ${outPath} (${pdfBuf.length} bytes)`)
}

async function fixExistingInvoice() {
  const { customerOrderId, invoiceOutId, demandId } = EXISTING_DOCS
  const expected = expectedPriceMinorByCode()
  console.log('  Fixing invoice 04651 — align lines/prices with order + shipment...')

  let inv = await api('GET', `/entity/invoiceout/${invoiceOutId}`)
  console.log(`  Before: invoice sum ${money(inv.sum)} AED`)

  if (inv.applicable) {
    inv = await api('PUT', `/entity/invoiceout/${invoiceOutId}`, { meta: inv.meta, applicable: false })
  }

  const rows = await fetchAll(`/entity/invoiceout/${invoiceOutId}/positions?expand=assortment`)
  for (const p of rows) {
    const code = p.assortment?.code
    if (!expected[code]) {
      await api('DELETE', `/entity/invoiceout/${invoiceOutId}/positions/${p.id}`)
      console.log(`    Deleted stray line ${code}`)
      continue
    }
    if (p.price !== expected[code]) {
      await api('PUT', `/entity/invoiceout/${invoiceOutId}/positions/${p.id}`, {
        meta: p.meta,
        assortment: { meta: p.assortment.meta },
        quantity: p.quantity,
        price: expected[code],
        discount: 0,
        vat: p.vat,
        vatEnabled: p.vatEnabled,
      })
      console.log(`    Fixed ${code} ${money(p.price)} → ${money(expected[code])} AED/unit ex-VAT`)
    }
  }

  inv = await api('PUT', `/entity/invoiceout/${invoiceOutId}`, { meta: inv.meta, applicable: true })

  const invFinal = await verifyChain(customerOrderId, invoiceOutId, demandId)

  const pdfBuf = await exportInvoicePdf(invoiceOutId)
  if (!pdfBuf) {
    console.warn('  MoySklad returned no PDF.')
    return
  }
  const outPath = ordersPdfPath(invFinal.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF saved: ${outPath} (${pdfBuf.length} bytes)`)
}

async function main() {
  if (FIX_CHAIN) {
    console.log('====================================================================')
    console.log('  Miss Hessa Abdullah — sync SO + shipment from invoice 04651')
    console.log('====================================================================')
    await fixChainFromInvoice()
    return
  }

  if (FIX_INVOICE) {
    console.log('====================================================================')
    console.log('  Miss Hessa Abdullah — fix invoice 04651 vs order/shipment')
    console.log('====================================================================')
    await fixExistingInvoice()
    return
  }

  console.log('====================================================================')
  console.log('  Miss Hessa Abdullah — customer + order → invoice → shipment')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await findOrCreateCounterparty()
  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumExVatMinor, sumInclVatMinor } = await buildPositions(stock)
  const shipment = shipmentAddress()

  console.log(`\n  Customer: ${CUSTOMER.name} | ${CUSTOMER.phone}`)
  console.log(`  Address: ${CUSTOMER.street}, ${CUSTOMER.city}, UAE`)
  console.log(`\n  Order: ${ORDER.name} (vatIncluded: false)`)
  for (const [code, qty, exVatAed] of PRODUCT_LINES) {
    const item = await resolveProduct(code, stock)
    console.log(
      `    ${code} ${item.name.slice(0, 55)} x${qty} @ ${exVatAed.toFixed(2)} ex-VAT → stock ${item.available}`
    )
  }
  console.log(`    Excellent Delivery Dubai x1 @ ${DELIVERY_EX_VAT_AED.toFixed(2)} ex-VAT`)
  console.log(`  Total ex-VAT: ${money(sumExVatMinor)} AED`)
  console.log(`  Total VAT-incl (5%): ${money(sumInclVatMinor)} AED`)

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
      `Phone ${CUSTOMER.phone}. Hyaluron cream 54458, serum 00195, delivery 45 ex-VAT. Chain: invoice → shipment (from invoice).`,
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: false,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions,
  })
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)} AED (VAT incl.)`)
  console.log(`     https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: false,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agent.id),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull: shipment,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
      positions,
    })
  } catch (e) {
    console.warn('  Invoice with positions failed, retrying link-only:', e.message.slice(0, 180))
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: false,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agent.id),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull: shipment,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED (VAT incl.)`)
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
    vatIncluded: false,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull: shipment,
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED (from invoice only)`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const demandRead = await api('GET', `/entity/demand/${demand.id}`)
  console.log('\n  Verification:')
  console.log(`    Shipment from order: ${demandRead.customerOrder ? 'yes (unexpected)' : 'no (invoice only)'}`)
  console.log(`    Shipment state: Shipped`)
  console.log(`    Customer id: ${agent.id}`)

  console.log('\n  Exporting invoice PDF (Genosys_Invoice_Legal_TAX_RETAIL_PRINT)...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (!pdfBuf) {
    console.warn('  MoySklad returned no PDF — open invoice in UI to export.')
    return
  }
  const outPath = ordersPdfPath(invoice.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
