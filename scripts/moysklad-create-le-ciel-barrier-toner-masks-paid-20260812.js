#!/usr/bin/env node

/**
 * Le Ciel — fully paid clinic SO → invoice → shipment → paymentin + Legal_TAX PDF.
 *
 *   00037 Skin Barrier Protecting Cream 100g ×1 @ 225
 *   00145 Problem Control Toner 200ml ×1 @ 130
 *   00144 BB Cushion #2 Beige ×1 @ 150
 *   00140 Sea Algae (green) mask ×2 @ 18
 *   00063 Collagen (red) mask ×2 @ 18
 *   54457 Ultra Shield SPF50 ×1 @ 125
 *   Delivery Dubai ×1 @ 45, 100% discount (free — Le Ciel policy)
 *   Total: 702 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-le-ciel-barrier-toner-masks-paid-20260812.js
 *   node --import dotenv/config scripts/moysklad-create-le-ciel-barrier-toner-masks-paid-20260812.js --commit
 *   node --import dotenv/config scripts/moysklad-create-le-ciel-barrier-toner-masks-paid-20260812.js --commit --print
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const DO_PRINT = process.argv.includes('--print')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const AGENT_ID = 'd28b9ecf-44c0-11ef-0a80-0379001bda44' // LE CIEL BEAUTY SPOT …
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const ORDER = {
  name: `GENCardM${uaeShortDate()}CIEL702`,
  moment: uaeMomentNow(),
  marker: `LE-CIEL-BARRIER-TONER-MASKS-PAID-${uaeToday()}`,
}

/** [code, qty, clinicAed, discountPct] */
const PRODUCT_LINES = [
  ['00037', 1, 225, 0], // Skin Barrier 100g
  ['00145', 1, 130, 0], // Problem Control Toner 200ml
  ['00144', 1, 150, 0], // Beige cushion
  ['00140', 2, 18, 0], // Green = Sea Algae
  ['00063', 2, 18, 0], // Red = Collagen
  ['54457', 1, 125, 0], // Ultra Shield SPF50
]
const DELIVERY_AED = 45
const DELIVERY_DISCOUNT = 100
const EXPECTED_SUM_MINOR = 70200 // 225+130+150+36+36+125

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

function orgAccountHref(id) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function lineNet(priceMinor, qty, discountPct) {
  return Math.round((priceMinor * qty * (100 - discountPct)) / 100)
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
    return {
      country: { meta: full.country.meta },
      city: full.city,
      street: full.street,
      ...(full.addInfo ? {} : { addInfo: '' }),
    }
  }
  const addInfo = full?.addInfo || agent.actualAddress || ''
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: 'Dubai',
    street: addInfo || 'Al Wasl Rd, Block A, 1107',
    addInfo: '',
  }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`,
  )
  if (existing?.rows?.length) throw new Error(`Order name taken: ${ORDER.name}`)
}

async function ensureNoDuplicate(agentId) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate order ${dup.name} (${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, unitAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(unitAed * 100)
    sumMinor += lineNet(priceMinor, qty, discountPct)
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: discountPct,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
      _label: item.name,
      _avail: item.available,
    })
  }
  const deliveryMinor = Math.round(DELIVERY_AED * 100)
  sumMinor += lineNet(deliveryMinor, 1, DELIVERY_DISCOUNT)
  positions.push({
    quantity: 1,
    price: deliveryMinor,
    discount: DELIVERY_DISCOUNT,
    assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
  })
  return { positions, sumMinor }
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
  if (res.status === 412) return null
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
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Le_Ciel_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Le Ciel — barrier / toner / beige / masks / SPF50 — PAID')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicate(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`  Order: ${ORDER.name}`)
  for (const [code, qty, unitAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    const net = (unitAed * qty * (100 - discountPct)) / 100
    console.log(
      `    ${code} ${item.name.slice(0, 52)} x${qty} @ ${unitAed} → ${net.toFixed(2)} (avail ${item.available})`,
    )
  }
  console.log(`    Delivery Dubai x1 @ ${DELIVERY_AED} FREE (100% disc)`)
  console.log(`  Total: ${money(sumMinor)} AED`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const orderPositions = positions.map(
    ({ quantity, price, discount, assortment, vat, vatEnabled }) => ({
      quantity,
      price,
      discount,
      assortment,
      vat,
      vatEnabled,
    }),
  )

  const t0 = ORDER.moment
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)
  const t3 = uaeMomentAddMinutes(5)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    shared: true,
    applicable: true,
    description: [
      ORDER.marker,
      'Clinic: barrier 100g, problem toner 200, beige cushion, sea algae x2, collagen x2, SPF50; delivery FREE.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull,
    positions: orderPositions,
  })
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)}`)
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
      agent: href('counterparty', AGENT_ID),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
      positions: orderPositions,
    })
  } catch (e) {
    console.warn('  Invoice positions failed, link-only:', e.message.slice(0, 160))
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      customerOrder: href('customerorder', order.id),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    })
  }
  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)}`)
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
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)}`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: t3,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    sum: EXPECTED_SUM_MINOR,
    description: `Payment for ${demand.name} / ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    operations: [
      {
        meta: {
          href: `${API}/entity/demand/${demand.id}`,
          type: 'demand',
          mediaType: 'application/json',
        },
        linkedSum: EXPECTED_SUM_MINOR,
      },
    ],
  })
  console.log(`  4) Payment: ${paymentIn.name} | ${money(paymentIn.sum)}`)
  console.log(`     https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  await api('PUT', `/entity/customerorder/${order.id}`, {
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  if (pdfPath) {
    console.log(`\n  PDF: ${pdfPath}`)
    if (DO_PRINT) {
      try {
        execFileSync('lp', ['-o', 'orientation-requested=4', pdfPath], { stdio: 'inherit' })
        console.log('  Printed landscape')
      } catch (e) {
        execFileSync('open', [pdfPath], { stdio: 'inherit' })
      }
    }
  }

  const demandAfter = await api('GET', `/entity/demand/${demand.id}`)
  console.log(`\n  Verification: demand payed ${money(demandAfter.payedSum)} / ${money(demandAfter.sum)}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
