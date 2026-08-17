#!/usr/bin/env node

/**
 * IJ Medical Center (Attractive Smile) · Sharjah · Miss Amal
 * Clinic SO only — glow + calm facial line quote (incl. optional). Demo before order.
 * No invoice / shipment. Proforma PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-ij-medical-attractive-smile-clinic-so-20260803.js
 *   node --import dotenv/config scripts/moysklad-create-ij-medical-attractive-smile-clinic-so-20260803.js --commit
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
  name: 'IJ Medical Center (Attractive Smile)',
  contact: 'Miss Amal',
  city: 'Sharjah',
  street: 'IJ Medical Center (Attractive Smile) — Sharjah',
}

const ORDER_NAME = `GENCardM${uaeShortDate()}IJMC`
const MARKER = `IJ-MEDICAL-ATTRACTIVE-SMILE-CLINIC-SO-${uaeToday()}`
const EXPECTED_SUM_MINOR = 184000 // 1,840 AED

/** [code, qty, label] — clinic salePrice from MoySklad */
const LINES = [
  ['00021', 1, 'Snow O₂ Cleanser 180ml'],
  ['00024', 1, 'Snow O₂ Cleanser 500ml'],
  ['00129', 1, 'EPI Turnover Boosting Peeling Gel 100g'],
  ['00015', 10, 'Skin Renewal Peeling System (SRS) 2ml vial'],
  ['00140', 1, 'Soothing Bomb Sea Algae Mask'],
  ['00194', 1, 'Multi Vita Radiance Serum 30ml'],
  ['00031', 1, 'Intensive Hydro Soothing Cream 50g'],
  ['00032', 1, 'Intensive Hydro Soothing Cream 250g'],
  ['00122', 1, 'Multi-Vita Radiance Cream 50g'],
  ['00038', 1, 'Soothing Repair Post Cream 20g'],
  ['00041', 1, 'Multi Sun Cream SPF40/PA++ 40g'],
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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function shipmentAddress() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function findOrCreateCustomer() {
  for (const q of [CUSTOMER.name, 'Attractive Smile', 'IJ Medical', 'LJ Medical']) {
    const d = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=15`)
    const hit = (d.rows || []).find(
      (r) =>
        r.name === CUSTOMER.name ||
        /attractive\s*smile/i.test(r.name || '') ||
        /ij\s*medical/i.test(r.name || '') ||
        /lj\s*medical/i.test(r.name || ''),
    )
    if (hit) {
      console.log(`  Customer exists: ${hit.name} (${hit.id})`)
      return hit
    }
  }
  if (!COMMIT) {
    console.log(`  DRY RUN: would create ${CUSTOMER.name}`)
    return { id: 'DRY-RUN', name: CUSTOMER.name }
  }
  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    companyType: 'legal',
    actualAddress: `${CUSTOMER.street}, ${CUSTOMER.city}`,
    legalAddress: `${CUSTOMER.street}, ${CUSTOMER.city}`,
    actualAddressFull: shipmentAddress(),
    legalAddressFull: shipmentAddress(),
    description: [
      `Clinic — ${CUSTOMER.city}. Contact: ${CUSTOMER.contact}.`,
      'Also known as LJ Medical Centre / Attractive Smile (Sharjah).',
    ].join(' '),
  })
  console.log(`  Created customer: ${created.name} (${created.id})`)
  return created
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER_NAME)}&limit=1`,
  )
  if (existing?.rows?.length) throw new Error(`Order name taken: ${ORDER_NAME}`)
}

async function ensureNoDuplicate(agentId) {
  if (agentId === 'DRY-RUN') return
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER) || d.name === ORDER_NAME)
  if (dup) throw new Error(`Duplicate order: ${dup.name} (${dup.id})`)
}

async function exportOrderPdf(orderId, orderName) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
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
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const out = path.join(ORDERS_DIR, `GENOSYS_IJ_Medical_Attractive_Smile_${orderName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  IJ Medical / Attractive Smile — clinic SO only (Miss Amal)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Order: ${ORDER_NAME}`)

  const agent = await findOrCreateCustomer()
  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicate(agent.id)

  const stock = await fetchStockByCode()
  const resolved = []
  let sumMinor = 0
  let totalQty = 0
  for (const [code, qty, label] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    }
    sumMinor += item.price * qty
    totalQty += qty
    resolved.push({ ...item, qty, label })
    console.log(
      `    ${code} ${label} x${qty} @ ${money(item.price)} = ${money(item.price * qty)} (avail ${item.available})`,
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | SO only`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER_NAME,
    moment: uaeMomentNow(),
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: {
      meta: {
        href: `${API}/entity/customerorder/metadata/states/${STATE_NEW_ORDER_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipmentAddress(),
    description: [
      MARKER,
      `Contact: ${CUSTOMER.contact} · Sharjah.`,
      'Clinic quote SO — opening glow + calm facial line (incl. optional). Demo before order.',
      'No invoice/shipment yet.',
      `Starter kit note (personal, no SRS): 00021+00129+00140×10+00194+00031 = 780 AED.`,
      `${resolved.length} lines / ${totalQty} pcs / ${money(sumMinor)} AED.`,
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      discount: 0,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  if ((order.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Order sum ${money(order.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
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
