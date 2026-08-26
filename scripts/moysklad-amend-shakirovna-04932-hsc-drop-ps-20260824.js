#!/usr/bin/env node

/**
 * SHAKIROVNA POLY CLINIC GENCardM260812MAR1912 / inv 04932 / ship 06685
 * WhatsApp markup 24 Aug:
 *   - drop Power Solutions 00020/00065/00071/00067
 *   - swap Hyaluron Cream 54460 → HSC 250g 00032 @ 210
 *   - keep Snow O₂ 00024 and all other ticked lines
 * Re-export Legal_TAX → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-amend-shakirovna-04932-hsc-drop-ps-20260824.js
 *   node --import dotenv/config scripts/moysklad-amend-shakirovna-04932-hsc-drop-ps-20260824.js --commit
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

const DROP_CODES = ['00020', '00065', '00071', '00067', '54460']
const HSC = { code: '00032', qty: 1, clinicAed: 210 }
const KEEP_SNOW = '00024'
const CURRENT_SUM_MINOR = 355500
const EXPECTED_SUM_MINOR = 239500

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

function lineSum(positions) {
  return positions.reduce((acc, p) => {
    const qty = Number(p.quantity || 0)
    const price = Number(p.price || 0)
    const disc = Number(p.discount || 0)
    return acc + Math.round(qty * price * (1 - disc / 100))
  }, 0)
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna 04932 — HSC instead of Hyaluron, drop Power Solutions')
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
  if (invoice.sum !== CURRENT_SUM_MINOR) {
    throw new Error(`Expected current INV ${money(CURRENT_SUM_MINOR)}, got ${money(invoice.sum)}`)
  }

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
    if (!positions.some((p) => p.assortment?.code === KEEP_SNOW)) {
      throw new Error(`${type}: Snow O₂ ${KEEP_SNOW} missing — expected keep`)
    }
    if (positions.some((p) => p.assortment?.code === HSC.code)) {
      throw new Error(`${type}: ${HSC.code} already present`)
    }
    for (const code of DROP_CODES) {
      const hits = positions.filter((p) => p.assortment?.code === code)
      if (!hits.length) throw new Error(`${type}: ${code} not found`)
      if (hits.length > 1) throw new Error(`${type}: ${code} appears ${hits.length} times`)
    }
  }

  const hsc = await fetchAssortmentByCode(HSC.code)
  if (hsc.available < HSC.qty) {
    console.log(`  WARN stock ${HSC.code}: need ${HSC.qty}, have ${hsc.available} — posting anyway`)
  }
  console.log(`  Swap 54460 Hyaluron 250g → ${HSC.code} ${hsc.name} x${HSC.qty} @ ${HSC.clinicAed} (avail ${hsc.available})`)
  console.log('  Drop 00020/00065/00071/00067 Power Solutions ×10')
  console.log('  Keep 00024 Snow O₂ 500ml')
  console.log(`  New total: ${money(EXPECTED_SUM_MINOR)} AED unpaid`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const addPayload = [
    {
      quantity: HSC.qty,
      price: Math.round(HSC.clinicAed * 100),
      discount: 0,
      assortment: href('product', hsc.id),
      vat: 5,
      vatEnabled: true,
    },
  ]

  for (const [type, id] of docs) {
    const positions = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    for (const code of DROP_CODES) {
      for (const p of positions.filter((x) => x.assortment?.code === code)) {
        await api('DELETE', `/entity/${type}/${id}/positions/${p.id}`)
        console.log(`  deleted ${code} on ${type}`)
      }
    }
    await api('POST', `/entity/${type}/${id}/positions`, addPayload)
    console.log(`  added ${HSC.code} on ${type}`)
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

  const invPos = await fetchAll(`/entity/invoiceout/${INVOICE_ID}/positions?expand=assortment`)
  if (invPos.some((p) => DROP_CODES.includes(p.assortment?.code))) {
    throw new Error('Dropped codes still on invoice')
  }
  if (!invPos.some((p) => p.assortment?.code === HSC.code && p.quantity === HSC.qty)) {
    throw new Error('HSC 00032 missing on invoice after amend')
  }
  if (lineSum(invPos) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Invoice line sum ${money(lineSum(invPos))}`)
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: soAfter.meta,
    description: [
      soAfter.description || '',
      '2026-08-24: 54460 Hyaluron 250g → 00032 HSC 250g @210; dropped Power Solutions 00020/00065/00071/00067. Invoice reissued.',
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
