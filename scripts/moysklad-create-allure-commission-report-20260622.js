#!/usr/bin/env node

/**
 * Allure — Полученный отчёт комиссионера (agreement 00045).
 *
 * Consolidated sold items (12 pcs / 1,790 AED):
 *   00190 Anti-Wrinkle Cream 50g ×5 @ 145
 *   00144 BB Cushion Beige ×2 @ 150
 *   54457 Ultra Shield SPF50 ×2 @ 125
 *   00055 EyeCell Eye Contour Cream ×1 @ 185
 *   00029 Problem Control Serum ×1 @ 165
 *   00194 Multi Vita Radiance Serum ×1 @ 165
 *
 *   node --import dotenv/config scripts/moysklad-create-allure-commission-report-20260622.js
 *   node --import dotenv/config scripts/moysklad-create-allure-commission-report-20260622.js --commit
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
  agentId: '9e0a2de1-b31e-11ec-0a80-05e20009d062', // Allure
  contractId: 'c1165028-bbc8-11ec-0a80-03f80018fdc3', // Agreement 00045
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  moment: uaeMomentNow(),
  periodStart: '2026-05-26 00:00:00',
  periodEnd: '2026-06-22 23:59:59',
  marker: `Allure consignment sold consolidated ${uaeToday()}`,
}

/** [code, qty, unitAed] — MoySklad list prices */
const LINES = [
  ['00190', 5, 145],
  ['00144', 2, 150],
  ['54457', 2, 125],
  ['00055', 1, 185],
  ['00029', 1, 165],
  ['00194', 1, 165],
]

const EXPECTED_TOTAL_AED = 1790
const EXPECTED_QTY = 12

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
      salePrice: Number(row.salePrice || 0),
    })
  }
  return stock
}

function buildPositions(stock) {
  const positions = []
  let sumMinor = 0
  let qty = 0

  console.log('\n  Sold lines:')
  for (const [code, lineQty, unitAed] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    const priceMinor = Math.round(unitAed * 100)
    const lineMinor = priceMinor * lineQty
    sumMinor += lineMinor
    qty += lineQty

    if (item.salePrice && Math.abs(item.salePrice - priceMinor) > 1) {
      console.warn(
        `  WARN ${code}: script ${unitAed} vs MoySklad list ${money(item.salePrice)} — using script price`
      )
    }

    console.log(`    ${code} ${item.name.slice(0, 52)} x${lineQty} @ ${unitAed.toFixed(2)} = ${money(lineMinor)}`)
    positions.push({
      quantity: lineQty,
      price: priceMinor,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })
  }

  if (qty !== EXPECTED_QTY) throw new Error(`Qty mismatch: ${qty} vs ${EXPECTED_QTY}`)
  if (Math.abs(sumMinor - EXPECTED_TOTAL_AED * 100) > 1) {
    throw new Error(`Total mismatch: ${money(sumMinor)} vs ${EXPECTED_TOTAL_AED.toFixed(2)}`)
  }

  return { positions, sumMinor, qty }
}

async function ensureNoDuplicate() {
  const date = REPORT.moment.slice(0, 10)
  const filter = [
    `agent=${API}/entity/counterparty/${REPORT.agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(REPORT.marker))
  if (dup) {
    throw new Error(
      `Duplicate: ${dup.name} (${dup.id}) https://online.moysklad.ru/app/#commissionreport/edit?id=${dup.id}`
    )
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Allure — отчёт комиссионера (consolidated sales)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${REPORT.agentId}`),
    api('GET', `/entity/contract/${REPORT.contractId}`),
  ])
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)
  console.log(`  Period  : ${REPORT.periodStart.slice(0, 10)} → ${REPORT.periodEnd.slice(0, 10)}`)

  const stock = await fetchStockByCode()
  const { positions, sumMinor, qty } = buildPositions(stock)
  console.log(`\n  Total: ${money(sumMinor)} AED | ${qty} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const report = await api('POST', '/entity/commissionreportin', {
    moment: REPORT.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', REPORT.organizationId),
    agent: href('counterparty', REPORT.agentId),
    contract: href('contract', REPORT.contractId),
    state: stateHref('commissionreportin', REPORT.stateNotPaidId),
    commissionPeriodStart: REPORT.periodStart,
    commissionPeriodEnd: REPORT.periodEnd,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      REPORT.marker,
      'Customer: Allure | Agreement 00045 | MoySklad list prices.',
      'AW cream x5, Beige cushion x2, SPF50 x2, Eye contour cream, Problem serum, MVita serum.',
      `Consolidated total ${money(sumMinor)} AED / ${qty} pcs.`,
    ].join('\n'),
    positions,
  })

  const pos = await fetchAll(`/entity/commissionreportin/${report.id}/positions`)
  console.log(`\n  Created report: ${report.name} | ${money(report.sum)} AED | ${pos.length} lines`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
