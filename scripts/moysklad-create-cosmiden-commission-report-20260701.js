#!/usr/bin/env node

/**
 * Cosmiden / Myline / Mylene — consignment sales report only (agreement 15).
 *
 * Per stock sheet 30.06.2026 (SOLD QTY column):
 *   00190 Multi Functional Anti-Wrinkle Cream 50g ×1
 *   00035 Intensive Problem Control Cream 50g ×1
 *   00144 Cushion #2 Beige ×1
 *   54464 Cushion #3 Camel ×1  (NOT 00145 toner)
 *   00063 Intensive Repair Collagen Mask 23g ×13  (sheet: 16g)
 *   00140 Soothing Bomb Sea Algae Mask 23g ×16  (sheet: 16g)
 *   54457 Ultra Shield Sun Cream SPF50 ×1
 *   00038 Soothing Repair Post Cream 20g ×1
 *
 *   node --import dotenv/config scripts/moysklad-create-cosmiden-commission-report-20260701.js
 *   node --import dotenv/config scripts/moysklad-create-cosmiden-commission-report-20260701.js --commit
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
const AGENT_ID = 'd7b0a67f-d5a2-11ef-0a80-16cd0019b6b8' // COSMIDEN MEDICAL CENTER L.L.C (Myline / Mylene)
const CONTRACT_ID = '69b01872-d7dd-11ef-0a80-0725003ffada' // Agreement 15
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'

const MARKER = `Cosmiden Myline consignment sales sheet 30062026 ${uaeToday()}`

/** [code, qty] */
const LINES = [
  ['00190', 1], // Multi Functional Anti-Wrinkle Cream 50g
  ['00035', 1], // Intensive Problem Control Cream 50g
  ['00144', 1], // Cushion #2 Beige
  ['54464', 1], // Cushion #3 Camel
  ['00063', 13], // Collagen mask 23g (sheet label 16g)
  ['00140', 16], // Sea algae mask 23g (sheet label 16g)
  ['54457', 1], // Ultra Shield SPF50
  ['00038', 1], // Soothing Repair Post Cream 20g
]

const EXPECTED_TOTAL_AED = 1339
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
  const dup = reports.find((r) => (r.description || '').includes('Myline consignment sales sheet 30062026'))
  if (dup) throw new Error(`Duplicate: ${dup.name} (${dup.id})`)
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
  const out = path.join(ORDERS_DIR, `GENOSYS_Cosmiden_Myline_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Cosmiden / Myline — consignment sales report (agreement 15)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  Period   : stock sheet as of 30.06.2026`)

  const stock = await fetchStockByCode()
  const resolved = LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    return { ...item, qty }
  })

  let totalMinor = 0
  let totalQty = 0
  console.log('\n  Sold lines (clinic list, VAT incl.):')
  for (const line of resolved) {
    totalMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 52)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} pcs | ${resolved.length} lines`)

  if (Math.abs(totalMinor - EXPECTED_TOTAL_AED * 100) > 2) {
    throw new Error(`Total mismatch: ${money(totalMinor)} vs ${EXPECTED_TOTAL_AED}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    console.log('\n  Note: partial report 01376 (Jun 8) had masks 14+12 only — review overlap if needed.')
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
    commissionPeriodEnd: '2026-06-30 23:59:59',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'COSMIDEN / Myline / Mylene — Agreement 15.',
      'Report only — no demand.',
      'Stock sheet 30.06.2026 SOLD QTY column (8 lines, 35 pcs).',
      'Camel cushion → 54464 (not 00145 toner). Masks sheet 16g → MoySklad 23g (00063, 00140).',
      'Prior partial report 01376 (Jun 8: masks 14+12) may overlap — delete 01376 if this sheet supersedes it.',
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
