#!/usr/bin/env node

/**
 * Milena JBR — paymentin 750 AED @ invoice 04924 / shipment 06676 /
 * SO GENCardM260812MILJCAM5. Link to demand only. Then SO → Доставлен.
 *
 *   node --import dotenv/config scripts/moysklad-create-milena-jbr-04924-paymentin-20260817.js
 *   node --import dotenv/config scripts/moysklad-create-milena-jbr-04924-paymentin-20260817.js --commit
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
const AGENT_ID = 'b16bd870-da6d-11f0-0a80-1902000d2f93'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const MARKER = 'MILENA-JBR-PAYMENTIN-04924-2026-08-17'

const DOCS = {
  orderId: '82c42c93-963f-11f1-0a80-0cb10026eb98',
  orderName: 'GENCardM260812MILJCAM5',
  invoiceId: '833206e9-963f-11f1-0a80-0cb10026ebe0',
  invoiceName: '04924',
  demandId: '04f8b84e-9645-11f1-0a80-02d500288ab4',
  demandName: '06676',
  amountMinor: 75000,
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
  console.log('  Milena JBR — paymentin 750 @ 04924 / 06676')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${DOCS.orderId}?expand=state,agent`),
    api('GET', `/entity/invoiceout/${DOCS.invoiceId}?expand=agent`),
    api('GET', `/entity/demand/${DOCS.demandId}?expand=invoicesOut`),
  ])

  console.log(`  Customer: ${order.agent?.name}`)
  console.log(`  Order: ${order.name} | ${order.state?.name || '?'} | ${money(order.sum)}`)
  console.log(`  Invoice ${invoice.name}: ${money(invoice.sum)} (paid ${money(invoice.payedSum)})`)
  console.log(`  Shipment ${demand.name}: ${money(demand.sum)} (paid ${money(demand.payedSum)}) SO-link ${!!demand.customerOrder}`)

  if (order.name !== DOCS.orderName) throw new Error(`Order name mismatch: ${order.name}`)
  if (invoice.name !== DOCS.invoiceName) throw new Error(`Invoice name mismatch: ${invoice.name}`)
  if (demand.name !== DOCS.demandName) throw new Error(`Demand name mismatch: ${demand.name}`)
  if (invoice.sum !== DOCS.amountMinor || demand.sum !== DOCS.amountMinor) {
    throw new Error(`Amount mismatch — expected ${money(DOCS.amountMinor)}`)
  }
  if (demand.customerOrder) throw new Error('Demand has customerOrder — stop')
  if (!(demand.invoicesOut || []).some((x) => x.meta.href.includes(DOCS.invoiceId))) {
    throw new Error('Shipment not linked to invoice 04924')
  }

  if ((demand.payedSum || 0) >= demand.sum) {
    console.log('\n  Already paid — ensuring order Доставлен')
    if (COMMIT && order.state?.meta?.href?.split('/').pop() !== STATE_ORDER_DELIVERED_ID) {
      await api('PUT', `/entity/customerorder/${DOCS.orderId}`, {
        meta: order.meta,
        state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
      })
      console.log(`  Order ${order.name} → Доставлен`)
    }
    return
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: DOCS.amountMinor,
    description: [
      MARKER,
      `Payment for ${DOCS.demandName} / ${DOCS.invoiceName} / ${DOCS.orderName}`,
      '750 AED — Camel cushion x5 @ 150.',
    ].join(' | '),
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${DOCS.demandId}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: DOCS.amountMinor,
      },
    ],
  })

  await api('PUT', `/entity/customerorder/${DOCS.orderId}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const [invAfter, shipAfter] = await Promise.all([
    api('GET', `/entity/invoiceout/${DOCS.invoiceId}`),
    api('GET', `/entity/demand/${DOCS.demandId}`),
  ])
  if ((invAfter.payedSum || 0) < DOCS.amountMinor || (shipAfter.payedSum || 0) < DOCS.amountMinor) {
    throw new Error(
      `Pay link incomplete INV ${money(invAfter.payedSum)} SHIP ${money(shipAfter.payedSum)}`,
    )
  }

  console.log(`\n  Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
  console.log(`  Order ${order.name} → Доставлен`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
