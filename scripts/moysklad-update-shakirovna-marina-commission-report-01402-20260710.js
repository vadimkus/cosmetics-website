#!/usr/bin/env node

/**
 * Shakirovna Marina — update commission report 01402 per Altegio refresh
 * 10.06.2026–09.07.2026: Hyaluron Cream 54458 ×2 → ×3 (+145 AED).
 *
 *   node --import dotenv/config scripts/moysklad-update-shakirovna-marina-commission-report-01402-20260710.js
 *   node --import dotenv/config scripts/moysklad-update-shakirovna-marina-commission-report-01402-20260710.js --commit
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

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const REPORT_NAME = '01402'
const REPORT_ID = 'f28aca51-79db-11f1-0a80-1f6400166305'
const HYALURON_CODE = '54458'
const HYALURON_POSITION_ID = 'f28ad33a-79db-11f1-0a80-1f6400166308'
const NEW_QTY = 3
const OLD_SUM_MINOR = 376800
const NEW_SUM_MINOR = 391300
const COMMISSION_PERIOD_END = '2026-07-09 23:59:59'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
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
  console.log('  Shakirovna Marina — update report 01402 (Altegio refresh)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const rep = await api('GET', `/entity/commissionreportin/${REPORT_ID}`)
  if (rep.name !== REPORT_NAME) throw new Error(`Expected ${REPORT_NAME}, got ${rep.name}`)

  const pos = await api(
    'GET',
    `/entity/commissionreportin/${REPORT_ID}/positions?limit=100&expand=assortment`
  )
  const hyaluron = (pos.rows || []).find((p) => p.assortment?.code === HYALURON_CODE)
  if (!hyaluron) throw new Error(`Line ${HYALURON_CODE} not found on ${REPORT_NAME}`)
  if (hyaluron.id !== HYALURON_POSITION_ID) {
    console.warn(`  WARN: position id ${hyaluron.id} differs from script constant`)
  }

  console.log(`  Report : ${rep.name} | ${money(rep.sum)} AED → ${money(NEW_SUM_MINOR)} AED`)
  console.log(
    `  Change : ${HYALURON_CODE} qty ${hyaluron.quantity} → ${NEW_QTY} @ ${money(hyaluron.price)}`
  )
  console.log(`  Period end: ${rep.commissionPeriodEnd?.slice(0, 10)} → ${COMMISSION_PERIOD_END.slice(0, 10)}`)

  const totalQty = (pos.rows || []).reduce((s, p) => s + Number(p.quantity), 0) + (NEW_QTY - hyaluron.quantity)
  console.log(`  Total qty: ${totalQty} pcs (was ${totalQty - 1})`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await api('PUT', `/entity/commissionreportin/${REPORT_ID}/positions/${hyaluron.id}`, {
    meta: hyaluron.meta,
    quantity: NEW_QTY,
    price: hyaluron.price,
    reward: hyaluron.reward ?? 0,
    assortment: { meta: hyaluron.assortment.meta },
    vat: hyaluron.vat,
    vatEnabled: hyaluron.vatEnabled,
  })

  await api('PUT', `/entity/commissionreportin/${REPORT_ID}`, {
    meta: rep.meta,
    commissionPeriodEnd: COMMISSION_PERIOD_END,
    description: [
      rep.description?.split('\n')[0] || 'SHAKIROVNA-MARINA-CONSIGNMENT-SOLD-ALTEGIO-2026-07-07',
      'Shakirovna Beauty Center Dubai Marina — Altegio sales analysis 10.06.2026–09.07.2026 (updated 10.07.2026).',
      '17 product rows / 35 pcs. Hyaluron Cream 54458 corrected ×3 (was ×2). Report only — no отгрузка yet.',
      'Altegio 25g algae → 00140 (23g). Peptide 38g → 00012 (39g).',
    ].join('\n'),
  })

  const rep2 = await api('GET', `/entity/commissionreportin/${REPORT_ID}`)
  if (Math.abs((rep2.sum || 0) - NEW_SUM_MINOR) > 1) {
    console.warn(`  WARN: sum ${money(rep2.sum)} AED, expected ${money(NEW_SUM_MINOR)}`)
  }

  const pdfPath = path.join(ORDERS_DIR, 'GENOSYS_Shakirovna_Marina_Consignment_Sales_01402.pdf')
  await exportPdf(REPORT_ID, pdfPath)

  console.log(`\n  Updated: ${rep2.name} | ${money(rep2.sum)} AED | ${totalQty} pcs`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${REPORT_ID}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
