#!/usr/bin/env node

/**
 * Abeer Mekki — consignment shipment (отгрузка) into agreement 31 + stock note PDF.
 *
 *   54484 CERABARRIER Biome Gel Cleanser 200ml ×5
 *   54485 CERABARRIER Biome Gel Cleanser 600ml ×4
 *   00022 Snow Booster Toner 200ml ×5
 *   00191 Multi Functional Anti-Wrinkle Serum 30ml ×5
 *   00030 All For Sensitive Serum 30ml ×5
 *   00194 Multi Vita Radiance Serum 30ml ×5
 *   00041 Multi Sun Cream SPF40 40g ×10
 *   54457 Ultra Shield Sun Cream SPF50 50g ×5
 *   00038 Soothing Repair Post Cream 20g ×10
 *   00037 Skin Barrier Protecting Cream 100g ×5
 *   54475 BIO-MESO PDRN Homecare Ampoule 5000 ×6
 *   54470 BIO-MESO PDRN Expert Ampoule 60000 ×5
 *   54471 HR3 Matrix Scalp Brush ×5
 *
 * Clinic list (salePrice), no discount on placement — −10% at commission settlement.
 *
 *   node --import dotenv/config scripts/moysklad-create-abeer-mekki-consignment-shipment-20260722.js
 *   node --import dotenv/config scripts/moysklad-create-abeer-mekki-consignment-shipment-20260722.js --commit
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
const AGENT_ID = '39a7af2b-f5d0-11f0-0a80-108500063cb5' // ABEER MEKKI BEAUTY LADIES CENTER
const CONTRACT_ID = 'a5ab62b9-f5d1-11f0-0a80-1085000693a6' // Contract 31 (Commission)
const STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'

const MARKER = `Abeer Mekki consignment shipment cerabarrier serums sun pdrn brush ${uaeToday()}`

/** [code, qty, label] */
const LINES = [
  ['54484', 5, 'CERABARRIER Biome Gel Cleanser 200ml'],
  ['54485', 4, 'CERABARRIER Biome Gel Cleanser 600ml'],
  ['00022', 5, 'Snow Booster Toner 200ml'],
  ['00191', 5, 'Multi Functional Anti-Wrinkle Serum 30ml'],
  ['00030', 5, 'All For Sensitive Serum 30ml'],
  ['00194', 5, 'Multi Vita Radiance Serum 30ml'],
  ['00041', 10, 'Multi Sun Cream SPF40 40g'],
  ['54457', 5, 'Ultra Shield Sun Cream SPF50 50g'],
  ['00038', 10, 'Soothing Repair Post Cream 20g'],
  ['00037', 5, 'Skin Barrier Protecting Cream 100g'],
  ['54475', 6, 'BIO-MESO PDRN Homecare Ampoule 5000'],
  ['54470', 5, 'BIO-MESO PDRN Expert Ampoule 60000'],
  ['54471', 5, 'HR3 Matrix Scalp Brush'],
]

/** Expected at clinic list: 11,660 AED */
const EXPECTED_SUM_MINOR = 1166000

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
  return LINES.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code} ${item.name}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty, label }
  })
}

function buildShipmentAddress(agent) {
  const street = agent.actualAddress || agent.actualAddressFull?.addInfo || 'Al Ain'
  return {
    country: {
      meta: {
        href: `${API}/entity/country/${COUNTRY_UAE_ID}`,
        type: 'country',
        mediaType: 'application/json',
      },
    },
    city: 'Al Ain',
    street,
  }
}

async function ensureNoDuplicateDemand(agentId) {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
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
  console.log('  Abeer Mekki — consignment shipment (contract 31)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const contract = await api('GET', `/entity/contract/${CONTRACT_ID}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name} (${contract.contractType})`)

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Shipment lines (clinic list, VAT incl.):')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.label} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)} (avail ${line.available})`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | ${resolved.length} lines`)

  if (Math.abs(sumMinor - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Total mismatch: ${money(sumMinor)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicateDemand(agent.id)

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
      'Consignment shipment into agreement 31 — goods placed on consignment (clinic list, no discount).',
      '−10% partner discount applied at commission-report settlement when sold.',
      'CERABARRIER 200/600, snow booster, serums, SPF40/50, postcream, skin barrier, PDRN 5000/60000, scalp brush.',
      'Buyer: ABEER MEKKI BEAUTY LADIES CENTER - L.L.C - S.P.C | +971556717564 | Al Ain.',
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
  const outPath = path.join(ORDERS_DIR, `GENOSYS_ABEER_MEKKI_${safe}_Consignment_Stock_Note.pdf`)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF: ${outPath} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
