#!/usr/bin/env node

/**
 * Bianco Spa FZCO (Cedre Center) — Отгрузка (demand) under commission contract 00073.
 *
 * Lines (clinic salePrice from stock report):
 * - Snow O₂ Cleanser 180ml ×2
 * - Snow Booster Toner 200ml ×3
 * - EGF Repair Oxymask Cream 50ml ×2
 * - Intensive Problem Control Cream 50g ×2
 * - Revita Glow BB #01 Bright 50g ×1
 * - Revita Glow BB #02 Natural 50g ×1
 *
 * Commission report is NOT created — shipment only.
 *
 * Dry-run:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-create-bianco-cedre-demand-20260516.js
 *
 * Commit:
 *   node scripts/moysklad-create-bianco-cedre-demand-20260516.js --commit
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
  date: '2026-05-16',
  moment: '2026-05-16 15:45:00',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: '4c134860-9a4e-11ee-0a80-09ea0005ef84', // Bianco Spa FZCO (Cedre Center)
  contractId: '34d5fa5e-9ce3-11ee-0a80-10c7001247d8', // 00073
}

const DEMAND = {
  moment: COMMON.moment,
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: 'Bianco Cedre Center replenishment shipment 2026-05-16 user list (cleanse/toner/oxymask/problem/revita)',
}

const LINES = [
  ['00021', 2], // Snow O₂ Cleanser 180ml
  ['00022', 3], // Snow Booster Toner 200ml
  ['00042', 2], // EGF Repair Oxymask Cream 50ml
  ['00035', 2], // Intensive Problem Control Cream 50g
  ['54472', 1], // Revita Glow BB #01 Bright 50g
  ['54473', 1], // Revita Glow BB #02 Natural 50g
]

async function api(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1000)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(path) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const data = await api('GET', `${path}${sep}limit=${limit}&offset=${offset}`)
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
      stock: Number(row.stock || 0),
      reserve: Number(row.reserve || 0),
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicateDemand() {
  const filter = [
    `agent=${API}/entity/counterparty/${COMMON.agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(DEMAND.marker))
  if (dup) {
    throw new Error(`Duplicate protection: demand already exists (${dup.name}, id=${dup.id})`)
  }
}

function positions(resolved) {
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
  console.log('  MoySklad Отгрузка — Bianco Spa FZCO (Cedre Center) / contract 00073')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Counterparty: ${agent.name}`)
  console.log(`  Agreement   : ${contract.name}`)

  await ensureNoDuplicateDemand()

  const stock = await fetchStockByCode()
  const resolved = LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item) throw new Error(`Product code not found in stock report: ${code}`)
    if (!item.id) throw new Error(`Product ID missing for code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock for ${code} ${item.name}: need ${qty}, available ${item.available}`)
    }
    return { ...item, qty }
  })

  const totalMinor = resolved.reduce((s, l) => s + l.qty * l.price, 0)
  console.log()
  for (const line of resolved) {
    console.log(
      `  ${line.code} | ${line.name.slice(0, 55)} | qty=${line.qty} | unit=${money(line.price)} | line=${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total qty: ${resolved.reduce((s, l) => s + l.qty, 0)} | Total incl. VAT: ${money(totalMinor)} AED`)

  const payload = {
    moment: DEMAND.moment,
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    store: href('store', COMMON.storeId),
    state: stateHref('demand', DEMAND.stateShippedId),
    description: [
      DEMAND.marker,
      'Customer: Bianco Spa FZCO (Cedre Center)',
      'Agreement: 00073',
      'Отгрузка only (no commission report).',
    ].join('\n'),
    positions: positions(resolved),
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN complete. Re-run with --commit.')
    return
  }

  console.log('\n  Posting Отгрузка...')
  const created = await api('POST', '/entity/demand', payload)
  const readback = await fetchAll(`/entity/demand/${created.id}/positions`)
  console.log(`    Name: ${created.name}`)
  console.log(`    ID:   ${created.id}`)
  console.log(`    Sum:  ${money(created.sum)} AED`)
  console.log(`    Lines: ${readback.length}`)
  console.log(`    UI:   https://online.moysklad.ru/app/#demand/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
