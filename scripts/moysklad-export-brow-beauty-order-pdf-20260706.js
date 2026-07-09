#!/usr/bin/env node

/**
 * Export Brow and Beauty PO GENCardM260706BBAC → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-export-brow-beauty-order-pdf-20260706.js
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

const ORDER_ID = '31dc1301-7913-11f1-0a80-1e2300783264'
const ORDER_NAME = 'GENCardM260706BBAC'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f' // Genosys_Invoice_PROFORMA
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const LICENSE_SRC =
  '/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/Screenshot_2026-07-06_at_12.14.42_PM-4d8923c9-1fb2-4e49-a4b6-3143f575f2e3.png'

async function exportOrderPdf(orderId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/customerorder/metadata/customtemplate/${ORDER_PROFORMA_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/customerorder/${orderId}/export`, {
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
    throw new Error(`Order export 412: ${t.slice(0, 600)}`)
  }
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Order export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })

  console.log('Exporting order PDF (Genosys_Invoice_PROFORMA)...')
  const buf = await exportOrderPdf(ORDER_ID)
  const pdfPath = path.join(ORDERS_DIR, `GENOSYS_Brow_and_Beauty_${ORDER_NAME}.pdf`)
  fs.writeFileSync(pdfPath, buf)
  console.log(`  Saved: ${pdfPath}`)

  if (fs.existsSync(LICENSE_SRC)) {
    const licensePath = path.join(ORDERS_DIR, 'Brow_and_Beauty_License_1582255.png')
    fs.copyFileSync(LICENSE_SRC, licensePath)
    console.log(`  License: ${licensePath}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
