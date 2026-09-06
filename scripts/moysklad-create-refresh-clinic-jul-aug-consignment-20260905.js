#!/usr/bin/env node

/**
 * Refresh Clinic — July–August 2026 consignment sales (agreement 24).
 * Sheet: "Sold products for July-August. 05.09.2026" — 15 SKUs ×1.
 * Report only. No replenishment demand.
 *
 * Also deletes today's wrong full-stock report 01461 (38 lines / 120 pcs / 15,908).
 *
 *   node --import dotenv/config scripts/moysklad-create-refresh-clinic-jul-aug-consignment-20260905.js
 *   node --import dotenv/config scripts/moysklad-create-refresh-clinic-jul-aug-consignment-20260905.js --commit
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
const AGENT_ID = 'a6e52a6a-a2d6-11f0-0a80-03b9004ee0de'
const CONTRACT_ID = 'dc3ad805-a2d6-11f0-0a80-0d1c0051970b'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `REFRESH-JUL-AUG-2026-CONS-${uaeToday()}`

const WRONG_REPORT_ID = '896821cd-a93b-11f1-0a80-0fc60047be43'
const WRONG_SUM_MINOR = 1590800
const WRONG_POS_COUNT = 38

/** [code, qty, clinicAed, label] */
const LINES = [
  ['00029', 1, 165, 'Problem Control Serum 30ml'],
  ['00037', 1, 225, 'Skin Barrier Protecting Cream 100g'],
  ['00042', 1, 145, 'EGF Repair Oxymask Cream 50ml'],
  ['00063', 1, 18, 'Intensive Repair Collagen Mask 23g'],
  ['00140', 1, 18, 'Soothing Bomb Sea Algae Mask 25g'],
  ['00188', 1, 80, 'Microbiome Energy Infusing Mist 80ml'],
  ['00194', 1, 165, 'Multi Vita Radiance Serum 30ml'],
  ['54465', 1, 220, 'Soothing Repair Post Cream 100g'],
  ['54472', 1, 125, 'Revita Glow BB Cream #01 Bright 50g'],
  ['54484', 1, 190, 'CERABARRIER Biome Gel Cleanser 200ml'],
  ['54475', 1, 150, 'BIO-MESO PDRN Homecare Ampoule 5000'],
  ['54467', 1, 200, 'Skin Reboot PDRN Mask Pack'],
  ['00195', 1, 165, 'Moisture Replenishing Hyaluron Serum 30ml'],
  ['00191', 1, 165, 'Multi Functional Anti-Wrinkle Serum 30ml'],
  ['00144', 1, 150, 'Skin Caring Blemish Balm Cushion #2 Beige'],
]
const EXPECTED_QTY = 15
const EXPECTED_SUM_MINOR = 218100
const PERIOD_START = '2026-07-01 00:00:00'
const PERIOD_END = '2026-08-31 23:59:59'

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
  const out = path.join(ORDERS_DIR, `GENOSYS_Refresh_Clinic_Consignment_Sales_${reportName}.pdf`)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  fs.writeFileSync(out, Buffer.from(await pdfRes.arrayBuffer()))
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Refresh Clinic — Jul–Aug 2026 consignment sales (agreement 24)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const wrong = await api('GET', `/entity/commissionreportin/${WRONG_REPORT_ID}?expand=agent`)
  if (wrong) {
    const pos = await api('GET', `/entity/commissionreportin/${WRONG_REPORT_ID}/positions?limit=100`)
    console.log(
      `  Wrong ${wrong.name} | ${wrong.agent?.name} | ${money(wrong.sum)} | ${(pos.rows || []).length} lines — will delete`,
    )
    if (wrong.name !== '01461') throw new Error(`Expected 01461, got ${wrong.name}`)
    if (!/REFRESH BIOHACKING/i.test(wrong.agent?.name || '')) {
      throw new Error(`01461 agent is ${wrong.agent?.name}`)
    }
    if (wrong.sum !== WRONG_SUM_MINOR) throw new Error(`01461 sum ${money(wrong.sum)}`)
    if ((pos.rows || []).length !== WRONG_POS_COUNT) {
      throw new Error(`01461 positions ${(pos.rows || []).length} ≠ ${WRONG_POS_COUNT}`)
    }
    if ((wrong.payedSum || 0) > 0) throw new Error('01461 already paid — refuse delete')
  } else {
    console.log('  01461 already gone')
  }

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  if (!/REFRESH BIOHACKING CLINIC/i.test(agent.name || '')) {
    throw new Error(`Unexpected agent ${agent.name}`)
  }
  if (contract.name !== '24') throw new Error(`Expected agreement 24, got ${contract.name}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  Period: 2026-07-01 → 2026-08-31`)
  console.log('  No replenishment demand')

  const existing = await fetchAll(
    `/entity/commissionreportin?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)}`,
  )
  const dup = existing.find((r) => (r.description || '').includes(MARKER))
  if (dup) throw new Error(`Report already exists: ${dup.name} (${dup.id})`)

  const positions = []
  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Lines:')
  for (const [code, qty, unitAed, label] of LINES) {
    const data = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5`)
    const item = (data.rows || []).find((r) => r.code === code && !r.archived)
    if (!item?.id) throw new Error(`Unknown code: ${code} (${label})`)
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
    await api('DELETE', `/entity/commissionreportin/${WRONG_REPORT_ID}`)
    console.log('  Deleted stock-dump 01461')
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
    commissionPeriodEnd: PERIOD_END,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'REFRESH BIOHACKING CLINIC L.L.C | Agreement 24.',
      'July–August 2026 sold list from user screenshot dated 05.09.2026.',
      'Post cream mapped to 100g (54465) — that is the size on their consignment.',
      'Report only — no replenishment demand.',
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
