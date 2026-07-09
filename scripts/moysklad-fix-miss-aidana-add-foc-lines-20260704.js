#!/usr/bin/env node

/**
 * Miss Aidana — amend GENCardM2607033838 / invoice 04761 / shipment 06470:
 *   add FOC lines @ 100% discount (order total stays 335 AED):
 *     00183 Problem Control Toner 500ml ×1
 *     00063 Collagen mask ×1 (→ qty 2 total)
 *     00140 Sea algae mask ×1 (→ qty 2 total)
 *     00065 PCS vial ×2
 *     00071 HES vial ×1
 *
 *   node --import dotenv/config scripts/moysklad-fix-miss-aidana-add-foc-lines-20260704.js
 *   node --import dotenv/config scripts/moysklad-fix-miss-aidana-add-foc-lines-20260704.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

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

const ORDER_ID = '2dc3e8a0-7709-11f1-0a80-0b550025385f'
const INVOICE_ID = '2e0d65b1-7709-11f1-0a80-1f21002542e6'
const DEMAND_ID = '2ed200ba-7709-11f1-0a80-0d9f0025a0f0'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const EXPECTED_SUM_MINOR = 33500
const MARKER = `MISS-AIDANA-FOC-ADD-LINES-${uaeToday()}`

/** [code, productId, addQty, retailAed, discountPercent] */
const ADD_LINES = [
  ['00183', '15867f00-43d2-11ed-0a80-0f42000e9bcc', 1, 490, 100],
  ['00063', '51e74608-45cb-11ea-0a80-01f80015bea2', 1, 36, 100],
  ['00140', '9d634465-2690-11ec-0a80-0767000c229e', 1, 36, 100],
  ['00065', '8a43a8e9-45d4-11ea-0a80-048a00166b96', 2, 58, 100],
  ['00071', '4ba9c825-45d6-11ea-0a80-067800168f95', 1, 58, 100],
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

async function applyAddLines(entityType, entityId, positions) {
  const byCode = new Map()
  for (const p of positions) {
    const code = p.assortment?.code
    if (code) byCode.set(code, p)
  }

  for (const [code, productId, addQty, retailAed, discount] of ADD_LINES) {
    const existing = byCode.get(code)
    if (existing) {
      const newQty = Number(existing.quantity) + addQty
      console.log(`    ${code} qty ${existing.quantity} → ${newQty} @ ${retailAed.toFixed(2)} (${discount}% off)`)
      if (COMMIT) {
        await api('PUT', `/entity/${entityType}/${entityId}/positions/${existing.id}`, {
          quantity: newQty,
          price: Math.round(retailAed * 100),
          discount,
          assortment: href('product', productId),
          vat: 5,
          vatEnabled: true,
        })
      }
      continue
    }

    console.log(`    + ${code} x${addQty} @ ${retailAed.toFixed(2)} (${discount}% off)`)
    if (COMMIT) {
      await api('POST', `/entity/${entityType}/${entityId}/positions`, {
        quantity: addQty,
        price: Math.round(retailAed * 100),
        discount,
        assortment: href('product', productId),
        vat: 5,
        vatEnabled: true,
      })
    }
  }
}

async function appendDescription(entityType, entityId) {
  if (!COMMIT) return
  const doc = await api('GET', `/entity/${entityType}/${entityId}`)
  if ((doc.description || '').includes(MARKER)) return
  await api('PUT', `/entity/${entityType}/${entityId}`, {
    meta: doc.meta,
    description: [
      doc.description || '',
      MARKER,
      'FOC add: 00183 toner 500ml x1, 00063 collagen +1, 00140 sea algae +1, 00065 PCS x2, 00071 HES x1 — all 100% off.',
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
  const outPath = path.join(ordersDir, `GENOSYS_Miss_Aidana_${safe}.pdf`)
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
  console.log('  Miss Aidana — add FOC lines to order / 04761 / 06470')
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
  console.log(`  Target total (unchanged): ${money(EXPECTED_SUM_MINOR)} AED`)

  const [orderPos, invPos, demandPos] = await Promise.all([
    listPositions('customerorder', ORDER_ID),
    listPositions('invoiceout', INVOICE_ID),
    listPositions('demand', DEMAND_ID),
  ])

  console.log('\n  Existing lines:')
  for (const p of orderPos) {
    console.log(`    ${assortmentCode(p)} x${p.quantity} @ ${money(p.price)} disc ${p.discount || 0}%`)
  }

  console.log('\n  Apply to order:')
  await applyAddLines('customerorder', ORDER_ID, orderPos)
  console.log('  Apply to invoice:')
  await applyAddLines('invoiceout', INVOICE_ID, invPos)
  console.log('  Apply to shipment:')
  await applyAddLines('demand', DEMAND_ID, demandPos)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  for (const [type, id] of [
    ['customerorder', ORDER_ID],
    ['invoiceout', INVOICE_ID],
    ['demand', DEMAND_ID],
  ]) {
    await appendDescription(type, id)
  }

  console.log('\n  Verify totals:')
  await verifySum('customerorder', ORDER_ID, 'Order')
  await verifySum('invoiceout', INVOICE_ID, 'Invoice')
  const demandAfter = await verifySum('demand', DEMAND_ID, 'Shipment')

  const demandRead = await api('GET', `/entity/demand/${DEMAND_ID}`)
  console.log(`    Shipment payedSum: ${money(demandRead.payedSum)} / ${money(demandRead.sum)} AED`)

  console.log('\n  Exporting invoice PDF...')
  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  if (pdfPath) {
    console.log(`    Saved: ${pdfPath}`)
    try {
      execFileSync('lp', [pdfPath], { stdio: 'inherit' })
      console.log('    Sent to printer via lp')
    } catch (e) {
      console.warn('    lp failed, opening PDF:', e.message)
      execFileSync('open', [pdfPath], { stdio: 'inherit' })
    }
  }

  console.log(`\n  Order:   https://online.moysklad.ru/app/#customerorder/edit?id=${ORDER_ID}`)
  console.log(`  Invoice: https://online.moysklad.ru/app/#invoiceout/edit?id=${INVOICE_ID}`)
  console.log(`  Shipment: https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
