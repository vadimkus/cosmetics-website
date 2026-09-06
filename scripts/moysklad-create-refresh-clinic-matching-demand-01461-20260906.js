#!/usr/bin/env node

/**
 * Refresh Clinic — matching demand into agreement 24 for consignment sales 01461.
 * Same sold lines as report 01461 except EGF 00042 (warehouse 0 / discontinued).
 * Demand 14 pcs / 2,036 AED. Report stays 2,181.
 *
 *   node --import dotenv/config scripts/moysklad-create-refresh-clinic-matching-demand-01461-20260906.js
 *   node --import dotenv/config scripts/moysklad-create-refresh-clinic-matching-demand-01461-20260906.js --commit
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
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'a6e52a6a-a2d6-11f0-0a80-03b9004ee0de'
const CONTRACT_ID = 'dc3ad805-a2d6-11f0-0a80-0d1c0051970b'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const REPORT_ID = '23973976-a93c-11f1-0a80-0de600a534f4'
const REPORT_NAME = '01461'
const MARKER = `REFRESH-MATCHING-DEMAND-01461-${uaeToday()}`

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
const EGF_CODE = '00042'
const REPORT_SUM_MINOR = 218100
const EXPECTED_QTY = 14
const EXPECTED_SUM_MINOR = 203600

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

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
  }
}

async function exportStockNotePdf(demandId, demandName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/demand/metadata/customtemplate/${STOCK_NOTE_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/demand/${demandId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 302 && res.status !== 303) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, `GENOSYS_Refresh_Clinic_Consignment_Stock_Note_${demandName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Refresh Clinic — matching demand for 01461 (agr. 24)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, report] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    api('GET', `/entity/commissionreportin/${REPORT_ID}?expand=agent`),
  ])
  if (!/REFRESH BIOHACKING CLINIC/i.test(agent.name || '')) {
    throw new Error(`Unexpected agent ${agent.name}`)
  }
  if (contract.name !== '24') throw new Error(`Expected agreement 24, got ${contract.name}`)
  if (report.name !== REPORT_NAME) throw new Error(`Expected report ${REPORT_NAME}, got ${report.name}`)
  if (report.sum !== REPORT_SUM_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ ${money(REPORT_SUM_MINOR)}`)
  }
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  After report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  Skip: ${EGF_CODE} EGF Oxymask — warehouse 0 / discontinued`)

  const existing = await fetchAll(
    `/entity/demand?filter=${encodeURIComponent(`agent=${API}/entity/counterparty/${AGENT_ID}`)}`,
  )
  const dup = existing.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Demand already exists: ${dup.name} (${dup.id})`)

  const positions = []
  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Lines:')
  for (const [code, qty, unitAed, label] of LINES) {
    if (code === EGF_CODE) {
      console.log(`    SKIP ${code} ${label} x${qty} — warehouse 0`)
      continue
    }
    const item = await fetchAssortmentByCode(code)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code} (${label}): need ${qty}, have ${item.available}`)
    }
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
    })
    console.log(`    ${code} ${item.name} x${qty} @ ${money(price)} = ${money(lineMinor)} (avail ${item.available})`)
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
      MARKER,
      'REFRESH BIOHACKING CLINIC L.L.C | Agreement 24.',
      `Replenishment matching consignment sales ${REPORT_NAME} (Jul–Aug 2026).`,
      `Skipped ${EGF_CODE} EGF Oxymask — warehouse 0 / discontinued.`,
      `Demand ${EXPECTED_QTY} pcs / ${money(EXPECTED_SUM_MINOR)} AED. No SO / invoice / payment.`,
    ].join('\n'),
    positions,
  })

  if (demand.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Posted sum ${money(demand.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (demand.customerOrder) {
    throw new Error('Demand has customerOrder — consignment should be agreement-only')
  }

  const pdfPath = await exportStockNotePdf(demand.id, demand.name)
  console.log(`\n  Demand ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
