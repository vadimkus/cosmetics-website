#!/usr/bin/env node

/**
 * New customer + Заказ покупателя — Miss Yulia
 *
 * Products (custom unit prices AED VAT-inclusive):
 *   Snow O2 Cleanser 180ml x1 @ 360 with 10% discount
 *   Microbiome Mist 80ml x1 @ 160 with 10% discount
 * Delivery Dubai 45 AED (no discount)
 *
 * Dry-run:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-create-miss-yulia-order-20260505.js
 *
 * Commit:
 *   node scripts/moysklad-create-miss-yulia-order-20260505.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const STATE_NEW_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const DELIVERY_DUBAI_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'

const ORDER = {
  name: 'GENCardM2605051058',
  moment: '2026-05-05 18:00:00',
  marker: 'Miss Yulia manual order 2026-05-05',
}

const CUSTOMER = {
  // Disambiguated: another “Miss Yulia” exists with a different phone in MoySklad.
  name: 'Miss Yulia (0505509051)',
  phone: '+971505509051',
  email: '',
  street: 'Park Island, Fairfield, Apartment 605',
  city: 'Dubai',
}

const LINES = [
  { code: '00021', qty: 1, unitAed: 360, discountPercent: 10 },
  { code: '00188', qty: 1, unitAed: 160, discountPercent: 10 },
]

const DELIVERY_AED = 45

async function api(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(path) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const data = await api('GET', `${path}${sep}limit=${limit}&offset=${offset}`)
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

function moneyAedToMinor(aed) {
  return Math.round(aed * 100)
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    const id = row.meta?.href?.split('/').pop()?.split('?')[0]
    stock.set(row.code, { id, code: row.code, name: row.name })
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
    console.log(`  Found existing counterparty by phone: ${byPhone.rows[0].name} (${byPhone.rows[0].id})`)
    return byPhone.rows[0]
  }

  const byName = await api(
    'GET',
    `/entity/counterparty?filter=name=${encodeURIComponent(CUSTOMER.name)}&limit=5`
  )
  if (byName?.rows?.length) {
    const samePhone = byName.rows.find(
      (r) => (r.phone || '').replace(/\s/g, '') === cleanPhone
    )
    if (samePhone) {
      console.log(`  Found existing counterparty by name+phone: ${samePhone.name} (${samePhone.id})`)
      return samePhone
    }
    console.warn(
      `  WARN: name "${CUSTOMER.name}" exists but phone differs — creating disambiguated counterparty`
    )
  }

  if (!COMMIT) {
    console.log('  DRY RUN: would POST new counterparty', CUSTOMER.name, cleanPhone)
    return { id: 'DRY-RUN', meta: { href: `${API}/entity/counterparty/DRY-RUN`, type: 'counterparty' } }
  }

  const addr = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }

  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    phone: cleanPhone,
    ...(CUSTOMER.email ? { email: CUSTOMER.email } : {}),
    companyType: 'individual',
    description: `Created manual order ${ORDER.name}`,
    actualAddressFull: addr,
    legalAddressFull: addr,
  })
  console.log(`  Created counterparty: ${created.name} (${created.id})`)
  return created
}

async function ensureOrderNameFree() {
  const existing = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER.name)}&limit=1`
  )
  if (existing?.rows?.length) {
    throw new Error(`Order name already taken: ${ORDER.name}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad Miss Yulia — new customer + customer order')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  await ensureOrderNameFree()

  const cp = await findOrCreateCounterparty()
  const stock = await fetchStockByCode()

  const positions = []
  for (const line of LINES) {
    const item = stock.get(line.code)
    if (!item?.id) throw new Error(`Unknown product code: ${line.code}`)
    positions.push({
      quantity: line.qty,
      price: moneyAedToMinor(line.unitAed),
      discount: line.discountPercent,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
    console.log(
      `  Line: ${item.code} ${item.name} x${line.qty} @ ${line.unitAed} AED −${line.discountPercent}%`
    )
  }

  positions.push({
    quantity: 1,
    price: moneyAedToMinor(DELIVERY_AED),
    discount: 0,
    assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
    vat: 5,
    vatEnabled: true,
  })
  console.log(`  Line: Excellent Delivery Dubai x1 @ ${DELIVERY_AED} AED`)

  const subAfterDisc =
    LINES.reduce((s, l) => s + l.unitAed * l.qty * (1 - l.discountPercent / 100), 0) + DELIVERY_AED
  console.log(`  Expected total (products after % + delivery): ${subAfterDisc.toFixed(2)} AED VAT-incl.`)

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit.')
    return
  }

  const payload = {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [
      ORDER.marker,
      'Manual genosys.ae-style order',
      '10% discount on Snow Cleanser + Mist only; delivery full price',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', cp.id),
    store: href('store', STORE_ID),
    state: {
      meta: {
        href: `${API}/entity/customerorder/metadata/states/${STATE_NEW_ID}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
    vatEnabled: true,
    vatIncluded: true,
    rate: {
      currency: href('currency', CURRENCY_ID),
    },
    shipmentAddressFull: {
      country: countryHref(),
      city: CUSTOMER.city,
      street: CUSTOMER.street,
    },
    positions,
  }

  const created = await api('POST', '/entity/customerorder', payload)
  console.log()
  console.log(`  Created order: ${created.name} | sum=${(created.sum / 100).toFixed(2)} AED`)
  console.log(`  ID: ${created.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#customerorder/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
