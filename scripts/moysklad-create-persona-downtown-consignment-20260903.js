#!/usr/bin/env node

/**
 * Persona Downtown — Aug/Sep consignment sales + demand into agreement 00077.
 * Report = sold WhatsApp list. Demand = patches ×5 only. EGF skipped.
 *
 *   node --import dotenv/config scripts/moysklad-create-persona-downtown-consignment-20260903.js
 *   node --import dotenv/config scripts/moysklad-create-persona-downtown-consignment-20260903.js --commit
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
const AGENT_ID = '19f661fb-b43b-11ee-0a80-0d3b00075ace'
const CONTRACT_ID = '2092d415-b43b-11ee-0a80-095a000715c8'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `PERSONA-DT-CONS-${uaeToday()}`

/** [code, qty, clinicAed, label] */
const SALES_LINES = [
  ['00012', 4, 38, 'Peptide Gel Mask 39g'],
  ['00140', 1, 18, 'Soothing Bomb Sea Algae Mask'],
  ['00144', 1, 150, 'Skin Caring Blemish Balm Cushion #2 Beige'],
  ['00051', 1, 145, 'HR³ Matrix Hair Tonic 70ml'],
  ['54467', 1, 200, 'Skin Reboot PDRN Mask Pack'],
  ['00063', 1, 18, 'Intensive Repair Collagen Mask'],
  ['00053', 1, 190, 'EyeCell Eye Peptide Gel Patch (box)'],
]
const SALES_QTY = 10
const SALES_SUM_MINOR = 87300

/** Demand = patches ×5 only. EGF 00042 skipped (discontinued). */
const DEMAND_LINES = [['00053', 5, 190, 'EyeCell Eye Peptide Gel Patch (box)']]
const DEMAND_QTY = 5
const DEMAND_SUM_MINOR = 95000

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

async function resolveLines(lines, { checkStock, title }) {
  const resolved = []
  let sumMinor = 0
  let totalQty = 0
  console.log(`\n  ${title}:`)
  for (const [code, qty, unitAed, label] of lines) {
    const data = await api(
      'GET',
      `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`,
    )
    const item = (data.rows || []).find((r) => r.code === code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    const avail = Number(item.stock || 0) - Number(item.reserve || 0)
    if (checkStock && avail < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${avail}`)
    }
    const price = Math.round(unitAed * 100)
    const lineMinor = price * qty
    sumMinor += lineMinor
    totalQty += qty
    resolved.push({ code, qty, price, label, id: item.id, name: item.name })
    console.log(`    ${code} ${label} x${qty} @ ${money(price)} = ${money(lineMinor)}  stock=${avail}`)
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} pcs | ${lines.length} lines`)
  return { resolved, sumMinor, totalQty }
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
  console.log('  Persona Downtown — consignment sales + demand into 00077')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('  Demand: patches x5 only. EGF 00042 skipped (discontinued).')

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  if (contract.name !== '00077') throw new Error(`Expected agreement 00077, got ${contract.name}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log('  Period: 2026-08-01 → 2026-09-03')

  const existingReports = await fetchAll(
    `/entity/commissionreportin?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)}`,
  )
  const dupReport = existingReports.find((r) => (r.description || '').includes(MARKER))
  if (dupReport) throw new Error(`Report already exists: ${dupReport.name} (${dupReport.id})`)

  const existingDemands = await fetchAll(
    `/entity/demand?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)};contract=${encodeURIComponent(`${API}/entity/contract/${CONTRACT_ID}`)}`,
  )
  const dupDemand = existingDemands.find((d) => (d.description || '').includes(MARKER))
  if (dupDemand) throw new Error(`Demand already exists: ${dupDemand.name} (${dupDemand.id})`)

  const sales = await resolveLines(SALES_LINES, { checkStock: false, title: 'Sales report' })
  if (sales.totalQty !== SALES_QTY) throw new Error(`Sales qty ${sales.totalQty} ≠ ${SALES_QTY}`)
  if (sales.sumMinor !== SALES_SUM_MINOR) {
    throw new Error(`Sales sum ${money(sales.sumMinor)} ≠ ${money(SALES_SUM_MINOR)}`)
  }

  const demandLines = await resolveLines(DEMAND_LINES, { checkStock: true, title: 'Demand (skip EGF)' })
  if (demandLines.totalQty !== DEMAND_QTY) {
    throw new Error(`Demand qty ${demandLines.totalQty} ≠ ${DEMAND_QTY}`)
  }
  if (demandLines.sumMinor !== DEMAND_SUM_MINOR) {
    throw new Error(`Demand sum ${money(demandLines.sumMinor)} ≠ ${money(DEMAND_SUM_MINOR)}`)
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
    commissionPeriodStart: '2026-08-01 00:00:00',
    commissionPeriodEnd: `${uaeToday()} 23:59:59`,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Persona Downtown | Agreement 00077 | sold 10 pcs / 873 AED.',
      'WhatsApp 3 Sep. Clinic list. Unpaid.',
    ].join('\n'),
    positions: positionsFrom(sales.resolved, { reward: 0 }),
  })

  if (report.sum !== SALES_SUM_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ ${money(SALES_SUM_MINOR)}`)
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
      `${MARKER} — demand with report ${report.name}`,
      'Demand: EyeCell patches x5 only. EGF 00042 skipped (discontinued).',
      'Agreement 00077. No SO / invoice / payment.',
    ].join('\n'),
    positions: positionsFrom(demandLines.resolved),
  })

  if (demand.customerOrder) throw new Error('Demand has customerOrder — expected agreement-only')
  if (demand.sum !== DEMAND_SUM_MINOR) {
    throw new Error(`Demand sum ${money(demand.sum)} ≠ ${money(DEMAND_SUM_MINOR)}`)
  }

  const salesPdf = await exportPdf(
    'commissionreportin',
    report.id,
    CONSIGNMENT_SALES_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_Persona_Downtown_Consignment_Sales_${report.name}.pdf`),
  )
  const stockPdf = await exportPdf(
    'demand',
    demand.id,
    STOCK_NOTE_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_Persona_Downtown_Consignment_Stock_Note_${demand.name}.pdf`),
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
