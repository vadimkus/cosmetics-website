#!/usr/bin/env node

/**
 * Miss Ezgi Birdal (existing customer) — retail: order → invoice → отгрузка → paymentin.
 *
 * Lines:
 *   Multi Sun SPF40 (00041) ×1 @ 210 AED retail (genosys.ae)
 *   Collagen mask 23g (00063) ×1 @ 36 AED retail (genosys.ae)
 *   Excellent Delivery Dubai ×1 @ 45 AED
 *
 * Print: Genosys_Invoice_Legal_TAX_RETAIL_PRINT (landscape) → lp (use --no-print to skip).
 *
 *   node --import dotenv/config scripts/moysklad-create-ezgi-birdal-order-invoice-demand-paymentin-20260606.js
 *   node --import dotenv/config scripts/moysklad-create-ezgi-birdal-order-invoice-demand-paymentin-20260606.js --commit
 *   node --import dotenv/config scripts/moysklad-create-ezgi-birdal-order-invoice-demand-paymentin-20260606.js --fix-existing-prices
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync, spawnSync } = require('child_process')

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
const NO_PRINT = process.argv.includes('--no-print')
const FIX_EXISTING_PRICES = process.argv.includes('--fix-existing-prices')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

/** Existing counterparty — do not create a duplicate "Ezgi Birdal". */
const AGENT_ID = '135b8a56-a1c3-11f0-0a80-10310075ebc2' // Miss Ezgi Birdal

const ORDER = {
  name: `GENCardM${uaeShortDate()}EZGI`,
  moment: uaeMomentNow(),
  marker: `Miss Ezgi Birdal SPF40 collagen mask delivery retail paymentin ${uaeToday()}`,
}

/** [code, qty, retailAed] — genosys.ae retail (VAT incl.), not MoySklad clinic salePrice */
const PRODUCT_LINES = [
  ['00041', 1, 210], // Multi Sun Cream SPF40/PA++ 40g — product 40
  ['00063', 1, 36], // Intensive Repair Collagen Mask 23g — product 53
]
const DELIVERY_AED = 45

/** Created 2026-06-06 with wrong clinic salePrice — amend to genosys.ae retail */
const EXISTING_DOCS = {
  customerOrderId: 'b6eac078-61a5-11f1-0a80-0ba60040d3e1',
  invoiceOutId: 'b728802e-61a5-11f1-0a80-08090040b51c',
  demandId: 'b7f6b4e3-61a5-11f1-0a80-191f0040f2af',
  paymentInId: 'b8483b11-61a5-11f1-0a80-1ba100402a8d',
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
  return {
    meta: {
      href: `${API}/entity/country/${COUNTRY_UAE_ID}`,
      type: 'country',
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

async function loadCounterparty() {
  if (!COMMIT && !FIX_EXISTING_PRICES) {
    console.log(`  DRY RUN: would use counterparty Miss Ezgi Birdal (${AGENT_ID})`)
    return { id: AGENT_ID, name: 'Miss Ezgi Birdal' }
  }
  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name} (${agent.id})${agent.phone ? ` | ${agent.phone}` : ''}`)
  return agent
}

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && full.street) {
    return { country: { meta: full.country.meta }, city: full.city, street: full.street }
  }
  const addInfo = full?.addInfo || agent.actualAddress?.addInfo || ''
  return { country: countryHref(), city: 'Dubai', street: addInfo || 'UAE' }
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

function expectedTotalMinor() {
  let sum = Math.round(DELIVERY_AED * 100)
  for (const [, qty, retailAed] of PRODUCT_LINES) {
    sum += Math.round(retailAed * 100) * qty
  }
  return sum
}

function retailMinorByMsCode(msCode) {
  const hit = PRODUCT_LINES.find(([c]) => c === msCode)
  if (!hit) return null
  return Math.round(hit[2] * 100)
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
  positions.push({
    quantity: 1,
    price: deliveryMinor,
    discount: 0,
    assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
  })
  sumMinor += deliveryMinor
  return { positions, sumMinor }
}

async function updateDocPositionsToRetail(docLabel, pathPrefix, rows) {
  for (const p of rows) {
    const assortment = p.assortment
    const meta = assortment?.meta
    if (!meta) continue
    let priceMinor
    if (meta.type === 'service') {
      priceMinor = Math.round(DELIVERY_AED * 100)
    } else {
      const code = assortment.code
      if (!code) throw new Error(`${docLabel} position missing assortment.code`)
      priceMinor = retailMinorByMsCode(code)
      if (priceMinor == null) continue
    }
    await api('PUT', `${pathPrefix}/${p.id}`, {
      meta: p.meta,
      assortment: { meta },
      quantity: p.quantity,
      price: priceMinor,
      discount: p.discount || 0,
      vat: p.vat,
      vatEnabled: p.vatEnabled,
    })
    const label = assortment.code || meta.type
    console.log(`    PUT ${docLabel} ${label} → ${money(priceMinor)} AED/unit`)
  }
}

async function fixExistingRetailPrices() {
  const { customerOrderId, invoiceOutId, demandId, paymentInId } = EXISTING_DOCS
  console.log('  Amending GENCardM260606EZGI / invoice 04630 to genosys.ae retail prices...')

  const orderRows = (
    await api('GET', `/entity/customerorder/${customerOrderId}/positions?expand=assortment&limit=50`)
  ).rows
  const invoiceRows = (
    await api('GET', `/entity/invoiceout/${invoiceOutId}/positions?expand=assortment&limit=50`)
  ).rows
  const demandRows = (
    await api('GET', `/entity/demand/${demandId}/positions?expand=assortment&limit=50`)
  ).rows

  await updateDocPositionsToRetail(
    'customerorder',
    `/entity/customerorder/${customerOrderId}/positions`,
    orderRows
  )
  await updateDocPositionsToRetail(
    'invoiceout',
    `/entity/invoiceout/${invoiceOutId}/positions`,
    invoiceRows
  )
  await updateDocPositionsToRetail('demand', `/entity/demand/${demandId}/positions`, demandRows)

  const sumMinor = expectedTotalMinor()
  const payment = await api('GET', `/entity/paymentin/${paymentInId}`)
  await api('PUT', `/entity/paymentin/${paymentInId}`, {
    meta: payment.meta,
    sum: sumMinor,
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${demandId}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: sumMinor,
      },
    ],
  })
  console.log(`    PUT paymentin → ${money(sumMinor)} AED`)

  const order = await api('GET', `/entity/customerorder/${customerOrderId}`)
  const invoice = await api('GET', `/entity/invoiceout/${invoiceOutId}`)
  const demand = await api('GET', `/entity/demand/${demandId}`)
  console.log(`  Order sum: ${money(order.sum)} AED`)
  console.log(`  Invoice sum: ${money(invoice.sum)} AED`)
  console.log(`  Shipment sum: ${money(demand.sum)} AED | paid ${money(demand.payedSum)}`)

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
  return path.join(ordersDir, `GENOSYS_Miss_Ezgi_Birdal_${safe}.pdf`)
}

function sendPdfToPrint(pdfPath) {
  if (process.platform !== 'darwin') {
    console.log(`  PDF saved (non-macOS): ${pdfPath}`)
    return
  }
  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status === 0 && whichLp.stdout.trim()) {
    try {
      execFileSync('lp', ['-o', 'orientation-requested=4', pdfPath], { stdio: 'inherit' })
      console.log('  Sent to default printer (lp, landscape).')
      return
    } catch (e) {
      console.warn('  lp failed, opening PDF:', e.message)
    }
  }
  execFileSync('open', [pdfPath], { stdio: 'inherit' })
}

async function main() {
  if (FIX_EXISTING_PRICES) {
    console.log('====================================================================')
    console.log('  Miss Ezgi Birdal — fix existing docs to genosys.ae retail prices')
    console.log('====================================================================')
    await fixExistingRetailPrices()
    return
  }

  console.log('====================================================================')
  console.log('  Miss Ezgi Birdal — order → invoice → отгрузка → paymentin + print')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  await ensureOrderNameFree()
  const agent = await loadCounterparty()
  if (COMMIT && agent.id !== 'DRY-RUN') await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(
      `    ${code} ${item.name.slice(0, 50)} x${qty} @ ${retailAed.toFixed(2)} retail → ${(retailAed * qty).toFixed(2)} AED`
    )
  }
  console.log(`    Excellent Delivery Dubai x1 @ ${DELIVERY_AED.toFixed(2)} AED`)
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

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
      'SPF40 00041 x1, Collagen mask 00063 x1, Excellent delivery 45 AED. Chain: invoice → shipment → paymentin.',
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
    description: `Incoming payment for shipment ${demand.name} / ${ORDER.name} | ${ORDER.marker}`,
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
  console.log(`  4) Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED (bank, not cash)`)
  console.log(`     https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  await api('PUT', `/entity/customerorder/${order.id}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const demandRead = await api('GET', `/entity/demand/${demand.id}`)
  console.log('\n  Verification:')
  console.log(`    Shipment payedSum: ${money(demandRead.payedSum)} / ${money(demandRead.sum)} AED`)
  console.log(`    Payment type: paymentin (incoming)`)

  if (NO_PRINT) {
    console.log('  Skipping PDF/print (--no-print).')
    return
  }

  console.log('\n  Exporting invoice PDF (Genosys_Invoice_Legal_TAX_RETAIL_PRINT)...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (!pdfBuf) {
    console.warn('  MoySklad returned no PDF — open invoice in UI to print.')
    return
  }
  const outPath = ordersPdfPath(invoice.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
  sendPdfToPrint(outPath)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
