#!/usr/bin/env node

/**
 * Yula Beauty Salon LLC — expired consignment stock write-off.
 *
 * Flow (per docs/CONSIGNMENT_STOCK_RECONCILIATION.md):
 *   1) salesreturn @ list — reduce commission balance (virtual, not physically received)
 *   2) loss @ buyPrice — warehouse write-off
 *
 *   node --import dotenv/config scripts/moysklad-create-yula-beauty-expired-writeoff-20260605.js
 *   node --import dotenv/config scripts/moysklad-create-yula-beauty-expired-writeoff-20260605.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'bfe39f3a-6c0f-11ef-0a80-10ba0004368c' // Yula Beauty Salon LLC
const CONTRACT_ID = 'f7304b4a-6cfa-11ef-0a80-0c23001f2f8c' // Agreement 12
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'

const CUSTOMER_EXACT_NAME = 'Yula Beauty Salon LLC'
const MARKER = `YULA-BEAUTY-EXPIRED-WRITE-OFF-${uaeToday()}`

/** [code, qty, label] */
const LOSS_LINES = [
  ['00143', 2, 'Skin Caring BB Cushion #1 Ivory'],
  ['00030', 2, 'All For Sensitive Serum 30ml'],
  ['00029', 2, 'Problem Control Serum 30ml'],
  ['00145', 2, 'Problem Control Toner 200ml'],
  ['00053', 1, 'EyeCell Eye Peptide Gel Patch (box)'],
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
  const hit = (data?.rows || []).find((r) => r.name === exactName)
  if (!hit) throw new Error(`Counterparty "${exactName}" not found`)
  return hit
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
    })
  }
  return stock
}

async function ensureNoDuplicate(entity, agentId) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate ${entity}: ${dup.name} (${dup.id})`)
}

async function ensureNoDuplicateLoss() {
  const data = await api('GET', `/entity/loss?filter=description~${encodeURIComponent(MARKER)}&limit=10`)
  const dup = (data?.rows || []).find((r) => (r.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate loss: ${dup.name} (${dup.id})`)
}

async function resolveLossLines(stock) {
  const resolved = []
  for (const [code, qty, label] of LOSS_LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    const p = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = p.buyPrice?.value ?? 0
    if (!row.price) throw new Error(`No salePrice for ${code}`)
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

async function main() {
  console.log('====================================================================')
  console.log('  Yula Beauty Salon LLC — expired consignment write-off')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker : ${MARKER}`)
  console.log()

  const agent = await findCounterpartyByExactName(CUSTOMER_EXACT_NAME)
  const contract = await api('GET', `/entity/contract/${CONTRACT_ID}`)
  console.log(`  Customer : ${agent.name}`)
  console.log(`  Contract : ${contract.name} (${contract.id})`)

  const stock = await fetchStockByCode()
  const lines = await resolveLossLines(stock)

  let returnSumMinor = 0
  let lossSumMinor = 0
  console.log('\n  Expired units → return (list) + loss (buy):')
  for (const line of lines) {
    returnSumMinor += line.returnPrice * line.qty
    lossSumMinor += line.buyMinor * line.qty
    console.log(
      `    ${line.code} ${line.label} x${line.qty}  return ${money(line.returnPrice)} | loss ${money(line.buyMinor)} buy`
    )
  }
  console.log(`\n  Return total (list): ${money(returnSumMinor)} AED`)
  console.log(`  Loss total (buy)   : ${money(lossSumMinor)} AED | ${lines.reduce((s, l) => s + l.qty, 0)} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate('salesreturn', agent.id)
  await ensureNoDuplicateLoss()

  const salesReturn = await api('POST', '/entity/salesreturn', {
    applicable: true,
    moment: uaeMomentNow(),
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Expired consignment stock at salon — virtual return (not physically to warehouse).',
      'Ivory cushion x2, AFS serum x2, PCS serum x2, PCT toner x2, eye patch box x1.',
    ].join('\n'),
    positions: lines.map((line) => ({
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
    moment: uaeMomentAddMinutes(2),
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    description: [
      MARKER,
      'Expired consignment write-off @ buyPrice after virtual sales return.',
      'Yula Beauty Salon LLC — agreement 12 — not billed to salon.',
    ].join('\n'),
    positions: lines.map((line) => ({
      quantity: line.qty,
      price: line.buyMinor,
      assortment: href('product', line.id),
      vat: 0,
      vatEnabled: false,
    })),
  })

  console.log(`\n  Loss: ${lossDoc.name} | buy cost ${money(lossDoc.sum || lossSumMinor)} AED`)
  console.log(`  https://online.moysklad.ru/app/#loss/edit?id=${lossDoc.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
