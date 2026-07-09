#!/usr/bin/env node

/**
 * BROW AND BEAUTY — counterparty field layout → Face Room pattern.
 *
 * Face Room:
 *   email + fax = trade license #
 *   legalAddress / actualAddress / addInfo = street address
 *   legalAddressFull.comment = VAT TRN (omit when no TRN)
 *
 *   node --import dotenv/config scripts/moysklad-update-brow-beauty-counterparty-face-room-20260706.js
 *   node --import dotenv/config scripts/moysklad-update-brow-beauty-counterparty-face-room-20260706.js --commit
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

const AGENT_ID = '30c42b43-7913-11f1-0a80-04b600753af5'
const ORDER_ID = '31dc1301-7913-11f1-0a80-1e2300783264'
const ORDER_NAME = 'GENCardM260706BBAC'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const ADDRESS = 'Villa No. 266, Jumeira First, Dubai'
const LICENSE_NO = '1582255'
const CONTACT_EMAIL = 'jdurazov@gmail.com'
const DCCI_NO = '659950'
const REGISTER_NO = '2770128'

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
    throw new Error(`Order export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  Brow and Beauty — Face Room counterparty layout + PDF refresh')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log('  Before:')
  console.log(`    email : ${cp.email}`)
  console.log(`    fax   : ${cp.fax}`)
  console.log(`    legal : ${cp.legalAddress}`)
  console.log(`    actual: ${cp.actualAddress}`)
  console.log(`    comment: ${cp.legalAddressFull?.comment || '—'}`)

  const payload = {
    meta: cp.meta,
    name: cp.name,
    companyType: 'legal',
    phone: cp.phone || '+971585717075',
    email: LICENSE_NO,
    fax: LICENSE_NO,
    legalAddress: ADDRESS,
    actualAddress: ADDRESS,
    legalAddressFull: {
      addInfo: ADDRESS,
      street: '',
      city: '',
      comment: '',
    },
    actualAddressFull: {
      addInfo: ADDRESS,
      street: '',
      city: '',
      comment: '',
    },
    description: [
      cp.description || '',
      `Contact email: ${CONTACT_EMAIL}. DCCI ${DCCI_NO}. Register ${REGISTER_NO}.`,
      `Face Room field layout applied ${uaeToday()}. No VAT TRN on license.`,
    ]
      .filter(Boolean)
      .join(' | '),
  }

  console.log('\n  After (Face Room pattern):')
  console.log(`    email  → ${LICENSE_NO} (License # on template)`)
  console.log(`    fax    → ${LICENSE_NO}`)
  console.log(`    address→ ${ADDRESS}`)
  console.log(`    TRN    → (empty — not VAT registered)`)
  console.log(`    contact→ ${CONTACT_EMAIL} (description only)`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, payload)
  console.log(`\n  Updated counterparty: ${updated.id}`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    shipmentAddressFull: {
      addInfo: ADDRESS,
      street: '',
      city: '',
    },
  })
  console.log('  Updated order shipment address')

  console.log('\n  Re-exporting PROFORMA PDF...')
  const buf = await exportOrderPdf(ORDER_ID)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const pdfPath = path.join(ORDERS_DIR, `GENOSYS_Brow_and_Beauty_${ORDER_NAME}.pdf`)
  fs.writeFileSync(pdfPath, buf)
  console.log(`  Saved: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
