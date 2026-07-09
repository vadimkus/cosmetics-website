#!/usr/bin/env node

/**
 * AMERICAN MEDICAL CENTER DMCC — complete existing PO → invoice → shipment → cashin.
 *
 * Order GENCardM260701AMC (335 AED):
 *   00051 HR³ Matrix Hair Tonic 70ml ×1 @ 145
 *   00050 HR³ Matrix Scalp Peeling 100ml ×1 @ 145
 *   Excellent Delivery Dubai ×1 @ 45
 *
 *   node --import dotenv/config scripts/moysklad-create-american-medical-center-hair-order-invoice-demand-cashin-20260706.js
 *   node --import dotenv/config scripts/moysklad-create-american-medical-center-hair-order-invoice-demand-cashin-20260706.js --commit
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
const AGENT_ID = 'cf16d027-17b1-11f1-0a80-1a7d000b8fe4' // AMERICAN MEDICAL CENTER DMCC
const CASH_ACCOUNT_ID = 'e14ef9fa-33c5-11ea-0a80-020500003a56'
const ORDER_ID = '8c7b1cf1-7541-11f1-0a80-0c5e001c5941'
const ORDER_NAME = 'GENCardM260701AMC'
const EXPECTED_SUM_MINOR = 33500

const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'

const MARKER = `AMERICAN-MEDICAL-CENTER-HAIR-CASH-${uaeToday()}`
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

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
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
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

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const [invoices, cashins] = await Promise.all([
    fetchAll(`/entity/invoiceout?filter=${encodeURIComponent(filter)}`),
    fetchAll(`/entity/cashin?filter=${encodeURIComponent(filter)}`),
  ])
  const dupInv = invoices.find((d) => (d.description || '').includes(MARKER))
  if (dupInv) throw new Error(`Duplicate invoice marker (${dupInv.name})`)
  const dupCash = cashins.find((d) => (d.description || '').includes(MARKER))
  if (dupCash) throw new Error(`Duplicate cashin marker (${dupCash.name})`)
}

async function exportInvoicePdf(invoiceId, invoiceName) {
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
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_American_Medical_Center_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  AMERICAN MEDICAL CENTER DMCC — invoice + shipment + cash in')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const order = await api(
    'GET',
    `/entity/customerorder/${ORDER_ID}?expand=agent,state,shipmentAddressFull`
  )
  if (order.name !== ORDER_NAME) throw new Error(`Order name mismatch: ${order.name}`)
  if (order.agent?.meta?.href?.split('/').pop() !== AGENT_ID) {
    throw new Error(`Agent mismatch: ${order.agent?.name}`)
  }
  if (order.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Order sum ${money(order.sum)} != ${money(EXPECTED_SUM_MINOR)}`)
  }

  console.log(`  Customer: ${order.agent?.name}`)
  console.log(`  Phone: ${order.agent?.phone || '052 641 0764'}`)
  console.log(`  Order: ${order.name} | ${money(order.sum)} AED | state: ${order.state?.name}`)

  const orderPos = await fetchAll(`/entity/customerorder/${ORDER_ID}/positions?expand=assortment`)
  for (const p of orderPos) {
    console.log(`    ${p.assortment?.code || '?'} ${(p.assortment?.name || '').slice(0, 50)} x${p.quantity} @ ${money(p.price)}`)
  }

  const positions = orderPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))
  const shipmentAddressFull = order.shipmentAddressFull

  if (!COMMIT) {
    console.log('\n  DRY RUN — would post invoice → shipment → cashin + PDF')
    console.log('  Re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const t1 = uaeMomentNow()
  const t2 = uaeMomentAddMinutes(2)
  const t3 = uaeMomentAddMinutes(4)

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
      customerOrder: href('customerorder', ORDER_ID),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: [`Invoice for ${ORDER_NAME} | ${MARKER}`, 'Paid cash.'].join(' | '),
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
      customerOrder: href('customerorder', ORDER_ID),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: [`Invoice for ${ORDER_NAME} | ${MARKER}`, 'Paid cash.'].join(' | '),
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  console.log(`\n  1) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
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
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} / ${ORDER_NAME} | ${MARKER}`,
    positions: demandPositions,
  })
  console.log(`  2) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const paySum = demand.sum
  const cashIn = await api('POST', '/entity/cashin', {
    moment: t3,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: href('account', CASH_ACCOUNT_ID),
    description: [`Cash payment for ${demand.name} / ${ORDER_NAME} | ${MARKER}`, '335 AED cash in full.'].join(' | '),
    sum: paySum,
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${demand.id}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: paySum,
      },
    ],
  })
  console.log(`  3) Cash in: ${cashIn.name} | ${money(cashIn.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#cashin/edit?id=${cashIn.id}`)

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const invRead = await api('GET', `/entity/invoiceout/${invoice.id}`)
  const demandRead = await api('GET', `/entity/demand/${demand.id}`)
  const orderRead = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`)
  console.log('\n  Verification:')
  console.log(`    Invoice:  ${money(invRead.payedSum)} / ${money(invRead.sum)} AED`)
  console.log(`    Shipment: ${money(demandRead.payedSum)} / ${money(demandRead.sum)} AED`)
  console.log(`    Order:    ${orderRead.state?.name}`)

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  if (pdfPath) console.log(`\n  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
