#!/usr/bin/env node

/**
 * BROW AND BEAUTY AESTHETIC CLINIC L.L.C — new counterparty + customer order (PO).
 *
 * License 1582255 | DCCI 659950 | Reg 2770128
 * Villa No. 266, Jumeira First, Dubai
 * Phone +971585717075 | jdurazov@gmail.com
 *
 * PDRN: 54467 ×30 packs (30 sheets per pack).
 *
 *   node --import dotenv/config scripts/moysklad-create-brow-beauty-clinic-order-20260706.js
 *   node --import dotenv/config scripts/moysklad-create-brow-beauty-clinic-order-20260706.js --commit
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

const CUSTOMER = {
  name: 'BROW AND BEAUTY AESTHETIC CLINIC L.L.C',
  phone: '+971585717075',
  email: 'jdurazov@gmail.com',
  licenseNo: '1582255',
  dcciNo: '659950',
  registerNo: '2770128',
  street: 'Villa No. 266, Jumeira First, Dubai',
  city: 'Dubai',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}BBAC`,
  moment: uaeMomentNow(),
  marker: `Brow and Beauty clinic opening order ${uaeToday()}`,
}

/** [code, qty] — clinic list prices from MoySklad salePrice */
const PRODUCT_LINES = [
  ['00037', 5], // Skin Barrier Protecting Cream 100g
  ['00188', 5], // Microbiome Energy Infusing Mist 80ml
  ['00144', 10], // Cushion Beige
  ['54464', 10], // Cushion Camel
  ['54467', 30], // PDRN mask pack 30 sheets ×30 packs
  ['00035', 10], // Problem Control Cream 50g
  ['54457', 10], // Ultra Shield SPF50 50g
  ['00041', 5], // Multi Sun Cream SPF40 40g
  ['54473', 5], // Revita Glow Natural
  ['54472', 5], // Revita Glow Bright
  ['00140', 20], // Sea Algae Mask 23g
  ['00063', 20], // Collagen Mask 23g
  ['00021', 5], // Snow O₂ Cleanser 180ml
  ['00053', 5], // EyeCell Eye Peptide Gel Patch (box)
  ['00022', 3], // Snow Booster Toner 200ml
]

const EXPECTED_TOTAL_AED = 17885

async function api(method, pathStr, body) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
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
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
      return text ? JSON.parse(text) : null
    } catch (e) {
      if (attempt === 5) throw e
      await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
    }
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

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
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
    console.log(`  Found existing counterparty by name: ${byName.rows[0].name} (${byName.rows[0].id})`)
    return byName.rows[0]
  }

  const addr = {
    addInfo: CUSTOMER.street,
  }

  const payload = {
    name: CUSTOMER.name,
    phone: cleanPhone,
    email: CUSTOMER.licenseNo,
    companyType: 'legal',
    fax: CUSTOMER.licenseNo,
    legalAddress: CUSTOMER.street,
    actualAddress: CUSTOMER.street,
    legalAddressFull: addr,
    actualAddressFull: addr,
    description: [
      `Contact email: ${CUSTOMER.email}. Trade license ${CUSTOMER.licenseNo} (exp 11/12/2026).`,
      `DCCI ${CUSTOMER.dcciNo}. Register ${CUSTOMER.registerNo}.`,
      `Manager: Indira Urazova. Owner: Janat Urazov.`,
      `Created ${uaeToday()}. Face Room field layout.`,
    ].join(' '),
  }

  if (!COMMIT) {
    console.log('  DRY RUN: would POST new counterparty', CUSTOMER.name)
    return { id: 'DRY-RUN', ...payload, meta: { href: `${API}/entity/counterparty/DRY-RUN`, type: 'counterparty' } }
  }

  const created = await api('POST', '/entity/counterparty', payload)
  console.log(`  Created counterparty: ${created.name} (${created.id})`)
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

function buildShipmentAddress(agent) {
  const full = agent.actualAddressFull
  if (full?.country?.meta?.href && full.city && (full.street || full.addInfo)) {
    return {
      country: { meta: full.country.meta },
      city: full.city,
      street: full.street || full.addInfo,
    }
  }
  return {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    const lineMinor = item.price * qty
    sumMinor += lineMinor
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
  console.log('  BROW AND BEAUTY AESTHETIC CLINIC L.L.C — counterparty + PO')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  await ensureOrderNameFree()

  const agent = await findOrCreateCounterparty()
  console.log(`  Counterparty: ${agent.name} (${agent.id})`)
  console.log(`  Phone: ${agent.phone || CUSTOMER.phone}`)

  if (COMMIT && agent.id !== 'DRY-RUN') await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const { positions, sumMinor } = buildPositions(stock)
  const shipmentAddressFull = buildShipmentAddress(agent)

  console.log(`\n  Order: ${ORDER.name}`)
  for (const [code, qty] of PRODUCT_LINES) {
    const item = stock.get(code)
    console.log(`    ${code} ${item.name} x${qty} @ ${money(item.price)} AED`)
  }
  console.log(`  Total: ${money(sumMinor)} AED VAT-incl.`)

  if (Math.abs(sumMinor - EXPECTED_TOTAL_AED * 100) > 1) {
    throw new Error(`Total mismatch: ${money(sumMinor)} vs ${EXPECTED_TOTAL_AED.toFixed(2)}`)
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
      'Clinic opening order — 15 SKUs. PDRN 54467 x30 packs.',
    ].join(' | '),
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

  console.log(`\n  Created order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
  console.log(`  https://online.moysklad.ru/app/#company/edit?id=${agent.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
