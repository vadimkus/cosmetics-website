#!/usr/bin/env node

/**
 * Genesis presents write-off @ buyPrice (2026-07-18):
 *   Remove FOC lines from PARTW2607160539 / 04830 / 06555 (already shipped at 0),
 *   then write off as presents + 3 cushions:
 *     00013 Hydro Cool Modeling Mask 1kg ×1
 *     00024 Snow O₂ Cleanser 500ml ×1
 *     00025 Snow Booster Toner 1000ml ×1
 *     00011 EZ CO₂ MASK Professional Box ×1
 *     54464 Cushion #3 Camel ×1
 *     00144 Cushion #2 Beige ×1
 *     00143 Cushion #1 Ivory ×1
 *
 *   Paid order total stays 2,970 AED.
 *
 *   node --import dotenv/config scripts/moysklad-create-genesis-presents-writeoff-20260718.js
 *   node --import dotenv/config scripts/moysklad-create-genesis-presents-writeoff-20260718.js --commit
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
const MARKER = `GENESIS-PRESENTS-WRITE-OFF-${uaeToday()}`
const EXPECTED_ORDER_SUM_MINOR = 297000

const ORDER_ID = '361f8c3d-8130-11f1-0a80-0dc40023a524'
const INVOICE_ID = '36623435-8130-11f1-0a80-04d100239d31'
const DEMAND_ID = '36efaf8c-8130-11f1-0a80-0bab00236329'

const FOC_CODES = new Set(['00013', '00024', '00025', '00011'])

const LINES = [
  ['00013', 1, 'Hydro Cool Modeling Mask 1kg'],
  ['00024', 1, 'Snow O₂ Cleanser 500ml'],
  ['00025', 1, 'Snow Booster Toner 1000ml'],
  ['00011', 1, 'EZ CO₂ MASK Professional Box (5 treatments)'],
  ['54464', 1, 'Skin Caring Blemish Balm Cushion #3 Camel'],
  ['00144', 1, 'Skin Caring Blemish Balm Cushion #2 Beige'],
  ['00143', 1, 'Skin Caring Blemish Balm Cushion #1 Ivory'],
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
      signal: AbortSignal.timeout(60000),
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    const retryable =
      e.cause?.code === 'ECONNRESET' ||
      e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      e.name === 'TimeoutError' ||
      e.message === 'fetch failed'
    if (attempt < 8 && retryable) {
      await new Promise((r) => setTimeout(r, 2000 * attempt))
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

function lineCode(pos) {
  return pos.assortment?.code || ''
}

async function removeFocFromDoc(entityType, docId, label) {
  const rows = await fetchAll(`/entity/${entityType}/${docId}/positions?expand=assortment`)
  const toDelete = rows.filter((p) => FOC_CODES.has(lineCode(p)) && Number(p.discount || 0) === 100)
  console.log(`  ${label}: FOC lines to remove = ${toDelete.map((p) => lineCode(p)).join(', ') || 'none'}`)
  for (const pos of toDelete) {
    const posId = pos.id || pos.meta?.href?.split('/').pop()?.split('?')[0]
    console.log(`    delete ${lineCode(pos)} (${posId})`)
    if (COMMIT) await api('DELETE', `/entity/${entityType}/${docId}/positions/${posId}`)
  }
}

async function ensureNoDuplicate() {
  const data = await api('GET', `/entity/loss?filter=description~${encodeURIComponent(MARKER)}&limit=5`)
  if ((data.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    throw new Error(`Duplicate loss marker: ${MARKER}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Genesis presents — remove FOC from order + write-off @ buyPrice')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}\n`)

  await ensureNoDuplicate()

  console.log('  Step 1 — remove FOC from SO / invoice / shipment:')
  await removeFocFromDoc('customerorder', ORDER_ID, 'Order')
  await removeFocFromDoc('invoiceout', INVOICE_ID, 'Invoice')
  await removeFocFromDoc('demand', DEMAND_ID, 'Shipment')

  const stockRows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of stockRows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }

  // After FOC removal (commit), stock for FOC SKUs returns; dry-run still sees post-FOC stock.
  // For dry-run availability check on FOC codes, add back 1 if currently short.
  const positions = []
  let totalMinor = 0

  console.log('\n  Step 2 — presents write-off lines:')
  for (const [code, qty, label] of LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    let available = row.available
    if (!COMMIT && FOC_CODES.has(code) && available < qty) {
      available += qty // will return when FOC removed
      console.log(`    (dry-run) ${code}: treating avail as ${available} after FOC removal`)
    }
    if (available < qty) {
      throw new Error(`Insufficient ${code} (${label}): need ${qty}, have ${row.available}`)
    }
    const p = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = p.buyPrice?.value ?? 0
    if (buyMinor === 0) console.warn(`  ⚠ ${code}: buyPrice is 0`)
    totalMinor += buyMinor * qty
    positions.push({
      quantity: qty,
      price: buyMinor,
      assortment: href('product', row.id),
      vat: 0,
      vatEnabled: false,
    })
    console.log(
      `    ${code} x${qty} @ ${money(buyMinor)} → ${money(buyMinor * qty)} | avail ${row.available} | ${label}`
    )
  }

  console.log(`\n  Total buy cost: ${money(totalMinor)} AED | ${LINES.length} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  // Re-check stock after FOC removal
  const stockRows2 = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const avail2 = new Map()
  for (const row of stockRows2) {
    if (row.code) avail2.set(row.code, Number(row.stock || 0) - Number(row.reserve || 0))
  }
  for (const [code, qty, label] of LINES) {
    const a = avail2.get(code) ?? 0
    if (a < qty) throw new Error(`After FOC removal, insufficient ${code} (${label}): need ${qty}, have ${a}`)
  }

  const created = await api('POST', '/entity/loss', {
    applicable: true,
    moment: uaeMomentNow(),
    description: [
      MARKER,
      'Genesis Healthcare Centre presents — warehouse write-off at buyPrice.',
      'From PARTW2607160539 FOC reclass + cushions: 00013 Hydro Cool x1, 00024 Cleanser 500 x1, 00025 Snow Booster 1000 x1, 00011 EZ mask x1, 54464 Camel x1, 00144 Beige x1, 00143 Ivory x1.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    positions,
  })

  const [order2, invoice2, demand2] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])

  console.log(`\n  Loss: ${created.name} | ${money(created.sum || totalMinor)} AED`)
  console.log(`  https://online.moysklad.ru/app/#loss/edit?id=${created.id}`)
  console.log(`  Order ${order2.name}: ${money(order2.sum)} | Invoice ${invoice2.name}: ${money(invoice2.sum)} | Ship ${demand2.name}: ${money(demand2.sum)}`)

  if (
    order2.sum !== EXPECTED_ORDER_SUM_MINOR ||
    invoice2.sum !== EXPECTED_ORDER_SUM_MINOR ||
    demand2.sum !== EXPECTED_ORDER_SUM_MINOR
  ) {
    throw new Error('Order chain sum should remain 2970.00 AED after FOC removal')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
