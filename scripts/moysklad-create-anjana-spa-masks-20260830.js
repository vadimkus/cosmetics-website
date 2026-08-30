#!/usr/bin/env node

/**
 * ANJANA SPA - FZE — unpaid clinic SO → invoice → shipment (2026-08-30).
 *
 *   Collagen (red) 00063 ×50 @ list 18 → 14.50 net
 *   Sea Algae (green) 00140 ×50 @ list 18 → 14.50 net
 *   Free delivery — Rixos The Palm, Jumeirah
 *   Total: 1,450.00 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-anjana-spa-masks-20260830.js
 *   node --import dotenv/config scripts/moysklad-create-anjana-spa-masks-20260830.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const AGENT_ID = 'd5532af5-6356-11f1-0a80-08090090f8b4'

const STATE_DELIVERED_AWAIT_PAY_ID = 'e1a0af19-33c5-11ea-0a80-043f000b2760'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const LIST_AED = 18
const NET_AED = 14.5
const DISCOUNT_PCT = Number((((LIST_AED - NET_AED) / LIST_AED) * 100).toFixed(4))

const LINES = [
  ['00063', 50, 'Intensive Repair Collagen Mask'],
  ['00140', 50, 'Soothing Bomb Sea Algae Mask'],
]

const EXPECTED_SUM_MINOR = 145000

const ORDER = {
  name: `GENCardM${uaeShortDate()}ANJ`,
  marker: `Anjana Spa collagen×50+sea×50 list18→14.5 free-del ${uaeToday()}`,
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

function shipmentAddress(agent) {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: 'Dubai',
    street:
      agent.actualAddress ||
      agent.legalAddress ||
      'Anjana Spa at Rixos The Palm, Jumeirah, Dubai, UAE',
    addInfo: '',
  }
}

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
  }
}

function buildPositions(products) {
  const priceMinor = Math.round(LIST_AED * 100)
  const positions = products.map((p) => ({
    quantity: p.qty,
    price: priceMinor,
    discount: DISCOUNT_PCT,
    assortment: href('product', p.id),
    vat: 5,
    vatEnabled: true,
  }))
  const sumMinor = products.reduce(
    (s, p) => s + Math.round(priceMinor * p.qty * (1 - DISCOUNT_PCT / 100)),
    0,
  )
  return { positions, sumMinor }
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
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_ANJANA_SPA_Invoice_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  ANJANA SPA - FZE — SO + invoice + shipment (masks)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (agent.name !== 'ANJANA SPA - FZE') {
    throw new Error(`Unexpected agent: ${agent.name}`)
  }
  console.log(`  Customer: ${agent.name} | ${agent.phone || '—'}`)

  const existingName = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`,
  )
  if (existingName?.rows?.length) throw new Error(`Order name taken: ${ORDER.name}`)

  if (COMMIT) {
    const filter = [
      `agent=${API}/entity/counterparty/${AGENT_ID}`,
      `moment>=${uaeToday()} 00:00:00`,
      `moment<=${uaeToday()} 23:59:59`,
    ].join(';')
    const todayDocs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
    const dup = todayDocs.find((d) => (d.description || '').includes(ORDER.marker))
    if (dup) throw new Error(`Duplicate order ${dup.name}`)
  }

  const products = []
  for (const [code, qty, label] of LINES) {
    const item = await fetchAssortmentByCode(code)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    }
    products.push({ ...item, qty, label })
  }

  const { positions, sumMinor } = buildPositions(products)
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  const ship = shipmentAddress(agent)
  console.log(`  Order: ${ORDER.name}`)
  console.log(`  Ship: ${ship.street}, ${ship.city} (free delivery)`)
  for (const p of products) {
    console.log(
      `    ${p.code} ${p.label} x${p.qty} @ ${LIST_AED.toFixed(2)} − ${DISCOUNT_PCT}% → ${NET_AED.toFixed(2)}/pc (avail ${p.available})`,
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED unpaid`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    shared: true,
    description: [
      ORDER.marker,
      'Collagen 00063 x50 + Sea Algae 00140 x50 @ 18 list → 14.50 net.',
      'Free delivery — Rixos The Palm, Jumeirah.',
      'Unpaid clinic chain: invoice → shipment.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_DELIVERED_AWAIT_PAY_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: ship,
    positions,
  })
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)} AED`)

  const invoice = await api('POST', '/entity/invoiceout', {
    moment: t1,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    customerOrder: href('customerorder', order.id),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: ship,
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  })
  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)

  const invPos = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
  const demand = await api('POST', '/entity/demand', {
    moment: t2,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull: ship,
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker} | free delivery`,
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
  if (order.sum !== EXPECTED_SUM_MINOR || invoice.sum !== EXPECTED_SUM_MINOR || demand.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Posted sum mismatch SO ${money(order.sum)} INV ${money(invoice.sum)} SHIP ${money(demand.sum)}`)
  }
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  console.log(`  PDF: ${pdfPath}`)
  console.log(`  Order:    https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
  console.log(`  Invoice:  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)
  console.log(`  Shipment: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
