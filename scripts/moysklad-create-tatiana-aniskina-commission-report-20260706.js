#!/usr/bin/env node

/**
 * Tatiana Aniskina Nail Master — consignment sales report (agreement 00025) + PDF.
 *
 *   00191 Multi Functional Anti-Wrinkle Serum 30ml x1
 *   54458 Moisture Replenishing Hyaluron Cream 50g x1
 *   00123 Multi Vita Radiance Cream 230g x1  (user: 250g)
 *
 *   node --import dotenv/config scripts/moysklad-create-tatiana-aniskina-commission-report-20260706.js
 *   node --import dotenv/config scripts/moysklad-create-tatiana-aniskina-commission-report-20260706.js --commit
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
const AGENT_ID = '603f398e-bd3d-11eb-0a80-00570009cb13' // Tatiana Aniskina Nail Master
const CONTRACT_ID = 'f68e2d8d-c3c5-11eb-0a80-05f500276179' // Agreement 00025
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `Tatiana Aniskina consignment sales ${uaeToday()}`

/** [code, qty] @ clinic salePrice */
const SOLD_LINES = [
  ['00191', 1],
  ['54458', 1],
  ['00123', 1],
]

const EXPECTED_TOTAL_AED = 520 // 165 + 145 + 210

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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate: report ${dup.name} (${dup.id})`)
}

async function exportCommissionSalesPdf(reportId, reportName) {
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
    const t = await res.text()
    throw new Error(`PDF export ${res.status}: ${t.slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('PDF export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, `GENOSYS_Tatiana_Aniskina_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Tatiana Aniskina Nail Master — consignment sales + PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  if (COMMIT) await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const resolved = SOLD_LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    return { ...item, qty }
  })

  let totalMinor = 0
  console.log('\n  Sold lines:')
  for (const line of resolved) {
    totalMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 52)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED`)

  if (Math.abs(totalMinor - EXPECTED_TOTAL_AED * 100) > 1) {
    throw new Error(`Total mismatch: ${money(totalMinor)} vs ${EXPECTED_TOTAL_AED.toFixed(2)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const report = await api('POST', '/entity/commissionreportin', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: '2026-07-01 00:00:00',
    commissionPeriodEnd: '2026-07-31 23:59:59',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Tatiana Aniskina Nail Master | Agreement 00025.',
      'Multi Functional Anti-Wrinkle Serum 00191, Hyaluron cream 54458, Multi Vita cream 00123 (230g jar).',
      'User label "Anti-Wrinkle Serum 30ml" = 00191 multifunctional (not 00027).',
      'Report only — no shipment.',
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

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  const pdfPath = await exportCommissionSalesPdf(report.id, report.name)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
