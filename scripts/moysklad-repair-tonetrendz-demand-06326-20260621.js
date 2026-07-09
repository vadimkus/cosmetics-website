#!/usr/bin/env node

/**
 * Repair TONETRENDZ consignment demand 06326 — restore full delivered list (29 lines / 10695 AED).
 * User already delivered per consignment stock note; MoySklad doc had reverted to partial 21-line state.
 *
 *   node --import dotenv/config scripts/moysklad-repair-tonetrendz-demand-06326-20260621.js
 *   node --import dotenv/config scripts/moysklad-repair-tonetrendz-demand-06326-20260621.js --commit
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

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const DEMAND_ID = '7b63d1d7-63dc-11f1-0a80-0d66001d1a9f'
const CONTRACT_ID = '7a5e3023-63dc-11f1-0a80-1ba4001ce87b'
const AGENT_ID = '74aa75cb-63db-11f1-0a80-111d001bbe72'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const MARKER = 'TONETRENDZ demand 06326 full delivered list repair 2026-06-21'

/** Full delivered consignment — 29 SKUs, 106 pcs, 10695 AED */
const TARGET_LINES = [
  ['00012', 5],
  ['00021', 3],
  ['00022', 3],
  ['00031', 3],
  ['00040', 2],
  ['00041', 3],
  ['00051', 2],
  ['00052', 2],
  ['00053', 2],
  ['00054', 2],
  ['00055', 2],
  ['00059', 2],
  ['00063', 20],
  ['00122', 2],
  ['00129', 2],
  ['00140', 20],
  ['00143', 2],
  ['00144', 4],
  ['00188', 4],
  ['00189', 2],
  ['00190', 2],
  ['00194', 2],
  ['00195', 2],
  ['54457', 2],
  ['54458', 2],
  ['54461', 2],
  ['54464', 3],
  ['54465', 2],
  ['54467', 2],
]

const EXPECTED_LINES = TARGET_LINES.length
const EXPECTED_QTY = TARGET_LINES.reduce((s, [, q]) => s + q, 0)
const EXPECTED_SUM_MINOR = 1069500

const OUT_DIR = path.join(
  os.homedir(),
  'Desktop',
  'Drive',
  'Genosys',
  'Contract_Customers',
  'Toner_Trends'
)
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
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
  return (minor / 100).toFixed(2)
}

async function loadDemandPositions(demandId) {
  return fetchAll(`/entity/demand/${demandId}/positions?expand=assortment`)
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
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function resolveLines(stock) {
  const resolved = []
  let sumMinor = 0
  let totalQty = 0
  for (const [code, qty] of TARGET_LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    sumMinor += item.price * qty
    totalQty += qty
    resolved.push({ ...item, qty })
  }
  return { resolved, sumMinor, totalQty }
}

function positionPayload(line) {
  return {
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }
}

async function verifyDemand(demandId, resolved) {
  const demand = await api('GET', `/entity/demand/${demandId}`)
  const pos = await loadDemandPositions(demandId)
  const byCode = new Map(resolved.map((l) => [l.code, l]))
  if (pos.length !== EXPECTED_LINES) throw new Error(`Verify: ${pos.length} lines ≠ ${EXPECTED_LINES}`)
  for (const p of pos) {
    const code = p.assortment?.code
    const exp = byCode.get(code)
    if (!exp || exp.qty !== Number(p.quantity) || exp.price !== p.price) {
      throw new Error(`Verify mismatch on ${code}`)
    }
  }
  return demand
}

async function syncDemand(resolved) {
  let demand = await api('GET', `/entity/demand/${DEMAND_ID}?expand=agent,contract`)

  if (demand.applicable) {
    demand = await api('PUT', `/entity/demand/${DEMAND_ID}`, { meta: demand.meta, applicable: false })
    console.log('  applicable → false')
  }

  const rows = await loadDemandPositions(DEMAND_ID)
  for (const p of rows) {
    await api('DELETE', `/entity/demand/${DEMAND_ID}/positions/${p.id}`)
  }
  console.log(`  cleared ${rows.length} old positions`)

  for (const line of resolved) {
    await api('POST', `/entity/demand/${DEMAND_ID}/positions`, positionPayload(line))
  }
  console.log(`  posted ${resolved.length} positions`)

  demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  await api('PUT', `/entity/demand/${DEMAND_ID}`, {
    meta: demand.meta,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_SHIPPED_ID),
    description: [
      MARKER,
      'Full retail consignment delivered to TONETRENDZ under agreement 36.',
      '29 lines / 106 pcs / 10695 AED — opening + camel/hyaluron/peptide + hair/eye testers.',
      'Deliver: JVC Binghatti Azure. Already physically delivered.',
    ].join('\n'),
  })
}

async function exportStockNotePdf(demandId) {
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
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
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
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  TONETRENDZ — repair demand 06326 (full delivered list)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Target: ${EXPECTED_LINES} lines / ${EXPECTED_QTY} pcs / ${money(EXPECTED_SUM_MINOR)} AED`)

  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const pos = await loadDemandPositions(DEMAND_ID)
  console.log(`\n  Current: ${demand.name} | ${money(demand.sum)} AED | ${pos.length} lines | ${pos.reduce((s, p) => s + Number(p.quantity), 0)} pcs`)

  if ((demand.description || '').includes(MARKER)) {
    const v = await verifyDemand(DEMAND_ID, resolveLines(await fetchStockByCode()).resolved)
    console.log(`\n  Already repaired: ${v.name} | ${money(v.sum)} AED`)
    return
  }

  const stock = await fetchStockByCode()
  const { resolved, sumMinor, totalQty } = resolveLines(stock)

  console.log('\n  Target lines:')
  for (const line of resolved) {
    console.log(`    ${line.code} x${line.qty} @ ${money(line.price)}`)
  }
  console.log(`\n  Resolved sum: ${money(sumMinor)} AED | ${totalQty} pcs`)

  if (Math.abs(sumMinor - EXPECTED_SUM_MINOR) > 100) {
    console.warn(`  ⚠ Sum differs from expected ${money(EXPECTED_SUM_MINOR)} by ${money(Math.abs(sumMinor - EXPECTED_SUM_MINOR))}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await syncDemand(resolved)
  const final = await verifyDemand(DEMAND_ID, resolved)
  console.log(`\n  Done: ${final.name} | ${money(final.sum)} AED | ${EXPECTED_LINES} lines | ${EXPECTED_QTY} pcs`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)

  console.log('\n  Exporting consignment stock note PDF…')
  const pdfBuf = await exportStockNotePdf(DEMAND_ID)
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const paths = [
    path.join(OUT_DIR, 'Genosys_Consignment_Stock_Note_06326_TONETRENDZ.pdf'),
    path.join(ORDERS_DIR, 'GENOSYS_TONETRENDZ_06326_Consignment_Stock_Note.pdf'),
    path.join(ORDERS_DIR, 'Genosys_Consignment_Stock_Note_06326_TONETRENDZ.pdf'),
  ]
  for (const p of paths) {
    fs.writeFileSync(p, pdfBuf)
    console.log(`  ${p} (${pdfBuf.length} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
