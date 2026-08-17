#!/usr/bin/env node

/**
 * Shakirovna Marina — export consignment sales report 01402 PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-export-shakirovna-marina-consignment-report-01402-20260716.js
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

const REPORT_ID = 'f28aca51-79db-11f1-0a80-1f6400166305'
const REPORT_NAME = '01402'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const PDF_PATH = path.join(ORDERS_DIR, `GENOSYS_Shakirovna_Marina_Consignment_Sales_${REPORT_NAME}.pdf`)

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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function exportPdf(entityId, outPath) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/customtemplate/${CONSIGNMENT_SALES_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/commissionreportin/${entityId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`PDF export HTTP ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('PDF export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, Buffer.from(await pdfRes.arrayBuffer()))
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Marina — export consignment report PDF')
  console.log('====================================================================')

  const rep = await api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=state,agent`)
  if (rep.name !== REPORT_NAME) throw new Error(`Expected ${REPORT_NAME}, got ${rep.name}`)

  const pos = await api(
    'GET',
    `/entity/commissionreportin/${REPORT_ID}/positions?limit=100&expand=assortment`
  )
  const totalQty = (pos.rows || []).reduce((s, p) => s + Number(p.quantity), 0)

  console.log(`  Customer : ${rep.agent?.name}`)
  console.log(`  Report   : ${rep.name} | ${money(rep.sum)} AED | ${rep.state?.name || '—'}`)
  console.log(
    `  Period   : ${rep.commissionPeriodStart?.slice(0, 10)} … ${rep.commissionPeriodEnd?.slice(0, 10)}`
  )
  console.log(`  Lines    : ${(pos.rows || []).length} SKU / ${totalQty} pcs`)
  console.log(`  Paid     : ${money(rep.payedSum)} / ${money(rep.sum)} AED`)

  await exportPdf(REPORT_ID, PDF_PATH)

  console.log(`\n  PDF: ${PDF_PATH}`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${REPORT_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
