#!/usr/bin/env node

/**
 * NEW YOU STAR — consignment sales report from clinic stock sheet (2026-07-31).
 * Agreement 37. Report only + Consignment Sales PDF → ~/Desktop/orders/
 *
 * Source: "Product List Genosys 2" — Stock Sold column only.
 *
 *   Problem Control Serum ×1 @ 165
 *   Eye Zone Care Kit ×1 @ 490
 *   Snow O₂ Cleanser 180ml ×1 @ 165
 *   BB Cushion #3 Camel ×2 @ 150
 *   All For Sensitive Serum ×1 @ 165
 *   Scalp & Hair Shampoo ×2 @ 170
 *   Hair Tonic ×1 @ 145
 *   Collagen Mask ×3 @ 18
 *   Sea Algae Mask ×1 @ 18
 *   Hydro Soothing Cream ×1 @ 145
 *   Ultra Shield SPF50 ×1 @ 125
 *   Total: 2,112 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-new-you-star-commission-sales-20260731.js
 *   node --import dotenv/config scripts/moysklad-create-new-you-star-commission-sales-20260731.js --commit
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
const AGENT_ID = '69e1db3e-7fa4-11f1-0a80-0283002585b0' // NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C
const CONTRACT_ID = '6a2aabf3-7fa4-11f1-0a80-0283002585c9' // Agreement 37
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `NEW-YOU-STAR-CONSIGNMENT-SALES-SHEET-${uaeToday()}`

/** [code, qty, clinicAed] — from Stock Sold column */
const LINES = [
  ['00029', 1, 165], // Problem Control Serum 30ml
  ['00059', 1, 490], // EyeCell Eye Zone Care Kit
  ['00021', 1, 165], // Snow O₂ Cleanser 180ml
  ['54464', 2, 150], // BB Cushion #3 Camel
  ['00030', 1, 165], // All For Sensitive Serum 30ml
  ['00052', 2, 170], // HR³ Matrix Scalp & Hair Shampoo 300ml
  ['00051', 1, 145], // HR³ Matrix Hair Tonic 70ml
  ['00063', 3, 18], // Intensive Repair Collagen Mask
  ['00140', 1, 18], // Soothing Bomb Sea Algae Mask
  ['00031', 1, 145], // Intensive Hydro Soothing Cream 50g
  ['54457', 1, 125], // Ultra Shield Sun Cream SPF50 50g
]
const EXPECTED_SUM_MINOR = 211200
const EXPECTED_UNITS = 15

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
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
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
      salePrice: Number(row.salePrice || 0),
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
  const out = path.join(ORDERS_DIR, `GENOSYS_NEW_YOU_STAR_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  NEW YOU STAR — consignment sales (Stock Sold sheet)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const resolved = []
  let sumMinor = 0
  let totalQty = 0
  for (const [code, qty, clinicAed] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    const price = Math.round(clinicAed * 100)
    if (item.salePrice && item.salePrice !== price) {
      console.log(
        `  note: ${code} list salePrice ${money(item.salePrice)} vs booked ${money(price)}`,
      )
    }
    sumMinor += qty * price
    totalQty += qty
    resolved.push({ ...item, qty, price })
    console.log(
      `    ${code} ${item.name.slice(0, 52)} x${qty} @ ${money(price)} = ${money(qty * price)}`,
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | ${resolved.length} lines`)

  if (totalQty !== EXPECTED_UNITS) {
    throw new Error(`Units ${totalQty} ≠ expected ${EXPECTED_UNITS}`)
  }
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
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
    commissionPeriodStart: moment,
    commissionPeriodEnd: moment,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'NEW YOU STAR | Product List Genosys 2 stock sheet — Stock Sold column.',
      'Consignment sales report only — bank transfer pending. Agreement 37.',
      `${resolved.length} lines / ${totalQty} pcs / ${money(sumMinor)} AED.`,
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
