#!/usr/bin/env node

/**
 * Sara / Estefa promotion presents — warehouse write-off @ buyPrice.
 *
 * Lines:
 *   Snow Booster Toner 200ml (00022) x1
 *   Microbiome Energy Infusing Mist 80ml (00188) x1
 *   Intensive Repair Collagen Mask 23g (00063) x10
 *   Soothing Bomb Sea Algae Mask 23g (00140) x10
 *   Standard Detachable Manual Roller 0.25mm (00001) x1
 *
 *   node --import dotenv/config scripts/moysklad-create-sara-estefa-promotion-writeoff-20260607.js
 *   node --import dotenv/config scripts/moysklad-create-sara-estefa-promotion-writeoff-20260607.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'

const MARKER = `PROMO-WRITE-OFF-SARA-ESTEFA-${uaeToday()}`

/** [code, qty, label] */
const LINES = [
  ['00022', 1, 'Snow Booster Toner 200ml'],
  ['00188', 1, 'Microbiome Energy Infusing Mist 80ml'],
  ['00063', 10, 'Intensive Repair Collagen Mask 23g'],
  ['00140', 10, 'Soothing Bomb Sea Algae Mask 23g'],
  ['00001', 1, 'Standard Detachable Manual Roller 0.25mm'],
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function ensureNoDuplicate() {
  const data = await api('GET', `/entity/loss?filter=description~${encodeURIComponent(MARKER)}&limit=10`)
  const dup = (data?.rows || []).find((r) => (r.description || '').includes(MARKER))
  if (dup) {
    throw new Error(`Duplicate loss: ${dup.name} (${dup.id}) https://online.moysklad.ru/app/#loss/edit?id=${dup.id}`)
  }
}

async function fetchStockByCode() {
  const stockRows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of stockRows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }
  return stock
}

async function main() {
  console.log('====================================================================')
  console.log('  Sara / Estefa promotion presents — write-off @ buyPrice')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}\n`)

  await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const positions = []
  let totalMinor = 0
  const warnings = []

  console.log('  Lines:')
  for (const [code, qty, label] of LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code} (${label})`)
    if (row.available < qty) {
      throw new Error(`Insufficient ${code} (${label}): need ${qty}, have ${row.available}`)
    }

    const product = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = product.buyPrice?.value ?? 0
    if (buyMinor === 0) warnings.push(`${code} ${row.name}: buyPrice is 0`)

    totalMinor += buyMinor * qty
    positions.push({
      quantity: qty,
      price: buyMinor,
      assortment: href('product', row.id),
      vat: 0,
      vatEnabled: false,
    })

    console.log(`    ${code} x${qty} @ ${money(buyMinor)} → ${money(buyMinor * qty)} AED | ${row.name}`)
    if (label && label !== row.name) console.log(`      (${label})`)
  }

  console.log(`\n  Total buy cost: ${money(totalMinor)} AED`)
  if (warnings.length) {
    console.log()
    for (const warning of warnings) console.log(`  WARN: ${warning}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/loss', {
    applicable: true,
    moment: uaeMomentNow(),
    description: [
      MARKER,
      'Presents to Sara / Estefa — promotion.',
      'Warehouse write-off at purchase price (buyPrice).',
      'Snow Booster 00022 x1, Mist 00188 x1, Collagen 00063 x10, Sea Algae 00140 x10, Roller 0.25mm 00001 x1.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    positions,
  })

  console.log(`\n  Loss: ${created.name} | ${money(created.sum || totalMinor)} AED`)
  console.log(`  ID: ${created.id}`)
  console.log(`  https://online.moysklad.ru/app/#loss/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
