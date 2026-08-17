#!/usr/bin/env node

/**
 * Serene Skin Beauty — consignment replenishment demand (agreement 00060).
 * Skip Revita (already residual Bright×3 + Natural×3 on books).
 *
 *   00053 Eye patches ×2 (sold)
 *   00188 Mist 80ml ×2 (sold)
 *   54484 Cerabarrier 200ml ×2
 *   54475 Meso PDRN 5000 ×2
 *
 *   node --import dotenv/config scripts/moysklad-create-serene-consignment-replenish-demand-20260727.js
 *   node --import dotenv/config scripts/moysklad-create-serene-consignment-replenish-demand-20260727.js --commit
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
  agentId: '993395aa-8da2-11ec-0a80-006b0038cd99',
  contractId: 'dc5c469a-d943-11ed-0a80-05bd0013eb27', // 00060
}

const MARKER = `SERENE-REPLENISH-PATCHES-MIST-CERABARRIER-PDRN-${uaeToday()}`

/** [code, qty, label] */
const LINES = [
  ['00053', 2, 'Eye Peptide Gel Patch (box) — sold'],
  ['00188', 2, 'Microbiome Mist 80ml — sold'],
  ['54484', 2, 'Cerabarrier Biome Gel Cleanser 200ml'],
  ['54475', 2, 'BIO-MESO PDRN Homecare Ampoule 5000'],
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
  const out = path.join(ordersDir, `GENOSYS_Serene_Skin_Consignment_Stock_Note_${demandName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Serene Skin — consignment replenish (no Revita)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${COMMON.agentId}`),
    api('GET', `/entity/contract/${COMMON.contractId}`),
    fetchStockByCode(),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)
  console.log('  Skip Revita — residual Bright×3 + Natural×3 already on books')

  const resolved = resolveLines(stock)
  let totalMinor = 0
  console.log('\n  Lines:')
  for (const line of resolved) {
    const lineMinor = line.price * line.qty
    totalMinor += lineMinor
    console.log(
      `    ${line.code} x${line.qty} @ ${money(line.price)} → ${money(lineMinor)} | ${line.label}`,
    )
  }
  console.log(`\n  Total: ${money(totalMinor)} AED | ${resolved.length} SKUs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const street =
    agent.actualAddressFull?.street ||
    agent.actualAddress ||
    'Dubai'

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
      street: typeof street === 'string' ? street : 'Dubai',
    },
    description: [
      MARKER,
      'Consignment replenish — patches x2 + mist x2 (sold) + Cerabarrier 200 x2 + Meso PDRN 5000 x2.',
      'Revita skipped (already on consignment). Agreement 00060.',
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

  const pdfPath = await exportStockNotePdf(demand.id, demand.name)
  console.log(`  Stock note PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
