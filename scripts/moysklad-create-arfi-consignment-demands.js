#!/usr/bin/env node

/**
 * Create MoySklad Отгрузка documents for ARFI consignment replenishment.
 *
 * Dry-run by default:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-create-arfi-consignment-demands.js
 *
 * Commit live documents:
 *   node scripts/moysklad-create-arfi-consignment-demands.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738' // Genosys Middle East FZ-LLC
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a' // Genosys Warehouse
const TODAY = '2026-04-27'
const MARKER = `ARFI consignment replenishment ${TODAY}`

const DEMANDS = [
  {
    salon: 'ARFI NAILS BEAUTY SALON',
    moment: `${TODAY} 14:20:00`,
    lines: [
      ['00140', 3],
      ['00063', 2],
      ['00012', 2],
      ['00144', 2],
      ['00021', 2],
      ['54467', 2],
      ['00188', 2],
      ['54457', 2],
      ['00053', 2],
      ['00129', 2],
      ['54464', 2],
      ['00022', 2],
      ['54458', 2],
      ['54473', 2],
      // User-requested additions
      ['00194', 2], // Multi Vita Radiance Serum
      ['00195', 2], // Moisture Replenishing Hyaluron Serum
    ],
  },
  {
    salon: 'ARFI NAILS BEAUTY SALON 2',
    moment: `${TODAY} 14:25:00`,
    lines: [
      ['00063', 2],
      ['00140', 2],
      ['00144', 2],
      ['54467', 2],
      ['00041', 2],
      ['54457', 2],
      ['00190', 2],
      ['00022', 2],
      ['54458', 2],
      ['00040', 2],
      ['00143', 2],
      ['00191', 2],
      ['00053', 2],
      ['00129', 2],
      // User-requested additions
      ['00194', 2], // Multi Vita Radiance Serum
      ['00195', 2], // Moisture Replenishing Hyaluron Serum
    ],
  },
]

async function api(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
}

async function fetchAll(path) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const data = await api('GET', `${path}${sep}limit=${limit}&offset=${offset}`)
    const batch = data?.rows || []
    rows.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return rows
}

async function resolveCounterparty(name) {
  const exact = await fetchAll(`/entity/counterparty?filter=name=${encodeURIComponent(name)}`)
  if (exact.length === 1) return exact[0]
  if (exact.length > 1) throw new Error(`Ambiguous counterparty exact match: ${name}`)

  const loose = await fetchAll(`/entity/counterparty?search=${encodeURIComponent(name)}`)
  const match = loose.find((row) => row.name === name)
  if (match) return match
  throw new Error(`Counterparty not found: ${name}`)
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    const id = row.meta?.href?.split('/').pop()?.split('?')[0]
    stock.set(row.code, {
      id,
      code: row.code,
      name: row.name,
      stock: Number(row.stock || 0),
      reserve: Number(row.reserve || 0),
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      salePriceMinor: Number(row.salePrice || 0),
    })
  }
  return stock
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

function printLines(title, lines) {
  console.log()
  console.log(title)
  console.log('  ' + '─'.repeat(112))
  console.log(`  ${'Code'.padEnd(6)} │ ${'Product'.padEnd(58)} │ ${'Qty'.padStart(4)} │ ${'Unit'.padStart(9)} │ ${'Line'.padStart(10)} │ ${'Avail'.padStart(6)}`)
  console.log('  ' + '─'.repeat(112))
  for (const line of lines) {
    console.log(
      `  ${line.code.padEnd(6)} │ ${line.name.slice(0, 58).padEnd(58)} │ ${String(line.qty).padStart(4)} │ ${money(line.price).padStart(9)} │ ${money(line.price * line.qty).padStart(10)} │ ${String(line.available).padStart(6)}`
    )
  }
}

async function ensureNoDuplicate(agentId, salon) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${TODAY} 00:00:00`,
    `moment<=${TODAY} 23:59:59`,
  ].join(';')
  const existing = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = existing.find((doc) => (doc.description || '').includes(MARKER))
  if (dup) {
    throw new Error(
      `Duplicate protection: ${salon} already has ARFI replenishment demand today (${dup.name}, id=${dup.id})`
    )
  }
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('  MoySklad ARFI consignment replenishment demands')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)
  console.log(`  Date: ${TODAY}`)

  const stock = await fetchStockByCode()

  // Check aggregate requested quantity against current free stock before posting.
  const requestedByCode = new Map()
  for (const demand of DEMANDS) {
    for (const [code, qty] of demand.lines) {
      requestedByCode.set(code, (requestedByCode.get(code) || 0) + qty)
    }
  }
  for (const [code, qty] of requestedByCode.entries()) {
    const item = stock.get(code)
    if (!item) throw new Error(`Product code not found in stock report: ${code}`)
    if (!item.id) throw new Error(`Product ID missing in stock report: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock for ${code} ${item.name}: need ${qty}, available ${item.available}`)
    }
  }

  const created = []
  for (const demand of DEMANDS) {
    console.log()
    console.log(`Resolving counterparty: ${demand.salon}`)
    const agent = await resolveCounterparty(demand.salon)
    console.log(`  OK: ${agent.name} (${agent.id})`)
    await ensureNoDuplicate(agent.id, demand.salon)

    const lines = demand.lines.map(([code, qty]) => {
      const product = stock.get(code)
      return {
        code,
        qty,
        id: product.id,
        name: product.name,
        available: product.available,
        price: product.salePriceMinor,
      }
    })

    printLines(`  ${demand.salon}`, lines)

    const totalMinor = lines.reduce((sum, line) => sum + line.qty * line.price, 0)
    const totalQty = lines.reduce((sum, line) => sum + line.qty, 0)
    console.log('  ' + '─'.repeat(112))
    console.log(`  Total qty: ${totalQty} | Total incl. VAT: ${money(totalMinor)} AED`)
    console.log(`  VAT 5% included: ${money(totalMinor - totalMinor / 1.05)} AED`)

    const payload = {
      moment: demand.moment,
      applicable: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agent.id),
      store: href('store', STORE_ID),
      description: [
        `${MARKER}`,
        `Salon: ${demand.salon}`,
        'Created from ARFI MoySklad consignment recommendation analysis.',
        'Includes user-requested additions: Multi Vita Radiance Serum 30ml + Moisture Replenishing Hyaluron Serum 30ml.',
      ].join('\n'),
      positions: lines.map((line) => ({
        quantity: line.qty,
        price: line.price,
        assortment: href('product', line.id),
        vat: 5,
        vatEnabled: true,
      })),
    }

    if (COMMIT) {
      console.log('  Posting demand...')
      const doc = await api('POST', '/entity/demand', payload)
      console.log(`  Created: ${doc.name} (${doc.id}) — ${money(doc.sum)} AED`)
      console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${doc.id}`)
      created.push({
        salon: demand.salon,
        id: doc.id,
        name: doc.name,
        sumAed: Number(money(doc.sum)),
        qty: totalQty,
        url: `https://online.moysklad.ru/app/#demand/edit?id=${doc.id}`,
      })
    }
  }

  if (!COMMIT) {
    console.log()
    console.log('DRY RUN complete. Re-run with --commit to create the two live Отгрузка documents.')
  } else {
    console.log()
    console.log('Created documents:')
    for (const doc of created) {
      console.log(`  ${doc.salon}: ${doc.name} | ${doc.qty} units | ${doc.sumAed.toFixed(2)} AED | ${doc.url}`)
    }
  }
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
