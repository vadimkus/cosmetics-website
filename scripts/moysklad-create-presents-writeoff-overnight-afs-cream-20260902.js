#!/usr/bin/env node

/**
 * Promotional presents — warehouse write-off @ buyPrice (2026-09-02):
 *   00189 Overnight Cream Mask 100g ×1
 *   00030 All For Sensitive Serum 30ml ×1
 *   00190 Multi Functional Anti-Wrinkle Cream 50g ×1
 *
 *   node --import dotenv/config scripts/moysklad-create-presents-writeoff-overnight-afs-cream-20260902.js
 *   node --import dotenv/config scripts/moysklad-create-presents-writeoff-overnight-afs-cream-20260902.js --commit
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
const MARKER = `WRITE-OFF-PRESENTS-OVERNIGHT-AFS-CREAM50-${uaeToday()}`

const LINES = [
  ['00189', 1, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00030', 1, 'All For Sensitive Serum 30ml'],
  ['00190', 1, 'Multi Functional Anti-Wrinkle Cream 50g'],
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
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function ensureNoDuplicate() {
  const data = await api('GET', `/entity/loss?search=${encodeURIComponent(MARKER)}&limit=10`)
  const dup = (data.rows || []).find((row) => String(row.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate loss: ${dup.name}`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Presents write-off — overnight / AFS serum / cream 50g')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}\n`)

  await ensureNoDuplicate()

  const positions = []
  let totalMinor = 0
  let totalQty = 0

  for (const [code, qty, label] of LINES) {
    const data = await api(
      'GET',
      `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`,
    )
    const row = (data.rows || []).find((r) => r.code === code)
    if (!row?.id) throw new Error(`Unknown code: ${code} (${label})`)
    const avail = Number(row.stock || 0) - Number(row.reserve || 0)
    if (avail < qty) throw new Error(`Insufficient ${code}: need ${qty}, have ${avail}`)

    const product = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = product.buyPrice?.value ?? 0
    if (!buyMinor) throw new Error(`${code}: buyPrice is 0`)

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
      `  ${code} ×${qty} @ ${money(buyMinor)} = ${money(buyMinor * qty)} | stock ${avail} | ${row.name}`,
    )
  }

  console.log(`\n  Total: ${totalQty} pcs | buy ${money(totalMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/loss', {
    applicable: true,
    moment: uaeMomentNow(),
    description: [
      MARKER,
      'Promotional presents — warehouse write-off at buyPrice.',
      'Overnight mask 100g x1, All For Sensitive Serum x1, Anti-Wrinkle Cream 50g x1.',
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
