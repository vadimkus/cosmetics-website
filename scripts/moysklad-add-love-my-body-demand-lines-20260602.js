#!/usr/bin/env node

/**
 * Add retail replenishment lines to Love My Body demand 06266 (today).
 *
 *   node --import dotenv/config scripts/moysklad-add-love-my-body-demand-lines-20260602.js
 *   node --import dotenv/config scripts/moysklad-add-love-my-body-demand-lines-20260602.js --commit
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

const DEMAND_ID = 'ceb46886-5e2b-11f1-0a80-17ad000c5991' // 06266
const MARKER = 'Love My Body retail add-on 2026-06-02'

const ADD_LINES = [
  ['00051', 2], // HR³ Matrix Hair Tonic 70ml
  ['00052', 2], // HR³ Matrix Scalp & Hair Shampoo 300ml
  ['00122', 2], // Multi-Vita Radiance Cream 50g
  ['00022', 2], // Snow Booster Toner 200ml
  ['00188', 3], // Microbiome Energy Infusing Mist 80ml
  ['00143', 2], // BB Cushion #1 Ivory
  ['00037', 2], // Skin Barrier Protecting Cream 100g
  ['00145', 2], // Problem Control Toner 200ml
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
    const href = ref?.meta?.href
    if (!href) return {}
    if (!acache.has(href)) acache.set(href, api('GET', href.replace(API, '')))
    return acache.get(href)
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
  console.log('  Love My Body — add lines to demand 06266')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  if ((demand.description || '').includes(MARKER)) {
    throw new Error(`Duplicate protection: marker already on ${demand.name}`)
  }

  const have = await existingCodes(DEMAND_ID)
  const stock = await fetchStockByCode()
  const resolved = []

  for (const [code, qty] of ADD_LINES) {
    if (have.has(code)) throw new Error(`Code ${code} already on demand — resolve manually`)
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
  console.log(`  Add total: ${money(addMinor)} AED | ${resolved.reduce((s, l) => s + l.qty, 0)} pcs`)

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
    description: [demand.description || '', MARKER, 'Added: HR3 tonic/shampoo, radiance cream, snow toner, microbiome mist, ivory cushion, barrier cream, problem toner.'].join('\n'),
  })

  const positions = await fetchAll(`/entity/demand/${DEMAND_ID}/positions`)
  console.log(`\n  Updated: ${updated.name} | ${money(updated.sum)} AED | ${positions.length} lines`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
