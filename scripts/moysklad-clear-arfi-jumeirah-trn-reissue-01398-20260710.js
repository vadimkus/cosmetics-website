#!/usr/bin/env node

/**
 * ARFI Nails Jumeirah — remove VAT TRN + reissue consignment sales PDF (01398).
 *
 *   node --import dotenv/config scripts/moysklad-clear-arfi-jumeirah-trn-reissue-01398-20260710.js
 *   node --import dotenv/config scripts/moysklad-clear-arfi-jumeirah-trn-reissue-01398-20260710.js --commit
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

const AGENT_ID = 'dc883e47-f051-11f0-0a80-0f7100059e21' // ARFI NAILS BEAUTY SALON 2 (Jumeirah)
const REPORT_ID = '511f797b-76a7-11f1-0a80-1c6d000ed67c' // 01398
const REPORT_NAME = '01398'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function exportPdf(entityType, entityId, templateId, outPath) {
  const res = await fetch(`${API}/entity/${entityType}/${entityId}/export`, {
    method: 'POST',
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template: {
        meta: {
          href: `${API}/entity/${entityType}/metadata/customtemplate/${templateId}`,
          type: 'customtemplate',
          mediaType: 'application/json',
        },
      },
      extension: 'pdf',
    }),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
  return { out: outPath, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  ARFI Jumeirah — clear TRN + reissue consignment sales 01398')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${cp.name}`)
  console.log(`  email : ${cp.email || '—'}`)
  console.log(`  fax   : ${cp.fax || '—'}`)
  console.log(`  TRN   : ${cp.legalAddressFull?.comment || '(blank)'}`)

  const legalAddressFull = {
    ...(cp.legalAddressFull || {}),
    comment: '',
  }

  if (cp.legalAddressFull?.comment) {
    console.log('\n  Will clear legalAddressFull.comment (TRN blank on invoices)')
  } else {
    console.log('\n  TRN already blank')
  }

  if (!COMMIT) {
    console.log(`\n  Would re-export: GENOSYS_ARFI_Nails_Jumeirah_Consignment_Sales_${REPORT_NAME}.pdf`)
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (cp.legalAddressFull?.comment) {
    const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
      meta: cp.meta,
      email: cp.email,
      fax: cp.fax,
      legalAddressFull,
    })
    console.log(`\n  TRN cleared: ${updated.legalAddressFull?.comment || '(blank)'}`)
  }

  const report = await api('GET', `/entity/commissionreportin/${REPORT_ID}`)
  console.log(`\n  Report: ${report.name} | ${(report.sum || 0) / 100} AED`)

  const outPath = path.join(
    ORDERS_DIR,
    `GENOSYS_ARFI_Nails_Jumeirah_Consignment_Sales_${REPORT_NAME}.pdf`
  )
  console.log('  Re-exporting consignment sales PDF...')
  const pdf = await exportPdf('commissionreportin', REPORT_ID, CONSIGNMENT_SALES_TEMPLATE_ID, outPath)
  console.log(`  Saved: ${pdf.out} (${pdf.bytes} bytes)`)
  console.log(`  TRN blank refresh ${uaeToday()}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
