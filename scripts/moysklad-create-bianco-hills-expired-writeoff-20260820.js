#!/usr/bin/env node

/**
 * Warehouse write-off @ buyPrice — Bianco Dubai Hills return 00308, all expired.
 *
 *   00059 EyeCell kit ×1
 *   00052 Shampoo 300ml ×1
 *   00051 Hair Tonic 70ml ×1
 *   00055 Eye Contour Cream ×1
 *   00035 Problem Control Cream 50g ×1
 *   00031 Hydro Soothing Cream 50g ×1
 *   00143 Ivory cushion ×2
 *   00144 Beige cushion ×1
 *
 *   node --import dotenv/config scripts/moysklad-create-bianco-hills-expired-writeoff-20260820.js
 *   node --import dotenv/config scripts/moysklad-create-bianco-hills-expired-writeoff-20260820.js --commit
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
const MARKER = `WRITE-OFF-BIANCO-HILLS-EXPIRED-00308-${uaeToday()}`

const LINES = [
  ['00059', 1, 'EyeCell Eye Zone Care Kit'],
  ['00052', 1, 'HR³ Scalp & Hair Shampoo 300ml'],
  ['00051', 1, 'HR³ Hair Tonic 70ml'],
  ['00055', 1, 'EyeCell Eye Contour Cream 20ml'],
  ['00035', 1, 'Problem Control Cream 50g'],
  ['00031', 1, 'Hydro Soothing Cream 50g'],
  ['00143', 2, 'Cushion Ivory'],
  ['00144', 1, 'Cushion Beige'],
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
  console.log('  Write-off — Bianco Hills return 00308 expired')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}\n`)

  if (COMMIT) await ensureNoDuplicate()

  const positions = []
  let totalMinor = 0
  let totalQuantity = 0

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
      'Expired stock from Bianco Dubai Hills salesreturn 00308. Warehouse write-off at buyPrice.',
      '00059 kit x1; 00052 shampoo x1; 00051 tonic x1; 00055 eye cream x1;',
      '00035 PC 50g x1; 00031 hydro 50g x1; 00143 ivory x2; 00144 beige x1.',
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
