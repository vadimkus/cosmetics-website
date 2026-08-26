#!/usr/bin/env node

/**
 * Ilmira Hairulina — consignment replenishment into agreement 00003.
 *   00140 Sea Algae mask ×10 @ 18
 *   00063 Collagen mask ×10 @ 18
 *   00012 Peptide Gel Mask ×5 @ 38
 * Demand only. Stock note PDF → ~/Desktop/orders/ + landscape print.
 *
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-replenishment-20260817.js
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-replenishment-20260817.js --commit
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
const { printPdfLandscape } = require('./lib/moysklad-print-pdf')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'a7c023a6-4681-11ea-0a80-067800209158'
const CONTRACT_ID = '4c3b2437-80e3-11ea-0a80-05d4001412ae'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `ILMIRA-HAIRULINA-REPLENISH-MASKS-${uaeToday()}`
const EXPECTED_SUM_MINOR = 55000

/** [code, qty, clinicAed, label] */
const LINES = [
  ['00140', 10, 18, 'Soothing Bomb Sea Algae Mask 25g'],
  ['00063', 10, 18, 'Intensive Repair Collagen Mask 23g'],
  ['00012', 5, 38, 'Peptide Gel Mask 39g'],
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
  if (dup) throw new Error(`Duplicate demand today: ${dup.name}`)
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
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, `GENOSYS_Ilmira_Hairulina_Consignment_Stock_Note_${demandName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Ilmira Hairulina — mask replenishment into agreement 00003')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  const resolved = []
  let sumMinor = 0
  for (const [code, qty, unitAed, label] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, avail ${item.available}`)
    }
    const priceMinor = Math.round(unitAed * 100)
    sumMinor += priceMinor * qty
    resolved.push({ ...item, qty, priceMinor, label })
    console.log(
      `    ${code} ${label} x${qty} @ ${unitAed} = ${money(priceMinor * qty)} (avail ${item.available})`,
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
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
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    description: [
      MARKER,
      'Ilmira Hairulina | Agreement 00003.',
      'Replenishment after report 01436: sea algae x10, collagen x10, peptide x5.',
      'Consignment demand. No SO / invoice / payment.',
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.priceMinor,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  if ((demand.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Demand sum ${money(demand.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (demand.customerOrder) throw new Error('Demand has customerOrder — should be agreement only')

  const pdf = await exportStockNotePdf(demand.id, demand.name)
  printPdfLandscape(pdf)
  console.log(`\n  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  PDF: ${pdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
