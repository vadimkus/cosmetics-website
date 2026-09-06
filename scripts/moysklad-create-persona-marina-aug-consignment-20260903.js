#!/usr/bin/env node

/**
 * Persona Marina — August 2026 commissioner report (agreement 00024) + PDF.
 * Report only. No demand.
 *
 *   node --import dotenv/config scripts/moysklad-create-persona-marina-aug-consignment-20260903.js
 *   node --import dotenv/config scripts/moysklad-create-persona-marina-aug-consignment-20260903.js --commit
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
const AGENT_ID = 'af21a79a-63cd-11ea-0a80-02b2000e2aeb'
const CONTRACT_ID = '56ca0166-c388-11eb-0a80-093a001d1ee0'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `PERSONA-MARINA-AUG-2026-CONS-${uaeToday()}`

/** [code, qty, clinicAed, label] */
const LINES = [
  ['00052', 2, 170, 'HR³ Matrix Scalp & Hair Shampoo 300ml'],
  ['00144', 1, 150, 'Skin Caring Blemish Balm Cushion #2 Beige'],
  ['00053', 2, 190, 'EyeCell Eye Peptide Gel Patch (box)'],
  ['00063', 1, 18, 'Intensive Repair Collagen Mask'],
  ['00042', 1, 145, 'EGF Repair Oxymask Cream 50ml'],
  ['00012', 2, 38, 'Peptide Gel Mask 39g'],
  ['00059', 2, 490, 'EyeCell Eye Zone Care Kit'],
  ['54467', 2, 200, 'Skin Reboot PDRN Mask Pack'],
  ['00021', 2, 165, 'Snow O₂ Cleanser 180ml'],
  ['00035', 1, 145, 'Intensive Problem Control Cream 50g'],
  ['00022', 1, 130, 'Snow Booster Toner 200ml'],
  ['54457', 1, 125, 'Ultra Shield Sun Cream SPF50 50g'],
  ['00041', 1, 105, 'Multi Sun Cream SPF40'],
]
const EXPECTED_QTY = 19
const EXPECTED_SUM_MINOR = 332400

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

async function exportPdf(reportId, reportName) {
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
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const out = path.join(ORDERS_DIR, `GENOSYS_Persona_Marina_Consignment_Sales_${reportName}.pdf`)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  fs.writeFileSync(out, Buffer.from(await pdfRes.arrayBuffer()))
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Persona Marina — August consignment sales (report only)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  if (contract.name !== '00024') throw new Error(`Expected agreement 00024, got ${contract.name}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log('  Period: 2026-08-01 → 2026-08-31')
  console.log('  Snow booster 180ml → 00022 Snow Booster 200ml (no 180ml booster SKU)')

  const existingReports = await fetchAll(
    `/entity/commissionreportin?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)}`,
  )
  const dupReport = existingReports.find((r) => (r.description || '').includes(MARKER))
  if (dupReport) throw new Error(`Report already exists: ${dupReport.name} (${dupReport.id})`)

  const positions = []
  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Lines:')
  for (const [code, qty, unitAed, label] of LINES) {
    const data = await api(
      'GET',
      `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`,
    )
    const item = (data.rows || []).find((r) => r.code === code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    const price = Math.round(unitAed * 100)
    const lineMinor = price * qty
    sumMinor += lineMinor
    totalQty += qty
    positions.push({
      quantity: qty,
      price,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })
    console.log(`    ${code} ${label} x${qty} @ ${money(price)} = ${money(lineMinor)}`)
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
    commissionPeriodStart: '2026-08-01 00:00:00',
    commissionPeriodEnd: '2026-08-31 23:59:59',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Persona Marina | Agreement 00024 | August sold (19 pcs).',
      'Clinic list. Report only — no demand.',
    ].join('\n'),
    positions,
  })

  if (report.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

  const salesPdf = await exportPdf(report.id, report.name)
  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED | Not paid`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  Sales PDF: ${salesPdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
