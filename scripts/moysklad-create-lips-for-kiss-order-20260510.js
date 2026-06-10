#!/usr/bin/env node

/**
 * Customer order (Заказ покупателя) — Lips for Kiss Clinic
 *
 * List prices from MoySklad stock report (VAT-inclusive, no line discounts).
 *
 * Note: Request said Soothing Repair Post Cream **2g ×10**. Catalog only has **20g** (`00038`)
 * and **100g** (`54465`); this order uses **20g ×10**. Change in MoySklad if samples/2g SKU exists.
 *
 *   node scripts/moysklad-create-lips-for-kiss-order-20260510.js
 *   node scripts/moysklad-create-lips-for-kiss-order-20260510.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

/** Lips for Kiss Clinic (same as 2026-04-30 order) */
const AGENT_ID = '9038b70d-c52f-11f0-0a80-0bc5000a2226'

const ORDER = {
  name: 'GENCardM2605104512',
  moment: '2026-05-10 17:30:00',
  marker: 'Lips for Kiss Clinic sales order 2026-05-10',
}

const SHIPMENT_ADDRESS = {
  country: {
    meta: {
      href: `${API}/entity/country/${COUNTRY_UAE_ID}`,
      type: 'country',
      mediaType: 'application/json',
    },
  },
  city: 'Dubai',
  street: 'DIFC — confirm delivery address with clinic',
}

const LINES = [
  ['00038', 10], // Soothing Repair Post Cream 20g (client text 2g — see header)
  ['54458', 4], // Moisture Replenishing Hyaluron Cream 50g
  ['00041', 5], // Multi Sun Cream SPF40/PA++ 40g
  ['00122', 2], // Multi-Vita Radiance Cream 50g
  ['00021', 2], // Snow O₂ Cleanser 180ml
  ['00022', 2], // Snow Booster Toner 200ml
]

async function api(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(path) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const data = await api('GET', `${path}${sep}limit=${limit}&offset=${offset}`)
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

function money(minor) {
  return (minor / 100).toFixed(2)
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    const id = row.meta?.href?.split('/').pop()?.split('?')[0]
    stock.set(row.code, {
      id,
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateByMarker() {
  const day = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${day} 00:00:00`,
    `moment<=${day} 23:59:59`,
  ].join(';')
  const rows = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = rows.find((r) => (r.description || '').includes(ORDER.marker))
  if (dup) {
    throw new Error(`Duplicate protection: order with same marker exists (${dup.name}, id=${dup.id})`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad customer order — Lips for Kiss Clinic')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  await ensureOrderNameFree()
  await ensureNoDuplicateByMarker()

  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (cp.name !== 'Lips for Kiss Clinic') {
    throw new Error(`Counterparty name mismatch: expected "Lips for Kiss Clinic", got "${cp.name}"`)
  }
  console.log(`  Counterparty: ${cp.name} (${cp.id})`)

  const stock = await fetchStockByCode()
  const positions = []
  let expectedMinor = 0

  for (const [code, qty] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const lineMinor = item.price * qty
    expectedMinor += lineMinor
    positions.push({
      quantity: qty,
      price: item.price,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
    console.log(`  Line: ${item.code} ${item.name} x${qty} @ ${money(item.price)} AED -> ${money(lineMinor)}`)
  }

  console.log(`  Expected sum (list prices): ${money(expectedMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit.')
    return
  }

  const payload = {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [
      ORDER.marker,
      'Post cream: client wrote 2g×10 — posted as Soothing Repair Post Cream 20g (00038)×10 (no 2g SKU in remap map).',
      'Hyaluron cream 50g (54458)×4, Multi Sun SPF40 (00041)×5, Multi-Vita Radiance cream 50g (00122)×2, Snow O2 cleanser 180ml (00021)×2, Snow Booster 200ml (00022)×2.',
    ].join(' '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    state: {
      meta: {
        href: `${API}/entity/customerorder/metadata/states/${STATE_NEW_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
    vatEnabled: true,
    vatIncluded: true,
    rate: {
      currency: href('currency', CURRENCY_ID),
    },
    shipmentAddressFull: SHIPMENT_ADDRESS,
    positions,
  }

  const created = await api('POST', '/entity/customerorder', payload)
  console.log()
  console.log(`  Created order: ${created.name} | sum=${(created.sum / 100).toFixed(2)} AED`)
  console.log(`  ID: ${created.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#customerorder/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
