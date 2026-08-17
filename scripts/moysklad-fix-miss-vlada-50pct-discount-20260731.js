#!/usr/bin/env node

/**
 * Miss Vlada — 50% off product; delivery unchanged (45 AED).
 * Full chain: order + invoice + shipment + paymentin.
 *
 * GENCardM2607312968 / inv 04873 / ship 06609 / pay 06003
 * Was 315.00 (cushion @300 −10% + delivery 45)
 * → 195.00 (cushion @300 −50% + delivery 45)
 *
 *   node --import dotenv/config scripts/moysklad-fix-miss-vlada-50pct-discount-20260731.js
 *   node --import dotenv/config scripts/moysklad-fix-miss-vlada-50pct-discount-20260731.js --commit
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

const ORDER_ID = '10884da2-8ca5-11f1-0a80-1d1a000e6e86'
const INVOICE_ID = '10ea9f31-8ca5-11f1-0a80-143900101995'
const DEMAND_ID = '12803cb5-8ca5-11f1-0a80-0b40000f062e'
const PAYMENT_ID = '92e9c2f4-8cd9-11f1-0a80-15ee000e5172'
const DELIVERY_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const PRODUCT_DISCOUNT = 50
const DELIVERY_DISCOUNT = 0
const EXPECTED_SUM_MINOR = 19500 // 150 + 45
const MARKER = `MISS-VLADA-50PCT-${uaeToday()}`
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
    const name = isDelivery ? 'Delivery Dubai' : pos.assortment?.name || aid
    if (current === target) {
      console.log(`    ✓ ${name.slice(0, 48)} — already ${target}%`)
      continue
    }
    console.log(
      `    → ${name.slice(0, 48)} — ${current}% → ${target}% | ${money(lineNet(pos.price, pos.quantity, target))}`,
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

async function updatePayment(sumMinor) {
  const pay = await api('GET', `/entity/paymentin/${PAYMENT_ID}`)
  console.log(`\n  Payment: ${pay.name} | current ${money(pay.sum)} AED`)
  if (!COMMIT) {
    console.log(`    Projected: ${money(sumMinor)} AED (linked to demand 06609)`)
    return pay
  }
  const updated = await api('PUT', `/entity/paymentin/${PAYMENT_ID}`, {
    meta: pay.meta,
    sum: sumMinor,
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${DEMAND_ID}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: sumMinor,
      },
    ],
    description: [pay.description || '', `[${MARKER}] reduced to ${money(sumMinor)} after 50% product discount.`]
      .filter(Boolean)
      .join(' | '),
  })
  console.log(`    → ${money(updated.sum)} AED`)
  return updated
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
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Miss_Vlada_${invoiceName}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Vlada — 50% off product (delivery full 45)')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('  Chain: order → invoice → shipment → paymentin')
  console.log('====================================================================')

  const order = await updateDocPositions('customerorder', ORDER_ID, 'Order')
  const invoice = await updateDocPositions('invoiceout', INVOICE_ID, 'Invoice')
  const demand = await updateDocPositions('demand', DEMAND_ID, 'Shipment')
  await updatePayment(EXPECTED_SUM_MINOR)

  const finalSum = order.sum
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
    description: [
      orderFull.description || '',
      `[${MARKER}] beige cushion 50% off (was 10%); delivery 45 full. Total 195.`,
    ]
      .filter(Boolean)
      .join(' | '),
  })

  const [orderR, invR, demR, payR] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
    api('GET', `/entity/paymentin/${PAYMENT_ID}`),
  ])

  console.log(`\n  Order:    ${orderR.name} | ${money(orderR.sum)} | payed ${money(orderR.payedSum)}`)
  console.log(`  Invoice:  ${invR.name} | ${money(invR.sum)} | payed ${money(invR.payedSum)}`)
  console.log(`  Shipment: ${demR.name} | ${money(demR.sum)} | payed ${money(demR.payedSum)}`)
  console.log(`  Payment:  ${payR.name} | ${money(payR.sum)}`)

  if (demR.sum !== EXPECTED_SUM_MINOR || payR.sum !== EXPECTED_SUM_MINOR || demR.payedSum !== EXPECTED_SUM_MINOR) {
    throw new Error('Chain sums not aligned after update')
  }

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invR.name)
  if (pdfPath) console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
