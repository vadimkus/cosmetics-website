#!/usr/bin/env node

/**
 * Abeer Mekki — consignment sales report July 2026 (WhatsApp sheet).
 * Agreement 31. Report only + Consignment Sales PDF → ~/Desktop/orders/
 *
 * Clinic list × 0.9 (−10% Al Ain representative discount) on every line.
 * Expected: 41 units | list 6,730 → net 6,057 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-abeer-mekki-commission-sales-20260731.js
 *   node --import dotenv/config scripts/moysklad-create-abeer-mekki-commission-sales-20260731.js --commit
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
const AGENT_ID = '39a7af2b-f5d0-11f0-0a80-108500063cb5' // ABEER MEKKI BEAUTY LADIES CENTER
const CONTRACT_ID = 'a5ab62b9-f5d1-11f0-0a80-1085000693a6' // Contract 31
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'

const DISCOUNT_MULT = 0.9
const DISCOUNT_LABEL = '10% Al Ain representative discount (clinic list × 0.9 on each line)'
const MARKER = `ABEER-MEKKI-CONSIGNMENT-SALES-JULY-2026-${uaeToday()}`
const EXPECTED_SUM_MINOR = 605700 // 6,057.00
const EXPECTED_UNITS = 41

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

/** [code, qty, label] */
const LINES = [
  ['00021', 7, 'Snow O₂ Cleanser 180ml'],
  ['00022', 3, 'Snow Booster Toner 200ml'],
  ['00041', 4, 'Multi Sun Cream SPF40/PA++ 40g'],
  ['54457', 1, 'Ultra Shield Sun Cream SPF50 50g'],
  ['00129', 1, 'EPI Turnover Boosting Peeling Gel 100g'],
  ['00189', 2, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00030', 4, 'All For Sensitive Serum 30ml'],
  ['00037', 7, 'Skin Barrier Protecting Cream 100g'],
  ['00194', 2, 'Multi Vita Radiance Serum 30ml'],
  ['00122', 2, 'Multi-Vita Radiance Cream 50g'],
  ['00191', 2, 'Multi Functional Anti-Wrinkle Serum 30ml'],
  ['00190', 2, 'Multi Functional Anti-Wrinkle Cream 50g'],
  ['00055', 1, 'EyeCell Eye Contour Cream 20ml'],
  ['00054', 1, 'EyeCell Eye Contour Serum 10ml'],
  ['00195', 2, 'Moisture Replenishing Hyaluron Serum 30ml'],
]

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
      listPrice: Number(row.salePrice || 0),
    })
  }
  return stock
}

function resolveLines(stock) {
  return LINES.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.listPrice) throw new Error(`No salePrice for ${code}`)
    const price = Math.round(item.listPrice * DISCOUNT_MULT)
    return { ...item, qty, label, price, listPrice: item.listPrice }
  })
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
  const out = path.join(ORDERS_DIR, `GENOSYS_ABEER_MEKKI_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Abeer Mekki — July 2026 consignment sales (−10%)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Discount: ${DISCOUNT_LABEL}`)

  const [agent, contract, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const resolved = resolveLines(stock)
  let sumMinor = 0
  let listMinor = 0
  let totalQty = 0
  console.log('\n  Sold lines:')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    listMinor += line.listPrice * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.label} x${line.qty} | list ${money(line.listPrice)} → ${money(line.price)} (−10%) = ${money(line.price * line.qty)}`,
    )
  }
  console.log(`  List: ${money(listMinor)} | Net (−10%): ${money(sumMinor)} | ${totalQty} units`)

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
      'GENOSYS Sales Report — July 2026 (WhatsApp Abeer Genosys Mekki).',
      DISCOUNT_LABEL,
      `List ${money(listMinor)} → net ${money(sumMinor)} AED | ${resolved.length} lines / ${totalQty} pcs.`,
      'Consignment sales report only — bank transfer pending. Agreement 31.',
      'Buyer: ABEER MEKKI BEAUTY LADIES CENTER - L.L.C - S.P.C | +971556717564 | Al Ain.',
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
