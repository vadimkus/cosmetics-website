#!/usr/bin/env node

/**
 * BROW AND BEAUTY — update PO GENCardM260706BBAC: PDRN 54467 qty 1 → 30 packs.
 *
 *   node --import dotenv/config scripts/moysklad-update-brow-beauty-pdrn-qty-20260706.js
 *   node --import dotenv/config scripts/moysklad-update-brow-beauty-pdrn-qty-20260706.js --commit
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

const ORDER_ID = '31dc1301-7913-11f1-0a80-1e2300783264'
const PDRN_CODE = '54467'
const NEW_QTY = 30
const EXPECTED_TOTAL_AED = 17885 // 12085 + 29×200

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

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function productCode(pos) {
  return pos.assortment?.code || pos.assortment?.article || ''
}

async function fetchStock54467() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const row = rows.find((r) => r.code === PDRN_CODE)
  if (!row) throw new Error(`Stock row not found for ${PDRN_CODE}`)
  return {
    available: Number(row.stock || 0) - Number(row.reserve || 0),
    price: Number(row.salePrice || 0),
    name: row.name,
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Brow and Beauty — PDRN 54467 qty → 30 packs')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const positions = await fetchAll(
    `/entity/customerorder/${ORDER_ID}/positions?expand=assortment`
  )
  const pdrnPos = positions.find((p) => productCode(p) === PDRN_CODE)
  if (!pdrnPos) throw new Error(`Line ${PDRN_CODE} not found on order ${order.name}`)

  const stock = await fetchStock54467()
  if (stock.available < NEW_QTY) {
    throw new Error(`Insufficient stock ${PDRN_CODE}: need ${NEW_QTY}, have ${stock.available}`)
  }

  console.log(`  Order: ${order.name} (was ${money(order.sum)} AED)`)
  console.log(`  ${PDRN_CODE} ${stock.name}`)
  console.log(`    qty ${pdrnPos.quantity} → ${NEW_QTY}`)
  console.log(`    line ${money(pdrnPos.price * pdrnPos.quantity)} → ${money(pdrnPos.price * NEW_QTY)} AED`)
  console.log(`  Expected new total: ${EXPECTED_TOTAL_AED.toFixed(2)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}/positions/${pdrnPos.id}`, {
    meta: pdrnPos.meta,
    quantity: NEW_QTY,
    price: pdrnPos.price,
    discount: pdrnPos.discount || 0,
    assortment: pdrnPos.assortment.meta ? { meta: pdrnPos.assortment.meta } : pdrnPos.assortment,
    vat: pdrnPos.vat,
    vatEnabled: pdrnPos.vatEnabled,
  })

  const updated = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const desc = [
    (order.description || '').replace('54467 x1 pack (30 sheets)', '54467 x30 packs'),
    `[${uaeToday()}] PDRN 54467 corrected to 30 packs per customer.`,
  ]
    .filter(Boolean)
    .join(' | ')

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: updated.meta,
    description: desc,
  })

  console.log(`\n  Updated order sum: ${money(updated.sum)} AED`)
  if (Math.abs(Number(updated.sum) - EXPECTED_TOTAL_AED * 100) > 1) {
    console.warn(`  WARN: sum ${money(updated.sum)} vs expected ${EXPECTED_TOTAL_AED.toFixed(2)}`)
  }
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${ORDER_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
