#!/usr/bin/env node

/**
 * Love My Body — consignment replenishment Отгрузка (agreement 27).
 * SPF 40 (00041) ×1
 *
 *   node --import dotenv/config scripts/moysklad-create-love-my-body-spf40-demand-20260705.js
 *   node --import dotenv/config scripts/moysklad-create-love-my-body-spf40-demand-20260705.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

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

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: '9c78fe86-be3b-11f0-0a80-007f0036b570', // LOVE MY BODY LADIES SPA CLUB L.L.C
  contractId: 'aaee7975-be3b-11f0-0a80-173e00383194', // Agreement 27
}

const MARKER = `Love My Body replenishment SPF40 ${uaeToday()}`

const LINES = [['00041', 1, 'Multi Sun Cream SPF40/PA++ 40g']]

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
  const out = path.join(ordersDir, `GENOSYS_Love_My_Body_Consignment_Stock_Note_${demandName}.pdf`)
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

async function printPdf(pdfPath) {
  try {
    execFileSync('lp', [pdfPath], { stdio: 'inherit' })
    console.log('    Sent to printer via lp')
  } catch (e) {
    console.warn('    lp failed, opening PDF:', e.message)
    execFileSync('open', [pdfPath], { stdio: 'inherit' })
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Love My Body — replenishment demand SPF 40 (agreement 27)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${COMMON.agentId}`),
    api('GET', `/entity/contract/${COMMON.contractId}`),
  ])
  console.log(`  Customer: ${agent.name}`)
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
      'LOVE MY BODY LADIES SPA CLUB L.L.C | Agreement 27.',
      'Replenishment: Multi Sun Cream SPF 40 (00041) ×1.',
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
  console.log(`    Saved: ${pdf.out} (${pdf.bytes} bytes)`)
  await printPdf(pdf.out)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
