#!/usr/bin/env node

/**
 * Royal Nordic Beauty Salon — new customer + clinic SO → invoice → shipment (+ PDF).
 *
 * Paid (clinic list):
 *   Snow O₂ Cleanser 500ml ×1 @ 255
 *   Snow Booster Toner 1000ml ×1 @ 245
 *   Intensive Hydro Soothing Cream 250g ×1 @ 210
 *   SRS peeling vial 2ml ×10 @ 40.50
 * FOC:
 *   Collagen mask ×2, Sea Algae ×2, Peptide mask ×2, EZ CO₂ box ×1,
 *   BIO-MESO PDRN Expert 60000 ×1, Delivery Dubai ×1
 * Total: 1,115 AED (unpaid)
 *
 *   node --import dotenv/config scripts/moysklad-create-royal-nordic-clinic-order-20260801.js
 *   node --import dotenv/config scripts/moysklad-create-royal-nordic-clinic-order-20260801.js --commit
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
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'

const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const CUSTOMER = {
  name: 'Royal Nordic Beauty Salon',
  phone: '+971528080567',
  city: 'Dubai',
  street: 'La Plage, Jumeirah 2, 108-0, DM # 342-766',
  trn: '100333047700003',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}0567`,
  moment: uaeMomentNow(),
  marker: `ROYAL-NORDIC-CLINIC-OPENING-${uaeToday()}`,
}

/** [code, qty, clinicAed, discountPct] */
const PRODUCT_LINES = [
  ['00024', 1, 255, 0], // Snow O₂ Cleanser 500ml
  ['00025', 1, 245, 0], // Snow Booster Toner 1000ml
  ['00032', 1, 210, 0], // Intensive Hydro Soothing Cream 250g
  ['00015', 10, 40.5, 0], // SRS peeling vial 2ml
  ['00063', 2, 18, 100], // Collagen mask FOC
  ['00140', 2, 18, 100], // Sea Algae FOC
  ['00012', 2, 38, 100], // Peptide Gel Mask FOC
  ['00011', 1, 230, 100], // EZ CO₂ MASK box FOC
  ['54470', 1, 300, 100], // BIO-MESO PDRN Expert 60000 FOC
]
const DELIVERY_AED = 45
const DELIVERY_DISCOUNT = 100
const EXPECTED_SUM_MINOR = 111500 // 255+245+210+405

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
    addInfo: '',
  }
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function findExistingCounterparty() {
  for (const q of [CUSTOMER.phone, CUSTOMER.name, 'Royal Nordic']) {
    const d = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=15`)
    const hit = (d.rows || []).find(
      (r) =>
        r.name === CUSTOMER.name ||
        String(r.phone || '').replace(/\D/g, '').endsWith('528080567') ||
        /royal\s*nordic/i.test(r.name || ''),
    )
    if (hit) return hit
  }
  return null
}

async function findOrCreateCounterparty() {
  const existing = await findExistingCounterparty()
  const addr = shipmentAddress()
  if (existing) {
    console.log(`  Customer exists: ${existing.name} (${existing.id})`)
    if (COMMIT) {
      await api('PUT', `/entity/counterparty/${existing.id}`, {
        name: CUSTOMER.name,
        phone: CUSTOMER.phone,
        companyType: 'legal',
        actualAddress: `${CUSTOMER.street}, Dubai`,
        legalAddress: `${CUSTOMER.street}, Dubai`,
        actualAddressFull: addr,
        legalAddressFull: { ...addr, comment: CUSTOMER.trn },
        description: [
          `Salon — ${CUSTOMER.street}, Dubai.`,
          `Phone ${CUSTOMER.phone}. VAT TRN ${CUSTOMER.trn}.`,
          'Face Room field layout: legalAddressFull.comment = TRN.',
        ].join(' '),
      })
    }
    return existing
  }
  if (!COMMIT) {
    console.log(`  DRY RUN: would create ${CUSTOMER.name}`)
    return { id: 'DRY-RUN', name: CUSTOMER.name }
  }
  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    companyType: 'legal',
    actualAddress: `${CUSTOMER.street}, Dubai`,
    legalAddress: `${CUSTOMER.street}, Dubai`,
    actualAddressFull: addr,
    legalAddressFull: { ...addr, comment: CUSTOMER.trn },
    description: [
      `Salon — ${CUSTOMER.street}, Dubai.`,
      `Phone ${CUSTOMER.phone}. VAT TRN ${CUSTOMER.trn}.`,
      'Face Room field layout: legalAddressFull.comment = TRN. No trade license # on file yet.',
    ].join(' '),
  })
  console.log(`  Created customer: ${created.name} (${created.id})`)
  return created
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`,
  )
  if (existing?.rows?.length) throw new Error(`Order name taken: ${ORDER.name}`)
}

async function ensureNoDuplicate(agentId) {
  if (agentId === 'DRY-RUN') return
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
  for (const [code, qty, clinicAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(clinicAed * 100)
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
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Royal_Nordic_${invoiceName}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Royal Nordic Beauty Salon — clinic order')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await findOrCreateCounterparty()
  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicate(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipment = shipmentAddress()

  console.log(`  Order: ${ORDER.name}`)
  console.log(`  Ship: ${CUSTOMER.street}, Dubai`)
  console.log(`  Phone: ${CUSTOMER.phone} | TRN: ${CUSTOMER.trn}`)
  for (const [code, qty, clinicAed, discountPct] of PRODUCT_LINES) {
    const item = stock.get(code)
    const net = (clinicAed * qty * (100 - discountPct)) / 100
    const tag = discountPct === 100 ? 'FREE' : 'clinic'
    console.log(
      `    ${code} ${item.name.slice(0, 48)} x${qty} @ ${clinicAed} ${tag} → ${net.toFixed(2)} (avail ${item.available})`,
    )
  }
  console.log(`    Delivery Dubai x1 @ ${DELIVERY_AED} FREE`)
  console.log(`  Total: ${money(sumMinor)} AED (unpaid)`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = ORDER.moment
  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    shared: true,
    description: [
      ORDER.marker,
      'Clinic list: cleanser500 + booster1000 + hydro250 + SRS×10 paid.',
      'FOC: collagen×2, sea algae×2, peptide×2, EZ CO₂ box, PDRN60000 box, delivery.',
      `Ship: ${CUSTOMER.street}, Dubai. Phone ${CUSTOMER.phone}. TRN ${CUSTOMER.trn}.`,
      'State: New — unpaid (no paymentin).',
    ].join('\n'),
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
    description: `Shipment from invoice ${invoice.name} / ${ORDER.name} | ${ORDER.marker}`,
    positions: demandPositions,
  })
  console.log(`  3) Shipment: ${demand.name} | ${money(demand.sum)} AED`)

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  console.log(`\n  PDF: ${pdfPath}`)
  console.log(`  Order:    https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
  console.log(`  Invoice:  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)
  console.log(`  Shipment: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  Customer: https://online.moysklad.ru/app/#company/edit?id=${agent.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
