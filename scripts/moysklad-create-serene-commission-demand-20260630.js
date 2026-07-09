#!/usr/bin/env node

/**
 * Serene Skin Beauty Salon — consignment sold items (2026-06-30).
 *
 *   Multi Functional Anti-Wrinkle Cream 50g (00190) ×2
 *   HR³ Matrix Scalp & Hair Shampoo 300ml (00052) ×1
 *   Multi Sun Cream SPF40 40g (00041) ×1
 *   Soothing Repair Post Cream 20g (00038) ×1
 *   EyeCell Eye Peptide Gel Patch box (00053) ×1
 *
 * Commissioner report + matching demand under contract 00060.
 *
 *   node --import dotenv/config scripts/moysklad-create-serene-commission-demand-20260630.js
 *   node --import dotenv/config scripts/moysklad-create-serene-commission-demand-20260630.js --commit
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
const EXPORT_PDF = !process.argv.includes('--no-pdf')

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: '993395aa-8da2-11ec-0a80-006b0038cd99', // Serene Skin Beauty Salon LLC
  contractId: 'dc5c469a-d943-11ed-0a80-05bd0013eb27', // Contract 00060
  date: uaeToday(),
}

const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const MARKER_BASE = 'Serene Skin Beauty consignment sold 2026-06-30'

/** [code, qty, label] */
const LINES = [
  ['00190', 2, 'Multi Functional Anti-Wrinkle Cream 50g'],
  ['00052', 1, 'HR³ Matrix Scalp & Hair Shampoo 300ml'],
  ['00041', 1, 'Multi Sun Cream SPF40/PA++ 40g'],
  ['00038', 1, 'Soothing Repair Post Cream 20g'],
  ['00053', 1, 'EyeCell Eye Peptide Gel Patch (box)'],
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

async function ensureNoDuplicate(entityType) {
  const filter = [
    `agent=${API}/entity/counterparty/${COMMON.agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entityType}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER_BASE))
  if (dup) {
    throw new Error(
      `Duplicate ${entityType}: ${dup.name} (${dup.id}) https://online.moysklad.ru/app/#${entityType === 'demand' ? 'demand' : 'commissionreport'}/edit?id=${dup.id}`
    )
  }
}

function resolveLines(stock, checkStock) {
  return LINES.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (checkStock && item.available < qty) {
      throw new Error(`Insufficient stock ${code} (${label}): need ${qty}, have ${item.available}`)
    }
    return { ...item, qty, label }
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

function verifyReportVsResolved(resolved, reportRows) {
  for (const line of resolved) {
    const rep = reportRows.find((r) => r.code === line.code)
    if (!rep || rep.qty !== line.qty || rep.price !== line.price) {
      throw new Error(`Report mismatch ${line.code}`)
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
  const out = path.join(ORDERS_DIR, `GENOSYS_Serene_Skin_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Serene Skin Beauty — consignment sold (report + demand)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${COMMON.agentId}`),
    api('GET', `/entity/contract/${COMMON.contractId}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const stock = await fetchStockByCode()
  const reportResolved = resolveLines(stock, false)
  const demandResolved = resolveLines(stock, true)

  console.log('\n  Lines (clinic list, VAT incl.):')
  let totalMinor = 0
  for (const line of reportResolved) {
    totalMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.label} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate('commissionreportin')
  await ensureNoDuplicate('demand')

  const reportMoment = uaeMomentNow()
  const demandMoment = uaeMomentAddMinutes(3)
  const periodEnd = `${COMMON.date} 23:59:59`

  const report = await api('POST', '/entity/commissionreportin', {
    moment: reportMoment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    state: stateHref('commissionreportin', '3203736c-c43b-11eb-0a80-093a002b59a6'),
    commissionPeriodStart: reportMoment,
    commissionPeriodEnd: periodEnd,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      `${MARKER_BASE} ${COMMON.date}`,
      'Serene Skin Beauty Salon LLC | Contract 00060 | sold items settlement.',
      '00190 multifunction cream 50g x2; 00052 shampoo 300ml x1; 00041 SPF40 x1; 00038 post cream 20g x1; 00053 eye patch x1.',
    ].join('\n'),
    positions: reportPositions(reportResolved),
  })

  const reportRows = await fetchReportLines(report.id)
  verifyReportVsResolved(reportResolved, reportRows)

  const demand = await api('POST', '/entity/demand', {
    moment: demandMoment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    store: href('store', COMMON.storeId),
    state: stateHref('demand', '50d70717-4582-11ea-0a80-05e3001273a2'),
    description: [
      `${MARKER_BASE} — demand matching report ${report.name}`,
      'Serene Skin Beauty Salon LLC | Contract 00060 | same lines as commissioner report.',
    ].join('\n'),
    positions: demandPositions(demandResolved),
  })

  console.log(`\n  Report ${report.name}: ${money(report.sum)} AED`)
  console.log(`  Demand ${demand.name}: ${money(demand.sum)} AED`)
  console.log(`  Report: https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  Demand: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  if (EXPORT_PDF) {
    try {
      const pdf = await exportCommissionSalesPdf(report.id, report.name)
      console.log(`  PDF: ${pdf.out} (${pdf.bytes} bytes)`)
    } catch (e) {
      console.log(`  PDF export skipped: ${e.message}`)
    }
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
