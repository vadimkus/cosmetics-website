#!/usr/bin/env node

/**
 * Miss Zukhra Kabbara — clear leftover addInfo so Legal_TAX does not print the street twice.
 * Re-export INV 04953.
 *
 *   node --import dotenv/config scripts/moysklad-fix-zukhra-04953-address-dup-20260820.js
 *   node --import dotenv/config scripts/moysklad-fix-zukhra-04953-address-dup-20260820.js --commit
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

const AGENT_ID = 'a9077506-505d-11f1-0a80-0fd30010b5cb'
const INVOICE_ID = '1ee164f7-9c64-11f1-0a80-084e001760b0'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const STREET = 'Al Salam Tower, office 36th floor, Metropolitan'
const CITY = 'Dubai'

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
  const out = path.join(ORDERS_DIR, `GENOSYS_Miss_Zukhra_Kabbara_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const invoice = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  if (agent.name !== 'Miss Zukhra Kabbara') throw new Error(`Unexpected agent ${agent.name}`)
  if (invoice.name !== '04953') throw new Error(`Unexpected invoice ${invoice.name}`)

  console.log('====================================================================')
  console.log('  Zukhra — clear addInfo duplicate, reissue 04953')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  actualAddress was: ${agent.actualAddress}`)
  console.log(`  addInfo was: ${agent.actualAddressFull?.addInfo || '—'}`)
  console.log(`  Now: UAE, ${CITY}, ${STREET}  (addInfo empty)`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const full = addressFull()
  await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    meta: agent.meta,
    name: agent.name,
    phone: agent.phone,
    actualAddress: `UAE, ${CITY}, ${STREET}`,
    legalAddress: `UAE, ${CITY}, ${STREET}`,
    actualAddressFull: full,
    legalAddressFull: full,
  })

  const after = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  actualAddress now: ${after.actualAddress}`)
  console.log(`  addInfo now: ${after.actualAddressFull?.addInfo || '(empty)'}`)

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
