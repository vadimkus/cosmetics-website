#!/usr/bin/env node

/**
 * BELLECHIK — invoice from SO GENCardM260723BLCH + Legal_TAX PDF to ~/Desktop/orders/
 *
 *   00048 Hair Solution Pro Box ×3 @ 370 = 1,110 AED (no delivery)
 *
 *   node --import dotenv/config scripts/moysklad-create-bellechik-invoice-20260723.js
 *   node --import dotenv/config scripts/moysklad-create-bellechik-invoice-20260723.js --commit
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

const { uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const ORDER_ID = 'd2189bc5-8683-11f1-0a80-105f0017c014'
const AGENT_ID = 'd1188152-8683-11f1-0a80-19f900173b12'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const EXPECTED_SUM_MINOR = 111000
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const ADDRESS =
  'Sohum Wellness Sanctuary, Al Quoz 1, First floor, Bellechik Beauty Salon, Dubai'

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
  const pdfPath = path.join(ORDERS_DIR, `GENOSYS_BELLECHIK_TaxInvoice_${safe}.pdf`)
  fs.writeFileSync(pdfPath, buf)
  return pdfPath
}

async function main() {
  console.log('====================================================================')
  console.log('  BELLECHIK — create invoice + Legal_TAX PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=invoicesOut`)
  console.log(`  Order: ${order.name} | ${(order.sum || 0) / 100} AED`)

  const existing = (order.invoicesOut?.rows || []).map((r) => r.meta?.href).filter(Boolean)
  if (existing.length) {
    console.log('  Existing invoices linked:')
    for (const h of existing) console.log(`    ${h}`)
    throw new Error('Order already has invoice(s) — abort to avoid duplicates')
  }

  if ((order.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Order sum ${(order.sum || 0) / 100} != expected ${EXPECTED_SUM_MINOR / 100}`)
  }

  const orderPos = await fetchAll(`/entity/customerorder/${ORDER_ID}/positions?expand=assortment`)
  const positions = orderPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: { meta: p.assortment.meta },
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  for (const p of orderPos) {
    console.log(
      `  line: ${p.assortment?.code || '?'} ×${p.quantity} @ ${(p.price || 0) / 100} — ${p.assortment?.name || ''}`,
    )
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const shipmentAddressFull = { addInfo: ADDRESS, street: '', city: '' }

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
    shipmentAddressFull,
    description: `Invoice for ${order.name} | 00048 Hair Solution x3 @370 | no delivery`,
    positions,
  })

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  console.log(`\n  Invoice: ${invoice.name} | ${(invoice.sum || 0) / 100} AED`)
  if ((invoice.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Invoice sum mismatch: ${(invoice.sum || 0) / 100}`)
  }

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  console.log(`  PDF: ${pdfPath}`)
  console.log(`  Link: https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
