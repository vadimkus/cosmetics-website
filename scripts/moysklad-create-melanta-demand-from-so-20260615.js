#!/usr/bin/env node

/**
 * Melanta Poly Clinic — create Отгрузка (contract 14) from SO GENCardM2606155578,
 * then delete the customer order.
 *
 *   node --import dotenv/config scripts/moysklad-create-melanta-demand-from-so-20260615.js
 *   node --import dotenv/config scripts/moysklad-create-melanta-demand-from-so-20260615.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const SO_NAME = 'GENCardM2606155578'

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: 'c3908257-ccdd-11ef-0a80-11a10053430e', // Melanta Poly Clinic L.L.C
  contractId: 'ca7a8aa6-ccdd-11ef-0a80-18080052ee1c', // Contract 14
}

const DEMAND = {
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Melanta demand from SO ${SO_NAME} ${uaeToday()}`,
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
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
  return (minor / 100).toFixed(2)
}

function productIdFromHref(h) {
  return h?.split('/').pop()?.split('?')[0]
}

async function loadSalesOrder() {
  const data = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(SO_NAME)}&expand=agent&limit=1`
  )
  const order = data?.rows?.[0]
  if (!order) throw new Error(`Sales order not found: ${SO_NAME}`)

  const positions = await fetchAll(
    `/entity/customerorder/${order.id}/positions?expand=assortment`
  )

  const lines = positions.map((p) => {
    const id = productIdFromHref(p.assortment?.meta?.href)
    const code = p.assortment?.code || '?'
    if (!id) throw new Error(`Missing product id on SO line: ${code}`)
    return {
      id,
      code,
      name: p.assortment?.name || code,
      qty: p.quantity,
      price: p.price,
    }
  })

  return { order, lines }
}

async function fetchStockAvailable() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, Number(row.stock || 0) - Number(row.reserve || 0))
  }
  return stock
}

async function ensureNoDuplicateDemand() {
  const filter = `description~${encodeURIComponent(DEMAND.marker)}`
  const data = await api('GET', `/entity/demand?filter=${encodeURIComponent(filter)}&limit=5`)
  const dup = (data?.rows || []).find((d) => (d.description || '').includes(DEMAND.marker))
  if (dup) {
    throw new Error(
      `Duplicate demand: ${dup.name} (${dup.id}) https://online.moysklad.ru/app/#demand/edit?id=${dup.id}`
    )
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Melanta — demand (contract 14) from SO, then delete SO')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  SO: ${SO_NAME}\n`)

  const { order, lines } = await loadSalesOrder()
  console.log(`  Found SO: ${order.name} | ${money(order.sum)} AED | agent: ${order.agent?.name}`)

  const stock = await fetchStockAvailable()
  let totalMinor = 0
  console.log('\n  Lines (from SO):')
  for (const line of lines) {
    const avail = stock.get(line.code)
    if (avail == null) throw new Error(`Unknown code in stock report: ${line.code}`)
    if (avail < line.qty) {
      throw new Error(`Insufficient ${line.code}: need ${line.qty}, available ${avail}`)
    }
    totalMinor += line.qty * line.price
    console.log(
      `    ${line.code} x${line.qty} @ ${money(line.price)} → ${money(line.qty * line.price)} | avail ${avail} | ${line.name.slice(0, 55)}`
    )
  }
  console.log(`\n  Total incl. VAT: ${money(totalMinor)} AED`)

  if (COMMIT) await ensureNoDuplicateDemand()

  const payload = {
    moment: uaeMomentNow(),
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    store: href('store', COMMON.storeId),
    state: stateHref('demand', DEMAND.stateShippedId),
    description: [
      DEMAND.marker,
      'Customer: Melanta Poly Clinic L.L.C.',
      'Agreement 14 (commission). Converted from website SO — same lines/prices as order.',
      `Source SO: ${SO_NAME} (${order.id}).`,
    ].join('\n'),
    positions: lines.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — would POST demand, then DELETE customerorder')
    console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${order.id}`)
    return
  }

  console.log('\n  Posting Отгрузка...')
  const created = await api('POST', '/entity/demand', payload)
  console.log(`    Demand: ${created.name} | ${money(created.sum)} AED`)
  console.log(`    https://online.moysklad.ru/app/#demand/edit?id=${created.id}`)

  console.log('\n  Deleting SO...')
  await api('DELETE', `/entity/customerorder/${order.id}`)
  console.log(`    Deleted: ${SO_NAME}`)

  const check = await api('GET', `/entity/customerorder?filter=name=${encodeURIComponent(SO_NAME)}&limit=1`)
  if (check?.rows?.length) throw new Error('SO still exists after delete')
  console.log('    Verified: SO removed')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
