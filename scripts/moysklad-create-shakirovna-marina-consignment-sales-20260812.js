#!/usr/bin/env node

/**
 * Shakirovna Ladies Beauty Saloon (Marina) — consignment sales report + PDF.
 * Sales analysis 28.07.2026–10.08.2026 (clinic / себестоимость column):
 *
 *   00021 Snow O₂ Cleanser 180ml ×1 @ 165
 *   00041 Multi Sun Cream SPF40 ×1 @ 105
 *   00012 Peptide Gel Mask ×2 @ 38
 *   00140 Sea Algae Mask ×21 @ 18
 *   00144 BB Cushion #2 Beige ×1 @ 150
 *   00063 Collagen Mask ×9 @ 18
 *   Total: 1,036 AED / 35 pcs
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-consignment-sales-20260812.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-consignment-sales-20260812.js --commit
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
const AGENT_ID = '93775ae5-d18d-11ea-0a80-02e00008417d' // Shakirovna Ladies Beauty Saloon (Marina)
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb' // 00030
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `SHAKIROVNA-MARINA-CONS-SALES-28JUL-10AUG-${uaeToday()}`
const PERIOD_START = '2026-07-28 00:00:00'
const PERIOD_END = '2026-08-10 23:59:59'

/** [code, qty, clinicAed] — from Tamara sales analysis screenshot */
const LINES = [
  ['00021', 1, 165], // Snow O₂ Cleanser 180ml
  ['00041', 1, 105], // Multi Sun Cream SPF40
  ['00012', 2, 38], // Peptide Gel Mask
  ['00140', 21, 18], // Sea Algae Mask
  ['00144', 1, 150], // Beige cushion
  ['00063', 9, 18], // Collagen Mask
]
const EXPECTED_SUM_MINOR = 103600 // 1036.00
const EXPECTED_QTY = 35

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
  const out = path.join(
    ORDERS_DIR,
    `GENOSYS_Shakirovna_Marina_Consignment_Sales_${reportName}.pdf`,
  )
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Marina — consignment sales 28 Jul–10 Aug')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
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
    const priceMinor = Math.round(unitAed * 100)
    const lineMinor = priceMinor * qty
    sumMinor += lineMinor
    totalQty += qty
    resolved.push({ ...item, qty, priceMinor })
    console.log(
      `    ${code} ${item.name.slice(0, 52)} x${qty} @ ${unitAed} = ${money(lineMinor)}`,
    )
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

  const moment = uaeMomentNow()
  const report = await api('POST', '/entity/commissionreportin', {
    moment,
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
      'Shakirovna Ladies Beauty Saloon | Marina Wharf | Agreement 00030.',
      'Consignment sold 28.07.2026–10.08.2026 (Tamara sales analysis). Clinic prices.',
      'Report only — no replenishment. Not paid yet.',
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
