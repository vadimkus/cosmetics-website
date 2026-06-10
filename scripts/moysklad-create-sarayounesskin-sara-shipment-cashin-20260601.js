#!/usr/bin/env node

/**
 * Miss Sarayounesskin Sara — shipment + cash in for existing order/invoice.
 *
 * Order:  GENCardM2606014891 (dbbbe419-5d96-11f1-0a80-110c0076e68b)
 * Invoice: 04595 (dbfdc23d-5d96-11f1-0a80-0b6800771501)
 *
 * Chain: invoice → shipment (from invoice only) → cash in (from shipment).
 *
 *   node --import dotenv/config scripts/moysklad-create-sarayounesskin-sara-shipment-cashin-20260601.js
 *   node --import dotenv/config scripts/moysklad-create-sarayounesskin-sara-shipment-cashin-20260601.js --commit
 */

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
const AGENT_ID = 'b852cef4-183e-11f1-0a80-19e6000a846f'
const CASH_ACCOUNT_ID = 'e14ef9fa-33c5-11ea-0a80-020500003a56'

const ORDER_ID = 'dbbbe419-5d96-11f1-0a80-110c0076e68b'
const INVOICE_ID = 'dbfdc23d-5d96-11f1-0a80-0b6800771501'

const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'

const MARKER = `SARAYOUNNESSKIN-SARA-ELYZIUM-PAID-${uaeToday()}`

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=${limit}&offset=${offset}`)
    const batch = data?.rows || []
    rows.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return rows
}

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
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
  return (minor / 100).toFixed(2)
}

async function findExistingDemand(invoiceId) {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  return docs.find(
    (d) =>
      (d.description || '').includes('04595') ||
      (d.description || '').includes('GENCardM2606014891') ||
      (d.description || '').includes(MARKER)
  )
}

async function findExistingCashIn(demandId) {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/cashin?filter=${encodeURIComponent(filter)}`)
  return docs.find((c) => {
    const ops = c.operations || []
    return ops.some((o) => o.meta?.href?.includes(demandId))
  })
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Sarayounesskin Sara — shipment + cash in (invoice 04595)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=agent,state`)
  const invoice = await api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=agent,state`)

  if (order.agent?.meta?.href?.split('/').pop() !== AGENT_ID) {
    throw new Error(`Order agent mismatch: ${order.agent?.name || order.agent?.meta?.href}`)
  }
  if (invoice.agent?.meta?.href?.split('/').pop() !== AGENT_ID) {
    throw new Error(`Invoice agent mismatch: ${invoice.agent?.name || invoice.agent?.meta?.href}`)
  }

  console.log(`  Customer: ${order.agent?.name || 'Miss Sarayounesskin Sara'}`)
  console.log(`  Order: ${order.name} | ${money(order.sum)} AED | payed ${money(order.payedSum || 0)}`)
  console.log(`  Invoice: ${invoice.name} | ${money(invoice.sum)} AED | payed ${money(invoice.payedSum || 0)}`)

  const existingDemand = await findExistingDemand(INVOICE_ID)
  if (existingDemand) {
    console.log(`  Existing shipment: ${existingDemand.name} (${existingDemand.id})`)
  }

  const invPos = await fetchAll(`/entity/invoiceout/${INVOICE_ID}/positions`)
  const demandPositions = invPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  const sumMinor = invoice.sum
  const shipment = invoice.shipmentAddressFull || order.shipmentAddressFull

  console.log(`  Shipment lines: ${demandPositions.length} | total ${money(sumMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const tShip = uaeMomentAddMinutes(2)
  const tCash = uaeMomentAddMinutes(4)

  let demand = existingDemand
  if (!demand) {
    demand = await api('POST', '/entity/demand', {
      moment: tShip,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      store: href('store', STORE_ID),
      invoicesOut: [href('invoiceout', INVOICE_ID)],
      state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
      shipmentAddressFull: shipment,
      description: `Shipment for ${invoice.name} / ${order.name} | ${MARKER}`,
      positions: demandPositions,
    })
    console.log(`\n  1) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  } else {
    console.log(`\n  1) Shipment (existing): ${demand.name} | ${money(demand.sum)} AED`)
  }
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  let cashIn = await findExistingCashIn(demand.id)
  if (!cashIn) {
    cashIn = await api('POST', '/entity/cashin', {
      moment: tCash,
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      organizationAccount: href('account', CASH_ACCOUNT_ID),
      description: `Cash payment for shipment ${demand.name} / ${order.name} | ${MARKER}`,
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
    console.log(`  2) Cash in: ${cashIn.name} | ${money(cashIn.sum)} AED`)
  } else {
    console.log(`  2) Cash in (existing): ${cashIn.name} | ${money(cashIn.sum)} AED`)
  }
  console.log(`     https://online.moysklad.ru/app/#cashin/edit?id=${cashIn.id}`)

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const orderRead = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const invRead = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  const demandRead = await api('GET', `/entity/demand/${demand.id}`)

  console.log('\n  Verification:')
  console.log(`    Order payedSum: ${money(orderRead.payedSum || 0)} / ${money(orderRead.sum)} AED`)
  console.log(`    Invoice payedSum: ${money(invRead.payedSum || 0)} / ${money(invRead.sum)} AED`)
  console.log(`    Shipment payedSum: ${money(demandRead.payedSum || 0)} / ${money(demandRead.sum)} AED`)
  console.log(`    Shipment from order: ${demandRead.customerOrder ? 'yes (unexpected)' : 'no (invoice only)'}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
