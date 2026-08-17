#!/usr/bin/env node

/**
 * TONETRENDZ — matching consignment stock-note demand for report 01415.
 * Same SKUs / qty / prices. Agreement 36. PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-01415-matching-demand-20260730.js
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-01415-matching-demand-20260730.js --commit
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
const AGENT_ID = '74aa75cb-63db-11f1-0a80-111d001bbe72' // TONETRENDZ
const CONTRACT_ID = '7a5e3023-63dc-11f1-0a80-1ba4001ce87b' // 36
const REPORT_ID = 'd90031d7-8bf5-11f1-0a80-0fc00013aa27'
const REPORT_NAME = '01415'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `TONETRENDZ-01415-MATCHING-DEMAND-${uaeToday()}`

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
    throw new Error(`Stock note export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(demandName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_TONETRENDZ_Consignment_Stock_Note_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  TONETRENDZ — matching demand for report 01415')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const report = await api('GET', `/entity/commissionreportin/${REPORT_ID}`)
  if (report.name !== REPORT_NAME) {
    throw new Error(`Expected report ${REPORT_NAME}, got ${report.name}`)
  }
  const contractId = report.contract?.meta?.href?.split('/').pop()?.split('?')[0]
  if (contractId !== CONTRACT_ID) {
    throw new Error(`Contract ${contractId} ≠ 36`)
  }

  const reportPos = await fetchAll(
    `/entity/commissionreportin/${REPORT_ID}/positions?expand=assortment`,
  )
  if (!reportPos.length) throw new Error('Report has no positions')

  let totalQty = 0
  const lines = []
  for (const p of reportPos) {
    const code = p.assortment?.code
    const id = p.assortment?.id || p.assortment?.meta?.href?.split('/').pop()?.split('?')[0]
    const qty = Number(p.quantity)
    const price = Number(p.price)
    if (!code || !id) throw new Error('Position missing assortment')
    totalQty += qty
    lines.push({ code, id, name: p.assortment?.name || code, qty, price })
  }

  console.log(`  Report : ${report.name} | ${money(report.sum)} AED`)
  console.log(`  Lines  : ${lines.length} | ${totalQty} pcs`)
  for (const l of lines) {
    console.log(`    ${l.code} ×${l.qty} @ ${money(l.price)} — ${l.name.slice(0, 48)}`)
  }

  const agentHref = `${API}/entity/counterparty/${AGENT_ID}`
  const contractHref = `${API}/entity/contract/${CONTRACT_ID}`
  const existing = await fetchAll(
    `/entity/demand?filter=agent=${encodeURIComponent(agentHref)};contract=${encodeURIComponent(contractHref)}`,
  )
  const dup = existing.find(
    (d) =>
      (d.description || '').includes(MARKER) ||
      (d.description || '').includes(`paired with report ${REPORT_NAME}`),
  )
  if (dup) throw new Error(`Matching demand already exists: ${dup.name} (${dup.id})`)

  const stockRows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stockByCode = new Map(
    stockRows.filter((r) => r.code).map((r) => [r.code, Number(r.stock || 0) - Number(r.reserve || 0)]),
  )
  const shortages = []
  for (const l of lines) {
    const avail = stockByCode.get(l.code) ?? 0
    if (avail < l.qty) shortages.push(`${l.code}: need ${l.qty}, have ${avail}`)
  }
  if (shortages.length) {
    console.log('\n  Warehouse shortages:')
    for (const s of shortages) console.log(`    ⚠ ${s}`)
  } else {
    console.log('\n  Warehouse stock: OK')
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    if (shortages.length) console.log('  BLOCKED on commit until stock covers lines.')
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
    moment: uaeMomentNow(),
    applicable: true,
    shared: true,
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
      `Agreement note against reported sales (${money(report.sum)} AED).`,
    ].join('\n'),
    positions,
  })

  if (money(demand.sum) !== money(report.sum)) {
    throw new Error(`Sum mismatch: demand ${money(demand.sum)} vs report ${money(report.sum)}`)
  }

  const pdfPath = await exportStockNotePdf(demand.id, demand.name)
  console.log(`\n  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
