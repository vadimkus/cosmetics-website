#!/usr/bin/env node

/**
 * BIANCO JGE Ladies Salon L.L.C — customer order + customer invoice (Счет покупателю) + PDF print.
 *
 * Lines from spreadsheet (2026-05-09): EZ CO box×1, Hydro Cool 1kg×2, Power Solution
 * AWS/CTS/CVS/HES/PCS/SWS (vial units per sheet), SRS×2, Collagen 23g×10, Roller 0.25mm×7.
 * Power Solutions are booked as individual vial SKUs; "1 box" on the sheet = 1 vial unless
 * you change LINES below.
 *
 * PDF export uses MoySklad template **Genosys_Invoice_Legal_TAX** (`INVOICE_LEGAL_TAX_TEMPLATE_ID`).
 *
 *   node scripts/moysklad-create-bianco-jge-order-invoice-20260509.js
 *   node scripts/moysklad-create-bianco-jge-order-invoice-20260509.js --commit
 *   node scripts/moysklad-create-bianco-jge-order-invoice-20260509.js --commit --no-print
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync, spawnSync } = require('child_process')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const NO_PRINT = process.argv.includes('--no-print')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const AGENT_ID = 'f10054f9-da25-11ef-0a80-115c0005d233' // BIANCO JGE Ladies Salon L.L.C
const CONTRACT_ID = '9f41e7f0-e3a2-11ef-0a80-0152001c1301' // Contract 16

const ORDER = {
  name: `GENCardM${uaeShortDate()}6278`,
  moment: uaeMomentNow(),
  marker: `Bianco JGE Ladies salon pro order + invoice ${uaeToday()} spreadsheet`,
}

/** [code, qty] */
const LINES = [
  ['00011', 1], // EZ CO₂ Professional Box
  ['00013', 2], // Hydro Cool Modeling Mask 1kg
  ['00018', 1], // Power Solution AWS
  ['00069', 1], // Power Solution CTS
  ['00067', 1], // Power Solution CVS
  ['00071', 2], // Power Solution HES
  ['00065', 1], // Power Solution PCS
  ['00020', 1], // Power Solution SWS
  ['00015', 2], // SRS 1 vial
  ['00063', 10], // Intensive Repair Collagen Mask 23g
  ['00001', 7], // Standard Detachable Manual Roller 0.25mm
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=${limit}&offset=${offset}`)
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

function countryHref() {
  return {
    meta: {
      href: `${API}/entity/country/${COUNTRY_UAE_ID}`,
      type: 'country',
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

function buildShipmentAddress(agent) {
  const addInfo = agent.actualAddressFull?.addInfo || agent.actualAddress?.addInfo || ''
  const street = addInfo || 'UAE'
  return {
    country: countryHref(),
    city: 'Dubai',
    street,
  }
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
  if (dup) {
    throw new Error(`Duplicate protection: customer order exists (${dup.name}, id=${dup.id})`)
  }
}

function positionsFromStock(stock, lines) {
  const out = []
  for (const [code, qty] of lines) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    out.push({
      quantity: qty,
      price: item.price,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  return out
}

const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1' // Выписан

/** Печатная форма «Genosys_Invoice_Legal_TAX» (юридический счёт с налогом). */
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'

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
    if (/33003|шаблон/i.test(t)) {
      return null
    }
    throw new Error(`Invoice export 412: ${t.slice(0, 600)}`)
  }
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function defaultInvoicePdfPath(invoiceName) {
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const desktop = path.join(os.homedir(), 'Desktop')
  if (fs.existsSync(desktop)) {
    return path.join(desktop, `GENOSYS_Bianco_JGE_${safe}.pdf`)
  }
  return path.join(os.tmpdir(), `GENOSYS_Bianco_JGE_${safe}.pdf`)
}

function sendPdfToPrint(pdfPath) {
  if (process.platform !== 'darwin') {
    console.log(`  PDF saved (non-macOS): ${pdfPath}`)
    return
  }
  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status === 0 && whichLp.stdout.trim()) {
    try {
      execFileSync('lp', [pdfPath], { stdio: 'inherit' })
      console.log('  Sent to default printer (lp).')
      return
    } catch (e) {
      console.warn('  lp failed, opening PDF:', e.message)
    }
  }
  execFileSync('open', [pdfPath], { stdio: 'inherit' })
}

async function main() {
  console.log('====================================================================')
  console.log('  Bianco JGE Ladies — order + invoice + print')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const contract = await api('GET', `/entity/contract/${CONTRACT_ID}`)
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name} (${contract.id})`)

  await ensureOrderNameFree()
  await ensureNoDuplicateToday()

  const stock = await fetchStockByCode()
  const positions = positionsFromStock(stock, LINES)

  let sumMinor = 0
  console.log()
  for (const [code, qty] of LINES) {
    const item = stock.get(code)
    const lineMinor = item.price * qty
    sumMinor += lineMinor
    console.log(
      `    ${code} ${item.name.slice(0, 55)}… x${qty} @ ${money(item.price)} → ${money(lineMinor)} AED`
    )
  }
  console.log(`  Expected sum (list, VAT-incl.): ${money(sumMinor)} AED`)

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit.')
    return
  }

  const orderPayload = {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [
      ORDER.marker,
      'Spreadsheet lines: EZ CO×1, Hydro Cool×2, Power AWS/CTS/CVS + HES×2 + PCS/SWS, SRS×2, Collagen×10, Roller 0.25×7.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: {
      meta: {
        href: `${API}/entity/customerorder/metadata/states/${STATE_NEW_ORDER_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: buildShipmentAddress(agent),
    positions,
  }

  const order = await api('POST', '/entity/customerorder', orderPayload)
  console.log()
  console.log(`  Created order: ${order.name} | ${(order.sum / 100).toFixed(2)} AED | id=${order.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  const invPayload = {
    moment: ORDER.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', CONTRACT_ID),
    customerOrder: href('customerorder', order.id),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: buildShipmentAddress(agent),
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  }

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  } catch (e) {
    console.warn('  Invoice create with positions duplicate failed, retrying order-link only:', e.message.slice(0, 200))
    delete invPayload.positions
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  }

  console.log(`  Created invoice: ${invoice.name} | ${(invoice.sum / 100).toFixed(2)} AED | id=${invoice.id}`)
  const invoiceUi = `https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`
  console.log(`  UI: ${invoiceUi}`)

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/states/${INVOICE_STATE_ISSUED_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
  }).catch(() => {
    console.warn('  (Could not set invoice state Выписан — optional.)')
  })

  if (NO_PRINT) {
    console.log('  Skipping PDF (--no-print).')
    return
  }

  console.log()
  console.log('  Exporting invoice PDF...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (!pdfBuf) {
    console.warn(
      '  MoySklad returned “no print template” (33003). Configure a Счет template in МойСклад, or print from the invoice screen (⋯ → Печать / Cmd+P).'
    )
    if (process.platform === 'darwin') {
      try {
        execFileSync('open', [invoiceUi], { stdio: 'inherit' })
        console.log('  Opened invoice in browser for printing.')
      } catch (_) {}
    }
    return
  }
  const outPath = defaultInvoicePdfPath(invoice.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
  sendPdfToPrint(outPath)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
