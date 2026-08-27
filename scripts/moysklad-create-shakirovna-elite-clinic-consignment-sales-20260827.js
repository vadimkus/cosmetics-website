#!/usr/bin/env node

/**
 * Shakirovna Business Bay — consignment sales 11.08.2026–26.08.2026.
 * Elite Salon (agr. 21) + Esthetic Clinic (agr. 26). Clinic list.
 * Oxana WhatsApp table. Reports only. PDFs → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-consignment-sales-20260827.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-consignment-sales-20260827.js --commit
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
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const PERIOD_START = '2026-08-11 00:00:00'
const PERIOD_END = '2026-08-26 23:59:59'
const MARKER_BASE = `SHAKIROVNA-BB-CONS-SALES-11-26AUG-${uaeToday()}`

const SITES = [
  {
    key: 'elite',
    label: 'Elite_Salon',
    exactName: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    agentId: '57430e6e-5e30-11f0-0a80-165f0007780c',
    contractId: 'c24b0b09-5e34-11f0-0a80-1b1c0008232a',
    expectedSumMinor: 78400,
    expectedQty: 12,
    lines: [
      ['00122', 1, 145],
      ['54457', 1, 125],
      ['00012', 2, 38],
      ['00029', 1, 165],
      ['00021', 1, 165],
      ['00063', 3, 18],
      ['00140', 3, 18],
    ],
  },
  {
    key: 'clinic',
    label: 'Esthetic_Clinic',
    exactName: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    agentId: 'a187255f-a9b6-11f0-0a80-09900022125b',
    contractId: 'd08f670e-b993-11f0-0a80-19750031f04a',
    expectedSumMinor: 65000,
    expectedQty: 5,
    lines: [
      ['00021', 1, 165],
      ['00022', 1, 130],
      ['00122', 1, 145],
      ['00041', 2, 105],
    ],
  },
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
        ...(body ? { 'Content-Type': 'application/json' } : {}),
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
    })
  }
  return stock
}

async function ensureNoDuplicate(agentId, marker) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate report ${dup.name}`)
}

async function exportSalesPdf(reportId, reportName, label) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
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
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const out = path.join(ORDERS_DIR, `GENOSYS_Shakirovna_${label}_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Elite + Clinic — consignment 11–26 Aug 2026')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Period: ${PERIOD_START.slice(0, 10)} → ${PERIOD_END.slice(0, 10)}`)

  const stock = await fetchStockByCode()
  const results = []

  for (const site of SITES) {
    const marker = `${MARKER_BASE} — ${site.key.toUpperCase()}`
    const [agent, contract] = await Promise.all([
      api('GET', `/entity/counterparty/${site.agentId}`),
      api('GET', `/entity/contract/${site.contractId}`),
    ])
    if (agent.name !== site.exactName) throw new Error(`Unexpected agent: ${agent.name}`)
    console.log(`\n  ${agent.name} | agr ${contract.name}`)

    const resolved = []
    let sumMinor = 0
    let totalQty = 0
    for (const [code, qty, unitAed] of site.lines) {
      const item = stock.get(code)
      if (!item?.id) throw new Error(`Unknown code: ${code}`)
      const priceMinor = Math.round(unitAed * 100)
      const lineMinor = priceMinor * qty
      sumMinor += lineMinor
      totalQty += qty
      resolved.push({ ...item, qty, priceMinor })
      console.log(`    ${code} ${item.name.slice(0, 52)} x${qty} @ ${unitAed} = ${money(lineMinor)}`)
    }
    console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} pcs`)
    if (sumMinor !== site.expectedSumMinor || totalQty !== site.expectedQty) {
      throw new Error(
        `${site.key}: expected ${money(site.expectedSumMinor)} / ${site.expectedQty}, got ${money(sumMinor)} / ${totalQty}`,
      )
    }

    if (!COMMIT) {
      console.log('  DRY RUN')
      continue
    }

    await ensureNoDuplicate(site.agentId, marker)
    const report = await api('POST', '/entity/commissionreportin', {
      moment: uaeMomentNow(),
      applicable: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', site.agentId),
      contract: href('contract', site.contractId),
      state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
      commissionPeriodStart: PERIOD_START,
      commissionPeriodEnd: PERIOD_END,
      rewardType: 'PercentOfSales',
      rewardPercent: 0,
      description: [
        marker,
        `Business Bay ${site.exactName} | Agreement ${contract.name}.`,
        'Oxana sales table 11.08.2026–26.08.2026. Clinic prices.',
        'Report only — no replenishment. Not paid yet.',
        `${resolved.length} lines / ${totalQty} pcs / ${money(sumMinor)} AED.`,
      ].join('\n'),
      positions: resolved.map((line) => ({
        quantity: line.qty,
        price: line.priceMinor,
        assortment: href('product', line.id),
        vat: 5,
        vatEnabled: true,
        reward: 0,
      })),
    })
    if ((report.sum || 0) !== site.expectedSumMinor) {
      throw new Error(`${site.key} sum ${money(report.sum)} vs ${money(site.expectedSumMinor)}`)
    }
    const pdfPath = await exportSalesPdf(report.id, report.name, site.label)
    console.log(`  Report ${report.name}: ${money(report.sum)} AED`)
    console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
    console.log(`  PDF: ${pdfPath}`)
    results.push({ site: site.key, name: report.name, sum: money(report.sum), pdfPath, id: report.id })
  }

  if (COMMIT && results.length) {
    console.log('\n=== SUMMARY ===')
    for (const r of results) console.log(`  ${r.site}: ${r.name} ${r.sum} AED`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
