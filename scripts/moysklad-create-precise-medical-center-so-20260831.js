#!/usr/bin/env node

/**
 * PRECISE MEDICAL CENTER L.L.C — new clinic customer + SO only.
 * Proforma PDF → ~/Desktop/orders/. No invoice / shipment / payment.
 *
 *   License 922438 · Reg 917026 · issued 18-08-2025 · expiry 18-08-2026
 *
 *   node --import dotenv/config scripts/moysklad-create-precise-medical-center-so-20260831.js
 *   node --import dotenv/config scripts/moysklad-create-precise-medical-center-so-20260831.js --commit
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

const { uaeToday, uaeMomentNow, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const CUSTOMER = {
  name: 'PRECISE MEDICAL CENTER L.L.C',
  email: '922438',
  licenseNo: '922438',
  registrationNo: '917026',
  phone: '+971506684025',
  city: 'Sharjah',
  street: '8F35+Q32 - Muwaileh Commercial - Industrial Area',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}PMC`,
  marker: `PRECISE-MEDICAL-CENTER-CLINIC-SO-${uaeToday()}`,
}

/** [code, qty, clinicAed] */
const PRODUCT_LINES = [
  ['00024', 1, 255],
  ['00022', 1, 130],
  ['00145', 1, 130],
  ['00129', 2, 125],
  ['00015', 10, 40.5],
  ['00020', 10, 29],
  ['00011', 2, 230],
  ['00013', 1, 300],
  ['54467', 1, 200],
  ['54460', 1, 210],
  ['00038', 1, 102],
  ['54473', 1, 125],
]
const EXPECTED_SUM_MINOR = 285700

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

function shipmentAddress() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: CUSTOMER.city,
    street: CUSTOMER.street || 'Address TBC',
    addInfo: '',
  }
}

function customerPayload() {
  return {
    name: CUSTOMER.name,
    legalTitle: CUSTOMER.name,
    email: CUSTOMER.email,
    phone: CUSTOMER.phone,
    companyType: 'legal',
    actualAddressFull: shipmentAddress(),
    legalAddressFull: shipmentAddress(),
    description: [
      'Clinic. DET trade license 922438. Registration 917026.',
      'Arabic: مركز المتقن الطبي ذ.م.م. Issued 18-08-2025. Expiry on license 18-08-2026.',
      `Phone ${CUSTOMER.phone}. Sharjah: ${CUSTOMER.street}.`,
      'Face Room pattern: license in email field. No street in addInfo. TRN TBC.',
    ].join(' '),
  }
}

async function findOrCreateCustomer() {
  const search = await api(
    'GET',
    `/entity/counterparty?search=${encodeURIComponent('PRECISE MEDICAL CENTER')}&limit=15`,
  )
  const hit = (search.rows || []).find((r) => (r.name || '').toUpperCase().includes('PRECISE MEDICAL'))
  if (hit) {
    console.log(`  Customer exists: ${hit.name} (${hit.id})`)
    if (COMMIT) await api('PUT', `/entity/counterparty/${hit.id}`, { ...customerPayload(), meta: hit.meta })
    return hit
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

async function exportOrderPdf(orderId, orderName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/customerorder/metadata/customtemplate/${ORDER_PROFORMA_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/customerorder/${orderId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`SO export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(orderName || 'SO').replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Precise_Medical_Center_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Precise Medical Center — new clinic customer + SO only')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await findOrCreateCustomer()
  console.log(`  Customer: ${agent.name}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicate(agent.id)

  const positions = []
  let sumMinor = 0
  for (const [code, qty, clinicAed] of PRODUCT_LINES) {
    const item = await fetchAssortmentByCode(code)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, available ${item.available}`)
    }
    const priceMinor = Math.round(clinicAed * 100)
    const lineMinor = priceMinor * qty
    sumMinor += lineMinor
    console.log(`    ${code} ${item.name} x${qty} @ ${clinicAed} = ${money(lineMinor)} (avail ${item.available})`)
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  console.log(`  Order: ${ORDER.name}`)
  console.log(`  Total: ${money(sumMinor)} AED unpaid | SO only (New)`)
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: uaeMomentNow(),
    applicable: true,
    shared: true,
    description: [
      ORDER.marker,
      'Clinic list. SO only — no invoice / shipment / payment.',
      'Snow O2 500, Booster 200, PC toner 200, EPI x2, SRS x10, SWS x10, EZ x2, Hydro Cool, PDRN pack, hyaluron 250g, post 20g, Revita Natural.',
      'License 922438. Address / phone / TRN TBC.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipmentAddress(),
    positions,
  })
  if (order.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Posted sum ${money(order.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  const pdfPath = await exportOrderPdf(order.id, order.name)
  console.log(`\n  Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  Customer: https://online.moysklad.ru/app/#company/edit?id=${agent.id}`)
  console.log(`  Order:    https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
