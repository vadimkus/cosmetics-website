#!/usr/bin/env node

/**
 * Genesis Healthcare Centre — full paymentin for INV-04830 (2,970 AED),
 * mark SO PARTW2607160539 as Delivered.
 *
 * Bank: ADCB Instant Transfer 25 Jul 2026 09:47, ref 525992368/691347359
 *
 *   node --import dotenv/config scripts/moysklad-genesis-paymentin-04830-delivered-20260725.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const AGENT_ID = 'efa467b8-825b-11f1-0a80-082e002d861f'
const ORDER_ID = '361f8c3d-8130-11f1-0a80-0dc40023a524'
const DEMAND_ID = '36efaf8c-8130-11f1-0a80-0bab00236329'
const INVOICE_ID = '36623435-8130-11f1-0a80-04d100239d31'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const EXPECTED_SUM_MINOR = 297000
const MARKER = 'GENESIS-PAYMENTIN-04830-2026-07-25'
const REF = '525992368/691347359'
const PAY_MOMENT = '2026-07-25 09:47:30'

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
  console.log('  Genesis Healthcare — paymentin 04830 + delivered')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  console.log(`  Order:    ${order.name} | ${money(order.sum)} | payed ${money(order.payedSum)} | ${order.state?.name || '?'}`)
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
    return
  }

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: PAY_MOMENT,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: [
      MARKER,
      'ADCB Instant Transfer from GENESIS HEALTHCARE CENTRE FZ LLC',
      `AED 2,970.00 | INV-04830 | ref ${REF}`,
      'Acc AE810030011513466920001',
    ].join(' | '),
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
  console.log(`\n  Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })
  console.log('  Order marked Delivered')

  const [order2, demand2] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])
  console.log(`\n  Verify order state: ${order2.state?.name || '?'}`)
  console.log(`  Verify shipment payed: ${money(demand2.payedSum)} / ${money(demand2.sum)} AED`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
