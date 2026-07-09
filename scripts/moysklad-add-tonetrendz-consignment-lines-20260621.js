#!/usr/bin/env node

/**
 * TONETRENDZ — add consignment lines to demand 06326 (agreement 36) + refresh PDFs.
 *
 *   Shampoo 00052 ×2
 *   Eye cream 00055 ×2
 *   Eye serum 00054 ×2
 *   Hair tonic 00051 ×2
 *   EyeCell kit 00059 ×2
 *
 *   node --import dotenv/config scripts/moysklad-add-tonetrendz-consignment-lines-20260621.js
 *   node --import dotenv/config scripts/moysklad-add-tonetrendz-consignment-lines-20260621.js --commit
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

const DEMAND_ID = '7b63d1d7-63dc-11f1-0a80-0d66001d1a9f' // 06326
const CONTRACT_ID = '7a5e3023-63dc-11f1-0a80-1ba4001ce87b'
const AGENT_ID = '74aa75cb-63db-11f1-0a80-111d001bbe72'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const MARKER = `TONETRENDZ consignment add hair eye lines ${uaeToday()}`

const ADD_LINES = [
  ['00052', 2], // HR³ Matrix Scalp & Hair Shampoo 300ml
  ['00055', 2], // EyeCell Eye Contour Cream 20ml
  ['00054', 2], // EyeCell Eye Contour Serum 10ml
  ['00051', 2], // HR³ Matrix Hair Tonic 70ml
  ['00059', 2], // EyeCell Eye Zone Care Kit (box)
]

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

function resolveAddLines(stock) {
  return ADD_LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code} ${item.name}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
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
  console.log('  TONETRENDZ — add lines to consignment 06326')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  let demand = await api('GET', `/entity/demand/${DEMAND_ID}?expand=agent,contract`)
  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED | applicable=${demand.applicable}`)

  const existing = await loadDemandPositions(DEMAND_ID)
  const existingCodes = new Set(existing.map((p) => p.assortment?.code))
  for (const [code] of ADD_LINES) {
    if (existingCodes.has(code)) {
      throw new Error(`Code ${code} already on ${demand.name} — abort (would duplicate)`)
    }
  }

  const stock = await fetchStockByCode()
  const resolved = resolveAddLines(stock)
  let addMinor = 0
  console.log('\n  Lines to add:')
  for (const line of resolved) {
    addMinor += line.price * line.qty
    console.log(`    ${line.code} ${line.name.slice(0, 52)} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)}`)
  }
  console.log(`  Add total: ${money(addMinor)} AED`)
  console.log(`  New demand total: ~${money(demand.sum + addMinor)} AED`)

  if ((demand.description || '').includes(MARKER)) {
    console.log('\n  Idempotent: marker already present — skipping add.')
    return
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (demand.applicable) {
    demand = await api('PUT', `/entity/demand/${DEMAND_ID}`, { meta: demand.meta, applicable: false })
    console.log('  applicable → false')
  }

  for (const line of resolved) {
    await api('POST', `/entity/demand/${DEMAND_ID}/positions`, positionPayload(line))
    console.log(`  added ${line.code} x${line.qty}`)
  }

  demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const desc = (demand.description || '').trim()
  await api('PUT', `/entity/demand/${DEMAND_ID}`, {
    meta: demand.meta,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_SHIPPED_ID),
    description: [
      desc,
      MARKER,
      'Added: shampoo 00052×2, eye cream 00055×2, eye serum 00054×2, hair tonic 00051×2, EyeCell kit 00059×2.',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const pos = await loadDemandPositions(DEMAND_ID)
  console.log(`\n  Updated: ${demand.name} | ${money(demand.sum)} AED | ${pos.length} lines | ${pos.reduce((s, p) => s + Number(p.quantity), 0)} pcs`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)

  console.log('\n  Exporting consignment stock note PDF…')
  const pdfBuf = await exportStockNotePdf(DEMAND_ID)
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const names = [
    path.join(OUT_DIR, 'Genosys_Consignment_Stock_Note_06326_TONETRENDZ.pdf'),
    path.join(ORDERS_DIR, 'GENOSYS_TONETRENDZ_06326_Consignment_Stock_Note.pdf'),
    path.join(ORDERS_DIR, 'Genosys_Consignment_Stock_Note_06326_TONETRENDZ.pdf'),
  ]
  for (const outPath of names) {
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`  ${outPath} (${pdfBuf.length} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
