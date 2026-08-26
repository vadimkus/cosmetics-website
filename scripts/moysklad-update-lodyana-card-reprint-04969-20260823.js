#!/usr/bin/env node

/**
 * LODY ANA.SPA. LLC — fill card from receiver info + reprint INV 04969.
 *
 *   Miss LIZA · +971 55 653 4118
 *   Al Sahel Towers, Block A, 1st Floor, Al Bateen W12
 *   office LODYana Ladies Spa · Al Khalidiya, Abu Dhabi
 *
 *   node --import dotenv/config scripts/moysklad-update-lodyana-card-reprint-04969-20260823.js
 *   node --import dotenv/config scripts/moysklad-update-lodyana-card-reprint-04969-20260823.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')
const { printPdfLandscape } = require('./lib/moysklad-print-pdf')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const AGENT_ID = '5746700f-455a-11f1-0a80-03c5003a244c'
const ORDER_ID = '90bfd901-9eec-11f1-0a80-1eb700920c73'
const INVOICE_ID = '3a0b1200-9f26-11f1-0a80-136000a0b084'
const INVOICE_NAME = '04969'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const PHONE = '+971556534118'
const CONTACT = 'Miss LIZA'
const STREET = 'Al Sahel Towers, Block A, 1st Floor, Al Bateen W12, office LODYana Ladies Spa'
const CITY = 'Abu Dhabi'

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
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

function addressFull() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: CITY,
    street: STREET,
    addInfo: '',
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
  const out = path.join(ORDERS_DIR, `GENOSYS_LODYANA_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const invoice = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  if (!/lody\s*ana\.spa/i.test(agent.name || '')) throw new Error(`Unexpected agent ${agent.name}`)
  if (invoice.name !== INVOICE_NAME) throw new Error(`Unexpected invoice ${invoice.name}`)

  console.log('====================================================================')
  console.log('  LODY ANA.SPA. LLC — card + reprint 04969')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Phone was: ${agent.phone || '—'}`)
  console.log(`  Actual was: ${agent.actualAddress || '—'}`)
  console.log(`  Now: ${CONTACT} ${PHONE}`)
  console.log(`  Ship: ${STREET}, ${CITY}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const full = addressFull()
  await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    meta: agent.meta,
    name: 'LODY ANA.SPA. LLC',
    companyType: 'legal',
    phone: PHONE,
    actualAddress: `${STREET}, ${CITY}, UAE`,
    legalAddress: `${STREET}, ${CITY}, UAE`,
    actualAddressFull: full,
    legalAddressFull: full,
    description: [
      'LODYana Ladies Spa, Al Sahel Towers Block A, Al Khalidiya, Abu Dhabi.',
      `Receiver ${CONTACT}. Phone ${PHONE}.`,
      'Al Bateen W12, 1st Floor.',
    ].join(' '),
  })

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    shipmentAddressFull: full,
  })
  await api('PUT', `/entity/invoiceout/${INVOICE_ID}`, {
    meta: invoice.meta,
    shipmentAddressFull: full,
  })

  const after = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Phone now: ${after.phone}`)
  console.log(`  Actual now: ${after.actualAddress}`)
  console.log(`  addInfo: ${after.actualAddressFull?.addInfo || '(empty)'}`)

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`  PDF: ${pdfPath}`)
  try {
    printPdfLandscape(pdfPath)
    console.log('  Printed landscape (orientation-requested=4)')
  } catch (e) {
    console.error(`  Print failed: ${e.message}`)
    execFileSync('open', [pdfPath], { stdio: 'inherit' })
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
