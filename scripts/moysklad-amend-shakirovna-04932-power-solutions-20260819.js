#!/usr/bin/env node

/**
 * SHAKIROVNA POLY CLINIC GENCardM260812MAR1912 / inv 04932 / ship 06685
 * Add Power Solutions SWS/PCS/HES/CVS ×10 @ 29. SRS 00015 ×10 already on the chain.
 * Re-export Legal_TAX → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-amend-shakirovna-04932-power-solutions-20260819.js
 *   node --import dotenv/config scripts/moysklad-amend-shakirovna-04932-power-solutions-20260819.js --commit
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

const ORDER_ID = 'fed2327a-964b-11f1-0a80-0692002c1746'
const INVOICE_ID = '0bc4736e-98b2-11f1-0a80-07570029fe93'
const DEMAND_ID = 'c43204bc-98b2-11f1-0a80-05be00295b3e'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

/** [code, qty, clinicAed] — SRS 00015 already on invoice ×10 */
const ADD_LINES = [
  ['00020', 10, 29],
  ['00065', 10, 29],
  ['00071', 10, 29],
  ['00067', 10, 29],
]
const EXISTING_SRS = '00015'
const EXPECTED_SUM_MINOR = 355500

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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
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
  const out = path.join(ORDERS_DIR, `GENOSYS_SHAKIROVNA_POLY_CLINIC_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna 04932 — add SWS/PCS/HES/CVS ×10, reissue invoice')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state,agent`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=demands,agent`),
    api('GET', `/entity/demand/${DEMAND_ID}?expand=invoicesOut`),
  ])

  console.log(`  SO ${order.name} ${money(order.sum)} ${order.agent?.name} ${order.state?.name || ''}`)
  console.log(`  INV ${invoice.name} ${money(invoice.sum)} payed ${money(invoice.payedSum)}`)
  console.log(`  SHIP ${demand.name} ${money(demand.sum)} SO-link ${!!demand.customerOrder}`)
  if (order.name !== 'GENCardM260812MAR1912') throw new Error(`Unexpected SO ${order.name}`)
  if (invoice.name !== '04932') throw new Error(`Unexpected invoice ${invoice.name}`)
  if (demand.name !== '06685') throw new Error(`Unexpected demand ${demand.name}`)
  if ((invoice.payedSum || 0) > 0) throw new Error('Invoice already has payment — stop')
  if (demand.customerOrder) throw new Error('Demand has customerOrder — stop')
  if (invoice.sum !== 239500) throw new Error(`Expected current INV 2395, got ${money(invoice.sum)}`)

  const addCodes = new Set(ADD_LINES.map(([c]) => c))
  const docs = [
    ['customerorder', ORDER_ID],
    ['invoiceout', INVOICE_ID],
    ['demand', DEMAND_ID],
  ]
  for (const [type, id] of docs) {
    const positions = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    console.log(`  ${type} lines:`)
    for (const p of positions) {
      console.log(`    ${p.assortment?.code || '—'} ${p.assortment?.name} x${p.quantity} @ ${money(p.price)}`)
    }
    const srs = positions.filter((p) => p.assortment?.code === EXISTING_SRS)
    if (!srs.length) throw new Error(`${type}: ${EXISTING_SRS} SRS missing — expected already on chain`)
    if (srs[0].quantity !== 10) throw new Error(`${type}: SRS qty ${srs[0].quantity} ≠ 10`)
    for (const code of addCodes) {
      if (positions.some((p) => p.assortment?.code === code)) {
        throw new Error(`${type}: ${code} already present`)
      }
    }
  }

  const addPayload = []
  for (const [code, qty, clinicAed] of ADD_LINES) {
    const item = await fetchAssortmentByCode(code)
    if (item.available < qty) {
      console.log(`  WARN stock ${code}: need ${qty}, have ${item.available} — posting anyway`)
    }
    console.log(`  Add ${code} ${item.name} x${qty} @ ${clinicAed} (avail ${item.available})`)
    addPayload.push({
      quantity: qty,
      price: Math.round(clinicAed * 100),
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  console.log(`  SRS 00015 ×10 already on invoice — left as is`)
  console.log(`  New total: ${money(EXPECTED_SUM_MINOR)} AED unpaid`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  for (const [type, id] of docs) {
    await api('POST', `/entity/${type}/${id}/positions`, addPayload)
    console.log(`  added power solutions on ${type}`)
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
      '2026-08-19: added Power Solutions 00020/00065/00071/00067 ×10 @29. SRS 00015 already ×10. Invoice reissued.',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`\n  Total: ${money(invAfter.sum)} AED unpaid`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
