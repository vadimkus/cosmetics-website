#!/usr/bin/env node

/**
 * Saba (miss Saba Yousuf) — retail SO → invoice → shipment → paymentin + landscape print.
 *
 *   00053 Eye Peptide Gel Patch (box) ×1 @ 380
 *   00054 Eye Contour Serum 10ml ×1 @ 370
 *   00021 Snow O₂ Cleanser 180ml ×1 @ 330
 *   54458 Hyaluron Cream 50g ×1 @ 290, 100% off (free)
 *   Delivery Dubai ×1 @ 45, 100% off (free)
 *   Total: 1,080 AED
 *
 *   Phone: +971 58 698 9508
 *
 *   node --import dotenv/config scripts/moysklad-create-saba-retail-order-invoice-demand-paymentin-20260726.js
 *   node --import dotenv/config scripts/moysklad-create-saba-retail-order-invoice-demand-paymentin-20260726.js --commit
 *   node --import dotenv/config scripts/moysklad-create-saba-retail-order-invoice-demand-paymentin-20260726.js --commit --no-print
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync, spawnSync } = require('child_process')

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
const NO_PRINT = process.argv.includes('--no-print')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const AGENT_ID = 'eba14483-615f-11f1-0a80-191f00328aeb' // miss Saba Yousuf

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const CUSTOMER = {
  name: 'miss Saba Yousuf',
  phone: '+971586989508',
  city: 'Dubai',
  street: 'UAE',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}SABA2`,
  moment: uaeMomentNow(),
  marker: `SABA-PATCHES-EYE-SERUM-CLEANSER-HYALURON-FREE-${uaeToday()}`,
}

/** [code, qty, retailAed, discountPct] */
const PRODUCT_LINES = [
  ['00053', 1, 380, 0],
  ['00054', 1, 370, 0],
  ['00021', 1, 330, 0],
  ['54458', 1, 290, 100],
]
const DELIVERY_AED = 45
const DELIVERY_DISCOUNT = 100
const EXPECTED_SUM_MINOR = 108000

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
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function lineNet(priceMinor, qty, discountPct) {
  return Math.round((priceMinor * qty * (100 - discountPct)) / 100)
}

function shipmentAddress() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }
  return stock
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`,
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday(agentId) {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(retailAed * 100)
    sumMinor += lineNet(priceMinor, qty, discountPct)
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: discountPct,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
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
    throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Saba_Yousuf_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

function printPdfLandscape(pdfPath) {
  if (process.platform !== 'darwin') {
    console.log(`  PDF saved (non-macOS): ${pdfPath}`)
    return
  }
  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status === 0 && whichLp.stdout.trim()) {
    try {
      execFileSync('lp', ['-o', 'orientation-requested=4', pdfPath], { stdio: 'inherit' })
      console.log('  Sent to printer (lp, landscape).')
      return
    } catch (e) {
      console.warn('  lp failed, opening PDF:', e.message)
    }
  }
  execFileSync('open', [pdfPath], { stdio: 'inherit' })
}

async function main() {
  console.log('====================================================================')
  console.log('  Saba — retail SO → invoice → shipment → paymentin + print')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name} | ${agent.phone || CUSTOMER.phone}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = shipmentAddress()

  console.log(`  Order: ${ORDER.name}`)
  for (const [code, qty, retailAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    const net = (retailAed * qty * (100 - discountPct)) / 100
    const disc = discountPct === 100 ? 'FREE' : 'retail'
    console.log(`    ${code} ${item.name.slice(0, 55)} x${qty} @ ${retailAed} ${disc} → ${net.toFixed(2)}`)
  }
  console.log(`    Delivery Dubai x1 @ ${DELIVERY_AED} FREE`)
  console.log(`  Total: ${money(sumMinor)} AED`)

  if (Math.abs(sumMinor - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Sum ${money(sumMinor)} != ${money(EXPECTED_SUM_MINOR)}`)
  }

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
    shared: true,
    description: [
      ORDER.marker,
      '00053 patches @380; 00054 eye serum @370; 00021 cleanser 180 @330; 54458 hyaluron cream FREE; delivery FREE.',
      `Phone ${CUSTOMER.phone}. Retail prices.`,
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions,
  })
  console.log(`\n  1) Order: ${order.name} | ${money(order.sum)} AED`)

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
    shipmentAddressFull: shipment,
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  })
  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
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
    shipmentAddressFull: shipment,
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
    description: `Incoming payment for shipment ${demand.name} / ${ORDER.name} | ${ORDER.marker}`,
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

  await api('PUT', `/entity/customerorder/${order.id}`, {
    meta: order.meta,
    state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
  })

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  if (pdfPath) {
    console.log(`\n  PDF: ${pdfPath}`)
    if (!NO_PRINT) printPdfLandscape(pdfPath)
    else console.log('  Skipping print (--no-print).')
  }

  console.log(`  Order:    https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
  console.log(`  Invoice:  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)
  console.log(`  Shipment: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  Payment:  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
