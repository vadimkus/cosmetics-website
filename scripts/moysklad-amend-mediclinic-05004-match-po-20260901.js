#!/usr/bin/env node

/**
 * Mediclinic 05004 — match PO 5700568865 exactly and re-export Legal_TAX.
 *   50 × 36.19 ex-VAT + 5% = 1,809.50 + 90.48 = 1,899.98
 *
 *   node --import dotenv/config scripts/moysklad-amend-mediclinic-05004-match-po-20260901.js
 *   node --import dotenv/config scripts/moysklad-amend-mediclinic-05004-match-po-20260901.js --commit
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

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORDER_ID = 'b7ad2ac1-a5cb-11f1-0a80-091b002600d5'
const INVOICE_ID = 'b7edb3bd-a5cb-11f1-0a80-18220022ee7d'
const DEMAND_ID = 'b8dd47ef-a5cb-11f1-0a80-0bea0026d4c3'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const PRICE_MINOR = 3619
const EXPECTED_SUM_MINOR = 189998
const EXPECTED_VAT_MINOR = 9048

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
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
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function amendDoc(type, id, label) {
  const doc = await api('GET', `/entity/${type}/${id}?expand=agent`)
  const pos = await api('GET', `/entity/${type}/${id}/positions?expand=assortment&limit=20`)
  const rows = pos.rows || []
  if (rows.length !== 1) throw new Error(`${label}: expected 1 line, got ${rows.length}`)
  const line = rows[0]
  if (line.assortment?.code !== '00012' || line.quantity !== 50) {
    throw new Error(`${label}: unexpected line ${line.assortment?.code} x${line.quantity}`)
  }
  console.log(
    `  ${label} ${doc.name} ${money(doc.sum)} vatIncl=${doc.vatIncluded} price=${money(line.price)}`,
  )

  if (!COMMIT) return

  await api('PUT', `/entity/${type}/${id}`, {
    meta: doc.meta,
    vatEnabled: true,
    vatIncluded: false,
  })
  await api('PUT', `/entity/${type}/${id}/positions/${line.id}`, {
    quantity: 50,
    price: PRICE_MINOR,
    discount: 0,
    vat: 5,
    vatEnabled: true,
  })
  const after = await api('GET', `/entity/${type}/${id}`)
  if (after.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`${label} sum ${money(after.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (after.vatSum !== EXPECTED_VAT_MINOR) {
    throw new Error(`${label} vat ${money(after.vatSum)} ≠ ${money(EXPECTED_VAT_MINOR)}`)
  }
  if (after.vatIncluded !== false) throw new Error(`${label} vatIncluded still ${after.vatIncluded}`)
  console.log(`    → ${money(after.sum)} vat ${money(after.vatSum)} on top`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Mediclinic 05004 — match PO 1,899.98 and reissue PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  await amendDoc('customerorder', ORDER_ID, 'SO')
  await amendDoc('invoiceout', INVOICE_ID, 'INV')
  await amendDoc('demand', DEMAND_ID, 'SHIP')

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const inv = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  await api('PUT', `/entity/invoiceout/${INVOICE_ID}`, {
    meta: inv.meta,
    description: [
      'PO 5700568865 | Invoice for GENCardM260901MDUM50',
      '50 x 36.19 net = 1809.50 + VAT 5% 90.48 = 1899.98 (PO total).',
      '2026-09-01: reissued to match PO (was 1900 VAT-included).',
    ].join(' | '),
  })

  const so = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: so.meta,
    description: [
      so.description || '',
      '2026-09-01: reissued to PO 5700568865 — 50 x 36.19 + 5% = 1899.98.',
    ].join(' | '),
  })

  const pdfBuf = await exportInvoicePdf(INVOICE_ID)
  const outPath = path.join(ORDERS_DIR, 'GENOSYS_Mediclinic_Dubai_Mall_05004.pdf')
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF: ${outPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
