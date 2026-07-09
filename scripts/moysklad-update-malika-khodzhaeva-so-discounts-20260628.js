#!/usr/bin/env node

/**
 * Dr Malika Khodzhaeva — update SO GENCardM2606288573:
 *   - delivery 100% discount
 *   - add free: sea algae 00140, collagen 00063, peptide gel mask 00012 (each 100% off)
 *
 *   node --import dotenv/config scripts/moysklad-update-malika-khodzhaeva-so-discounts-20260628.js
 *   node --import dotenv/config scripts/moysklad-update-malika-khodzhaeva-so-discounts-20260628.js --commit
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

const ORDER_ID = 'c4593895-72d2-11f1-0a80-077700542153'
const DELIVERY_SERVICE_ID = 'a97cfeeb-814e-11ea-0a80-004a001516bd'
const MARKER = `MALIKA-KHODZHAEVA-SO-DISCOUNTS-${uaeToday()}`

const FREE_LINES = [
  ['00140', 1], // Sea Algae Mask
  ['00063', 1], // Collagen Mask
  ['00012', 1], // Peptide Gel Mask
]

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function lineNet(priceMinor, qty, discountPct) {
  return Math.round((priceMinor * qty * (100 - discountPct)) / 100)
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function assortmentId(pos) {
  return pos.assortment?.meta?.href?.split('/').pop()?.split('?')[0] || ''
}

async function main() {
  console.log('====================================================================')
  console.log('  Dr Malika Khodzhaeva — update SO (delivery + free masks)')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================\n')

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const positions = await fetchAll(`/entity/customerorder/${ORDER_ID}/positions`)
  const stock = await fetchStockByCode()

  console.log(`  Order: ${order.name} (current sum ${money(order.sum)} AED)\n`)

  // Delivery line — set 100% discount
  const deliveryPos = positions.find((p) => assortmentId(p) === DELIVERY_SERVICE_ID)
  if (!deliveryPos) throw new Error('Delivery line not found on order')
  if (deliveryPos.discount === 100) {
    console.log('  Delivery already 100% discounted')
  } else {
    console.log(`  → Delivery: ${money(deliveryPos.price)} AED → 100% discount (was ${deliveryPos.discount || 0}%)`)
    if (COMMIT) {
      await api('PUT', `/entity/customerorder/${ORDER_ID}/positions/${deliveryPos.id}`, {
        meta: deliveryPos.meta,
        quantity: deliveryPos.quantity,
        price: deliveryPos.price,
        discount: 100,
        assortment: deliveryPos.assortment,
        vat: deliveryPos.vat,
        vatEnabled: deliveryPos.vatEnabled,
      })
      console.log('    ✓ delivery updated')
    }
  }

  // Free mask lines
  const existingProductIds = new Set(positions.map((p) => assortmentId(p)))
  for (const [code, qty] of FREE_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    if (existingProductIds.has(item.id)) {
      const existing = positions.find((p) => assortmentId(p) === item.id)
      if (existing?.discount === 100) {
        console.log(`  ✓ ${code} already on order at 100% discount — skip`)
        continue
      }
    }
    console.log(`  → Add ${code} ${item.name} x${qty} @ ${money(item.price)} (100% off → 0)`)
    if (!COMMIT) continue
    await api('POST', `/entity/customerorder/${ORDER_ID}/positions`, {
      quantity: qty,
      price: item.price,
      discount: 100,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
    console.log(`    ✓ ${code} added`)
  }

  if (COMMIT) {
    const desc = [order.description || '', `[${MARKER}] delivery 100% off; free sea algae+collagen+peptide masks`]
      .filter(Boolean)
      .join('\n')
    const updatedOrder = await api('GET', `/entity/customerorder/${ORDER_ID}`)
    await api('PUT', `/entity/customerorder/${ORDER_ID}`, { meta: updatedOrder.meta, description: desc })
  }

  // Print final table
  const finalPositions = COMMIT
    ? await fetchAll(`/entity/customerorder/${ORDER_ID}/positions`)
    : positions // dry-run approximates

  console.log('\n  Updated lines:')
  console.log('  ' + '-'.repeat(78))
  console.log(
    '  ' +
      ['Code', 'Product', 'Qty', 'Clinic', 'Disc', 'Line'].map((h, i) =>
        i === 1 ? h.padEnd(34) : h.padStart(i === 0 ? 5 : 6)
      ).join('')
  )
  console.log('  ' + '-'.repeat(78))

  let totalMinor = 0
  const rows = []

  for (const p of finalPositions) {
    const aid = assortmentId(p)
    let code = '—'
    let name = p.assortment?.name || aid
    if (aid === DELIVERY_SERVICE_ID) {
      code = 'svc'
      name = 'Excellent Delivery Dubai'
    } else {
      for (const [c, item] of stock) {
        if (item.id === aid) {
          code = c
          name = item.name
          break
        }
      }
    }
    const disc = p.discount || 0
    const net = COMMIT ? lineNet(p.price, p.quantity, disc) : lineNet(p.price, p.quantity, disc)
    // For dry run, simulate delivery discount and new lines
    rows.push({ code, name, qty: p.quantity, clinic: p.price, disc, net })
    totalMinor += net
  }

  if (!COMMIT) {
    // Adjust dry-run totals
    totalMinor = order.sum - lineNet(deliveryPos.price, 1, deliveryPos.discount || 0) + 0
    for (const [code, qty] of FREE_LINES) {
      const item = stock.get(code)
      if (!existingProductIds.has(item.id)) totalMinor += 0
    }
    totalMinor = order.sum - (deliveryPos.discount === 100 ? 0 : deliveryPos.price)
  }

  if (COMMIT) {
    const refreshed = await api('GET', `/entity/customerorder/${ORDER_ID}`)
    totalMinor = refreshed.sum
    const pos2 = await fetchAll(`/entity/customerorder/${ORDER_ID}/positions`)
    rows.length = 0
    for (const p of pos2) {
      const aid = assortmentId(p)
      let code = '—'
      let name = p.assortment?.name || aid
      if (aid === DELIVERY_SERVICE_ID) {
        code = 'svc'
        name = 'Excellent Delivery Dubai'
      } else {
        for (const [c, item] of stock) {
          if (item.id === aid) {
            code = c
            name = item.name
            break
          }
        }
      }
      const disc = p.discount || 0
      rows.push({ code, name, qty: p.quantity, clinic: p.price, disc, net: lineNet(p.price, p.quantity, disc) })
    }
  } else {
    // Rebuild dry-run display rows
    rows.length = 0
    for (const p of positions) {
      const aid = assortmentId(p)
      let code = '—'
      let name = p.assortment?.name || aid
      if (aid === DELIVERY_SERVICE_ID) {
        code = 'svc'
        name = 'Excellent Delivery Dubai'
      } else {
        for (const [c, item] of stock) {
          if (item.id === aid) {
            code = c
            name = item.name
            break
          }
        }
      }
      const disc = aid === DELIVERY_SERVICE_ID ? 100 : p.discount || 0
      rows.push({ code, name, qty: p.quantity, clinic: p.price, disc, net: lineNet(p.price, p.quantity, disc) })
    }
    for (const [code, qty] of FREE_LINES) {
      const item = stock.get(code)
      if (positions.some((p) => assortmentId(p) === item.id)) continue
      rows.push({ code, name: item.name, qty, clinic: item.price, disc: 100, net: 0 })
    }
    totalMinor = rows.reduce((s, r) => s + r.net, 0)
  }

  for (const r of rows) {
    const discStr = r.disc ? `${r.disc}%` : '—'
    console.log(
      `  ${String(r.code).padEnd(5)} ${String(r.name).slice(0, 34).padEnd(34)} ${String(r.qty).padStart(3)} ${money(r.clinic).padStart(8)} ${discStr.padStart(5)} ${money(r.net).padStart(8)}`
    )
  }
  console.log('  ' + '-'.repeat(78))
  console.log(`  ${''.padEnd(5)} ${'TOTAL'.padEnd(34)} ${''.padStart(3)} ${''.padStart(8)} ${''.padStart(5)} ${money(totalMinor).padStart(8)}`)

  if (!COMMIT) console.log('\n  DRY RUN — re-run with --commit')
  else console.log(`\n  ✓ Order updated: ${order.name} | ${money(totalMinor)} AED`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
