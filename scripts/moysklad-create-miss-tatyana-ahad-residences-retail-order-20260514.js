#!/usr/bin/env node

/**
 * Retail unit prices match **genosys.ae / `lib/products.ts`** (VAT-included list), not MoySklad stock `salePrice`.
 *
 * Printing is **never** implicit: add `--print` to send PDF to `lp`.
 *
 * Correct already-created order **GENCardM2605143192** / invoice **04504** prices:
 *   node --import dotenv/config scripts/moysklad-create-miss-tatyana-ahad-residences-retail-order-20260514.js --fix-existing-prices
 *
 * Normal create:
 *   node --import dotenv/config scripts/moysklad-create-miss-tatyana-ahad-residences-retail-order-20260514.js --commit
 *   node --import dotenv/config scripts/moysklad-create-miss-tatyana-ahad-residences-retail-order-20260514.js --commit --no-pdf
 *   node --import dotenv/config scripts/moysklad-create-miss-tatyana-ahad-residences-retail-order-20260514.js --commit --print
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync, spawnSync } = require('child_process')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const NO_PDF = process.argv.includes('--no-pdf')
const PRINT = process.argv.includes('--print')
const FIX_EXISTING_PRICES = process.argv.includes('--fix-existing-prices')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'

const CUSTOMER = {
  name: 'Miss Tatyana',
  phone: '+971585889639',
  city: 'Dubai',
  street: 'Ahad Residences 814, Business Bay',
}

const ORDER = {
  name: 'GENCardM2605143192',
  moment: '2026-05-14 12:00:00',
  marker:
    'Miss Tatyana Ahad Residences 814 Business Bay retail order overnight PDRN pack Snow O2 sensitive EZ CO2 cushion 2026-05-14',
}

/** [code, qty, retailAed] — rosница как на genosys.ae (`lib/products.ts`), VAT вкл., не складская salePrice */
const PRODUCT_LINES = [
  ['00189', 1, 340], // SKIN RESCUE OVERNIGHT CREAM MASK 100g
  ['54467', 1, 400], // SKIN REBOOT PDRN MASK PACK
  ['00021', 1, 330], // SNOW O₂ CLEANSER 180ml
  ['00030', 1, 330], // ALL FOR SENSITIVE SERUM
  ['00011', 1, 460], // EZ CO₂ MASK KIT — catalogue code 38 (MoySklad 00011)
  ['00144', 1, 300], // SKIN CARING BLEMISH BALM CUSHION
]

/** После ошибочного создания со складскими ценами — обновить Заказ + Счёт 04504 до genosys.ae */
const EXISTING_DOCS_IDS = {
  customerOrderId: '56cf2ea3-4ef5-11f1-0a80-1ad000014755',
  invoiceOutId: '57134b6b-4ef5-11f1-0a80-105f000158e0',
}

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
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

async function findOrCreateCounterparty() {
  const exact = await api(
    'GET',
    `/entity/counterparty?filter=${encodeURIComponent(`name=${CUSTOMER.name}`)}&limit=5`
  )
  if (exact?.rows?.length) {
    const cp = exact.rows.find((r) => r.name === CUSTOMER.name)
    if (cp) {
      console.log(`  Counterparty (existing): ${cp.name} (${cp.id})`)
      return cp
    }
  }

  if (!COMMIT) {
    console.log(`  DRY RUN: would create counterparty "${CUSTOMER.name}" + phone ${CUSTOMER.phone}`)
    return { id: 'DRY-RUN', name: CUSTOMER.name, meta: { href: `${API}/entity/counterparty/DRY-RUN` } }
  }

  const addr = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    companyType: 'individual',
    phone: CUSTOMER.phone,
    description: `Retail — ${ORDER.name} | ${CUSTOMER.street}`,
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

async function ensureNoDuplicateToday(counterpartyId) {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${counterpartyId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate protection: order exists (${dup.name}, id=${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(Number(retailAed) * 100)
    const lineMinor = priceMinor * qty
    sumMinor += lineMinor
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
    if (/33003|шаблон/i.test(t)) return null
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

function invoicePdfPath(invoiceName) {
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const desktop = path.join(os.homedir(), 'Desktop')
  if (fs.existsSync(desktop)) {
    return path.join(desktop, `GENOSYS_Miss_Tatyana_${safe}.pdf`)
  }
  return path.join(os.tmpdir(), `GENOSYS_Miss_Tatyana_${safe}.pdf`)
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

function retailMinorByMsCode(msCode) {
  const hit = PRODUCT_LINES.find(([c]) => c === msCode)
  if (!hit) throw new Error(`No genosys.ae retail in PRODUCT_LINES for code ${msCode}`)
  return Math.round(hit[2] * 100)
}

async function updateDocPositionsToGenosysRetail(docLabel, pathPrefix, rows) {
  for (const p of rows) {
    const assortment = p.assortment
    const meta = assortment?.meta
    if (!meta || meta.type === 'service') continue
    const code = assortment.code
    if (!code) throw new Error(`${docLabel} position missing assortment.code`)
    const priceMinor = retailMinorByMsCode(code)
    const putUrl = `${pathPrefix}/${p.id}`
    await api('PUT', putUrl, {
      meta: p.meta,
      assortment: { meta },
      quantity: p.quantity,
      price: priceMinor,
      discount: p.discount || 0,
      vat: p.vat,
      vatEnabled: p.vatEnabled,
    })
    console.log(`    PUT ${docLabel} ${code} → ${money(priceMinor)} AED/unit`)
  }
}

async function fixExistingRetailPricesOnDocs() {
  const { customerOrderId, invoiceOutId } = EXISTING_DOCS_IDS

  const orderRows = (
    await api(
      'GET',
      `/entity/customerorder/${customerOrderId}/positions?expand=assortment&limit=50`
    )
  ).rows
  const invoiceRows = (
    await api('GET', `/entity/invoiceout/${invoiceOutId}/positions?expand=assortment&limit=50`)
  ).rows

  await updateDocPositionsToGenosysRetail(
    'customerorder',
    `/entity/customerorder/${customerOrderId}/positions`,
    orderRows
  )
  await updateDocPositionsToGenosysRetail(
    'invoiceout',
    `/entity/invoiceout/${invoiceOutId}/positions`,
    invoiceRows
  )

  const order = await api('GET', `/entity/customerorder/${customerOrderId}`)
  const invoice = await api('GET', `/entity/invoiceout/${invoiceOutId}`)
  console.log(`  Order sum after amend: ${(order.sum / 100).toFixed(2)} AED`)
  console.log(`  Invoice sum after amend: ${(invoice.sum / 100).toFixed(2)} AED`)

  console.log()
  console.log('  Exporting refreshed invoice PDF (no print)...')
  const pdfBuf = await exportInvoicePdf(invoiceOutId)
  if (!pdfBuf) {
    console.warn('  MoySklad did not return PDF.')
    return
  }
  const outPath = invoicePdfPath(invoice.name || '04504')
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
}

async function main() {
  if (FIX_EXISTING_PRICES) {
    if (!COMMIT) {
      console.error('FATAL: --fix-existing-prices requires --commit')
      process.exit(1)
    }
    console.log('====================================================================')
    console.log('  Miss Tatyana — fix retail prices on existing docs (genosys.ae)')
    console.log('====================================================================')
    await fixExistingRetailPricesOnDocs()
    return
  }

  console.log('====================================================================')
  console.log('  Miss Tatyana — Ahad Residences retail order + invoice + PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await findOrCreateCounterparty()
  if (COMMIT) {
    await ensureNoDuplicateToday(agent.id)
    await ensureOrderNameFree()
  }

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)

  console.log()
  for (const [code, qty, retailAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    const pu = Math.round(retailAed * 100)
    console.log(
      `    ${code} ${item.name.slice(0, 48)}… x${qty} @ ${money(pu)} (genosys.ae) → ${money(pu * qty)}`
    )
  }
  console.log(`  Expected sum (products only): ${money(sumMinor)} AED VAT-incl. (genosys.ae list)`)

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit.')
    return
  }

  const shipment = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }

  const orderPayload = {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [
      ORDER.marker,
      `Phone ${CUSTOMER.phone}. Retail lines: overnight mask, PDRN pack 30, Snow O2, sensitive serum, EZ CO2 box, cushion Beige.`,
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
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
    shipmentAddressFull: shipment,
    positions,
  }

  const order = await api('POST', '/entity/customerorder', orderPayload)
  console.log()
  console.log(`  Created order: ${order.name} | ${(order.sum / 100).toFixed(2)} AED | id=${order.id}`)
  console.log(`  Order UI: https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  const invPayload = {
    moment: ORDER.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    customerOrder: href('customerorder', order.id),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  }

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  } catch (e) {
    console.warn('  Invoice create with positions failed, retrying link-only:', String(e.message).slice(0, 240))
    delete invPayload.positions
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  }

  console.log(`  Created invoice: ${invoice.name} | ${(invoice.sum / 100).toFixed(2)} AED | id=${invoice.id}`)
  const invoiceUi = `https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`
  console.log(`  Invoice UI: ${invoiceUi}`)

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/states/${INVOICE_STATE_ISSUED_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
  }).catch(() => console.warn('  (Could not set invoice state Выписан — optional.)'))

  if (NO_PDF) {
    console.log('  Skipping PDF (--no-pdf).')
    return
  }

  console.log()
  console.log('  Exporting invoice PDF (Genosys_Invoice_Legal_TAX)...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (!pdfBuf) {
    console.warn(
      '  MoySklad returned no PDF (template). Open invoice in UI to print, or check customtemplate mapping.'
    )
    if (process.platform === 'darwin') {
      try {
        execFileSync('open', [invoiceUi], { stdio: 'inherit' })
      } catch (_) {}
    }
    return
  }
  const outPath = invoicePdfPath(invoice.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
  if (PRINT) {
    sendPdfToPrint(outPath)
  } else {
    console.log('  Not printing (omit default). Use --print to send to lp.')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
