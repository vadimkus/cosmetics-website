#!/usr/bin/env node

/**
 * 31 Aug — mark three retail SOs paid + Доставлен in MoySklad only.
 *
 *   Kamshat GENCardM2608315056 — already paid/shipped → Доставлен
 *   Madinaxon GENCardW2608312409 — already paid/shipped → Доставлен
 *   Alena Shoreline GENCardM260831SH16 — paymentin @ 06765 / 576 → Доставлен
 *
 *   node --import dotenv/config scripts/moysklad-mark-paid-delivered-kamshat-madinaxon-alena-20260831.js
 *   node --import dotenv/config scripts/moysklad-mark-paid-delivered-kamshat-madinaxon-alena-20260831.js --commit
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
const PAID_AWAITING_ID = '909556cd-8f70-11ea-0a80-016b00219616'
const DELIVERED_AWAIT_PAY_ID = 'e1a0af19-33c5-11ea-0a80-043f000b2760'
const DELIVERED_STATE_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const MARK_DELIVERED = [
  {
    name: 'GENCardM2608315056',
    customer: 'Kamshat Kadyrova',
    id: '82bd0ed8-a538-11f1-0a80-0dcc00d5c3a9',
    expectedMinor: 27500,
  },
  {
    name: 'GENCardW2608312409',
    customer: 'Miss Madinaxon Omonullayeva',
    id: 'e6ced704-a52c-11f1-0a80-1ecb00ccf648',
    expectedMinor: 93781,
  },
]

const ALENA = {
  agentId: '16f2895a-a51b-11f1-0a80-0cd600c7a2b9',
  orderName: 'GENCardM260831SH16',
  orderId: '184f12be-a51b-11f1-0a80-182000c61e68',
  invoiceName: '04997',
  invoiceId: '18a6384a-a51b-11f1-0a80-1ecb00c53a32',
  shipmentName: '06765',
  shipmentId: '19e5b7d9-a51b-11f1-0a80-0e4600c5dab7',
  amountMinor: 57600,
  marker: 'ALENA-SHORELINE-PAYMENTIN-04997-2026-08-31',
}

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function orgAccountHref(id) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
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

function stateId(order) {
  return order.state?.meta?.href?.split('/').pop() || ''
}

async function markDelivered(cfg) {
  const order = await api('GET', `/entity/customerorder/${cfg.id}?expand=state,agent`)
  if (order.name !== cfg.name) throw new Error(`${cfg.customer}: expected ${cfg.name}, got ${order.name}`)
  if (order.agent?.name !== cfg.customer) throw new Error(`${cfg.name}: unexpected agent ${order.agent?.name}`)
  if (order.sum !== cfg.expectedMinor) {
    throw new Error(`${cfg.name}: expected ${money(cfg.expectedMinor)}, got ${money(order.sum)}`)
  }
  if ((order.payedSum || 0) !== order.sum) throw new Error(`${cfg.name}: not fully paid`)
  if ((order.shippedSum || 0) !== order.sum) throw new Error(`${cfg.name}: not fully shipped`)
  const sid = stateId(order)
  if (sid !== PAID_AWAITING_ID && sid !== DELIVERED_STATE_ID) {
    throw new Error(`${cfg.name}: unexpected state ${order.state?.name}`)
  }
  console.log(`  ${cfg.name} | ${cfg.customer} | ${money(order.sum)} | ${order.state?.name}`)
  if (!COMMIT) return
  if (sid === DELIVERED_STATE_ID) {
    console.log('    already Доставлен')
    return
  }
  await api('PUT', `/entity/customerorder/${cfg.id}`, {
    meta: order.meta,
    state: stateHref('customerorder', DELIVERED_STATE_ID),
  })
  const after = await api('GET', `/entity/customerorder/${cfg.id}?expand=state`)
  console.log(`    → ${after.state?.name}`)
}

async function payAlena() {
  const [invoice, demand, order] = await Promise.all([
    api('GET', `/entity/invoiceout/${ALENA.invoiceId}?expand=agent`),
    api('GET', `/entity/demand/${ALENA.shipmentId}?expand=agent,invoicesOut`),
    api('GET', `/entity/customerorder/${ALENA.orderId}?expand=state,agent`),
  ])
  console.log(`  ${order.name} | ${order.agent?.name} | ${money(order.sum)} | ${order.state?.name}`)
  console.log(`    INV ${invoice.name} paid ${money(invoice.payedSum)} / ${money(invoice.sum)}`)
  console.log(`    SHIP ${demand.name} paid ${money(demand.payedSum)} / ${money(demand.sum)}`)

  if (order.name !== ALENA.orderName) throw new Error(`Unexpected SO ${order.name}`)
  if (order.agent?.name !== 'Miss Alena (Shoreline)') throw new Error(`Unexpected agent ${order.agent?.name}`)
  if (invoice.name !== ALENA.invoiceName) throw new Error(`Unexpected invoice ${invoice.name}`)
  if (demand.name !== ALENA.shipmentName) throw new Error(`Unexpected demand ${demand.name}`)
  if (invoice.sum !== ALENA.amountMinor || demand.sum !== ALENA.amountMinor || order.sum !== ALENA.amountMinor) {
    throw new Error(`Alena amount mismatch — expected ${money(ALENA.amountMinor)}`)
  }
  if (!(demand.invoicesOut || []).some((x) => x.meta.href.includes(ALENA.invoiceId))) {
    throw new Error(`${ALENA.shipmentName} not linked to invoice ${ALENA.invoiceName}`)
  }
  if (demand.customerOrder) throw new Error('Demand has customerOrder — expected invoice-only ship link')
  const sid = stateId(order)
  if (sid !== DELIVERED_AWAIT_PAY_ID && sid !== DELIVERED_STATE_ID) {
    throw new Error(`Alena unexpected state ${order.state?.name}`)
  }

  const dup = await api('GET', `/entity/paymentin?search=${encodeURIComponent(ALENA.marker)}&limit=10`)
  if ((dup.rows || []).some((r) => (r.description || '').includes(ALENA.marker))) {
    throw new Error('Alena payment already booked')
  }

  if ((demand.payedSum || 0) >= demand.sum && sid === DELIVERED_STATE_ID) {
    console.log('    already paid + Доставлен')
    return
  }

  if (!COMMIT) return

  const created = await api('POST', '/entity/paymentin', {
    applicable: true,
    moment: uaeMomentNow(),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', ALENA.agentId),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: ALENA.amountMinor,
    description: [
      ALENA.marker,
      `Invoice ${ALENA.invoiceName} / shipment ${ALENA.shipmentName}`,
      `Order ${ALENA.orderName} — 576 AED.`,
    ].join(' | '),
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${ALENA.shipmentId}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: ALENA.amountMinor,
      },
    ],
  })

  await api('PUT', `/entity/customerorder/${ALENA.orderId}`, {
    meta: order.meta,
    state: stateHref('customerorder', DELIVERED_STATE_ID),
  })

  const [invAfter, demAfter, orderAfter] = await Promise.all([
    api('GET', `/entity/invoiceout/${ALENA.invoiceId}`),
    api('GET', `/entity/demand/${ALENA.shipmentId}`),
    api('GET', `/entity/customerorder/${ALENA.orderId}?expand=state`),
  ])
  console.log(`    Paymentin ${created.name} | ${money(created.sum)}`)
  console.log(`    Invoice paid ${money(invAfter.payedSum)} / ${money(invAfter.sum)}`)
  console.log(`    Shipment paid ${money(demAfter.payedSum)} / ${money(demAfter.sum)}`)
  console.log(`    → ${orderAfter.state?.name}`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Mark paid + Доставлен — MoySklad only')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  for (const cfg of MARK_DELIVERED) {
    await markDelivered(cfg)
  }
  await payAlena()

  if (!COMMIT) console.log('\n  DRY RUN — re-run with --commit')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
