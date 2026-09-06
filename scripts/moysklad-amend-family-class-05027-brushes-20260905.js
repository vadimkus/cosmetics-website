#!/usr/bin/env node

/**
 * Family Class INV 05027 — add HR³ Matrix Scalp Brush 54471 ×2 @ 25 clinic.
 * Re-export Legal_TAX → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-amend-family-class-05027-brushes-20260905.js
 *   node --import dotenv/config scripts/moysklad-amend-family-class-05027-brushes-20260905.js --commit
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

const ORDER_ID = '9db215e5-a8fe-11f1-0a80-143f008c32d3'
const INVOICE_ID = '9dfe1052-a8fe-11f1-0a80-143f008c3300'
const DEMAND_ID = '9eae207e-a8fe-11f1-0a80-19ad0090eb11'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const ADD_CODE = '54471'
const ADD_QTY = 2
const ADD_AED = 25
const CURRENT_SUM_MINOR = 112500
const EXPECTED_SUM_MINOR = 117500
const MARKER = 'FAMILY-CLASS-05027-ADD-BRUSHES-2026-09-05'

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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
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
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const out = path.join(ORDERS_DIR, `GENOSYS_Family_Class_Polyclinic_${safe}.pdf`)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  fs.writeFileSync(out, Buffer.from(await pdfRes.arrayBuffer()))
  return out
}

async function amendDoc(type, id, label, productId) {
  const doc = await api('GET', `/entity/${type}/${id}`)
  const pos = await api('GET', `/entity/${type}/${id}/positions?expand=assortment&limit=50`)
  const rows = pos.rows || []
  const already = rows.find((r) => r.assortment?.code === ADD_CODE)
  console.log(`  ${label} ${doc.name} ${money(doc.sum)} (${rows.length} lines)`)

  if (already) {
    if (doc.sum === EXPECTED_SUM_MINOR && Number(already.quantity) === ADD_QTY) {
      console.log(`    ${ADD_CODE} already on ${label} x${already.quantity}`)
      return
    }
    throw new Error(`${label} already has ${ADD_CODE} x${already.quantity} sum ${money(doc.sum)}`)
  }
  if (doc.sum !== CURRENT_SUM_MINOR) {
    throw new Error(`${label} sum ${money(doc.sum)} ≠ current ${money(CURRENT_SUM_MINOR)}`)
  }

  if (!COMMIT) return

  await api('POST', `/entity/${type}/${id}/positions`, {
    quantity: ADD_QTY,
    price: Math.round(ADD_AED * 100),
    discount: 0,
    assortment: href('product', productId),
    vat: 5,
    vatEnabled: true,
  })
  const after = await api('GET', `/entity/${type}/${id}`)
  if (after.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`${label} sum ${money(after.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }
  console.log(`    → ${money(after.sum)}`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Family Class 05027 — add scalp brush ×2 @ 25')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Target: ${money(EXPECTED_SUM_MINOR)} AED`)

  const data = await api(
    'GET',
    `/entity/assortment?filter=code=${encodeURIComponent(ADD_CODE)}&limit=5&stockMode=all`,
  )
  const item = (data.rows || []).find((r) => r.code === ADD_CODE && !r.archived)
  if (!item?.id) throw new Error(`Unknown ${ADD_CODE}`)
  const avail = Number(item.stock || 0) - Number(item.reserve || 0)
  if (avail < ADD_QTY) throw new Error(`Stock ${ADD_CODE}: need ${ADD_QTY}, have ${avail}`)
  console.log(`  Add: ${ADD_CODE} ${item.name} x${ADD_QTY} @ ${ADD_AED}  stock=${avail}`)

  await amendDoc('customerorder', ORDER_ID, 'SO', item.id)
  await amendDoc('invoiceout', INVOICE_ID, 'INV', item.id)
  await amendDoc('demand', DEMAND_ID, 'SHIP', item.id)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const so = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: so.meta,
    description: [so.description || '', MARKER, 'Added 54471 Scalp Brush x2 @25. Total 1175 unpaid.'].join('\n'),
  })

  const invoice = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  const pdf = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`  PDF: ${pdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
