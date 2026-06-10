#!/usr/bin/env node

/**
 * Miss Ahlam — new customer + sales order + proforma PDF → ~/Desktop/orders/
 *
 * Phone: +971565565504
 * Lines @ genosys.ae retail (VAT incl.), qty 1 each:
 *   BIO-MESO PDRN Expert Ampoule 60000 (54470) @ 600
 *   Snow O₂ Cleanser 180ml (00021) @ 330
 *   Snow Booster 200ml (00022) @ 260
 *   Skin Reboot PDRN mask Pack (54467) @ 400
 *   Soothing Repair Post Cream 20g (00038) @ 204
 *   Ultra Shield SPF50 (54457) @ 250
 *   Skin Rescue Overnight Cream Mask (00189) @ 340
 *
 * PDF: Genosys_Invoice_PROFORMA (customerorder export) → orders folder
 *
 *   node --import dotenv/config scripts/moysklad-create-miss-ahlam-retail-order-20260610.js
 *   node --import dotenv/config scripts/moysklad-create-miss-ahlam-retail-order-20260610.js --commit
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
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f' // Genosys_Invoice_PROFORMA

const CUSTOMER = {
  name: 'Miss Ahlam',
  phone: '+971565565504',
  city: 'Dubai',
  street: 'UAE',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}5504`,
  moment: uaeMomentNow(),
  marker: `Miss Ahlam retail order PDRN cleanser booster postcream SPF overnight ${uaeToday()}`,
}

/** [code, qty, retailAed] — genosys.ae / user quote, VAT incl. */
const PRODUCT_LINES = [
  ['54470', 1, 600], // BIO-MESO PDRN Expert Ampoule 60000
  ['00021', 1, 330], // Snow O₂ Cleanser 180ml
  ['00022', 1, 260], // Snow Booster 200ml
  ['54467', 1, 400], // Skin Reboot PDRN mask Pack
  ['00038', 1, 204], // Soothing Repair Post Cream 20g
  ['54457', 1, 250], // Ultra Shield Sun Cream SPF50/PA++++ 50g
  ['00189', 1, 340], // Skin Rescue Overnight Cream Mask 100g
]

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

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
}

function stateHref(entityType, id) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${id}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
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

async function resolveProduct(code, stock) {
  const hit = stock.get(code)
  if (hit?.id) return hit
  const data = await api('GET', `/entity/product?filter=code=${encodeURIComponent(code)}&limit=1`)
  const row = data?.rows?.[0]
  if (!row) throw new Error(`Unknown product code: ${code}`)
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    available: 0,
  }
}

async function findExistingCounterparty() {
  const byName = await api(
    'GET',
    `/entity/counterparty?filter=name=${encodeURIComponent(CUSTOMER.name)}&limit=10`
  )
  const exact = (byName?.rows || []).find((r) => r.name === CUSTOMER.name)
  if (exact) return exact

  const bySearch = await api(
    'GET',
    `/entity/counterparty?search=${encodeURIComponent(CUSTOMER.phone)}&limit=10`
  )
  return (bySearch?.rows || []).find((r) => r.phone === CUSTOMER.phone) || null
}

async function findOrCreateCounterparty() {
  const existing = await findExistingCounterparty()
  if (existing) {
    console.log(`  Counterparty (existing): ${existing.name} (${existing.id})`)
    return existing
  }

  if (!COMMIT) {
    console.log(`  DRY RUN: would create counterparty "${CUSTOMER.name}" (${CUSTOMER.phone})`)
    return { id: 'DRY-RUN', name: CUSTOMER.name }
  }

  const addr = { country: countryHref(), city: CUSTOMER.city, street: CUSTOMER.street }
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

async function buildPositionsAsync(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = await resolveProduct(code, stock)
    if (item.available < qty) {
      console.warn(`  WARN: ${code} low/zero stock — need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(retailAed * 100)
    sumMinor += priceMinor * qty
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  return { positions, sumMinor }
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
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })

  if (res.status === 412) {
    const t = await res.text()
    if (/33003|шаблон/i.test(t)) return null
    throw new Error(`Order export 412: ${t.slice(0, 600)}`)
  }
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Order export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function ordersPdfPath(orderName) {
  const safe = String(orderName || 'order').replace(/[^\w.-]+/g, '_')
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  return path.join(ordersDir, `GENOSYS_Miss_Ahlam_${safe}.pdf`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Ahlam — customer order + proforma PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await findOrCreateCounterparty()
  if (COMMIT) {
    await ensureNoDuplicateToday(agent.id)
    await ensureOrderNameFree()
  }

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = await buildPositionsAsync(stock)
  const shipment = { country: countryHref(), city: CUSTOMER.city, street: CUSTOMER.street }

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = await resolveProduct(code, stock)
    console.log(
      `    ${code} ${item.name.slice(0, 52)} x${qty} @ ${retailAed.toFixed(2)} → ${(retailAed * qty).toFixed(2)} AED`
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
      `Phone ${CUSTOMER.phone}. Retail: PDRN ampoule, cleanser, booster, PDRN pack, postcream, SPF50, overnight mask.`,
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

  console.log(`\n  Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  console.log('\n  Exporting order PDF (Genosys_Invoice_PROFORMA)...')
  const pdfBuf = await exportOrderPdf(order.id)
  if (!pdfBuf) {
    console.warn('  MoySklad returned no PDF — open order in UI to export.')
    return
  }
  const outPath = ordersPdfPath(order.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
