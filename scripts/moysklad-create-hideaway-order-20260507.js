#!/usr/bin/env node

/**
 * Customer order (Заказ покупателя) — The Hideaway For Women Salon
 *
 * Pricing: MoySklad list (sale) prices from stock report, VAT-inclusive, no discounts.
 *
 * Note: Customer asked Snow Booster Toner 500ml — catalog only has 200ml (00022) and
 * 1000ml (00025). This order uses 1000ml x1; change in MoySklad if they meant 200ml x2–3.
 *
 * Multi Sun SPF 50+ PA++++ -> Ultra Shield Sun Cream SPF50/PA++++ (54457).
 *
 * Dry-run:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-create-hideaway-order-20260507.js
 *
 * Commit:
 *   node scripts/moysklad-create-hideaway-order-20260507.js --commit
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

const AGENT_ID = 'a0b08c72-ad6a-11ef-0a80-0d890079985b' // The Hideaway For Women Salon

const ORDER = {
  name: 'GENCardM2605071059',
  moment: '2026-05-07 16:00:00',
  marker: 'The Hideaway For Women Salon sales order 2026-05-07',
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
  street: 'Shop 6, La Plage, Beach Road, Jumeirah',
}

/** [code, qty] — Booster line is 1000ml (see file header). */
const LINES = [
  ['00195', 1], // Moisture Replenishing Hyaluron Serum 30ml
  ['00021', 2], // Snow O₂ Cleanser 180ml
  ['00025', 1], // Snow Booster Toner 1000ml (no 500ml SKU)
  ['54457', 1], // Ultra Shield SPF50/PA++++ (user: Multi Sun SPF 50+)
  ['00069', 10], // Power Solution CTS 1 Vial 2ml
  ['00067', 10], // Power Solution CVS 1 Vial 2ml
  ['54467', 2], // Skin Reboot PDRN mask Pack
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

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad customer order — The Hideaway For Women Salon')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  await ensureOrderNameFree()

  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
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
      'B2B salon order — list prices.',
      'Customer requested Snow Booster 500ml: posted Snow Booster Toner 1000ml (00025) x1 — no 500ml SKU in MoySklad (alternatives: 200ml 00022).',
      'Multi Sun SPF 50+ PA++++ mapped to Ultra Shield SPF50/PA++++ (54457).',
    ].join(' | '),
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
