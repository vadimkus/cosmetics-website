#!/usr/bin/env node

/**
 * Shakirovna Marina — add 2 Sep spreadsheet onto unpaid sales report 01440.
 *
 * Same 6 SKUs as the 27 Aug sheet. Combine into one open report (no new report).
 * 1,072 → 2,144 AED. 10 → 20 pcs.
 *
 *   node --import dotenv/config scripts/moysklad-amend-shakirovna-marina-01440-add-sheet-20260902.js
 *   node --import dotenv/config scripts/moysklad-amend-shakirovna-marina-01440-add-sheet-20260902.js --commit
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

const REPORT_ID = '8c0a3995-a1e8-11f1-0a80-087b005afcb7'
const REPORT_NAME = '01440'
const AGENT_ID = '93775ae5-d18d-11ea-0a80-02e00008417d'
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb'
const TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

/** extra qty to add (clinic unit prices already on the report) */
const ADD = {
  '00190': 1,
  '00194': 1,
  '00189': 2,
  '00144': 1,
  '54467': 1,
  '00140': 4,
}

const OLD_SUM_MINOR = 107200
const NEW_SUM_MINOR = 214400
const NEW_QTY = 20

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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

async function exportPdf(reportId, reportName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/customtemplate/${TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/commissionreportin/${reportId}/export`, {
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
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(reportName).replace(/[^\w.-]+/g, '_')
  const out = path.join(ORDERS_DIR, `GENOSYS_Shakirovna_Marina_Consignment_Sales_${safe}.pdf`)
  fs.writeFileSync(out, Buffer.from(await pdfRes.arrayBuffer()))
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Marina — add 2 Sep sheet onto 01440')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const report = await api(
    'GET',
    `/entity/commissionreportin/${REPORT_ID}?expand=agent,contract,state`,
  )
  if (report.name !== REPORT_NAME) throw new Error(`Expected ${REPORT_NAME}, got ${report.name}`)
  if (report.agent?.id !== AGENT_ID) throw new Error(`Unexpected agent: ${report.agent?.name}`)
  if (report.contract?.id !== CONTRACT_ID) throw new Error(`Unexpected contract`)
  if ((report.payedSum || 0) !== 0) throw new Error(`Report already paid: ${money(report.payedSum)}`)
  if (report.sum !== OLD_SUM_MINOR) {
    throw new Error(`Expected current sum ${money(OLD_SUM_MINOR)}, got ${money(report.sum)}`)
  }

  const pos = await api(
    'GET',
    `/entity/commissionreportin/${REPORT_ID}/positions?limit=100&expand=assortment`,
  )
  const rows = pos.rows || []
  const byCode = new Map(rows.map((p) => [p.assortment?.code, p]))

  let newQty = 0
  console.log(`  Report: ${report.name} | ${money(report.sum)} | ${report.state?.name}`)
  for (const [code, addQty] of Object.entries(ADD)) {
    const line = byCode.get(code)
    if (!line) throw new Error(`Missing line ${code} on ${REPORT_NAME}`)
    const next = Number(line.quantity) + addQty
    newQty += next
    console.log(`    ${code} ${line.assortment.name.slice(0, 48)} ${line.quantity} + ${addQty} → ${next}`)
  }
  if (newQty !== NEW_QTY) throw new Error(`Qty ${newQty} ≠ ${NEW_QTY}`)

  if (!COMMIT) {
    console.log(`  After: ${money(NEW_SUM_MINOR)} AED / ${NEW_QTY} pcs`)
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  for (const [code, addQty] of Object.entries(ADD)) {
    const line = byCode.get(code)
    const next = Number(line.quantity) + addQty
    await api('PUT', `/entity/commissionreportin/${REPORT_ID}/positions/${line.id}`, {
      meta: line.meta,
      quantity: next,
      price: line.price,
      reward: line.reward ?? 0,
      assortment: { meta: line.assortment.meta },
      vat: line.vat,
      vatEnabled: line.vatEnabled,
    })
  }

  await api('PUT', `/entity/commissionreportin/${REPORT_ID}`, {
    meta: report.meta,
    commissionPeriodEnd: `${uaeToday()} 23:59:59`,
    description: [
      report.description || '',
      `Combined 2026-09-02 spreadsheet (same 6 SKUs) into this open report. ${NEW_QTY} pcs / ${money(NEW_SUM_MINOR)} AED.`,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const [after, afterPos] = await Promise.all([
    api('GET', `/entity/commissionreportin/${REPORT_ID}`),
    api('GET', `/entity/commissionreportin/${REPORT_ID}/positions?limit=100&expand=assortment`),
  ])
  if (after.sum !== NEW_SUM_MINOR) {
    throw new Error(`Posted sum ${money(after.sum)} ≠ ${money(NEW_SUM_MINOR)}`)
  }
  const qty = (afterPos.rows || []).reduce((s, p) => s + Number(p.quantity), 0)
  if (qty !== NEW_QTY) throw new Error(`Posted qty ${qty} ≠ ${NEW_QTY}`)

  const pdfPath = await exportPdf(REPORT_ID, after.name)
  console.log(`\n  Updated: ${after.name} | ${money(after.sum)} AED | ${qty} pcs`)
  console.log(`  PDF: ${pdfPath}`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${REPORT_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
