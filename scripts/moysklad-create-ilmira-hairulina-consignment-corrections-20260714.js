#!/usr/bin/env node

/**
 * Ilmira Hairulina — consignment corrections (Agreement 00003):
 *   1) Catch-up sales report: collagen 00063 ×4 (72 AED)
 *   2) Sold overnight mask 00189 ×1 (170 AED)
 *   3) Replenishment demand: sea algae 00140 ×2
 *
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-consignment-corrections-20260714.js
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-consignment-corrections-20260714.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

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
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'a7c023a6-4681-11ea-0a80-067800209158'
const CONTRACT_ID = '4c3b2437-80e3-11ea-0a80-05d4001412ae'

const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const MARKER = `ILMIRA-CONSIGNMENT-CORRECTIONS-${uaeToday()}`
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

/** Catch-up collagen + overnight sold */
const SALES_LINES = [
  ['00063', 4, 'Intensive Repair Collagen Mask 23g (catch-up)'],
  ['00189', 1, 'Skin Rescue Overnight Cream Mask 100g (sold)'],
]

const REPLENISH_LINES = [['00140', 2, 'Soothing Bomb Sea Algae Mask 25g']]

const EXPECTED_SALES_MINOR = 7200 + 17000 // 242.00

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
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
  return ((minor || 0) / 100).toFixed(2)
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
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function resolveLines(stock, lineDefs, checkWarehouse = false) {
  return lineDefs.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code} (${label})`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (checkWarehouse && item.available < qty) {
      throw new Error(`Insufficient warehouse stock ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty, label, lineMinor: item.price * qty }
  })
}

async function ensureNoDuplicate() {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  if (reports.some((r) => (r.description || '').includes(MARKER))) {
    throw new Error('Duplicate correction report today')
  }
  const demands = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  if (demands.some((d) => (d.description || '').includes(MARKER))) {
    throw new Error('Duplicate replenishment demand today')
  }
}

async function exportPdf(entityType, docId, templateId, outName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/${entityType}/metadata/customtemplate/${templateId}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/${entityType}/${docId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`PDF export ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const pdfRes = await fetch(res.headers.get('location'))
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, outName)
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function buildLedger() {
  const agentHref = encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)
  const ledger = new Map()
  async function add(type, id, sign) {
    const pos = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    for (const p of pos) {
      const code = p.assortment?.code
      if (!code) continue
      ledger.set(code, (ledger.get(code) || 0) + Number(p.quantity) * sign)
    }
  }
  for (const d of (await fetchAll(`/entity/demand?filter=agent=${agentHref}`)).filter((x) =>
    x.contract?.meta?.href?.includes(CONTRACT_ID)
  )) {
    await add('demand', d.id, 1)
  }
  for (const r of (await fetchAll(`/entity/commissionreportin?filter=agent=${agentHref}`)).filter((x) =>
    x.contract?.meta?.href?.includes(CONTRACT_ID)
  )) {
    await add('commissionreportin', r.id, -1)
  }
  for (const r of (await fetchAll(`/entity/salesreturn?filter=agent=${agentHref}`)).filter((x) =>
    x.contract?.meta?.href?.includes(CONTRACT_ID)
  )) {
    await add('salesreturn', r.id, -1)
  }
  return ledger
}

async function main() {
  console.log('====================================================================')
  console.log('  Ilmira Hairulina — consignment corrections')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, stock, ledgerBefore] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
    buildLedger(),
  ])

  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log('\n  Book BEFORE:')
  for (const c of ['00063', '00140', '00189']) {
    console.log(`    ${c}: ${ledgerBefore.get(c) || 0}`)
  }

  const salesResolved = resolveLines(stock, SALES_LINES)
  const replenishResolved = resolveLines(stock, REPLENISH_LINES, true)

  console.log('\n  Catch-up sales report:')
  for (const line of salesResolved) {
    console.log(`    ${line.code} x${line.qty} @ ${money(line.price)} = ${money(line.lineMinor)} | ${line.label}`)
  }
  const salesMinor = salesResolved.reduce((s, l) => s + l.lineMinor, 0)
  console.log(`  Sales total: ${money(salesMinor)} AED`)

  console.log('\n  Replenishment demand:')
  for (const line of replenishResolved) {
    console.log(`    ${line.code} x${line.qty} @ ${money(line.price)} = ${money(line.lineMinor)} | ${line.label}`)
  }

  if (Math.abs(salesMinor - EXPECTED_SALES_MINOR) > 1) {
    throw new Error(`Sales total mismatch: ${money(salesMinor)}`)
  }

  console.log('\n  Expected book AFTER:')
  console.log(`    00063: ${(ledgerBefore.get('00063') || 0) - 4} (target 10)`)
  console.log(`    00140: ${(ledgerBefore.get('00140') || 0) + 2} (target 15)`)
  console.log(`    00189: ${(ledgerBefore.get('00189') || 0) - 1} (target 0)`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(2)

  const report = await api('POST', '/entity/commissionreportin', {
    moment: t0,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: '2026-07-01 00:00:00',
    commissionPeriodEnd: `${uaeToday()} 23:59:59`,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Catch-up: collagen 00063 x4 (prior unreported sales).',
      'Sold: overnight mask 00189 x1.',
      'Follow-up to report 01406 / customer confirmation 2026-07-14.',
    ].join('\n'),
    positions: salesResolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  })
  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  const salesPdf = await exportPdf(
    'commissionreportin',
    report.id,
    CONSIGNMENT_SALES_TEMPLATE_ID,
    `GENOSYS_Ilmira_Hairulina_Consignment_Sales_${report.name}.pdf`
  )
  console.log(`  Sales PDF: ${salesPdf.out} (${salesPdf.bytes} bytes)`)

  const demand = await api('POST', '/entity/demand', {
    moment: t1,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    description: [
      MARKER,
      'Replenishment sea algae 00140 x2 — align book with physical count 15.',
      'Agreement 00003.',
    ].join(' | '),
    positions: replenishResolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })
  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const stockPdf = await exportPdf(
    'demand',
    demand.id,
    STOCK_NOTE_TEMPLATE_ID,
    `GENOSYS_Ilmira_Hairulina_Consignment_Stock_${demand.name}.pdf`
  )
  console.log(`  Stock note PDF: ${stockPdf.out} (${stockPdf.bytes} bytes)`)

  const ledgerAfter = await buildLedger()
  console.log('\n  Book AFTER:')
  for (const c of ['00063', '00140', '00189', '00053']) {
    console.log(`    ${c}: ${ledgerAfter.get(c) || 0}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
