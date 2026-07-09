#!/usr/bin/env node

/**
 * Sara GENCardM2606225559 — add missing 54475 PDRN Homecare line + fix description.
 * Product already exists in MoySklad (150 clinic / 300 retail); mapping was missing in lib/moysklad.ts.
 *
 *   node --import dotenv/config scripts/moysklad-fix-sara-order-add-pdrn-homecare-20260622.js
 *   node --import dotenv/config scripts/moysklad-fix-sara-order-add-pdrn-homecare-20260622.js --commit
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

const ORDER_ID = '1ad4a2e7-6e3d-11f1-0a80-1767008667c0'
const PRODUCT_ID = '3706b193-6ae8-11f1-0a80-16e5003a85d3' // 54475
const PRODUCT_CODE = '54475'
const QTY = 1
const PRICE_MINOR = 30000 // retail 300 AED (Stripe website order)
const EXPECTED_SUM_MINOR = 120500 // 905 + 300

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
  console.log('  Sara order — add PDRN Homecare 54475')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  console.log(`  Order: ${order.name} | ${money(order.sum)} AED`)

  const positions = await api(
    'GET',
    `/entity/customerorder/${ORDER_ID}/positions?expand=assortment&limit=50`
  )
  const has54475 = (positions.rows || []).some((p) => p.assortment?.code === PRODUCT_CODE)
  if (has54475) {
    console.log('  54475 already on order — skip add')
  } else {
    console.log(`  Will add ${PRODUCT_CODE} x${QTY} @ ${money(PRICE_MINOR)} AED`)
  }

  const newDesc = (order.description || '')
    .replace(/\s*\|\s*Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000/gi, '')
    .replace(/Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000\s*\|\s*/gi, '')
    .replace(/Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000/gi, '')
    .trim()

  if (!COMMIT) {
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
  if (Math.abs(after.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Sum mismatch: ${money(after.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${ORDER_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
