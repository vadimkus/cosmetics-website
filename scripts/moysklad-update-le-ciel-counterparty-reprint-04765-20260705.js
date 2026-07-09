#!/usr/bin/env node

/**
 * Le Ciel — update counterparty from commercial license + reprint invoice 04765.
 *
 * License 1612620 (issued 13/03/2026, exp 12/03/2027)
 * Legal name: LE CIEL BEAUTY SPOT Perfumes & Cosmetics Trading CO. L.L.C S.O.C
 * DCCI 678077 | Register 2833003
 *
 *   node --import dotenv/config scripts/moysklad-update-le-ciel-counterparty-reprint-04765-20260705.js
 *   node --import dotenv/config scripts/moysklad-update-le-ciel-counterparty-reprint-04765-20260705.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')
const { uaeToday } = require('./lib/moysklad-uae-date')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const AGENT_ID = 'd28b9ecf-44c0-11ef-0a80-0379001bda44'
const INVOICE_ID = 'aeced665-7841-11f1-0a80-1a69005310da'
const INVOICE_NAME = '04765'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const LEGAL_NAME = 'LE CIEL BEAUTY SPOT Perfumes & Cosmetics Trading CO. L.L.C S.O.C'
const LICENSE_NO = '1612620'
const OLD_LICENSE_NO = '784011'
const DCCI_NO = '678077'
const REGISTER_NO = '2833003'

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function exportInvoicePdf(invoiceId, invoiceName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_LEGAL_TAX_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Le_Ciel_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Le Ciel — counterparty update + invoice 04765 PDF refresh')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log('  Current counterparty:')
  console.log(`    Name     : ${cp.name}`)
  console.log(`    Phone    : ${cp.phone || '—'}`)
  console.log(`    Email    : ${cp.email || '—'}`)
  console.log(`    Fax      : ${cp.fax || '—'} (license on templates)`)
  console.log(`    LegalAddr: ${cp.legalAddress || '—'}`)
  console.log(`    Actual   : ${cp.actualAddress || '—'}`)
  console.log(`    legalAddressFull.addInfo : ${cp.legalAddressFull?.addInfo || '—'}`)
  console.log(`    actualAddressFull.comment: ${cp.actualAddressFull?.comment || '—'}`)

  console.log('\n  Target (commercial license 1612620):')
  console.log(`    Name     : ${LEGAL_NAME}`)
  console.log(`    License  : ${LICENSE_NO} (was ${OLD_LICENSE_NO})`)
  console.log(`    DCCI     : ${DCCI_NO}`)
  console.log(`    Register : ${REGISTER_NO}`)

  const actualFull = cp.actualAddressFull || {}
  const street = actualFull.addInfo || cp.actualAddress || 'Al Wasl Rd, Block A, 1107'

  const payload = {
    meta: cp.meta,
    name: LEGAL_NAME,
    companyType: 'legal',
    email: LICENSE_NO,
    fax: LICENSE_NO,
    legalAddress: LICENSE_NO,
    actualAddress: street,
    legalAddressFull: {
      ...(cp.legalAddressFull || {}),
      addInfo: LICENSE_NO,
      comment: `DCCI ${DCCI_NO} | Reg ${REGISTER_NO}`,
    },
    actualAddressFull: {
      ...actualFull,
      addInfo: street,
      comment: LICENSE_NO,
    },
    description: [
      cp.description || '',
      `Trade license ${LICENSE_NO} (exp 12/03/2027). DCCI ${DCCI_NO}. Register ${REGISTER_NO}.`,
      `Renamed from Le Bleu Ciel Ladies Beauty Salon per license ${uaeToday()}.`,
    ]
      .filter(Boolean)
      .join(' | '),
  }

  if (!COMMIT) {
    console.log('\n  Would update counterparty fields above.')
    console.log('  Would re-export invoice 04765 → ~/Desktop/orders/GENOSYS_Le_Ciel_04765.pdf')
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, payload)
  console.log('\n  Updated counterparty:')
  console.log(`    Name : ${updated.name}`)
  console.log(`    Email: ${updated.email}`)
  console.log(`    Fax  : ${updated.fax}`)
  console.log(`    https://online.moysklad.ru/app/#company/edit?id=${AGENT_ID}`)

  console.log('\n  Re-exporting invoice PDF (Genosys_Invoice_Legal_TAX)...')
  const pdfPath = await exportInvoicePdf(INVOICE_ID, INVOICE_NAME)
  if (pdfPath) {
    console.log(`    Saved: ${pdfPath}`)
    try {
      execFileSync('lp', ['-o', 'orientation-requested=4', pdfPath], { stdio: 'inherit' })
      console.log('    Sent to printer (landscape)')
    } catch (e) {
      console.warn('    lp failed, opening PDF:', e.message)
      execFileSync('open', [pdfPath], { stdio: 'inherit' })
    }
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
