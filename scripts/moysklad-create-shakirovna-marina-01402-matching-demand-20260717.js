#!/usr/bin/env node

/**
 * Shakirovna Marina — matching consignment отгрузка for report 01402.
 * Same lines / prices / date as 01402, agreement 00030.
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-01402-matching-demand-20260717.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-01402-matching-demand-20260717.js --commit
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

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = '93775ae5-d18d-11ea-0a80-02e00008417d'
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb' // 00030
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const REPORT_NAME = '01402'
const MARKER = 'SHAKIROVNA-MARINA-01402-MATCHING-DEMAND-2026-07-17'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
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
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
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
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Stock note export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Shakirovna_Marina_Consignment_Stock_Note_${demandName}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Marina — matching demand for report 01402')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const agentHref = `${API}/entity/counterparty/${AGENT_ID}`
  const reports = await fetchAll(
    `/entity/commissionreportin?filter=agent=${encodeURIComponent(agentHref)};name=${REPORT_NAME}`
  )
  const report = reports.find((r) => r.name === REPORT_NAME)
  if (!report) throw new Error(`Report ${REPORT_NAME} not found`)

  const contractId = report.contract?.meta?.href?.split('/').pop()?.split('?')[0]
  if (contractId !== CONTRACT_ID) {
    throw new Error(`Report ${REPORT_NAME} contract ${contractId} ≠ 00030`)
  }

  const reportPos = await fetchAll(
    `/entity/commissionreportin/${report.id}/positions?expand=assortment`
  )
  if (!reportPos.length) throw new Error('Report has no positions')

  let totalQty = 0
  let totalMinor = 0
  const lines = []
  for (const p of reportPos) {
    const code = p.assortment?.code
    const id = p.assortment?.id || p.assortment?.meta?.href?.split('/').pop()?.split('?')[0]
    const qty = Number(p.quantity)
    const price = Number(p.price)
    if (!code || !id) throw new Error('Position missing assortment')
    totalQty += qty
    totalMinor += price * qty
    lines.push({
      code,
      id,
      name: p.assortment?.name || code,
      qty,
      price,
    })
  }

  console.log(`  Report : ${report.name} | ${report.moment} | ${money(report.sum)} AED`)
  console.log(`  ID     : ${report.id}`)
  console.log(`  Lines  : ${lines.length} | ${totalQty} pcs | positions sum ${money(totalMinor)} AED`)
  console.log(`  Moment : ${report.moment} (demand will use same)\n`)

  for (const l of lines) {
    console.log(`    ${l.code} ×${l.qty} @ ${money(l.price)} — ${l.name}`)
  }

  // Duplicate guard
  const existing = await fetchAll(
    `/entity/demand?filter=agent=${encodeURIComponent(agentHref)};contract=${encodeURIComponent(API + '/entity/contract/' + CONTRACT_ID)}`
  )
  const dup = existing.find((d) => (d.description || '').includes(MARKER) || (d.description || '').includes('paired with report 01402'))
  if (dup) throw new Error(`Matching demand already exists: ${dup.name} (${dup.id})`)

  // Stock check
  const stockRows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stockByCode = new Map(stockRows.filter((r) => r.code).map((r) => [r.code, Number(r.stock || 0) - Number(r.reserve || 0)]))
  const shortages = []
  for (const l of lines) {
    const avail = stockByCode.get(l.code) ?? 0
    if (avail < l.qty) shortages.push(`${l.code}: need ${l.qty}, have ${avail}`)
  }
  if (shortages.length) {
    console.log('\n  Warehouse shortages:')
    for (const s of shortages) console.log(`    ⚠ ${s}`)
  } else {
    console.log('\n  Warehouse stock: OK for all lines')
  }

  const beigeLine = lines.find((l) => l.code === '00144')
  console.log(`\n  Beige on this demand: ×${beigeLine?.qty || 0} (books were 2 → expect 7 after)`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    if (shortages.length) console.log('  BLOCKED on commit until warehouse stock covers lines.')
    return
  }

  if (shortages.length) {
    throw new Error(`Insufficient warehouse stock:\n  ${shortages.join('\n  ')}`)
  }

  const positions = lines.map((l) => ({
    quantity: l.qty,
    price: l.price,
    assortment: href('product', l.id),
    vat: 5,
    vatEnabled: true,
  }))

  const demand = await api('POST', '/entity/demand', {
    moment: report.moment,
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
      `Replenishment отгрузка paired with report ${REPORT_NAME} — same ${lines.length} SKU / ${totalQty} pcs.`,
      'Backfill 2026-07-17: physical delivery already done; booking matching demand on report date.',
    ].join('\n'),
    positions,
  })

  const demandPos = await fetchAll(`/entity/demand/${demand.id}/positions?expand=assortment`)
  if (demandPos.length !== lines.length) {
    throw new Error(`Demand lines ${demandPos.length} ≠ report ${lines.length}`)
  }
  if (money(demand.sum) !== money(report.sum)) {
    throw new Error(`Sum mismatch: demand ${money(demand.sum)} vs report ${money(report.sum)}`)
  }

  console.log(`\n  Demand: ${demand.name} | ${money(demand.sum)} AED | moment ${demand.moment}`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const pdfPath = await exportStockNotePdf(demand.id, demand.name)
  console.log(`  PDF   : ${pdfPath}`)
  console.log('\n  Verification OK — demand matches report 01402.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
