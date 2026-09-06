#!/usr/bin/env node

/**
 * ARFI Nails Barsha — August 2026 commissioner report + matching demand.
 * Agreement 25. Clinic list. Unpaid. Same sold lines on both docs.
 *
 *   node --import dotenv/config scripts/moysklad-create-arfi-barsha-aug-consignment-20260902.js
 *   node --import dotenv/config scripts/moysklad-create-arfi-barsha-aug-consignment-20260902.js --commit
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
const AGENT_ID = '39a1aa83-a5a6-11f0-0a80-1cbc00050fea'
const CONTRACT_ID = '739936aa-a809-11f0-0a80-07ba002a8e67'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `ARFI-BARSHA-AUG-2026-CONS-${uaeToday()}`

/** [code, qty, clinicAed, label] — sold table 01.08–31.08.2026 */
const LINES = [
  ['00042', 1, 145, 'EGF Repair Oxymask Cream 50ml'],
  ['00122', 1, 145, 'Multi-Vita Radiance Cream 50g'],
  ['54473', 1, 125, 'Revita Glow BB Cream #02 Natural 50g'],
  ['00144', 3, 150, 'Skin Caring Blemish Balm Cushion #2 Beige'],
  ['00021', 1, 165, 'Snow O₂ Cleanser 180ml'],
]
const EXPECTED_QTY = 7
const EXPECTED_SUM_MINOR = 103000
const EGF_CODE = '00042'

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

function positionsFrom(lines) {
  return lines.map((l) => ({
    quantity: l.qty,
    price: l.price,
    assortment: href('product', l.id),
    vat: 5,
    vatEnabled: true,
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
  console.log('  ARFI Nails Barsha — Aug 2026 report + matching demand')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  if (contract.name !== '25') throw new Error(`Expected agreement 25, got ${contract.name}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log('  Period: 2026-08-01 → 2026-08-31')

  const existingReports = await fetchAll(
    `/entity/commissionreportin?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)};contract=${encodeURIComponent(`${API}/entity/contract/${CONTRACT_ID}`)}`,
  )
  const existingAug = existingReports.find(
    (r) =>
      (r.description || '').includes(MARKER) ||
      ((r.commissionPeriodStart || '').startsWith('2026-08-01') && r.applicable),
  )

  const existingDemands = await fetchAll(
    `/entity/demand?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)};contract=${encodeURIComponent(`${API}/entity/contract/${CONTRACT_ID}`)}`,
  )
  const dupDemand = existingDemands.find((d) => (d.description || '').includes(MARKER))
  if (dupDemand) throw new Error(`Matching demand already exists: ${dupDemand.name} (${dupDemand.id})`)

  const resolved = []
  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Lines (report):')
  for (const [code, qty, unitAed, label] of LINES) {
    const data = await api(
      'GET',
      `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`,
    )
    const item = (data.rows || []).find((r) => r.code === code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    const avail = Number(item.stock || 0) - Number(item.reserve || 0)
    if (code !== EGF_CODE && avail < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${avail}`)
    }
    if (code === EGF_CODE && avail < qty) {
      console.log(`  WARN ${code} warehouse ${avail} — on report only; demand skips discontinued EGF`)
    }
    const price = Math.round(unitAed * 100)
    const lineMinor = price * qty
    sumMinor += lineMinor
    totalQty += qty
    resolved.push({
      code,
      qty,
      price,
      label,
      id: item.id,
      name: item.name,
      avail,
    })
    console.log(
      `    ${code} ${label} x${qty} @ ${money(price)} = ${money(lineMinor)}  stock=${avail}`,
    )
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

  let report = existingAug
  if (report) {
    if (report.sum !== EXPECTED_SUM_MINOR) {
      throw new Error(`Existing report ${report.name} sum ${money(report.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
    }
    console.log(`  Reusing report ${report.name}`)
  } else {
    report = await api('POST', '/entity/commissionreportin', {
      moment: uaeMomentNow(),
      applicable: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      contract: href('contract', CONTRACT_ID),
      state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
      commissionPeriodStart: '2026-08-01 00:00:00',
      commissionPeriodEnd: '2026-08-31 23:59:59',
      rewardType: 'PercentOfSales',
      rewardPercent: 0,
      description: [
        MARKER,
        'ARFI NAILS BEAUTY SALON (Barsha) | Agreement 25 | August 2026 sold (7 pcs).',
        'Source: clinic MoySklad sold table 01.08–31.08.2026.',
      ].join('\n'),
      positions: positionsFrom(resolved).map((p) => ({ ...p, reward: 0 })),
    })
    if (report.sum !== EXPECTED_SUM_MINOR) {
      throw new Error(`Report sum ${money(report.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
    }
  }

  const demandLines = resolved.filter((l) => !(l.code === EGF_CODE && l.avail < l.qty))
  const demandSum = demandLines.reduce((s, l) => s + l.price * l.qty, 0)
  const demandQty = demandLines.reduce((s, l) => s + l.qty, 0)
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
      demandLines.length === resolved.length
        ? `Replenishment paired with August 2026 report — same ${demandLines.length} SKU / ${demandQty} pcs / ${money(demandSum)} AED.`
        : `Replenishment for report ${report.name}. Skipped ${EGF_CODE} EGF Oxymask — warehouse 0 / discontinued. Demand ${demandLines.length} SKU / ${demandQty} pcs / ${money(demandSum)} AED.`,
      'Agreement 25. No SO / invoice / payment.',
    ].join('\n'),
    positions: positionsFrom(demandLines),
  })

  if (demand.customerOrder) throw new Error('Demand has customerOrder — expected agreement-only')

  const salesPdf = await exportPdf(
    'commissionreportin',
    report.id,
    CONSIGNMENT_SALES_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_ARFI_Nails_Barsha_Consignment_Sales_${report.name}.pdf`),
  )
  const stockPdf = await exportPdf(
    'demand',
    demand.id,
    STOCK_NOTE_TEMPLATE_ID,
    path.join(ORDERS_DIR, `GENOSYS_ARFI_Nails_Barsha_Consignment_Stock_Note_${demand.name}.pdf`),
  )

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED | Not paid`)
  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED | lines=${demandLines.length}`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  Sales PDF: ${salesPdf}`)
  console.log(`  Stock PDF: ${stockPdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
