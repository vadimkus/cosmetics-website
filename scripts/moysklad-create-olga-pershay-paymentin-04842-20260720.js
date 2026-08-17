#!/usr/bin/env node

/**
 * Miss Olga Pershay — paymentin @ shipment 06569 / invoice 04842.
 * Order GENCardM2607200720 → Доставлен.
 *
 *   node --import dotenv/config scripts/moysklad-create-olga-pershay-paymentin-04842-20260720.js
 *   node --import dotenv/config scripts/moysklad-create-olga-pershay-paymentin-04842-20260720.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const AGENT_ID = '9a35428d-6c20-11ef-0a80-1112000787c0' // Miss Olga Pershay
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const MARKER = 'OLGA-PERSHAY-PAYMENTIN-04842-2026-07-20'

const PAYMENT = {
  amountMinor: 98000,
  invoiceName: '04842',
  invoiceId: 'bd85b0ae-8455-11f1-0a80-082e0084ea84',
  shipmentName: '06569',
  shipmentId: 'be8d91fd-8455-11f1-0a80-11640085f19c',
  orderName: 'GENCardM2607200720',
  orderId: 'bd481838-8455-11f1-0a80-0ca60085cd1e',
}

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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
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

async function main() {
  console.log('====================================================================')
  console.log('  Miss Olga Pershay — paymentin @ 04842 / 06569')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const [invoice, demand, order] = await Promise.all([
    api('GET', `/entity/invoiceout/${PAYMENT.invoiceId}?expand=agent`),
    api('GET', `/entity/demand/${PAYMENT.shipmentId}?expand=agent,invoicesOut`),
    api('GET', `/entity/customerorder/${PAYMENT.orderId}?expand=state,agent`),
  ])

  console.log(`  Customer: ${order.agent?.name}`)
  console.log(`  Order: ${order.name} | state: ${order.state?.name || '?'}`)
  console.log(`  Invoice ${invoice.name}: ${money(invoice.sum)} AED (paid ${money(invoice.payedSum)})`)
  console.log(`  Shipment ${demand.name}: ${money(demand.sum)} AED (paid ${money(demand.payedSum)})`)

  if (invoice.agent?.meta?.href?.split('/').pop() !== AGENT_ID) {
    throw new Error(`Invoice agent mismatch: ${invoice.agent?.name}`)
  }
  if (invoice.sum !== PAYMENT.amountMinor || demand.sum !== PAYMENT.amountMinor) {
    throw new Error(`Amount mismatch — expected ${money(PAYMENT.amountMinor)}`)
  }
  if (!(demand.invoicesOut || []).some((x) => x.meta.href.includes(PAYMENT.invoiceId))) {
    throw new Error(`${PAYMENT.shipmentName} not linked to invoice ${PAYMENT.invoiceName}`)
  }

  const paymentMoment = uaeMomentAddMinutes(10)
  if (new Date(paymentMoment) <= new Date(demand.moment)) {
    throw new Error(`Payment moment must be after shipment ${demand.moment}`)
  }

  const dup = await api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=10`)
  if ((dup.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    console.log('\n  SKIP — already booked')
    return
  }

  if (demand.payedSum >= demand.sum) {
    console.log('\n  Shipment already paid — updating order to Доставлен only')
    if (COMMIT && order.state?.meta?.href?.split('/').pop() !== STATE_ORDER_DELIVERED_ID) {
      await api('PUT', `/entity/customerorder/${PAYMENT.orderId}`, {
        meta: order.meta,
        state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
      })
      console.log(`  Order ${order.name} → Доставлен`)
    }
    return
  }

  if (!COMMIT) {
    console.log(`\n  Would post paymentin ${money(PAYMENT.amountMinor)} AED @ shipment ${demand.name}`)
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/paymentin', {
    applicable: true,
    moment: paymentMoment,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: PAYMENT.amountMinor,
    description: [
      MARKER,
      `Invoice ${PAYMENT.invoiceName} / shipment ${PAYMENT.shipmentName}`,
      `Order ${PAYMENT.orderName}`,
      'Mist x2, Multi Functional cream, Multi Functional serum — retail.',
    ].join(' | '),
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${PAYMENT.shipmentId}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: PAYMENT.amountMinor,
      },
    ],
  })

  await api('PUT', `/entity/customerorder/${PAYMENT.orderId}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const [invAfter, demAfter, orderAfter] = await Promise.all([
    api('GET', `/entity/invoiceout/${PAYMENT.invoiceId}`),
    api('GET', `/entity/demand/${PAYMENT.shipmentId}`),
    api('GET', `/entity/customerorder/${PAYMENT.orderId}?expand=state`),
  ])

  console.log(`\n  Paymentin: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${created.id}`)
  console.log(`  Invoice paid: ${money(invAfter.payedSum)} / ${money(invAfter.sum)} AED`)
  console.log(`  Shipment paid: ${money(demAfter.payedSum)} / ${money(demAfter.sum)} AED`)
  console.log(`  Order ${orderAfter.name}: ${orderAfter.state?.name}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
