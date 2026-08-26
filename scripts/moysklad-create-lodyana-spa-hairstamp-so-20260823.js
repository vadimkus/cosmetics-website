#!/usr/bin/env node

/**
 * LODY ANA.SPA. LLC — SO only (no invoice / shipment).
 *
 *   00141 Hair Stamp for HairGen Booster (8pcs) ×1 @ 370
 *   00074 Stamp 0.25mm ×1 @ 100
 *   Delivery Abu Dhabi ×1 @ 70
 *   Total: 540.00 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-lodyana-spa-hairstamp-so-20260823.js
 *   node --import dotenv/config scripts/moysklad-create-lodyana-spa-hairstamp-so-20260823.js --commit
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
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const STATE_NEW_ORDER_ID = 'e1a0abf2-33c5-11ea-0a80-043f000b275a'

const AGENT_ID = '5746700f-455a-11f1-0a80-03c5003a244c'
const DELIVERY_ABU_DHABI_ID = '212036af-814f-11ea-0a80-011700157c7d'

const SHIP = {
  city: 'Abu Dhabi',
  street: 'Al Sahel Towers, Block A, Al Bateen',
}

const ORDER = {
  name: `GENCardM${uaeShortDate()}LODY`,
  marker: `LODYANA-HAIRSTAMP-STAMP025-AD70-${uaeToday()}`,
}

const PRODUCT_LINES = [
  ['00141', 1, 370],
  ['00074', 1, 100],
]
const DELIVERY_AED = 70
const EXPECTED_SUM_MINOR = 54000

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

function shipmentAddress() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: SHIP.city,
    street: SHIP.street,
    addInfo: '',
  }
}

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
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
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) throw new Error(`Duplicate: order ${dup.name} (${dup.id})`)
}

async function buildPositions() {
  const positions = []
  let sumMinor = 0
  for (const [code, qty, clinicAed] of PRODUCT_LINES) {
    const item = await fetchAssortmentByCode(code)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, available ${item.available}`)
    }
    const priceMinor = Math.round(clinicAed * 100)
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
      _aed: clinicAed,
    })
  }
  const deliveryMinor = Math.round(DELIVERY_AED * 100)
  sumMinor += deliveryMinor
  positions.push({
    quantity: 1,
    price: deliveryMinor,
    discount: 0,
    assortment: href('service', DELIVERY_ABU_DHABI_ID),
    vat: 5,
    vatEnabled: true,
    _code: 'DELIV',
    _name: 'Delivery Abu Dhabi',
    _avail: '—',
    _aed: DELIVERY_AED,
  })
  return { positions, sumMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  LODY ANA.SPA. LLC — Hair Stamp + stamp 0.25 + AD 70 — SO only')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (!/lody\s*ana\.spa/i.test(agent.name)) throw new Error(`Unexpected agent: ${agent.name}`)
  console.log(`  Customer: ${agent.name}`)

  await ensureOrderNameFree()
  if (COMMIT) await ensureNoDuplicate(agent.id)

  const { positions, sumMinor } = await buildPositions()
  const shipment = shipmentAddress()

  console.log(`  Order: ${ORDER.name}`)
  console.log(`  Ship: ${SHIP.street}, ${SHIP.city}`)
  for (const p of positions) {
    console.log(`    ${p._code} ${p._name} x${p.quantity} @ ${p._aed} (avail ${p._avail})`)
  }
  console.log(`  Total: ${money(sumMinor)} AED | SO only (New)`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

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

  const order = await api('POST', '/entity/customerorder', {
    name: ORDER.name,
    moment: uaeMomentNow(),
    shared: true,
    description: [
      ORDER.marker,
      '00141 Hair Stamp HairGen box x1 @370; 00074 stamp 0.25mm x1 @100; Delivery Abu Dhabi 70. Clinic list. SO only.',
      `Ship: ${SHIP.street}, ${SHIP.city}.`,
    ].join('\n'),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    state: stateHref('customerorder', STATE_NEW_ORDER_ID),
    vatEnabled: true,
    vatIncluded: true,
    rate: { currency: href('currency', CURRENCY_ID) },
    shipmentAddressFull: shipment,
    positions: cleanPositions,
  })
  if (order.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Posted sum ${money(order.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  console.log(`\n  Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
