#!/usr/bin/env node

/**
 * Presents — warehouse write-off @ buyPrice (2026-08-09):
 *   00053 Eye Peptide Gel Patch ×1
 *   00055 Eye Contour Cream ×1
 *   00054 Eye Contour Serum ×1
 *   00189 Skin Rescue Overnight Cream Mask ×1
 *   00063 Collagen Mask ×20
 *   00140 Sea Algae Mask ×20
 *
 *   node --import dotenv/config scripts/moysklad-create-presents-writeoff-eye-zone-masks-20260809.js
 *   node --import dotenv/config scripts/moysklad-create-presents-writeoff-eye-zone-masks-20260809.js --commit
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
const MARKER = `PRESENTS-EYE-ZONE-OVERNIGHT-COLLAGEN20-SEA20-${uaeToday()}`

const LINES = [
  ['00053', 1, 'Eye Peptide Gel Patch'],
  ['00055', 1, 'Eye Contour Cream 20ml'],
  ['00054', 1, 'Eye Contour Serum 10ml'],
  ['00189', 1, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00063', 20, 'Intensive Repair Collagen Mask'],
  ['00140', 20, 'Soothing Bomb Sea Algae Mask'],
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
      await new Promise((resolve) => setTimeout(resolve, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    }
    return text ? JSON.parse(text) : null
  } catch (error) {
    if (
      attempt < 5 &&
      (error.message === 'fetch failed' || error.cause?.code === 'ECONNRESET')
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw error
  }
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const separator = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${separator}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function ensureNoDuplicate() {
  const data = await api('GET', `/entity/loss?search=${encodeURIComponent(MARKER)}&limit=10`)
  const duplicate = (data.rows || []).find((row) =>
    String(row.description || '').includes(MARKER),
  )
  if (duplicate) {
    throw new Error(`Duplicate loss marker: ${duplicate.name}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Presents — Eye zone + overnight + collagen20 + sea20')
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
  let totalQuantity = 0

  for (const [code, quantity, label] of LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code} (${label})`)
    if (row.available < quantity) {
      throw new Error(
        `Insufficient ${code} (${label}): need ${quantity}, available ${row.available}`,
      )
    }

    const product = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = product.buyPrice?.value ?? 0
    if (buyMinor === 0) console.warn(`  ⚠ ${code}: buyPrice is 0`)

    totalMinor += buyMinor * quantity
    totalQuantity += quantity
    positions.push({
      quantity,
      price: buyMinor,
      assortment: href('product', row.id),
      vat: 0,
      vatEnabled: false,
    })
    console.log(
      `  ${code} ×${quantity} @ ${money(buyMinor)} = ${money(buyMinor * quantity)} AED` +
        ` | available ${row.available} | ${row.name}`,
    )
  }

  console.log(`\n  Total: ${totalQuantity} pcs | buy cost ${money(totalMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN PASSED — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/loss', {
    applicable: true,
    moment: uaeMomentNow(),
    description: [
      MARKER,
      'Presents — warehouse write-off at buyPrice.',
      'Eye patch x1, eye cream x1, eye serum x1, overnight mask x1, collagen mask x20, sea algae mask x20.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    positions,
  })

  console.log(`\n  Loss: ${created.name} | ${money(created.sum || totalMinor)} AED`)
  console.log(`  https://online.moysklad.ru/app/#loss/edit?id=${created.id}`)
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
