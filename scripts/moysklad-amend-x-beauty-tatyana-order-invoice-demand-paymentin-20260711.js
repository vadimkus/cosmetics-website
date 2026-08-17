#!/usr/bin/env node

/**
 * X BEAUTY CONSULTING — amend GENCardM2607107458 (Tatyana top-up),
 * then invoice → shipment → paymentin + PDF.
 *
 *   node --import dotenv/config scripts/moysklad-amend-x-beauty-tatyana-order-invoice-demand-paymentin-20260711.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const AGENT_ID = '03c174b0-4581-11ea-0a80-01f80012b189'

const ORDER_ID = '681fdb2a-7c7d-11f1-0a80-182c00245170'
const ORDER_NAME = 'GENCardM2607107458'
const DELIVERY_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'

const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `X-BEAUTY-TATYANA-TOPUP-${uaeToday()}`
const EXPECTED_SUM_MINOR = 88500

/** [code, productId, qty, unitAed, type] type=product|service */
const TARGET_LINES = [
  ['54461', 'bcf432e7-ec44-11ee-0a80-077500174711', 1, 145, 'product'],
  ['00021', '429cb35d-3449-11ea-0a80-00e60001afc8', 1, 165, 'product'],
  ['00145', '86d64dba-29c8-11ed-0a80-07740006f514', 1, 130, 'product'],
  ['00194', '99d39c51-82f1-11ee-0a80-13cb0013bf3a', 1, 165, 'product'],
  ['00122', 'd0fc1a8f-a96f-11ea-0a80-00d100134b49', 1, 145, 'product'],
  ['00089', DELIVERY_SERVICE_ID, 3, 45, 'service'],
]

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
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
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

function lineCode(pos) {
  return pos.assortment?.code || ''
}

function isDelivery(pos) {
  const code = lineCode(pos)
  return code === '00089' || pos.assortment?.meta?.type === 'service'
}

async function rebuildOrderPositions() {
  const rows = await fetchAll(`/entity/customerorder/${ORDER_ID}/positions?expand=assortment`)
  console.log(`  Current SO lines: ${rows.length}`)
  for (const p of rows) {
    console.log(`    del? ${lineCode(p)} qty=${p.quantity} @ ${money(p.price)}`)
    if (COMMIT) await api('DELETE', `/entity/customerorder/${ORDER_ID}/positions/${p.id}`)
  }

  for (const [code, entityId, qty, unitAed, kind] of TARGET_LINES) {
    const priceMinor = Math.round(unitAed * 100)
    const payload = {
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href(kind, entityId),
      vat: 5,
      vatEnabled: true,
    }
    console.log(`    + ${code} x${qty} @ ${unitAed.toFixed(2)}`)
    if (COMMIT) await api('POST', `/entity/customerorder/${ORDER_ID}/positions`, payload)
  }
}

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && full.street) {
    return { country: { meta: full.country.meta }, city: full.city, street: full.street }
  }
  return {
    country: href('country', '8afef359-33c6-11ea-0a80-0043000aceae'),
    city: 'Dubai',
    street: agent.actualAddress || 'UAE',
  }
}

async function positionsFromOrder() {
  const rows = await fetchAll(`/entity/customerorder/${ORDER_ID}/positions?expand=assortment`)
  return rows.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment.meta ? { meta: p.assortment.meta } : p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))
}

async function exportInvoicePdf(invoiceId, invoiceName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_LEGAL_TAX_TEMPLATE_ID}`,
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
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, `GENOSYS_X_Beauty_Consulting_Tatyana_${invoiceName}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  X BEAUTY — amend order + invoice + shipment + paymentin (Tatyana)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, agent] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/counterparty/${AGENT_ID}`),
  ])
  console.log(`\n  Order: ${order.name} | was ${money(order.sum)} AED`)
  console.log(`  Customer: ${agent.name}`)

  console.log('\n  Rebuilding order lines @ clinic prices:')
  for (const [code, , qty, unitAed] of TARGET_LINES) {
    console.log(`    ${code} x${qty} @ ${unitAed.toFixed(2)} AED`)
  }
  console.log(`  Expected total: ${money(EXPECTED_SUM_MINOR)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await rebuildOrderPositions()

  const orderAfter = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: orderAfter.meta,
    description: [
      orderAfter.description?.split('\n')[0] || '',
      MARKER,
      '54461 makeup remover, 00021 snow cleanser, 00145 problem toner, 00194 multi vita serum, 00122 radiance cream 50g; delivery Dubai x3 @45.',
    ]
      .filter(Boolean)
      .join(' | '),
  })

  const orderFinal = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  if (Math.abs(orderFinal.sum - EXPECTED_SUM_MINOR) > 2) {
    throw new Error(`Order sum ${money(orderFinal.sum)} != ${money(EXPECTED_SUM_MINOR)}`)
  }
  console.log(`\n  SO updated: ${money(orderFinal.sum)} AED`)

  const positions = await positionsFromOrder()
  const shipmentAddressFull = buildShipmentAddress(agent)
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)
  const t3 = uaeMomentAddMinutes(5)

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      customerOrder: href('customerorder', ORDER_ID),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${ORDER_NAME} | ${MARKER} | Tatyana`,
      positions,
    })
  } catch {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      customerOrder: href('customerorder', ORDER_ID),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${ORDER_NAME} | ${MARKER} | Tatyana`,
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  console.log(`  Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

  const invPos = await fetchAll(`/entity/invoiceout/${invoice.id}/positions?expand=assortment`)
  const demandPositions = invPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment.meta ? { meta: p.assortment.meta } : p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  const demand = await api('POST', '/entity/demand', {
    moment: t2,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} / ${ORDER_NAME} | ${MARKER}`,
    positions: demandPositions,
  })
  console.log(`  Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const paySum = demand.sum
  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: t3,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: `Incoming payment for ${demand.name} / ${ORDER_NAME} | ${MARKER}`,
    sum: paySum,
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${demand.id}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: paySum,
      },
    ],
  })
  console.log(`  Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: orderFinal.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const demandRead = await api('GET', `/entity/demand/${demand.id}`)
  console.log(`\n  Shipment payedSum: ${money(demandRead.payedSum)} / ${money(demandRead.sum)} AED`)

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  if (pdfPath) console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
