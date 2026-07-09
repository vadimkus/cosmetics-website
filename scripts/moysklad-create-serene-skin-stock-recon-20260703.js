#!/usr/bin/env node

/**
 * Serene Skin Beauty Salon LLC — consignment stock reconciliation (contract 00060).
 *
 * Physical count Jul 2026 — salon confirmed: not sold, don't have (lost).
 *
 *   Lost → salesreturn + loss @ buyPrice:
 *     00021 x3, 00035 x2, 00040 x1, 00144 x1, 00195 x1
 *   Surplus vs books → demand:
 *     00041 x1 (SPF40 — books 0, shelf 1)
 *
 * Marker: SERENE-SKIN-STOCK-RECON-2026-07-03
 *
 *   node --import dotenv/config scripts/moysklad-create-serene-skin-stock-recon-20260703.js
 *   node --import dotenv/config scripts/moysklad-create-serene-skin-stock-recon-20260703.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = '993395aa-8da2-11ec-0a80-006b0038cd99'
const CONTRACT_ID = 'dc5c469a-d943-11ed-0a80-05bd0013eb27'
const STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'

const MARKER = 'SERENE-SKIN-STOCK-RECON-2026-07-03'

const LOSS_LINES = [
  ['00021', 3, 'Snow O₂ Cleanser 180ml'],
  ['00035', 2, 'Intensive Problem Control Cream 50g'],
  ['00040', 1, 'Intensive Blemish Balm Cream 50g'],
  ['00144', 1, 'Skin Caring Blemish Balm Cushion #2 Biege'],
  ['00195', 1, 'Moisture Replenishing Hyaluron Serum 30ml'],
]

const SURPLUS_LINES = [['00041', 1, 'Multi Sun Cream SPF40/PA++ 40g']]

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
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

async function ensureNoDuplicateAgentDoc(entity, agentId, marker) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate ${entity} (${dup.name}, id=${dup.id}) marker already used today`)
}

async function ensureNoDuplicateLoss(marker) {
  const data = await api('GET', `/entity/loss?filter=description~${encodeURIComponent(marker)}&limit=10`)
  const dup = (data.rows || []).find((r) => (r.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate loss (${dup.name}, id=${dup.id}) marker already used`)
}

async function resolveLossLines(stock) {
  const resolved = []
  for (const [code, qty, label] of LOSS_LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    const p = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = p.buyPrice?.value ?? 0
    if (buyMinor === 0) console.warn(`  ⚠ ${code}: buyPrice is 0`)
    resolved.push({ ...row, qty, label, buyMinor, returnPrice: row.price })
  }
  return resolved
}

async function resolveSurplusLines(stock) {
  return SURPLUS_LINES.map(([code, qty, label]) => {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    if (row.available < qty) {
      throw new Error(`Insufficient warehouse stock ${code}: need ${qty}, have ${row.available}`)
    }
    return { ...row, qty, label }
  })
}

async function verifyBalances() {
  const agentHref = `${API}/entity/counterparty/${AGENT_ID}`
  const contractHref = `${API}/entity/contract/${CONTRACT_ID}`
  const filter = encodeURIComponent(`agent=${agentHref};contract=${contractHref}`)
  const SALE_DEMAND_NAMES = new Set(['06271', '06436'])
  const targets = {
    '00021': 1,
    '00035': 1,
    '00040': 1,
    '00041': 1,
    '00144': 1,
    '00195': 0,
    '54457': 1,
  }

  const demands = await fetchAll(`/entity/demand?filter=${filter}`)
  const reports = await fetchAll(`/entity/commissionreportin?filter=${filter}`)
  const returns = await fetchAll(
    `/entity/salesreturn?filter=${encodeURIComponent(`agent=${agentHref}`)}`
  )

  const cache = new Map()
  async function resolveAssortment(ref) {
    const h = ref?.meta?.href
    if (!h) return {}
    if (!cache.has(h)) cache.set(h, api('GET', h.replace(API, '')))
    return cache.get(h)
  }

  const map = new Map()
  async function addFromDoc(entity, id, field) {
    const pos = await fetchAll(`/entity/${entity}/${id}/positions`)
    for (const p of pos) {
      const a = await resolveAssortment(p.assortment)
      if (!a.code) continue
      if (!map.has(a.code)) map.set(a.code, { in: 0, sold: 0, ret: 0 })
      map.get(a.code)[field] += Number(p.quantity)
    }
  }

  for (const d of demands) {
    if (SALE_DEMAND_NAMES.has(d.name)) continue
    await addFromDoc('demand', d.id, 'in')
  }
  for (const r of reports) await addFromDoc('commissionreportin', r.id, 'sold')
  for (const ret of returns) await addFromDoc('salesreturn', ret.id, 'ret')

  console.log('\n  Post-commit balance check (target = salon physical):')
  for (const [code, target] of Object.entries(targets)) {
    const r = map.get(code) || { in: 0, sold: 0, ret: 0 }
    const bal = r.in - r.sold - r.ret
    console.log(`    ${code} book ${bal} target ${target} ${bal === target ? 'OK' : 'MISMATCH'}`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Serene Skin Beauty — stock reconciliation (contract 00060)')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker : ${MARKER}`)
  console.log(`  Date   : ${uaeToday()} (UAE)`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name}`)

  const stock = await fetchStockByCode()
  const lossResolved = await resolveLossLines(stock)
  const surplusResolved = await resolveSurplusLines(stock)

  let returnSumMinor = 0
  let lossSumMinor = 0
  let demandSumMinor = 0

  console.log('\n  A) Lost → salesreturn (list) + loss (buyPrice):')
  for (const line of lossResolved) {
    returnSumMinor += line.returnPrice * line.qty
    lossSumMinor += line.buyMinor * line.qty
    console.log(
      `    ${line.code} x${line.qty}  return @ ${money(line.returnPrice)} | loss @ ${money(line.buyMinor)} buy`
    )
  }
  console.log(`       Return total (list): ${money(returnSumMinor)} AED`)
  console.log(`       Loss total (buy)   : ${money(lossSumMinor)} AED`)

  console.log('\n  B) Surplus SPF40 → demand (list):')
  for (const line of surplusResolved) {
    demandSumMinor += line.price * line.qty
    console.log(`    ${line.code} x${line.qty} @ ${money(line.price)}`)
  }
  console.log(`       Demand total: ${money(demandSumMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicateAgentDoc('salesreturn', AGENT_ID, MARKER)
  await ensureNoDuplicateLoss(MARKER)
  await ensureNoDuplicateAgentDoc('demand', AGENT_ID, MARKER)

  const momentReturn = uaeMomentNow()
  const momentLoss = uaeMomentAddMinutes(2)
  const momentDemand = uaeMomentAddMinutes(5)

  const salesReturn = await api('POST', '/entity/salesreturn', {
    applicable: true,
    moment: momentReturn,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Consignment stock recon Jul 2026 — lost units (not sold, salon confirmed missing).',
      'Cleanser x3, PCC cream x2, blemish balm x1, beige cushion x1, hyaluron serum x1.',
    ].join('\n'),
    positions: lossResolved.map((line) => ({
      quantity: line.qty,
      price: line.returnPrice,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })
  console.log(`\n  Sales return: ${salesReturn.name} | ${money(salesReturn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#salesreturn/edit?id=${salesReturn.id}`)

  const lossDoc = await api('POST', '/entity/loss', {
    applicable: true,
    moment: momentLoss,
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    description: [
      MARKER,
      'Consignment loss @ buyPrice after virtual sales return. Not billed to Serene Skin.',
    ].join('\n'),
    positions: lossResolved.map((line) => ({
      quantity: line.qty,
      price: line.buyMinor,
      assortment: href('product', line.id),
      vat: 0,
      vatEnabled: false,
    })),
  })
  console.log(`  Loss: ${lossDoc.name} | buy ${money(lossDoc.sum || lossSumMinor)} AED`)
  console.log(`  https://online.moysklad.ru/app/#loss/edit?id=${lossDoc.id}`)

  const demand = await api('POST', '/entity/demand', {
    applicable: true,
    moment: momentDemand,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_SHIPPED_ID),
    description: [
      MARKER,
      'Consignment stock recon — surplus SPF40 x1 (books 0, shelf 1).',
    ].join('\n'),
    positions: surplusResolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })
  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  await verifyBalances()
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
