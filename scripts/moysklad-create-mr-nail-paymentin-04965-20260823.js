#!/usr/bin/env node

/**
 * Mr. Nail — paymentin @ shipment 06728 / invoice 04965.
 * 540 AED. Order GENCardM260823NAIL → Доставлен.
 *
 *   node --import dotenv/config scripts/moysklad-create-mr-nail-paymentin-04965-20260823.js
 *   node --import dotenv/config scripts/moysklad-create-mr-nail-paymentin-04965-20260823.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const AGENT_ID = 'c044fdcb-9ede-11f1-0a80-0e38008c0412'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const MARKER = 'MR-NAIL-PAYMENTIN-04965-2026-08-23'

const PAYMENT = {
  amountMinor: 54000,
  invoiceName: '04965',
  invoiceId: 'c1a9f9c8-9ede-11f1-0a80-06ad008c496a',
  shipmentName: '06728',
  shipmentId: 'c25ceb2f-9ede-11f1-0a80-0e38008c047c',
  orderName: 'GENCardM260823NAIL',
  orderId: 'c169af8e-9ede-11f1-0a80-1360008c8f7e',
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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
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
  console.log('  Mr. Nail — paymentin @ 04965 / 06728')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const [invoice, demand, order] = await Promise.all([
    api('GET', `/entity/invoiceout/${PAYMENT.invoiceId}?expand=agent`),
    api('GET', `/entity/demand/${PAYMENT.shipmentId}?expand=agent,invoicesOut`),
    api('GET', `/entity/customerorder/${PAYMENT.orderId}?expand=state,agent`),
  ])

  console.log(`  Customer: ${order.agent?.name}`)
  console.log(`  Order: ${order.name} | ${order.state?.name || '?'}`)
  console.log(`  Invoice ${invoice.name}: ${money(invoice.sum)} AED (paid ${money(invoice.payedSum)})`)
  console.log(`  Shipment ${demand.name}: ${money(demand.sum)} AED (paid ${money(demand.payedSum)})`)

  if (order.name !== PAYMENT.orderName) throw new Error(`Unexpected SO ${order.name}`)
  if (invoice.name !== PAYMENT.invoiceName) throw new Error(`Unexpected invoice ${invoice.name}`)
  if (demand.name !== PAYMENT.shipmentName) throw new Error(`Unexpected demand ${demand.name}`)
  if (invoice.agent?.meta?.href?.split('/').pop() !== AGENT_ID) {
    throw new Error(`Invoice agent mismatch: ${invoice.agent?.name}`)
  }
  if (demand.agent?.meta?.href?.split('/').pop() !== AGENT_ID) {
    throw new Error(`Demand agent mismatch: ${demand.agent?.name}`)
  }
  if (invoice.sum !== PAYMENT.amountMinor || demand.sum !== PAYMENT.amountMinor) {
    throw new Error(`Amount mismatch — expected ${money(PAYMENT.amountMinor)}`)
  }
  if (!(demand.invoicesOut || []).some((x) => x.meta.href.includes(PAYMENT.invoiceId))) {
    throw new Error(`${PAYMENT.shipmentName} not linked to invoice ${PAYMENT.invoiceName}`)
  }
  if (demand.customerOrder) {
    throw new Error('Demand has customerOrder — expected invoice-only ship link')
  }

  const paymentMoment = uaeMomentNow()
  if (new Date(paymentMoment.replace(' ', 'T')) <= new Date(String(demand.moment).replace(' ', 'T'))) {
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
      'Full payment 540 AED. MF cream/serum, mist, Ivory. Sharjah delivery free.',
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
