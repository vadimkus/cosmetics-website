#!/usr/bin/env node

/**
 * Отгрузка (demand) в договор комиссии — Shakirovna Ladies Beauty Saloon,
 * те же строки, что отчёт комиссионера **01354** / скрин 2026-05-12.
 *
 * Договор **00030**. Состояние: отгружен.
 *
 *   node scripts/moysklad-create-shakirovna-ladies-salon-demand-20260512.js
 *   node scripts/moysklad-create-shakirovna-ladies-salon-demand-20260512.js --commit
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
  moment: '2026-05-12 18:45:00',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
}

const CUSTOMER_EXACT_NAME = 'Shakirovna Ladies Beauty Saloon'

const DEMAND_MARKER =
  'Shakirovna Ladies Beauty Saloon demand same 13 lines as commission 01354 screenshot 2026-05-12'

/** Same tuples as moysklad-create-shakirovna-ladies-salon-commission-report-20260512.js */
const LINES = [
  ['54458', 1],
  ['00037', 1],
  ['54467', 1],
  ['00012', 3],
  ['00144', 1],
  ['00190', 2],
  ['00035', 1],
  ['00041', 2],
  ['00189', 1],
  ['00029', 3],
  ['00140', 3],
  ['00063', 9],
  ['00022', 1],
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
      `Counterparty "${exactName}" not found. Samples: ${rows
        .slice(0, 8)
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

async function ensureNoDuplicateDemand(agentId) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(DEMAND_MARKER))
  if (dup) throw new Error(`Duplicate Отгрузка (${dup.name}, id=${dup.id})`)
}

function resolveLines(stock) {
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

function positionsFromResolved(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Ladies Beauty Saloon — Отгрузка (как отчёт 01354)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agentHit = await findCounterpartyByExactName(CUSTOMER_EXACT_NAME)
  const agentId = agentHit.id
  const contractId = await findCommissionContractId(agentId)
  const agent = await api('GET', `/entity/counterparty/${agentId}`)
  const contract = await api('GET', `/entity/contract/${contractId}`)
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name} (${contractId})`)

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  let sumMinor = 0
  console.log('\n  Lines:')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 48)}… x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Sum (list VAT-incl.): ${money(sumMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — --commit')
    return
  }

  await ensureNoDuplicateDemand(agentId)

  const payload = {
    moment: COMMON.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', agentId),
    contract: href('contract', contractId),
    store: href('store', COMMON.storeId),
    state: stateHref('demand', COMMON.stateShippedId),
    description: [
      DEMAND_MARKER,
      'Paired replenishment shipment: same 13 SKU / 29 pcs as commissioner report 01354.',
    ].join('\n'),
    positions: positionsFromResolved(resolved),
  }

  const created = await api('POST', '/entity/demand', payload)
  const rb = await fetchAll(`/entity/demand/${created.id}/positions`)
  console.log(`\n  Created: ${created.name} | ${money(created.sum)} AED | positions=${rb.length}`)
  console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
