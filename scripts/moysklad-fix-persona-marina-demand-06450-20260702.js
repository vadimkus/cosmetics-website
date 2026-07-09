#!/usr/bin/env node

/**
 * Persona Marina demand 06450 — replace lines with user correction (3 lines only).
 *   00145 Problem Control Toner 200ml ×1
 *   00041 Multi Sun Cream SPF40 ×2
 *   54457 Ultra Shield Sun Cream SPF50 ×2
 *
 *   node --import dotenv/config scripts/moysklad-fix-persona-marina-demand-06450-20260702.js
 *   node --import dotenv/config scripts/moysklad-fix-persona-marina-demand-06450-20260702.js --commit
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
const EXPORT_PDF = !process.argv.includes('--no-pdf')

const DEMAND_ID = 'd217daf2-75dd-11f1-0a80-0ecd0037009d' // 06450
const AGENT_ID = 'af21a79a-63cd-11ea-0a80-02b2000e2aeb'
const CONTRACT_ID = '56ca0166-c388-11eb-0a80-093a001d1ee0'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const MARKER = 'Persona Marina 06450 amended 3-line replenishment 2026-07-02'

const TARGET_LINES = [
  ['00145', 1, 'Problem Control Toner 200ml'],
  ['00041', 2, 'Multi Sun Cream SPF40/PA++ 40g'],
  ['54457', 2, 'Ultra Shield Sun Cream SPF50/PA++++ 50g'],
]

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
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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
  return TARGET_LINES.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty, label }
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

async function exportStockNotePdf() {
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
  const res = await fetch(`${API}/entity/demand/${DEMAND_ID}/export`, {
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
    throw new Error(`PDF export ${res.status}: ${await res.text()}`)
  }
  const location = res.headers.get('location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, 'GENOSYS_Persona_Marina_Consignment_Stock_Note_06450.pdf')
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Persona Marina 06450 — replace with 3-line replenishment')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const oldPos = await fetchAll(`/entity/demand/${DEMAND_ID}/positions?expand=assortment`)
  console.log(`  Current: ${demand.name} | ${money(demand.sum)} AED | ${oldPos.length} lines`)

  if ((demand.description || '').includes(MARKER)) {
    console.log('  Already amended — skip')
    return
  }

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  let sumMinor = 0
  console.log('\n  New lines only:')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.label} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)} AED`
    )
  }
  console.log(`  New total: ${money(sumMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  let d = demand
  if (d.applicable) {
    d = await api('PUT', `/entity/demand/${DEMAND_ID}`, { meta: d.meta, applicable: false })
    console.log('  applicable → false')
  }

  for (const p of oldPos) {
    await api('DELETE', `/entity/demand/${DEMAND_ID}/positions/${p.id}`)
  }
  console.log(`  cleared ${oldPos.length} old positions`)

  for (const line of resolved) {
    await api('POST', `/entity/demand/${DEMAND_ID}/positions`, positionPayload(line))
  }

  d = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const updated = await api('PUT', `/entity/demand/${DEMAND_ID}`, {
    meta: d.meta,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_SHIPPED_ID),
    description: [
      demand.description || '',
      MARKER,
      '00145 Problem Control Toner 200ml x1; 00041 Multi Sun SPF40 x2; 54457 Ultra Shield SPF50 x2.',
      'Replaces prior 17-line demand — user correction.',
    ].join('\n'),
  })

  console.log(`\n  Updated: ${updated.name} | ${money(updated.sum)} AED | 3 lines`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)

  if (EXPORT_PDF) {
    const pdf = await exportStockNotePdf()
    console.log(`  Stock PDF: ${pdf.out} (${pdf.bytes} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
