#!/usr/bin/env node

/**
 * Love My Body — commissioner report + consignment demand (agreement 27).
 * Same lines on report and demand (replenishment = sold qty).
 *
 *   node --import dotenv/config scripts/moysklad-create-love-my-body-commission-demand-20260704.js
 *   node --import dotenv/config scripts/moysklad-create-love-my-body-commission-demand-20260704.js --commit
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
const AGENT_ID = '9c78fe86-be3b-11f0-0a80-007f0036b570' // LOVE MY BODY LADIES SPA CLUB L.L.C
const CONTRACT_ID = 'aaee7975-be3b-11f0-0a80-173e00383194' // Agreement 27
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `Love My Body consignment sales June 2026 ${uaeToday()}`
const EXPECTED_UNITS = 27

/** [code, qty, label] */
const LINES = [
  ['54457', 1, 'Ultra Shield Sun Cream SPF50 50g'],
  ['00144', 1, 'Skin Caring Blemish Balm Cushion #2 Beige'],
  ['00140', 3, 'Soothing Bomb Sea Algae Mask 23g'],
  ['00063', 2, 'Intensive Repair Collagen Mask 23g'],
  ['00012', 10, 'Peptide Gel Mask 39g'],
  ['54458', 2, 'Moisture Replenishing Hyaluron Cream 50g'],
  ['00195', 2, 'Moisture Replenishing Hyaluron Serum 30ml'],
  ['00189', 1, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00188', 1, 'Microbiome Mist 80ml'],
  ['00037', 1, 'Skin Barrier Protecting Cream 100g'],
  ['00059', 1, 'EyeCell Eye Zone Care Kit (box)'],
  ['54461', 1, 'Skin Defender Lip & Eye Makeup Remover 200ml'],
  ['00054', 1, 'EyeCell Eye Contour Serum 10ml'],
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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
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
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
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
  console.log('  Love My Body — report + demand (agreement 27, same lines)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log('  Period: 2026-06-01 → 2026-06-30')

  const stock = await fetchStockByCode()
  const reportResolved = resolveLines(stock, false)
  const demandResolved = resolveLines(stock, true)

  let totalMinor = 0
  let totalQty = 0
  console.log('\n  Lines (report = demand):')
  for (const line of reportResolved) {
    totalMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.label.slice(0, 48)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} pcs | ${LINES.length} lines`)

  if (totalQty !== EXPECTED_UNITS) {
    throw new Error(`Unit count ${totalQty} ≠ expected ${EXPECTED_UNITS}`)
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
    commissionPeriodStart: '2026-06-01 00:00:00',
    commissionPeriodEnd: '2026-06-30 23:59:59',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'LOVE MY BODY LADIES SPA CLUB L.L.C | Agreement 27 | June 2026 sold (27 pcs).',
      'Peptide mask = 00012 sheets; sea algae / collagen = 23g masks.',
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
    const salesOut = path.join(
      ORDERS_DIR,
      `GENOSYS_Love_My_Body_Consignment_Sales_${report.name}.pdf`
    )
    const stockOut = path.join(
      ORDERS_DIR,
      `GENOSYS_Love_My_Body_Consignment_Stock_Note_${demand.name}.pdf`
    )
    const salesPdf = await exportPdf(
      'commissionreportin',
      report.id,
      CONSIGNMENT_SALES_TEMPLATE_ID,
      salesOut
    )
    const stockPdf = await exportPdf('demand', demand.id, STOCK_NOTE_TEMPLATE_ID, stockOut)
    if (salesPdf) console.log(`  Sales PDF: ${salesPdf.out} (${salesPdf.bytes} bytes)`)
    if (stockPdf) console.log(`  Stock PDF: ${stockPdf.out} (${stockPdf.bytes} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
