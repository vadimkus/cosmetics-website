#!/usr/bin/env node

/**
 * ARFI Nails Jumeirah — commissioner report + consignment demand (agreement 30).
 * June 2026 sold list (11 pcs / 9 lines) from clinic table 2026-07-03.
 *
 *   node --import dotenv/config scripts/moysklad-create-arfi-jumeirah-commission-demand-20260703.js
 *   node --import dotenv/config scripts/moysklad-create-arfi-jumeirah-commission-demand-20260703.js --commit
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
const AGENT_ID = 'dc883e47-f051-11f0-0a80-0f7100059e21' // ARFI NAILS BEAUTY SALON 2
const CONTRACT_ID = '383ebfbb-f052-11f0-0a80-0035000650e3' // Agreement 30
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `ARFI Nails Jumeirah consignment sales June 2026 ${uaeToday()}`

/** [code, qty, label] */
const LINES = [
  ['00029', 1, 'Problem Control Serum 30ml'],
  ['00035', 1, 'Intensive Problem Control Cream 50g'],
  ['00145', 1, 'Problem Control Toner 200ml'],
  ['00021', 1, 'Snow O₂ Cleanser 180ml'],
  ['00053', 1, 'EyeCell Eye Peptide Gel Patch (box)'],
  ['54458', 1, 'Moisture Replenishing Hyaluron Cream 50g'],
  ['00144', 2, 'Skin Caring Blemish Balm Cushion #2 Beige'],
  ['54467', 1, 'Skin Reboot PDRN Mask Pack 350g'],
  ['00140', 2, 'Soothing Bomb Sea Algae Mask 23g'],
]

const EXPECTED_UNITS = 11

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
  const dup = docs.find((d) => (d.description || '').includes('ARFI Nails Jumeirah consignment sales June 2026'))
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
  console.log('  ARFI Nails Jumeirah — report + demand (agreement 30, June 2026)')
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
      'ARFI NAILS BEAUTY SALON 2 (Jumeirah) | Agreement 30 | June 2026 sold (11 pcs).',
      'Eye patch = 00053 box. Sea algae mask = 00140 23g.',
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
      `GENOSYS_ARFI_Nails_Jumeirah_Consignment_Sales_${report.name}.pdf`
    )
    const stockOut = path.join(
      ORDERS_DIR,
      `GENOSYS_ARFI_Nails_Jumeirah_Consignment_Stock_Note_${demand.name}.pdf`
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
