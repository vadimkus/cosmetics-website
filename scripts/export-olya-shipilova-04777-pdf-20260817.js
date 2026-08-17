#!/usr/bin/env node

/**
 * Re-export Olya Shipilova / Seline Clinic invoice 04777 → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/export-olya-shipilova-04777-pdf-20260817.js
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const INVOICE_ID = 'ceeb7b49-79ce-11f1-0a80-0f78001377e8'
const TEMPLATE = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

async function main() {
  const res = await fetch(`${API}/entity/invoiceout/${INVOICE_ID}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template: {
        meta: {
          href: `${API}/entity/invoiceout/metadata/customtemplate/${TEMPLATE}`,
          type: 'customtemplate',
          mediaType: 'application/json',
        },
      },
      extension: 'pdf',
    }),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const outPath = path.join(os.homedir(), 'Desktop', 'orders', 'GENOSYS_Olya_Shipilova_04777.pdf')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
  console.log(`Saved: ${outPath} (${buf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
