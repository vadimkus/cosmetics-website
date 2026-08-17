#!/usr/bin/env node

/**
 * Miss Irina Mirdif — 50% off products; delivery unchanged (45 AED).
 * Chain: GENCardM2608160063 / inv 04934 / ship 06688 (unpaid).
 * 2,175 → 1,110 (1,065 products + 45 delivery).
 *
 *   node --import dotenv/config scripts/moysklad-fix-miss-irina-mirdif-50pct-discount-20260816.js
 *   node --import dotenv/config scripts/moysklad-fix-miss-irina-mirdif-50pct-discount-20260816.js --commit
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

const ORDER_ID = '81854c33-9947-11f1-0a80-134d00890149'
const INVOICE_ID = '81dfecb4-9947-11f1-0a80-0cb800899864'
const DEMAND_ID = '82998760-9947-11f1-0a80-08380086115b'
const DELIVERY_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const PRODUCT_DISCOUNT = 50
const DELIVERY_DISCOUNT = 0
const EXPECTED_SUM_MINOR = 111000 // 1065 + 45
const MARKER = `MISS-IRINA-MIRDIF-50PCT-${uaeToday()}`
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

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
  const positions = await fetchAll(`/entity/${entityType}/${docId}/positions?expand=assortment`)
  console.log(`\n  ${label}: ${doc.name} | current ${money(doc.sum)} AED`)

  let changed = 0
  for (const pos of positions) {
    const isDelivery = assortmentId(pos) === DELIVERY_SERVICE_ID
    const target = targetDiscount(pos)
    const current = pos.discount || 0
    const name = isDelivery ? 'Delivery Dubai' : pos.assortment?.name || assortmentId(pos)
    if (current === target) {
      console.log(`    ✓ ${name.slice(0, 52)} — already ${target}%`)
      continue
    }
    console.log(
      `    → ${name.slice(0, 52)} — ${current}% → ${target}% | ${money(lineNet(pos.price, pos.quantity, target))}`,
    )
    if (COMMIT) {
      await api('PUT', `/entity/${entityType}/${docId}/positions/${pos.id}`, positionPayload(pos, target))
    }
    changed++
  }

  if (COMMIT) {
    const refreshed = await api('GET', `/entity/${entityType}/${docId}`)
    console.log(`    → ${money(refreshed.sum)} AED (${changed} line(s) changed)`)
    return refreshed
  }

  const projected = positions.reduce((s, p) => s + lineNet(p.price, p.quantity, targetDiscount(p)), 0)
  console.log(`    Projected: ${money(projected)} AED (${changed} line(s) to change)`)
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
    throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Miss_Irina_Mirdif_${invoiceName}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Irina Mirdif — 50% off products (delivery full 45)')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')

  const order = await updateDocPositions('customerorder', ORDER_ID, 'Order')
  const invoice = await updateDocPositions('invoiceout', INVOICE_ID, 'Invoice')
  const demand = await updateDocPositions('demand', DEMAND_ID, 'Shipment')

  if (Math.abs(order.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Order ${money(order.sum)} != expected ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (Math.abs(invoice.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Invoice ${money(invoice.sum)} != expected ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (Math.abs(demand.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Shipment ${money(demand.sum)} != expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const orderFull = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: orderFull.meta,
    description: [
      orderFull.description || '',
      `[${MARKER}] 50% off products; delivery 45 full. Total 1110 unpaid.`,
    ]
      .filter(Boolean)
      .join(' | '),
  })

  const [orderR, invR, demR] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  if (demR.customerOrder) throw new Error('Demand has customerOrder — unexpected')

  console.log(`\n  Order:    ${orderR.name} | ${money(orderR.sum)} | payed ${money(orderR.payedSum)}`)
  console.log(`  Invoice:  ${invR.name} | ${money(invR.sum)} | payed ${money(invR.payedSum)}`)
  console.log(`  Shipment: ${demR.name} | ${money(demR.sum)} | payed ${money(demR.payedSum)}`)

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invR.name)
  if (pdfPath) console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
