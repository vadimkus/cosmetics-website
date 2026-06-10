#!/usr/bin/env node

/**
 * Add PDRN + Snow cleanser lines to Salon 971 demand 06288.
 *
 *   node --import dotenv/config scripts/moysklad-add-salon971-demand-lines-20260605.js
 *   node --import dotenv/config scripts/moysklad-add-salon971-demand-lines-20260605.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const DEMAND_ID = '18eecf86-600b-11f1-0a80-1b9d001c4bc4' // 06288
const MARKER = 'Salon 971 demand add-on PDRN cleanser 2026-06-05'

const ADD_LINES = [
  ['54467', 2], // Skin Reboot PDRN mask Pack
  ['00021', 2], // Snow O₂ Cleanser 180ml
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1200)}`)
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

function money(minor) {
  return (minor / 100).toFixed(2)
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

async function existingCodes(demandId) {
  const acache = new Map()
  async function assort(ref) {
    const h = ref?.meta?.href
    if (!h) return {}
    if (!acache.has(h)) acache.set(h, api('GET', h.replace(API, '')))
    return acache.get(h)
  }
  const codes = new Set()
  for (const p of await fetchAll(`/entity/demand/${demandId}/positions`)) {
    const a = await assort(p.assortment)
    if (a.code) codes.add(a.code)
  }
  return codes
}

async function main() {
  console.log('====================================================================')
  console.log('  Salon 971 — add lines to demand 06288')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  if ((demand.description || '').includes(MARKER)) {
    throw new Error(`Already applied: ${demand.name}`)
  }

  const have = await existingCodes(DEMAND_ID)
  const stock = await fetchStockByCode()
  const resolved = []

  for (const [code, qty] of ADD_LINES) {
    if (have.has(code)) throw new Error(`Code ${code} already on demand`)
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    resolved.push({ ...item, qty })
  }

  console.log(`  Demand: ${demand.name} | current ${money(demand.sum)} AED`)
  console.log('\n  Lines to add:')
  let addMinor = 0
  for (const line of resolved) {
    const lineMinor = line.price * line.qty
    addMinor += lineMinor
    console.log(`    ${line.code} ${line.name.slice(0, 52)} x${line.qty} @ ${money(line.price)} = ${money(lineMinor)}`)
  }
  console.log(`  Add total: ${money(addMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  for (const line of resolved) {
    await api('POST', `/entity/demand/${DEMAND_ID}/positions`, {
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })
  }

  const updated = await api('PUT', `/entity/demand/${DEMAND_ID}`, {
    meta: demand.meta,
    description: [
      demand.description || '',
      MARKER,
      'Added: PDRN mask pack 54467 x2, Snow O2 cleanser 180ml 00021 x2.',
    ].join('\n'),
  })

  const positions = await fetchAll(`/entity/demand/${DEMAND_ID}/positions`)
  console.log(`\n  Updated: ${updated.name} | ${money(updated.sum)} AED | ${positions.length} lines`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
