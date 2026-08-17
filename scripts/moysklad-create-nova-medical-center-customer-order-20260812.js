#!/usr/bin/env node

/**
 * NOVA MEDICAL CENTER (Al Ain) — new counterparty + clinic SO.
 *
 * Source: Abu Dhabi Economic Licence CN-1212562 (screenshot 2026-08-12).
 * Trade name NOVA MEDICAL CENTER · Establishment · Al Muwaiji, Al Ain.
 *
 * Lines (clinic salePrice):
 *   00024 Snow O₂ Cleanser 500ml ×1
 *   00025 Snow Booster Toner 1000ml ×1
 *   00183 Problem Control Toner 500ml ×1
 *   00032 Intensive Hydro Soothing Cream 250g ×1
 *   00036 Intensive Problem Control Cream 250g ×1
 *   54465 Soothing Repair Post Cream 100g ×1
 *   54457 Ultra Shield SPF50 ×1
 *   00188 Microbiome Energy Mist 80ml ×1
 *   00063 Collagen Mask ×10
 *   00140 Sea Algae Mask ×10
 *   54467 Skin Reboot PDRN Mask Pack ×1
 *   00013 Hydro Cool Modeling Mask 1kg ×1
 *   Expected total: 2,450 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-nova-medical-center-customer-order-20260812.js
 *   node --import dotenv/config scripts/moysklad-create-nova-medical-center-customer-order-20260812.js --commit
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
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const ADDRESS =
  'Scope Investment Building, 2nd Floor, Al Muwaiji, Al Ain, Abu Dhabi, UAE'

const CUSTOMER = {
  name: 'NOVA MEDICAL CENTER',
  phone: '+971506914962',
  contactEmail: 'aljaziraenterprise@yahoo.com',
  licenseNo: 'CN-1212562',
  unifiedRegNo: '101-2021-100040598',
  unifiedLicenceNo: '501-2011-100087420',
  owner: 'MUBARAK SALEM OWAIDA JABER ALKHYELI',
  legalForm: 'Establishment',
  licenseExpiry: '05/05/2026',
  city: 'Al Ain',
  street: ADDRESS,
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}NOVA`,
  moment: uaeMomentNow(),
  marker: `NOVA-MEDICAL-CENTER-OPENING-SO-${uaeToday()}`,
}

/** [code, qty] — clinic list from MoySklad salePrice */
const PRODUCT_LINES = [
  ['00024', 1], // Snow O₂ Cleanser 500ml
  ['00025', 1], // Snow Booster Toner 1000ml
  ['00183', 1], // Problem Control Toner 500ml
  ['00032', 1], // Intensive Hydro Soothing Cream 250g
  ['00036', 1], // Intensive Problem Control Cream 250g
  ['54465', 1], // Soothing Repair Post Cream 100g
  ['54457', 1], // Ultra Shield SPF50
  ['00188', 1], // Microbiome Energy Mist
  ['00063', 10], // Collagen Mask
  ['00140', 10], // Sea Algae Mask
  ['54467', 1], // Skin Reboot PDRN Mask Pack
  ['00013', 1], // Hydro Cool Modeling Mask 1kg
]

const EXPECTED_TOTAL_AED = 2450

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
  const cleanPhone = CUSTOMER.phone.replace(/\s/g, '')
  const byPhone = await api(
    'GET',
    `/entity/counterparty?filter=phone=${encodeURIComponent(cleanPhone)}&limit=5`,
  )
  if (byPhone?.rows?.length) return { cp: byPhone.rows[0], reason: 'phone' }

  const byName = await api(
    'GET',
    `/entity/counterparty?filter=name=${encodeURIComponent(CUSTOMER.name)}&limit=5`,
  )
  const exact = (byName?.rows || []).find((r) => r.name === CUSTOMER.name)
  if (exact) return { cp: exact, reason: 'name' }

  // Exact name only — do NOT fuzzy-match "NOVA MEDICAL" (hits Skinova medical complex).
  for (const q of ['CN-1212562', 'aljaziraenterprise@yahoo.com', '+971506914962']) {
    const bySearch = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=15`)
    const hit = (bySearch?.rows || []).find((r) => r.name === CUSTOMER.name)
    if (hit) return { cp: hit, reason: `search:${q}` }
  }
  return null
}

async function findOrCreateCounterparty() {
  const existing = await findExistingCounterparty()
  if (existing) {
    console.log(`  Found existing (${existing.reason}): ${existing.cp.name} (${existing.cp.id})`)
    return existing.cp
  }

  const payload = {
    name: CUSTOMER.name,
    companyType: 'legal',
    phone: CUSTOMER.phone.replace(/\s/g, ''),
    email: CUSTOMER.licenseNo,
    fax: CUSTOMER.licenseNo,
    legalAddress: ADDRESS,
    actualAddress: ADDRESS,
    legalAddressFull: {
      addInfo: ADDRESS,
      comment: CUSTOMER.unifiedRegNo,
    },
    actualAddressFull: {
      addInfo: ADDRESS,
    },
    description: [
      'Clinic customer — NOVA MEDICAL CENTER (Al Ain Establishment)',
      `Owner ${CUSTOMER.owner}`,
      `ADRA licence ${CUSTOMER.licenseNo} exp ${CUSTOMER.licenseExpiry}`,
      `Unified Reg ${CUSTOMER.unifiedRegNo} | Unified Licence ${CUSTOMER.unifiedLicenceNo}`,
      `Contact email ${CUSTOMER.contactEmail}`,
      'Source: Abu Dhabi Economic Licence screenshot 2026-08-12',
      'Face Room layout: email+fax = trade licence #; legalAddressFull.comment = unified reg no.',
    ].join(' | '),
  }

  if (!COMMIT) {
    console.log('  DRY RUN: would POST new counterparty')
    console.log(JSON.stringify(payload, null, 2))
    return { id: 'DRY-RUN', ...payload }
  }

  const created = await api('POST', '/entity/counterparty', payload)
  console.log(`  Created: ${created.name} (${created.id})`)
  console.log(`  https://online.moysklad.ru/app/#company/edit?id=${created.id}`)
  return created
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
  if (dup) throw new Error(`Duplicate protection: order exists (${dup.name}, id=${dup.id})`)
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const lineMinor = item.price * qty
    sumMinor += lineMinor
    console.log(
      `    ${code} ${item.name.slice(0, 52)} x${qty} @ ${money(item.price)} = ${money(lineMinor)}`,
    )
    positions.push({
      quantity: qty,
      price: item.price,
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
  console.log('  NOVA MEDICAL CENTER — counterparty + SO')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Order: ${ORDER.name}`)
  console.log(`  Address: ${ADDRESS}`)

  await ensureOrderNameFree()
  const agent = await findOrCreateCounterparty()

  if (COMMIT && agent.id !== 'DRY-RUN') await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  console.log(`  Total: ${money(sumMinor)} AED (expected ${EXPECTED_TOTAL_AED.toFixed(2)})`)

  if (Math.abs(sumMinor / 100 - EXPECTED_TOTAL_AED) > 0.01) {
    throw new Error(`Sum mismatch: got ${money(sumMinor)}, expected ${EXPECTED_TOTAL_AED}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: ORDER.moment,
    description: [
      ORDER.marker,
      'Opening clinic order — Al Ain NOVA MEDICAL CENTER.',
      'Clinic list prices. SO only (invoice/ship later if needed).',
    ].join('\n'),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: {
      country: href('country', COUNTRY_UAE_ID),
      city: CUSTOMER.city,
      street: CUSTOMER.street,
    },
    positions,
  })

  console.log(`\n  SO: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
  console.log(`  Customer: https://online.moysklad.ru/app/#company/edit?id=${agent.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
