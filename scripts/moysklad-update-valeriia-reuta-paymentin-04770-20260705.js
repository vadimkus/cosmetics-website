#!/usr/bin/env node

/**
 * Miss Valeriia Reuta — rename counterparty, update address, paymentin @ 04770 / 06481.
 *
 *   node --import dotenv/config scripts/moysklad-update-valeriia-reuta-paymentin-04770-20260705.js
 *   node --import dotenv/config scripts/moysklad-update-valeriia-reuta-paymentin-04770-20260705.js --commit
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
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const AGENT_ID = '348a50f6-424a-11f1-0a80-04e30039df61'
const CUSTOMER = {
  name: 'Miss Valeriia Reuta',
  phone: '+380667188965',
  city: 'Dubai',
  street: 'Damac Park Towers, Residential Tower A, apartment 2505',
}

const PAYMENT = {
  amountMinor: 137700,
  note: 'INV 04770 GENOSYS',
  invoiceName: '04770',
  invoiceId: '508f25ac-7887-11f1-0a80-103200615692',
  shipmentName: '06481',
  shipmentId: '512dbe15-7887-11f1-0a80-1032006156a7',
  orderName: 'GENCardM2607058965',
  orderId: '504f8e2e-7887-11f1-0a80-0d9f005f3e12',
}

const MARKER = `VALERIIA-REUTA-PAYMENTIN-04770-${uaeToday()}`
const UPDATE_MARKER = `Renamed Miss Valeriya → Miss Valeriia Reuta ${uaeToday()}`

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

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function addressFull() {
  return { country: countryHref(), city: CUSTOMER.city, street: CUSTOMER.street }
}

async function updateCounterparty() {
  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Was: ${cp.name} | ${cp.phone || '—'}`)
  console.log(`  Was address: ${cp.actualAddressFull?.street || cp.actualAddress || '—'}`)

  if (cp.name === CUSTOMER.name && cp.actualAddressFull?.street === CUSTOMER.street) {
    console.log('  Counterparty already up to date')
    return cp
  }

  if (!COMMIT) {
    console.log(`  Would rename → ${CUSTOMER.name}, update address`)
    return cp
  }

  const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    meta: cp.meta,
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    actualAddressFull: addressFull(),
    legalAddressFull: addressFull(),
    description: [cp.description || '', UPDATE_MARKER].filter(Boolean).join('\n'),
  })
  console.log(`  Now: ${updated.name} | ${updated.phone}`)
  console.log(`  Address: ${updated.actualAddressFull?.street}, ${updated.actualAddressFull?.city}`)
  return updated
}

async function postPaymentin() {
  const [invoice, demand, order] = await Promise.all([
    api('GET', `/entity/invoiceout/${PAYMENT.invoiceId}?expand=agent`),
    api('GET', `/entity/demand/${PAYMENT.shipmentId}?expand=agent,invoicesOut`),
    api('GET', `/entity/customerorder/${PAYMENT.orderId}?expand=state,agent`),
  ])

  console.log(`\n  Invoice ${invoice.name}: ${money(invoice.sum)} (paid ${money(invoice.payedSum)})`)
  console.log(`  Shipment ${demand.name}: ${money(demand.sum)} (paid ${money(demand.payedSum)})`)
  console.log(`  Order ${order.name}: ${order.state?.name || '?'}`)

  if (invoice.agent?.meta?.href?.split('/').pop() !== AGENT_ID) {
    throw new Error(`Invoice agent mismatch: ${invoice.agent?.name}`)
  }
  if (invoice.sum !== PAYMENT.amountMinor) {
    throw new Error(`Amount mismatch: ${money(invoice.sum)} != ${money(PAYMENT.amountMinor)}`)
  }

  const dup = await api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=10`)
  if ((dup.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    console.log('\n  Payment already booked — skip')
    return null
  }

  if (demand.payedSum >= demand.sum) {
    console.log('\n  Shipment already paid')
    if (COMMIT && order.state?.meta?.href?.split('/').pop() !== STATE_ORDER_DELIVERED_ID) {
      await api('PUT', `/entity/customerorder/${PAYMENT.orderId}`, {
        meta: order.meta,
        state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
      })
      console.log(`  Order → Доставлен`)
    }
    return null
  }

  const paymentMoment =
    new Date(uaeMomentNow()) > new Date(demand.moment)
      ? uaeMomentNow()
      : uaeMomentAddMinutes(1, new Date(demand.moment))

  if (!COMMIT) {
    console.log(`\n  Would post paymentin ${money(PAYMENT.amountMinor)} AED`)
    return null
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
      PAYMENT.note,
      `Invoice ${PAYMENT.invoiceName} / shipment ${PAYMENT.shipmentName}`,
      `Order ${PAYMENT.orderName}`,
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
  console.log(`  Invoice paid: ${money(invAfter.payedSum)} / ${money(invAfter.sum)}`)
  console.log(`  Shipment paid: ${money(demAfter.payedSum)} / ${money(demAfter.sum)}`)
  console.log(`  Order: ${orderAfter.state?.name}`)
  return created
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Valeriia Reuta — update card + paymentin 04770')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  console.log('  Step 1: counterparty')
  await updateCounterparty()

  console.log('\n  Step 2: paymentin')
  await postPaymentin()

  if (!COMMIT) console.log('\n  DRY RUN — re-run with --commit')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
