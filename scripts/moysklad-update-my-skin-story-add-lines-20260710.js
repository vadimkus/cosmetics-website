#!/usr/bin/env node

/**
 * My Skin Story — add +1 blemish balm (00040) + +1 multi vita cream 50g (00122)
 * to existing SO / invoice / shipment from 2026-07-10, then reissue invoice PDF.
 *
 *   SO GENCardM260709RIZW1 | Invoice 04796 | Shipment 06515
 *
 *   node --import dotenv/config scripts/moysklad-update-my-skin-story-add-lines-20260710.js
 *   node --import dotenv/config scripts/moysklad-update-my-skin-story-add-lines-20260710.js --commit
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

const ORDER_ID = '228129c8-7c48-11f1-0a80-137400177a78'
const INVOICE_ID = '765bfa39-7c48-11f1-0a80-0ee10018477e'
const DEMAND_ID = 'd89892c7-7c4d-11f1-0a80-170c000bd5a2'

const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

/** code → new qty (was 1 each) */
const QTY_UPDATES = {
  '00040': 2, // Intensive Blemish Balm Cream 50g @ 125
  '00122': 2, // Multi-Vita Radiance Cream 50g @ 145
}

const OLD_SUM_MINOR = 139000
const EXPECTED_SUM_MINOR = OLD_SUM_MINOR + 12500 + 14500 // 1660 AED

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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function productCode(pos) {
  return pos.assortment?.code || pos.assortment?.article || ''
}

async function fetchPositions(entityType, entityId) {
  return (await api('GET', `/entity/${entityType}/${entityId}/positions?expand=assortment&limit=100`)).rows || []
}

async function updateQty(entityType, entityId, label) {
  const rows = await fetchPositions(entityType, entityId)
  for (const [code, newQty] of Object.entries(QTY_UPDATES)) {
    const pos = rows.find((p) => productCode(p) === code)
    if (!pos) throw new Error(`${label}: line ${code} not found`)
    if (pos.quantity === newQty) {
      console.log(`  ${label} ${code}: already qty ${newQty} — skip`)
      continue
    }
    if (pos.quantity > newQty) {
      throw new Error(`${label} ${code}: qty ${pos.quantity} > target ${newQty}`)
    }
    console.log(`  ${label} ${code}: qty ${pos.quantity} → ${newQty}`)
    if (!COMMIT) continue
    await api('PUT', `/entity/${entityType}/${entityId}/positions/${pos.id}`, {
      meta: pos.meta,
      quantity: newQty,
      price: pos.price,
      discount: pos.discount || 0,
      assortment: pos.assortment.meta ? { meta: pos.assortment.meta } : pos.assortment,
      vat: pos.vat,
      vatEnabled: pos.vatEnabled,
    })
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
    const t = await res.text()
    throw new Error(`Invoice export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, `GENOSYS_My_Skin_Story_${invoiceName}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  My Skin Story — +1 blemish balm + +1 multi vita cream 50g')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  console.log(`\n  Before:`)
  console.log(`    SO ${order.name} | ${money(order.sum)} AED`)
  console.log(`    Invoice ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`    Shipment ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`\n  Add: 00040 x1 @ 125 + 00122 x1 @ 145 → expected ${money(EXPECTED_SUM_MINOR)} AED`)

  await updateQty('customerorder', ORDER_ID, 'SO')
  await updateQty('invoiceout', INVOICE_ID, 'Invoice')
  await updateQty('demand', DEMAND_ID, 'Shipment')

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const descSuffix = `[${uaeToday()}] Added +1 00040 blemish balm + +1 00122 multi vita cream 50g.`
  const orderAfter = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: orderAfter.meta,
    description: `${orderAfter.description || ''} | ${descSuffix}`.replace(/\s+\|\s+\|/g, ' | '),
  })

  const [orderFinal, invoiceFinal, demandFinal] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  console.log(`\n  After:`)
  console.log(`    SO ${orderFinal.name} | ${money(orderFinal.sum)} AED`)
  console.log(`    Invoice ${invoiceFinal.name} | ${money(invoiceFinal.sum)} AED`)
  console.log(`    Shipment ${demandFinal.name} | ${money(demandFinal.sum)} AED`)

  if (Math.abs(orderFinal.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Sum mismatch: ${money(orderFinal.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoiceFinal.name)
  console.log(`\n  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
