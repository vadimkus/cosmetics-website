#!/usr/bin/env node

/**
 * Genesis Healthcare Centre FZ-LLC — add FOC lines to PARTW2607160539
 * (invoice 04830 / shipment 06555). Paid total stays 2,970 AED.
 *
 *   00013 Hydro Cool Modeling Mask 1kg ×1 @ 300 clinic, 100% discount
 *   00024 Snow O₂ Cleanser 500ml ×1 @ 255 clinic, 100% discount
 *   00025 Snow Booster Toner 1000ml ×1 @ 245 clinic, 100% discount
 *
 *   node --import dotenv/config scripts/moysklad-amend-genesis-partw2607160539-foc-20260718.js
 *   node --import dotenv/config scripts/moysklad-amend-genesis-partw2607160539-foc-20260718.js --commit
 */

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

const ORDER_ID = '361f8c3d-8130-11f1-0a80-0dc40023a524' // PARTW2607160539
const INVOICE_ID = '36623435-8130-11f1-0a80-04d100239d31' // 04830
const DEMAND_ID = '36efaf8c-8130-11f1-0a80-0bab00236329' // 06555

const EXPECTED_SUM_MINOR = 297000
const MARKER = `GENESIS-FOC-HYDRO-SNOW-${uaeToday()}`

/** [code, productId, qty, clinicAed, discountPct] */
const ADD_LINES = [
  ['00013', '806e9e52-3444-11ea-0a80-05dc00014e2d', 1, 300, 100],
  ['00024', '0a27b901-344a-11ea-0a80-021700017918', 1, 255, 100],
  ['00025', '48952d7e-344a-11ea-0a80-00e50001bb46', 1, 245, 100],
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
        ...(body ? { 'Content-Type': 'application/json' } : {}),
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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function lineCode(pos) {
  return pos.assortment?.code || ''
}

function buildAddPayload([code, productId, qty, clinicAed, discountPct]) {
  return {
    quantity: qty,
    price: Math.round(clinicAed * 100),
    discount: discountPct,
    assortment: href('product', productId),
    vat: 5,
    vatEnabled: true,
  }
}

async function addMissingLines(entityType, docId, label) {
  const rows = await fetchAll(`/entity/${entityType}/${docId}/positions?expand=assortment`)
  const codes = new Set(rows.map((p) => lineCode(p)))
  for (const line of ADD_LINES) {
    const [code] = line
    if (codes.has(code)) {
      const existing = rows.find((p) => lineCode(p) === code)
      if (existing?.discount === 100) {
        console.log(`  ${label}: ${code} already present @ 100% off — skip`)
        continue
      }
      throw new Error(`${label}: ${code} present but not 100% off — manual review`)
    }
    const payload = buildAddPayload(line)
    console.log(
      `  ${label}: + ${code} x${payload.quantity} @ ${money(payload.price)} AED clinic, ${payload.discount}% off`
    )
    if (COMMIT) await api('POST', `/entity/${entityType}/${docId}/positions`, payload)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Genesis PARTW2607160539 — add FOC Hydro Cool + Snow lines')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=agent`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=agent`),
    api('GET', `/entity/demand/${DEMAND_ID}?expand=agent`),
  ])

  console.log(`\n  Order ${order.name} | agent=${order.agent?.name} | ${money(order.sum)} AED`)
  console.log(`  Invoice ${invoice.name} | Shipment ${demand.name}`)
  console.log('\n  FOC (clinic list @ 100% discount):')
  for (const [code, , qty, clinicAed] of ADD_LINES) {
    console.log(`    ${code} ×${qty} @ ${clinicAed} → 0 AED`)
  }

  console.log('\n  Add FOC lines to SO / invoice / shipment:')
  await addMissingLines('customerorder', ORDER_ID, 'Order')
  await addMissingLines('invoiceout', INVOICE_ID, 'Invoice')
  await addMissingLines('demand', DEMAND_ID, 'Shipment')

  if (!COMMIT) {
    console.log(`\n  Expected paid total unchanged: ${money(EXPECTED_SUM_MINOR)} AED`)
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const orderMeta = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: orderMeta.meta,
    description: [
      orderMeta.description || '',
      MARKER,
      'FOC: 00013 Hydro Cool x1; 00024 Cleanser 500ml x1; 00025 Snow Booster 1000ml x1 (clinic @ 100% discount).',
    ]
      .filter(Boolean)
      .join(' | '),
  })

  const [order2, invoice2, demand2] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  console.log(`\n  After amend:`)
  console.log(`    Order ${order2.name}: ${money(order2.sum)} AED`)
  console.log(`    Invoice ${invoice2.name}: ${money(invoice2.sum)}`)
  console.log(`    Shipment ${demand2.name}: ${money(demand2.sum)}`)

  if (order2.sum !== EXPECTED_SUM_MINOR || invoice2.sum !== EXPECTED_SUM_MINOR || demand2.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum mismatch — expected ${money(EXPECTED_SUM_MINOR)} AED, got order=${money(order2.sum)}`)
  }

  const rows = await fetchAll(`/entity/customerorder/${ORDER_ID}/positions?expand=assortment`)
  console.log('\n  Order lines:')
  for (const p of rows) {
    const net = Math.round((p.price * p.quantity * (100 - (p.discount || 0))) / 100)
    console.log(
      `    ${lineCode(p)} ×${p.quantity} @ ${money(p.price)} disc ${p.discount || 0}% → ${money(net)}`
    )
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
