#!/usr/bin/env node

/**
 * Brau Ladies — re-export invoice PDFs via Genosys_Invoice_Legal_TAX (TRN field).
 * Invoices 04757 (Abu Dhabi) + 04758 (Jumeirah) → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-export-brau-ladies-invoice-pdf-legal-tax-20260703.js
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
  { name: '04757', label: 'ADU', id: '39d07655-76a9-11f1-0a80-04b6000eecd8' },
  { name: '04758', label: 'JBR', id: '3d3fb4e7-76a9-11f1-0a80-0d9f000ee817' },
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
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Brau_Ladies_${label}_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return { outPath, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Brau Ladies — invoice PDFs (Genosys_Invoice_Legal_TAX)')
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
