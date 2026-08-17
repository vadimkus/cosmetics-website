#!/usr/bin/env node

/**
 * Warehouse write-off @ buyPrice — all expired Power Solution SWS vials (00020).
 *
 *   node --import dotenv/config scripts/moysklad-create-sws-expired-writeoff-20260713.js
 *   node --import dotenv/config scripts/moysklad-create-sws-expired-writeoff-20260713.js --commit
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
const SWS_CODE = '00020'
const PRODUCT_ID = 'e0ff2439-3448-11ea-0a80-044a00018f60'
const MARKER = `SWS-EXPIRED-WRITE-OFF-${uaeToday()}`

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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
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
  return (minor / 100).toFixed(2)
}

async function ensureNoDuplicate() {
  const data = await api('GET', `/entity/loss?filter=description~${encodeURIComponent(MARKER)}&limit=10`)
  const dup = (data?.rows || []).find((r) => (r.description || '').includes(MARKER))
  if (dup) {
    throw new Error(
      `Duplicate loss: ${dup.name} (${dup.id}) https://online.moysklad.ru/app/#loss/edit?id=${dup.id}`
    )
  }
}

async function getGenosysSwsStock() {
  const productHref = `${API}/entity/product/${PRODUCT_ID}`
  const data = await api(
    'GET',
    `/report/stock/bystore?filter=product=${encodeURIComponent(productHref)};stockMode=all`
  )
  const row = (data.rows || [])[0]
  if (!row) throw new Error(`No stock row for ${SWS_CODE}`)
  const genosys = (row.stockByStore || []).find((s) => s.name === 'Genosys Warehouse')
  const available = Number(genosys?.stock || 0) - Number(genosys?.reserve || 0)
  return {
    id: PRODUCT_ID,
    name: row.name,
    available,
    stock: Number(genosys?.stock || 0),
    reserve: Number(genosys?.reserve || 0),
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Write-off — all expired Power Solution SWS vials (00020)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}\n`)

  await ensureNoDuplicate()

  const sws = await getGenosysSwsStock()
  if (sws.available <= 0) {
    console.log(`  No SWS stock to write off (Genosys Warehouse available ${sws.available}).`)
    return
  }

  const product = await api('GET', `/entity/product/${sws.id}`)
  const buyMinor = product.buyPrice?.value ?? 0
  if (buyMinor === 0) console.warn('  ⚠ 00020: buyPrice is 0')

  const totalMinor = buyMinor * sws.available
  console.log(`  ${SWS_CODE} x${sws.available} @ ${money(buyMinor)} → ${money(totalMinor)} AED`)
  console.log(`  Product: ${sws.name}`)
  console.log(`  Genosys Warehouse stock ${sws.stock}, reserve ${sws.reserve}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/loss', {
    applicable: true,
    moment: uaeMomentNow(),
    description: [
      MARKER,
      'Warehouse write-off @ buyPrice.',
      `Expired Power Solution SWS vials ${SWS_CODE} x${sws.available} — replaced by new Korea order.`,
    ].join(' | '),
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    positions: [
      {
        quantity: sws.available,
        price: buyMinor,
        assortment: href('product', sws.id),
        vat: 0,
        vatEnabled: false,
      },
    ],
  })

  console.log(`\n  Loss: ${created.name} | ${money(created.sum || totalMinor)} AED`)
  console.log(`  https://online.moysklad.ru/app/#loss/edit?id=${created.id}`)

  await new Promise((r) => setTimeout(r, 5000))
  const after = await getGenosysSwsStock()
  console.log(`\n  SWS Genosys stock after: ${after.available} available (${after.stock} stock)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
