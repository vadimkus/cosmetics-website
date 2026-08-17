#!/usr/bin/env node

/**
 * CEIA CLINIC L.L.C — commission consignment agreement + opening demand (no SO/invoice).
 * Stock note PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-ceia-clinic-consignment-opening-20260731.js
 *   node --import dotenv/config scripts/moysklad-create-ceia-clinic-consignment-opening-20260731.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const AGENT_ID = 'd7af76af-8cc5-11f1-0a80-08f4001604b7' // CEIA CLINIC L.L.C
const CONTRACT_STATE_DEFERRED_ID = 'b5d800c6-80df-11ea-0a80-004a001360f2'
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `CEIA-CLINIC-CONSIGNMENT-OPENING-${uaeToday()}`
const EXPECTED_SUM_MINOR = 959500 // 9,595.00 AED clinic list
const EXPECTED_UNITS = 80

/** [code, qty, label] — clinic list prices from stock salePrice */
const LINES = [
  // Cleansers / mist / toner ×3
  ['00021', 3, 'Snow O₂ Cleanser 180ml'],
  ['00188', 3, 'Microbiome Energy Infusing Mist 80ml'],
  ['54484', 3, 'CERABARRIER Biome Gel Cleanser 200ml'],
  ['00022', 3, 'Snow Booster Toner 200ml'],
  // Creams / BB / peel ×2
  ['00031', 2, 'Intensive Hydro Soothing Cream 50g'],
  ['00035', 2, 'Intensive Problem Control Cream 50g'],
  ['00040', 2, 'Intensive Blemish Balm Cream 50g'],
  ['54472', 2, 'Revita Glow BB Cream #01 Bright 50g'],
  ['54473', 2, 'Revita Glow BB Cream #02 Natural 50g'],
  ['00122', 2, 'Multi-Vita Radiance Cream 50g'],
  ['00190', 2, 'Multi Functional Anti-Wrinkle Cream 50g'],
  ['54458', 2, 'Moisture Replenishing Hyaluron Cream 50g'],
  ['00037', 2, 'Skin Barrier Protecting Cream 100g'],
  ['00189', 2, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00129', 2, 'EPI Turnover Boosting Peeling Gel 100g'],
  // Serums ×2
  ['00194', 2, 'Multi Vita Radiance Serum 30ml'],
  ['00029', 2, 'Problem Control Serum 30ml'],
  ['00195', 2, 'Moisture Replenishing Hyaluron Serum 30ml'],
  ['00191', 2, 'Multi Functional Anti-Wrinkle Serum 30ml'],
  ['00030', 2, 'All For Sensitive Serum 30ml'],
  // Masks
  ['00140', 10, 'Soothing Bomb Sea Algae Mask (green)'],
  ['00063', 10, 'Intensive Repair Collagen Mask'],
  // Cushions ×2
  ['00144', 2, 'BB Cushion #2 Beige'],
  ['00143', 2, 'BB Cushion #1 Ivory'],
  ['54464', 2, 'BB Cushion #3 Camel'],
  // Eyes / hair
  ['00053', 2, 'EyeCell Eye Peptide Gel Patch (box)'],
  ['00054', 2, 'EyeCell Eye Contour Serum 10ml'],
  ['00055', 2, 'EyeCell Eye Contour Cream 20ml'],
  ['00052', 2, 'HR³ Matrix Scalp & Hair Shampoo 300ml'],
  ['00051', 2, 'HR³ Matrix Hair Tonic 70ml'],
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

function contractStateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/contract/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
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
  return (minor / 100).toFixed(2)
}

async function findCommissionContract(agentId) {
  const filter = `agent=${API}/entity/counterparty/${agentId}`
  const rows = await fetchAll(`/entity/contract?filter=${encodeURIComponent(filter)}`)
  return rows.find((r) => r.contractType === 'Commission') || null
}

async function createCommissionContract(agent) {
  const addr =
    agent.actualAddress ||
    agent.actualAddressFull?.addInfo ||
    'Villa No. 2, Al Manara, Dubai, United Arab Emirates'
  return api('POST', '/entity/contract', {
    moment: uaeMomentNow(),
    applicable: true,
    contractType: 'Commission',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    agent: href('counterparty', agent.id),
    ownAgent: href('organization', ORG_ID),
    state: contractStateHref(CONTRACT_STATE_DEFERRED_ID),
    rate: { currency: href('currency', CURRENCY_ID) },
    description: [
      `CEIA CLINIC consignment agreement ${uaeToday()}`,
      'Commission consignment — retail home-care Products.',
      `Clinic: ${addr}. DED 655053 | DHA 7761447 | TRN 105454133700003.`,
      'Payment within 5 days after monthly sales report. No SO/invoice on placement.',
    ].join('\n'),
  })
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
  const street =
    agent.actualAddress ||
    agent.actualAddressFull?.addInfo ||
    'Villa No. 2, Al Manara, Dubai, United Arab Emirates'
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: 'Dubai',
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
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Stock note export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  CEIA CLINIC — consignment agreement + opening demand')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Phone   : ${agent.phone || '—'}`)
  console.log(`  Address : ${agent.actualAddress || agent.actualAddressFull?.addInfo || '—'}`)

  let contract = await findCommissionContract(agent.id)
  if (contract) {
    console.log(`  Agreement exists: ${contract.name} (${contract.id})`)
  } else if (!COMMIT) {
    console.log('  Would create Commission agreement')
    contract = { id: 'DRY-RUN', name: '(new)' }
  } else {
    contract = await createCommissionContract(agent)
    console.log(`  Created agreement: ${contract.name} (${contract.id})`)
  }

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Demand lines (clinic list, VAT incl.):')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.label} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)} (avail ${line.available})`,
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | ${resolved.length} lines`)

  if (totalQty !== EXPECTED_UNITS) {
    throw new Error(`Unit count ${totalQty} ≠ expected ${EXPECTED_UNITS}`)
  }
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (!contract?.id || contract.id === 'DRY-RUN') {
    contract = (await findCommissionContract(agent.id)) || (await createCommissionContract(agent))
  }

  await ensureNoDuplicateDemand(agent.id)

  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', contract.id),
    store: href('store', STORE_ID),
    state: demandStateHref(DEMAND_STATE_SHIPPED_ID),
    shipmentAddressFull: buildShipmentAddress(agent),
    description: [
      MARKER,
      `Opening consignment demand into agreement ${contract.name} — no SO/invoice.`,
      'Clinic list prices, VAT incl. Retail home-care placement for CEIA CLINIC L.L.C.',
      `Villa No. 2, Al Manara, Dubai | +971561149495 | ${resolved.length} lines / ${totalQty} pcs / ${money(sumMinor)} AED.`,
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  if ((demand.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Demand sum mismatch: ${money(demand.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

  console.log(`\n  Agreement: ${contract.name}`)
  console.log(`  https://online.moysklad.ru/app/#contract/edit?id=${contract.id}`)
  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  console.log('  Exporting Consignment Stock Note PDF…')
  const pdfBuf = await exportStockNotePdf(demand.id)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(
    ORDERS_DIR,
    `GENOSYS_CEIA_Clinic_Consignment_Stock_Note_${demand.name}.pdf`,
  )
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF: ${outPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
