#!/usr/bin/env node

/**
 * Brau Ladies Salon LLC — 2 separate SO + invoice + shipment:
 *   1) Hydro Cool Modeling Mask 1kg (00013) ×1 — Brau office: Abu Dhabi
 *   2) Peptide Gel Mask 39g (00012) ×20 — Brau Jumeirah branch
 *
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-split-orders-20260703.js
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-split-orders-20260703.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71' // Genosys_Invoice_Legal_TAX

const AGENT_ID = 'ce7c406d-dadf-11ee-0a80-130f00597aa2' // Brau Ladies Salon LLC
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const ORDERS = [
  {
    label: 'ADU',
    location: 'Brau office: Abu Dhabi',
    nameSuffix: 'BRAUADU',
    marker: `BRAU-HYDROCOOL-ADU-${uaeToday()}`,
    lines: [['00013', 1]],
    expectedSumMinor: 30000,
  },
  {
    label: 'JBR',
    location: 'Brau Jumeirah branch',
    nameSuffix: 'BRAUJBR',
    marker: `BRAU-PEPTIDE-JBR-${uaeToday()}`,
    lines: [['00012', 20]],
    expectedSumMinor: 76000,
  },
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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
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
  const street = full?.addInfo || agent.actualAddress || `${agent.name} — UAE`
  return { country: countryHref(), city: 'Dubai', street }
}

function buildPositions(orderDef, stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty] of orderDef.lines) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    sumMinor += item.price * qty
    positions.push({
      quantity: qty,
      price: item.price,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  return { positions, sumMinor }
}

async function ensureOrderNameFree(name) {
  const existing = await api('GET', `/entity/customerorder?filter=name=${encodeURIComponent(name)}&limit=1`)
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${name}`)
}

async function ensureNoDuplicate(marker, agentId) {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

async function exportInvoicePdf(invoiceId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_LEGAL_TAX_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function runCycle(orderDef, idx, stock, agent) {
  const name = `GENCardM${uaeShortDate()}${orderDef.nameSuffix}`
  const { positions, sumMinor } = buildPositions(orderDef, stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n────────────────────────────────────────────────────────────`)
  console.log(`  ${orderDef.location}`)
  console.log(`  Order: ${name}`)
  for (const [code, qty] of orderDef.lines) {
    const item = stock.get(code)
    console.log(`    ${code} ${String(item.name).slice(0, 48).padEnd(48)} x${qty} @ ${money(item.price)}`)
  }
  console.log(`  Total: ${money(sumMinor)} AED (expected ${money(orderDef.expectedSumMinor)})`)

  if (Math.abs(sumMinor - orderDef.expectedSumMinor) > 1) {
    throw new Error(`Sum mismatch for ${orderDef.label}: ${money(sumMinor)}`)
  }

  await ensureOrderNameFree(name)
  if (!COMMIT) return { name, sumMinor, label: orderDef.label, location: orderDef.location }

  await ensureNoDuplicate(orderDef.marker, agent.id)

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(idx * 10 + 1)
  const t2 = uaeMomentAddMinutes(idx * 10 + 3)

  const lineDesc = orderDef.lines
    .map(([code, qty]) => `${stock.get(code).name} ${code} x${qty}`)
    .join('; ')

  const order = await api('POST', '/entity/customerorder', {
    name,
    moment: t0,
    description: [orderDef.marker, orderDef.location, lineDesc, 'Chain: invoice → shipment.'].join(' | '),
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
  console.log(`  1) Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  const invoice = await api('POST', '/entity/invoiceout', {
    moment: t1,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    customerOrder: href('customerorder', order.id),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    description: `Invoice for ${name} | ${orderDef.location} | ${orderDef.marker}`,
    positions,
  })
  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

  const invPositions = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
  const demandPositions = invPositions.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  const demand = await api('POST', '/entity/demand', {
    moment: t2,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} / ${name} | ${orderDef.location} | ${orderDef.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (pdfBuf) {
    fs.mkdirSync(ORDERS_DIR, { recursive: true })
    const safeInv = String(invoice.name).replace(/[^\w.-]+/g, '_')
    const outPath = path.join(ORDERS_DIR, `GENOSYS_Brau_Ladies_${orderDef.label}_${safeInv}.pdf`)
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`  PDF: ${outPath} (${pdfBuf.length} bytes)`)
  }

  return {
    label: orderDef.label,
    location: orderDef.location,
    order: order.name,
    invoice: invoice.name,
    demand: demand.name,
    sum: money(order.sum),
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Brau Ladies — 2 separate orders (Abu Dhabi + Jumeirah)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name} (${agent.id})`)

  const stock = await fetchStockByCode()
  const totalNeed = new Map()
  for (const o of ORDERS) {
    for (const [code, qty] of o.lines) {
      totalNeed.set(code, (totalNeed.get(code) || 0) + qty)
    }
  }
  for (const [code, need] of totalNeed) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < need) {
      throw new Error(`Insufficient stock ${code}: need ${need}, have ${item.available}`)
    }
  }

  const results = []
  for (let i = 0; i < ORDERS.length; i++) {
    results.push(await runCycle(ORDERS[i], i, stock, agent))
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }
  console.log('\n  ✓ Both orders posted.')
  for (const r of results) {
    console.log(`    ${r.location}: SO ${r.order} | inv ${r.invoice} | ship ${r.demand} | ${r.sum} AED`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
