#!/usr/bin/env node

/**
 * Ensure every active MoySklad product name starts with "Genosys " (Title Case prefix).
 * Skips Delivery / Excellent Delivery services and products.
 *
 *   node --import dotenv/config scripts/moysklad-rename-products-genosys-prefix.js
 *   node --import dotenv/config scripts/moysklad-rename-products-genosys-prefix.js --commit
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

/** Exact target names where auto-normalization would miss sibling conventions. */
const TARGET_BY_CODE = {
  '00014': 'Genosys Skin Renewal Peeling System (SRS) Box',
  '00017': 'Genosys Power Solution AWS Box',
  '00019': 'Genosys Power Solution SWS Box',
  '00039': 'Genosys Soothing Repair Post Cream Box',
  '00064': 'Genosys Power Solution PCS Box',
  '00066': 'Genosys Power Solution CVS Box',
  '00068': 'Genosys Power Solution CTS Box',
  '00070': 'Genosys Power Solution HES Box',
  '00078': 'Genosys Hair Gentron Device',
  '00049': 'Genosys HR³ Matrix Hair Solution Vial',
  '00081': 'Genosys Paper Bag Big',
  '00111': 'Genosys Samples Snow O₂ box',
  '00119': 'Genosys Samples Skin Whitening Serum',
  '00120': 'Genosys Samples Skin Barrier Protecting Cream',
  '00141': 'Genosys Hair Stamp for HairGen Booster (8pcs)',
  '00142': 'Genosys HairGen Booster Device',
  '00079': 'Genosys Touch Pen with Genosys Logo (50pcs)',
}

function shouldSkip(name) {
  const n = name.trim().toLowerCase()
  return n.startsWith('delivery ') || n.startsWith('excellent delivery')
}

function stripGenosysPrefix(name) {
  return name.trim().replace(/^genosys\b\s*/i, '').trim()
}

function titleCaseRest(rest) {
  return rest
    .split(/\s+/)
    .map((word) => {
      if (/^(AWS|HES|SWS|CTS|CVS|PCS|SRS|HR³|O₂|GENOSYS|HAIRGEN|HAIRGEN|α)$/i.test(word)) {
        if (word.toUpperCase() === 'GENOSYS') return 'Genosys'
        if (word.toUpperCase() === 'HAIRGEN') return 'HairGen'
        return word
      }
      if (/^[A-Z0-9(),./×+-]+$/.test(word) && word.length <= 4) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

function targetName(product) {
  if (shouldSkip(product.name)) return null
  if (TARGET_BY_CODE[product.code]) return TARGET_BY_CODE[product.code]

  const rest = stripGenosysPrefix(product.name)
  if (!rest) return null

  const normalizedRest =
    rest === rest.toUpperCase() && /[A-Z]/.test(rest) ? titleCaseRest(rest) : rest

  const target = `Genosys ${normalizedRest}`
  if (target === product.name) return null
  return target
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAllProducts() {
  const rows = []
  let offset = 0
  while (true) {
    const data = await api('GET', `/entity/product?limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []).filter((p) => !p.archived))
    if (!data.rows?.length || offset + 1000 >= data.meta.size) break
    offset += 1000
  }
  return rows
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('  MoySklad — normalize product names to "Genosys …" prefix')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const products = await fetchAllProducts()
  const changes = []

  for (const product of products) {
    const target = targetName(product)
    if (!target) continue
    changes.push({ product, target })
  }

  console.log(`\n  Active products scanned: ${products.length}`)
  console.log(`  Renames planned: ${changes.length}\n`)

  for (const { product, target } of changes) {
    console.log(`  ${(product.code || '-').padEnd(6)} ${product.name}`)
    console.log(`         → ${target}`)
    if (COMMIT) {
      await api('PUT', `/entity/product/${product.id}`, {
        meta: product.meta,
        name: target,
      })
    }
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  console.log(`\n  Done — ${changes.length} products renamed.`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
