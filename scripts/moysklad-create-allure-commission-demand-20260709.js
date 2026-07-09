#!/usr/bin/env node

/**
 * Allure — consignment sold report + replenishment demand (agreement 00045).
 *
 * Sold 30.06–06.07.2026 (retail sizes, MoySklad list prices):
 *   00122 MVita cream ×3, 00145 PCT toner ×1, 00035 PC cream ×2,
 *   00190 AW cream ×1, 00022 Snow Booster ×1, 00041 SPF40 ×1
 *
 * Demand: same lines (replenish sold).
 *
 *   node --import dotenv/config scripts/moysklad-create-allure-commission-demand-20260709.js
 *   node --import dotenv/config scripts/moysklad-create-allure-commission-demand-20260709.js --commit
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
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = '9e0a2de1-b31e-11ec-0a80-05e20009d062'
const CONTRACT_ID = 'c1165028-bbc8-11ec-0a80-03f80018fdc3' // Agreement 00045

const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const MARKER = `Allure consignment sold ${uaeToday()}`
const PERIOD_START = '2026-06-30 00:00:00'
const PERIOD_END = '2026-07-06 23:59:59'

/** [code, qty, label] — retail sizes @ MoySklad list */
const LINES = [
  ['00122', 3, 'Multi-Vita Radiance Cream 50g'],
  ['00145', 1, 'Problem Control Toner 200ml'],
  ['00035', 2, 'Intensive Problem Control Cream 50g'],
  ['00190', 1, 'Multi Functional Anti-Wrinkle Cream 50g'],
  ['00022', 1, 'Snow Booster Toner 200ml'],
  ['00041', 1, 'Multi Sun Cream SPF40 40g'],
]

const EXPECTED_TOTAL_MINOR = 123500
const EXPECTED_QTY = 9
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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

async function ensureNoDuplicate() {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  for (const entity of ['commissionreportin', 'demand']) {
    const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
    const dup = docs.find((d) => (d.description || '').includes(MARKER))
    if (dup) throw new Error(`Duplicate ${entity}: ${dup.name} (${dup.id})`)
  }
}

function resolveLines(stock, checkStock) {
  return LINES.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (checkStock && item.available < qty) {
      throw new Error(`Insufficient warehouse ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty, label }
  })
}

function printLines(title, resolved) {
  console.log(title)
  let totalMinor = 0
  let totalQty = 0
  for (const line of resolved) {
    totalMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.label.slice(0, 48)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)} AED`
    )
  }
  console.log(`  Subtotal: ${money(totalMinor)} AED | ${totalQty} pcs`)
  return { totalMinor, totalQty }
}

async function exportPdf(entity, docId, templateId, outPath) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/${entity}/metadata/customtemplate/${templateId}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/${entity}/${docId}/export`, {
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
  fs.writeFileSync(outPath, buf)
  return { out: outPath, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Allure — consignment report + demand (agreement 00045)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Period: ${PERIOD_START.slice(0, 10)} → ${PERIOD_END.slice(0, 10)}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  const stock = await fetchStockByCode()
  const reportResolved = resolveLines(stock, false)
  const { totalMinor, totalQty } = printLines('\n  Report + demand (same lines):', reportResolved)

  if (totalQty !== EXPECTED_QTY) throw new Error(`Qty mismatch: ${totalQty} vs ${EXPECTED_QTY}`)
  if (Math.abs(totalMinor - EXPECTED_TOTAL_MINOR) > 1) {
    throw new Error(`Total mismatch: ${money(totalMinor)} vs ${money(EXPECTED_TOTAL_MINOR)}`)
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
      'Customer: Allure | Agreement 00045 | Retail sizes @ MoySklad list.',
      'Sold 30.06–06.07: MVita cream x3, PCT toner x1, PC cream x2, AW cream x1, Snow Booster x1, SPF40 x1.',
    ].join('\n'),
    positions: reportResolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  })

  const forDemand = resolveLines(stock, true)
  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    description: [
      `${MARKER} — demand after report ${report.name}`,
      'Replenish sold: MVita cream x3, PCT toner x1, PC cream x2, AW cream x1, Snow Booster x1, SPF40 x1.',
    ].join('\n'),
    positions: forDemand.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  console.log(`\n  Report ${report.name}: ${money(report.sum)} AED`)
  console.log(`  Demand ${demand.name}: ${money(demand.sum)} AED`)
  console.log(`  Report: https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  Demand: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const salesPdf = await exportPdf(
    'commissionreportin',
    report.id,
    CONSIGNMENT_SALES_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_Allure_Consignment_Sales_${report.name}.pdf`)
  )
  const stockPdf = await exportPdf(
    'demand',
    demand.id,
    STOCK_NOTE_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_Allure_Consignment_Stock_Note_${demand.name}.pdf`)
  )
  console.log(`  Sales PDF: ${salesPdf.out} (${salesPdf.bytes} bytes)`)
  console.log(`  Stock PDF: ${stockPdf.out} (${stockPdf.bytes} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
