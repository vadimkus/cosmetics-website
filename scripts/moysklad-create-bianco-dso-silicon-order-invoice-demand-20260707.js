#!/usr/bin/env node

/**
 * Bianco Spa FZCO (Cedre Center / DSO Silicon) — SO → invoice → shipment + print.
 *
 *   00011 EZ CO₂ MASK Professional Box x2
 *   00069 Power Solution CTS x10 vials
 *   00018 Power Solution AWS x10 vials
 *
 *   node --import dotenv/config scripts/moysklad-create-bianco-dso-silicon-order-invoice-demand-20260707.js
 *   node --import dotenv/config scripts/moysklad-create-bianco-dso-silicon-order-invoice-demand-20260707.js --commit
 *   node --import dotenv/config scripts/moysklad-create-bianco-dso-silicon-order-invoice-demand-20260707.js --commit --print
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { printPdfLandscape } = require('./lib/moysklad-print-pdf')

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
const PRINT = process.argv.includes('--print')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const AGENT_ID = '4c134860-9a4e-11ee-0a80-09ea0005ef84' // Bianco Spa FZCO (Cedre Center)
const CONTRACT_ID = '34d5fa5e-9ce3-11ee-0a80-10c7001247d8' // 00073

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'

const ORDER = {
  name: `GENCardM${uaeShortDate()}7373`,
  moment: uaeMomentNow(),
  marker: `BIANCO-DSO-SILICON-PRO-ORDER-${uaeToday()}`,
}

/** [code, qty] — clinic salePrice from MoySklad */
const LINES = [
  ['00011', 2],
  ['00069', 10],
  ['00018', 10],
]

const EXPECTED_SUM_MINOR = 104000 // 230*2 + 29*10 + 29*10

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

function buildShipmentAddress(agent) {
  const addInfo = agent.actualAddressFull?.addInfo || agent.actualAddress?.addInfo || ''
  const street = addInfo || 'Cedre Village, Dubai Silicon Oasis, Dubai'
  return { country: countryHref(), city: 'Dubai', street }
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

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday() {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
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
  console.log('\n  Lines:')
  for (const [code, qty] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const lineMinor = item.price * qty
    sumMinor += lineMinor
    positions.push({
      quantity: qty,
      price: item.price,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
    console.log(
      `    ${code} ${item.name.slice(0, 50)} x${qty} @ ${money(item.price)} → ${money(lineMinor)} AED`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)
  return { positions, sumMinor }
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

function saveAndPrintPdf(pdfBuf, invoiceName) {
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const safe = String(invoiceName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ordersDir, `GENOSYS_Bianco_DSO_Silicon_${safe}.pdf`)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF: ${outPath} (${pdfBuf.length} bytes)`)

  if (PRINT) printPdfLandscape(outPath)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Bianco DSO Silicon (Cedre) — SO + invoice + shipment + print')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const contract = await api('GET', `/entity/contract/${CONTRACT_ID}`)
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday()

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipmentAddress = buildShipmentAddress(agent)

  if (Math.abs(sumMinor - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Total mismatch: ${money(sumMinor)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = ORDER.moment
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    shared: true,
    description: [
      ORDER.marker,
      'EZ CO2 box x2, CTS vials x10, AWS vials x10 — clinic prices.',
      `Ship: ${shipmentAddress.street}, ${shipmentAddress.city}.`,
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipmentAddress,
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
      contract: href('contract', CONTRACT_ID),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull: shipmentAddress,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
      positions,
    })
  } catch {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agent.id),
      contract: href('contract', CONTRACT_ID),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull: shipmentAddress,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

  const invPos = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
  const demandPositions = invPos.map((p) => ({
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
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull: shipmentAddress,
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  console.log('\n  Exporting invoice PDF...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (pdfBuf) saveAndPrintPdf(pdfBuf, invoice.name)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
