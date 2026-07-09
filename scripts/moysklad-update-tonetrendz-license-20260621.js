#!/usr/bin/env node

/**
 * TONETRENDZ — set commercial license on counterparty (Face Room pattern).
 *
 * Face Room: license in email + fax (stock note template prints License # from contact.faxes).
 * TRN not set — salon not VAT registered yet.
 *
 *   node --import dotenv/config scripts/moysklad-update-tonetrendz-license-20260621.js
 *   node --import dotenv/config scripts/moysklad-update-tonetrendz-license-20260621.js --commit
 *   node --import dotenv/config scripts/moysklad-update-tonetrendz-license-20260621.js --commit --pdf
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
const EXPORT_PDF = process.argv.includes('--pdf')

const AGENT_ID = '74aa75cb-63db-11f1-0a80-111d001bbe72'
const DEMAND_ID = '7b63d1d7-63dc-11f1-0a80-0d66001d1a9f' // 06326
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const LICENSE_NO = '1626587'
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

async function exportStockNotePdf(demandId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/demand/metadata/customtemplate/${STOCK_NOTE_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/demand/${demandId}/export`, {
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
    throw new Error(`Stock note export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  TONETRENDZ — license field update (Face Room pattern)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${cp.name}`)
  console.log(`  Current email: ${cp.email || '—'}`)
  console.log(`  Current fax  : ${cp.fax || '—'} (License # on stock note)`)
  console.log(`  Target license: ${LICENSE_NO}`)

  const needsEmail = cp.email !== LICENSE_NO
  const needsFax = cp.fax !== LICENSE_NO

  if (!needsEmail && !needsFax) {
    console.log('\n  Already set — no counterparty update needed.')
  } else if (!COMMIT) {
    console.log('\n  Would set email + fax →', LICENSE_NO)
    console.log('  DRY RUN — re-run with --commit')
  } else {
    const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
      meta: cp.meta,
      email: LICENSE_NO,
      fax: LICENSE_NO,
    })
    console.log(`\n  Updated email: ${updated.email}`)
    console.log(`  Updated fax  : ${updated.fax}`)
    console.log(`  UI: https://online.moysklad.ru/app/#company/edit?id=${AGENT_ID}`)
  }

  if (EXPORT_PDF || COMMIT) {
    if (!COMMIT) {
      console.log('\n  (--pdf with --commit will regenerate stock note)')
      return
    }
    console.log('\n  Regenerating consignment stock note PDF…')
    const pdfBuf = await exportStockNotePdf(DEMAND_ID)
    fs.mkdirSync(ORDERS_DIR, { recursive: true })
    const outPath = path.join(ORDERS_DIR, 'GENOSYS_TONETRENDZ_06326_Consignment_Stock_Note.pdf')
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`  PDF: ${outPath} (${pdfBuf.length} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
