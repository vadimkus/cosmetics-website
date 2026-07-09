#!/usr/bin/env node

/**
 * Salon 971 — consignment stock recon → commissioner report + matching demand.
 * Opening demand 06288 (2026-06-05) minus remaining stock photo (2026-06-29).
 *
 *   node --import dotenv/config scripts/moysklad-create-salon971-commission-demand-20260629.js
 *   node --import dotenv/config scripts/moysklad-create-salon971-commission-demand-20260629.js --commit
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
const AGENT_ID = '17ca1490-600b-11f1-0a80-1a43001bf0bb' // Salon 971
const CONTRACT_ID = '181e0ecd-600b-11f1-0a80-0e51001bcaf9' // agreement 35
const OPENING_DEMAND_ID = '18eecf86-600b-11f1-0a80-1b9d001c4bc4' // 06288

const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'

const MARKER_BASE = 'Salon 971 consignment sold recon opening 06288 minus photo 2026-06-29'

const COMMISSION_PERIOD = {
  start: '2026-06-05 00:00:00',
  end: '2026-06-29 23:59:59',
}

/** Opening stock on demand 06288 */
const OPENING = new Map([
  ['00144', 3], // Cushion #2 Beige
  ['54464', 3], // Cushion #3 Camel
  ['00053', 3], // EyeCell patch box
  ['54467', 2], // PDRN mask pack
  ['00021', 2], // Snow O₂ Cleanser
])

/** Remaining on shelf per Salon 971 photo 2026-06-29 */
const REMAINING = new Map([
  ['00144', 2],
  ['54464', 2],
  ['00053', 1],
  ['00021', 2],
  ['54467', 0],
])

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

function computeSoldLines() {
  const lines = []
  for (const [code, openingQty] of OPENING) {
    if (!REMAINING.has(code)) {
      throw new Error(`Remaining count missing for ${code}`)
    }
    const remainingQty = REMAINING.get(code)
    if (remainingQty > openingQty) {
      throw new Error(`Remaining ${code} (${remainingQty}) exceeds opening (${openingQty})`)
    }
    const soldQty = openingQty - remainingQty
    if (soldQty > 0) lines.push([code, soldQty])
  }
  for (const code of REMAINING.keys()) {
    if (!OPENING.has(code)) throw new Error(`Unexpected remaining SKU not in opening: ${code}`)
  }
  return lines
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

async function verifyOpeningDemand() {
  const pos = await api('GET', `/entity/demand/${OPENING_DEMAND_ID}/positions?expand=assortment`)
  const onDoc = new Map()
  for (const p of pos.rows || []) {
    const code = p.assortment?.code
    if (!code) continue
    onDoc.set(code, (onDoc.get(code) || 0) + Number(p.quantity))
  }
  for (const [code, qty] of OPENING) {
    if (onDoc.get(code) !== qty) {
      throw new Error(`Opening demand mismatch ${code}: script ${qty} vs 06288 ${onDoc.get(code)}`)
    }
  }
}

async function ensureNoDuplicate(marker) {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  for (const entity of ['commissionreportin', 'demand']) {
    const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
    const dup = docs.find((d) => (d.description || '').includes(marker))
    if (dup) throw new Error(`Duplicate ${entity}: ${dup.name} (${dup.id})`)
  }
}

function resolveLines(stock, lineTuples, checkStock) {
  return lineTuples.map(([code, qty]) => {
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

function verifyReportVsResolved(lineTuples, resolved, reportRows) {
  const expected = new Map(lineTuples)
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
  const out = path.join(ORDERS_DIR, `GENOSYS_Salon971_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function main() {
  const soldLineTuples = computeSoldLines()
  const marker = `${MARKER_BASE} ${uaeToday()}`

  console.log('====================================================================')
  console.log('  Salon 971 — consignment sold (opening − remaining photo)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Period: ${COMMISSION_PERIOD.start} → ${COMMISSION_PERIOD.end}`)
  console.log(`  Opening demand: 06288 (${OPENING_DEMAND_ID})`)
  console.log(`  Agreement: 35 (${CONTRACT_ID})\n`)

  await verifyOpeningDemand()

  console.log('  Recon:')
  console.log('  Code   | Opening | Remaining | SOLD')
  console.log('  -------+---------+-----------+-----')
  for (const [code] of OPENING) {
    const o = OPENING.get(code)
    const r = REMAINING.get(code)
    console.log(`  ${code} | ${String(o).padStart(7)} | ${String(r).padStart(9)} | ${o - r}`)
  }

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock, soldLineTuples, false)
  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Sold lines (clinic list / salePrice):')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 52)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)} AED`
    )
  }
  console.log(`  Total sold: ${money(sumMinor)} AED | ${totalQty} pcs | ${resolved.length} lines`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate(MARKER_BASE)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const contract = await api('GET', `/entity/contract/${CONTRACT_ID}`)

  const report = await api('POST', '/entity/commissionreportin', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: COMMISSION_PERIOD.start,
    commissionPeriodEnd: COMMISSION_PERIOD.end,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      marker,
      'Sold = opening demand 06288 minus remaining stock photo 2026-06-29.',
      'Remaining photo: Snow O2 x2, patch x1, Camel x2, Beige x2, PDRN x0.',
      `Customer: ${agent.name} | Agreement ${contract.name}.`,
    ].join('\n'),
    positions: reportPositions(resolved),
  })

  const reportRows = await fetchReportLines(report.id)
  const forDemand = resolveLines(stock, soldLineTuples, true)
  verifyReportVsResolved(soldLineTuples, forDemand, reportRows)

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
      `${marker} — demand matching report ${report.name}`,
      'Consignment settlement — same lines as commissioner report.',
    ].join('\n'),
    positions: demandPositions(forDemand),
  })

  console.log(`\n  Report ${report.name}: ${money(report.sum)} AED`)
  console.log(`  Demand ${demand.name}: ${money(demand.sum)} AED`)
  console.log(`  Report: https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  Demand: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  if (EXPORT_PDF) {
    const pdf = await exportCommissionSalesPdf(report.id, report.name)
    console.log(`  PDF: ${pdf.out} (${pdf.bytes} bytes)`)
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
        soldLines: soldLineTuples,
        remaining: Object.fromEntries(REMAINING),
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
