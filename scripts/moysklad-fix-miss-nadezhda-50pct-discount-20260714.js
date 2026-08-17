#!/usr/bin/env node

/**
 * Miss Nadezhda — apply 50% discount on all product lines; delivery unchanged (45 AED).
 *
 * Order GENCardM2607146701 | Invoice 04817 | Shipment 06538
 * Was 1,332.00 AED (10% off products) → 760.00 AED (50% off products + full delivery).
 *
 *   node --import dotenv/config scripts/moysklad-fix-miss-nadezhda-50pct-discount-20260714.js
 *   node --import dotenv/config scripts/moysklad-fix-miss-nadezhda-50pct-discount-20260714.js --commit
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

const ORDER_ID = '96baba31-7f73-11f1-0a80-0b990019a0f7'
const INVOICE_ID = '97170c8b-7f73-11f1-0a80-115c0019dfb6'
const DEMAND_ID = '981d1a68-7f73-11f1-0a80-1b4f001ad8c4'
const DELIVERY_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const PRODUCT_DISCOUNT = 50
const DELIVERY_DISCOUNT = 0
const EXPECTED_SUM_MINOR = 76000
const MARKER = `MISS-NADEZHDA-50PCT-${uaeToday()}`

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
      signal: AbortSignal.timeout(60000),
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    const retryable =
      e.cause?.code === 'ECONNRESET' ||
      e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      e.name === 'TimeoutError' ||
      e.message === 'fetch failed'
    if (attempt < 8 && retryable) {
      await new Promise((r) => setTimeout(r, 2000 * attempt))
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

function lineNet(priceMinor, qty, discountPct) {
  return Math.round((priceMinor * qty * (100 - discountPct)) / 100)
}

function assortmentId(pos) {
  return pos.assortment?.meta?.href?.split('/').pop()?.split('?')[0] || ''
}

function targetDiscount(pos) {
  return assortmentId(pos) === DELIVERY_SERVICE_ID ? DELIVERY_DISCOUNT : PRODUCT_DISCOUNT
}

function positionPayload(pos, discount) {
  return {
    meta: pos.meta,
    quantity: pos.quantity,
    price: pos.price,
    discount,
    assortment: pos.assortment,
    vat: pos.vat,
    vatEnabled: pos.vatEnabled,
  }
}

async function updateDocPositions(entityType, docId, label) {
  const doc = await api('GET', `/entity/${entityType}/${docId}`)
  const positions = await fetchAll(`/entity/${entityType}/${docId}/positions`)
  console.log(`\n  ${label}: ${doc.name} | current ${money(doc.sum)} AED`)

  let changed = 0
  for (const pos of positions) {
    const aid = assortmentId(pos)
    const isDelivery = aid === DELIVERY_SERVICE_ID
    const target = targetDiscount(pos)
    const current = pos.discount || 0
    const name = isDelivery ? 'Excellent Delivery Dubai' : pos.assortment?.name || aid
    if (current === target) {
      console.log(`    ✓ ${name.slice(0, 42)} — already ${target}%`)
      continue
    }
    console.log(`    → ${name.slice(0, 42)} — ${current}% → ${target}%`)
    if (COMMIT) {
      await api('PUT', `/entity/${entityType}/${docId}/positions/${pos.id}`, positionPayload(pos, target))
    }
    changed++
  }

  if (COMMIT && changed) {
    const refreshed = await api('GET', `/entity/${entityType}/${docId}`)
    console.log(`    Updated ${changed} line(s) → ${money(refreshed.sum)} AED`)
    return refreshed
  }

  const projected = positions.reduce((s, p) => s + lineNet(p.price, p.quantity, targetDiscount(p)), 0)
  console.log(`    Projected after fix: ${money(projected)} AED (${changed} line(s) to change)`)
  return { ...doc, sum: projected }
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
  const outPath = path.join(os.homedir(), 'Desktop', 'orders', `GENOSYS_Miss_Nadezhda_${invoiceName}.pdf`)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Nadezhda — 50% off products (delivery full price)')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')

  const order = await updateDocPositions('customerorder', ORDER_ID, 'Order')
  const invoice = await updateDocPositions('invoiceout', INVOICE_ID, 'Invoice')
  const demand = await updateDocPositions('demand', DEMAND_ID, 'Shipment')

  const finalSum = COMMIT ? order.sum : order.sum
  if (Math.abs(finalSum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Sum ${money(finalSum)} != expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const orderFull = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: orderFull.meta,
    description: [orderFull.description || '', `[${MARKER}] products 50% off; delivery 45 full.`]
      .filter(Boolean)
      .join(' | '),
  })

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`\n  ✓ Order ${orderFull.name} | Invoice ${invoice.name} | Shipment ${demand.name}`)
  console.log(`  ✓ Total: ${money(invoice.sum)} AED`)
  if (pdfPath) console.log(`  ✓ PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
