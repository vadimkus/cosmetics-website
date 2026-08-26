#!/usr/bin/env node

/**
 * Ilmira Hairulina — consignment sales (Agreement 00003).
 *   00034 Multi Functional Anti-Wrinkle Cream 250g ×2 @ 210
 *   00063 Collagen mask ×8 @ 18
 *   00140 Sea Algae mask ×8 @ 18
 *   00012 Peptide Gel Mask ×5 @ 38
 * Report only — unpaid. PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-consignment-sales-20260817.js
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-consignment-sales-20260817.js --commit
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

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = 'a7c023a6-4681-11ea-0a80-067800209158'
const CONTRACT_ID = '4c3b2437-80e3-11ea-0a80-05d4001412ae'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `ILMIRA-HAIRULINA-CONS-SALES-${uaeToday()}`
const PERIOD_START = '2026-07-15 00:00:00'
const PERIOD_END = `${uaeToday()} 23:59:59`

/** [code, qty, clinicAed] — same unit prices as reports 01406 / 01407 */
const LINES = [
  ['00034', 2, 210],
  ['00063', 8, 18],
  ['00140', 8, 18],
  ['00012', 5, 38],
]
const EXPECTED_SUM_MINOR = 89800
const EXPECTED_QTY = 23

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
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
    })
  }
  return stock
}

async function buildBookLedger() {
  const agentHref = encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)
  const demands = (await fetchAll(`/entity/demand?filter=agent=${agentHref}`)).filter((d) =>
    d.contract?.meta?.href?.includes(CONTRACT_ID),
  )
  const reports = (await fetchAll(`/entity/commissionreportin?filter=agent=${agentHref}`)).filter((r) =>
    r.contract?.meta?.href?.includes(CONTRACT_ID),
  )
  const returns = (await fetchAll(`/entity/salesreturn?filter=agent=${agentHref}`)).filter((r) =>
    r.contract?.meta?.href?.includes(CONTRACT_ID),
  )
  const ledger = new Map()
  async function add(type, id, sign) {
    const pos = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    for (const p of pos) {
      const code = p.assortment?.code
      if (!code) continue
      ledger.set(code, (ledger.get(code) || 0) + Number(p.quantity) * sign)
    }
  }
  for (const d of demands) await add('demand', d.id, 1)
  for (const r of reports) await add('commissionreportin', r.id, -1)
  for (const r of returns) await add('salesreturn', r.id, -1)
  return ledger
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate report (${dup.name}, id=${dup.id})`)
}

async function exportSalesPdf(reportId, reportName) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const body = {
    template: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/customtemplate/${CONSIGNMENT_SALES_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/commissionreportin/${reportId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const out = path.join(ORDERS_DIR, `GENOSYS_Ilmira_Hairulina_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Ilmira Hairulina — consignment sales')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, stock, ledger] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
    buildBookLedger(),
  ])
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)
  console.log(`  Period  : ${PERIOD_START.slice(0, 10)} → ${PERIOD_END.slice(0, 10)}`)

  const resolved = []
  let sumMinor = 0
  let totalQty = 0
  for (const [code, qty, unitAed] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    const book = ledger.get(code) || 0
    if (book < qty) {
      console.log(`    WARN book ${code}: need ${qty}, have ${book} — posting anyway`)
    } else {
      console.log(`    book ${code}: ${book} → ${book - qty}`)
    }
    const priceMinor = Math.round(unitAed * 100)
    const lineMinor = priceMinor * qty
    sumMinor += lineMinor
    totalQty += qty
    resolved.push({ ...item, qty, priceMinor })
    console.log(`    ${code} ${item.name.slice(0, 56)} x${qty} @ ${unitAed} = ${money(lineMinor)}`)
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} pcs`)

  if (sumMinor !== EXPECTED_SUM_MINOR || totalQty !== EXPECTED_QTY) {
    throw new Error(
      `Expected ${money(EXPECTED_SUM_MINOR)} / ${EXPECTED_QTY} pcs, got ${money(sumMinor)} / ${totalQty}`,
    )
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const report = await api('POST', '/entity/commissionreportin', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: PERIOD_START,
    commissionPeriodEnd: PERIOD_END,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Ilmira Hairulina | Agreement 00003.',
      'Consignment sold: IMFC 250g x2, collagen x8, sea algae x8, peptide x5.',
      'Clinic prices. Report only — no replenishment. Not paid yet.',
      `${resolved.length} lines / ${totalQty} pcs / ${money(sumMinor)} AED.`,
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.priceMinor,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  })

  if ((report.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum mismatch: ${money(report.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

  const pdfPath = await exportSalesPdf(report.id, report.name)
  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
