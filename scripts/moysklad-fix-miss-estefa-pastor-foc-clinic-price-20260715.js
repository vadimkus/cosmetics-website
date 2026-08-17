#!/usr/bin/env node

/**
 * Miss Estefa Pastor GENCardM2607155574 — FOC lines must show clinic list, not retail.
 *   54475: 300 → 150 AED
 *   00063: 36 → 18 AED
 *   100% discount unchanged; paid total 320 AED unchanged.
 *
 *   node --import dotenv/config scripts/moysklad-fix-miss-estefa-pastor-foc-clinic-price-20260715.js --commit
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

const ORDER_ID = '2e351945-801c-11f1-0a80-1c840036dd67'
const INVOICE_ID = '2e70c9fd-801c-11f1-0a80-0b9900361ef0'
const DEMAND_ID = '2ee5ca08-801c-11f1-0a80-0c9c0037cc3b'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const EXPECTED_SUM_MINOR = 32000

/** code → clinic price AED */
const CLINIC_PRICE = {
  '54475': 150,
  '00063': 18,
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
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function patchDoc(entityType, docId, label) {
  const rows = await fetchAll(`/entity/${entityType}/${docId}/positions?expand=assortment`)
  for (const p of rows) {
    const code = p.assortment?.code
    if (!CLINIC_PRICE[code]) continue
    const targetMinor = Math.round(CLINIC_PRICE[code] * 100)
    if (p.price === targetMinor) {
      console.log(`  ${label} ${code}: already clinic ${CLINIC_PRICE[code]} AED`)
      continue
    }
    console.log(`  ${label} ${code}: ${money(p.price)} → ${CLINIC_PRICE[code].toFixed(2)} AED (disc ${p.discount || 0}%)`)
    if (COMMIT) {
      await api('PUT', `/entity/${entityType}/${docId}/positions/${p.id}`, {
        meta: p.meta,
        quantity: p.quantity,
        price: targetMinor,
        discount: p.discount || 0,
        assortment: p.assortment,
        vat: p.vat,
        vatEnabled: p.vatEnabled,
      })
    }
  }
}

async function exportInvoicePdf(invoiceId, invoiceName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_RETAIL_PRINT_TEMPLATE_ID}`,
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
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const safe = String(invoiceName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ordersDir, `GENOSYS_Miss_Estefa_Pastor_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Estefa Pastor — FOC lines retail → clinic list price')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('  54475: 300 → 150 AED | 00063: 36 → 18 AED | 100% discount kept\n')

  await patchDoc('customerorder', ORDER_ID, 'Order')
  await patchDoc('invoiceout', INVOICE_ID, 'Invoice')
  await patchDoc('demand', DEMAND_ID, 'Shipment')

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  console.log(`\n  Totals: SO ${money(order.sum)} | inv ${money(invoice.sum)} | ship ${money(demand.sum)} AED`)
  if (order.sum !== EXPECTED_SUM_MINOR) throw new Error('Paid total changed — expected 320.00')

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  if (pdfPath) console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
