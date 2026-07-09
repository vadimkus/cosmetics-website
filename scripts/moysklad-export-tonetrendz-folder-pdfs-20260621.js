#!/usr/bin/env node

/**
 * Export TONETRENDZ customer PDFs → Contract_Customers/Toner_Trends/
 *
 *   - Tax invoice 04685 (Genosys_Invoice_Legal_TAX) — pro consumables, paid
 *   - Consignment stock note 06326 (optional, --with-stock-note default on)
 *
 *   node --import dotenv/config scripts/moysklad-export-tonetrendz-folder-pdfs-20260621.js
 *   node --import dotenv/config scripts/moysklad-export-tonetrendz-folder-pdfs-20260621.js --commit
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
const WITH_STOCK_NOTE = !process.argv.includes('--invoice-only')

const INVOICE_ID = '6f2623c2-6a0c-11f1-0a80-048a0002fd02' // 04685
const DEMAND_ID = '7b63d1d7-63dc-11f1-0a80-0d66001d1a9f' // 06326
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const OUT_DIR = path.join(
  os.homedir(),
  'Desktop',
  'Drive',
  'Genosys',
  'Contract_Customers',
  'Toner_Trends'
)
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function exportPdf(entityType, entityId, templateId, extension = 'pdf') {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/${entityType}/metadata/customtemplate/${templateId}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension,
  }
  const res = await fetch(`${API}/entity/${entityType}/${entityId}/export`, {
    method: 'POST',
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Export ${entityType} ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  TONETRENDZ — export PDFs to Contract_Customers/Toner_Trends')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Output: ${OUT_DIR}`)

  const invoice = await api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=agent,state`)
  const demand = await api('GET', `/entity/demand/${DEMAND_ID}?expand=agent,state`)

  console.log(`\n  Invoice: ${invoice.name} | ${(invoice.sum / 100).toFixed(2)} AED | ${invoice.state?.name || '—'}`)
  console.log(`  Consignment: ${demand.name} | ${(demand.sum / 100).toFixed(2)} AED`)

  const plan = [
    {
      label: 'Tax invoice (Genosys_Invoice_Legal_TAX)',
      entityType: 'invoiceout',
      entityId: INVOICE_ID,
      templateId: INVOICE_LEGAL_TAX_TEMPLATE_ID,
      fileName: `Genosys_Invoice_${invoice.name}_TONETRENDZ.pdf`,
      alsoOrders: true,
    },
  ]

  if (WITH_STOCK_NOTE) {
    plan.push({
      label: 'Consignment stock note 06326',
      entityType: 'demand',
      entityId: DEMAND_ID,
      templateId: STOCK_NOTE_TEMPLATE_ID,
      fileName: `Genosys_Consignment_Stock_Note_${demand.name}_TONETRENDZ.pdf`,
      alsoOrders: true,
    })
  }

  for (const item of plan) {
    console.log(`\n  → ${item.label}`)
    console.log(`    ${item.fileName}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.mkdirSync(ORDERS_DIR, { recursive: true })

  for (const item of plan) {
    console.log(`\n  Exporting ${item.label}…`)
    const buf = await exportPdf(item.entityType, item.entityId, item.templateId)
    const outPath = path.join(OUT_DIR, item.fileName)
    fs.writeFileSync(outPath, buf)
    console.log(`    ${outPath} (${buf.length} bytes)`)
    if (item.alsoOrders) {
      const ordersPath = path.join(ORDERS_DIR, item.fileName)
      fs.writeFileSync(ordersPath, buf)
      console.log(`    ${ordersPath}`)
    }
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
