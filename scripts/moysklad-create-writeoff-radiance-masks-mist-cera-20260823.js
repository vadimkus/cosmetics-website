#!/usr/bin/env node

/**
 * Warehouse write-off @ buyPrice (2026-08-23):
 *   00194 Multi Vita Radiance Serum 30ml ×1
 *   00063 Intensive Repair Collagen Mask ×10
 *   00140 Soothing Bomb Sea Algae Mask ×10
 *   00188 Microbiome Energy Infusing Mist 80ml ×2
 *   54484 CERABARRIER Biome Gel Cleanser 200ml ×1
 *
 *   node --import dotenv/config scripts/moysklad-create-writeoff-radiance-masks-mist-cera-20260823.js
 *   node --import dotenv/config scripts/moysklad-create-writeoff-radiance-masks-mist-cera-20260823.js --commit
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
const MARKER = `WRITE-OFF-RADIANCE-COLLAGEN-ALGAE-MIST-CERA-${uaeToday()}`

const LINES = [
  ['00194', 1, 'Multi Vita Radiance Serum 30ml'],
  ['00063', 10, 'Intensive Repair Collagen Mask 23g'],
  ['00140', 10, 'Soothing Bomb Sea Algae Mask 25g'],
  ['00188', 2, 'Microbiome Energy Infusing Mist 80ml'],
  ['54484', 1, 'CERABARRIER Biome Gel Cleanser 200ml'],
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
    if (attempt < 5 && (error.message === 'fetch failed' || error.cause?.code === 'ECONNRESET')) {
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw error
  }
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

async function ensureNoDuplicate() {
  const data = await api('GET', `/entity/loss?search=${encodeURIComponent(MARKER)}&limit=10`)
  const duplicate = (data.rows || []).find((row) => String(row.description || '').includes(MARKER))
  if (duplicate) throw new Error(`Duplicate loss marker: ${duplicate.name}`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Write-off — radiance serum, collagen 10, sea algae 10, mist 2, CERA 200')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}\n`)

  if (COMMIT) await ensureNoDuplicate()

  const positions = []
  let totalMinor = 0
  let totalQuantity = 0
  const summary = []

  for (const [code, quantity, label] of LINES) {
    const row = await fetchAssortmentByCode(code)
    if (row.available < quantity) {
      throw new Error(`Insufficient ${code} (${label}): need ${quantity}, available ${row.available}`)
    }

    const product = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = product.buyPrice?.value ?? 0
    if (buyMinor === 0) console.warn(`  WARN ${code}: buyPrice is 0`)

    totalMinor += buyMinor * quantity
    totalQuantity += quantity
    positions.push({
      quantity,
      price: buyMinor,
      assortment: href('product', row.id),
      vat: 0,
      vatEnabled: false,
    })
    summary.push(`${code} x${quantity}`)
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
      'Warehouse write-off at buyPrice.',
      summary.join('; ') + '.',
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
