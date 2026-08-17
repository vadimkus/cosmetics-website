#!/usr/bin/env node

/**
 * Present to Sara — warehouse write-off @ buyPrice (2026-07-20):
 *   54485 CERABARRIER Biome Gel Cleanser 600ml ×1  (user said 500ml — no 500ml SKU)
 *   00025 Snow Booster Toner 1000ml ×1
 *   00012 Peptide Gel Mask 39g ×10
 *   00063 Intensive Repair Collagen Mask 23g ×10
 *   00140 Soothing Bomb Sea Algae Mask 25g ×10
 *
 *   node --import dotenv/config scripts/moysklad-create-sara-present-writeoff-20260720.js
 *   node --import dotenv/config scripts/moysklad-create-sara-present-writeoff-20260720.js --commit
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
const MARKER = `PRESENT-SARA-CERABARRIER-MASKS-${uaeToday()}`

const LINES = [
  ['54485', 1, 'CERABARRIER Biome Gel Cleanser 600ml'],
  ['00025', 1, 'Snow Booster Toner 1000ml'],
  ['00012', 10, 'Peptide Gel Mask 39g'],
  ['00063', 10, 'Intensive Repair Collagen Mask 23g'],
  ['00140', 10, 'Soothing Bomb Sea Algae Mask 25g'],
]

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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function ensureNoDuplicate() {
  const data = await api('GET', `/entity/loss?filter=description~${encodeURIComponent(MARKER)}&limit=5`)
  if ((data.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    throw new Error(`Duplicate loss marker: ${MARKER}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Present to Sara — write-off @ buyPrice')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}\n`)

  await ensureNoDuplicate()

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

  const positions = []
  let totalMinor = 0
  let totalPcs = 0

  console.log('  Lines:')
  for (const [code, qty, label] of LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    if (row.available < qty) {
      throw new Error(`Insufficient ${code} (${label}): need ${qty}, have ${row.available}`)
    }
    const p = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = p.buyPrice?.value ?? 0
    if (buyMinor === 0) console.warn(`  ⚠ ${code}: buyPrice is 0`)
    totalMinor += buyMinor * qty
    totalPcs += qty
    positions.push({
      quantity: qty,
      price: buyMinor,
      assortment: href('product', row.id),
      vat: 0,
      vatEnabled: false,
    })
    console.log(
      `    ${code} x${qty} @ ${money(buyMinor)} → ${money(buyMinor * qty)} | avail ${row.available} | ${label}`
    )
  }

  console.log(`\n  Total buy cost: ${money(totalMinor)} AED | ${totalPcs} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/loss', {
    applicable: true,
    moment: uaeMomentNow(),
    description: [
      MARKER,
      'Presents for Sara — warehouse write-off at buyPrice.',
      '54485 Cerabarrier 600ml x1; 00025 Snow Booster 1000ml x1; 00012 peptide x10; 00063 collagen x10; 00140 sea algae x10.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    positions,
  })

  console.log(`\n  Loss: ${created.name} | ${money(created.sum || totalMinor)} AED`)
  console.log(`  https://online.moysklad.ru/app/#loss/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
