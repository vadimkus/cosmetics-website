#!/usr/bin/env node

/**
 * HORTMAN CLINICS 2 L.L.C (Jumeirah) — SO → invoice → shipment.
 *
 * Lines: Hydro Cool Modeling Mask 1kg (00013) ×20 @ clinic list (300 AED ex-VAT).
 *
 * VAT rule (HORTMAN CLINICS 2): always **VAT on top** — `vatIncluded: false`,
 * unit price = list ex-VAT, MoySklad adds 5% VAT to document total.
 * PDF: Genosys_Invoice_Legal_TAX → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-hortman-clinics2-hydrocool-order-invoice-demand-20260810.js
 *   node --import dotenv/config scripts/moysklad-create-hortman-clinics2-hydrocool-order-invoice-demand-20260810.js --commit
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

const { uaeToday, uaeTodayDmy, uaeMomentNow, uaeMomentAddMinutes, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const HORTMAN_VAT_INCLUDED = false
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const PRODUCT_CODE = '00013'
const PRODUCT_ID = '806e9e52-3444-11ea-0a80-05dc00014e2d' // 00013 Hydro Cool (overridden from stock meta)
const AGENT_ID = '1ac006c7-2687-11f0-0a80-094f001f888f' // HORTMAN CLINICS 2 L.L.C
const QTY = 20
const UNIT_EX_VAT_MINOR = 30000 // 300.00 AED clinic list ex-VAT
const EXPECTED_BASE_MINOR = UNIT_EX_VAT_MINOR * QTY // 6,000
const EXPECTED_TOTAL_MINOR = Math.round(EXPECTED_BASE_MINOR * 1.05) // 6,300

const ORDER = {
  name: `CODM${uaeShortDate()}2623`,
  moment: uaeMomentNow(),
  marker: `Hortman Clinics 2 Hydro Cool 00013 x20 ${uaeToday()}`,
  paymentNote: `Payment 90 days: ${uaeTodayDmy()}`,
}

async function api(method, pathStr, body) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
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
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
      return text ? JSON.parse(text) : null
    } catch (e) {
      if (attempt === 5) throw e
      await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
    }
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

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchStock00013() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const row = rows.find((r) => r.code === PRODUCT_CODE)
  if (!row) throw new Error('Stock row not found for 00013')
  const id = row.meta?.href?.split('/').pop()?.split('?')[0]
  return {
    id: id || PRODUCT_ID,
    code: row.code,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
    price: UNIT_EX_VAT_MINOR,
  }
}

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && full.street) {
    return { country: { meta: full.country.meta }, city: full.city, street: full.street }
  }
  const addInfo = full?.addInfo || agent.actualAddress?.addInfo || ''
  return {
    country: countryHref(),
    city: 'Dubai',
    street: addInfo || '450 Jumeira St - Jumeirah 3 - Dubai',
  }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`,
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday(agentId) {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate protection: order exists (${dup.name}, id=${dup.id})`)
}

function buildPositions(stock) {
  if (stock.available < QTY) {
    throw new Error(`Insufficient stock 00013: need ${QTY}, have ${stock.available}`)
  }
  const positions = [
    {
      quantity: QTY,
      price: stock.price,
      discount: 0,
      assortment: href('product', stock.id),
      vat: 5,
      vatEnabled: true,
    },
  ]
  const sumMinor = stock.price * QTY
  return { positions, sumMinor }
}

async function exportInvoicePdf(invoiceId) {
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
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function ordersPdfPath(invoiceName) {
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  return path.join(ordersDir, `GENOSYS_Hortman_Clinics2_${safe}.pdf`)
}

async function main() {
  console.log('====================================================================')
  console.log('  HORTMAN CLINICS 2 (Jumeirah) — Hydro Cool ×20 SO + inv + ship')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('  VAT: on top (vatIncluded: false)')

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name} (${agent.id})`)
  console.log(`  Phone: ${agent.phone || '—'}`)
  console.log(`  Address: ${agent.actualAddress || '—'}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStock00013()
  const { positions, sumMinor } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  if (sumMinor !== EXPECTED_BASE_MINOR) {
    throw new Error(`Base ${money(sumMinor)} ≠ expected ${money(EXPECTED_BASE_MINOR)}`)
  }

  console.log(`\n  Order: ${ORDER.name}`)
  console.log(`    00013 ${stock.name} x${QTY} @ ${money(stock.price)} AED (ex-VAT)`)
  console.log(
    `    Base ${money(sumMinor)} + VAT 5% → total ${money(EXPECTED_TOTAL_MINOR)} AED`,
  )
  console.log(`    Avail: ${stock.available}`)
  console.log(`    ${ORDER.paymentNote}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = ORDER.moment
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    description: [
      ORDER.paymentNote,
      ORDER.marker,
      'Hydro Cool Modeling Mask 1kg (00013) x20 @ 300 ex-VAT; VAT 5% on top.',
      'Chain: invoice → shipment.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: HORTMAN_VAT_INCLUDED,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    positions,
  })
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)} AED (VAT on top)`)
  console.log(`     https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  const invoice = await api('POST', '/entity/invoiceout', {
    moment: t1,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: HORTMAN_VAT_INCLUDED,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    customerOrder: href('customerorder', order.id),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  })

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

  if (invoice.sum !== EXPECTED_TOTAL_MINOR) {
    console.warn(
      `  WARN: invoice sum ${money(invoice.sum)} ≠ expected ${money(EXPECTED_TOTAL_MINOR)}`,
    )
  }

  const invPositions = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
  const demandPositions = invPositions.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  const demand = await api('POST', '/entity/demand', {
    moment: t2,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: HORTMAN_VAT_INCLUDED,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', DEMAND_STATE_SHIPPED_ID),
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  console.log('\n  Exporting Legal TAX invoice PDF...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (pdfBuf) {
    const outPath = ordersPdfPath(invoice.name)
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
