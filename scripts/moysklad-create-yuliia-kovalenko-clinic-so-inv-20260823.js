#!/usr/bin/env node

/**
 * Miss Yuliia Kovalenko — new customer + clinic SO + invoice (no shipment).
 * Reverses present write-off 00008-00504 so stock is not hit twice.
 *
 *   00122 Radiance Cream 50g ×1
 *   00037 Barrier Protecting Cream 100g ×1
 *   54466 Bio-Ferment 300g ×1
 *   54484 CERABARRIER 200ml ×1
 *   00189 Overnight Cream Mask 100g ×1
 *   00044 ND Cell 50ml ×1
 *   54467 PDRN Mask Pack ×1
 *   00012 Peptide Gel Mask ×5
 *   00143 Cushion Ivory ×1
 *   No delivery. Clinic оптовая. Unpaid.
 *
 *   Kiev, Rudanskogo 3a-44 · +380 99 181 1881
 *
 *   node --import dotenv/config scripts/moysklad-create-yuliia-kovalenko-clinic-so-inv-20260823.js
 *   node --import dotenv/config scripts/moysklad-create-yuliia-kovalenko-clinic-so-inv-20260823.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')
const { printPdfLandscape } = require('./lib/moysklad-print-pdf')

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
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const LOSS_ID = 'f4901e50-9ef5-11f1-0a80-14c10092d4bf'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const CUSTOMER = {
  name: 'Miss Yuliia Kovalenko',
  phone: '+380991811881',
  city: 'Kiev',
  street: 'Rudanskogo 3a - 44',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}YULI`,
  marker: `YULIIA-KOVALENKO-KIEV-CLINIC-${uaeToday()}`,
}

const PRODUCT_LINES = [
  ['00122', 1],
  ['00037', 1],
  ['54466', 1],
  ['54484', 1],
  ['00189', 1],
  ['00044', 1],
  ['54467', 1],
  ['00012', 5],
  ['00143', 1],
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

function phoneDigits(value) {
  return String(value || '').replace(/\D/g, '')
}

async function ukraineCountryId() {
  for (const q of ['Украина', 'Ukraine']) {
    const d = await api('GET', `/entity/country?search=${encodeURIComponent(q)}&limit=25`)
    const hit = (d.rows || []).find((r) => /украин|ukraine/i.test(r.name || ''))
    if (hit?.id) return hit.id
  }
  throw new Error('Ukraine country not found')
}

function shipmentAddress(countryId) {
  return {
    country: href('country', countryId),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
    addInfo: '',
  }
}

function customerPayload(countryId) {
  const ship = shipmentAddress(countryId)
  return {
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    companyType: 'individual',
    actualAddress: `${CUSTOMER.street}, ${CUSTOMER.city}, Ukraine`,
    actualAddressFull: ship,
    legalAddressFull: ship,
    description: `Kiev, ${CUSTOMER.street}. Phone ${CUSTOMER.phone}.`,
  }
}

function isThisCustomer(row) {
  const digits = phoneDigits(row.phone)
  const name = (row.name || '').toLowerCase()
  return digits.endsWith('991811881') || name.includes('yuliia kovalenko') || name.includes('yulia kovalenko')
}

async function findOrCreateCustomer(countryId) {
  for (const q of ['Yuliia Kovalenko', 'Yulia Kovalenko', '991811881', '0991811881']) {
    const d = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=25`)
    const hit = (d.rows || []).find(isThisCustomer)
    if (hit) {
      console.log(`  Customer exists: ${hit.name} (${hit.id})`)
      if (COMMIT) await api('PUT', `/entity/counterparty/${hit.id}`, customerPayload(countryId))
      return hit
    }
  }
  if (!COMMIT) {
    console.log(`  DRY RUN: would create ${CUSTOMER.name}`)
    return { id: 'DRY-RUN', name: CUSTOMER.name }
  }
  const created = await api('POST', '/entity/counterparty', customerPayload(countryId))
  console.log(`  Created customer: ${created.name} (${created.id})`)
  return created
}

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  const product = await api('GET', `/entity/product/${row.id}`)
  const wholesale = (product.salePrices || []).find((p) => p.priceType?.name === 'оптовая')
  if (!wholesale?.value) throw new Error(`No оптовая on ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
    clinicAed: wholesale.value / 100,
  }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`,
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
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
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

async function reversePresentWriteoff() {
  const loss = await api('GET', `/entity/loss/${LOSS_ID}`).catch(() => null)
  if (!loss) {
    console.log('  Write-off 00008-00504 already gone')
    return
  }
  console.log(`  Reverse loss ${loss.name} | ${money(loss.sum)} AED`)
  if (COMMIT) {
    await api('DELETE', `/entity/loss/${LOSS_ID}`)
    console.log('  Deleted present write-off 00008-00504')
  }
}

async function buildPositions() {
  const positions = []
  let sumMinor = 0
  for (const [code, qty] of PRODUCT_LINES) {
    const item = await fetchAssortmentByCode(code)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, available ${item.available}`)
    }
    const priceMinor = Math.round(item.clinicAed * 100)
    sumMinor += priceMinor * qty
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
      _code: code,
      _name: item.name,
      _avail: item.available,
      _aed: item.clinicAed,
    })
  }
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
  const out = path.join(ORDERS_DIR, `GENOSYS_Yuliia_Kovalenko_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Yuliia Kovalenko — clinic SO + invoice, Kiev, no ship')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const countryId = await ukraineCountryId()
  console.log(`  Country Ukraine: ${countryId}`)

  await reversePresentWriteoff()

  const agent = await findOrCreateCustomer(countryId)
  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicate(agent.id)

  const { positions, sumMinor } = await buildPositions()
  const shipment = shipmentAddress(countryId)

  console.log(`  Phone: ${CUSTOMER.phone}`)
  console.log(`  Ship: ${CUSTOMER.street}, ${CUSTOMER.city}, Ukraine`)
  console.log(`  Order: ${ORDER.name}`)
  for (const p of positions) {
    console.log(`    ${p._code} ${p._name} x${p.quantity} @ ${p._aed} (avail ${p._avail})`)
  }
  console.log(`  Total: ${money(sumMinor)} AED unpaid | SO + invoice only`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const cleanPositions = positions.map(({ quantity, price, discount, assortment, vat, vatEnabled }) => ({
    quantity,
    price,
    discount,
    assortment,
    vat,
    vatEnabled,
  }))

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(1)

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: t0,
    shared: true,
    description: [
      ORDER.marker,
      'Clinic оптовая. SO + invoice only, no shipment. Present write-off 00008-00504 reversed.',
      `Ship: ${CUSTOMER.street}, ${CUSTOMER.city}, Ukraine. Phone ${CUSTOMER.phone}.`,
    ].join('\n'),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions: cleanPositions,
  })
  if (order.sum !== sumMinor) throw new Error(`SO sum ${money(order.sum)} ≠ ${money(sumMinor)}`)
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
    positions: cleanPositions,
  })
  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})
  if (invoice.sum !== sumMinor) throw new Error(`Invoice sum ${money(invoice.sum)} ≠ ${money(sumMinor)}`)
  console.log(`  2) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)

  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  console.log(`  PDF: ${pdfPath}`)
  try {
    printPdfLandscape(pdfPath)
    console.log('  Printed landscape (orientation-requested=4)')
  } catch (e) {
    console.error(`  Print failed: ${e.message}`)
    execFileSync('open', [pdfPath], { stdio: 'inherit' })
  }

  console.log(`  Customer: https://online.moysklad.ru/app/#company/edit?id=${agent.id}`)
  console.log(`  Order:    https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
  console.log(`  Invoice:  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
