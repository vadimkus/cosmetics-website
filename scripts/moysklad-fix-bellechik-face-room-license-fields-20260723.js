#!/usr/bin/env node

/**
 * BELLECHIK — apply Face Room counterparty field layout + refresh SO proforma.
 *
 * Face Room pattern:
 *   email + fax = trade license #
 *   contact email stays in description only
 *
 *   node --import dotenv/config scripts/moysklad-fix-bellechik-face-room-license-fields-20260723.js
 *   node --import dotenv/config scripts/moysklad-fix-bellechik-face-room-license-fields-20260723.js --commit
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

const AGENT_ID = 'd1188152-8683-11f1-0a80-19f900173b12'
const ORDER_ID = 'd2189bc5-8683-11f1-0a80-105f0017c014'
const ORDER_NAME = 'GENCardM260723BLCH'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const LICENSE_NO = '1488245'
const CONTACT_EMAIL = 'Sadatmonajaty@gmail.com'
const ADDRESS = 'Sohum Wellness Sanctuary, Al Quoz 1, First floor, Bellechik Beauty Salon, Dubai'

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

async function exportOrderPdf(orderId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/customerorder/metadata/customtemplate/${ORDER_PROFORMA_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/customerorder/${orderId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  BELLECHIK — Face Room license fields + SO PDF refresh')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log('  Before:')
  console.log(`    email : ${cp.email || '—'}`)
  console.log(`    fax   : ${cp.fax || '—'}`)

  console.log('\n  After (Face Room pattern):')
  console.log(`    email  → ${LICENSE_NO}`)
  console.log(`    fax    → ${LICENSE_NO}`)
  console.log(`    contact→ ${CONTACT_EMAIL} (description only)`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    meta: cp.meta,
    name: cp.name,
    companyType: 'legal',
    phone: '+971563717434',
    email: LICENSE_NO,
    fax: LICENSE_NO,
    legalAddress: ADDRESS,
    actualAddress: ADDRESS,
    legalAddressFull: { addInfo: ADDRESS, street: '', city: '', comment: '' },
    actualAddressFull: { addInfo: ADDRESS, street: '', city: '', comment: '' },
    description: [
      'Clinic customer — BELLECHIK LADIES SALON L.L.C',
      `DED license ${LICENSE_NO} | Register 2568245 | DCCI 606962`,
      `Contact email: ${CONTACT_EMAIL}`,
      'Face Room field layout: email+fax = trade license #. No VAT TRN on license.',
    ].join(' | '),
  })
  console.log('\n  Counterparty updated')

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    shipmentAddressFull: { addInfo: ADDRESS, street: '', city: '' },
  })

  const buf = await exportOrderPdf(ORDER_ID)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const pdfPath = path.join(ORDERS_DIR, `GENOSYS_BELLECHIK_${ORDER_NAME}.pdf`)
  fs.writeFileSync(pdfPath, buf)
  console.log(`  PDF refreshed: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
