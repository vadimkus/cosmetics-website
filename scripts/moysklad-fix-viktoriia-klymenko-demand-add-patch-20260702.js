#!/usr/bin/env node

/**
 * Viktoriia Klymenko demand 06449 — add 1 more eye patch box (00053: 1 → 2).
 *
 *   node --import dotenv/config scripts/moysklad-fix-viktoriia-klymenko-demand-add-patch-20260702.js
 *   node --import dotenv/config scripts/moysklad-fix-viktoriia-klymenko-demand-add-patch-20260702.js --commit
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

const DEMAND_ID = 'bb83b7e6-75d1-11f1-0a80-114400335645' // 06449
const PATCH_CODE = '00053'
const PATCH_POSITION_ID = 'bb83be42-75d1-11f1-0a80-114400335646'
const OLD_QTY = 1
const NEW_QTY = 2
const MARKER = 'Klymenko 06449 patch qty 1→2'

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

function money(minor) {
  return (minor / 100).toFixed(2)
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

async function main() {
  console.log('====================================================================')
  console.log('  Viktoriia Klymenko 06449 — add 1 eye patch box')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  if ((demand.description || '').includes(MARKER)) {
    throw new Error(`Already applied on ${demand.name}`)
  }

  const pos = await api('GET', `/entity/demand/${DEMAND_ID}/positions/${PATCH_POSITION_ID}?expand=assortment`)
  if (pos.assortment?.code !== PATCH_CODE) throw new Error(`Position mismatch: ${pos.assortment?.code}`)
  if (Number(pos.quantity) !== OLD_QTY) {
    throw new Error(`Expected ${PATCH_CODE} qty ${OLD_QTY}, found ${pos.quantity}`)
  }

  console.log(`  Demand: ${demand.name} | was ${money(demand.sum)} AED`)
  console.log(`  ${PATCH_CODE}: ${OLD_QTY} → ${NEW_QTY} @ ${money(pos.price)} (+${money(pos.price)} AED)`)
  console.log(`  New total: ${money(demand.sum + pos.price)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const productId = pos.assortment.meta.href.split('/').pop().split('?')[0]

  await api('PUT', `/entity/demand/${DEMAND_ID}/positions/${PATCH_POSITION_ID}`, {
    meta: pos.meta,
    quantity: NEW_QTY,
    price: pos.price,
    assortment: href('product', productId),
    vat: pos.vat,
    vatEnabled: pos.vatEnabled,
  })

  const updated = await api('PUT', `/entity/demand/${DEMAND_ID}`, {
    meta: demand.meta,
    description: [
      demand.description || '',
      MARKER,
      '00053 eye patch box x1 → x2.',
    ].join('\n'),
  })

  console.log(`\n  Updated: ${updated.name} | ${money(updated.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
