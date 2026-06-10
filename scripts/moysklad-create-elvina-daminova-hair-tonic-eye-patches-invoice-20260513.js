#!/usr/bin/env node

/**
 * Miss Elvina Daminova — retail customer order + customer invoice + retail invoice PDF to Desktop + print.
 *
 * Lines:
 *   - HR3 Matrix Hair Tonic 70ml (00051) × 7
 *   - EyeCell Eye Peptide Gel Patch box (00053) × 2
 *
 * PDF: template **Genosys_Invoice_Legal_TAX** (`INVOICE_LEGAL_TAX_TEMPLATE_ID`).
 *
 *   node scripts/moysklad-create-elvina-daminova-hair-tonic-eye-patches-invoice-20260513.js
 *   node scripts/moysklad-create-elvina-daminova-hair-tonic-eye-patches-invoice-20260513.js --commit
 *   node scripts/moysklad-create-elvina-daminova-hair-tonic-eye-patches-invoice-20260513.js --commit --no-print
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
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'

const CUSTOMER_EXACT_NAME = 'Miss Elvina Daminova'

const ORDER = {
  name: `GENCardM${uaeShortDate()}1770`,
  moment: uaeMomentNow(),
  marker: `Elvina Daminova retail hair tonic x7 eye patches x2 invoice ${uaeToday()}`,
}

const PRODUCT_LINES = [
  ['00051', 7], // HR3 Matrix Hair Tonic 70ml
  ['00053', 2], // EyeCell Eye Peptide Gel Patch (box)
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

async function resolveElvinaAgent() {
  const rows = await fetchAll(`/entity/counterparty?search=${encodeURIComponent('Elvina')}`)
  const hit = rows.find((r) => r.name === CUSTOMER_EXACT_NAME)
  if (!hit) throw new Error(`Counterparty not found: ${CUSTOMER_EXACT_NAME}`)
  console.log(`  Counterparty: ${hit.name} (${hit.id})`)
  return hit
}

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && (full.city || full.street || full.addInfo)) {
    return {
      country: { meta: full.country.meta },
      ...(full.city ? { city: full.city } : {}),
      ...(full.street ? { street: full.street } : {}),
      ...(!full.street && full.addInfo ? { street: full.addInfo } : {}),
    }
  }
  return {
    country: countryHref(),
    city: 'Dubai',
    street: 'UAE — confirm delivery address with customer',
  }
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
  if (dup) {
    throw new Error(`Duplicate protection: customer order exists (${dup.name}, id=${dup.id})`)
  }
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
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

function desktopPdfPath(invoiceName) {
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const desktop = path.join(os.homedir(), 'Desktop')
  if (fs.existsSync(desktop)) {
    return path.join(desktop, `GENOSYS_Elvina_Daminova_${safe}.pdf`)
  }
  return path.join(os.tmpdir(), `GENOSYS_Elvina_Daminova_${safe}.pdf`)
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
  console.log('  Miss Elvina Daminova — retail order + invoice + PDF + print')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await resolveElvinaAgent()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)
  await ensureOrderNameFree()

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)

  console.log()
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(
      `    ${code} ${item.name.slice(0, 56)}… x${qty} @ ${money(item.price)} → ${money(item.price * qty)} AED`
    )
  }
  console.log(`  Expected sum: ${money(sumMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit to create order, invoice, PDF, and print.')
    return
  }

  const shipmentAddressFull = buildShipmentAddress(agent)
  const commonPayload = {
    moment: ORDER.moment,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    vatEnabled: true,
    vatIncluded: true,
  }

  const order = await api('POST', '/entity/customerorder', {
    ...commonPayload,
    name: ORDER.name,
    description: [ORDER.marker, 'Retail: HR3 Hair Tonic x7, EyeCell Eye Peptide Gel Patch box x2.'].join(' | '),
    store: href('store', STORE_ID),
    state: {
      meta: {
        href: `${API}/entity/customerorder/metadata/states/${STATE_NEW_ORDER_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
    positions,
  })

  console.log()
  console.log(`  Created order: ${order.name} | ${(order.sum / 100).toFixed(2)} AED | id=${order.id}`)
  console.log(`  Order UI: https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  const invoicePayload = {
    ...commonPayload,
    applicable: true,
    customerOrder: href('customerorder', order.id),
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  }

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', invoicePayload)
  } catch (e) {
    console.warn('  Invoice create with positions failed, retrying customerOrder link only:', e.message.slice(0, 200))
    delete invoicePayload.positions
    invoice = await api('POST', '/entity/invoiceout', invoicePayload)
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

  if (NO_PRINT) {
    console.log('  Skipping PDF/print (--no-print).')
    return
  }

  console.log()
  console.log('  Exporting invoice PDF (Genosys_Invoice_Legal_TAX retail template)...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (!pdfBuf) {
    console.warn('  MoySklad returned no PDF. Open invoice UI to print, or verify retail customtemplate link.')
    if (process.platform === 'darwin') {
      try {
        execFileSync('open', [invoiceUi], { stdio: 'inherit' })
      } catch (_) {}
    }
    return
  }
  const outPath = desktopPdfPath(invoice.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
  sendPdfToPrint(outPath)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
