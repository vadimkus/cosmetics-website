#!/usr/bin/env node

/**
 * Miss Anna Sakhugova — retail customer order + customer invoice (Счет покупателю) + PDF to Desktop.
 *
 * Lines: overnight mask ×1, eye serum ×1, eye cream ×2, Excellent Delivery Dubai ×1.
 *
 * PDF: template **Genosys_Invoice_Legal_TAX** (`INVOICE_LEGAL_TAX_TEMPLATE_ID`).
 * Output: `~/Desktop/GENOSYS_Anna_Sakhugova_{invoiceName}.pdf` then `lp` (or `open` on macOS).
 *
 * Counterparty: exact match **Miss Anna Sakhugova**; if missing, creates individual with Dubai placeholder address
 * (update phone/address on the customer card in MoySklad when known).
 *
 *   node scripts/moysklad-create-anna-sakhugova-order-invoice-20260511.js
 *   node scripts/moysklad-create-anna-sakhugova-order-invoice-20260511.js --commit
 *   node scripts/moysklad-create-anna-sakhugova-order-invoice-20260511.js --commit --no-print
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync, spawnSync } = require('child_process')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const NO_PRINT = process.argv.includes('--no-print')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const DELIVERY_AED = 45

const CUSTOMER = {
  name: 'Miss Anna Sakhugova',
  city: 'Dubai',
  street: 'UAE — confirm delivery address with customer',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}6924`,
  moment: uaeMomentNow(),
  marker: `Anna Sakhugova retail order + invoice overnight mask eye care delivery ${uaeToday()}`,
}

/** [code, qty] — list prices from stock report */
const PRODUCT_LINES = [
  ['00189', 1], // Skin Rescue Overnight Cream Mask 100g
  ['00054', 1], // EyeCell Eye Contour Serum 10ml
  ['00055', 2], // EyeCell Eye Contour Cream 20ml
]

const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
/** Resolve from `GET …/entity/invoiceout/metadata/customtemplate` (name Genosys_Invoice_Legal_TAX). */
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=${limit}&offset=${offset}`)
    const batch = data?.rows || []
    rows.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return rows
}

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
}

function countryHref() {
  return {
    meta: {
      href: `${API}/entity/country/${COUNTRY_UAE_ID}`,
      type: 'country',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return (minor / 100).toFixed(2)
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function findOrCreateCounterparty() {
  const exact = await api(
    'GET',
    `/entity/counterparty?filter=${encodeURIComponent(`name=${CUSTOMER.name}`)}&limit=5`
  )
  if (exact?.rows?.length) {
    const cp = exact.rows.find((r) => r.name === CUSTOMER.name)
    if (cp) {
      console.log(`  Counterparty (existing): ${cp.name} (${cp.id})`)
      return cp
    }
  }

  if (!COMMIT) {
    console.log(`  DRY RUN: would create counterparty "${CUSTOMER.name}"`)
    return { id: 'DRY-RUN', name: CUSTOMER.name, meta: { href: `${API}/entity/counterparty/DRY-RUN` } }
  }

  const addr = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
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

async function ensureNoDuplicateToday(counterpartyId) {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${counterpartyId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) {
    throw new Error(`Duplicate protection: customer order exists (${dup.name}, id=${dup.id})`)
  }
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const lineMinor = item.price * qty
    sumMinor += lineMinor
    positions.push({
      quantity: qty,
      price: item.price,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  positions.push({
    quantity: 1,
    price: Math.round(DELIVERY_AED * 100),
    discount: 0,
    assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
  })
  sumMinor += Math.round(DELIVERY_AED * 100)
  return { positions, sumMinor }
}

async function exportInvoicePdf(invoiceId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_LEGAL_TAX_TEMPLATE_ID}`,
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

function defaultInvoicePdfPath(invoiceName) {
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const desktop = path.join(os.homedir(), 'Desktop')
  if (fs.existsSync(desktop)) {
    return path.join(desktop, `GENOSYS_Anna_Sakhugova_${safe}.pdf`)
  }
  return path.join(os.tmpdir(), `GENOSYS_Anna_Sakhugova_${safe}.pdf`)
}

function sendPdfToPrint(pdfPath) {
  if (process.platform !== 'darwin') {
    console.log(`  PDF saved (non-macOS): ${pdfPath}`)
    return
  }
  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status === 0 && whichLp.stdout.trim()) {
    try {
      execFileSync('lp', [pdfPath], { stdio: 'inherit' })
      console.log('  Sent to default printer (lp).')
      return
    } catch (e) {
      console.warn('  lp failed, opening PDF:', e.message)
    }
  }
  execFileSync('open', [pdfPath], { stdio: 'inherit' })
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Anna Sakhugova — order + invoice + PDF (Genosys_Invoice_Legal_TAX)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await findOrCreateCounterparty()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)
  await ensureOrderNameFree()

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)

  console.log()
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(
      `    ${code} ${item.name.slice(0, 52)}… x${qty} @ ${money(item.price)} → ${money(item.price * qty)} AED`
    )
  }
  console.log(`    (service) Excellent Delivery Dubai x1 @ ${DELIVERY_AED.toFixed(2)} AED`)
  console.log(`  Expected sum (list + delivery): ${money(sumMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit.')
    return
  }

  const shipment = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }

  const orderPayload = {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [ORDER.marker, 'Retail: overnight mask, eye serum, eye cream x2, Dubai delivery 45.'].join(' | '),
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
  }

  const order = await api('POST', '/entity/customerorder', orderPayload)
  console.log()
  console.log(`  Created order: ${order.name} | ${(order.sum / 100).toFixed(2)} AED | id=${order.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

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
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  }

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  } catch (e) {
    console.warn('  Invoice create with positions failed, retrying customerOrder link only:', e.message.slice(0, 200))
    delete invPayload.positions
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  }

  console.log(`  Created invoice: ${invoice.name} | ${(invoice.sum / 100).toFixed(2)} AED | id=${invoice.id}`)
  const invoiceUi = `https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`
  console.log(`  UI: ${invoiceUi}`)

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/states/${INVOICE_STATE_ISSUED_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
  }).catch(() => console.warn('  (Could not set invoice state Выписан — optional.)'))

  if (NO_PRINT) {
    console.log('  Skipping PDF (--no-print).')
    return
  }

  console.log()
  console.log('  Exporting invoice PDF (Genosys_Invoice_Legal_TAX)...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (!pdfBuf) {
    console.warn(
      '  MoySklad returned no PDF (template). Open invoice in UI to print, or check customtemplate is linked to invoiceout.'
    )
    if (process.platform === 'darwin') {
      try {
        execFileSync('open', [invoiceUi], { stdio: 'inherit' })
      } catch (_) {}
    }
    return
  }
  const outPath = defaultInvoicePdfPath(invoice.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
  sendPdfToPrint(outPath)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
