#!/usr/bin/env node

/**
 * Fix Ulbossyn consignment books:
 *   1) Link agreement 00043 to demand 06044 (was missing)
 *   2) Delete + repost commission report 01372 (same lines)
 *
 *   node --import dotenv/config scripts/moysklad-fix-ulbossyn-06044-contract-repost-01372.js
 *   node --import dotenv/config scripts/moysklad-fix-ulbossyn-06044-contract-repost-01372.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = 'a09d60ad-4eb7-11ec-0a80-08b3000e83a7'
const CONTRACT_ID = 'b2b25665-af1a-11ec-0a80-03530002ffd7'
const DEMAND_06044_ID = '100b5414-425e-11f1-0a80-09740084906f'
const REPORT_01372_ID = '6c328275-608f-11f1-0a80-007b000beffe'
const STATE_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'

const FIX_MARKER = `ULBOSSYN-FIX-06044-CONTRACT-${uaeToday()}`

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
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

async function readReportPositions(reportId) {
  const positions = await fetchAll(`/entity/commissionreportin/${reportId}/positions`)
  const lines = []
  for (const p of positions) {
    const a = await api('GET', p.assortment.meta.href.replace(API, ''))
    lines.push({
      code: a.code,
      productId: a.id,
      name: a.name,
      qty: p.quantity,
      price: p.price,
    })
  }
  return lines
}

async function main() {
  console.log('====================================================================')
  console.log('  Ulbossyn fix — 06044 contract + repost 01372')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const demand = await api('GET', `/entity/demand/${DEMAND_06044_ID}`)
  const report = await api('GET', `/entity/commissionreportin/${REPORT_01372_ID}`)
  const contractHref = demand.contract?.meta?.href

  console.log(`\n  Demand 06044 contract now: ${contractHref ? contractHref.split('/').pop() : 'MISSING'}`)
  console.log(`  Report 01372: ${report.name} | ${money(report.sum)} AED`)

  const reportLines = await readReportPositions(REPORT_01372_ID)
  console.log(`\n  Report 01372 lines (${reportLines.length}):`)
  for (const line of reportLines) {
    console.log(`    ${line.code} x${line.qty} @ ${money(line.price)}`)
  }

  if (!COMMIT) {
    console.log('\n  Would:')
    console.log('    1) PUT contract 00043 on demand 06044')
    console.log('    2) DELETE report 01372')
    console.log('    3) POST new commission report (same lines)')
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (!contractHref || !contractHref.includes(CONTRACT_ID)) {
    const updated = await api('PUT', `/entity/demand/${DEMAND_06044_ID}`, {
      meta: demand.meta,
      contract: href('contract', CONTRACT_ID),
      description: [
        demand.description || '',
        FIX_MARKER,
        'Retroactive fix: linked commission agreement 00043 (was missing at creation).',
      ].join('\n'),
    })
    console.log(`\n  ✓ 06044 contract set: ${updated.contract?.meta?.href?.split('/').pop()}`)
  } else {
    console.log('\n  ✓ 06044 already has contract 00043')
  }

  await api('DELETE', `/entity/commissionreportin/${REPORT_01372_ID}`)
  console.log('  ✓ Deleted report 01372')

  const moment = uaeMomentNow()
  const recreated = await api('POST', '/entity/commissionreportin', {
    moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_NOT_PAID_ID),
    commissionPeriodStart: moment,
    commissionPeriodEnd: moment,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      FIX_MARKER,
      'Reposted after linking 06044 to agreement 00043 — same sales as deleted 01372.',
      'Original marker: Ulbossyn Saparbayeva consignment report shipment 2026-06-05',
    ].join('\n'),
    positions: reportLines.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.productId),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  })

  console.log(`\n  ✓ New report: ${recreated.name} | ${money(recreated.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${recreated.id}`)
  console.log('\n  Check остаток у комиссионера — red lines should be cleared on replenished SKUs.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
