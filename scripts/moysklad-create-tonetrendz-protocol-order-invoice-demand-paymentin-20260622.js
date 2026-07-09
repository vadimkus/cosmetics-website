#!/usr/bin/env node

/**
 * TONETRENDZ — Personalized Skincare Protocol Page 2 (clinic prices, paid).
 * Order → invoice → shipment → paymentin.
 *
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-protocol-order-invoice-demand-paymentin-20260622.js
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-protocol-order-invoice-demand-paymentin-20260622.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const AGENT_ID = '74aa75cb-63db-11f1-0a80-111d001bbe72'
const STATE_PAID_AWAITING_DELIVERY_ID = '909556cd-8f70-11ea-0a80-016b00219616'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const ORDER = {
  name: `GENCardM${uaeShortDate()}2913`,
  moment: uaeMomentNow(),
  marker: `TONETRENDZ-PROTOCOL-P2-CLINIC-${uaeToday()}`,
}

const EXPECTED_TOTAL_AED = 1725

/** [code, qty, clinicAed VAT incl.] — protocol page 2 */
const PRODUCT_LINES = [
  ['54461', 1, 145], // Skin Defender Lip & Eye Makeup Remover 200ml
  ['00021', 1, 165], // Snow O₂ Cleanser 180ml
  ['00022', 1, 130], // Snow Booster Toner 200ml
  ['00195', 1, 165], // Moisture Replenishing Hyaluron Serum 30ml
  ['00191', 1, 165], // Multi Functional Anti-Wrinkle Serum 30ml
  ['54458', 1, 145], // Moisture Replenishing Hyaluron Cream 50g
  ['00190', 1, 145], // Multi Functional Anti-Wrinkle Cream 50g
  ['00189', 1, 170], // Skin Rescue Overnight Cream Mask 100g
  ['54457', 1, 125], // Ultra Shield Sun Cream SPF50 50g
  ['00054', 1, 185], // EyeCell Eye Contour Serum 10ml (kit half)
  ['00055', 1, 185], // EyeCell Eye Contour Cream 20ml (kit half)
]

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
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

function orgAccountHref(accountId) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${accountId}`,
      type: 'account',
      mediaType: 'application/json',
    },
  }
}

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }
  return stock
}

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && full.street) {
    return { country: { meta: full.country.meta }, city: full.city, street: full.street }
  }
  return {
    country: countryHref(),
    city: 'Dubai',
    street: 'JVC, Binghatti Azure, commercial unit',
  }
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  const needByCode = new Map()

  for (const [code, qty, clinicAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    needByCode.set(code, (needByCode.get(code) || 0) + qty)
    const priceMinor = Math.round(clinicAed * 100)
    sumMinor += qty * priceMinor
    positions.push({
      quantity: qty,
      price: priceMinor,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }

  for (const [code, need] of needByCode) {
    const item = stock.get(code)
    if (item.available < need) {
      throw new Error(`Insufficient stock ${code}: need ${need}, have ${item.available}`)
    }
  }

  return { positions, sumMinor }
}

async function ensureNoDuplicate() {
  const existing = await api('GET', `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`)
  if (existing?.rows?.length) throw new Error(`Order already exists: ${ORDER.name}`)
  const byMarker = await api(
    'GET',
    `/entity/customerorder?filter=description~${encodeURIComponent(ORDER.marker)}&limit=5`
  )
  if ((byMarker.rows || []).length) {
    throw new Error(`Duplicate marker today: ${byMarker.rows[0].name}`)
  }
}

async function exportInvoicePdf(invoiceId) {
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
    const t = await res.text()
    throw new Error(`Invoice export HTTP ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) return null
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  TONETRENDZ — protocol page 2 clinic order (paid full cycle)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name} | ${agent.phone || '—'}`)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty, clinicAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(`    ${code} ${item.name.slice(0, 48)} x${qty} @ ${clinicAed.toFixed(2)} AED`)
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

  if (Math.abs(sumMinor - Math.round(EXPECTED_TOTAL_AED * 100)) > 1) {
    throw new Error(`Total mismatch: ${money(sumMinor)} vs ${EXPECTED_TOTAL_AED.toFixed(2)}`)
  }

  await ensureNoDuplicate()

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = ORDER.moment
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)
  const t3 = uaeMomentAddMinutes(5)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    description: [
      ORDER.marker,
      'Personalized Skincare Protocol page 2 — clinic prices, paid.',
      'EyeCell kit = 00054 serum + 00055 cream @ 185 each.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_PAID_AWAITING_DELIVERY_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    positions,
  })
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agent.id),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
      positions,
    })
  } catch {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agent.id),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
  invoice = await api('GET', `/entity/invoiceout/${invoice.id}`)
  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)

  const invPos = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
  const demandPositions = invPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  const demand = await api('POST', '/entity/demand', {
    moment: t2,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: t3,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: `Paid — ${ORDER.name} / shipment ${demand.name} | ${ORDER.marker}`,
    sum: sumMinor,
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${demand.id}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: sumMinor,
      },
    ],
  })
  console.log(`  4) Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)

  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (pdfBuf) {
    const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
    fs.mkdirSync(ordersDir, { recursive: true })
    const outPath = path.join(ordersDir, `GENOSYS_TONETRENDZ_${invoice.name}.pdf`)
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`\n  PDF: ${outPath}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
