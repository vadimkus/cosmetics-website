#!/usr/bin/env node

/**
 * TVC Beauty Salon — new customer + unpaid clinic SO → invoice → shipment.
 *
 *   00013 Hydro Cool Modeling Mask 1kg ×1 @ 300
 *   Delivery Dubai ×1 @ 45, 100% off
 *   Total: 300.00 AED
 *
 *   Bahar 4, The Walk, Jumeirah Beach Residence, Dubai
 *   Phone +971 56 501 0090
 *
 *   node --import dotenv/config scripts/moysklad-create-tvc-beauty-salon-hydrocool-20260821.js
 *   node --import dotenv/config scripts/moysklad-create-tvc-beauty-salon-hydrocool-20260821.js --commit
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
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_DELIVERED_AWAIT_PAY_ID = 'e1a0af19-33c5-11ea-0a80-043f000b2760'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const CUSTOMER = {
  name: 'TVC Beauty Salon',
  phone: '+971 56 501 0090',
  city: 'Dubai',
  street: 'Bahar 4, The Walk, Jumeirah Beach Residence',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}TVC`,
  marker: `TVC-BEAUTY-SALON-HYDROCOOL-${uaeToday()}`,
}

const PRODUCT_LINES = [['00013', 1, 300]]
const DELIVERY_AED = 45
const EXPECTED_SUM_MINOR = 30000

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

function phoneDigits(value) {
  return String(value || '').replace(/\D/g, '')
}

function shipmentAddress() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
    addInfo: '',
  }
}

function customerPayload() {
  return {
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    companyType: 'legal',
    actualAddress: `${CUSTOMER.street}, ${CUSTOMER.city}, UAE`,
    actualAddressFull: shipmentAddress(),
    legalAddressFull: shipmentAddress(),
    description: [
      'Beauty salon, Bahar 4 JBR / The Walk, Dubai.',
      `Phone ${CUSTOMER.phone}.`,
      'Google listing; no trade license or TRN on file.',
    ].join(' '),
  }
}

function isThisTvc(row) {
  const digits = phoneDigits(row.phone)
  const name = (row.name || '').toLowerCase()
  return digits.endsWith('565010090') || name === 'tvc beauty salon' || name.includes('tvc beauty')
}

async function findOrCreateCustomer() {
  for (const q of ['TVC Beauty Salon', 'TVC', '565010090', '0565010090']) {
    const d = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=25`)
    const hit = (d.rows || []).find(isThisTvc)
    if (hit) {
      console.log(`  Customer exists: ${hit.name} (${hit.id})`)
      if (COMMIT) await api('PUT', `/entity/counterparty/${hit.id}`, customerPayload())
      return hit
    }
  }
  if (!COMMIT) {
    console.log(`  DRY RUN: would create ${CUSTOMER.name}`)
    return { id: 'DRY-RUN', name: CUSTOMER.name }
  }
  const created = await api('POST', '/entity/counterparty', customerPayload())
  console.log(`  Created customer: ${created.name} (${created.id})`)
  return created
}

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
  }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`,
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicate(agentId) {
  if (agentId === 'DRY-RUN') return
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

async function buildPositions() {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, clinicAed] of PRODUCT_LINES) {
    const item = await fetchAssortmentByCode(code)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, available ${item.available}`)
    }
    const priceMinor = Math.round(clinicAed * 100)
    sumMinor += priceMinor * qty
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
      _code: code,
      _name: item.name,
      _avail: item.available,
      _aed: clinicAed,
    })
  }
  positions.push({
    quantity: 1,
    price: Math.round(DELIVERY_AED * 100),
    discount: 100,
    assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
    _code: 'DELIV',
    _name: 'Excellent Delivery Dubai',
    _avail: '—',
    _aed: 0,
  })
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
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const out = path.join(ORDERS_DIR, `GENOSYS_TVC_Beauty_Salon_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  TVC Beauty Salon — Hydro Cool 1kg @300 clinic, delivery free')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await findOrCreateCustomer()
  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicate(agent.id)

  const { positions, sumMinor } = await buildPositions()
  const shipment = shipmentAddress()

  console.log(`  Phone: ${CUSTOMER.phone}`)
  console.log(`  Ship: ${CUSTOMER.street}, ${CUSTOMER.city}`)
  console.log(`  Order: ${ORDER.name}`)
  for (const p of positions) {
    console.log(`    ${p._code} ${p._name} x${p.quantity} @ ${p._aed} (avail ${p._avail})`)
  }
  console.log(`  Total: ${money(sumMinor)} AED unpaid`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const cleanPositions = positions.map(({ quantity, price, discount, assortment, vat, vatEnabled }) => ({
    quantity,
    price,
    discount,
    assortment,
    vat,
    vatEnabled,
  }))

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    shared: true,
    description: [
      ORDER.marker,
      '00013 Hydro Cool Modeling Mask 1kg x1 @300 clinic; delivery free. Unpaid.',
      `Ship: ${CUSTOMER.street}, ${CUSTOMER.city}. Phone ${CUSTOMER.phone}.`,
    ].join('\n'),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions: cleanPositions,
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
    shipmentAddressFull: shipment,
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions: cleanPositions,
  })
  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
  if (invoice.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Invoice sum ${money(invoice.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }
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
    shipmentAddressFull: shipment,
    description: `Shipment from invoice ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
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
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)

  await api('PUT', `/entity/customerorder/${order.id}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_DELIVERED_AWAIT_PAY_ID),
  })
  console.log('  Order → Доставлен - Ждем оплату')

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  console.log(`  PDF: ${pdfPath}`)
  console.log(`  Customer: https://online.moysklad.ru/app/#company/edit?id=${agent.id}`)
  console.log(`  Order:    https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
  console.log(`  Invoice:  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)
  console.log(`  Shipment: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
