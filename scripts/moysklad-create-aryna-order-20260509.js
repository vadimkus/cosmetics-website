#!/usr/bin/env node

/**
 * Customer order (Заказ покупателя) — Aryna (existing counterparty 0521175210).
 *
 * - Sea Algae mask x5 @ list (from stock sale price)
 * - Sea Algae mask x1 FOC (100% discount)
 * - Collagen mask x1 FOC (100% discount)
 * - Excellent Delivery Dubai 45 AED
 *
 * Dry-run:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-create-aryna-order-20260509.js
 *
 * Commit:
 *   node scripts/moysklad-create-aryna-order-20260509.js --commit
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

const AGENT_ID = '055bcbf9-2bfe-11f0-0a80-195a001bcf70' // Miss Aryna Drabysheuskaya 0521175210
const DELIVERY_AED = 45

const ORDER = {
  name: 'GENCardM2605095210',
  moment: '2026-05-09 17:00:00',
  marker: 'Aryna 0521175210 sea algae + FOC masks 2026-05-09',
}

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
      salePrice: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function loadAgent() {
  return api('GET', `/entity/counterparty/${AGENT_ID}`)
}

function buildShipmentAddress(agent) {
  const addInfo = agent.actualAddressFull?.addInfo || agent.actualAddress?.addInfo || ''
  const street = addInfo || 'UAE'
  return {
    country: countryHref(),
    city: 'Dubai',
    street,
  }
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

async function ensureNoDuplicateToday(agentId) {
  const date = ORDER.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/customerorder?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(ORDER.marker))
  if (dup) {
    throw new Error(`Duplicate protection: order already exists today (${dup.name}, id=${dup.id})`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad customer order — Aryna (0521175210)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await loadAgent()
  console.log(`  Counterparty: ${agent.name} (${agent.id}) | ${agent.phone}`)

  await ensureOrderNameFree()
  await ensureNoDuplicateToday(agent.id)

  const stock = await fetchStockByCode()
  const sea = stock.get('00140')
  const col = stock.get('00063')
  if (!sea?.id) throw new Error('Missing product 00140 (Sea Algae)')
  if (!col?.id) throw new Error('Missing product 00063 (Collagen)')
  if (!sea.salePrice) throw new Error('No sale price on 00140 in stock report')

  const positions = [
    {
      quantity: 5,
      price: sea.salePrice,
      discount: 0,
      assortment: href('product', sea.id),
      vat: 5,
      vatEnabled: true,
    },
    {
      quantity: 1,
      price: sea.salePrice,
      discount: 100,
      assortment: href('product', sea.id),
      vat: 5,
      vatEnabled: true,
    },
    {
      quantity: 1,
      price: col.salePrice || sea.salePrice,
      discount: 100,
      assortment: href('product', col.id),
      vat: 5,
      vatEnabled: true,
    },
    {
      quantity: 1,
      price: Math.round(DELIVERY_AED * 100),
      discount: 0,
      assortment: href('service', DELIVERY_DUBAI_SERVICE_ID),
      vat: 5,
      vatEnabled: true,
    },
  ]

  if (!col.salePrice) {
    console.warn('  WARN: collagen mask had no salePrice in stock report; using sea mask list price for FOC line base')
  }

  const paidMasks = (5 * sea.salePrice) / 100
  const expected = paidMasks + DELIVERY_AED
  console.log()
  console.log(`  Sea Algae 00140 x5 @ ${(sea.salePrice / 100).toFixed(2)} AED → ${paidMasks.toFixed(2)} AED`)
  console.log(`  Sea Algae 00140 x1 FOC (100% off)`)
  console.log(`  Collagen 00063 x1 FOC (100% off)`)
  console.log(`  Delivery Dubai x1 @ ${DELIVERY_AED} AED`)
  console.log(`  Expected total (paid lines + delivery): ~${expected.toFixed(2)} AED VAT-incl.`)

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
      '5× Sea Algae paid; 1× Sea Algae + 1× Collagen FOC; Dubai delivery 45 AED',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
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
    shipmentAddressFull: buildShipmentAddress(agent),
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
