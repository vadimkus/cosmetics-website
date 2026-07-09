#!/usr/bin/env node

/**
 * Milena — export invoice PDFs via Genosys_Invoice_Legal_TAX template.
 * Invoices 04752 (Wasl) + 04753 (JBR) → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-export-milena-invoice-pdf-legal-tax-20260702.js
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
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71' // Genosys_Invoice_Legal_TAX

const INVOICES = [
  { name: '04752', label: 'Wasl', id: '3ba1ac33-760b-11f1-0a80-04b10040ddfc' },
  { name: '04753', label: 'JBR', id: '3ef7036d-760b-11f1-0a80-0ffa0041fa4e' },
]

async function api(pathStr) {
  const res = await fetch(`${API}${pathStr}`, {
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function exportInvoicePdf(invoiceId, invoiceName, label) {
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
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Export ${invoiceName} ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Milena_${label}_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return { outPath, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Milena — invoice PDFs (Genosys_Invoice_Legal_TAX)')
  console.log('====================================================================\n')

  for (const spec of INVOICES) {
    const inv = await api(`/entity/invoiceout/${spec.id}`)
    const pdf = await exportInvoicePdf(spec.id, inv.name, spec.label)
    if (!pdf) {
      console.warn(`  ${spec.label}: MoySklad returned no PDF for ${inv.name}`)
      continue
    }
    console.log(
      `  ${spec.label}: ${pdf.outPath} (${pdf.bytes} bytes) | ${((inv.sum || 0) / 100).toFixed(2)} AED`
    )
  }

  console.log('\n  Done.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
