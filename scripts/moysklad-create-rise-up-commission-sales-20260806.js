#!/usr/bin/env node

/**
 * Rise UP — consignment sold recon (agreement 34).
 * Book stock − shelf (WhatsApp остатки 2026-08-06 + mask photo) → sold.
 *
 * Assumptions (same as Jul method):
 *   - Items not listed on shelf sheet = remaining 0
 *   - Mask photo: peptide 1, sea algae 1, collagen 1, PDRN 2 (PDRN not on book → ignored)
 *   - "Hyaluron serum -2" listed twice → once (qty 2)
 *
 *   node --import dotenv/config scripts/moysklad-create-rise-up-commission-sales-20260806.js
 *   node --import dotenv/config scripts/moysklad-create-rise-up-commission-sales-20260806.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'b83e0d80-5d8f-11f1-0a80-065d0075240c' // Rise UP
const CONTRACT_ID = 'c91330fa-5d90-11f1-0a80-1af00073b7c8' // Agreement 34
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `Rise UP consignment sold book-minus-shelf ${uaeToday()}`

/** Sold = book − shelf (positive only) */
const LINES = [
  ['00021', 2, 'Snow O₂ Cleanser 180ml'],
  ['00030', 1, 'All For Sensitive Serum 30ml'],
  ['00038', 2, 'Soothing Repair Post Cream 20g'],
  ['00040', 1, 'Intensive Blemish Balm Cream 50g'],
  ['00052', 1, 'HR³ Scalp & Hair Shampoo 300ml'],
  ['00053', 3, 'Eye Peptide Gel Patch (box)'],
  ['00063', 8, 'Intensive Repair Collagen Mask'],
  ['00140', 8, 'Soothing Bomb Sea Algae Mask'],
  ['00143', 1, 'Cushion #1 Ivory'],
  ['00144', 1, 'Cushion #2 Beige'],
  ['00188', 1, 'Microbiome Mist 80ml'],
  ['54457', 1, 'Ultra Shield SPF50'],
  ['54464', 1, 'Cushion #3 Camel'],
]

const EXPECTED_UNITS = 31
const EXPECTED_SUM_MINOR = 250700 // 2,507.00 AED

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

function resolveLines(stock, checkStock) {
  return LINES.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code} (${label})`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (checkStock && item.available < qty) {
      throw new Error(`Insufficient warehouse stock ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty, label }
  })
}

async function ensureNoDuplicate(entityType) {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entityType}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate ${entityType}: ${dup.name} (${dup.id})`)
}

function positions(resolved, extra = {}) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    ...extra,
  }))
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
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`PDF export ${res.status}: ${t.slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('PDF export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
  return { out: outPath, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Rise UP — report + matching demand (agreement 34, shelf recon)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log('  Period: 2026-07-02 → 2026-08-06')
  console.log('  Method: book − shelf (unlisted = 0; mask photo for 00012/00140/00063)')

  const stock = await fetchStockByCode()
  const reportResolved = resolveLines(stock, false)
  const demandResolved = resolveLines(stock, true)

  let totalMinor = 0
  let totalQty = 0
  console.log('\n  Sold lines:')
  for (const line of reportResolved) {
    totalMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.label.slice(0, 48)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`,
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} pcs`)

  if (totalQty !== EXPECTED_UNITS) throw new Error(`Unit count ${totalQty} ≠ ${EXPECTED_UNITS}`)
  if (totalMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(totalMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate('commissionreportin')
  await ensureNoDuplicate('demand')

  const report = await api('POST', '/entity/commissionreportin', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: '2026-07-02 00:00:00',
    commissionPeriodEnd: '2026-08-06 23:59:59',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Rise UP | Agreement 34 | shelf recon WhatsApp + mask photo 2026-08-06.',
      'Sold = book − shelf. Unlisted SKUs (cushions, patches) = remaining 0.',
      'Mask photo: peptide1 sea algae1 collagen1; PDRN×2 on photo not on book — ignored.',
      '31 pcs / 2507 AED.',
    ].join('\n'),
    positions: positions(reportResolved, { reward: 0 }),
  })

  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentAddMinutes(3),
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
    positions: positions(demandResolved),
  })

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  if (EXPORT_PDF) {
    const salesOut = path.join(ORDERS_DIR, `GENOSYS_Rise_UP_Consignment_Sales_${report.name}.pdf`)
    const stockOut = path.join(ORDERS_DIR, `GENOSYS_Rise_UP_Consignment_Stock_Note_${demand.name}.pdf`)
    const salesPdf = await exportPdf(
      'commissionreportin',
      report.id,
      CONSIGNMENT_SALES_TEMPLATE_ID,
      salesOut,
    )
    const stockPdf = await exportPdf('demand', demand.id, STOCK_NOTE_TEMPLATE_ID, stockOut)
    if (salesPdf) console.log(`  Sales PDF: ${salesPdf.out}`)
    if (stockPdf) console.log(`  Stock PDF: ${stockPdf.out}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
