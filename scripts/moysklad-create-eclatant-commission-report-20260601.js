#!/usr/bin/env node

/**
 * ECLATANT&CO — received commissioner report (sold items) under contract 18.
 *
 *   node --import dotenv/config scripts/moysklad-create-eclatant-commission-report-20260601.js
 *   node --import dotenv/config scripts/moysklad-create-eclatant-commission-report-20260601.js --commit
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
  agentId: '0df9bafd-1a99-11f0-0a80-08b100073e9f', // ECLATANT&CO TRADING CO L.L.C
  contractId: '132684fd-1a99-11f0-0a80-071f0006a1ec', // Contract 18
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  moment: uaeMomentNow(),
  date: uaeToday(),
  commissionPeriodStart: '2026-05-01 00:00:00',
  commissionPeriodEnd: '2026-05-31 23:59:59',
  marker: `Eclatant consignment sales sold items ${uaeToday()}`,
}

/**
 * [code, qty] — from sales summary screenshot 2026-06-01
 * 54462 mapped from "Glow Into the Holidays" → Holiday Kit Skin Glow Coverage #2
 * 54467 mapped from "PDRN mask 1 piece" → PDRN mask pack (only MoySklad SKU)
 */
const LINES = [
  ['00144', 5], // Cushion #2 Beige
  ['54462', 1], // Glow Into the Holidays → Holiday Kit Skin Glow Coverage Kit #2
  ['00012', 10], // Peptide Gel Mask 39g
  ['00021', 2], // Snow O₂ Cleanser 180ml
  ['00041', 2], // Multi Sun Cream SPF40
  ['54467', 1], // Skin Reboot PDRN mask Pack
  ['00053', 1], // EyeCell Eye Peptide Gel Patch (box)
  ['00143', 1], // Cushion #1 Ivory
  ['00035', 1], // Intensive Problem Control Cream 50g
  ['00063', 7], // Intensive Repair Collagen Mask 23g
  ['00140', 4], // Soothing Bomb Sea Algae Mask 23g
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
  console.log('  Eclatant — Полученный отчет комиссионера (contract 18)')
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

  console.log('\n  Sold lines (clinic salePrice VAT incl.):')
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
      'ECLATANT&CO TRADING CO L.L.C | Contract 18 | May 2026 sold-items summary.',
      'Glow Into the Holidays → 54462 Holiday Kit Skin Glow Coverage #2.',
      'PDRN mask 1 piece → 54467 PDRN mask pack (single MoySklad SKU).',
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
