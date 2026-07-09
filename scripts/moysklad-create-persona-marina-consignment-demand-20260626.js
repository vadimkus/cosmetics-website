#!/usr/bin/env node

/**
 * First Person Ladies Salon (Marina) — consignment replenishment + stock note PDF.
 *
 *   Snow O₂ Cleanser 180ml (00021) ×2
 *   HR³ Matrix Hair Tonic 70ml (00051) ×2
 *   HR³ Matrix Shampoo 300ml (00052) ×2
 *   EyeCell Eye Contour Cream 20ml (00055) ×1
 *   Skin Reboot PDRN mask Pack (54467) ×2
 *
 *   Agreement 00024 | PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-persona-marina-consignment-demand-20260626.js
 *   node --import dotenv/config scripts/moysklad-create-persona-marina-consignment-demand-20260626.js --commit
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

const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'af21a79a-63cd-11ea-0a80-02b2000e2aeb' // First Person Ladies Salon (Marina)
const CONTRACT_ID = '56ca0166-c388-11eb-0a80-093a001d1ee0' // Contract 00024
const STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'

const MARKER = `First Person Marina replenishment ${uaeToday()}`

const LINES = [
  ['00021', 2], // Snow O₂ Cleanser 180ml
  ['00051', 2], // HR³ Matrix Hair Tonic 70ml
  ['00052', 2], // HR³ Matrix Shampoo 300ml
  ['00055', 1], // EyeCell Eye Contour Cream 20ml
  ['54467', 2], // Skin Reboot PDRN mask Pack
]

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

async function api(method, pathStr, body) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
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
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
      return text ? JSON.parse(text) : null
    } catch (e) {
      if (attempt === 5) throw e
      await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
    }
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
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate: demand ${dup.name} (${dup.id})`)
}

function resolveLines(stock) {
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code} ${item.name}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

function positionsFromResolved(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))
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

function stockNotePath(demandName) {
  const safe = String(demandName || 'demand').replace(/[^\w.-]+/g, '_')
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  return path.join(ORDERS_DIR, `GENOSYS_First_Person_Marina_${safe}_Consignment_Stock_Note.pdf`)
}

async function main() {
  console.log('====================================================================')
  console.log('  First Person Marina — consignment replenishment + PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  PDF folder: ${ORDERS_DIR}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  let sumMinor = 0
  console.log('\n  Lines:')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 52)} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${resolved.reduce((s, l) => s + l.qty, 0)} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentNow(),
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
      'First Person Ladies Salon (Marina) | Contract 00024.',
      '00021 x2, 00051 x2, 00052 x2, 00055 x1, 54467 x2 @ clinic list.',
    ].join('\n'),
    positions: positionsFromResolved(resolved),
  })
  console.log(`\n  Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  console.log('  Exporting Consignment Stock Note PDF…')
  const pdfBuf = await exportStockNotePdf(demand.id)
  const outPath = stockNotePath(demand.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  Saved: ${outPath} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
