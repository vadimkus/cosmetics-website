#!/usr/bin/env node

/**
 * Hind Lougay CODM2608193118 / inv 04950
 * Reduce to collagen mask 00063 ×1 @ 18. Create invoice-only ship + paymentin.
 * SO → Доставлен. Retail invoice → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-amend-hind-codm3118-collagen-pay-20260820.js
 *   node --import dotenv/config scripts/moysklad-amend-hind-codm3118-collagen-pay-20260820.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORDER_ID = '45ceef4f-9c02-11f1-0a80-00600002b283'
const INVOICE_ID = '46274c4f-9c02-11f1-0a80-084e0001f70f'
const AGENT_ID = '45a12fb9-9c02-11f1-0a80-1f9d00026ae6'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = 'HIND-LOUGAY-CODM3118-COLLAGEN-18-PAY-2026-08-20'

const KEEP_CODE = '00063'
const KEEP_AED = 18
const EXPECTED_SUM_MINOR = 1800

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

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
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

function shipmentFromOrder(order) {
  const full = order.shipmentAddressFull || {}
  return {
    country: full.country?.meta ? { meta: full.country.meta } : href('country', COUNTRY_UAE_ID),
    city: full.city || 'Abu Dhabi',
    street: full.street || 'Mohamed Bin Zayed Zone 14 Inshad Street Compound 23 Villa 28',
    addInfo: '',
  }
}

async function exportInvoicePdf(invoiceId, invoiceName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_RETAIL_PRINT_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const out = path.join(ORDERS_DIR, `GENOSYS_Hind_Lougay_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function reduceDoc(type, id) {
  const positions = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
  const keep = positions.filter((p) => p.assortment?.code === KEEP_CODE)
  const drop = positions.filter((p) => p.assortment?.code !== KEEP_CODE)
  if (!keep.length) throw new Error(`${type}: ${KEEP_CODE} missing`)
  await api('PUT', `/entity/${type}/${id}/positions/${keep[0].id}`, {
    quantity: 1,
    price: EXPECTED_SUM_MINOR,
    discount: 0,
    vat: 5,
    vatEnabled: true,
  })
  console.log(`  ${type}: ${KEEP_CODE} → ×1 @ ${KEEP_AED}`)
  for (const p of drop) {
    await api('DELETE', `/entity/${type}/${id}/positions/${p.id}`)
    console.log(`  ${type}: deleted ${p.assortment?.code}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Hind Lougay CODM2608193118 — collagen ×1 @18, ship + pay')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state,agent`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=demands,agent,state`),
  ])

  console.log(`  SO ${order.name} ${money(order.sum)} ${order.agent?.name} ${order.state?.name || ''}`)
  console.log(`  INV ${invoice.name} ${money(invoice.sum)} payed ${money(invoice.payedSum)}`)
  if (order.name !== 'CODM2608193118') throw new Error(`Unexpected SO ${order.name}`)
  if (invoice.name !== '04950') throw new Error(`Unexpected invoice ${invoice.name}`)
  if (order.agent?.id !== AGENT_ID) throw new Error(`Unexpected agent ${order.agent?.id}`)
  if ((invoice.payedSum || 0) > 0) throw new Error('Invoice already has payment — stop')
  if ((invoice.demands || []).length) throw new Error('Invoice already has a demand — stop')

  const docs = [
    ['customerorder', ORDER_ID],
    ['invoiceout', INVOICE_ID],
  ]
  for (const [type, id] of docs) {
    const positions = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    console.log(`  ${type} lines:`)
    for (const p of positions) {
      console.log(
        `    ${p.assortment?.code} ${p.assortment?.name} x${p.quantity} @ ${money(p.price)} disc=${p.discount}`,
      )
    }
    if (!positions.some((p) => p.assortment?.code === KEEP_CODE)) {
      throw new Error(`${type}: ${KEEP_CODE} missing`)
    }
  }

  const shipment = shipmentFromOrder(order)
  console.log(`  Ship: ${shipment.street}, ${shipment.city}`)
  console.log(`  New total: ${money(EXPECTED_SUM_MINOR)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const dup = await api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=10`)
  if ((dup.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    throw new Error('Payment already booked for this marker')
  }

  for (const [type, id] of docs) {
    await reduceDoc(type, id)
  }

  const [soAfter, invAfter] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
  ])
  if (soAfter.sum !== EXPECTED_SUM_MINOR || invAfter.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum mismatch SO ${money(soAfter.sum)} INV ${money(invAfter.sum)}`)
  }

  await api('PUT', `/entity/invoiceout/${INVOICE_ID}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  const invPos = await fetchAll(`/entity/invoiceout/${INVOICE_ID}/positions`)
  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentAddMinutes(2),
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
    description: `Shipment from invoice ${invoice.name} / ${order.name} | ${MARKER}`,
    positions: invPos.map((p) => ({
      quantity: p.quantity,
      price: p.price,
      discount: p.discount || 0,
      assortment: p.assortment,
      vat: p.vat,
      vatEnabled: p.vatEnabled,
    })),
  })
  if (demand.customerOrder) throw new Error('Demand has customerOrder — recreate invoice-only')
  if (demand.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Ship sum ${money(demand.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }
  console.log(`  SHIP ${demand.name} ${money(demand.sum)}`)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: uaeMomentAddMinutes(10),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: EXPECTED_SUM_MINOR,
    description: [
      MARKER,
      `Invoice ${invoice.name} / shipment ${demand.name} / ${order.name}`,
      '18 AED — collagen mask ×1. COD cash.',
    ].join(' | '),
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${demand.id}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: EXPECTED_SUM_MINOR,
      },
    ],
  })

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: soAfter.meta,
    description: [soAfter.description || '', '2026-08-20: reduced to 00063 collagen ×1 @18. Paid COD.'].filter(Boolean).join('\n'),
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`\n  Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
  console.log(`  Shipment: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  Order ${order.name} → Доставлен`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
