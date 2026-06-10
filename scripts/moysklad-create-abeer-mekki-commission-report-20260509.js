#!/usr/bin/env node

/**
 * MoySklad «Полученный отчет комиссионера» — ABEER MEKKI BEAUTY LADIES CENTER (sold items).
 *
 * Snow O2 cleanser → 180ml (00021). Multivita Radiance cream → 50g (00122).
 * Cushion #3 Camel → 54464. Eye zone care kit (box) → 00059.
 *
 *   node scripts/moysklad-create-abeer-mekki-commission-report-20260509.js
 *   node scripts/moysklad-create-abeer-mekki-commission-report-20260509.js --commit
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
  moment: '2026-05-09 18:30:00',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  agentId: '39a7af2b-f5d0-11f0-0a80-108500063cb5', // ABEER MEKKI BEAUTY LADIES CENTER - L.L.C - S.P.C
  contractId: 'a5ab62b9-f5d1-11f0-0a80-1085000693a6', // Contract 31
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  marker: 'Abeer Mekki Center consignment sales sold items 2026-05-09',
}

const LINES = [
  ['00021', 3], // Snow O₂ Cleanser 180ml
  ['00030', 2], // All For Sensitive Serum 30ml
  ['54457', 3], // Ultra Shield Sun Cream SPF50/PA++++ 50g
  ['00194', 1], // Multi Vita Radiance Serum 30ml
  ['00122', 1], // Multi-Vita Radiance Cream 50g
  ['00037', 4], // Skin Barrier Protecting Cream 100g
  ['54464', 1], // Skin Caring Blemish Balm Cushion #3 Camel
  ['00059', 1], // EyeCell Eye Zone Care Kit (box)
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1000)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=${limit}&offset=${offset}`)
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
    throw new Error(`Duplicate protection: report already exists (${dup.name}, id=${dup.id})`)
  }
}

function printLines(resolved) {
  const totalMinor = resolved.reduce((sum, line) => sum + line.qty * line.price, 0)
  const totalQty = resolved.reduce((sum, line) => sum + line.qty, 0)

  console.log()
  console.log('  Line items (AED, VAT-inclusive):')
  console.log('  ' + '-'.repeat(114))
  console.log(`  ${'Code'.padEnd(6)} | ${'Product'.padEnd(62)} | ${'Qty'.padStart(4)} | ${'Unit'.padStart(9)} | ${'Line'.padStart(10)} | ${'Avail'.padStart(6)}`)
  console.log('  ' + '-'.repeat(114))
  for (const line of resolved) {
    console.log(
      `  ${line.code.padEnd(6)} | ${line.name.slice(0, 62).padEnd(62)} | ${String(line.qty).padStart(4)} | ${money(line.price).padStart(9)} | ${money(line.price * line.qty).padStart(10)} | ${String(line.available).padStart(6)}`
    )
  }
  console.log('  ' + '-'.repeat(114))
  console.log(`  Total qty: ${totalQty} | Total incl. VAT: ${money(totalMinor)} AED`)
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
  console.log('  MoySklad Полученный отчет комиссионера — Abeer Mekki Center')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${REPORT.agentId}`)
  const contract = await api('GET', `/entity/contract/${REPORT.contractId}`)
  console.log(`  Counterparty: ${agent.name}`)
  console.log(`  Agreement   : ${contract.name}`)

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
      'Sold-items table: Snow O2 180ml×3, All for sensitive serum×2, Ultra shield SPF50×3,',
      'Multi Vita Radiance serum×1 / cream 50g×1, Skin barrier 100g×4, Cushion #3 Camel×1, Eye zone care kit×1.',
    ].join('\n'),
    positions: positions(resolved),
  }

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit.')
    return
  }

  console.log()
  console.log('  Posting commission report...')
  const created = await api('POST', '/entity/commissionreportin', payload)
  const readbackPositions = await fetchAll(`/entity/commissionreportin/${created.id}/positions`)
  console.log('  Created!')
  console.log(`    Name : ${created.name}`)
  console.log(`    ID   : ${created.id}`)
  console.log(`    Sum  : ${money(created.sum)} AED`)
  console.log(`    Lines: ${readbackPositions.length}`)
  console.log(`    UI   : https://online.moysklad.ru/app/#commissionreport/edit?id=${created.id}`)
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
