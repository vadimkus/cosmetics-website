#!/usr/bin/env node

/**
 * Shine Medical Center (Dibba) — paymentin @ shipment 06549 / invoice 04826.
 * 1,195 AED. Order GENCardM2607165371 → Доставлен.
 *
 *   node --import dotenv/config scripts/moysklad-create-shine-paymentin-04826-20260822.js
 *   node --import dotenv/config scripts/moysklad-create-shine-paymentin-04826-20260822.js --commit
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
const AGENT_ID = '51c7851a-37da-11f1-0a80-148900411927'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const MARKER = 'SHINE-DIBBA-PAYMENTIN-04826-2026-08-22'

const PAYMENT = {
  amountMinor: 119500,
  invoiceName: '04826',
  invoiceId: 'b4720866-80d7-11f1-0a80-1843000f3463',
  shipmentName: '06549',
  shipmentId: 'b52b40d1-80d7-11f1-0a80-15c0000f3d31',
  orderName: 'GENCardM2607165371',
  orderId: 'b424112d-80d7-11f1-0a80-1843000f3433',
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
  console.log('  Shine Dibba — paymentin @ 04826 / 06549')
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
      'Full payment 1195 AED. PDRN pack, Hydro Cool, SRS x10, PCS x10.',
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
