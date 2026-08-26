#!/usr/bin/env node

/**
 * LODY ANA.SPA. LLC SO GENCardM260823LODY — Hair Stamp 00141
 * 370 (stale clinic CSV) → 230 (MoySklad оптовая).
 * New total: 400 AED.
 *
 *   node --import dotenv/config scripts/moysklad-amend-lodyana-hairstamp-price-20260823.js
 *   node --import dotenv/config scripts/moysklad-amend-lodyana-hairstamp-price-20260823.js --commit
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

const ORDER_ID = '90bfd901-9eec-11f1-0a80-1eb700920c73'
const TARGET_CODE = '00141'
const NEW_PRICE_MINOR = 23000
const EXPECTED_SUM_MINOR = 40000

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
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
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function main() {
  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const posHref = order.positions?.meta?.href
  if (!posHref) throw new Error('No positions href')
  const posData = await api('GET', posHref.replace(API, '') + '?expand=assortment')
  const rows = posData.rows || []

  console.log(`  Order ${order.name} | now ${money(order.sum)} AED`)
  let hit = null
  for (const p of rows) {
    const code = p.assortment?.code || '?'
    console.log(`    ${code} x${p.quantity} @ ${money(p.price)}`)
    if (code === TARGET_CODE) hit = p
  }
  if (!hit) throw new Error(`No position ${TARGET_CODE}`)

  if (!COMMIT) {
    console.log(`\n  DRY RUN — would set ${TARGET_CODE} ${money(hit.price)} → ${money(NEW_PRICE_MINOR)}`)
    return
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}/positions/${hit.id}`, {
    meta: hit.meta,
    price: NEW_PRICE_MINOR,
  })
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    description: [
      'LODYANA-HAIRSTAMP-STAMP025-AD70-2026-08-23',
      '00141 Hair Stamp HairGen box x1 @230 (MoySklad оптовая); 00074 stamp 0.25mm x1 @100; Delivery Abu Dhabi 70. SO only.',
      'Ship: Al Sahel Towers, Block A, Al Bateen, Abu Dhabi.',
    ].join('\n'),
  })

  const after = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  if (after.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(after.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }
  console.log(`\n  Amended ${after.name} | ${money(after.sum)} AED`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
