#!/usr/bin/env node

/**
 * Love My Body — received commissioner report only (agreement 27).
 *
 *   node --import dotenv/config scripts/moysklad-create-love-my-body-commission-report-20260602.js
 *   node --import dotenv/config scripts/moysklad-create-love-my-body-commission-report-20260602.js --commit
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

const REPORT = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  agentId: '9c78fe86-be3b-11f0-0a80-007f0036b570', // LOVE MY BODY LADIES SPA CLUB L.L.C
  contractId: 'aaee7975-be3b-11f0-0a80-173e00383194', // Agreement 27
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  moment: uaeMomentNow(),
  date: uaeToday(),
  commissionPeriodStart: '2026-05-01 00:00:00',
  commissionPeriodEnd: '2026-05-31 23:59:59',
  marker: `Love My Body consignment sales ${uaeToday()}`,
}

const LINES = [
  ['00053', 3], // EyeCell Eye Peptide Gel Patch (box)
  ['00012', 7], // Peptide Gel Mask 39g
  ['00054', 2], // EyeCell Eye Contour Serum 10ml
  ['00063', 2], // Intensive Repair Collagen Mask 23g
  ['00055', 1], // EyeCell Eye Contour Cream 20ml
  ['00031', 1], // Intensive Hydro Soothing Cream 50g
  ['54458', 1], // Moisture Replenishing Hyaluron Cream 50g
  ['00144', 1], // Skin Caring Blemish Balm Cushion #2 Biege
  ['00041', 1], // Multi Sun Cream SPF40/PA++ 40g
  ['00140', 4], // Soothing Bomb Sea Algae Mask 23g
  ['54472', 1], // Revita Glow BB #01 Bright 50g
  ['00195', 1], // Moisture Replenishing Hyaluron Serum 30ml
  ['54457', 1], // Ultra Shield Sun Cream SPF50 50g
  ['54461', 1], // Skin Defender Lip & Eye Makeup Remover 200ml
  ['00129', 1], // EPI Turnover Boosting Peeling Gel 100g
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1200)}`)
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function fetchProductByCode(code) {
  const data = await api('GET', `/entity/product?filter=${encodeURIComponent(`code=${code}`)}&limit=1`)
  const product = data?.rows?.[0]
  if (!product) return null
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    price: Number(product.salePrices?.[0]?.value || 0),
  }
}

async function resolveLines(stock) {
  const resolved = []
  for (const [code, qty] of LINES) {
    let item = stock.get(code)
    if (!item?.id) item = await fetchProductByCode(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    resolved.push({ ...item, qty })
  }
  return resolved
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${REPORT.agentId}`,
    `moment>=${REPORT.date} 00:00:00`,
    `moment<=${REPORT.date} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(REPORT.marker))
  if (dup) throw new Error(`Duplicate: report ${dup.name} (${dup.id})`)
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
  console.log('  Love My Body — Полученный отчет комиссионера (agr. 27)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${REPORT.agentId}`),
    api('GET', `/entity/contract/${REPORT.contractId}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)
  console.log(`  Period  : ${REPORT.commissionPeriodStart} → ${REPORT.commissionPeriodEnd}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = await resolveLines(stock)
  const totalMinor = resolved.reduce((s, l) => s + l.qty * l.price, 0)
  const totalQty = resolved.reduce((s, l) => s + l.qty, 0)

  console.log('\n  Sold lines:')
  for (const line of resolved) {
    console.log(`    ${line.code} ${line.name.slice(0, 55)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`)
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} units | ${resolved.length} lines`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/commissionreportin', {
    moment: REPORT.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', REPORT.organizationId),
    agent: href('counterparty', REPORT.agentId),
    contract: href('contract', REPORT.contractId),
    state: stateHref('commissionreportin', REPORT.stateNotPaidId),
    commissionPeriodStart: REPORT.commissionPeriodStart,
    commissionPeriodEnd: REPORT.commissionPeriodEnd,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      REPORT.marker,
      'LOVE MY BODY LADIES SPA CLUB L.L.C | Agreement 27.',
      'Report only — no shipment.',
      'Peptide mask = 00012 sheets; peptide gel patch = 00053 box.',
    ].join('\n'),
    positions: positions(resolved),
  })

  const readback = await fetchAll(`/entity/commissionreportin/${created.id}/positions`)
  console.log(`\n  Report: ${created.name} | ${money(created.sum)} AED | ${readback.length} lines`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
