#!/usr/bin/env node

/**
 * Viktoriia Klymenko — Полученный отчёт комиссионера (agreement 33).
 *
 *   Beige cushion (00144) ×2
 *   Microbiome Mist (00188) ×1
 *   Peptide Gel Mask 39g (00012) ×5
 *
 *   node --import dotenv/config scripts/moysklad-create-viktoriia-klymenko-commission-report-20260616.js
 *   node --import dotenv/config scripts/moysklad-create-viktoriia-klymenko-commission-report-20260616.js --commit
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
  agentId: 'fadad040-1090-11f1-0a80-00c800748f51', // Viktoriia Klymenko
  contractId: '419cb77b-1091-11f1-0a80-103000292afc', // Agreement 33
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  moment: uaeMomentNow(),
  marker: `Viktoriia Klymenko consignment sales ${uaeToday()}`,
}

const LINES = [
  ['00144', 2], // Beige BB cushion
  ['00188', 1], // Microbiome Energy Infusing Mist 80ml
  ['00012', 5], // Peptide Gel Mask 39g (single pcs)
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
      price: Number(row.salePrice || 0),
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

async function main() {
  console.log('====================================================================')
  console.log('  Viktoriia Klymenko — consignment sales report (agreement 33)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${REPORT.agentId}`)
  const contract = await api('GET', `/entity/contract/${REPORT.contractId}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    return { ...item, qty }
  })

  let totalMinor = 0
  console.log('\n  Lines (clinic salePrice, VAT incl.):')
  for (const line of resolved) {
    totalMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 55)} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)} AED`
    )
  }
  console.log(`\n  Total: ${money(totalMinor)} AED`)

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
    commissionPeriodStart: REPORT.moment,
    commissionPeriodEnd: REPORT.moment,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      REPORT.marker,
      'Customer: Viktoriia Klymenko | Agreement 33.',
      'Sold: Beige cushion 00144 x2, Microbiome Mist 00188 x1, Peptide Gel Mask 00012 x5.',
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  })

  console.log(`\n  Report: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
