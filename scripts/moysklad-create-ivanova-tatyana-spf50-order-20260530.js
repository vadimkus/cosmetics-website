#!/usr/bin/env node

/**
 * Miss Ivanova Tatyana — new customer + customer order ONLY (no invoice).
 *
 * Phone: +971586949943 | Beach Vista, Tower 2, Dubai
 * Ultra Shield SPF50 (54457) ×20 @ 250 AED each. No delivery.
 *
 *   node --import dotenv/config scripts/moysklad-create-ivanova-tatyana-spf50-order-20260530.js
 *   node --import dotenv/config scripts/moysklad-create-ivanova-tatyana-spf50-order-20260530.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const CUSTOMER = {
  name: 'Miss Ivanova Tatyana',
  phone: '+971586949943',
  city: 'Dubai',
  street: 'Beach Vista, Tower 2',
}

const ORDER_SUFFIX = '9943'

const ORDER = {
  name: `GENCardM${uaeShortDate()}${ORDER_SUFFIX}`,
  moment: uaeMomentNow(),
  marker: `Ivanova Tatyana SPF50 x20 Beach Vista ${uaeToday()}`,
}

/** code, qty, unit AED VAT-incl. */
const PRODUCT_LINES = [
  ['54457', 20, 250], // Ultra Shield Sun Cream SPF50/PA++++ 50g
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
    })
  }
  return stock
}

async function findOrCreateCounterparty() {
  const cleanPhone = CUSTOMER.phone.replace(/\s/g, '')
  const byPhone = await api(
    'GET',
    `/entity/counterparty?filter=phone=${encodeURIComponent(cleanPhone)}&limit=5`
  )
  if (byPhone?.rows?.length) {
    const cp = byPhone.rows[0]
    console.log(`  Counterparty (existing phone): ${cp.name} (${cp.id})`)
    return cp
  }

  const byName = await api(
    'GET',
    `/entity/counterparty?filter=${encodeURIComponent(`name=${CUSTOMER.name}`)}&limit=5`
  )
  const exact = (byName?.rows || []).find((r) => r.name === CUSTOMER.name)
  if (exact) {
    console.log(`  Counterparty (existing name): ${exact.name} (${exact.id})`)
    return exact
  }

  if (!COMMIT) {
    console.log(`  DRY RUN: would create counterparty "${CUSTOMER.name}" ${cleanPhone}`)
    return { id: 'DRY-RUN', name: CUSTOMER.name, meta: { href: `${API}/entity/counterparty/DRY-RUN` } }
  }

  const addr = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    phone: cleanPhone,
    companyType: 'individual',
    description: `Retail customer — Beach Vista Tower 2, created with order ${ORDER.name}`,
    actualAddressFull: addr,
    legalAddressFull: addr,
  })
  console.log(`  Counterparty (created): ${created.name} (${created.id})`)
  return created
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
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
  if (dup) throw new Error(`Duplicate protection: order exists (${dup.name}, id=${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, unitAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const priceMinor = Math.round(unitAed * 100)
    sumMinor += priceMinor * qty
    positions.push({
      quantity: qty,
      price: priceMinor,
      discount: 0,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  return { positions, sumMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Ivanova Tatyana — new customer + order (no invoice)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await findOrCreateCounterparty()
  await ensureOrderNameFree()
  if (COMMIT && agent.id !== 'DRY-RUN') await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)

  console.log(`  Order name: ${ORDER.name}`)
  console.log(`  Phone: ${CUSTOMER.phone}`)
  console.log(`  Address: ${CUSTOMER.street}, ${CUSTOMER.city}`)
  console.log()
  for (const [code, qty, unitAed] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(
      `    ${code} ${item.name.slice(0, 52)} x${qty} @ ${unitAed.toFixed(2)} AED → ${(unitAed * qty).toFixed(2)}`
    )
  }
  console.log(`  Expected sum: ${money(sumMinor)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log('\n  DRY RUN complete. Re-run with --commit.')
    return
  }

  const orderPayload = {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [
      ORDER.marker,
      'Ultra Shield SPF50 54457 x20 @ 250 AED each. Order only — no invoice yet.',
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
    shipmentAddressFull: {
      country: countryHref(),
      city: CUSTOMER.city,
      street: CUSTOMER.street,
    },
    positions,
  }

  const order = await api('POST', '/entity/customerorder', orderPayload)
  console.log()
  console.log(`  Created order: ${order.name} | ${(order.sum / 100).toFixed(2)} AED | id=${order.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
