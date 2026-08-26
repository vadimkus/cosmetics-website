#!/usr/bin/env node

/**
 * Bianco Cedre GENCardM260818CEDRE / inv 04941 / ship 06697
 * Add EZ CO₂ mask box 00011 ×3 @ 230. Re-export Legal_TAX → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-amend-bianco-cedre-04941-ez-mask-20260818.js
 *   node --import dotenv/config scripts/moysklad-amend-bianco-cedre-04941-ez-mask-20260818.js --commit
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

const ORDER_ID = 'bc4a7afa-9ad6-11f1-0a80-0cbb00208e84'
const INVOICE_ID = 'bcbcdbce-9ad6-11f1-0a80-083f001fd016'
const DEMAND_ID = 'be504f80-9ad6-11f1-0a80-01f4001f8bd2'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const ADD_CODE = '00011'
const ADD_QTY = 3
const ADD_AED = 230
const EXPECTED_SUM_MINOR = 257000

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

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
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
  const out = path.join(ORDERS_DIR, `GENOSYS_Bianco_Cedre_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Bianco Cedre 04941 — add EZ mask ×3 @230, reissue invoice')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state,agent`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=demands,agent`),
    api('GET', `/entity/demand/${DEMAND_ID}?expand=invoicesOut`),
  ])

  console.log(`  SO ${order.name} ${money(order.sum)} ${order.agent?.name} ${order.state?.name || ''}`)
  console.log(`  INV ${invoice.name} ${money(invoice.sum)} payed ${money(invoice.payedSum)}`)
  console.log(`  SHIP ${demand.name} ${money(demand.sum)} SO-link ${!!demand.customerOrder}`)
  if (order.name !== 'GENCardM260818CEDRE') throw new Error(`Unexpected SO ${order.name}`)
  if (invoice.name !== '04941') throw new Error(`Unexpected invoice ${invoice.name}`)
  if (demand.name !== '06697') throw new Error(`Unexpected demand ${demand.name}`)
  if ((invoice.payedSum || 0) > 0) throw new Error('Invoice already has payment — stop')
  if (demand.customerOrder) throw new Error('Demand has customerOrder — stop')

  const docs = [
    ['customerorder', ORDER_ID],
    ['invoiceout', INVOICE_ID],
    ['demand', DEMAND_ID],
  ]
  for (const [type, id] of docs) {
    const positions = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    console.log(`  ${type} lines:`)
    for (const p of positions) {
      console.log(`    ${p.assortment?.code || '—'} ${p.assortment?.name} x${p.quantity} @ ${money(p.price)}`)
    }
    if (positions.some((p) => p.assortment?.code === ADD_CODE)) {
      throw new Error(`${type}: ${ADD_CODE} already present`)
    }
  }

  const item = await fetchAssortmentByCode(ADD_CODE)
  console.log(`  Add ${ADD_CODE} ${item.name} x${ADD_QTY} @ ${ADD_AED} (avail ${item.available})`)
  if (item.available < ADD_QTY) {
    console.log(`  WARN stock ${ADD_CODE}: need ${ADD_QTY}, have ${item.available} — posting anyway`)
  }
  console.log(`  New total: ${money(EXPECTED_SUM_MINOR)} AED unpaid`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const addPayload = [
    {
      quantity: ADD_QTY,
      price: Math.round(ADD_AED * 100),
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    },
  ]

  for (const [type, id] of docs) {
    await api('POST', `/entity/${type}/${id}/positions`, addPayload)
    console.log(`  added ${ADD_CODE} on ${type}`)
  }

  const [soAfter, invAfter, shipAfter] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])
  if (
    soAfter.sum !== EXPECTED_SUM_MINOR ||
    invAfter.sum !== EXPECTED_SUM_MINOR ||
    shipAfter.sum !== EXPECTED_SUM_MINOR
  ) {
    throw new Error(
      `Sum mismatch SO ${money(soAfter.sum)} INV ${money(invAfter.sum)} SHIP ${money(shipAfter.sum)}`,
    )
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: soAfter.meta,
    description: [
      soAfter.description || '',
      '2026-08-18: added 00011 EZ mask box ×3 @230. Invoice reissued.',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`\n  Total: ${money(invAfter.sum)} AED unpaid`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
