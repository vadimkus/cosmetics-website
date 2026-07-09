#!/usr/bin/env node

/**
 * Maryna Solomatina — fix partial web sync GENCardW2606176876 and post full chain.
 *
 * Website paid 2,801.80 AED (Stripe). Partial MoySklad order had only peeling + free masks (500 AED).
 * Replaces order lines with exploded beauty-box picks + correct retail/15% pricing.
 *
 *   node --import dotenv/config scripts/moysklad-create-maryna-solomatina-order-invoice-demand-paymentin-20260617.js
 *   node --import dotenv/config scripts/moysklad-create-maryna-solomatina-order-invoice-demand-paymentin-20260617.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const STATE_PAID_AWAITING_DELIVERY_ID = '909556cd-8f70-11ea-0a80-016b00219616'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const WEB_ORDER_NUMBER = 'GENCardW2606176876'
const TRASHED_ORDER_ID = '48c6afeb-6a25-11f1-0a80-193b00123943' // partial web sync — in MoySklad trash, do not edit
const AGENT_ID = '2ccdda69-de53-11f0-0a80-0b0a0021d47c' // Maryna Solomatina

const MARKER = `MARYNA-SOLOMATINA-${WEB_ORDER_NUMBER}-FULL-CHAIN-${uaeToday()}`
const EXPECTED_TOTAL_AED = 2801.8

const SHIPMENT = {
  city: 'Dubai',
  street: 'Umm Al Sheif, Emirates Oasis Villas Villa 67',
}

/** [code, qty, retailAed, discountPercent] — genosys.ae retail VAT-incl. */
const PRODUCT_LINES = [
  ['00021', 2, 330, 15], // Snow O₂ 180ml — both beauty boxes
  ['00022', 2, 260, 15], // Snow Booster 200ml
  ['00195', 1, 330, 15], // Hyaluron Serum — Deep Moisturizing box
  ['54458', 1, 290, 15], // Hyaluron Cream 50g — Deep Moisturizing box
  ['00191', 1, 330, 15], // Anti-Wrinkle Serum — Anti-Aging box
  ['00190', 1, 290, 15], // Anti-Wrinkle Cream 50g — Anti-Aging box
  ['00140', 3, 36, 15], // Sea Algae — 3 in Deep box
  ['00063', 5, 36, 15], // Collagen — 5 in Anti-Aging box
  ['00129', 2, 250, 0], // EPI Peeling Gel 100g — standalone
  ['00140', 1, 0, 0], // Sea Algae — promo free
  ['00063', 1, 0, 0], // Collagen — promo free
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

function lineTotalMinor(qty, priceMinor, discountPct) {
  return Math.round((qty * priceMinor * (100 - discountPct)) / 100)
}

function shipmentAddress() {
  return { country: countryHref(), city: SHIPMENT.city, street: SHIPMENT.street }
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

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  const needByCode = new Map()

  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    needByCode.set(code, (needByCode.get(code) || 0) + qty)
    const priceMinor = Math.round(retailAed * 100)
    sumMinor += lineTotalMinor(qty, priceMinor, discountPct)
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: discountPct,
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

async function clearPositions(entityType, entityId) {
  const rows = await fetchAll(`/entity/${entityType}/${entityId}/positions`)
  for (const row of rows) {
    await api('DELETE', `/entity/${entityType}/${entityId}/positions/${row.id}`)
  }
  return rows.length
}

async function addPositions(entityType, entityId, positions) {
  for (const pos of positions) {
    await api('POST', `/entity/${entityType}/${entityId}/positions`, pos)
  }
}

async function ensureNoExistingChain() {
  const activeOrder = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(WEB_ORDER_NUMBER)}&limit=1`
  )
  if (activeOrder?.rows?.length) {
    throw new Error(
      `Active order already exists: ${activeOrder.rows[0].name} (${activeOrder.rows[0].id})`
    )
  }

  for (const entity of ['invoiceout', 'demand', 'paymentin']) {
    const rows = await fetchAll(`/entity/${entity}?search=${encodeURIComponent(WEB_ORDER_NUMBER)}`)
    const linked = rows.filter(
      (r) =>
        !r.deleted &&
        r.applicable !== false &&
        ((r.description || '').includes(WEB_ORDER_NUMBER) ||
          (r.name || '').includes(WEB_ORDER_NUMBER))
    )
    if (linked.length) {
      throw new Error(`Already has ${entity}: ${linked.map((r) => r.name).join(', ')}`)
    }
  }

  const byMarker = await fetchAll(`/entity/invoiceout?search=${encodeURIComponent(MARKER)}`)
  const dup = byMarker.find((d) => !d.deleted && (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate invoice ${dup.name} (${dup.id})`)
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
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) {
    const t = await res.text()
    if (/33003|шаблон/i.test(t)) return null
    throw new Error(`Invoice export 412: ${t.slice(0, 600)}`)
  }
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
  return path.join(ordersDir, `GENOSYS_Maryna_Solomatina_${safe}.pdf`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Maryna Solomatina — fix order + invoice + shipment + paymentin')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Web order: ${WEB_ORDER_NUMBER} | paid ${EXPECTED_TOTAL_AED.toFixed(2)} AED`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Counterparty: ${agent.name} | ${agent.phone || '—'}`)

  const trashed = await api('GET', `/entity/customerorder/${TRASHED_ORDER_ID}`).catch(() => null)
  if (trashed?.deleted) {
    console.log(
      `  Note: partial web sync order ${trashed.name} is in MoySklad trash (${money(trashed.sum)} AED) — creating fresh chain`
    )
  }

  await ensureNoExistingChain()

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = shipmentAddress()

  if (Math.abs(sumMinor - Math.round(EXPECTED_TOTAL_AED * 100)) > 1) {
    throw new Error(`Total mismatch: built ${money(sumMinor)} vs expected ${EXPECTED_TOTAL_AED.toFixed(2)}`)
  }

  console.log('\n  Lines (exploded beauty boxes + peeling + promos):')
  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    const line = lineTotalMinor(qty, Math.round(retailAed * 100), discountPct)
    console.log(
      `    ${code} ${item.name} x${qty} @ ${retailAed.toFixed(2)}` +
        (discountPct ? ` −${discountPct}%` : '') +
        ` = ${money(line)} AED`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl. (free shipping)`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)
  const t3 = uaeMomentAddMinutes(5)

  const order = await api('POST', '/entity/customerorder', {
    name: WEB_ORDER_NUMBER,
    moment: t0,
    shared: true,
    description: [
      MARKER,
      `genosys.ae web order #${WEB_ORDER_NUMBER} | Stripe paid ${EXPECTED_TOTAL_AED.toFixed(2)} AED`,
      'Deep Moisturizing + Anti-Aging beauty boxes exploded to singles; EPI peeling x2; 2 promo masks.',
      `Ship to: ${shipment.street}, ${shipment.city}.`,
      `Replaces trashed partial sync ${TRASHED_ORDER_ID}.`,
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_PAID_AWAITING_DELIVERY_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
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
      shipmentAddressFull: shipment,
      description: `Invoice for ${WEB_ORDER_NUMBER} | ${MARKER}`,
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
      shipmentAddressFull: shipment,
      description: `Invoice for ${WEB_ORDER_NUMBER} | ${MARKER}`,
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  invoice = await api('GET', `/entity/invoiceout/${invoice.id}`)
  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

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
    shipmentAddressFull: shipment,
    description: `Shipment for ${invoice.name} / ${WEB_ORDER_NUMBER} | ${MARKER}`,
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
    description: `Stripe payment for ${WEB_ORDER_NUMBER} / shipment ${demand.name} | ${MARKER}`,
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
  console.log(`     https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  const demandRead = await api('GET', `/entity/demand/${demand.id}`)
  console.log('\n  Verification:')
  console.log(`    Order sum: ${money(order.sum)} AED`)
  console.log(`    Invoice sum: ${money(invoice.sum)} AED`)
  console.log(`    Shipment payedSum: ${money(demandRead.payedSum)} / ${money(demandRead.sum)} AED`)

  console.log('\n  Exporting invoice PDF...')
  const pdfBuf = await exportInvoicePdf(invoice.id)
  if (!pdfBuf) {
    console.warn('  MoySklad returned no PDF — open invoice in UI to export.')
    return
  }
  const outPath = ordersPdfPath(invoice.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)

  // Point website order at the new MoySklad customer order id
  try {
    const { PrismaClient } = require('@prisma/client')
    const dbUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
    let prisma
    if (dbUrl.startsWith('prisma+')) {
      prisma = new PrismaClient({ accelerateUrl: dbUrl })
    } else {
      const { PrismaPg } = require('@prisma/adapter-pg')
      const { Pool } = require('pg')
      prisma = new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: dbUrl })) })
    }
    await prisma.order.update({
      where: { orderNumber: WEB_ORDER_NUMBER },
      data: { moySkladOrderId: order.id, moySkladSyncedAt: new Date() },
    })
    await prisma.$disconnect()
    console.log(`\n  Website DB: moySkladOrderId → ${order.id}`)
  } catch (e) {
    console.warn(`  Website DB update skipped: ${e.message}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
