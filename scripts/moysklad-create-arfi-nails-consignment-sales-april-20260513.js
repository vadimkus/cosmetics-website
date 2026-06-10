#!/usr/bin/env node

/**
 * ARFI Nails — two полученные отчёты комиссионера (consignment sold),
 * quantities from Altegio «Анализ продаж» for April 2026 (01.04–30.04.2026).
 *
 * - ARFI NAILS BEAUTY SALON → Al Barsha (11 pcs, 5 SKU)
 * - ARFI NAILS BEAUTY SALON 2 → Jumeirah Garden (4 pcs, 4 SKU)
 *
 * Dry-run:
 *   node --import dotenv/config scripts/moysklad-create-arfi-nails-consignment-sales-april-20260513.js
 *
 * Commit:
 *   node --import dotenv/config scripts/moysklad-create-arfi-nails-consignment-sales-april-20260513.js --commit
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

/** Document filing moment (sales period below is April 2026). */
const DOC_MOMENT = '2026-05-13 14:00:00'
const DOC_DATE = '2026-05-13'

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  commissionPeriodStart: '2026-04-01 00:00:00',
  commissionPeriodEnd: '2026-04-30 23:59:59',
}

const REPORTS = [
  {
    exactAgentName: 'ARFI NAILS BEAUTY SALON',
    label: 'Barsha',
    marker: 'ARFI Nails Barsha Altegio consignment sold April 2026 screenshot 2026-05-13',
    lines: [
      ['00194', 1], // Multi Vita Radiance Serum 30ml
      ['54464', 1], // Skin Caring Blemish Balm Cushion #3 Camel
      ['00140', 4], // Soothing Bomb Sea Algae Mask 23g
      ['00144', 3], // Skin Caring Blemish Balm Cushion #2 Beige
      ['00190', 2], // Multi Functional Anti-Wrinkle Cream 50g
    ],
  },
  {
    exactAgentName: 'ARFI NAILS BEAUTY SALON 2',
    label: 'Jumeirah',
    marker: 'ARFI Nails Jumeirah Altegio consignment sold April 2026 screenshot 2026-05-13',
    lines: [
      ['00041', 1], // Multi Sun SPF40 40g (screen SPF 40+)
      ['00191', 1], // Multi Functional Anti-Wrinkle Serum 30ml
      ['54464', 1], // Skin Caring Blemish Balm Cushion #3 Camel
      ['00190', 1], // Multi Functional Anti-Wrinkle Cream 50g
    ],
  },
]

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
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
      `Counterparty exact "${exactName}" not found. Sample hits: ${rows
        .slice(0, 12)
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

async function ensureNoDuplicate(agentId, marker) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${DOC_DATE} 00:00:00`,
    `moment<=${DOC_DATE} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate report marker (${dup.name}, id=${dup.id})`)
}

function positionsFromResolved(resolved) {
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
  console.log('  ARFI Nails — consignment sold (commission reports ×2)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Sales window (Altegio): ${COMMON.commissionPeriodStart.slice(0, 10)} … ${COMMON.commissionPeriodEnd.slice(0, 10)}`)
  console.log(`  Document moment: ${DOC_MOMENT}`)

  const stock = await fetchStockByCode()

  for (const rep of REPORTS) {
    console.log('\n────────────────────────────────────────────────────────────────────')
    console.log(`  ${rep.label} — ${rep.exactAgentName}`)

    const agentHit = await findCounterpartyByExactName(rep.exactAgentName)
    const agentId = agentHit.id
    const contractId = await findCommissionContractId(agentId)
    const contract = await api('GET', `/entity/contract/${contractId}`)
    console.log(`  Agent   : ${agentHit.name} (${agentId})`)
    console.log(`  Contract: ${contract.name} (${contractId})`)

    const resolved = []
    let totalMinor = 0
    let totalQty = 0
    for (const [code, qty] of rep.lines) {
      const item = stock.get(code)
      if (!item?.id) throw new Error(`[${rep.label}] No stock row for code ${code}`)
      if (item.available < qty) {
        throw new Error(`[${rep.label}] Insufficient stock ${code} ${item.name}: need ${qty}, have ${item.available}`)
      }
      const lineMinor = item.price * qty
      totalMinor += lineMinor
      totalQty += qty
      resolved.push({ ...item, qty })
      console.log(`    ${code} ×${qty}  ${item.name.slice(0, 52)}  @ ${money(item.price)} → ${money(lineMinor)}`)
    }
    console.log(`  Total qty: ${totalQty} | Sum (VAT incl. list): ${money(totalMinor)} AED`)

    if (!COMMIT) continue

    await ensureNoDuplicate(agentId, rep.marker)

    const payload = {
      moment: DOC_MOMENT,
      applicable: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', COMMON.organizationId),
      agent: href('counterparty', agentId),
      contract: href('contract', contractId),
      state: stateHref('commissionreportin', COMMON.stateNotPaidId),
      commissionPeriodStart: COMMON.commissionPeriodStart,
      commissionPeriodEnd: COMMON.commissionPeriodEnd,
      rewardType: 'PercentOfSales',
      rewardPercent: 0,
      description: [
        rep.marker,
        'Source: Altegio Товары → Отчёты → Анализ продаж, period 01.04.2026–30.04.2026.',
        `Branch: ${rep.label}. MoySklad agent: ${rep.exactAgentName}.`,
      ].join('\n'),
      positions: positionsFromResolved(resolved),
    }

    const created = await api('POST', '/entity/commissionreportin', payload)
    const pos = await fetchAll(`/entity/commissionreportin/${created.id}/positions`)
    console.log(`  ✓ Created: ${created.name} | ${money(created.sum)} AED | positions=${pos.length}`)
    console.log(`    UI: https://online.moysklad.ru/app/#commissionreport/edit?id=${created.id}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN complete — add --commit to post both commission reports.')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
