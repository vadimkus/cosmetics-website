#!/usr/bin/env node

/**
 * LODY ANA.SPA. LLC — invoice from SO GENCardM260823LODY + Legal_TAX print.
 * SO was invoice-less. Copies SO lines and ship address. No shipment.
 *
 *   node --import dotenv/config scripts/moysklad-create-lodyana-invoice-print-20260823.js
 *   node --import dotenv/config scripts/moysklad-create-lodyana-invoice-print-20260823.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')
const { printPdfLandscape } = require('./lib/moysklad-print-pdf')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const ORDER_ID = '90bfd901-9eec-11f1-0a80-1eb700920c73'
const AGENT_ID = '5746700f-455a-11f1-0a80-03c5003a244c'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const EXPECTED_SUM_MINOR = 67000
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

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
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function cleanShip(full) {
  const out = { addInfo: '' }
  if (full?.country?.meta) out.country = { meta: full.country.meta }
  if (full?.city) out.city = full.city
  if (full?.street) out.street = full.street
  if (full?.postalCode) out.postalCode = full.postalCode
  return out
}

async function exportInvoicePdf(invoiceId, invoiceName) {
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
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName).replace(/[^\w.-]+/g, '_')
  const pdfPath = path.join(ORDERS_DIR, `GENOSYS_LODYANA_${safe}.pdf`)
  fs.writeFileSync(pdfPath, buf)
  return pdfPath
}

async function main() {
  console.log('====================================================================')
  console.log('  LODY ANA.SPA. LLC — invoice from GENCardM260823LODY + print')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=agent,invoicesOut`)
  if (order.agent?.id !== AGENT_ID && !/lody\s*ana\.spa/i.test(order.agent?.name || '')) {
    throw new Error(`Unexpected agent: ${order.agent?.name}`)
  }
  console.log(`  SO ${order.name} | ${money(order.sum)} AED`)

  const existingHref = (order.invoicesOut?.rows || []).map((r) => r.meta?.href).filter(Boolean)
  if (existingHref.length || (order.invoicesOut?.meta?.size || 0) > 0) {
    throw new Error('SO already has an invoice — abort')
  }
  if (order.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`SO sum ${money(order.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

  const orderPos = await fetchAll(`/entity/customerorder/${ORDER_ID}/positions?expand=assortment`)
  for (const p of orderPos) {
    console.log(`    ${p.assortment?.code} ${p.assortment?.name} x${p.quantity} @ ${money(p.price)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const positions = orderPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: { meta: p.assortment.meta },
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  const invoice = await api('POST', '/entity/invoiceout', {
    moment: uaeMomentNow(),
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    customerOrder: href('customerorder', ORDER_ID),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: cleanShip(order.shipmentAddressFull),
    description: `Invoice for ${order.name} | Hair Stamp 00141 @230; Hair Solution 00048 @370; AD delivery 70. Clinic. Unpaid.`,
    positions,
  })
  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
  if (invoice.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Invoice sum ${money(invoice.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  console.log(`\n  Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`  PDF: ${pdfPath}`)
  try {
    printPdfLandscape(pdfPath)
    console.log('  Printed landscape (orientation-requested=4)')
  } catch (e) {
    console.error(`  Print failed: ${e.message}`)
    execFileSync('open', [pdfPath], { stdio: 'inherit' })
  }
  console.log(`  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
