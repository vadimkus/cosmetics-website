#!/usr/bin/env node

/**
 * MoySklad Отгрузка (demand) — Persona Dubai Marina / First Person Ladies Salon (Marina)
 * under commission agreement 00024. Replenishment only (no commission report).
 *
 * Dry-run:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-create-persona-marina-demand-20260505.js
 *
 * Commit:
 *   node scripts/moysklad-create-persona-marina-demand-20260505.js --commit
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

const DEMAND = {
  date: '2026-05-05',
  moment: '2026-05-05 14:30:00',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738', // Genosys Middle East FZ-LLC
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a', // Genosys Warehouse
  agentId: 'af21a79a-63cd-11ea-0a80-02b2000e2aeb', // First Person Ladies Salon (Marina)
  contractId: '56ca0166-c388-11eb-0a80-093a001d1ee0', // Agreement 00024
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: 'Persona Dubai Marina replenishment shipment 2026-05-05',
}

// "Hair toner" → HR3 Matrix Hair Tonic 70ml (same mapping as Persona Marina commission lines).
const LINES = [
  ['00035', 2], // Intensive Problem Control Cream 50g
  ['00021', 2], // Snow O₂ Cleanser 180ml
  ['00022', 1], // Snow Booster Toner 200ml
  ['00144', 2], // Skin Caring Blemish Balm Cushion #2 Beige
  ['00052', 3], // HR3 Matrix Scalp & Hair Shampoo 300ml
  ['00051', 2], // HR3 Matrix Hair Tonic 70ml (user: Hair toner)
  ['54467', 2], // Skin Reboot PDRN mask Pack (30 sheets) 350g
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} — ${text.slice(0, 1000)}`)
  return text ? JSON.parse(text) : null
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

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return (minor / 100).toFixed(2)
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${DEMAND.agentId}`,
    `moment>=${DEMAND.date} 00:00:00`,
    `moment<=${DEMAND.date} 23:59:59`,
  ].join(';')
  const demands = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = demands.find((d) => (d.description || '').includes(DEMAND.marker))
  if (dup) {
    throw new Error(`Duplicate protection: demand already exists today (${dup.name}, id=${dup.id})`)
  }
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('  MoySklad Отгрузка — Persona Dubai Marina (agreement 00024)')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${DEMAND.agentId}`)
  const contract = await api('GET', `/entity/contract/${DEMAND.contractId}`)
  console.log(`  Counterparty: ${agent.name}`)
  console.log(`  Agreement   : ${contract.name}`)

  await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item) throw new Error(`Product code not found in stock report: ${code}`)
    if (!item.id) throw new Error(`Product ID missing for code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock for ${code} ${item.name}: need ${qty}, available ${item.available}`)
    }
    return { ...item, qty }
  })

  const totalMinor = resolved.reduce((sum, line) => sum + line.qty * line.price, 0)
  const totalQty = resolved.reduce((sum, line) => sum + line.qty, 0)

  console.log()
  console.log('  Line items (AED, VAT-inclusive):')
  console.log('  ' + '─'.repeat(114))
  console.log(
    `  ${'Code'.padEnd(6)} │ ${'Product'.padEnd(62)} │ ${'Qty'.padStart(4)} │ ${'Unit'.padStart(9)} │ ${'Line'.padStart(10)} │ ${'Avail'.padStart(6)}`
  )
  console.log('  ' + '─'.repeat(114))
  for (const line of resolved) {
    console.log(
      `  ${line.code.padEnd(6)} │ ${line.name.slice(0, 62).padEnd(62)} │ ${String(line.qty).padStart(4)} │ ${money(line.price).padStart(9)} │ ${money(line.price * line.qty).padStart(10)} │ ${String(line.available).padStart(6)}`
    )
  }
  console.log('  ' + '─'.repeat(114))
  console.log(`  Total qty: ${totalQty} | Total incl. VAT: ${money(totalMinor)} AED`)
  console.log(`  VAT 5% included: ${money(totalMinor - totalMinor / 1.05)} AED`)

  const payload = {
    moment: DEMAND.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', DEMAND.organizationId),
    agent: href('counterparty', DEMAND.agentId),
    contract: href('contract', DEMAND.contractId),
    store: href('store', DEMAND.storeId),
    state: {
      meta: {
        href: `${API}/entity/demand/metadata/states/${DEMAND.stateShippedId}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
    description: [
      DEMAND.marker,
      'Customer: First Person Ladies Salon (Marina) / Persona Dubai Marina',
      'Agreement: 00024 — replenishment отгрузка (commission report not bundled).',
      'Lines: Problem Control 50g x2, Snow Cleanser 180ml x2, Snow Booster 200ml x1, Cushion Beige x2, Matrix Shampoo x3, Matrix Hair Tonic x2 (user: hair toner), PDRN pack x2.',
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  }

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit to create the live Отгрузка.')
    return
  }

  console.log()
  console.log('  Posting demand...')
  const created = await api('POST', '/entity/demand', payload)
  const positions = await fetchAll(`/entity/demand/${created.id}/positions`)
  console.log('  Created!')
  console.log(`    Name      : ${created.name}`)
  console.log(`    ID        : ${created.id}`)
  console.log(`    Sum       : ${money(created.sum)} AED`)
  console.log(`    Lines     : ${positions.length}`)
  console.log(`    UI        : https://online.moysklad.ru/app/#demand/edit?id=${created.id}`)
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
