#!/usr/bin/env node

/**
 * Rizwan Sheikh — retail SO + proforma PDF → ~/Desktop/orders/
 *
 *   00042 EGF Repair Oxymask Cream 50ml ×1 @ retail 290, 100% off
 *   00011 EZ CO₂ MASK Professional Box ×1 @ retail 460
 *   00020 Power Solution SWS 2ml ×10 @ retail 58
 *
 *   node --import dotenv/config scripts/moysklad-create-rizwan-sheikh-so-20260709.js
 *   node --import dotenv/config scripts/moysklad-create-rizwan-sheikh-so-20260709.js --commit
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

const CUSTOMER = {
  name: 'Rizwan Sheikh',
  phone: '+971559119655',
  city: 'Dubai',
  street: 'Al Khail Gate Building 1-25, Flat 204, Al Quoz 2',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}RIZW`,
  moment: uaeMomentNow(),
  marker: `RIZWAN-SHEIKH-SO-${uaeToday()}`,
}

/** [code, qty, retailAed, discountPercent] */
const PRODUCT_LINES = [
  ['00042', 1, 290, 100],
  ['00011', 1, 460, 0],
  ['00020', 10, 58, 0],
]

const EXPECTED_SUM_MINOR = 104000 // 0 + 460 + 580

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
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
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

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function lineNet(priceMinor, qty, discountPct) {
  return Math.round((priceMinor * qty * (100 - discountPct)) / 100)
}

function shipmentAddress() {
  return { country: countryHref(), city: CUSTOMER.city, street: CUSTOMER.street }
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

async function findExistingCounterparty() {
  const byPhone = await api(
    'GET',
    `/entity/counterparty?filter=phone=${encodeURIComponent(CUSTOMER.phone)}&limit=5`
  )
  if (byPhone?.rows?.length) return byPhone.rows[0]

  const byName = await api(
    'GET',
    `/entity/counterparty?filter=name=${encodeURIComponent(CUSTOMER.name)}&limit=5`
  )
  return (byName?.rows || []).find((r) => r.name === CUSTOMER.name) || null
}

async function findOrCreateCounterparty() {
  const existing = await findExistingCounterparty()
  const addr = shipmentAddress()

  if (existing) {
    console.log(`  Counterparty (existing): ${existing.name} (${existing.id})`)
    if (COMMIT) {
      await api('PUT', `/entity/counterparty/${existing.id}`, {
        meta: existing.meta,
        phone: CUSTOMER.phone,
        actualAddressFull: addr,
        legalAddressFull: addr,
      })
    }
    return existing
  }

  if (!COMMIT) {
    console.log(`  DRY RUN: would create counterparty "${CUSTOMER.name}"`)
    return { id: 'DRY-RUN', name: CUSTOMER.name }
  }

  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    companyType: 'individual',
    description: `Retail customer — created with order ${ORDER.name}`,
    actualAddressFull: addr,
    legalAddressFull: addr,
  })
  console.log(`  Counterparty (created): ${created.name} (${created.id})`)
  return created
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

  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(retailAed * 100)
    sumMinor += lineNet(priceMinor, qty, discountPct)
    resolved.push({ ...item, qty, retailAed, discountPct, priceMinor })
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: discountPct,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }

  if (Math.abs(sumMinor - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Total mismatch: got ${money(sumMinor)}, expected ${money(EXPECTED_SUM_MINOR)}`)
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
  return path.join(ordersDir, `GENOSYS_Rizwan_Sheikh_${safe}.pdf`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Rizwan Sheikh — retail SO + proforma PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  ${CUSTOMER.name} | ${CUSTOMER.phone}`)
  console.log(`  ${CUSTOMER.street}, ${CUSTOMER.city}`)

  const agent = await findOrCreateCounterparty()
  await ensureOrderNameFree()
  if (COMMIT && agent.id !== 'DRY-RUN') await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor, resolved } = buildPositions(stock)
  const shipment = shipmentAddress()

  console.log(`\n  Order: ${ORDER.name}`)
  for (const line of resolved) {
    const net = lineNet(line.priceMinor, line.qty, line.discountPct) / 100
    console.log(
      `    ${line.code} ${line.name.slice(0, 50)} x${line.qty} @ ${line.retailAed.toFixed(2)} −${line.discountPct}% → ${net.toFixed(2)} AED`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

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
      '00042 EGF Oxymask x1 @ retail 100% off; 00011 EZ CO2 mask x1; 00020 SWS x10 ampules @ retail.',
      `Ship: ${shipment.street}, ${shipment.city}.`,
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions,
  })

  console.log(`\n  ✓ Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`    https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  const pdfBuf = await exportOrderPdf(order.id)
  const outPath = ordersPdfPath(order.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    PDF: ${outPath} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
