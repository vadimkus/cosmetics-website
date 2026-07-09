#!/usr/bin/env node

/**
 * TONETRENDZ — consignment replenishment Отгрузка (agreement 36).
 * Professional consumables per delivery photo 2026-07-01:
 *
 *   54465 SRP Post Cream 100g ×1
 *   00183 PCT Toner 500ml ×1
 *   00025 SBT Snow Booster 1000ml ×1
 *   00024 SOC Snow O₂ 500ml ×1
 *   54460 MHC Hyaluron Cream 250g ×1
 *   00034 MFC Anti-Wrinkle Cream 250g ×1
 *   00123 MVC Radiance Cream 230g ×1
 *   00036 PCC Problem Control Cream 250g ×1
 *   00032 HSC Hydro Soothing Cream 250g ×1
 *   (pump dispensers — not in MoySklad shipment)
 *
 *   PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-pro-consignment-demand-20260701.js
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-pro-consignment-demand-20260701.js --commit
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
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const AGENT_ID = '74aa75cb-63db-11f1-0a80-111d001bbe72'
const CONTRACT_ID = '7a5e3023-63dc-11f1-0a80-1ba4001ce87b' // Agreement 36
const STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'

const MARKER = `TONETRENDZ pro consignment replenishment ${uaeToday()}`
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

/** [code, qty, label] */
const PRODUCT_LINES = [
  ['54465', 1, 'Soothing Repair Post Cream 100g (SRP)'],
  ['00183', 1, 'Problem Control Toner 500ml (PCT)'],
  ['00025', 1, 'Snow Booster Toner 1000ml (SBT)'],
  ['00024', 1, 'Snow O₂ Cleanser 500ml (SOC)'],
  ['54460', 1, 'Moisture Replenishing Hyaluron Cream 250g (MHC)'],
  ['00034', 1, 'Multi Functional Anti-Wrinkle Cream 250g (MFC)'],
  ['00123', 1, 'Multi-Vita Radiance Cream 230g (MVC)'],
  ['00036', 1, 'Intensive Problem Control Cream 250g (PCC)'],
  ['00032', 1, 'Intensive Hydro Soothing Cream 250g (HSC)'],
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
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 6 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 2000 * attempt))
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

function resolveProductLines(stock) {
  return PRODUCT_LINES.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code} (${label}): need ${qty}, have ${item.available}`)
    }
    return { ...item, qty, label }
  })
}

function buildShipmentAddress(agent) {
  const street =
    agent.actualAddress ||
    agent.actualAddressFull?.addInfo ||
    'JVC, Binghatti Azure, commercial unit, Dubai'
  return {
    country: { meta: { href: `${API}/entity/country/${COUNTRY_UAE_ID}`, type: 'country', mediaType: 'application/json' } },
    city: 'Dubai',
    street,
  }
}

async function ensureNoDuplicateDemand() {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate demand: ${dup.name} (${dup.id})`)
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
  console.log('  TONETRENDZ — pro consignment Отгрузка (agreement 36)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  const stock = await fetchStockByCode()
  const resolved = resolveProductLines(stock)

  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Shipment lines:')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 52)} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | ${resolved.length} lines`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicateDemand()

  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_SHIPPED_ID),
    shipmentAddressFull: buildShipmentAddress(agent),
    description: [
      MARKER,
      'Professional consignment replenishment — photo delivery 2026-07-01.',
      'SRP/PCT/SBT/SOC + 5 pro creams 250g/230g (pumps excluded).',
      `Agreement ${contract.name}. JVC Binghatti Azure.`,
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  console.log(`\n  Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  console.log('  Exporting Consignment Stock Note PDF…')
  const pdfBuf = await exportStockNotePdf(demand.id)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(demand.name).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_TONETRENDZ_${safe}_Consignment_Stock_Note.pdf`)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF: ${outPath} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
