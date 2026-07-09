#!/usr/bin/env node

/**
 * Shakirovna Ladies Beauty Saloon (Marina Wharf) — consignment settlement:
 *   received commissioner report → incoming payment (paymentin)
 *
 * Microbiome Mist 80ml (00188) ×2 @ 80 AED = 160 AED VAT incl.
 * Contract **00030** (commission).
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-ladies-mist-commission-report-payment-20260612.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-ladies-mist-commission-report-payment-20260612.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = '93775ae5-d18d-11ea-0a80-02e00008417d'
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'

const CUSTOMER_NAME = 'Shakirovna Ladies Beauty Saloon'
const MARKER = `SHAKIROVNA-LADIES-MIST-x2-COMMISSION-PAYMENT-${uaeToday()}`

/** code, qty */
const LINES = [['00188', 2]]

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

function orgAccountHref(id) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
      type: 'account',
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
  return ((minor || 0) / 100).toFixed(2)
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
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate report marker (${dup.name}, id=${dup.id})`)
}

function resolveLines(stock) {
  const resolved = []
  let totalMinor = 0
  let totalQty = 0
  for (const [code, qty] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Product code ${code} not found in stock report`)
    const lineMinor = item.price * qty
    totalMinor += lineMinor
    totalQty += qty
    resolved.push({ ...item, qty })
    console.log(`    ${code} ${item.name.slice(0, 55)}… x${qty} @ ${money(item.price)} → ${money(lineMinor)}`)
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} pcs`)
  return { resolved, totalMinor }
}

function reportPositions(resolved) {
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
  console.log('  Shakirovna Ladies — consignment report + incoming payment')
  console.log('====================================================================')
  console.log(`  Mode    : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Customer: ${CUSTOMER_NAME}`)
  console.log(`  Contract: 00030`)
  console.log(`  Marker  : ${MARKER}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name} (${contract.id})`)

  const stock = await fetchStockByCode()
  console.log('\n  Report lines (clinic sale price, VAT incl.):')
  const { resolved, totalMinor } = resolveLines(stock)

  if (totalMinor !== 16000) {
    throw new Error(`Expected total 160.00 AED, got ${money(totalMinor)} — check 00188 salePrice`)
  }

  if (COMMIT) await ensureNoDuplicate()

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(2)

  console.log('\n  Posting received commissioner report...')
  const report = await api('POST', '/entity/commissionreportin', {
    moment: t0,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: t0,
    commissionPeriodEnd: t0,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Shakirovna Ladies Beauty Saloon | Marina Wharf | Agreement 00030.',
      'Consignment sold: Microbiome Mist 80ml (00188) ×2 @ 80 AED = 160 AED total.',
    ].join('\n'),
    positions: reportPositions(resolved),
  })
  const reportPos = await fetchAll(`/entity/commissionreportin/${report.id}/positions`)
  console.log(`    Report: ${report.name} | ${money(report.sum)} AED | lines=${reportPos.length}`)
  console.log(`    https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  console.log('\n  Posting incoming payment (paymentin)...')
  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: t1,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: `Incoming payment for commissioner report ${report.name} | ${MARKER}`,
    sum: totalMinor,
    operations: [
      {
        meta: {
          href: `${API}/entity/commissionreportin/${report.id}`,
          type: 'commissionreportin',
          mediaType: 'application/json',
        },
        linkedSum: totalMinor,
      },
    ],
  })
  console.log(`    Payment: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`    https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  const reportAfter = await api('GET', `/entity/commissionreportin/${report.id}`)
  console.log('\n  Verification:')
  console.log(`    Report payedSum: ${money(reportAfter.payedSum)} / ${money(reportAfter.sum)} AED`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
