#!/usr/bin/env node

/**
 * Lips for Kiss order 1 — Multi Sun SPF40 00041 qty 10 → 5 on SO/invoice/shipment.
 * Re-export Legal TAX invoice PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-amend-lips-for-kiss-order1-spf40-qty5-20260805.js
 *   node --import dotenv/config scripts/moysklad-amend-lips-for-kiss-order1-spf40-qty5-20260805.js --commit
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

const ORDER_ID = '39cc37db-90dc-11f1-0a80-1f52002078c2'
const INVOICE_ID = '3a1f9db1-90dc-11f1-0a80-1f52002078dd'
const DEMAND_ID = '3af147d6-90dc-11f1-0a80-0b6300215289'
const CODE = '00041'
const NEW_QTY = 5
const EXPECTED_SUM_MINOR = 709500 // 7,095 AED
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
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

async function findSpfPos(entityType, id) {
  const rows = await fetchAll(`/entity/${entityType}/${id}/positions?expand=assortment`)
  const pos = rows.find((p) => p.assortment?.code === CODE)
  if (!pos) throw new Error(`No ${CODE} on ${entityType} ${id}`)
  return pos
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
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Lips_for_Kiss_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Lips for Kiss order 1 — SPF40 00041 qty 10 → 5')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  for (const [type, id] of [
    ['customerorder', ORDER_ID],
    ['invoiceout', INVOICE_ID],
    ['demand', DEMAND_ID],
  ]) {
    const doc = await api('GET', `/entity/${type}/${id}`)
    const pos = await findSpfPos(type, id)
    console.log(
      `  ${type} ${doc.name}: ${CODE} qty ${pos.quantity} @ ${pos.price / 100} | sum ${doc.sum / 100}`,
    )
    if (COMMIT) {
      await api('PUT', `/entity/${type}/${id}/positions/${pos.id}`, {
        quantity: NEW_QTY,
        price: pos.price,
        discount: pos.discount || 0,
      })
      const refreshed = await api('GET', `/entity/${type}/${id}`)
      console.log(`    → qty ${NEW_QTY}, sum ${refreshed.sum / 100}`)
      if (refreshed.sum !== EXPECTED_SUM_MINOR) {
        throw new Error(`${type} sum ${refreshed.sum} ≠ ${EXPECTED_SUM_MINOR}`)
      }
    }
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const invoice = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    description: [
      order.description || '',
      'Amended 2026-08-05: SPF40 Multi Sun 00041 x5 (was x10). Total 7095 AED.',
    ]
      .filter(Boolean)
      .join(' | '),
  })

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`\n  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
