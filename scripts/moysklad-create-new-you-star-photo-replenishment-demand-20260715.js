#!/usr/bin/env node

/**
 * NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C — consignment replenishment Отгрузка (contract 37).
 * 69 units / 40 SKUs from photo inventory (Contract_Customers/New_YOU_STAR/order/).
 *
 *   node --import dotenv/config scripts/moysklad-create-new-you-star-photo-replenishment-demand-20260715.js
 *   node --import dotenv/config scripts/moysklad-create-new-you-star-photo-replenishment-demand-20260715.js --commit
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
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: '69e1db3e-7fa4-11f1-0a80-0283002585b0', // NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C
  contractId: '6a2aabf3-7fa4-11f1-0a80-0283002585c9', // Agreement 37
}

const CUSTOMER_STREET =
  'The Mall, Shop 21, Umm Suqeim Third, Jumeirah St, Dubai'

const MARKER = `NEW-YOU-STAR-PHOTO-REPLENISHMENT-${uaeToday()}`

/** [code, qty, label] — 69 pcs / 40 lines */
const LINES = [
  ['00191', 3, 'Multi Functional Anti-Wrinkle Serum 30ml'],
  ['00029', 2, 'Problem Control Serum 30ml'],
  ['00030', 2, 'All For Sensitive Serum 30ml'],
  ['00195', 2, 'Moisture Replenishing Hyaluron Serum 30ml'],
  ['00194', 2, 'Multi Vita Radiance Serum 30ml'],
  ['54484', 2, 'Cerabarrier Biome Gel Cleanser 200ml'],
  ['00021', 2, 'Snow O₂ Cleanser 180ml'],
  ['54458', 2, 'Moisture Replenishing Hyaluron Cream 50g'],
  ['00035', 2, 'Intensive Problem Control Cream 50g'],
  ['00190', 2, 'Multi Functional Anti-Wrinkle Cream 50g'],
  ['54457', 2, 'Ultra Shield Sun Cream SPF50+ 50g'],
  ['00122', 2, 'Multi Vita Radiance Cream 50g'],
  ['00041', 4, 'Multi Sun Cream SPF40 40g'],
  ['00189', 2, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00129', 2, 'EPI Turnover Boosting Peeling Gel 100g'],
  ['00052', 2, 'HR³ Matrix Medi Scalp Shampoo 300ml'],
  ['00051', 2, 'HR³ Matrix Hair Tonic 70ml'],
  ['00059', 1, 'EyeCell Eye Zone Care Kit (box)'],
  ['00054', 2, 'EyeCell Eye Contour Serum 10ml'],
  ['00055', 2, 'EyeCell Eye Contour Cream 20ml'],
  ['00053', 2, 'EyeCell Eye Peptide Gel Patch (box)'],
  ['00038', 2, 'Soothing Repair Post Cream 20g'],
  ['54465', 2, 'Soothing Repair Post Cream 100g'],
  ['54475', 2, 'Bio-Meso PDRN Homecare Ampoule 5000'],
  ['00145', 2, 'Problem Control Toner 200ml'],
  ['00044', 2, 'ND Cell Anti-Wrinkle Cream 50ml'],
  ['00037', 2, 'Skin Barrier Protecting Cream 100g'],
  ['00188', 4, 'Microbiome Energy Infusing Mist 80ml'],
  ['00144', 3, 'Cushion #2 Beige'],
  ['54464', 2, 'Cushion #3 Camel'],
  ['00143', 2, 'Cushion #1 Ivory'],
  ['54472', 2, 'Revita Glow BB Cream #01 Bright 50g'],
  ['54473', 2, 'Revita Glow BB Cream #02 Natural 50g'],
  ['00022', 2, 'Snow Booster Toner 200ml'],
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
      signal: AbortSignal.timeout(60000),
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    const retryable =
      e.cause?.code === 'ECONNRESET' ||
      e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      e.name === 'TimeoutError' ||
      e.message === 'fetch failed'
    if (attempt < 8 && retryable) {
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

function demandStateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/demand/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

const money = (minor) => (minor / 100).toFixed(2)

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
    `agent=${API}/entity/counterparty/${COMMON.agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate demand today: ${dup.name} (${dup.id})`)
}

function resolveLines(stock) {
  return LINES.map(([code, qty, label]) => {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    if (!row.price) throw new Error(`No salePrice for ${code}`)
    if (row.available < qty) {
      throw new Error(`Insufficient stock ${code} ${label}: need ${qty}, avail ${row.available}`)
    }
    return { ...row, qty, label }
  })
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
  if (res.status !== 302 && res.status !== 303) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const pdfRes = await fetch(res.headers.get('location'))
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const out = path.join(ordersDir, `GENOSYS_NEW_YOU_STAR_${demandName}_Consignment_Stock_Note.pdf`)
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  NEW YOU STAR — photo inventory replenishment (contract 37)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)

  console.log('\n  Lines:')
  let totalMinor = 0
  let totalQty = 0
  for (const line of resolved) {
    const lineMinor = line.price * line.qty
    totalMinor += lineMinor
    totalQty += line.qty
    console.log(
      `    ${line.code} x${line.qty} @ ${money(line.price)} → ${money(lineMinor)} | ${line.label}`
    )
  }
  console.log(`\n  Total: ${money(totalMinor)} AED | ${totalQty} units | ${resolved.length} SKUs`)

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
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    store: href('store', COMMON.storeId),
    state: demandStateHref(DEMAND_STATE_SHIPPED_ID),
    shipmentAddressFull: {
      country: href('country', COUNTRY_UAE_ID),
      city: 'Dubai',
      street: CUSTOMER_STREET,
    },
    description: [
      MARKER,
      'Photo inventory replenishment — 69 units / 40 SKUs.',
      LINES.map(([c, q]) => `${c}x${q}`).join(', '),
      `Agreement ${contract.name}. Ship to: ${CUSTOMER_STREET}.`,
    ].join(' | '),
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
  console.log(`  Contract: https://online.moysklad.ru/app/#contract/edit?id=${COMMON.contractId}`)

  const { out, bytes } = await exportStockNotePdf(demand.id, demand.name)
  console.log(`  Stock note PDF: ${out} (${bytes} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
