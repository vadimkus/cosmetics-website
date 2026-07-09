#!/usr/bin/env node

/**
 * Export Shakirovna Business Bay consignment PDFs (reports 01383 / 01384 + demands 06428 / 06429)
 * → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-export-shakirovna-elite-clinic-commission-pdfs-20260628.js
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

/** Invoice_Consignment_Sales_Genosys */
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
/** Consignment Stock Note */
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const DOCS = [
  {
    label: 'Elite_Salon',
    reportId: '941e5d8c-7320-11f1-0a80-17870065299d',
    reportName: '01383',
    demandId: '94ddb79c-7320-11f1-0a80-0c520062a228',
    demandName: '06428',
  },
  {
    label: 'Esthetic_Clinic',
    reportId: '959a035e-7320-11f1-0a80-178700652c4d',
    reportName: '01384',
    demandId: '960f2e30-7320-11f1-0a80-178700652c5b',
    demandName: '06429',
  },
]

async function exportPdf(entity, docId, templateId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/${entity}/metadata/customtemplate/${templateId}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/${entity}/${docId}/export`, {
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
    throw new Error(`Export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  console.log('Export Shakirovna consignment PDFs →', ORDERS_DIR)

  for (const doc of DOCS) {
    console.log(`\n  ${doc.label} (report ${doc.reportName} / demand ${doc.demandName}) …`)

    const salesBuf = await exportPdf(
      'commissionreportin',
      doc.reportId,
      CONSIGNMENT_SALES_TEMPLATE_ID
    )
    const salesOut = path.join(
      ORDERS_DIR,
      `GENOSYS_Shakirovna_${doc.label}_Consignment_Sales_${doc.reportName}.pdf`
    )
    fs.writeFileSync(salesOut, salesBuf)
    console.log(`  Sales: ${salesOut} (${salesBuf.length} bytes)`)

    const stockBuf = await exportPdf('demand', doc.demandId, STOCK_NOTE_TEMPLATE_ID)
    const stockOut = path.join(
      ORDERS_DIR,
      `GENOSYS_Shakirovna_${doc.label}_Consignment_Stock_Note_${doc.demandName}.pdf`
    )
    fs.writeFileSync(stockOut, stockBuf)
    console.log(`  Stock: ${stockOut} (${stockBuf.length} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
