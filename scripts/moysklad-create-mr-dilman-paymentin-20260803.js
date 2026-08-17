#!/usr/bin/env node

/**
 * Mr. Dilman — complete GENCardM2608024601: invoice → shipment → paymentin → delivered.
 * SO already exists (981 AED, 10% products + delivery 45).
 *
 *   node --import dotenv/config scripts/moysklad-create-mr-dilman-paymentin-20260803.js
 *   node --import dotenv/config scripts/moysklad-create-mr-dilman-paymentin-20260803.js --commit
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
const AGENT_ID = '8c2d3801-8e6f-11f1-0a80-17ba005b43f3'
const ORDER_ID = '8d33383e-8e6f-11f1-0a80-17ba005b4421'
const ORDER_NAME = 'GENCardM2608024601'
const EXPECTED_SUM_MINOR = 98100

const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `MR-DILMAN-PAYMENTIN-${ORDER_NAME}-${uaeToday()}`

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

function orgAccountHref(id) {
  return { meta: { href: `${API}/entity/account/${id}`, type: 'account', mediaType: 'application/json' } }
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
    throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Mr_Dilman_${invoiceName}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Mr. Dilman — invoice + shipment + paymentin (from existing SO)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, agent, soPos] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state,agent,shipmentAddressFull`),
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    fetchAll(`/entity/customerorder/${ORDER_ID}/positions`),
  ])

  console.log(`  Customer: ${agent.name}`)
  console.log(`  Order: ${order.name} | ${money(order.sum)} AED | ${order.state?.name}`)

  if (order.name !== ORDER_NAME) throw new Error(`Unexpected order name ${order.name}`)
  if (order.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Order sum ${money(order.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  // Idempotency: payment already posted today for this SO?
  const paySearch = await api(
    'GET',
    `/entity/paymentin?filter=${encodeURIComponent(
      `agent=${API}/entity/counterparty/${AGENT_ID};moment>=${uaeToday()} 00:00:00;moment<=${uaeToday()} 23:59:59`,
    )}&limit=20`,
  )
  const existingPay = (paySearch.rows || []).find((r) => (r.description || '').includes(MARKER))
  if (existingPay) {
    throw new Error(`Paymentin already exists: ${existingPay.name} (${existingPay.id})`)
  }

  const positions = soPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  console.log(`  Positions: ${positions.length}`)
  console.log(`  Would: invoice → shipment → paymentin ${money(EXPECTED_SUM_MINOR)} AED → Доставлен`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const shipment = order.shipmentAddressFull || {
    city: 'Dubai',
    street: 'UAE',
  }

  const t1 = uaeMomentNow()
  const t2 = uaeMomentAddMinutes(2)
  const t3 = uaeMomentAddMinutes(4)

  const invoice = await api('POST', '/entity/invoiceout', {
    moment: t1,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    customerOrder: href('customerorder', ORDER_ID),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    description: `Invoice for ${ORDER_NAME} | ${MARKER}`,
    positions,
  })
  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
  console.log(`\n  1) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)

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
    description: `Shipment from invoice ${invoice.name} / ${ORDER_NAME} | ${MARKER}`,
    positions: demandPositions,
  })
  console.log(`  2) Shipment: ${demand.name} | ${money(demand.sum)} AED`)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: t3,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: `Incoming payment for shipment ${demand.name} / ${ORDER_NAME} | ${MARKER}`,
    sum: EXPECTED_SUM_MINOR,
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${demand.id}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: EXPECTED_SUM_MINOR,
      },
    ],
  })
  console.log(`  3) Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const [demAfter, orderAfter] = await Promise.all([
    api('GET', `/entity/demand/${demand.id}`),
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`),
  ])
  if (demAfter.payedSum < demAfter.sum) {
    throw new Error(`Shipment not fully paid: ${money(demAfter.payedSum)} / ${money(demAfter.sum)}`)
  }

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  console.log(`\n  Order state: ${orderAfter.state?.name}`)
  console.log(`  PDF: ${pdfPath}`)
  console.log(`  Invoice:  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)
  console.log(`  Shipment: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  Payment:  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
