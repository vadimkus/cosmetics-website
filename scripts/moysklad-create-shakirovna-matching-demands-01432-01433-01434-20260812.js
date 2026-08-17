#!/usr/bin/env node

/**
 * Shakirovna — 3 matching consignment stock-note demands against reported sales:
 *   Marina 01432 (agreement 00030)
 *   Elite  01433 (agreement 21)
 *   Clinic 01434 (agreement 26)
 *
 * Same SKUs / qty / prices as each commission report. PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-matching-demands-01432-01433-01434-20260812.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-matching-demands-01432-01433-01434-20260812.js --commit
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
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `SHAKIROVNA-MATCHING-DEMANDS-01432-01433-01434-${uaeToday()}`

const REPORTS = [
  {
    key: 'salon',
    label: 'Marina_Salon',
    reportName: '01432',
    reportId: '314209ce-963a-11f1-0a80-081e002733b0',
    contractId: 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb', // 00030
  },
  {
    key: 'elite',
    label: 'Elite_Salon',
    reportName: '01433',
    reportId: '96491263-963a-11f1-0a80-081e002764a4',
    contractId: 'c24b0b09-5e34-11f0-0a80-1b1c0008232a', // 21
  },
  {
    key: 'clinic',
    label: 'Esthetic_Clinic',
    reportName: '01434',
    reportId: '997618dd-963a-11f1-0a80-111b002615ee',
    contractId: 'd08f670e-b993-11f0-0a80-19750031f04a', // 26
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
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(demandName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Shakirovna_${label}_Consignment_Stock_Note_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function loadReport(cfg) {
  const report = await api('GET', `/entity/commissionreportin/${cfg.reportId}`)
  if (report.name !== cfg.reportName) {
    throw new Error(`Report id mismatch: expected ${cfg.reportName}, got ${report.name}`)
  }
  const contractId = report.contract?.meta?.href?.split('/').pop()?.split('?')[0]
  if (contractId !== cfg.contractId) {
    throw new Error(`${cfg.reportName}: contract ${contractId} ≠ ${cfg.contractId}`)
  }
  const agentId = report.agent?.meta?.href?.split('/').pop()?.split('?')[0]
  const agent = await api('GET', `/entity/counterparty/${agentId}`)
  const contract = await api('GET', `/entity/contract/${contractId}`)
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
  return { report, agent, contract, agentId, contractId, lines, totalQty }
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna — matching demands for 01432 / 01433 / 01434')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}\n`)

  const stockRows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stockByCode = new Map(
    stockRows.filter((r) => r.code).map((r) => [r.code, Number(r.stock || 0) - Number(r.reserve || 0)]),
  )

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
    console.log(`  Agent   : ${data.agent.name}`)
    console.log(`  Contract: ${data.contract.name}`)
    console.log(
      `  Report  : ${data.report.name} | ${money(data.report.sum)} AED | ${data.lines.length} SKU / ${data.totalQty} pcs`,
    )
    for (const l of data.lines) {
      console.log(`    ${l.code} ×${l.qty} @ ${money(l.price)} — ${l.name.slice(0, 48)}`)
      needByCode.set(l.code, (needByCode.get(l.code) || 0) + l.qty)
    }
    console.log('')
    prepared.push({ cfg, data, siteMarker })
  }

  console.log('── Warehouse check (combined) ──')
  const shortages = []
  for (const [code, need] of [...needByCode.entries()].sort()) {
    const avail = stockByCode.get(code) ?? 0
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
    const positions = data.lines.map((l) => ({
      quantity: l.qty,
      price: l.price,
      assortment: href('product', l.id),
      vat: 5,
      vatEnabled: true,
    }))

    const demand = await api('POST', '/entity/demand', {
      moment,
      applicable: true,
      shared: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', data.agentId),
      contract: href('contract', data.contractId),
      store: href('store', STORE_ID),
      state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
      description: [
        siteMarker,
        `Replenishment отгрузка paired with report ${cfg.reportName} — same ${data.lines.length} SKU / ${data.totalQty} pcs.`,
        `Agreement note against reported sales (${money(data.report.sum)} AED).`,
      ].join('\n'),
      positions,
    })

    if (money(demand.sum) !== money(data.report.sum)) {
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

    console.log(`\n  ✓ ${cfg.label}: demand ${demand.name} | ${money(demand.sum)} AED`)
    console.log(`    https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
    console.log(`    PDF: ${pdfPath}`)
  }

  console.log('\n====================================================================')
  console.log('  Summary')
  console.log('====================================================================')
  for (const r of results) {
    console.log(`  ${r.label}: report ${r.report} → demand ${r.demand} | ${r.sum} AED`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
