#!/usr/bin/env node

/**
 * Presents for Fatima — warehouse write-off @ buyPrice (2026-07-27):
 *   54470 BIO-MESO PDRN Expert Ampoule 60000 ×2
 *   54475 BIO-MESO PDRN Homecare Ampoule 5000 ×2
 *   54484 Cerabarrier Biome Gel Cleanser 200ml ×2
 *   00012 Peptide Gel Mask ×4
 *   00063 Intensive Repair Collagen Mask ×4
 *   00140 Soothing Bomb Sea Algae Mask ×4
 *   00015 SRS peeling vial 2ml ×20
 *
 *   node --import dotenv/config scripts/moysklad-create-fatima-presents-writeoff-20260727.js
 *   node --import dotenv/config scripts/moysklad-create-fatima-presents-writeoff-20260727.js --commit
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
const MARKER = `PRESENTS-FATIMA-${uaeToday()}`

const LINES = [
  ['54470', 2, 'BIO-MESO PDRN Expert Ampoule 60000'],
  ['54475', 2, 'BIO-MESO PDRN Homecare Ampoule 5000'],
  ['54484', 2, 'Cerabarrier Biome Gel Cleanser 200ml'],
  ['00012', 4, 'Peptide Gel Mask'],
  ['00063', 4, 'Intensive Repair Collagen Mask'],
  ['00140', 4, 'Soothing Bomb Sea Algae Mask'],
  ['00015', 20, 'SRS peeling vial 2ml'],
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function ensureNoDuplicate() {
  const data = await api('GET', `/entity/loss?search=${encodeURIComponent(MARKER)}&limit=10`)
  if ((data.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    throw new Error(`Duplicate marker: ${MARKER}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Presents for Fatima — write-off @ buyPrice')
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
  let totalQty = 0

  console.log('  Lines:')
  for (const [code, qty, label] of LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    if (row.available < qty) {
      throw new Error(`Insufficient ${code} (${label}): need ${qty}, have ${row.available}`)
    }
    const p = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = p.buyPrice?.value ?? 0
    totalMinor += buyMinor * qty
    totalQty += qty
    positions.push({
      quantity: qty,
      price: buyMinor,
      assortment: href('product', row.id),
      vat: 0,
      vatEnabled: false,
    })
    console.log(
      `    ${code} x${qty} @ ${money(buyMinor)} → ${money(buyMinor * qty)} | avail ${row.available} | ${label}`,
    )
  }

  console.log(`\n  Total buy cost: ${money(totalMinor)} AED | ${totalQty} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/loss', {
    applicable: true,
    moment: uaeMomentNow(),
    description: [
      MARKER,
      'Reason: Presents for Fatima.',
      'PDRN60000 x2, PDRN5000 x2, Cerabarrier200 x2, peptide x4, collagen x4, sea algae x4, SRS x20.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    positions,
  })

  console.log(`\n  Doc: ${created.name} | ${money(created.sum || totalMinor)} AED`)
  console.log(`  https://online.moysklad.ru/app/#loss/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
