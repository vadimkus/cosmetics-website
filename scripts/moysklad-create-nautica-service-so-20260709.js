#!/usr/bin/env node

/**
 * NAUTICA SERVICE SRL (Claudia Cortopassi) — retail SO + proforma PDF → ~/Desktop/orders/
 *
 *   54461 Skin Defender Lip & Eye Makeup Remover 200ml ×3 @ retail 290
 *   00022 Snow Booster Toner 200ml ×3 @ retail 260
 *
 *   node --import dotenv/config scripts/moysklad-create-nautica-service-so-20260709.js
 *   node --import dotenv/config scripts/moysklad-create-nautica-service-so-20260709.js --commit
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
const COUNTRY_ITALY_ID = '40e6f69a-991c-4fbc-8be9-d0d906cad180'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'

const CUSTOMER = {
  name: 'NAUTICA SERVICE SRL',
  contact: 'Claudia Cortopassi',
  email: 'yachtcare@yachtcare.it',
  phone: '+3905841660833',
  fax: '0584-1660834',
  sdi: 'M5UXCR1',
  vat: '01618330466',
  city: 'Viareggio (LU)',
  postalCode: '55049',
  street: 'Via Michele Coppino n.343',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}NAUT`,
  moment: uaeMomentNow(),
  marker: `NAUTICA-SERVICE-SO-${uaeToday()}`,
}

/** [code, qty, retailAed] */
const PRODUCT_LINES = [
  ['54461', 3, 290],
  ['00022', 3, 260],
]

const EXPECTED_SUM_MINOR = 165000 // 870 + 780

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

function countryHref(countryId) {
  return href('country', countryId)
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function shipmentAddress() {
  return {
    country: countryHref(COUNTRY_ITALY_ID),
    city: CUSTOMER.city,
    postalCode: CUSTOMER.postalCode,
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
    })
  }
  return stock
}

async function findExistingCounterparty() {
  for (const q of [CUSTOMER.name, CUSTOMER.email, 'NAUTICA', 'yachtcare']) {
    const data = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=10`)
    const exact = (data?.rows || []).find(
      (r) => r.name === CUSTOMER.name || r.email === CUSTOMER.email
    )
    if (exact) return exact
  }
  return null
}

async function findOrCreateCounterparty() {
  const existing = await findExistingCounterparty()
  const addr = shipmentAddress()
  const legalComment = [
    `Contact: ${CUSTOMER.contact}`,
    `P.IVA ${CUSTOMER.vat}`,
    `Codice SDI ${CUSTOMER.sdi}`,
    `Fax ${CUSTOMER.fax}`,
  ].join(' | ')

  if (existing) {
    console.log(`  Counterparty (existing): ${existing.name} (${existing.id})`)
    if (COMMIT) {
      await api('PUT', `/entity/counterparty/${existing.id}`, {
        meta: existing.meta,
        email: CUSTOMER.email,
        phone: CUSTOMER.phone,
        legalAddressFull: { ...addr, comment: legalComment },
        actualAddressFull: { ...addr, comment: legalComment },
        description: `Yacht care — ${CUSTOMER.contact}. ${CUSTOMER.name}, Viareggio, Italy.`,
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
    companyType: 'legal',
    email: CUSTOMER.email,
    phone: CUSTOMER.phone,
    description: `Yacht care — ${CUSTOMER.contact}. ${CUSTOMER.name}, Viareggio, Italy.`,
    legalAddressFull: { ...addr, comment: legalComment },
    actualAddressFull: { ...addr, comment: legalComment },
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

  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(retailAed * 100)
    sumMinor += priceMinor * qty
    resolved.push({ ...item, qty, retailAed, priceMinor })
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
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
  return path.join(ordersDir, `GENOSYS_Nautica_Service_${safe}.pdf`)
}

async function main() {
  console.log('====================================================================')
  console.log('  NAUTICA SERVICE SRL — retail SO + proforma PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  ${CUSTOMER.name} | ${CUSTOMER.contact}`)
  console.log(`  ${CUSTOMER.street}, ${CUSTOMER.postalCode} ${CUSTOMER.city}, Italy`)
  console.log(`  ${CUSTOMER.email} | ${CUSTOMER.phone}`)

  const agent = await findOrCreateCounterparty()
  await ensureOrderNameFree()
  if (COMMIT && agent.id !== 'DRY-RUN') await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor, resolved } = buildPositions(stock)
  const shipment = shipmentAddress()

  console.log(`\n  Order: ${ORDER.name}`)
  for (const line of resolved) {
    console.log(
      `    ${line.code} ${line.name.slice(0, 55)} x${line.qty} @ ${line.retailAed.toFixed(2)} → ${money(line.priceMinor * line.qty)} AED`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl. (retail)`)

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
      `Contact: ${CUSTOMER.contact} | ${CUSTOMER.name}`,
      '54461 Makeup Remover 200ml x3, 00022 Snow Booster 200ml x3 @ retail.',
      `Ship: ${shipment.street}, ${CUSTOMER.postalCode} ${CUSTOMER.city}, Italy.`,
      `SDI ${CUSTOMER.sdi} | P.IVA ${CUSTOMER.vat}`,
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
