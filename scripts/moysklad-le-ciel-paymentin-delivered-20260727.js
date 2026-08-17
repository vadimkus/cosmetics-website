#!/usr/bin/env node

/**
 * Le Ciel — paymentin for shipment 06591 / invoice 04860 / SO GENCardM260726CIEL,
 * then mark customer order as Delivered.
 *
 *   Total: 795 AED
 *
 *   node --import dotenv/config scripts/moysklad-le-ciel-paymentin-delivered-20260727.js
 *   node --import dotenv/config scripts/moysklad-le-ciel-paymentin-delivered-20260727.js --commit
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
const AGENT_ID = 'd28b9ecf-44c0-11ef-0a80-0379001bda44'
const ORDER_ID = '14b36bbf-88ed-11f1-0a80-15c3005d651a'
const DEMAND_ID = '158ba524-88ed-11f1-0a80-15c3005d6531'
const INVOICE_ID = '14ea9632-88ed-11f1-0a80-1063005c3c76'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const EXPECTED_SUM_MINOR = 79500
const MARKER = 'LE-CIEL-PAYMENTIN-06591-2026-07-27'

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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function main() {
  console.log('====================================================================')
  console.log('  Le Ciel — paymentin + mark Delivered')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  console.log(`  Order:    ${order.name} | ${money(order.sum)} | payed ${money(order.payedSum)}`)
  console.log(`  Invoice:  ${invoice.name} | ${money(invoice.sum)} | payed ${money(invoice.payedSum)}`)
  console.log(`  Shipment: ${demand.name} | ${money(demand.sum)} | payed ${money(demand.payedSum)}`)

  if ((demand.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Demand sum ${money(demand.sum)} != expected ${money(EXPECTED_SUM_MINOR)}`)
  }
  if ((demand.payedSum || 0) >= EXPECTED_SUM_MINOR) {
    throw new Error(`Already fully paid: payedSum=${money(demand.payedSum)}`)
  }

  const dup = await api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=5`)
  if ((dup.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    throw new Error(`Duplicate paymentin marker: ${MARKER}`)
  }

  if (!COMMIT) {
    console.log(`\n  Would create paymentin ${money(EXPECTED_SUM_MINOR)} AED → demand ${demand.name}`)
    console.log('  Would set order state → Delivered')
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: `Incoming payment for shipment ${demand.name} / invoice ${invoice.name} / ${order.name} | ${MARKER}`,
    sum: EXPECTED_SUM_MINOR,
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${DEMAND_ID}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: EXPECTED_SUM_MINOR,
      },
    ],
  })
  console.log(`\n  Paymentin: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const [order2, demand2] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])
  console.log(`  Order state: ${order2.state?.name || '?'}`)
  console.log(`  Shipment payed: ${money(demand2.payedSum)} / ${money(demand2.sum)}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
