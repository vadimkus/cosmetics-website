#!/usr/bin/env node

/**
 * Admin Shakirovna Salon — customer order only (clinic prices).
 * No invoice / no shipment. SO proforma PDF → ~/Desktop/orders/
 *
 *   Problem Control Toner 200ml ×1 @ 130
 *   Problem Control Serum 30ml ×1 @ 165
 *   ND Cell Anti-Wrinkle Cream 50ml ×3 @ 185
 *   Intensive Blemish Balm Cream 50g ×4 @ 125
 *   Multi Sun Cream SPF40 ×2 @ 105
 *   Moisture Replenishing Hyaluron Serum 30ml ×1 @ 165
 *   Total: 1,725 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-admin-shakirovna-clinic-so-20260731.js
 *   node --import dotenv/config scripts/moysklad-create-admin-shakirovna-clinic-so-20260731.js --commit
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
const AGENT_ID = '8619c8a7-eb46-11ed-0a80-00cb00846a48' // Admin Shakirovna Salon
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const ORDER_NAME = `GENCardM${uaeShortDate()}SHKA`
const MARKER = `ADMIN-SHAKIROVNA-CLINIC-SO-${uaeToday()}`
const EXPECTED_SUM_MINOR = 172500

/** [code, qty, label] */
const LINES = [
  ['00145', 1, 'Problem Control Toner 200ml'],
  ['00029', 1, 'Problem Control Serum 30ml'],
  ['00044', 3, 'ND Cell Anti-Wrinkle Cream 50ml'],
  ['00040', 4, 'Intensive Blemish Balm Cream 50g'],
  ['00041', 2, 'Multi Sun Cream SPF40/PA++ 40g'],
  ['00195', 1, 'Moisture Replenishing Hyaluron Serum 30ml'],
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate(agentId) {
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
  const out = path.join(ORDERS_DIR, `GENOSYS_Admin_Shakirovna_${orderName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Admin Shakirovna — clinic SO only')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Order: ${ORDER_NAME}`)

  const [agent, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Customer: ${agent.name}`)

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
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | SO only (no invoice/shipment)`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate(agent.id)

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
      street: 'Admin Shakirovna Salon — UAE',
    },
    description: [
      MARKER,
      'Clinic list SO only — no invoice/shipment.',
      'Toner + serum problem control; ND Cell ×3; blemish balm ×4; SPF40 ×2; hyaluron serum ×1.',
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
