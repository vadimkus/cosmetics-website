#!/usr/bin/env node

/**
 * MoySklad «Полученный отчет комиссионера» (sales) — OGUZ MED.
 *
 * Agent: OGUZ MED PARA PHARMACEUTICAL PRODUCTS TRADING L.L.C (has agreement 32).
 * Ignore duplicate name without contract (6dbd… — no commission contract in MS).
 *
 * Dry-run:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-create-oguz-med-commission-report-20260509.js
 *
 * Commit:
 *   node scripts/moysklad-create-oguz-med-commission-report-20260509.js --commit
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
  date: '2026-05-09',
  moment: '2026-05-09 12:00:00',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  agentId: 'f8560d11-04f2-11f1-0a80-1c3800239bb6', // OGUZ MED PARA PHARMACEUTICAL PRODUCTS TRADING L.L.C
  contractId: 'ff39179b-04f2-11f1-0a80-1af600231c39', // Agreement 32
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  marker: 'Oguz Med consignment sales 2026-05-09',
}

const LINES = [
  ['00063', 5], // Intensive Repair Collagen Mask 23g
  ['00140', 5], // Soothing Bomb Sea Algae Mask 23g
  ['00040', 1], // Intensive Blemish Balm Cream 50g
  ['00122', 1], // Multi-Vita Radiance Cream 50g
  ['00031', 1], // Intensive Hydro Soothing Cream 50g
  ['00143', 1], // Skin Caring Blemish Balm Cushion #1 Ivory
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1000)}`)
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

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
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

function printLines(resolved) {
  const totalMinor = resolved.reduce((sum, line) => sum + line.qty * line.price, 0)
  const totalQty = resolved.reduce((sum, line) => sum + line.qty, 0)

  console.log()
  console.log('  Line items (AED, VAT-inclusive):')
  console.log('  ' + '-'.repeat(110))
  console.log(`  ${'Code'.padEnd(6)} | ${'Product'.padEnd(58)} | ${'Qty'.padStart(4)} | ${'Unit'.padStart(9)} | ${'Line'.padStart(10)}`)
  console.log('  ' + '-'.repeat(110))
  for (const line of resolved) {
    console.log(
      `  ${line.code.padEnd(6)} | ${line.name.slice(0, 58).padEnd(58)} | ${String(line.qty).padStart(4)} | ${money(line.price).padStart(9)} | ${money(line.price * line.qty).padStart(10)}`
    )
  }
  console.log('  ' + '-'.repeat(110))
  console.log(`  Total qty: ${totalQty} | Total incl. VAT: ${money(totalMinor)} AED`)
  console.log(`  VAT 5% included: ${money(totalMinor - totalMinor / 1.05)} AED`)
}

function positions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    reward: 0,
  }))
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad Полученный отчет комиссионера — Oguz Med (agr. 32)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${REPORT.agentId}`)
  const contract = await api('GET', `/entity/contract/${REPORT.contractId}`)
  console.log(`  Counterparty: ${agent.name} (${agent.id})`)
  console.log(`  Agreement   : ${contract.name} (${contract.id})`)

  await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item) throw new Error(`Product code not found in stock report: ${code}`)
    if (!item.id) throw new Error(`Product ID missing for code: ${code}`)
    return { ...item, qty }
  })

  printLines(resolved)

  const payload = {
    moment: REPORT.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', REPORT.organizationId),
    agent: href('counterparty', REPORT.agentId),
    contract: href('contract', REPORT.contractId),
    state: stateHref('commissionreportin', REPORT.stateNotPaidId),
    commissionPeriodStart: REPORT.moment,
    commissionPeriodEnd: REPORT.moment,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      REPORT.marker,
      'Customer: OGUZ MED PARA PHARMACEUTICAL PRODUCTS TRADING L.L.C',
      'Agreement: 32',
      'Created from user-provided sold-items list.',
    ].join('\n'),
    positions: positions(resolved),
  }

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit to create the live report.')
    return
  }

  console.log()
  console.log('  Posting commission report...')
  const created = await api('POST', '/entity/commissionreportin', payload)
  const readbackPositions = await fetchAll(`/entity/commissionreportin/${created.id}/positions`)
  console.log('  Created!')
  console.log(`    Name      : ${created.name}`)
  console.log(`    ID        : ${created.id}`)
  console.log(`    Sum       : ${money(created.sum)} AED`)
  console.log(`    Positions : ${readbackPositions.length}`)
  console.log(`    UI        : https://online.moysklad.ru/app/#commissionreport/edit?id=${created.id}`)
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
