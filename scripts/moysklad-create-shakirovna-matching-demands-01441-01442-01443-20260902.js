#!/usr/bin/env node

/**
 * Shakirovna — matching consignment demands for unpaid Aug 27 reports:
 *   Poly   01441 (agreement 41)
 *   Elite  01442 (agreement 21)
 *   Clinic 01443 (agreement 26)
 *
 * Same SKUs / qty / prices as each commissioner report. No SO / invoice / payment.
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-matching-demands-01441-01442-01443-20260902.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-matching-demands-01441-01442-01443-20260902.js --commit
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

const { uaeMomentNow, uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `SHAKIROVNA-MATCHING-DEMANDS-01441-01442-01443-${uaeToday()}`

const REPORTS = [
  {
    key: 'poly',
    label: 'Poly_Clinic',
    reportName: '01441',
    reportId: '01999f25-a1e9-11f1-0a80-0e41005c67df',
    contractId: '93cc0951-96e0-11f1-0a80-036000196a36',
    contractName: '41',
  },
  {
    key: 'elite',
    label: 'Elite_Salon',
    reportName: '01442',
    reportId: '82a6365a-a1ec-11f1-0a80-1a71005dab34',
    contractId: 'c24b0b09-5e34-11f0-0a80-1b1c0008232a',
    contractName: '21',
  },
  {
    key: 'clinic',
    label: 'Esthetic_Clinic',
    reportName: '01443',
    reportId: '874530a0-a1ec-11f1-0a80-15d9005d6589',
    contractId: 'd08f670e-b993-11f0-0a80-19750031f04a',
    contractName: '26',
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

async function exportStockNotePdf(demandId, demandName, label) {
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
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Stock note export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(demandName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Shakirovna_${label}_Consignment_Stock_Note_${safe}.pdf`)
  fs.writeFileSync(outPath, Buffer.from(await pdfRes.arrayBuffer()))
  return outPath
}

async function loadReport(cfg) {
  const report = await api('GET', `/entity/commissionreportin/${cfg.reportId}?expand=agent,contract,state`)
  if (report.name !== cfg.reportName) {
    throw new Error(`Report id mismatch: expected ${cfg.reportName}, got ${report.name}`)
  }
  if (report.state?.id && report.state.id !== STATE_REPORT_NOT_PAID_ID) {
    throw new Error(`${cfg.reportName} state ${report.state?.name} — expected Not paid`)
  }
  const contractId = report.contract?.id || report.contract?.meta?.href?.split('/').pop()?.split('?')[0]
  if (contractId !== cfg.contractId) {
    throw new Error(`${cfg.reportName}: contract ${contractId} ≠ ${cfg.contractId}`)
  }
  if (report.contract?.name && report.contract.name !== cfg.contractName) {
    throw new Error(`${cfg.reportName}: agreement ${report.contract.name} ≠ ${cfg.contractName}`)
  }
  const agentId = report.agent?.id || report.agent?.meta?.href?.split('/').pop()?.split('?')[0]
  const reportPos = await fetchAll(
    `/entity/commissionreportin/${report.id}/positions?expand=assortment`,
  )
  const lines = []
  let totalQty = 0
  for (const p of reportPos) {
    const code = p.assortment?.code
    const id = p.assortment?.id || p.assortment?.meta?.href?.split('/').pop()?.split('?')[0]
    const qty = Number(p.quantity)
    const price = Number(p.price)
    if (!code || !id) throw new Error(`${cfg.reportName}: position missing assortment`)
    totalQty += qty
    lines.push({ code, id, name: p.assortment?.name || code, qty, price })
  }
  return { report, agentId, contractId, lines, totalQty }
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna — matching demands for 01441 / 01442 / 01443')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}\n`)

  const prepared = []
  const needByCode = new Map()

  for (const cfg of REPORTS) {
    const data = await loadReport(cfg)
    const siteMarker = `${MARKER} — report ${cfg.reportName}`

    const agentHref = `${API}/entity/counterparty/${data.agentId}`
    const contractHref = `${API}/entity/contract/${data.contractId}`
    const existing = await fetchAll(
      `/entity/demand?filter=agent=${encodeURIComponent(agentHref)};contract=${encodeURIComponent(contractHref)}`,
    )
    const dup = existing.find(
      (d) =>
        (d.description || '').includes(siteMarker) ||
        (d.description || '').includes(`paired with report ${cfg.reportName}`),
    )
    if (dup) throw new Error(`Already exists for ${cfg.reportName}: ${dup.name} (${dup.id})`)

    console.log(`── ${cfg.label} ──`)
    console.log(`  Agent   : ${data.report.agent?.name}`)
    console.log(`  Contract: ${data.report.contract?.name}`)
    console.log(
      `  Report  : ${data.report.name} | ${money(data.report.sum)} AED | ${data.report.state?.name} | ${data.lines.length} SKU / ${data.totalQty} pcs`,
    )
    for (const l of data.lines) {
      console.log(`    ${l.code} ×${l.qty} @ ${money(l.price)} — ${l.name.slice(0, 52)}`)
      needByCode.set(l.code, (needByCode.get(l.code) || 0) + l.qty)
    }
    console.log('')
    prepared.push({ cfg, data, siteMarker })
  }

  console.log('── Warehouse check ──')
  const shortages = []
  for (const [code, need] of [...needByCode.entries()].sort()) {
    const d = await api(
      'GET',
      `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`,
    )
    const row = (d.rows || []).find((r) => r.code === code)
    const avail = Number(row?.stock || 0) - Number(row?.reserve || 0)
    const ok = avail >= need
    console.log(`  ${code}: need ${need}, have ${avail}${ok ? '' : ' ⚠ SHORT'}`)
    if (!ok) shortages.push(`${code}: need ${need}, have ${avail}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    if (shortages.length) console.log('  BLOCKED on commit until stock covers lines.')
    return
  }
  if (shortages.length) {
    throw new Error(`Insufficient warehouse stock:\n  ${shortages.join('\n  ')}`)
  }

  const moment = uaeMomentNow()
  const results = []

  for (const { cfg, data, siteMarker } of prepared) {
    const demand = await api('POST', '/entity/demand', {
      moment,
      applicable: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', data.agentId),
      contract: href('contract', data.contractId),
      store: href('store', STORE_ID),
      state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
      description: [
        siteMarker,
        `Replenishment paired with report ${cfg.reportName} — same ${data.lines.length} SKU / ${data.totalQty} pcs / ${money(data.report.sum)} AED.`,
        `Agreement ${cfg.contractName}. No SO / invoice / payment.`,
      ].join('\n'),
      positions: data.lines.map((l) => ({
        quantity: l.qty,
        price: l.price,
        assortment: href('product', l.id),
        vat: 5,
        vatEnabled: true,
      })),
    })

    if (demand.customerOrder) {
      throw new Error(`${cfg.reportName}: demand has customerOrder`)
    }
    if (demand.sum !== data.report.sum) {
      throw new Error(
        `${cfg.reportName}: demand sum ${money(demand.sum)} ≠ report ${money(data.report.sum)}`,
      )
    }

    const pdfPath = await exportStockNotePdf(demand.id, demand.name, cfg.label)
    results.push({
      label: cfg.label,
      report: cfg.reportName,
      demand: demand.name,
      sum: money(demand.sum),
      id: demand.id,
      pdf: pdfPath,
    })

    console.log(`\n  ${cfg.label}: demand ${demand.name} | ${money(demand.sum)} AED`)
    console.log(`    https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
    console.log(`    PDF: ${pdfPath}`)
  }

  console.log('\n====================================================================')
  for (const r of results) {
    console.log(`  ${r.label}: report ${r.report} → demand ${r.demand} | ${r.sum} AED`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
