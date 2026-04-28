#!/usr/bin/env node

/**
 * Create a MoySklad "Полученный отчет комиссионера" for Ulbossyn Saparbayeva.
 *
 * Dry-run:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-create-ulbossyn-commission-report-20260427.js
 *
 * Commit:
 *   node scripts/moysklad-create-ulbossyn-commission-report-20260427.js --commit
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

const REPORT = {
  date: '2026-04-27',
  moment: '2026-04-27 21:05:00',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738', // Genosys Middle East FZ-LLC
  agentId: 'a09d60ad-4eb7-11ec-0a80-08b3000e83a7', // Ulbossyn Saparbayeva
  contractId: 'b2b25665-af1a-11ec-0a80-03530002ffd7', // Commission contract 00043
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  marker: 'Ulbossyn Saparbayeva consignment sales 2026-04-27',
}

// Product codes were selected from the existing MoySklad catalog and prior
// Ulbossyn/consignment reports. Ambiguous user labels are mapped as follows:
// - "Snow O2 Cleanser" -> 180ml, code 00021
// - "Multi Sun Cream SPF 50" -> Ultra Shield Sun Cream SPF50, code 54457
// - "Blemish Balm Cream" -> Intensive Blemish Balm Cream 50g, code 00040
const LINES = [
  ['00021', 3], // Snow O2 Cleanser 180ml
  ['00188', 1], // Microbiome Energy Infusing Mist 80ml
  ['00190', 2], // Multi Functional Anti-Wrinkle Cream 50g
  ['00122', 1], // Multi Vita Radiance Cream 50g
  ['00029', 2], // Problem Control Serum 30ml
  ['00145', 1], // Problem Control Toner 200ml
  ['00129', 2], // EPI Turnover Boosting Peeling Gel 100g
  ['00040', 2], // Intensive Blemish Balm Cream 50g
  ['00191', 2], // Multi Functional Anti-Wrinkle Serum 30ml
  ['54457', 2], // Ultra Shield Sun Cream SPF50
  ['00041', 1], // Multi Sun Cream SPF40
  ['00194', 3], // Multi Vita Radiance Serum 30ml
  ['54458', 1], // Moisture Replenishing Hyaluron Cream 50g
  ['00140', 10], // Soothing Bomb Sea Algae Mask 23g
  ['00063', 10], // Intensive Repair Collagen Mask 23g
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
    `agent=${API}/entity/counterparty/${REPORT.agentId}`,
    `moment>=${REPORT.date} 00:00:00`,
    `moment<=${REPORT.date} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((report) => (report.description || '').includes(REPORT.marker))
  if (dup) {
    throw new Error(`Duplicate protection: report already exists today (${dup.name}, id=${dup.id})`)
  }
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('  MoySklad Полученный отчет комиссионера — Ulbossyn Saparbayeva')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item) throw new Error(`Product code not found in stock report: ${code}`)
    if (!item.id) throw new Error(`Product ID missing for code: ${code}`)
    return { ...item, qty }
  })

  const totalMinor = resolved.reduce((sum, line) => sum + line.qty * line.price, 0)
  const totalQty = resolved.reduce((sum, line) => sum + line.qty, 0)

  console.log()
  console.log('  Line items (AED, VAT-inclusive):')
  console.log('  ' + '─'.repeat(114))
  console.log(`  ${'Code'.padEnd(6)} │ ${'Product'.padEnd(62)} │ ${'Qty'.padStart(4)} │ ${'Unit'.padStart(9)} │ ${'Line'.padStart(10)} │ ${'Avail'.padStart(6)}`)
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
    moment: REPORT.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', REPORT.organizationId),
    agent: href('counterparty', REPORT.agentId),
    contract: href('contract', REPORT.contractId),
    state: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/states/${REPORT.stateNotPaidId}`,
        type: 'state',
        mediaType: 'application/json',
      },
    },
    commissionPeriodStart: REPORT.moment,
    commissionPeriodEnd: REPORT.moment,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: REPORT.marker,
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  }

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit to create the live report.')
    return
  }

  console.log()
  console.log('  Posting commission report...')
  const created = await api('POST', '/entity/commissionreportin', payload)
  const positions = await fetchAll(`/entity/commissionreportin/${created.id}/positions`)
  console.log('  Created!')
  console.log(`    Name      : ${created.name}`)
  console.log(`    ID        : ${created.id}`)
  console.log(`    Sum       : ${money(created.sum)} AED`)
  console.log(`    Lines     : ${positions.length}`)
  console.log(`    UI        : https://online.moysklad.ru/app/#commissionreport/edit?id=${created.id}`)
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
