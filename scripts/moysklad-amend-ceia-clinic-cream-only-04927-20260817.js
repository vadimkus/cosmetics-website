#!/usr/bin/env node

/**
 * CEIA CLINIC GENCardM260813CEIA / inv 04927 — keep only cream 00034.
 * Remove scalp peeling 00050 and hair solution pro 00048.
 * Re-export Legal_TAX PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-amend-ceia-clinic-cream-only-04927-20260817.js
 *   node --import dotenv/config scripts/moysklad-amend-ceia-clinic-cream-only-04927-20260817.js --commit
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

const ORDER_ID = '9d5de526-96fe-11f1-0a80-134b00249fb7'
const INVOICE_ID = '9db35090-96fe-11f1-0a80-0b8e002473fc'
const DEMAND_ID = '2add44e0-9700-11f1-0a80-0d9b00264b1e'
const KEEP_CODE = '00034'
const DROP_CODES = new Set(['00050', '00048'])
const EXPECTED_SUM_MINOR = 21000
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
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

async function stripLines(entityType, entityId) {
  const positions = await fetchAll(`/entity/${entityType}/${entityId}/positions?expand=assortment`)
  console.log(`  ${entityType} ${entityId.slice(0, 8)}… ${positions.length} lines`)
  const keep = positions.filter((p) => p.assortment?.code === KEEP_CODE)
  const drop = positions.filter((p) => DROP_CODES.has(p.assortment?.code))
  const other = positions.filter(
    (p) => p.assortment?.code !== KEEP_CODE && !DROP_CODES.has(p.assortment?.code),
  )
  for (const p of positions) {
    console.log(`    ${p.assortment?.code} ${p.assortment?.name} x${p.quantity} @ ${money(p.price)}`)
  }
  if (!keep.length) throw new Error(`${entityType}: ${KEEP_CODE} not found`)
  if (other.length) {
    throw new Error(
      `${entityType}: unexpected codes ${other.map((p) => p.assortment?.code).join(', ')}`,
    )
  }
  if (!COMMIT) return
  for (const p of drop) {
    await api('DELETE', `/entity/${entityType}/${entityId}/positions/${p.id}`)
    console.log(`    deleted ${p.assortment?.code}`)
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
  const out = path.join(ORDERS_DIR, `GENOSYS_CEIA_Clinic_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  CEIA CLINIC — keep only 00034 cream, reissue 04927')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])
  console.log(`  SO ${order.name} ${money(order.sum)} ${order.state?.name || ''}`)
  console.log(`  INV ${invoice.name} ${money(invoice.sum)} payed ${money(invoice.payedSum)}`)
  console.log(`  SHIP ${demand.name} ${money(demand.sum)}`)
  if ((invoice.payedSum || 0) > 0) throw new Error('Invoice has payment — stop')

  await stripLines('customerorder', ORDER_ID)
  await stripLines('invoiceout', INVOICE_ID)
  await stripLines('demand', DEMAND_ID)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
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
      'Amended 2026-08-17: cream only 00034 x1 @210. Removed 00050 scalp peeling and 00048 hair solution pro.',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`  After: ${money(EXPECTED_SUM_MINOR)} AED unpaid`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
