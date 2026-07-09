#!/usr/bin/env node

/**
 * Elizaveta CODM2606256271 — add missing 54475 PDRN Homecare line + fix description.
 * Website order @ 150 AED (clinic price); mapping exists in lib/moysklad.ts since 22 Jun.
 *
 *   node --import dotenv/config scripts/moysklad-fix-elizaveta-order-add-pdrn-homecare-20260625.js
 *   node --import dotenv/config scripts/moysklad-fix-elizaveta-order-add-pdrn-homecare-20260625.js --commit
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

const ORDER_ID = '5a363151-708a-11f1-0a80-1012001a2ce8'
const PRODUCT_ID = '3706b193-6ae8-11f1-0a80-16e5003a85d3' // 54475
const PRODUCT_CODE = '54475'
const QTY = 1
const PRICE_MINOR = 15000 // 150 AED clinic (website order line)
const EXPECTED_SUM_MINOR = 108500 // 935 + 150

const UNMAPPED_RE =
  /\s*\|\s*Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000/gi

function cleanDesc(text) {
  return (text || '')
    .replace(UNMAPPED_RE, '')
    .replace(/Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000\s*\|\s*/gi, '')
    .replace(/Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000/gi, '')
    .trim()
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function main() {
  console.log('====================================================================')
  console.log('  Elizaveta CODM2606256271 — add PDRN Homecare 54475')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  console.log(`  Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  Agent: ${order.agent?.name || '(expand agent on GET if needed)'}`)
  console.log(`  Desc:  ${order.description}`)

  const positions = await api(
    'GET',
    `/entity/customerorder/${ORDER_ID}/positions?expand=assortment&limit=50`
  )
  for (const p of positions.rows || []) {
    console.log(
      `    ${p.assortment?.code} ${(p.assortment?.name || '').slice(0, 45)} x${p.quantity} @${money(p.price)} disc=${p.discount || 0}`
    )
  }

  const has54475 = (positions.rows || []).some((p) => p.assortment?.code === PRODUCT_CODE)
  if (has54475) {
    console.log('  54475 already on order — skip add')
  } else {
    console.log(`  Will add ${PRODUCT_CODE} x${QTY} @ ${money(PRICE_MINOR)} AED`)
  }

  const newDesc = cleanDesc(order.description)

  if (!COMMIT) {
    console.log(`  New description: ${newDesc}`)
    console.log(`  Expected total after fix: ${money(EXPECTED_SUM_MINOR)} AED`)
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  if (!has54475) {
    await api('POST', `/entity/customerorder/${ORDER_ID}/positions`, {
      quantity: QTY,
      price: PRICE_MINOR,
      assortment: href('product', PRODUCT_ID),
      vat: 5,
      vatEnabled: true,
    })
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    description: newDesc,
  })

  const after = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  console.log(`\n  After: ${after.name} | ${money(after.sum)} AED`)
  console.log(`  Desc:  ${after.description}`)
  if (Math.abs(after.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Sum mismatch: ${money(after.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${ORDER_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
