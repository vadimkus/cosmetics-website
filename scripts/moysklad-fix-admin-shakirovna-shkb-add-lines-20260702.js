#!/usr/bin/env node

/**
 * Admin Shakirovna — amend GENCardM260702SHKB / invoice 04749 / shipment 06451:
 *   add overnight mask 170, anti-wrinkle serum 165, Snow Booster 130.
 *   Keep Beige cushion + delivery 15 unchanged. Re-export invoice PDF.
 *
 *   node --import dotenv/config scripts/moysklad-fix-admin-shakirovna-shkb-add-lines-20260702.js
 *   node --import dotenv/config scripts/moysklad-fix-admin-shakirovna-shkb-add-lines-20260702.js --commit
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

const ORDER_ID = '357a3252-75e8-11f1-0a80-066c00397f9b'
const INVOICE_ID = '35d3e64e-75e8-11f1-0a80-1b130039778e'
const DEMAND_ID = '367e29a1-75e8-11f1-0a80-04b10038361c'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const MARKER = `ADMIN-SHAKIROVNA-SHKB-ADD-3LINES-${uaeToday()}`
const EXPECTED_SUM_MINOR = 63000 // 150+15+170+165+130

/** [code, productId, qty, unitAed] */
const ADD_LINES = [
  ['00189', 'e24a7dad-bf05-11ed-0a80-00c300038093', 1, 170],
  ['00191', 'abddb813-bf06-11ed-0a80-02f300040558', 1, 165],
  ['00022', '70f536c1-3449-11ea-0a80-05dc0001878d', 1, 130],
]

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
    if (res.status === 429 && attempt < 8) {
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

function assortmentCode(pos) {
  return pos.assortment?.code || pos.assortment?.name || '—'
}

async function listPositions(entityType, entityId) {
  return fetchAll(`/entity/${entityType}/${entityId}/positions?expand=assortment`)
}

async function addMissingLines(entityType, entityId, positions) {
  const existingCodes = new Set(positions.map((p) => p.assortment?.code).filter(Boolean))
  let added = 0
  for (const [code, productId, qty, unitAed] of ADD_LINES) {
    if (existingCodes.has(code)) {
      console.log(`    ${code} already on ${entityType} — skip`)
      continue
    }
    if (COMMIT) {
      await api('POST', `/entity/${entityType}/${entityId}/positions`, {
        quantity: qty,
        price: Math.round(unitAed * 100),
        discount: 0,
        assortment: href('product', productId),
        vat: 5,
        vatEnabled: true,
      })
    }
    console.log(`    + ${code} x${qty} @ ${unitAed.toFixed(2)} AED`)
    added++
  }
  return added
}

async function appendDescription(entityType, entityId, currentDesc) {
  if (!COMMIT) return
  if ((currentDesc || '').includes(MARKER)) return
  const doc = await api('GET', `/entity/${entityType}/${entityId}`)
  await api('PUT', `/entity/${entityType}/${entityId}`, {
    meta: doc.meta,
    description: [
      doc.description || currentDesc || '',
      MARKER,
      'Added 00189 overnight x1 @170, 00191 anti-wrinkle serum x1 @165, 00022 Snow Booster x1 @130.',
    ]
      .filter(Boolean)
      .join('\n'),
  })
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
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ordersDir, `GENOSYS_Admin_Shakirovna_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function verifySum(entityType, entityId, label) {
  const doc = await api('GET', `/entity/${entityType}/${entityId}`)
  console.log(`  ${label}: ${doc.name} | ${money(doc.sum)} AED`)
  if (Math.abs(doc.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`${label} sum ${money(doc.sum)} != ${money(EXPECTED_SUM_MINOR)}`)
  }
  return doc
}

async function main() {
  console.log('====================================================================')
  console.log('  Admin Shakirovna — amend SHKB order / 04749 / 06451')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  console.log(`\n  Current totals:`)
  console.log(`    Order ${order.name}: ${money(order.sum)} AED`)
  console.log(`    Invoice ${invoice.name}: ${money(invoice.sum)} AED`)
  console.log(`    Shipment ${demand.name}: ${money(demand.sum)} AED`)
  console.log(`  Target total: ${money(EXPECTED_SUM_MINOR)} AED`)

  const [orderPos, invPos, demandPos] = await Promise.all([
    listPositions('customerorder', ORDER_ID),
    listPositions('invoiceout', INVOICE_ID),
    listPositions('demand', DEMAND_ID),
  ])

  console.log('\n  Existing lines:')
  for (const p of orderPos) {
    console.log(`    ${assortmentCode(p)} x${p.quantity} @ ${money(p.price)}`)
  }

  console.log('\n  Add to order:')
  await addMissingLines('customerorder', ORDER_ID, orderPos)
  console.log('  Add to invoice:')
  await addMissingLines('invoiceout', INVOICE_ID, invPos)
  console.log('  Add to shipment:')
  await addMissingLines('demand', DEMAND_ID, demandPos)

  if (!COMMIT) {
    console.log(`\n  Expected after fix: ${money(EXPECTED_SUM_MINOR)} AED`)
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  await appendDescription('customerorder', ORDER_ID, order.description)
  await appendDescription('invoiceout', INVOICE_ID, invoice.description)
  await appendDescription('demand', DEMAND_ID, demand.description)

  console.log('\n  Verify totals:')
  const invAfter = await verifySum('customerorder', ORDER_ID, 'Order')
  await verifySum('invoiceout', INVOICE_ID, 'Invoice')
  await verifySum('demand', DEMAND_ID, 'Shipment')

  console.log('\n  Exporting invoice PDF...')
  const pdfPath = await exportInvoicePdf(INVOICE_ID, invAfter.name === order.name ? invoice.name : invoice.name)
  if (pdfPath) {
    console.log(`    Saved: ${pdfPath} (${fs.statSync(pdfPath).size} bytes)`)
  }

  console.log(`\n  Order:  https://online.moysklad.ru/app/#customerorder/edit?id=${ORDER_ID}`)
  console.log(`  Invoice: https://online.moysklad.ru/app/#invoiceout/edit?id=${INVOICE_ID}`)
  console.log(`  Shipment: https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
