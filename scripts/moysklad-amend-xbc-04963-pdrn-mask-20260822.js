#!/usr/bin/env node

/**
 * X Beauty Consulting INV 04963 — swap item 6:
 *   drop 54475 BIO-MESO PDRN Homecare 5000 @ 150
 *   add  54467 Skin Reboot PDRN mask Pack ×1 @ 200 clinic
 *   New total: 950 AED
 *
 *   node --import dotenv/config scripts/moysklad-amend-xbc-04963-pdrn-mask-20260822.js
 *   node --import dotenv/config scripts/moysklad-amend-xbc-04963-pdrn-mask-20260822.js --commit
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

const ORDER_ID = 'af2ffaad-9e1a-11f1-0a80-14c1005d37fc'
const INVOICE_ID = 'af8ced8a-9e1a-11f1-0a80-1eb700600be5'
const DEMAND_ID = 'b0700c34-9e1a-11f1-0a80-1a67005f4a97'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const DROP_CODE = '54475'
const ADD_CODE = '54467'
const ADD_QTY = 1
const ADD_AED = 200
const EXPECTED_SUM_MINOR = 95000

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
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
  const out = path.join(ORDERS_DIR, `GENOSYS_X_Beauty_Consulting_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  X Beauty 04963 — swap PDRN 5000 → PDRN mask pack')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state,agent`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  console.log(`  SO ${order.name} ${money(order.sum)} ${order.agent?.name}`)
  console.log(`  INV ${invoice.name} ${money(invoice.sum)} payed ${money(invoice.payedSum)}`)
  console.log(`  SHIP ${demand.name} ${money(demand.sum)}`)
  if (order.name !== 'GENCardM260822XBC') throw new Error(`Unexpected SO ${order.name}`)
  if (invoice.name !== '04963') throw new Error(`Unexpected invoice ${invoice.name}`)
  if (demand.name !== '06725') throw new Error(`Unexpected demand ${demand.name}`)
  if ((invoice.payedSum || 0) > 0) throw new Error('Invoice already has payment — stop')
  if (demand.customerOrder) throw new Error('Demand has customerOrder — stop')

  const docs = [
    ['customerorder', ORDER_ID],
    ['invoiceout', INVOICE_ID],
    ['demand', DEMAND_ID],
  ]

  for (const [type, id] of docs) {
    const positions = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    const drop = positions.filter((p) => p.assortment?.code === DROP_CODE)
    if (!drop.length) throw new Error(`${type}: ${DROP_CODE} not found`)
    if (drop.length > 1) throw new Error(`${type}: ${DROP_CODE} appears ${drop.length} times`)
    if (positions.some((p) => p.assortment?.code === ADD_CODE)) {
      throw new Error(`${type}: ${ADD_CODE} already present`)
    }
  }

  const item = await fetchAssortmentByCode(ADD_CODE)
  if (item.available < ADD_QTY) {
    throw new Error(`Insufficient ${ADD_CODE}: need ${ADD_QTY}, available ${item.available}`)
  }
  console.log(`  Drop ${DROP_CODE} Homecare 5000 ×1 @ 150`)
  console.log(`  Add  ${ADD_CODE} ${item.name} ×${ADD_QTY} @ ${ADD_AED} (avail ${item.available})`)
  console.log(`  New total: ${money(EXPECTED_SUM_MINOR)} AED unpaid`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const addPayload = [
    {
      quantity: ADD_QTY,
      price: Math.round(ADD_AED * 100),
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    },
  ]

  for (const [type, id] of docs) {
    const positions = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    for (const p of positions.filter((x) => x.assortment?.code === DROP_CODE)) {
      await api('DELETE', `/entity/${type}/${id}/positions/${p.id}`)
      console.log(`  deleted ${DROP_CODE} on ${type}`)
    }
    await api('POST', `/entity/${type}/${id}/positions`, addPayload)
    console.log(`  added ${ADD_CODE} on ${type}`)
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
      '2026-08-22: swapped 54475 PDRN 5000 @150 for 54467 PDRN mask pack ×1 @200. Invoice reissued.',
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
