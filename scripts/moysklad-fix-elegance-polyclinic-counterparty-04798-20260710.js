#!/usr/bin/env node

/**
 * Elegance Polyclinic — website push landed on Modern Medicine Medical Center.
 * Reassign agent on order / invoice / shipment / paymentin, export Legal_TAX PDF, print landscape.
 *
 *   node --import dotenv/config scripts/moysklad-fix-elegance-polyclinic-counterparty-04798-20260710.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
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

const ELEGANCE_ID = '0aa74b9b-7788-11f0-0a80-19f100131e18'
const WRONG_ID = '828e65df-4b4a-11ef-0a80-159e002bdea0'

const DOCS = [
  { type: 'customerorder', id: '64efe9fb-7c6d-11f1-0a80-0ee100214d2e', label: 'Order GENCardM2607107457' },
  { type: 'invoiceout', id: '6531d937-7c6d-11f1-0a80-14c7002172ab', label: 'Invoice 04798' },
  { type: 'demand', id: '65d2f667-7c6d-11f1-0a80-0ee100214d77', label: 'Shipment 06517' },
  { type: 'paymentin', id: '6645d5cf-7c6d-11f1-0a80-115700216a6c', label: 'Paymentin 05914' },
]

const INVOICE_ID = '6531d937-7c6d-11f1-0a80-14c7002172ab'
const INVOICE_NAME = '04798'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

function agentMeta(counterpartyId) {
  return {
    meta: {
      href: `${API}/entity/counterparty/${counterpartyId}`,
      type: 'counterparty',
      mediaType: 'application/json',
    },
  }
}

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
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Elegance_Polyclinic_${invoiceName}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Elegance Polyclinic — counterparty fix + invoice 04798 legal PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const elegance = await api('GET', `/entity/counterparty/${ELEGANCE_ID}`)
  const wrong = await api('GET', `/entity/counterparty/${WRONG_ID}`)
  console.log(`  Wrong agent  : ${wrong.name} (${WRONG_ID})`)
  console.log(`  Correct agent: ${elegance.name} (${ELEGANCE_ID})`)
  console.log(`  License/email: ${elegance.email || '—'}\n`)

  for (const doc of DOCS) {
    const current = await api('GET', `/entity/${doc.type}/${doc.id}?expand=agent`)
    const agentId = current.agent?.meta?.href?.split('/').pop()
    const agentName = current.agent?.name || agentId
    console.log(`  ${doc.label}: agent = ${agentName}`)
    if (agentId === ELEGANCE_ID) {
      console.log('    already Elegance — skip')
      continue
    }
    if (!COMMIT) {
      console.log(`    would reassign → ${elegance.name}`)
      continue
    }
    const updated = await api('PUT', `/entity/${doc.type}/${doc.id}`, {
      meta: current.meta,
      agent: agentMeta(ELEGANCE_ID),
    })
    const newId = updated.agent?.meta?.href?.split('/').pop()
    console.log(`    updated → ${updated.agent?.name || newId}`)
  }

  if (!COMMIT) {
    console.log('\n  Would export Genosys_Invoice_Legal_TAX → ~/Desktop/orders/GENOSYS_Elegance_Polyclinic_04798.pdf')
    console.log('  Would print landscape (lp orientation-requested=4)')
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  console.log('\n  Exporting invoice PDF (Genosys_Invoice_Legal_TAX)...')
  const pdfPath = await exportInvoicePdf(INVOICE_ID, INVOICE_NAME)
  if (pdfPath) {
    console.log(`    Saved: ${pdfPath}`)
    printPdfLandscape(pdfPath)
  }

  const inv = await api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=agent`)
  console.log(`\n  Verified invoice agent: ${inv.agent?.name}`)
  console.log(`  https://online.moysklad.ru/app/#invoiceout/edit?id=${INVOICE_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
