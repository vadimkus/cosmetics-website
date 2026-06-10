#!/usr/bin/env node

/**
 * Shakirovna Ladies Beauty Saloon — consignment stock reconciliation (contract 00030).
 *
 * Full documentation:
 *   docs/SESSION_CHANGES_2026-05-29_SHAKIROVNA_LADIES_STOCK_RECON.md
 *   docs/CONSIGNMENT_STOCK_RECONCILIATION.md
 *
 * Customer: Shakirovna Ladies Beauty Saloon (93775ae5-d18d-11ea-0a80-02e00008417d)
 * Contract: 00030 (f5a1958d-c3ca-11eb-0a80-048e0027cbcb)
 *
 * Salon variances (May 2026 physical count):
 *   +2 collagen 00063, +1 hyaluron cream 54458  → demand 06247 (surplus shipment)
 *   −2 sea algae 00140, −1 hyaluron serum 00195, −1 PDRN 54467
 *     → lost (not sold): salesreturn 00296 + loss 00008-00437 @ buyPrice
 *
 * Marker: SHAKIROVNA-LADIES-STOCK-RECON-2026-05-29
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-ladies-salon-stock-recon-20260529.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-ladies-salon-stock-recon-20260529.js --commit
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

const {
  uaeToday,
  uaeMomentNow,
  uaeMomentAddMinutes,
} = require('./lib/moysklad-uae-date')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb'
const STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'

const CUSTOMER_EXACT_NAME = 'Shakirovna Ladies Beauty Saloon'

const MARKER = 'SHAKIROVNA-LADIES-STOCK-RECON-2026-05-29'

/** Lost at salon — virtual return then warehouse write-off @ buyPrice */
const LOSS_LINES = [
  ['00140', 2, 'Soothing Bomb Sea Algae Mask 23g'],
  ['00195', 1, 'Moisture Replenishing Hyaluron Serum 30ml'],
  ['54467', 1, 'Skin Reboot PDRN mask Pack'],
]

/** Physical surplus vs books — consignment shipment */
const SURPLUS_LINES = [
  ['00063', 2, 'Intensive Repair Collagen Mask 23g'],
  ['54458', 1, 'Moisture Replenishing Hyaluron Cream 50g'],
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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

async function ensureNoDuplicateAgentDoc(entity, agentId, marker) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) {
    throw new Error(`Duplicate ${entity} (${dup.name}, id=${dup.id}) marker already used today`)
  }
}

async function ensureNoDuplicateLoss(marker) {
  const search = encodeURIComponent(marker)
  const data = await api('GET', `/entity/loss?filter=description~${search}&limit=10`)
  const dup = (data?.rows || []).find((r) => (r.description || '').includes(marker))
  if (dup) {
    throw new Error(`Duplicate loss (${dup.name}, id=${dup.id}) marker already used`)
  }
}

async function resolveLossLines(stock) {
  const resolved = []
  for (const [code, qty, label] of LOSS_LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    const p = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = p.buyPrice?.value ?? 0
    if (buyMinor === 0) console.warn(`  ⚠ ${code}: buyPrice is 0`)
    resolved.push({
      ...row,
      qty,
      label,
      buyMinor,
      returnPrice: row.price,
    })
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

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Ladies Salon — stock reconciliation (contract 00030)')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker : ${MARKER}`)
  console.log(`  Date   : ${uaeToday()} (UAE)`)
  console.log()

  const agentHit = await findCounterpartyByExactName(CUSTOMER_EXACT_NAME)
  const agentId = agentHit.id
  const stock = await fetchStockByCode()

  const lossResolved = await resolveLossLines(stock)
  const surplusResolved = await resolveSurplusLines(stock)

  let returnSumMinor = 0
  let lossSumMinor = 0
  let demandSumMinor = 0

  console.log('  A) Lost at salon → Возврат покупателя (list) + Списание (buyPrice):')
  for (const line of lossResolved) {
    returnSumMinor += line.returnPrice * line.qty
    lossSumMinor += line.buyMinor * line.qty
    console.log(
      `    ${line.code} x${line.qty}  return @ ${money(line.returnPrice)} | loss @ ${money(line.buyMinor)} buy`
    )
  }
  console.log(`       Return total (list): ${money(returnSumMinor)} AED`)
  console.log(`       Loss total (buy)   : ${money(lossSumMinor)} AED`)

  console.log('\n  B) Surplus at salon → Отгрузка (list):')
  for (const line of surplusResolved) {
    demandSumMinor += line.price * line.qty
    console.log(`    ${line.code} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)}`)
  }
  console.log(`       Demand total: ${money(demandSumMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicateAgentDoc('salesreturn', agentId, MARKER)
  await ensureNoDuplicateLoss(MARKER)
  await ensureNoDuplicateAgentDoc('demand', agentId, MARKER)

  const momentReturn = uaeMomentNow()
  const momentLoss = uaeMomentAddMinutes(2)
  const momentDemand = uaeMomentAddMinutes(5)

  const returnPayload = {
    applicable: true,
    moment: momentReturn,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agentId),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Consignment stock recon: salon verified count — lost units (no physical return).',
      'Pairs with loss document at buyPrice. Sea algae −2, Hyaluron serum −1, PDRN pack −1.',
    ].join('\n'),
    positions: lossResolved.map((line) => ({
      quantity: line.qty,
      price: line.returnPrice,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  }

  const salesReturn = await api('POST', '/entity/salesreturn', returnPayload)
  console.log(`\n  Sales return: ${salesReturn.name} | ${money(salesReturn.sum)} AED`)
  console.log(`  UI: https://online.moysklad.ru/app/#salesreturn/edit?id=${salesReturn.id}`)

  const lossPayload = {
    applicable: true,
    moment: momentLoss,
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    description: [
      MARKER,
      'Consignment loss write-off @ buyPrice after virtual sales return.',
      'Shakirovna Ladies Salon stock reconciliation — not billed to salon.',
    ].join('\n'),
    positions: lossResolved.map((line) => ({
      quantity: line.qty,
      price: line.buyMinor,
      assortment: href('product', line.id),
      vat: 0,
      vatEnabled: false,
    })),
  }

  const lossDoc = await api('POST', '/entity/loss', lossPayload)
  console.log(`\n  Loss: ${lossDoc.name} | buy cost ${money(lossDoc.sum || lossSumMinor)} AED`)
  console.log(`  UI: https://online.moysklad.ru/app/#loss/edit?id=${lossDoc.id}`)

  const demandPayload = {
    applicable: true,
    moment: momentDemand,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agentId),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_SHIPPED_ID),
    description: [
      MARKER,
      'Consignment stock recon: salon verified count — surplus vs books.',
      'Collagen mask +2, Hyaluron cream 50g +1.',
    ].join('\n'),
    positions: surplusResolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  }

  const demand = await api('POST', '/entity/demand', demandPayload)
  console.log(`\n  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
