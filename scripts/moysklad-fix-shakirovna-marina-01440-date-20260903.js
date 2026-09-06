#!/usr/bin/env node

/**
 * Shakirovna Marina report 01440 — set document date to 31 Aug 2026, re-export PDF.
 *
 *   node --import dotenv/config scripts/moysklad-fix-shakirovna-marina-01440-date-20260903.js
 *   node --import dotenv/config scripts/moysklad-fix-shakirovna-marina-01440-date-20260903.js --commit
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

const REPORT_ID = '8c0a3995-a1e8-11f1-0a80-087b005afcb7'
const REPORT_NAME = '01440'
const TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const EXPECTED_SUM_MINOR = 214400
const NEW_MOMENT = '2026-08-31 23:59:00'
const NEW_PERIOD_END = '2026-08-31 23:59:59'

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
  console.log('  Shakirovna Marina 01440 — date → 31 Aug 2026')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const report = await api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=agent,state`)
  if (report.name !== REPORT_NAME) throw new Error(`Unexpected report ${report.name}`)
  if (!/shakirovna/i.test(report.agent?.name || '')) {
    throw new Error(`Unexpected agent: ${report.agent?.name}`)
  }
  if (report.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(report.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

  console.log(`  Report: ${report.name} | ${money(report.sum)} AED | ${report.state?.name}`)
  console.log(`  Agent: ${report.agent?.name}`)
  console.log(`  moment now: ${report.moment}`)
  console.log(`  period: ${report.commissionPeriodStart} → ${report.commissionPeriodEnd}`)
  console.log(`  moment new: ${NEW_MOMENT}`)
  console.log(`  period end new: ${NEW_PERIOD_END}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const updated = await api('PUT', `/entity/commissionreportin/${REPORT_ID}`, {
    meta: report.meta,
    moment: NEW_MOMENT,
    commissionPeriodEnd: NEW_PERIOD_END,
  })

  console.log(`  After: moment ${updated.moment}`)
  console.log(`  After: period ${updated.commissionPeriodStart} → ${updated.commissionPeriodEnd}`)
  if (!String(updated.moment).startsWith('2026-08-31')) {
    throw new Error(`Date did not stick: ${updated.moment}`)
  }

  const pdfPath = await exportPdf(REPORT_ID, updated.name)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
