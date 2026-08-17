#!/usr/bin/env node

/**
 * Persona Nakheel Mall — consignment replenishment + stock note.
 *
 *   54467 Skin Reboot PDRN mask Pack (30 sheets) ×7
 *
 *   node --import dotenv/config scripts/moysklad-create-persona-nakheel-pdrn-mask-demand-20260722.js
 *   node --import dotenv/config scripts/moysklad-create-persona-nakheel-pdrn-mask-demand-20260722.js --commit
 *   node --import dotenv/config scripts/moysklad-create-persona-nakheel-pdrn-mask-demand-20260722.js --commit --print
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { printPdfLandscape } = require('./lib/moysklad-print-pdf')

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
const PRINT = process.argv.includes('--print')

const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: 'fd850df7-1cff-11ef-0a80-082e0017fa70',
  contractId: '393d4076-1d00-11ef-0a80-028700179a4e',
}

const MARKER = `Persona Nakheel Mall PDRN mask replenishment ${uaeToday()}`
const LINES = [['54467', 7, 'Skin Reboot PDRN mask Pack (30 sheets)']]
/** Clinic/оптовая 200 × 7 */
const EXPECTED_SUM_MINOR = 140000

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
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

const money = (minor) => ((minor || 0) / 100).toFixed(2)

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
  if (dup) throw new Error(`Duplicate demand today: ${dup.name}`)
}

function resolveLines(stock) {
  return LINES.map(([code, qty, label]) => {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    if (!row.price) throw new Error(`No salePrice for ${code}`)
    if (row.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, avail ${row.available}`)
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
  const out = path.join(
    ordersDir,
    `GENOSYS_Persona_Nakheel_Mall_Consignment_Stock_Note_${demandName}.pdf`
  )
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Persona Nakheel Mall — PDRN mask consignment note (00078)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Location: Persona Nakheel Mall, Palm Jumeirah`)
  console.log(`  Contract: ${contract.name}`)

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)

  console.log('\n  Lines:')
  let totalMinor = 0
  for (const line of resolved) {
    const lineMinor = line.qty * line.price
    totalMinor += lineMinor
    console.log(
      `    ${line.code} x${line.qty} @ ${money(line.price)} = ${money(lineMinor)}  ${line.label}`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED`)

  if (Math.abs(totalMinor - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Total mismatch: ${money(totalMinor)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

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
    state: stateHref('demand', '50d70717-4582-11ea-0a80-05e3001273a2'),
    description: [
      MARKER,
      'First Person Ladies Salon LLC (Palm Jumeirah) / Persona Nakheel Mall | Agreement 00078.',
      'Skin Reboot PDRN mask Pack 54467 ×7.',
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

  console.log('\n  Exporting consignment stock note PDF...')
  const pdf = await exportStockNotePdf(demand.id, demand.name)
  console.log(`  PDF: ${pdf.out} (${pdf.bytes} bytes)`)

  if (PRINT) printPdfLandscape(pdf.out)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
