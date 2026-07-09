#!/usr/bin/env node

/**
 * IULIA BEAUTY SALON LLC — consignment sold (retail sizes) → report + demand (agreement 28).
 *
 *   node --import dotenv/config scripts/moysklad-create-iulia-beauty-commission-demand-20260701.js
 *   node --import dotenv/config scripts/moysklad-create-iulia-beauty-commission-demand-20260701.js --commit
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
const EXPORT_PDF = !process.argv.includes('--no-pdf')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = '96500719-c90e-11f0-0a80-19c8002d2932' // IULIA BEAUTY SALON LLC
const CONTRACT_ID = 'f2dad83f-c91f-11f0-0a80-09d3003136c5' // agreement 28

const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const MARKER = `IULIA Beauty Salon consignment sold retail table ${uaeToday()}`

/** [code, qty, label] — all retail SKUs */
const LINES = [
  ['00031', 1, 'Intensive Hydro Soothing Cream 50g'],
  ['00194', 1, 'Multi Vita Radiance Serum 30ml'],
  ['00189', 1, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00021', 1, 'Snow O₂ Cleanser 180ml'],
  ['00041', 1, 'Multi Sun Cream SPF40/PA++ 40g'],
  ['00054', 1, 'EyeCell Eye Contour Serum 10ml'],
  ['00191', 1, 'Multi Functional Anti-Wrinkle Serum 30ml'],
  ['00063', 3, 'Intensive Repair Collagen Mask 23g'],
  ['00143', 1, 'Skin Caring Blemish Balm Cushion #1 Ivory'],
  ['54457', 1, 'Ultra Shield Sun Cream SPF50/PA++++ 50g'],
  ['00030', 2, 'All For Sensitive Serum 30ml'],
  ['00122', 2, 'Multi Vita Radiance Cream 50g'],
  ['00188', 1, 'Microbiome Energy Infusing Mist 80ml'],
  ['00012', 2, 'Peptide Gel Mask 39g'],
  ['00052', 1, 'HR³ Matrix Scalp & Hair Shampoo 300ml'],
  ['00140', 4, 'Soothing Bomb Sea Algae Mask 23g'],
  ['00040', 1, 'Intensive Blemish Balm Cream 50g'],
]

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
    const dup = docs.find((d) => (d.description || '').includes('IULIA Beauty Salon consignment sold retail table'))
    if (dup) throw new Error(`Duplicate ${entity}: ${dup.name} (${dup.id})`)
  }
}

function lineTuples() {
  return LINES.map(([code, qty]) => [code, qty])
}

function resolveLines(stock, lineTuplesOnly, checkStock) {
  return lineTuplesOnly.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (checkStock && item.available < qty) {
      throw new Error(`Insufficient warehouse ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
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

function demandPositions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))
}

async function fetchReportLines(reportId) {
  const pos = await api('GET', `/entity/commissionreportin/${reportId}/positions?expand=assortment`)
  return (pos.rows || []).map((p) => ({
    code: p.assortment?.code,
    qty: Number(p.quantity),
    price: Number(p.price),
  }))
}

function verifyReportVsResolved(lineTuplesOnly, resolved, reportRows) {
  const expected = new Map(lineTuplesOnly)
  const fromReport = new Map()
  for (const r of reportRows) {
    fromReport.set(r.code, (fromReport.get(r.code) || 0) + r.qty)
  }
  for (const [code, qty] of expected) {
    if (fromReport.get(code) !== qty) {
      throw new Error(`Report qty mismatch ${code}: expected ${qty}, got ${fromReport.get(code)}`)
    }
  }
  for (const line of resolved) {
    const rep = reportRows.find((r) => r.code === line.code)
    if (!rep) throw new Error(`Report missing ${line.code}`)
    if (rep.price !== line.price) {
      throw new Error(`Price mismatch ${line.code}: stock ${money(line.price)} vs report ${money(rep.price)}`)
    }
  }
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
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
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
  const tuples = lineTuples()

  console.log('====================================================================')
  console.log('  IULIA Beauty Salon — consignment sold (retail) report + demand')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name} (${CONTRACT_ID})`)

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock, tuples, false)

  let totalMinor = 0
  let totalQty = 0
  console.log('\n  Sold lines (clinic list, VAT incl.):')
  for (const [code, qty, label] of LINES) {
    const line = resolved.find((r) => r.code === code)
    totalMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${code} ${label.slice(0, 48)} x${qty} @ ${money(line.price)} = ${money(line.price * line.qty)} AED`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} pcs | ${LINES.length} lines`)

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
    commissionPeriodStart: '2026-06-01 00:00:00',
    commissionPeriodEnd: `${uaeToday()} 23:59:59`,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'IULIA BEAUTY SALON LLC City Walk — consignment sold table (17 lines, retail sizes).',
      'All items retail SKU. Sea algae mask table label → 00140 23g.',
    ].join('\n'),
    positions: reportPositions(resolved),
  })

  const reportRows = await fetchReportLines(report.id)
  const forDemand = resolveLines(stock, tuples, true)
  verifyReportVsResolved(tuples, forDemand, reportRows)

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
      `${MARKER} — demand matching report ${report.name}`,
      'Consignment replenishment — same lines as commissioner report.',
    ].join('\n'),
    positions: demandPositions(forDemand),
  })

  console.log(`\n  Report ${report.name}: ${money(report.sum)} AED`)
  console.log(`  Demand ${demand.name}: ${money(demand.sum)} AED`)
  console.log(`  Report: https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  Demand: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  if (EXPORT_PDF) {
    const salesOut = path.join(
      ORDERS_DIR,
      `GENOSYS_IULIA_Beauty_Consignment_Sales_${report.name}.pdf`
    )
    const stockOut = path.join(
      ORDERS_DIR,
      `GENOSYS_IULIA_Beauty_Consignment_Stock_Note_${demand.name}.pdf`
    )
    const salesPdf = await exportPdf(
      'commissionreportin',
      report.id,
      CONSIGNMENT_SALES_TEMPLATE_ID,
      salesOut
    )
    const stockPdf = await exportPdf('demand', demand.id, STOCK_NOTE_TEMPLATE_ID, stockOut)
    console.log(`  Sales PDF: ${salesPdf.out} (${salesPdf.bytes} bytes)`)
    console.log(`  Stock PDF: ${stockPdf.out} (${stockPdf.bytes} bytes)`)
  }

  console.log('\n=== JSON ===')
  console.log(
    JSON.stringify(
      {
        reportName: report.name,
        reportId: report.id,
        reportSum: money(report.sum),
        demandName: demand.name,
        demandId: demand.id,
        demandSum: money(demand.sum),
        lines: tuples,
        totalQty,
      },
      null,
      2
    )
  )
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
