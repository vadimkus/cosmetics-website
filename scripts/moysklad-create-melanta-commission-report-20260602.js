#!/usr/bin/env node

/**
 * Melanta Poly Clinic — received commissioner report only (contract 14).
 *
 *   node --import dotenv/config scripts/moysklad-create-melanta-commission-report-20260602.js
 *   node --import dotenv/config scripts/moysklad-create-melanta-commission-report-20260602.js --commit
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
  agentId: 'c3908257-ccdd-11ef-0a80-11a10053430e', // Melanta Poly Clinic L.L.C
  contractId: 'ca7a8aa6-ccdd-11ef-0a80-18080052ee1c', // Contract 14
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  moment: uaeMomentNow(),
  date: uaeToday(),
  commissionPeriodStart: '2026-05-01 00:00:00',
  commissionPeriodEnd: '2026-05-31 23:59:59',
  marker: `Melanta Poly Clinic consignment sales ${uaeToday()}`,
}

const LINES = [
  ['00053', 4], // EyeCell Eye Peptide Gel Patch (box)
  ['54457', 2], // Ultra Shield Sun Cream SPF50 50g
  ['00144', 2], // Skin Caring Blemish Balm Cushion #2 Biege
  ['00143', 1], // Skin Caring Blemish Balm Cushion #1 Ivory (user sheet: #2 Ivory)
  ['54467', 1], // Skin Reboot PDRN mask Pack
  ['00021', 1], // Snow O₂ Cleanser 180ml
  ['00055', 1], // EyeCell Eye Contour Cream 20ml
  ['00054', 1], // EyeCell Eye Contour Serum 10ml
  ['00022', 1], // Snow Booster Toner 200ml
  ['00063', 1], // Intensive Repair Collagen Mask 23g (sheet: 16g)
  ['00140', 1], // Soothing Bomb Sea Algae Mask 23g (sheet: 16g)
  ['00189', 1], // Skin Rescue Overnight Cream Mask 100g
  ['00042', 1], // EGF Repair Oxymask Cream 50ml
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
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
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
  console.log('  Melanta Poly Clinic — Полученный отчет комиссионера (contract 14)')
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
      'Melanta Poly Clinic L.L.C | Contract 14 | May 2026 sold items.',
      'Report only — no shipment.',
      'Ivory cushion = 00143 (#1). Masks 16g label → 23g SKUs 00063/00140.',
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
