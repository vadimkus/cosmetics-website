#!/usr/bin/env node

/**
 * Полученный отчёт комиссионера — Shakirovna Ladies Beauty Saloon / Ladies Salon,
 * строки как на скрине 2026-05-12 (13 позиций, 29 шт всего).
 *
 * Договор: **00030** (комиссия) — см. SESSION_CHANGES_2026-04-29_SHAKIROVNA_COMMISSION_REPORT.md
 *
 *   node scripts/moysklad-create-shakirovna-ladies-salon-commission-report-20260512.js
 *   node scripts/moysklad-create-shakirovna-ladies-salon-commission-report-20260512.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const COMMON = {
  date: '2026-05-12',
  moment: '2026-05-12 18:00:00',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
}

const CUSTOMER_EXACT_NAME = 'Shakirovna Ladies Beauty Saloon'

const REPORT = {
  marker: 'Shakirovna Ladies Beauty Saloon consignment sold screenshot 2026-05-12 13 SKU',
}

/**
 * Screen: Hyaluron 50ml, Barrier 100g, PDRN pack, Peptide gel 38g, BB Beige, Anti-wrinkle 50g,
 * Problem Control cream 50ml, Multi Sun SPF40, Overnight mask 100g, Problem Control serum 30ml,
 * Sea Algae «25g»→23g catalog, Collagen 23g, Snow Booster 200ml.
 */
const LINES = [
  ['54458', 1], // Moisture Replenishing Hyaluron Cream 50g (screen 50ml)
  ['00037', 1], // Skin Barrier Protecting Cream 100g
  ['54467', 1], // Skin Reboot PDRN Mask Pack (30 sheets)
  ['00012', 3], // Peptide Gel Mask (catalog 39g; screen 38g ×3 pcs)
  ['00144', 1], // BB Cushion #2 Beige
  ['00190', 2], // Multi Functional Anti-Wrinkle Cream 50g
  ['00035', 1], // Intensive Problem Control Cream 50g
  ['00041', 2], // Multi Sun SPF40
  ['00189', 1], // Skin Rescue Overnight Cream Mask 100g
  ['00029', 3], // Problem Control Serum 30ml
  ['00140', 3], // Soothing Bomb Sea Algae (screen 25g → 23g sku)
  ['00063', 9], // Intensive Repair Collagen Mask 23g
  ['00022', 1], // Snow Booster Toner 200ml
]

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=${limit}&offset=${offset}`)
    const batch = data?.rows || []
    rows.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return rows
}

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
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

async function findCounterpartyByExactName(exactName) {
  const token = exactName.split(/\s+/)[0]
  const data = await api('GET', `/entity/counterparty?limit=100&search=${encodeURIComponent(token)}`)
  const rows = data?.rows || []
  const hit = rows.find((r) => r.name === exactName)
  if (!hit) {
    throw new Error(
      `Counterparty exact "${exactName}" not found. First token search hits: ${rows
        .slice(0, 10)
        .map((r) => r.name)
        .join(' | ')}`
    )
  }
  return hit
}

function isCommissionContract(c) {
  const t = c.contractType || c.type
  return t === 'Commission' || String(t).toLowerCase() === 'commission'
}

async function findCommissionContractId(agentId) {
  const agentHref = `${API}/entity/counterparty/${agentId}`
  const data = await api('GET', `/entity/contract?filter=${encodeURIComponent(`agent=${agentHref}`)}&limit=100`)
  const rows = data?.rows || []
  const comm = rows.filter(isCommissionContract)
  const pick = (list) => {
    if (!list.length) return null
    if (list.length === 1) return list[0].id
    list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ru'))
    return list[0].id
  }
  if (comm.length) return pick(comm)
  const id = pick(rows)
  if (!id) throw new Error(`No contracts for agent ${agentId}`)
  return id
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    const id = row.meta?.href?.split('/').pop()?.split('?')[0]
    stock.set(row.code, {
      id,
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate(agentId) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(REPORT.marker))
  if (dup) throw new Error(`Duplicate report marker (${dup.name}, id=${dup.id})`)
}

function positions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    reward: 0,
  }))
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Ladies Beauty Saloon — полученный отчёт комиссионера')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Customer: ${CUSTOMER_EXACT_NAME}`)
  console.log(`  Moment: ${COMMON.moment}`)

  const agentHit = await findCounterpartyByExactName(CUSTOMER_EXACT_NAME)
  const agentId = agentHit.id
  const contractId = await findCommissionContractId(agentId)
  const agent = await api('GET', `/entity/counterparty/${agentId}`)
  const contract = await api('GET', `/entity/contract/${contractId}`)
  console.log(`  Agent   : ${agent.name} (${agentId})`)
  console.log(`  Contract: ${contract.name} (${contractId})`)

  const stock = await fetchStockByCode()
  const resolved = []
  let totalMinor = 0
  let totalQty = 0
  console.log('\n  Lines (AED VAT-incl. from sale price):')
  for (const [code, qty] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`No stock row for code ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code} ${item.name}: need ${qty}, have ${item.available}`)
    }
    const lineMinor = item.price * qty
    totalMinor += lineMinor
    totalQty += qty
    resolved.push({ ...item, qty })
    console.log(`    ${code} ${item.name.slice(0, 50)}… x${qty} @ ${money(item.price)} → ${money(lineMinor)}`)
  }
  console.log(`  Total qty: ${totalQty} | Sum: ${money(totalMinor)} AED`)

  if (COMMIT) await ensureNoDuplicate(agentId)

  const payload = {
    moment: COMMON.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', agentId),
    contract: href('contract', contractId),
    state: stateHref('commissionreportin', COMMON.stateNotPaidId),
    commissionPeriodStart: COMMON.moment,
    commissionPeriodEnd: COMMON.moment,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      REPORT.marker,
      'Table screenshot 2026-05-12: 13 product rows; Sea Algae 25g→23g sku 00140; Peptide gel 38g→39g sku 00012.',
    ].join('\n'),
    positions: positions(resolved),
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — add --commit')
    return
  }

  const created = await api('POST', '/entity/commissionreportin', payload)
  const pos = await fetchAll(`/entity/commissionreportin/${created.id}/positions`)
  console.log(`\n  Created: ${created.name} | ${money(created.sum)} AED | lines=${pos.length}`)
  console.log(`  UI: https://online.moysklad.ru/app/#commissionreport/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
