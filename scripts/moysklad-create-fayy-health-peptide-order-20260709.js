#!/usr/bin/env node

/**
 * Fayy Health FZCO — sales order + proforma PDF → ~/Desktop/orders/
 *
 *   00012  Genosys Peptide Gel Mask 39g ×50 @ clinic salePrice (38 AED)
 *
 *   Reorder vs invoice 04232 (100 pcs). SO only — invoice/shipment pending.
 *
 *   node --import dotenv/config scripts/moysklad-create-fayy-health-peptide-order-20260709.js
 *   node --import dotenv/config scripts/moysklad-create-fayy-health-peptide-order-20260709.js --commit
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
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'

const AGENT_ID = 'ee20d7e3-d46d-11ed-0a80-0df400228557' // Fayy Health FZCO

const ORDER = {
  name: `GENCardM${uaeShortDate()}FAYY50`,
  moment: uaeMomentNow(),
  marker: `FAYY-HEALTH-PEPTIDE-P50-${uaeToday()}`,
}

const PRODUCT_LINES = [['00012', 50]]
const EXPECTED_SUM_MINOR = 190000 // 50 × 38 AED

async function api(method, pathStr, body) {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
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

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && full.street) {
    return { country: { meta: full.country.meta }, city: full.city, street: full.street }
  }
  const addInfo =
    full?.addInfo ||
    agent.actualAddress ||
    'One Central, The Offices 2, 6th Floor, Unit 6.02, Dubai, UAE'
  return { country: countryHref(), city: 'Dubai', street: addInfo }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
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
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  const resolved = []

  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    sumMinor += item.price * qty
    resolved.push({ ...item, qty })
    positions.push({
      quantity: qty,
      price: item.price,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Total mismatch: got ${sumMinor}, expected ${EXPECTED_SUM_MINOR}`)
  }

  return { positions, sumMinor, resolved }
}

async function exportOrderPdf(orderId) {
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
  if (res.status === 412) {
    const t = await res.text()
    if (/33003|шаблон/i.test(t)) return null
    throw new Error(`Order export 412: ${t.slice(0, 600)}`)
  }
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Order export HTTP ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function ordersPdfPath(orderName) {
  const safe = String(orderName || 'order').replace(/[^\w.-]+/g, '_')
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  return path.join(ordersDir, `GENOSYS_Fayy_Health_${safe}.pdf`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Fayy Health FZCO — peptide mask sales order + proforma PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name} | ${agent.phone}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor, resolved } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  for (const line of resolved) {
    console.log(
      `    ${line.code} ${line.name.slice(0, 55)} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)} AED`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl. (clinic salePrice)`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: ORDER.moment,
    shared: true,
    description: [
      ORDER.marker,
      'Peptide Gel Mask 39g (00012) ×50 @ clinic price — reorder after invoice 04232.',
      'SO only — invoice/shipment/payment pending.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    positions,
  })

  console.log(`\n  ✓ Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`    https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  console.log('\n  Exporting order PDF (Genosys_Invoice_PROFORMA)...')
  const pdfBuf = await exportOrderPdf(order.id)
  const outPath = ordersPdfPath(order.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
