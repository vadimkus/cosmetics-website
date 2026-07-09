#!/usr/bin/env node

/**
 * Abeer Mekki — SO + invoice + shipment (professional / clinic, NOT consignment).
 *
 * Paid @ clinic salePrice (vials):
 *   PCS, SWS, HES, CVS, CTS, AWS — 10 vials each
 *
 * Free (100% discount):
 *   SRS 1 Vial (00015) x10
 *   Peptide Gel Mask (00012) x5
 *   Hydro Cool Modeling Mask 1kg (00013) x1
 *   EZ CO₂ MASK Professional Box (00011) x1
 *
 *   node --import dotenv/config scripts/moysklad-create-abeer-mekki-power-solution-order-invoice-demand-20260628.js
 *   node --import dotenv/config scripts/moysklad-create-abeer-mekki-power-solution-order-invoice-demand-20260628.js --commit
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
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const AGENT_ID = '39a7af2b-f5d0-11f0-0a80-108500063cb5' // ABEER MEKKI BEAUTY LADIES CENTER

const ORDER = {
  name: `GENCardM${uaeShortDate()}7564`,
  marker: `ABEER-MEKKI-POWER-SOLUTION-VIALS-${uaeToday()}`,
}

/** [code, qty, discountPct, label] */
const LINES = [
  ['00065', 10, 0, 'Power Solution PCS 1 Vial 2ml'],
  ['00020', 10, 0, 'Power Solution SWS 1 Vial 2ml'],
  ['00071', 10, 0, 'Power Solution HES 1 Vial 2ml'],
  ['00067', 10, 0, 'Power Solution CVS 1 Vial 2ml'],
  ['00069', 10, 0, 'Power Solution CTS 1 Vial 2ml'],
  ['00018', 10, 0, 'Power Solution AWS 1 Vial 2ml'],
  ['00015', 10, 100, 'Skin Renewal Peeling System (SRS) 1 Vial 2ml — FREE'],
  ['00012', 5, 100, 'Peptide Gel Mask 39g — FREE'],
  ['00013', 1, 100, 'Hydro Cool Modeling Mask 1kg — FREE'],
  ['00011', 1, 100, 'EZ CO₂ MASK Professional Box — FREE'],
]

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

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

const lineNet = (priceMinor, qty, discountPct) =>
  Math.round((priceMinor * qty * (100 - discountPct)) / 100)

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
  const street = agent.actualAddress || agent.actualAddressFull?.addInfo || 'Al Ain'
  return {
    country: countryHref(),
    city: 'Al Ain',
    street,
  }
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  const needByCode = new Map()

  for (const [code, qty, discountPct] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    needByCode.set(code, (needByCode.get(code) || 0) + qty)
    sumMinor += lineNet(item.price, qty, discountPct)
    positions.push({
      quantity: qty,
      price: item.price,
      discount: discountPct,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }

  for (const [code, need] of needByCode) {
    const item = stock.get(code)
    if (item.available < need) {
      throw new Error(`Insufficient stock ${code}: need ${need}, have ${item.available}`)
    }
  }

  return { positions, sumMinor }
}

async function ensureOrderNameFree() {
  const existing = await api('GET', `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`)
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday(agentId) {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate protection: order ${dup.name} (${dup.id})`)
}

async function exportPdf(entityType, entityId, templateId, outPath) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/${entityType}/metadata/customtemplate/${templateId}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/${entityType}/${entityId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`${entityType} export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
  return buf.length
}

async function main() {
  console.log('====================================================================')
  console.log('  Abeer Mekki — Power Solution vials SO + invoice + shipment')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty, discountPct, label] of LINES) {
    const item = stock.get(code)
    const disc = discountPct ? ` (−${discountPct}%)` : ''
    console.log(
      `    ${code} ${label.padEnd(52)} x${String(qty).padStart(2)} @ ${money(item.price)}${disc}`
    )
  }
  console.log(`  Paid total: ${money(sumMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)

  const desc = [
    ORDER.marker,
    'Professional clinic order — Power Solution vials x10 each (PCS/SWS/HES/CVS/CTS/AWS).',
    'Free: SRS x10, Peptide mask x5, Hydro Cool x1, EZ CO₂ box x1.',
    'Chain: order → invoice → shipment. Clinic salePrice; free lines 100% off. No consignment.',
    'Buyer: ABEER MEKKI BEAUTY LADIES CENTER | +971556717564 | Al Ain.',
  ].join(' | ')

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    description: desc,
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
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', {
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
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
      positions,
    })
  } catch (e) {
    console.warn('  Invoice with positions failed, retrying link-only:', e.message.slice(0, 180))
    invoice = await api('POST', '/entity/invoiceout', {
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
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    })
  }
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
    state: stateHref('demand', DEMAND_STATE_SHIPPED_ID),
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  try {
    const invPdf = path.join(ORDERS_DIR, `GENOSYS_ABEER_MEKKI_${invoice.name}.pdf`)
    const invBytes = await exportPdf('invoiceout', invoice.id, INVOICE_RETAIL_PRINT_TEMPLATE_ID, invPdf)
    if (invBytes) console.log(`  Invoice PDF: ${invPdf} (${invBytes} bytes)`)
  } catch (e) {
    console.log(`  Invoice PDF skipped: ${e.message}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
