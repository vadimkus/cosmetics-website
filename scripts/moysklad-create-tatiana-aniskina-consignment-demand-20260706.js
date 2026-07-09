#!/usr/bin/env node

/**
 * Tatiana Aniskina Nail Master — consignment replenishment demand (agreement 00025).
 * Same as commission report 01401 sold lines + PDRN home + CERABARRIER x2.
 *
 *   node --import dotenv/config scripts/moysklad-create-tatiana-aniskina-consignment-demand-20260706.js
 *   node --import dotenv/config scripts/moysklad-create-tatiana-aniskina-consignment-demand-20260706.js --commit
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
const EXPORT_PDF = !process.argv.includes('--no-pdf')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = '603f398e-bd3d-11eb-0a80-00570009cb13'
const CONTRACT_ID = 'f68e2d8d-c3c5-11eb-0a80-05f500276179' // 00025
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const REPORT_01401_ID = '357f9cab-7929-11f1-0a80-1a69007c55f0'

const MARKER = `Tatiana Aniskina consignment demand ${uaeToday()}`
const EXPECTED_SUM_MINOR = 105000 // 1,050 AED
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

/** [code, qty, label] */
const LINES = [
  ['00191', 1, 'Multi Functional Anti-Wrinkle Serum 30ml'],
  ['54458', 1, 'Moisture Replenishing Hyaluron Cream 50g'],
  ['00123', 1, 'Multi Vita Radiance Cream 230g'],
  ['54475', 1, 'BIO-MESO PDRN Homecare Ampoule 5000'],
  ['54484', 2, 'CERABARRIER Biome Gel Cleanser 200ml'],
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

function stateHref(type, id) {
  return { meta: { href: `${API}/entity/${type}/metadata/states/${id}`, type: 'state', mediaType: 'application/json' } }
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
      price: Number(row.salePrice || 0),
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const filter = encodeURIComponent(`agent=${API}/entity/counterparty/${AGENT_ID}`)
  const data = await api('GET', `/entity/demand?filter=${filter}&limit=100&order=moment,desc`)
  for (const d of data.rows || []) {
    const full = await api('GET', `/entity/demand/${d.id}`)
    if (full.description?.includes(MARKER)) {
      throw new Error(`Duplicate demand ${full.name} — already created today`)
    }
  }
}

async function exportPdf(entityType, entityId, templateId, outPath) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/${entityType}/metadata/customtemplate/${templateId}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/${entityType}/${entityId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`PDF export ${res.status}: ${t.slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('PDF export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
  return { out: outPath, bytes: buf.length }
}

async function main() {
  console.log('====================================================================')
  console.log('  Tatiana Aniskina — consignment replenishment demand (agreement 00025)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  const stock = await fetchStockByCode()
  const resolved = LINES.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code} (${label})`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty, label }
  })

  let totalMinor = 0
  let totalQty = 0
  console.log('\n  Lines (clinic salePrice):')
  for (const line of resolved) {
    totalMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.label} x${line.qty} @ ${money(line.price)} = ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total: ${money(totalMinor)} AED | ${totalQty} pcs | ${resolved.length} lines`)

  if (Math.abs(totalMinor - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Sum mismatch: ${money(totalMinor)} vs ${money(EXPECTED_SUM_MINOR)}`)
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
      'Replenishment after commission report 01401 + extra stock.',
      'Multi Functional Anti-Wrinkle Serum 00191 x1, 54458 x1, 00123 x1 (sold), 54475 PDRN home x1, 54484 CERABARRIER 200ml x2.',
      `Report 01401: ${REPORT_01401_ID}`,
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  console.log(`\n  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  if (EXPORT_PDF) {
    const pdf = await exportPdf(
      'demand',
      demand.id,
      STOCK_NOTE_TEMPLATE_ID,
      path.join(ORDERS_DIR, `GENOSYS_Tatiana_Aniskina_Consignment_Stock_Note_${demand.name}.pdf`)
    )
    console.log(`  PDF: ${pdf.out} (${pdf.bytes} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
