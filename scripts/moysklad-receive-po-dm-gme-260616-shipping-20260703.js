#!/usr/bin/env node

/**
 * Receive Korea PO DM GME 260616 ship into stock (full supply / приёмка).
 * PO 5f77462f — 38 lines / 55,453.23 AED / 1,915 units.
 *
 *   node --import dotenv/config scripts/moysklad-receive-po-dm-gme-260616-shipping-20260703.js
 *   node --import dotenv/config scripts/moysklad-receive-po-dm-gme-260616-shipping-20260703.js --commit
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

const PO_ID = '5f77462f-6ed1-11f1-0a80-076300a0934e'
const PO_NAME = 'DM GME 260616 ship'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const SUPPLIER_ID = '3a0a3f28-33cf-11ea-0a80-043f000b9859'
const EXPECTED_SUM_MINOR = 5545323
const EXPECTED_LINES = 38
const MARKER = `KOREA-RECEIVE-DM-GME-260616-SHIP-${uaeToday()}`

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
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function loadPoPositions() {
  const rows = await fetchAll(`/entity/purchaseorder/${PO_ID}/positions?expand=assortment`)
  return rows.map((p) => ({
    code: p.assortment?.code || '?',
    name: p.assortment?.name || '?',
    quantity: p.quantity,
    shipped: p.shipped || 0,
    price: p.price,
    vat: p.vat ?? 0,
    vatEnabled: p.vatEnabled ?? false,
    assortment: p.assortment,
    pending: p.quantity - (p.shipped || 0),
  }))
}

function buildSupplyPositions(lines) {
  return lines
    .filter((l) => l.pending > 0)
    .map((l) => ({
      quantity: l.pending,
      price: l.price,
      assortment: { meta: l.assortment.meta },
      vat: l.vat,
      vatEnabled: l.vatEnabled,
    }))
}

async function main() {
  console.log('====================================================================')
  console.log('  Korea receive — PO DM GME 260616 ship → supply')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const po = await api('GET', `/entity/purchaseorder/${PO_ID}?expand=agent`)
  if (po.name !== PO_NAME) throw new Error(`PO name ${po.name} != ${PO_NAME}`)
  if (po.deleted) throw new Error('PO is deleted')

  const lines = await loadPoPositions()
  const pendingLines = lines.filter((l) => l.pending > 0)
  const pendingSum = pendingLines.reduce((s, l) => s + l.price * l.pending, 0)
  const pendingQty = pendingLines.reduce((s, l) => s + l.pending, 0)

  console.log(`\n  PO: ${po.name} | ${money(po.sum)} AED`)
  console.log(`  Already received: ${money(po.shippedSum)} AED`)
  console.log(`  Pending: ${pendingLines.length} lines / ${pendingQty} units / ${money(pendingSum)} AED`)

  if (pendingLines.length === 0) {
    console.log('\n  Nothing pending — PO fully received')
    return
  }

  if (pendingLines.length !== EXPECTED_LINES || Math.abs(pendingSum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(
      `Pending ${pendingLines.length} lines / ${money(pendingSum)} != expected ${EXPECTED_LINES} / ${money(EXPECTED_SUM_MINOR)}`
    )
  }

  const prior = await api(
    'GET',
    `/entity/supply?search=${encodeURIComponent('DM GME 260616 ship')}&limit=50`
  )
  const active = (prior.rows || []).filter(
    (s) =>
      !s.deleted &&
      s.applicable !== false &&
      ((s.description || '').includes('DM GME 260616') ||
        (s.description || '').includes(PO_NAME))
  )
  if (active.length) {
    console.log('\n  Existing supplies on PO:')
    for (const s of active) console.log(`    ${s.name} | ${money(s.sum)} AED`)
    throw new Error('Supply already exists — abort to avoid double receive')
  }

  const dupMarker = await api(
    'GET',
    `/entity/supply?search=${encodeURIComponent(MARKER)}&limit=5`
  )
  if ((dupMarker.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    console.log('\n  SKIP — receive marker already posted')
    return
  }

  console.log('\n  Lines to receive:')
  for (const l of pendingLines) {
    console.log(`    ${l.code} x${l.pending} @ ${money(l.price)} → ${money(l.price * l.pending)}`)
  }

  if (!COMMIT) {
    console.log(`\n  Would create supply ${money(pendingSum)} AED @ ${uaeMomentNow()}`)
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  const supply = await api('POST', '/entity/supply', {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', SUPPLIER_ID),
    store: href('store', STORE_ID),
    purchaseOrder: href('purchaseorder', PO_ID),
    vatEnabled: true,
    description: [
      MARKER,
      'Korea air shipment DM GME 260616 — full receive vs shipping invoice.',
      'AWB 607-54108224 | CPIP-160626-081300 | arrived 2026-07-03.',
      `${pendingLines.length} lines / ${pendingQty} units.`,
    ].join(' | '),
    positions: buildSupplyPositions(lines),
  })

  const poAfter = await api('GET', `/entity/purchaseorder/${PO_ID}`)
  const linesAfter = await loadPoPositions()
  const notDone = linesAfter.filter((l) => l.pending > 0)

  console.log(`\n  Supply: ${supply.name} | ${money(supply.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#supply/edit?id=${supply.id}`)
  console.log(`  PO received: ${money(poAfter.shippedSum)} / ${money(poAfter.sum)} AED`)

  if (Math.abs(supply.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Supply sum ${money(supply.sum)} != ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (Math.abs(poAfter.shippedSum - poAfter.sum) > 1) {
    throw new Error(`PO not fully received: ${money(poAfter.shippedSum)} / ${money(poAfter.sum)}`)
  }
  if (notDone.length) {
    throw new Error(`${notDone.length} PO lines still pending receive`)
  }

  const desc = [
    po.description || '',
    MARKER,
    `Full supply ${supply.name} posted ${uaeToday()} — cargo arrived.`,
  ]
    .filter(Boolean)
    .join('\n')
  await api('PUT', `/entity/purchaseorder/${PO_ID}`, { meta: po.meta, description: desc })

  console.log(`  https://online.moysklad.ru/app/#purchaseorder/edit?id=${PO_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
