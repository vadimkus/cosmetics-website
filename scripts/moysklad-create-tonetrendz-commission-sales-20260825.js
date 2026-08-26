#!/usr/bin/env node

/**
 * TONETRENDZ — Aug 2026 Square sales → consignment report + matching demand.
 * Agreement 36. Clinic list (not Square retail 2,256). Both PDFs → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-commission-sales-20260825.js
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-commission-sales-20260825.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = '74aa75cb-63db-11f1-0a80-111d001bbe72' // TONETRENDZ
const CONTRACT_ID = '7a5e3023-63dc-11f1-0a80-1ba4001ce87b' // 36
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `TONETRENDZ-CONSIGNMENT-SALES-SQUARE-AUG-${uaeToday()}`

/** [code, qty, clinicAed] — Square 1–25 Aug qty; clinic list (half of Square retail) */
const LINES = [
  ['00144', 2, 150], // Cushion #2 Beige
  ['00195', 1, 165], // Moisture Replenishing Hyaluron Serum 30ml
  ['00021', 1, 165], // Snow O₂ Cleanser 180ml
  ['00194', 1, 165], // Multi Vita Radiance Serum 30ml
  ['00143', 1, 150], // Cushion #1 Ivory
  ['00122', 1, 145], // Multi-Vita Radiance Cream 50g
  ['00012', 1, 38], // Peptide Gel Mask 39g
]
const EXPECTED_SUM_MINOR = 112800
const EXPECTED_QTY = 8
const PERIOD_START = '2026-08-01 00:00:00'
const PERIOD_END = '2026-08-25 23:59:59'

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
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      salePrice: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate(entityType) {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entityType}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate ${entityType}: ${dup.name} (${dup.id})`)
}

async function exportPdf(entityType, entityId, templateId, outPath) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/${entityType}/metadata/customtemplate/${templateId}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/${entityType}/${entityId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${entityType} ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  TONETRENDZ — Square Aug consignment sales + matching demand')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)
  console.log(`  Period  : 1–25 Aug 2026 (Square)`)

  const resolved = []
  let sumMinor = 0
  let totalQty = 0
  const shortages = []
  for (const [code, qty, clinicAed] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    const price = Math.round(clinicAed * 100)
    if (item.salePrice && item.salePrice !== price) {
      console.log(`  note: ${code} list salePrice ${money(item.salePrice)} vs booked ${money(price)}`)
    }
    if (item.available < qty) shortages.push(`${code}: need ${qty}, warehouse ${item.available}`)
    sumMinor += qty * price
    totalQty += qty
    resolved.push({ ...item, qty, price })
    console.log(
      `    ${code} ${item.name.slice(0, 52)} x${qty} @ ${money(price)} = ${money(qty * price)}`,
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | ${resolved.length} lines`)
  if (shortages.length) {
    console.log('  Warehouse shortages:')
    for (const s of shortages) console.log(`    ${s}`)
  }

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (totalQty !== EXPECTED_QTY) throw new Error(`Qty ${totalQty} ≠ ${EXPECTED_QTY}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }
  if (shortages.length) throw new Error(`Insufficient warehouse stock:\n  ${shortages.join('\n  ')}`)

  await ensureNoDuplicate('commissionreportin')
  await ensureNoDuplicate('demand')

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
      'TONETRENDZ | Square sales summary 1–25 Aug 2026 | Agreement 36.',
      'Clinic list (Square retail 2,256 AED). Bank transfer pending.',
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
    throw new Error(`Report sum ${money(report.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentAddMinutes(3),
    applicable: true,
    shared: true,
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
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  if ((demand.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Demand sum ${money(demand.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

  const salesPdf = await exportPdf(
    'commissionreportin',
    report.id,
    CONSIGNMENT_SALES_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_TONETRENDZ_Consignment_Sales_${report.name}.pdf`),
  )
  const stockPdf = await exportPdf(
    'demand',
    demand.id,
    STOCK_NOTE_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_TONETRENDZ_Consignment_Stock_Note_${demand.name}.pdf`),
  )

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  Sales PDF: ${salesPdf}`)
  console.log(`  Stock PDF: ${stockPdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
