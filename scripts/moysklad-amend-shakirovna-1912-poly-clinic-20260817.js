#!/usr/bin/env node

/**
 * GENCardM260812MAR1912 / inv 04932 / ship 06685
 * Keep existing lines. Add catalogue ticks. Switch agent to
 * SHAKIROVNA POLY CLINIC L.L.C. Re-export Legal_TAX → ~/Desktop/orders/
 *
 * Already on order (keep): 00024 ×1, 00025 ×1, 00011 ×1, 00012 ×5
 * Add:
 *   54461 Defender 200ml ×1 @ 145
 *   00183 Problem Control Toner 500ml ×1 @ 245
 *   00140 Sea Algae ×10 @ 18
 *   54465 Post Cream 100g ×1 @ 220
 *   54460 Hyaluron Cream 250g ×1 @ 210
 *   00036 Problem Control Cream 250g ×1 @ 210
 *   00041 Multi Sun SPF40 ×1 @ 105
 *   00015 SRS vial ×10 @ 40.5
 *   New + old = 2,640 AED
 *
 *   node --import dotenv/config scripts/moysklad-amend-shakirovna-1912-poly-clinic-20260817.js
 *   node --import dotenv/config scripts/moysklad-amend-shakirovna-1912-poly-clinic-20260817.js --commit
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
const NEW_AGENT_ID = '932f00c5-96e0-11f1-0a80-0d9b001a5a79'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const OLD_SUM_MINOR = 92000
const EXPECTED_SUM_MINOR = 264000

/** [code, qty, clinicAed] — not already on the order */
const ADD_LINES = [
  ['54461', 1, 145],
  ['00183', 1, 245],
  ['00140', 10, 18],
  ['54465', 1, 220],
  ['54460', 1, 210],
  ['00036', 1, 210],
  ['00041', 1, 105],
  ['00015', 10, 40.5],
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

function shipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.city && full?.street) {
    return {
      country: full.country?.meta ? { meta: full.country.meta } : href('country', COUNTRY_UAE_ID),
      city: full.city,
      street: full.street,
      addInfo: [full.street, full.city, 'United Arab Emirates'].filter(Boolean).join(', '),
    }
  }
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: 'Dubai',
    street: 'Wharf 1, Marina Promenade, Shop S8, Dubai Marina',
    addInfo: 'Wharf 1, Marina Promenade, Shop S8, Dubai Marina, Dubai, United Arab Emirates',
  }
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
  console.log('  MAR1912 → SHAKIROVNA POLY CLINIC + catalogue adds')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand, agent] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=agent,state`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=agent`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
    api('GET', `/entity/counterparty/${NEW_AGENT_ID}`),
  ])
  console.log(`  SO ${order.name} ${money(order.sum)} ${order.agent?.name || ''} ${order.state?.name || ''}`)
  console.log(`  INV ${invoice.name} ${money(invoice.sum)} payed ${money(invoice.payedSum)}`)
  console.log(`  SHIP ${demand.name} ${money(demand.sum)} SO-link ${!!demand.customerOrder}`)
  console.log(`  New owner: ${agent.name}`)
  if ((invoice.payedSum || 0) > 0) throw new Error('Invoice has payment — stop')
  if (demand.customerOrder) throw new Error('Demand has customerOrder — stop')
  if ((order.sum || 0) !== OLD_SUM_MINOR) {
    throw new Error(`Expected current SO ${money(OLD_SUM_MINOR)}, got ${money(order.sum)}`)
  }

  const existing = await fetchAll(`/entity/customerorder/${ORDER_ID}/positions?expand=assortment`)
  const have = new Set(existing.map((p) => p.assortment?.code))
  console.log('  Keep:')
  for (const p of existing) {
    console.log(`    ${p.assortment?.code} ${p.assortment?.name} x${p.quantity} @ ${money(p.price)}`)
  }

  const addPayloads = []
  let addMinor = 0
  console.log('  Add:')
  for (const [code, qty, clinicAed] of ADD_LINES) {
    if (have.has(code)) throw new Error(`${code} already on order — refuse duplicate`)
    const item = await fetchAssortmentByCode(code)
    if (item.available < qty) {
      console.log(`    WARN stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(clinicAed * 100)
    addMinor += priceMinor * qty
    addPayloads.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
    console.log(`    ${code} ${item.name.slice(0, 52)} x${qty} @ ${clinicAed} (avail ${item.available})`)
  }
  const nextMinor = OLD_SUM_MINOR + addMinor
  console.log(`  After: ${money(nextMinor)} AED`)
  if (nextMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Expected ${money(EXPECTED_SUM_MINOR)}, got ${money(nextMinor)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const ship = shipmentAddress(agent)
  const note = [
    order.description || '',
    '2026-08-17: owner → SHAKIROVNA POLY CLINIC L.L.C. Added catalogue ticks (defender, PCT 500, sea algae ×10, postcream 100g, hyaluron 250, PC cream 250, SPF40, SRS ×10). Old lines kept.',
  ]
    .filter(Boolean)
    .join('\n')

  for (const [type, id] of [
    ['customerorder', ORDER_ID],
    ['invoiceout', INVOICE_ID],
    ['demand', DEMAND_ID],
  ]) {
    const doc = await api('GET', `/entity/${type}/${id}`)
    await api('PUT', `/entity/${type}/${id}`, {
      meta: doc.meta,
      agent: href('counterparty', NEW_AGENT_ID),
      shipmentAddressFull: ship,
      description: type === 'customerorder' ? note : doc.description,
    })
    console.log(`  owner updated ${type}`)
  }

  for (const [type, id] of [
    ['customerorder', ORDER_ID],
    ['invoiceout', INVOICE_ID],
    ['demand', DEMAND_ID],
  ]) {
    await api('POST', `/entity/${type}/${id}/positions`, addPayloads)
    console.log(`  lines added ${type}`)
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
  if (shipAfter.customerOrder) throw new Error('Demand picked up customerOrder')

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`  After: ${money(EXPECTED_SUM_MINOR)} AED unpaid`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
