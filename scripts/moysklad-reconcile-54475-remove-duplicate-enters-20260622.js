#!/usr/bin/env node

/**
 * 54475 — remove 3 duplicate inbound docs (Sara fix) to reconcile stock 7 → 4.
 * Keeps supply 00186 (PI 260605 ×5) + Sara sale; drops ad-hoc enter/supply.
 *
 *   node --import dotenv/config scripts/moysklad-reconcile-54475-remove-duplicate-enters-20260622.js
 *   node --import dotenv/config scripts/moysklad-reconcile-54475-remove-duplicate-enters-20260622.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const TARGET_STOCK = 4
const PRODUCT_CODE = '54475'
const MARKER = `54475-DUP-INBOUND-REMOVE-${uaeToday()}`

/** Duplicate inbound from Sara order fix — not on PI 260605 receive 00186 */
const REMOVE_DOCS = [
  { type: 'enter', id: '10b9d31d-6e48-11f1-0a80-05fb00899368', name: '00010-00118', note: 'Sara backdated enter' },
  { type: 'enter', id: 'e9c33a4f-6e47-11f1-0a80-07630087f7e4', name: '00010-00117', note: 'Sara duplicate enter' },
  { type: 'supply', id: 'b9729c12-6e47-11f1-0a80-00ad00884527', name: '00185', note: 'Wrong PO 260616 partial' },
]

const LOSS_SEARCH = '54475-STOCK-RECON'

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

async function stock54475() {
  let offset = 0
  while (offset < 8000) {
    const data = await api('GET', `/report/stock/all?stockMode=all&limit=1000&offset=${offset}`)
    const hit = (data.rows || []).find((r) => r.code === PRODUCT_CODE)
    if (hit) return Number(hit.stock || 0) - Number(hit.reserve || 0)
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return null
}

async function removeDoc(doc) {
  const path = `/entity/${doc.type}/${doc.id}`
  let row
  try {
    row = await api('GET', path)
  } catch {
    console.log(`    ${doc.name}: already deleted — skip`)
    return
  }
  console.log(`    ${doc.type} ${doc.name} (${doc.note}) applicable=${row.applicable}`)
  if (!COMMIT) return
  if (row.applicable) {
    await api('PUT', path, { meta: row.meta, applicable: false })
  }
  await api('DELETE', path)
}

async function removeFailedLosses() {
  const data = await api('GET', `/entity/loss?search=${encodeURIComponent(LOSS_SEARCH)}&limit=10`)
  for (const row of data.rows || []) {
    console.log(`    loss ${row.name} — remove (no stock effect)`)
    if (!COMMIT) continue
    if (row.applicable) await api('PUT', `/entity/loss/${row.id}`, { meta: row.meta, applicable: false })
    await api('DELETE', `/entity/loss/${row.id}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  54475 stock reconcile — remove duplicate inbound docs')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Target stock: ${TARGET_STOCK} pcs`)
  console.log(`  Marker: ${MARKER}`)

  const before = await stock54475()
  console.log(`\n  Stock before: ${before} pcs`)

  console.log('\n  Remove duplicates:')
  for (const doc of REMOVE_DOCS) await removeDoc(doc)
  console.log('\n  Remove failed loss docs:')
  await removeFailedLosses()

  if (!COMMIT) {
    console.log(`\n  Expected stock after: ${TARGET_STOCK} pcs`)
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  const after = await stock54475()
  console.log(`\n  Stock after: ${after} pcs`)
  if (after !== TARGET_STOCK) {
    throw new Error(`Stock ${after} ≠ target ${TARGET_STOCK}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
