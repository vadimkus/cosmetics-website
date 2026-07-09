#!/usr/bin/env node

/**
 * Abeer Mekki — Полученный отчёт комиссионера (consignment sales).
 *
 *   All For Sensitive Serum (00030) ×1
 *   EyeCell Eye Zone Care Kit (00059) ×1
 *
 * Clinic list salePrice × 0.9 (−10% partner discount) on every line.
 *
 *   node --import dotenv/config scripts/moysklad-create-abeer-mekki-commission-report-20260616.js
 *   node --import dotenv/config scripts/moysklad-create-abeer-mekki-commission-report-20260616.js --commit
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

const DISCOUNT_MULT = 0.9
const DISCOUNT_LABEL = '10% partner discount (clinic list × 0.9 on each line)'

const REPORT = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  agentId: '39a7af2b-f5d0-11f0-0a80-108500063cb5', // ABEER MEKKI BEAUTY LADIES CENTER
  contractId: 'a5ab62b9-f5d1-11f0-0a80-1085000693a6', // Contract 31
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  moment: uaeMomentNow(),
  marker: `Abeer Mekki consignment sales AFS serum + EyeCell kit ${uaeToday()}`,
}

/** [code, qty, label] */
const LINES = [
  ['00030', 1, 'All For Sensitive Serum 30ml'],
  ['00059', 1, 'EyeCell Eye Zone Care Kit (box)'],
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
      listPrice: Number(row.salePrice || 0),
    })
  }
  return stock
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

function resolveLines(stock) {
  return LINES.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.listPrice) throw new Error(`No salePrice for ${code}`)
    const discountedPrice = Math.round(item.listPrice * DISCOUNT_MULT)
    return {
      ...item,
      qty,
      label,
      listPrice: item.listPrice,
      price: discountedPrice,
    }
  })
}

async function main() {
  console.log('====================================================================')
  console.log('  Abeer Mekki — consignment sales report (−10%)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Discount: ${DISCOUNT_LABEL}\n`)

  const agent = await api('GET', `/entity/counterparty/${REPORT.agentId}`)
  const contract = await api('GET', `/entity/contract/${REPORT.contractId}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Phone   : ${agent.phone || '971556717564'}`)
  console.log(`  Contract: ${contract.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)

  console.log('\n  Lines (AED VAT incl.):')
  let totalMinor = 0
  for (const line of resolved) {
    totalMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.label} x${line.qty} | list ${money(line.listPrice)} → ${money(line.price)} (−10%) | line ${money(line.price * line.qty)}`
    )
  }
  console.log(`\n  Total: ${money(totalMinor)} AED`)

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
      'Consignment sales — sold items settlement.',
      DISCOUNT_LABEL,
      'Lines: All For Sensitive Serum 00030 ×1; EyeCell Eye Zone Care Kit 00059 ×1.',
      'Buyer: ABEER MEKKI BEAUTY LADIES CENTER - L.L.C - S.P.C | +971556717564.',
    ].join('\n'),
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
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  console.log('\n  Posting commission report...')
  const created = await api('POST', '/entity/commissionreportin', payload)
  console.log(`    Report: ${created.name} | ${money(created.sum)} AED`)
  console.log(`    https://online.moysklad.ru/app/#commissionreport/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
