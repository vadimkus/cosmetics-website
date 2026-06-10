#!/usr/bin/env node

/**
 * Miss Liza (Salon 971, The Platinum One, Arjan) — order → invoice → shipment + landscape PDF.
 *
 * Lines @ clinic list (MoySklad salePrice, VAT incl.):
 *   Eye peptide gel patch (00053) ×1
 *   Skin Reboot PDRN mask pack (54467) ×1
 *   Snow O₂ Cleanser 180ml (00021) ×1
 *   EZ CO₂ Mask Kit (00011) ×1
 *
 * PDF: Genosys_Invoice_Legal_TAX_RETAIL_PRINT (horizontal) → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-miss-liza-salon971-retail-order-invoice-20260610.js
 *   node --import dotenv/config scripts/moysklad-create-miss-liza-salon971-retail-order-invoice-20260610.js --commit
 *   node --import dotenv/config scripts/moysklad-create-miss-liza-salon971-retail-order-invoice-20260610.js --fix-clinic-prices
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
const FIX_CLINIC_PRICES = process.argv.includes('--fix-clinic-prices')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const AGENT_ID = '54f61271-f117-11f0-0a80-09440004ed3f' // Miss Liza

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const CUSTOMER = {
  name: 'Miss Liza',
  phone: '+971585511025',
  city: 'Dubai',
  street: 'The Platinum One, Arjan',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}1025`,
  moment: uaeMomentNow(),
  marker: `MISS-LIZA-SALON971-CLINIC-${uaeToday()}`,
}

/** [code, qty] — clinic salePrice from MoySklad stock report */
const PRODUCT_LINES = [
  ['00053', 1], // EyeCell Eye Peptide Gel Patch (box)
  ['54467', 1], // Skin Reboot PDRN mask Pack
  ['00021', 1], // Snow O₂ Cleanser 180ml
  ['00011', 1], // EZ CO₂ Mask Kit
]

/** Posted 2026-06-10 at retail — amend via --fix-clinic-prices */
const EXISTING_DOCS = {
  customerOrderId: 'ef4e7d81-649e-11f1-0a80-0d6c001370a8',
  invoiceOutId: 'ef8847a1-649e-11f1-0a80-1ba8001387d1',
  demandId: 'f0553916-649e-11f1-0a80-112000133291',
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
      price: Number(row.salePrice || 0),
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }
  return stock
}

function shipmentAddress() {
  return {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
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
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
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

function clinicMinorByMsCode(code, stock) {
  return stock.get(code)?.price ?? null
}

async function updateDocPositionsToClinic(docLabel, pathPrefix, rows, stock) {
  for (const p of rows) {
    const assortment = p.assortment
    const meta = assortment?.meta
    if (!meta || meta.type !== 'product') continue
    const code = assortment.code
    if (!code) throw new Error(`${docLabel} position missing assortment.code`)
    const priceMinor = clinicMinorByMsCode(code, stock)
    if (priceMinor == null) continue
    await api('PUT', `${pathPrefix}/${p.id}`, {
      meta: p.meta,
      assortment: { meta },
      quantity: p.quantity,
      price: priceMinor,
      discount: p.discount || 0,
      vat: p.vat,
      vatEnabled: p.vatEnabled,
    })
    console.log(`    PUT ${docLabel} ${code} → ${money(priceMinor)} AED/unit`)
  }
}

async function fixExistingClinicPrices() {
  const { customerOrderId, invoiceOutId, demandId } = EXISTING_DOCS
  console.log('  Amending GENCardM2606101025 / invoice 04650 → clinic list (salePrice)...')

  const stock = await fetchStockByCode()
  const orderRows = (
    await api('GET', `/entity/customerorder/${customerOrderId}/positions?expand=assortment&limit=50`)
  ).rows
  const invoiceRows = (
    await api('GET', `/entity/invoiceout/${invoiceOutId}/positions?expand=assortment&limit=50`)
  ).rows
  const demandRows = (
    await api('GET', `/entity/demand/${demandId}/positions?expand=assortment&limit=50`)
  ).rows

  await updateDocPositionsToClinic(
    'customerorder',
    `/entity/customerorder/${customerOrderId}/positions`,
    orderRows,
    stock
  )
  await updateDocPositionsToClinic(
    'invoiceout',
    `/entity/invoiceout/${invoiceOutId}/positions`,
    invoiceRows,
    stock
  )
  await updateDocPositionsToClinic('demand', `/entity/demand/${demandId}/positions`, demandRows, stock)

  const order = await api('GET', `/entity/customerorder/${customerOrderId}`)
  const invoice = await api('GET', `/entity/invoiceout/${invoiceOutId}`)
  const demand = await api('GET', `/entity/demand/${demandId}`)
  console.log(`  Order sum: ${money(order.sum)} AED`)
  console.log(`  Invoice sum: ${money(invoice.sum)} AED`)
  console.log(`  Shipment sum: ${money(demand.sum)} AED`)

  const pdfBuf = await exportInvoicePdf(invoiceOutId)
  if (!pdfBuf) {
    console.warn('  MoySklad did not return PDF.')
    return
  }
  const outPath = ordersPdfPath(invoice.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF saved: ${outPath} (${pdfBuf.length} bytes)`)
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
  return path.join(ordersDir, `GENOSYS_Miss_Liza_${safe}.pdf`)
}

async function main() {
  if (FIX_CLINIC_PRICES) {
    console.log('====================================================================')
    console.log('  Miss Liza — fix prices to clinic list (salePrice)')
    console.log('====================================================================')
    await fixExistingClinicPrices()
    return
  }

  console.log('====================================================================')
  console.log('  Miss Liza — order → invoice → shipment + PDF (clinic list)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Customer: ${CUSTOMER.name} (${AGENT_ID})`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (agent.name !== CUSTOMER.name) {
    console.warn(`  WARN: counterparty name is "${agent.name}"`)
  }

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday()

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = shipmentAddress()

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    const unit = item.price / 100
    console.log(
      `    ${code} ${item.name.slice(0, 55)} x${qty} @ ${unit.toFixed(2)} clinic → ${(unit * qty).toFixed(2)} AED`
    )
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
    shared: true,
    description: [
      ORDER.marker,
      'Salon 971 / The Platinum One Arjan. Patch 00053, PDRN 54467, cleanser 00021, EZ CO2 00011 x1 each.',
      'Chain: invoice → shipment (from invoice).',
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
      agent: href('counterparty', AGENT_ID),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull: shipment,
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
      agent: href('counterparty', AGENT_ID),
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
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull: shipment,
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED (from invoice only)`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

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
