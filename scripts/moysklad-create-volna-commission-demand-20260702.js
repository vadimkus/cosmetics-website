#!/usr/bin/env node

/**
 * Volna Beauty Salon — June 2026 consignment sold → report + demand (contract 19).
 * Same 8 lines / 20 pcs on both documents. PDFs to ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-volna-commission-demand-20260702.js
 *   node --import dotenv/config scripts/moysklad-create-volna-commission-demand-20260702.js --commit
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
const AGENT_ID = 'aeaaf63a-2985-11f0-0a80-0dfc0049a5f1' // Volna Beauty Salon L.L.C
const CONTRACT_ID = '40556e6d-2986-11f0-0a80-03d10049fb5c' // Agreement 19

const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const MARKER = `Volna Beauty Salon consignment sold June 2026 ${uaeToday()}`

/** [code, qty, label] — sales analysis 01–30 Jun 2026 */
const LINES = [
  ['00144', 1, 'Skin Caring Blemish Balm Cushion #2 Beige'],
  ['00059', 1, 'EyeCell Eye Zone Care Kit (box)'],
  ['54458', 1, 'Moisture Replenishing Hyaluron Cream 50g'],
  ['54467', 6, 'Skin Reboot PDRN Mask Pack'],
  ['00140', 2, 'Soothing Bomb Sea Algae Mask 23g'],
  ['00195', 1, 'Moisture Replenishing Hyaluron Serum 30ml'],
  ['00063', 5, 'Intensive Repair Collagen Mask 23g'],
  ['00012', 3, 'Peptide Gel Mask 39g'],
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

async function ensureNoDuplicate() {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  for (const entity of ['commissionreportin', 'demand']) {
    const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
    const dup = docs.find((d) => (d.description || '').includes(MARKER))
    if (dup) throw new Error(`Duplicate ${entity}: ${dup.name} (${dup.id})`)
  }
}

function resolveLines(stock, checkStock) {
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (checkStock && item.available < qty) {
      throw new Error(`Insufficient warehouse ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

async function exportPdf(entity, docId, templateId, outPath) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/${entity}/metadata/customtemplate/${templateId}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/${entity}/${docId}/export`, {
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
  fs.writeFileSync(outPath, buf)
  return { out: outPath, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Volna Beauty Salon — June consignment sold report + demand')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  Period: 2026-06-01 → 2026-06-30`)

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock, false)

  let totalMinor = 0
  let totalQty = 0
  console.log('\n  Lines (same on report + demand):')
  for (const [code, qty, label] of LINES) {
    const line = resolved.find((r) => r.code === code)
    totalMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${code} ${label.slice(0, 48)} x${qty} @ ${money(line.price)} = ${money(line.price * line.qty)} AED`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} pcs | ${LINES.length} lines`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
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
      'Volna Beauty Salon L.L.C | Contract 19.',
      'Sales analysis Jun 2026 — 8 products / 20 pcs.',
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

  const forDemand = resolveLines(stock, true)
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
      `${MARKER} — demand matching report ${report.name}`,
      'Consignment replenishment — same lines as commissioner report.',
    ].join('\n'),
    positions: forDemand.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  console.log(`\n  Report ${report.name}: ${money(report.sum)} AED`)
  console.log(`  Demand ${demand.name}: ${money(demand.sum)} AED`)
  console.log(`  Report: https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  Demand: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  if (EXPORT_PDF) {
    const salesPdf = await exportPdf(
      'commissionreportin',
      report.id,
      CONSIGNMENT_SALES_TEMPLATE_ID,
      path.join(ORDERS_DIR, `GENOSYS_Volna_Consignment_Sales_${report.name}.pdf`)
    )
    const stockPdf = await exportPdf(
      'demand',
      demand.id,
      STOCK_NOTE_TEMPLATE_ID,
      path.join(ORDERS_DIR, `GENOSYS_Volna_Consignment_Stock_Note_${demand.name}.pdf`)
    )
    console.log(`  Sales PDF: ${salesPdf.out} (${salesPdf.bytes} bytes)`)
    console.log(`  Stock PDF: ${stockPdf.out} (${stockPdf.bytes} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
