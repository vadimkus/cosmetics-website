#!/usr/bin/env node

/**
 * Miss Sarayounesskin Sara (Elyazia Beauty Center / Elyzium) — order + invoice.
 *
 * Bio Meso PDRN 60000 (54470) ×2 paid + ×1 FOC,
 * Hydro Cool Modeling Mask 1kg (00013) ×1,
 * Ivory cushion (00143) ×1 @ clinic salePrice.
 *
 *   node --import dotenv/config scripts/moysklad-create-elyzium-order-invoice-20260601.js
 *   node --import dotenv/config scripts/moysklad-create-elyzium-order-invoice-20260601.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const PDRN_CODE = '54470' // BIO-MESO PDRN Expert Ampoule 60000

const AGENT_ID = 'b852cef4-183e-11f1-0a80-19e6000a846f' // Miss Sarayounesskin Sara

const CUSTOMER = {
  name: 'Miss Sarayounesskin Sara',
  phone: '+971501712883',
  city: 'Dubai',
  street: 'Elyazia Beauty Center, Street 15 Villa 57B - Mirdif - Dubai',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}4891`,
  moment: uaeMomentNow(),
  marker: `Sarayounesskin Sara Elyzium PDRN60000 order invoice ${uaeToday()}`,
}

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=${limit}&offset=${offset}`)
    const batch = data?.rows || []
    rows.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return rows
}

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
}

function countryHref() {
  return {
    meta: {
      href: `${API}/entity/country/${COUNTRY_UAE_ID}`,
      type: 'country',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    const id = row.meta?.href?.split('/').pop()?.split('?')[0]
    stock.set(row.code, {
      id,
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function loadCounterparty() {
  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (agent.name !== CUSTOMER.name) {
    console.warn(`  WARN: counterparty name is "${agent.name}"`)
  }
  console.log(`  Counterparty: ${agent.name} (${agent.id}) | ${agent.phone || CUSTOMER.phone}`)
  return agent
}

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && full.street) {
    return {
      country: { meta: full.country.meta },
      city: full.city,
      street: full.street,
    }
  }
  return {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length) throw new Error(`Order name already taken: ${ORDER.name}`)
}

async function ensureNoDuplicateToday(agentId) {
  if (agentId === 'DRY-RUN') return
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${ORDER.moment.slice(0, 10)} 00:00:00`,
    `moment<=${ORDER.moment.slice(0, 10)} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

function buildPositions(stock) {
  const pdrn = stock.get(PDRN_CODE)
  const mask = stock.get('00013')
  const cushion = stock.get('00143')
  if (!pdrn?.id || !pdrn.price) throw new Error(`Missing ${PDRN_CODE} or salePrice`)
  if (!mask?.id || !mask.price) throw new Error('Missing 00013 or salePrice')
  if (!cushion?.id || !cushion.price) throw new Error('Missing 00143 or salePrice')
  if (pdrn.available < 3) throw new Error(`Insufficient PDRN: need 3, have ${pdrn.available}`)
  if (mask.available < 1) throw new Error(`Insufficient 00013: have ${mask.available}`)
  if (cushion.available < 1) throw new Error(`Insufficient 00143: have ${cushion.available}`)

  const positions = [
    {
      quantity: 2,
      price: pdrn.price,
      discount: 0,
      assortment: href('product', pdrn.id),
      vat: 5,
      vatEnabled: true,
    },
    {
      quantity: 1,
      price: pdrn.price,
      discount: 100,
      assortment: href('product', pdrn.id),
      vat: 5,
      vatEnabled: true,
    },
    {
      quantity: 1,
      price: mask.price,
      discount: 0,
      assortment: href('product', mask.id),
      vat: 5,
      vatEnabled: true,
    },
    {
      quantity: 1,
      price: cushion.price,
      discount: 0,
      assortment: href('product', cushion.id),
      vat: 5,
      vatEnabled: true,
    },
  ]

  const paidMinor = 2 * pdrn.price + mask.price + cushion.price
  return { positions, paidMinor, pdrn, mask, cushion }
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Sarayounesskin Sara — order + invoice (Elyzium/Elyazia)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await loadCounterparty()
  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, paidMinor, pdrn, mask, cushion } = buildPositions(stock)
  const shipment = buildShipmentAddress(agent)

  console.log(`  Order: ${ORDER.name}`)
  console.log(`    ${PDRN_CODE} ${pdrn.name.slice(0, 50)} x2 @ ${money(pdrn.price)}`)
  console.log(`    ${PDRN_CODE} x1 FOC (100% discount)`)
  console.log(`    00013 ${mask.name.slice(0, 50)} x1 @ ${money(mask.price)}`)
  console.log(`    00143 ${cushion.name.slice(0, 50)} x1 @ ${money(cushion.price)}`)
  console.log(`  Expected paid total: ${money(paidMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [
      ORDER.marker,
      'PDRN 60000 x2 paid + x1 FOC; Hydro Cool mask 1kg; Ivory cushion.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: {
      meta: {
        href: `${API}/entity/customerorder/metadata/states/${STATE_NEW_ORDER_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions,
  })
  console.log(`\n  Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)

  const invPayload = {
    moment: ORDER.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    customerOrder: href('customerorder', order.id),
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    description: `Invoice for ${ORDER.name} | ${ORDER.marker}`,
    positions,
  }

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  } catch (e) {
    console.warn('  Invoice positions retry:', e.message.slice(0, 160))
    delete invPayload.positions
    invoice = await api('POST', '/entity/invoiceout', invPayload)
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/states/${INVOICE_STATE_ISSUED_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
  }).catch(() => {})

  console.log(`  Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
