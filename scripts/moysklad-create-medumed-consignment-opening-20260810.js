#!/usr/bin/env node

/**
 * MEDYUMED MEDICAL CLINIC L.L.C — commission agreement + opening consignment demand.
 * Same SKU basket as NEW YOU STAR demand 06544 (photo inventory + PDRN).
 * No SO / invoice — demand into agreement only.
 * Stock note PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-medumed-consignment-opening-20260810.js
 *   node --import dotenv/config scripts/moysklad-create-medumed-consignment-opening-20260810.js --commit
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
const AGENT_ID = 'abb20ade-94aa-11f1-0a80-1e9800852741' // MEDYUMED MEDICAL CLINIC L.L.C
const CONTRACT_STATE_DEFERRED_ID = 'b5d800c6-80df-11ea-0a80-004a001360f2'
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

/** MedUmed = 39; Viktoria Cosmetologist (Dubai Hills) = 40 (swapped 2026-08-10). */
const CONTRACT_NAME = '39'

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `MEDUMED-CONSIGNMENT-OPENING-NYS06544-${uaeToday()}`
const EXPECTED_SUM_MINOR = 1312400 // 13,124.00 AED (= New You 06544)
const EXPECTED_UNITS = 120

/** Same aggregated lines as NEW YOU STAR demand 06544 */
const LINES = [
  ['00191', 2, 'Multi Functional Anti-Wrinkle Serum 30ml'],
  ['00029', 2, 'Problem Control Serum 30ml'],
  ['00030', 2, 'All For Sensitive Serum 30ml'],
  ['00195', 2, 'Moisture Replenishing Hyaluron Serum 30ml'],
  ['00194', 2, 'Multi Vita Radiance Serum 30ml'],
  ['54484', 2, 'CERABARRIER Biome Gel Cleanser 200ml'],
  ['00021', 4, 'Snow O₂ Cleanser 180ml'],
  ['54458', 2, 'Moisture Replenishing Hyaluron Cream 50g'],
  ['00035', 2, 'Intensive Problem Control Cream 50g'],
  ['00190', 2, 'Multi Functional Anti-Wrinkle Cream 50g'],
  ['54457', 4, 'Ultra Shield Sun Cream SPF50/PA++++ 50g'],
  ['00041', 4, 'Multi Sun Cream SPF40/PA++ 40g'],
  ['00189', 2, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00129', 2, 'EPI Turnover Boosting Peeling Gel 100g'],
  ['00052', 2, 'HR³ Matrix Scalp & Hair Shampoo 300ml'],
  ['00051', 2, 'HR³ Matrix Hair Tonic 70ml'],
  ['00059', 1, 'EyeCell Eye Zone Care Kit (box)'],
  ['00054', 2, 'EyeCell Eye Contour Serum 10ml'],
  ['00055', 2, 'EyeCell Eye Contour Cream 20ml'],
  ['00053', 2, 'EyeCell Eye Peptide Gel Patch (box)'],
  ['00038', 2, 'Soothing Repair Post Cream 20g'],
  ['54465', 2, 'Soothing Repair Post Cream 100g'],
  ['54475', 2, 'BIO-MESO PDRN Homecare Ampoule 5000'],
  ['00145', 2, 'Problem Control Toner 200ml'],
  ['00044', 2, 'ND Cell Anti-Wrinkle Cream 50ml'],
  ['00037', 2, 'Skin Barrier Protecting Cream 100g'],
  ['00188', 4, 'Microbiome Energy Infusing Mist 80ml'],
  ['00144', 3, 'BB Cushion #2 Beige'],
  ['54464', 2, 'BB Cushion #3 Camel'],
  ['00143', 2, 'BB Cushion #1 Ivory'],
  ['54472', 2, 'Revita Glow BB Cream #01 Bright 50g'],
  ['54473', 2, 'Revita Glow BB Cream #02 Natural 50g'],
  ['00022', 2, 'Snow Booster Toner 200ml'],
  ['54467', 2, 'Skin Reboot PDRN mask Pack'],
  ['00063', 20, 'Intensive Repair Collagen Mask'],
  ['00140', 20, 'Soothing Bomb Sea Algae Mask'],
  ['00040', 2, 'Intensive Blemish Balm Cream 50g'],
  ['00031', 2, 'Intensive Hydro Soothing Cream 50g'],
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
    'R-10, Blue Waters Residential, Bluewaters Island, Dubai, United Arab Emirates'
  return api('POST', '/entity/contract', {
    name: CONTRACT_NAME,
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
      `MEDYUMED MEDICAL CLINIC consignment agreement ${CONTRACT_NAME} ${uaeToday()}`,
      'Commission consignment — retail home-care Products.',
      `Clinic: ${addr}. DET 1119644 | TRN 104012765400003 | Owner Yulia Shchekleina.`,
      'Payment within 5 days after monthly sales report. No SO/invoice on placement.',
      'Opening basket matches NEW YOU STAR demand 06544.',
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
    'R-10, Blue Waters Residential, Bluewaters Island, Dubai, United Arab Emirates'
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: 'Dubai',
    street,
  }
}

async function ensureNoDuplicate(agentId) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
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
  const pdfRes = await fetch(res.headers.get('location'))
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, `GENOSYS_MedUmed_${demandName}_Consignment_Stock_Note.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  MEDYUMED — agreement + opening consignment (= New You 06544)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Address : ${agent.actualAddress || '—'}`)

  let contract = await findCommissionContract(agent.id)
  if (contract) {
    console.log(`  Agreement exists: ${contract.name} (${contract.id})`)
  } else if (!COMMIT) {
    console.log(`  Would create Commission agreement name=${CONTRACT_NAME}`)
    contract = { id: 'DRY-RUN', name: CONTRACT_NAME }
  } else {
    contract = await createCommissionContract(agent)
    console.log(`  Created agreement: ${contract.name} (${contract.id})`)
  }

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  const units = resolved.reduce((s, l) => s + l.qty, 0)
  let totalMinor = 0
  console.log('\n  Lines:')
  for (const line of resolved) {
    const lineMinor = line.qty * line.price
    totalMinor += lineMinor
    console.log(
      `    ${line.code} x${line.qty} @ ${money(line.price)} = ${money(lineMinor)}  ${line.label}`,
    )
  }
  console.log(`  Total: ${units} pcs | ${money(totalMinor)} AED`)

  if (units !== EXPECTED_UNITS) throw new Error(`Units ${units} ≠ ${EXPECTED_UNITS}`)
  if (totalMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(totalMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)} (New You 06544)`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate(agent.id)
  if (!contract?.id || contract.id === 'DRY-RUN') {
    contract = (await findCommissionContract(agent.id)) || (await createCommissionContract(agent))
  }

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
      'Same items as NEW YOU STAR demand 06544 (photo inventory + PDRN).',
      'MEDYUMED MEDICAL CLINIC L.L.C | Bluewaters Island.',
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  console.log(`\n  Demand ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  https://online.moysklad.ru/app/#contract/edit?id=${contract.id}`)

  const pdf = await exportStockNotePdf(demand.id, demand.name)
  console.log(`  PDF: ${pdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
