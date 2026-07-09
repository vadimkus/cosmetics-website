#!/usr/bin/env node

/**
 * Miss Alena — add 00022 Snow Booster Toner 200ml @ retail 260 −15% to existing docs + PDF.
 *
 *   SO GENCardM2607090511 | Invoice 04794 | Shipment 06510
 *
 *   node --import dotenv/config scripts/moysklad-update-miss-alena-add-snow-booster-20260709.js
 *   node --import dotenv/config scripts/moysklad-update-miss-alena-add-snow-booster-20260709.js --commit
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

const ORDER_ID = '5320377d-7b83-11f1-0a80-0da900177eca'
const INVOICE_ID = '5369db22-7b83-11f1-0a80-03b900175146'
const DEMAND_ID = '5431c1d5-7b83-11f1-0a80-03b900175177'
const PRODUCT_ID = '70f536c1-3449-11ea-0a80-05dc0001878d' // 00022

const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const CODE = '00022'
const QTY = 1
const RETAIL_AED = 260
const DISCOUNT = 15
const PRICE_MINOR = RETAIL_AED * 100
const NET_AED = (RETAIL_AED * QTY * (100 - DISCOUNT)) / 100
const OLD_SUM_MINOR = 106250
const EXPECTED_SUM_MINOR = OLD_SUM_MINOR + Math.round(NET_AED * 100)

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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function newPosition() {
  return {
    quantity: QTY,
    price: PRICE_MINOR,
    discount: DISCOUNT,
    assortment: href('product', PRODUCT_ID),
    vat: 5,
    vatEnabled: true,
  }
}

async function fetchPositions(entityType, entityId) {
  return (await api('GET', `/entity/${entityType}/${entityId}/positions?expand=assortment&limit=100`)).rows || []
}

function hasLine(rows) {
  return rows.some((p) => p.assortment?.code === CODE)
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
    throw new Error(`Invoice export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ordersDir, `GENOSYS_Miss_Alena_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function addLine(entityType, entityId, label) {
  const rows = await fetchPositions(entityType, entityId)
  if (hasLine(rows)) {
    console.log(`  ${label}: ${CODE} already present — skip`)
    return
  }
  await api('POST', `/entity/${entityType}/${entityId}/positions`, newPosition())
  console.log(`  ${label}: added ${CODE} x${QTY} @ ${RETAIL_AED} −${DISCOUNT}%`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Alena — add Snow Booster 200ml (00022) @ retail −15%')
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
  console.log(`\n  Add: ${CODE} Snow Booster 200ml x${QTY} @ ${RETAIL_AED} −${DISCOUNT}% → ${NET_AED.toFixed(2)} AED`)
  console.log(`  Expected total: ${money(EXPECTED_SUM_MINOR)} AED`)

  const orderPos = await fetchPositions('customerorder', ORDER_ID)
  if (hasLine(orderPos)) {
    console.log('\n  Line already on all docs — re-export PDF only if needed.')
    if (COMMIT) {
      const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
      if (pdfPath) console.log(`\n  PDF: ${pdfPath}`)
    }
    return
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await addLine('customerorder', ORDER_ID, 'SO')
  await addLine('invoiceout', INVOICE_ID, 'Invoice')
  await addLine('demand', DEMAND_ID, 'Shipment')

  const descSuffix = '00022 Snow Booster 200ml @ retail −15%.'
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
  if (pdfPath) console.log(`\n  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
