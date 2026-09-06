#!/usr/bin/env node

/**
 * CEIA CLINIC — first consignment sales report. Agreement 38.
 * Sold sheet: mist ×1 @ 80 + overnight ×1 @ 170. Report only. No demand.
 *
 * Also deletes wrong Bianco Hills report 01460 (same sheet, wrong customer).
 *
 *   node --import dotenv/config scripts/moysklad-create-ceia-consignment-sales-20260904.js
 *   node --import dotenv/config scripts/moysklad-create-ceia-consignment-sales-20260904.js --commit
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
const AGENT_ID = 'd7af76af-8cc5-11f1-0a80-08f4001604b7'
const CONTRACT_ID = '2b623037-8ccb-11f1-0a80-1d1a001698e4'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `CEIA-CONS-SALES-${uaeToday()}`

const WRONG_HILLS_REPORT_ID = '23246109-a850-11f1-0a80-182d0061899f'
const WRONG_HILLS_PDF = path.join(ORDERS_DIR, 'GENOSYS_Bianco_Dubai_Hills_Consignment_Sales_01460.pdf')
const WRONG_HILLS_HTML = path.join(ORDERS_DIR, 'GENOSYS_Bianco_Dubai_Hills_Consignment_Sales_01460.html')

const LINES = [
  ['00188', 1, 80, 'Microbiome Energy Infusing Mist 80ml'],
  ['00189', 1, 170, 'Skin Rescue Overnight Cream Mask 100g'],
]
const EXPECTED_QTY = 2
const EXPECTED_SUM_MINOR = 25000
const PERIOD_START = '2026-07-31 00:00:00'

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if (res.status === 404 && method === 'GET') return null
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
  const out = path.join(ORDERS_DIR, `GENOSYS_CEIA_Clinic_Consignment_Sales_${reportName}.pdf`)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  fs.writeFileSync(out, Buffer.from(await pdfRes.arrayBuffer()))
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  CEIA CLINIC — consignment sales (report only)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const wrong = await api('GET', `/entity/commissionreportin/${WRONG_HILLS_REPORT_ID}?expand=agent`)
  if (wrong) {
    console.log(`  Wrong Hills ${wrong.name} | ${wrong.agent?.name} | ${money(wrong.sum)} — will delete`)
    if (wrong.name !== '01460') throw new Error(`Expected Hills 01460, got ${wrong.name}`)
    if (!/dubai hills/i.test(wrong.agent?.name || '')) {
      throw new Error(`01460 agent is ${wrong.agent?.name}`)
    }
    if (wrong.sum !== EXPECTED_SUM_MINOR) throw new Error(`01460 sum ${money(wrong.sum)}`)
  } else {
    console.log('  Hills 01460 already gone')
  }

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  if (!/^CEIA CLINIC/i.test(agent.name || '')) throw new Error(`Unexpected agent ${agent.name}`)
  if (contract.name !== '38') throw new Error(`Expected agreement 38, got ${contract.name}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  Period: 2026-07-31 → ${uaeToday()}`)
  console.log('  No replenishment demand')

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
    const data = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5`)
    const item = (data.rows || []).find((r) => r.code === code && !r.archived)
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
    console.log(`    ${code} ${item.name} x${qty} @ ${money(price)} = ${money(lineMinor)}`)
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} pcs`)
  if (totalQty !== EXPECTED_QTY) throw new Error(`Qty ${totalQty} ≠ ${EXPECTED_QTY}`)
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (wrong) {
    await api('DELETE', `/entity/commissionreportin/${WRONG_HILLS_REPORT_ID}`)
    console.log('  Deleted Hills 01460')
  }
  for (const p of [WRONG_HILLS_PDF, WRONG_HILLS_HTML]) {
    if (fs.existsSync(p)) fs.unlinkSync(p)
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
    commissionPeriodStart: PERIOD_START,
    commissionPeriodEnd: `${uaeToday()} 23:59:59`,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'CEIA CLINIC | Agreement 38 | sold sheet mist + overnight.',
      'Clinic list (80 / 170). Report only — no demand.',
    ].join('\n'),
    positions,
  })

  if (report.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

  const salesPdf = await exportPdf(report.id, report.name)
  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED | Not paid`)
  console.log(`  https://online.moysklad.ru/app/#commissionreportin/edit?id=${report.id}`)
  console.log(`  Sales PDF: ${salesPdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
