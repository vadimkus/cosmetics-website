#!/usr/bin/env node

/**
 * Shakirovna Ladies Beauty Saloon (Marina) — clinic SO only + proforma PDF.
 * Price list (incl. Hydro Cool Modeling Mask) → 1,912 AED.
 *
 *   54461 Skin Defender Lip & Eye Makeup Remover 200ml ×1 @ 145
 *   00024 Snow O₂ Cleanser 500ml ×1 @ 255
 *   00025 Snow Booster Toner 1000ml ×1 @ 245
 *   00011 EZ CO₂ MASK Professional Box ×1 @ 230
 *   00001 Standard Detachable Roller 0.25mm ×1 @ 115
 *   00018 Power Solution AWS ×10 @ 29 (= Pro Solutions 10 vials @ 290)
 *   00013 Hydro Cool Modeling Mask 1kg ×1 @ 300
 *   00038 Soothing Repair Post Cream 20g ×1 @ 102
 *   00041 Multi Sun Cream SPF40 ×1 @ 105
 *   00040 Intensive Blemish Balm Cream 50g ×1 @ 125
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-clinic-so-1912-20260812.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-clinic-so-1912-20260812.js --commit
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
const AGENT_ID = '93775ae5-d18d-11ea-0a80-02e00008417d' // Shakirovna Ladies Beauty Saloon (Marina)
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const ORDER_NAME = `GENCardM${uaeShortDate()}MAR1912`
const MARKER = `SHAKIROVNA-MARINA-CLINIC-SO-1912-${uaeToday()}`
const EXPECTED_SUM_MINOR = 191200

/** [code, qty, clinicAed, label] */
const LINES = [
  ['54461', 1, 145, 'Skin Defender Lip & Eye Makeup Remover 200ml'],
  ['00024', 1, 255, 'Snow O₂ Cleanser 500ml'],
  ['00025', 1, 245, 'Snow Booster Toner 1000ml'],
  ['00011', 1, 230, 'EZ CO₂ MASK Professional Box'],
  ['00001', 1, 115, 'Standard Detachable Roller 0.25mm'],
  ['00018', 10, 29, 'Power Solution AWS 2ml (Pro Solutions ×10 vials)'],
  ['00013', 1, 300, 'Hydro Cool Modeling Mask 1kg'],
  ['00038', 1, 102, 'Soothing Repair Post Cream 20g'],
  ['00041', 1, 105, 'Multi Sun Cream SPF40 40g'],
  ['00040', 1, 125, 'Intensive Blemish Balm Cream 50g'],
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
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
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
  const out = path.join(ORDERS_DIR, `GENOSYS_Shakirovna_Marina_${orderName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Marina — clinic SO 1,912 AED (incl. Hydro Cool)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Order: ${ORDER_NAME}`)

  const [agent, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Address : ${agent.actualAddress || '(none)'}`)

  const resolved = []
  let sumMinor = 0
  let totalQty = 0
  for (const [code, qty, aed, label] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    const price = aed * 100
    sumMinor += price * qty
    totalQty += qty
    resolved.push({ ...item, qty, price, label })
    console.log(`    ${code} ${label} x${qty} @ ${aed} = ${money(price * qty)}`)
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | SO only`)
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const street =
    agent.actualAddressFull?.street ||
    agent.actualAddressFull?.addInfo ||
    agent.actualAddress ||
    'Marina — Dubai, UAE'

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER_NAME,
    moment: uaeMomentNow(),
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    state: {
      meta: {
        href: `${API}/entity/customerorder/metadata/states/${STATE_NEW_ORDER_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: {
      country: href('country', COUNTRY_UAE_ID),
      city: 'Dubai',
      street,
    },
    description: [
      MARKER,
      'Clinic price-list SO (incl. Hydro Cool Modeling Mask). SO only — no invoice/shipment.',
      'Pro Solutions line = AWS vials ×10 @ 29 (list: AWS/SWS/PCS/HES/CTS/CVS).',
      'Roller = Standard Detachable 0.25mm.',
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
    throw new Error(`Order sum mismatch: ${money(order.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

  const pdfPath = await exportOrderPdf(order.id, order.name)
  console.log(`\n  Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
