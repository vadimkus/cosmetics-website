#!/usr/bin/env node

/**
 * MEDYUMED — first commissioner report + matching demand.
 * Agreement 39. Clinic list (same units as opening 06658). Unpaid.
 *
 *   node --import dotenv/config scripts/moysklad-create-medumed-consignment-sales-20260902.js
 *   node --import dotenv/config scripts/moysklad-create-medumed-consignment-sales-20260902.js --commit
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
const AGENT_ID = 'abb20ade-94aa-11f1-0a80-1e9800852741'
const CONTRACT_ID = 'f5d336e2-94bf-11f1-0a80-09e2008c6f98'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `MEDUMED-CONS-SALES-${uaeToday()}`

/** [code, qty, clinicAed, label] */
const LINES = [
  ['00037', 2, 225, 'Skin Barrier Protecting Cream 100g'],
  ['00195', 4, 165, 'Moisture Replenishing Hyaluron Serum 30ml'],
  ['00052', 1, 170, 'HR³ Matrix Scalp & Hair Shampoo 300ml'],
  ['54458', 1, 145, 'Moisture Replenishing Hyaluron Cream 50g'],
  ['00194', 3, 165, 'Multi Vita Radiance Serum 30ml'],
  ['54464', 1, 150, 'Skin Caring Blemish Balm Cushion #3 Camel'],
  ['00144', 3, 150, 'Skin Caring Blemish Balm Cushion #2 Beige'],
  ['00143', 2, 150, 'Skin Caring Blemish Balm Cushion #1 Ivory'],
  ['00190', 2, 145, 'Multi Functional Anti-Wrinkle Cream 50g'],
  ['54484', 5, 190, 'CERABARRIER Biome Gel Cleanser 200ml'],
  ['00140', 6, 18, 'Soothing Bomb Sea Algae Mask 25g'],
  ['00063', 8, 18, 'Intensive Repair Collagen Mask 23g'],
  ['00030', 2, 165, 'All For Sensitive Serum 30ml'],
  ['00031', 2, 145, 'Intensive Hydro Soothing Cream 50g'],
  ['00022', 2, 130, 'Snow Booster Toner 200ml'],
  ['54457', 1, 125, 'Ultra Shield Sun Cream SPF50 50g'],
  ['00189', 1, 170, 'Skin Rescue Overnight Cream Mask 100g'],
]
const EXPECTED_QTY = 46
const EXPECTED_SUM_MINOR = 548700

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
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
    const data = await api('GET', `${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
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

function positionsFrom(lines, extra = {}) {
  return lines.map((l) => ({
    quantity: l.qty,
    price: l.price,
    assortment: href('product', l.id),
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
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, Buffer.from(await pdfRes.arrayBuffer()))
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  MEDYUMED — first consignment sales + matching demand')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  if (contract.name !== '39') throw new Error(`Expected agreement 39, got ${contract.name}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log('  Period: 2026-08-10 → 2026-09-02')

  const existingReports = await fetchAll(
    `/entity/commissionreportin?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)}`,
  )
  const dupReport = existingReports.find(
    (r) => (r.description || '').includes(MARKER) || (r.description || '').includes('MEDUMED-CONS-SALES'),
  )
  if (dupReport) throw new Error(`Report already exists: ${dupReport.name} (${dupReport.id})`)

  const existingDemands = await fetchAll(
    `/entity/demand?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)};contract=${encodeURIComponent(`${API}/entity/contract/${CONTRACT_ID}`)}`,
  )
  const dupDemand = existingDemands.find((d) => (d.description || '').includes(MARKER))
  if (dupDemand) throw new Error(`Matching demand already exists: ${dupDemand.name} (${dupDemand.id})`)

  const resolved = []
  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Lines (report = demand):')
  for (const [code, qty, unitAed, label] of LINES) {
    const data = await api(
      'GET',
      `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`,
    )
    const item = (data.rows || []).find((r) => r.code === code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    const avail = Number(item.stock || 0) - Number(item.reserve || 0)
    if (avail < qty) throw new Error(`Insufficient stock ${code}: need ${qty}, have ${avail}`)
    const price = Math.round(unitAed * 100)
    const lineMinor = price * qty
    sumMinor += lineMinor
    totalQty += qty
    resolved.push({ code, qty, price, label, id: item.id, name: item.name })
    console.log(`    ${code} ${label} x${qty} @ ${money(price)} = ${money(lineMinor)}  stock=${avail}`)
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} pcs | ${LINES.length} lines`)
  if (totalQty !== EXPECTED_QTY) throw new Error(`Qty ${totalQty} ≠ ${EXPECTED_QTY}`)
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const report = await api('POST', '/entity/commissionreportin', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: '2026-08-10 00:00:00',
    commissionPeriodEnd: `${uaeToday()} 23:59:59`,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'MEDYUMED MEDICAL CLINIC L.L.C | Agreement 39 | first consignment sales (46 pcs).',
      'Clinic list same as opening 06658. Matching demand 1:1.',
    ].join('\n'),
    positions: positionsFrom(resolved, { reward: 0 }),
  })

  if (report.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

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
      `Replenishment paired with first sales report — same ${LINES.length} SKU / ${EXPECTED_QTY} pcs / ${money(EXPECTED_SUM_MINOR)} AED.`,
      'Agreement 39. No SO / invoice / payment.',
    ].join('\n'),
    positions: positionsFrom(resolved),
  })

  if (demand.customerOrder) throw new Error('Demand has customerOrder — expected agreement-only')
  if (demand.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Demand sum ${money(demand.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

  const salesPdf = await exportPdf(
    'commissionreportin',
    report.id,
    CONSIGNMENT_SALES_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_MedUmed_Consignment_Sales_${report.name}.pdf`),
  )
  const stockPdf = await exportPdf(
    'demand',
    demand.id,
    STOCK_NOTE_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_MedUmed_Consignment_Stock_Note_${demand.name}.pdf`),
  )

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED | Not paid`)
  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  Sales PDF: ${salesPdf}`)
  console.log(`  Stock PDF: ${stockPdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
