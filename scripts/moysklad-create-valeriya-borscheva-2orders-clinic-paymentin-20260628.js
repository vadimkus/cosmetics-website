#!/usr/bin/env node

/**
 * Dr. Valeria Borscheva (existing, clinic prices) — TWO full retail cycles:
 *   each: order → invoice → shipment → paymentin → invoice PDF
 *
 * Prices = clinic salePrice from /report/stock/all (same basis as EZ mask order).
 *
 * Order 1 (475 AED):
 *   54457 Ultra Shield Sun Cream SPF50 50g  x1 @ 125
 *   00144 BB Cushion #2 Beige               x1 @ 150
 *   54467 Skin Reboot PDRN Mask Pack        x1 @ 200
 *
 * Order 2 (1535 AED — last 3 lines 100% discount):
 *   00059 EyeCell Eye Zone Care Kit (box)   x1 @ 490
 *   00030 All For Sensitive Serum 30ml      x1 @ 165
 *   54457 Ultra Shield Sun Cream SPF50 50g  x4 @ 125
 *   00189 Skin Rescue Overnight Cream Mask  x1 @ 170
 *   00034 Multi Functional Anti-Wrinkle Cream 250g x1 @ 210
 *   00140 Soothing Bomb Sea Algae Mask 23g  x1 @ 18  (100% off → 0)
 *   00063 Intensive Repair Collagen Mask 23g x1 @ 18 (100% off → 0)
 *   Excellent Delivery Dubai                x1 @ 45  (100% off → 0)
 *
 *   node --import dotenv/config scripts/moysklad-create-valeriya-borscheva-2orders-clinic-paymentin-20260628.js
 *   node --import dotenv/config scripts/moysklad-create-valeriya-borscheva-2orders-clinic-paymentin-20260628.js --commit
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
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const AGENT_ID = 'bcdf8073-9b47-11ee-0a80-13620011e787' // Dr. Valeria Borscheva

/** lines: [code, qty, discountPct]; delivery: {aed, discountPct} | null */
const ORDERS = [
  {
    nameSuffix: '9446A',
    marker: `VALERIYA-BORSCHEVA-ORDER1-CLINIC-${uaeToday()}`,
    lines: [
      ['54457', 1, 0],
      ['00144', 1, 0],
      ['54467', 1, 0],
    ],
    delivery: null,
  },
  {
    nameSuffix: '9446B',
    marker: `VALERIYA-BORSCHEVA-ORDER2-CLINIC-${uaeToday()}`,
    lines: [
      ['00059', 1, 0],
      ['00030', 1, 0],
      ['54457', 4, 0],
      ['00189', 1, 0],
      ['00034', 1, 0],
      ['00140', 1, 100],
      ['00063', 1, 100],
    ],
    delivery: { aed: 45, discountPct: 100 },
  },
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
const lineNet = (priceMinor, qty, discountPct) =>
  Math.round((priceMinor * qty * (100 - discountPct)) / 100)

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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && full.street) {
    return { country: { meta: full.country.meta }, city: full.city, street: full.street }
  }
  const addInfo = full?.addInfo || agent.actualAddress?.addInfo || ''
  return { country: countryHref(), city: 'Dubai', street: addInfo || 'UAE — Dr. Valeria Borscheva' }
}

/** aggregate stock need across both orders for a pre-flight availability check */
function totalNeed() {
  const need = new Map()
  for (const o of ORDERS) for (const [code, qty] of o.lines) need.set(code, (need.get(code) || 0) + qty)
  return need
}

function buildPositions(orderDef, stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, discountPct] of orderDef.lines) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    sumMinor += lineNet(item.price, qty, discountPct)
    positions.push({
      quantity: qty,
      price: item.price,
      discount: discountPct,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  if (orderDef.delivery) {
    const priceMinor = Math.round(orderDef.delivery.aed * 100)
    const dPct = orderDef.delivery.discountPct || 0
    sumMinor += lineNet(priceMinor, 1, dPct)
    positions.push({
      quantity: 1,
      price: priceMinor,
      discount: dPct,
      assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
      vat: 5,
      vatEnabled: true,
    })
  }
  return { positions, sumMinor }
}

async function ensureOrderNameFree(name) {
  const existing = await api('GET', `/entity/customerorder?filter=name=${encodeURIComponent(name)}&limit=1`)
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${name}`)
}
async function ensureNoDuplicateToday(marker, moment) {
  const date = moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
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
    throw new Error(`Invoice export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}
function ordersPdfPath(invoiceName) {
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  return path.join(ordersDir, `GENOSYS_Valeriya_Borscheva_${safe}.pdf`)
}

async function runCycle(orderDef, idx, agent, stock, shipmentAddressFull) {
  const name = `GENCardM${uaeShortDate()}${orderDef.nameSuffix}`
  const { positions, sumMinor } = buildPositions(orderDef, stock)

  console.log(`\n────────────────────────────────────────────────────────────`)
  console.log(`  ORDER ${idx + 1}: ${name}`)
  for (const [code, qty, discountPct] of orderDef.lines) {
    const item = stock.get(code)
    const disc = discountPct ? ` (−${discountPct}%)` : ''
    console.log(`    ${code} ${String(item.name).slice(0, 46).padEnd(46)} x${qty} @ ${money(item.price)}${disc}`)
  }
  if (orderDef.delivery) {
    const disc = orderDef.delivery.discountPct ? ` (−${orderDef.delivery.discountPct}%)` : ''
    console.log(`    Excellent Delivery Dubai x1 @ ${orderDef.delivery.aed.toFixed(2)}${disc}`)
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

  await ensureOrderNameFree(name)

  if (!COMMIT) return { name, sumMinor }

  await ensureNoDuplicateToday(orderDef.marker, uaeMomentNow())

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)
  const t3 = uaeMomentAddMinutes(5)

  const order = await api('POST', '/entity/customerorder', {
    name,
    moment: t0,
    description: [orderDef.marker, 'Clinic prices.', 'Chain: invoice → shipment → paymentin.'].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    positions,
  })
  console.log(`  1) Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  const invoice = await api('POST', '/entity/invoiceout', {
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
    description: `Invoice for ${name} | ${orderDef.marker}`,
    positions,
  })
  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

  const invPositions = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
  const demandPositions = invPositions.map((p) => ({
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
    description: `Shipment for ${invoice.name} / ${name} | ${orderDef.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: t3,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: `Incoming payment for shipment ${demand.name} / ${name} | ${orderDef.marker}`,
    sum: demand.sum,
    operations: [
      {
        meta: { href: `${API}/entity/demand/${demand.id}`, type: 'demand', mediaType: 'application/json' },
        linkedSum: demand.sum,
      },
    ],
  })
  console.log(`  4) Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  await api('PUT', `/entity/customerorder/${order.id}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const demandRead = await api('GET', `/entity/demand/${demand.id}`)
  console.log(`  ✓ Shipment payedSum: ${money(demandRead.payedSum)} / ${money(demandRead.sum)} AED`)

  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (pdfBuf) {
    const outPath = ordersPdfPath(invoice.name)
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`  PDF: ${outPath} (${pdfBuf.length} bytes)`)
  } else {
    console.warn('  PDF: MoySklad returned none — export from UI.')
  }
  return { name, sumMinor, order: order.name, invoice: invoice.name, demand: demand.name, payment: paymentIn.name }
}

async function main() {
  console.log('====================================================================')
  console.log('  Dr. Valeria Borscheva — 2 clinic full cycles (order→inv→ship→pay)')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name} (${agent.phone || '—'})`)

  const stock = await fetchStockByCode()
  const shipmentAddressFull = buildShipmentAddress(agent)

  // Pre-flight: combined availability across both orders
  for (const [code, need] of totalNeed()) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < need) {
      throw new Error(`Insufficient stock ${code} (${item.name}): need ${need}, have ${item.available}`)
    }
  }

  const results = []
  for (let i = 0; i < ORDERS.length; i++) {
    results.push(await runCycle(ORDERS[i], i, agent, stock, shipmentAddressFull))
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }
  console.log('\n  ✓ Both cycles posted.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
