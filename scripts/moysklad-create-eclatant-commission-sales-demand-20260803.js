#!/usr/bin/env node

/**
 * ECLATANT&CO — July consignment sales report + matching demand into agreement 18.
 * Both PDFs → ~/Desktop/orders/
 *
 * Sheet sold qty:
 *   54457 SPF50 ×3, 54467 PDRN mask pack ×1, 00063 collagen ×11, 00053 eye patches ×1,
 *   00054 eye serum ×1, 00143 ivory cushion ×2, 00189 overnight ×1, 00021 cleanser 180 ×1,
 *   00195 hyaluron serum ×1, 00140 sea algae ×7, 00012 peptide ×4, 00051 hair tonic ×1,
 *   00042 EGF oxymask ×1, 00055 eye cream ×1
 *   Total: 2,701 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-eclatant-commission-sales-demand-20260803.js
 *   node --import dotenv/config scripts/moysklad-create-eclatant-commission-sales-demand-20260803.js --commit
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
const AGENT_ID = '0df9bafd-1a99-11f0-0a80-08b100073e9f' // ECLATANT&CO TRADING CO L.L.C
const CONTRACT_ID = '132684fd-1a99-11f0-0a80-071f0006a1ec' // Contract 18
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER_SALES = `Eclatant consignment sales July 2026 ${uaeToday()}`
const MARKER_DEMAND = `Eclatant consignment replenishment July sold ${uaeToday()}`
const EXPECTED_SUM_MINOR = 270100

/** [code, qty, clinicAed] */
const LINES = [
  ['54457', 3, 125], // Ultra Shield SPF50
  ['54467', 1, 200], // Skin Reboot PDRN mask pack (sheet: 1 piece)
  ['00063', 11, 18], // Collagen mask
  ['00053', 1, 190], // Eye Peptide Gel Patch (box) — sheet: Eye Zone Care Gel Patch
  ['00054', 1, 185], // Eye Contour Serum
  ['00143', 2, 150], // Cushion #1 Ivory
  ['00189', 1, 170], // Overnight Cream Mask
  ['00021', 1, 165], // Snow O₂ Cleanser 180ml
  ['00195', 1, 165], // Hyaluron Serum
  ['00140', 7, 18], // Sea Algae Mask
  ['00012', 4, 38], // Peptide Gel Mask
  ['00051', 1, 145], // HR³ Hair Tonic
  ['00042', 1, 145], // EGF Oxymask Cream
  ['00055', 1, 185], // Eye Contour Cream
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
      salePrice: Number(row.salePrice || 0),
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const dayFilter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(dayFilter)}`)
  const dupR = reports.find((r) => (r.description || '').includes(MARKER_SALES))
  if (dupR) throw new Error(`Duplicate report ${dupR.name}`)
  const demands = await fetchAll(`/entity/demand?filter=${encodeURIComponent(dayFilter)}`)
  const dupD = demands.find((d) => (d.description || '').includes(MARKER_DEMAND))
  if (dupD) throw new Error(`Duplicate demand ${dupD.name}`)
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
    throw new Error(`Export ${entityType} ${res.status}: ${(await res.text()).slice(0, 400)}`)
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
  console.log('  Eclatant — July sales report + matching demand (contract 18)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  Period: 2026-07-01 → 2026-07-31`)

  const resolved = []
  let sumMinor = 0
  let totalQty = 0
  for (const [code, qty, clinicAed] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    }
    const price = Math.round(clinicAed * 100)
    sumMinor += qty * price
    totalQty += qty
    resolved.push({ ...item, qty, price })
    console.log(
      `    ${code} ${item.name.slice(0, 48)} x${qty} @ ${money(price)} = ${money(qty * price)} (avail ${item.available})`,
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} pcs | ${resolved.length} lines`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — would post report + demand + 2 PDFs')
    return
  }

  await ensureNoDuplicate()

  const positions = resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    reward: 0,
  }))

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(2)

  const report = await api('POST', '/entity/commissionreportin', {
    moment: t0,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: '2026-07-01 00:00:00',
    commissionPeriodEnd: '2026-07-31 23:59:59',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER_SALES,
      'ECLATANT&CO TRADING CO L.L.C | Contract 18 | July 2026 sold sheet.',
      'PDRN 1 piece → 54467 pack. Eye Zone Care Gel Patch → 00053 peptide patch box.',
      `${resolved.length} lines / ${totalQty} pcs / ${money(sumMinor)} AED. Unpaid.`,
    ].join('\n'),
    positions,
  })

  if ((report.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ expected`)
  }

  const demandPositions = resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))

  const demand = await api('POST', '/entity/demand', {
    moment: t1,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    description: [
      MARKER_DEMAND,
      'Matching replenishment for July sold list / report ' + report.name,
      'ECLATANT&CO | Contract 18 | same lines as consignment sales.',
    ].join('\n'),
    positions: demandPositions,
  })

  if ((demand.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Demand sum ${money(demand.sum)} ≠ expected`)
  }

  const salesPdf = await exportPdf(
    'commissionreportin',
    report.id,
    CONSIGNMENT_SALES_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_Eclatant_Consignment_Sales_${report.name}.pdf`),
  )
  const stockPdf = await exportPdf(
    'demand',
    demand.id,
    STOCK_NOTE_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_Eclatant_Consignment_Stock_Note_${demand.name}.pdf`),
  )

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  PDF sales: ${salesPdf}`)
  console.log(`  PDF stock: ${stockPdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
