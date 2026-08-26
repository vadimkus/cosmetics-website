#!/usr/bin/env node

/**
 * TVC — add DET license 1177343 (Face Room layout) and reissue invoice 04961.
 *
 *   email + fax = 1177343
 *   name = T V C BEAUTY SALON L.L.C
 *   legal address = license premises (Office P30a, Dubai Marina)
 *   actual / ship stay Bahar 4 JBR
 *   no VAT TRN on license
 *
 *   node --import dotenv/config scripts/moysklad-update-tvc-license-reissue-04961-20260821.js
 *   node --import dotenv/config scripts/moysklad-update-tvc-license-reissue-04961-20260821.js --commit
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

const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const AGENT_ID = 'f50e0d33-9d68-11f1-0a80-05a90031c4db'
const INVOICE_ID = 'f7fc8c22-9d68-11f1-0a80-0cc800334db6'
const INVOICE_NAME = '04961'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const LEGAL_NAME = 'T V C BEAUTY SALON L.L.C'
const LICENSE_NO = '1177343'
const DCCI_NO = '456376'
const REGISTER_NO = '1961372'
const CONTACT_EMAIL = 'tvc.beauty.salon@gmail.com'
const LICENSE_MOBILE = '+971 50 494 5613'
const OWNER = 'Tatiana Vasileva'
const LEGAL_ADDRESS = 'Office No. P30a, Real Estate Investment Free Zone LLC, Dubai Marina'
const SALON_STREET = 'Bahar 4, The Walk, Jumeirah Beach Residence'
const SALON_PHONE = '+971 56 501 0090'

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
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const out = path.join(ORDERS_DIR, `GENOSYS_TVC_Beauty_Salon_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  TVC — DET license 1177343 + reissue invoice 04961')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const inv = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  if (inv.name !== INVOICE_NAME) throw new Error(`Unexpected invoice ${inv.name}`)

  console.log('  Before:')
  console.log(`    name   : ${cp.name}`)
  console.log(`    email  : ${cp.email || '—'}`)
  console.log(`    fax    : ${cp.fax || '—'}`)
  console.log(`    legal  : ${cp.legalAddress || '—'}`)
  console.log(`    actual : ${cp.actualAddress || '—'}`)
  console.log(`    comment: ${cp.legalAddressFull?.comment || '—'}`)

  const payload = {
    meta: cp.meta,
    name: LEGAL_NAME,
    companyType: 'legal',
    phone: SALON_PHONE,
    email: LICENSE_NO,
    fax: LICENSE_NO,
    legalAddress: LEGAL_ADDRESS,
    actualAddress: `${SALON_STREET}, Dubai, UAE`,
    legalAddressFull: {
      addInfo: LEGAL_ADDRESS,
      comment: '',
    },
    actualAddressFull: {
      country: href('country', COUNTRY_UAE_ID),
      city: 'Dubai',
      street: SALON_STREET,
      addInfo: '',
    },
    description: [
      `Women salon. Owner/manager ${OWNER} (100%).`,
      `DET license ${LICENSE_NO} issued 24/04/2023 exp 23/04/2027.`,
      `DCCI ${DCCI_NO}. Register ${REGISTER_NO}.`,
      `Contact ${CONTACT_EMAIL}. License mobile ${LICENSE_MOBILE}. Salon ${SALON_PHONE}.`,
      `Legal: ${LEGAL_ADDRESS}. Salon/ship: ${SALON_STREET}, Dubai.`,
      `Face Room layout applied ${uaeToday()}. No VAT TRN on license.`,
    ].join(' | '),
  }

  console.log('\n  After:')
  console.log(`    name   → ${LEGAL_NAME}`)
  console.log(`    email  → ${LICENSE_NO}`)
  console.log(`    fax    → ${LICENSE_NO}`)
  console.log(`    legal  → ${LEGAL_ADDRESS}`)
  console.log(`    actual → ${SALON_STREET}, Dubai`)
  console.log(`    TRN    → (empty)`)
  console.log(`    ship   → stays ${SALON_STREET}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, payload)
  if (updated.name !== LEGAL_NAME) throw new Error(`Name not saved: ${updated.name}`)
  if (updated.email !== LICENSE_NO || updated.fax !== LICENSE_NO) {
    throw new Error(`License not saved on email/fax: ${updated.email} / ${updated.fax}`)
  }
  console.log(`\n  Updated: ${updated.name}`)
  console.log(`    email : ${updated.email}`)
  console.log(`    fax   : ${updated.fax}`)

  const pdfPath = await exportInvoicePdf(INVOICE_ID, INVOICE_NAME)
  console.log(`  PDF: ${pdfPath}`)
  console.log(`  Customer: https://online.moysklad.ru/app/#company/edit?id=${AGENT_ID}`)
  console.log(`  Invoice:  https://online.moysklad.ru/app/#invoiceout/edit?id=${INVOICE_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
