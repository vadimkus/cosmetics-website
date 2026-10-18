#!/usr/bin/env node
/**
 * GENCardM2610182681 (Coute Coraline, app, card, paid 615 AED): SO -> INV 05246 already exist.
 * Creates SHIP from the invoice (linked via invoicesOut only, no customerOrder), PAYMENT IN on the
 * shipment for the full sum, then SO -> Доставлен.
 *
 * Usage: node scripts/moysklad-ship-pay-GENCardM2610182681-20261018.js [--apply]
 */
require('dotenv').config({ path: '.env' })

const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')
const APPLY = process.argv.includes('--apply')

const ORDER_NAME = 'GENCardM2610182681'
const INVOICE_NAME = '05246'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const DEMAND_SHIPPED_STATE = '50d70717-4582-11ea-0a80-05e3001273a2' // Отгружен
const ORDER_DELIVERED_STATE = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e' // Доставлен

const meta = (type, href) => ({ meta: { href, type, mediaType: 'application/json' } })
const entity = (type, id) => meta(type, `${API}/entity/${type}/${id}`)

async function ms(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text.slice(0, 400)}`)
  return text ? JSON.parse(text) : null
}

async function main() {
  const orderRow = (await ms('GET', `/entity/customerorder?filter=name=${ORDER_NAME}`)).rows[0]
  const invoice = (await ms('GET', `/entity/invoiceout?filter=name=${INVOICE_NAME}`)).rows[0]
  if (!orderRow || !invoice) throw new Error('order or invoice not found')
  const order = await ms('GET', `/entity/customerorder/${orderRow.id}?expand=state,agent`)
  console.log(`${order.agent.name} | ${order.name} | ${order.state.name} | sum ${order.sum / 100} | invoice ${invoice.name} ${invoice.sum / 100}`)
  if (invoice.agent.meta.href !== order.agent.meta.href) throw new Error('invoice agent differs from order agent')

  if ((invoice.demands || []).length) throw new Error(`invoice already has ${invoice.demands.length} shipment(s)`)
  if ((invoice.payments || []).length) throw new Error(`invoice already has ${invoice.payments.length} payment(s)`)

  const invPos = (await ms('GET', `/entity/invoiceout/${invoice.id}/positions`)).rows
  const positions = invPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
    assortment: { meta: p.assortment.meta },
  }))
  console.log(`shipment: ${positions.length} lines from invoice, sum ${invoice.sum / 100}`)
  if (!APPLY) return console.log('Dry run. Re-run with --apply.')

  const demand = await ms('POST', '/entity/demand', {
    description: `Shipment for ${invoice.name} / ${order.name} (app, card)`,
    organization: entity('organization', ORG_ID),
    agent: { meta: order.agent.meta },
    store: entity('store', STORE_ID),
    invoicesOut: [entity('invoiceout', invoice.id)],
    state: meta('state', `${API}/entity/demand/metadata/states/${DEMAND_SHIPPED_STATE}`),
    vatEnabled: true,
    vatIncluded: true,
    ...(order.shipmentAddressFull ? { shipmentAddressFull: order.shipmentAddressFull } : {}),
    positions,
  })
  console.log(`SHIP ${demand.name} sum ${demand.sum / 100}`)

  const payment = await ms('POST', '/entity/paymentin', {
    description: `Incoming payment for shipment ${demand.name} / ${order.name} (Stripe, card)`,
    organization: entity('organization', ORG_ID),
    agent: { meta: order.agent.meta },
    organizationAccount: meta('account', `${API}/entity/organization/${ORG_ID}/accounts/${ACCOUNT_ID}`),
    moment: new Date(Date.now() + 60_000).toISOString().replace('T', ' ').slice(0, 19),
    sum: demand.sum,
    operations: [{ ...entity('demand', demand.id), linkedSum: demand.sum }],
  })
  console.log(`PAYMENT IN ${payment.name} sum ${payment.sum / 100}`)

  await ms('PUT', `/entity/customerorder/${order.id}`, {
    state: meta('state', `${API}/entity/customerorder/metadata/states/${ORDER_DELIVERED_STATE}`),
  })
  const after = await ms('GET', `/entity/customerorder/${order.id}?expand=state`)
  console.log(`SO ${after.name} -> ${after.state.name}, paid ${after.payedSum / 100} / ${after.sum / 100}, shipped ${after.shippedSum / 100}`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
