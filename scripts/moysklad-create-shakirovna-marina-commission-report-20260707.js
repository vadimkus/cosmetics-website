#!/usr/bin/env node

/**
 * Shakirovna Ladies Beauty Saloon (Marina) — consignment sold report only.
 * Altegio «Анализ продаж» 10.06.2026–08.07.2026 — 17 SKU / 34 pcs.
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-commission-report-20260707.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-commission-report-20260707.js --commit
 */

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
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb' // 00030
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'

const CUSTOMER_EXACT_NAME = 'Shakirovna Ladies Beauty Saloon'
const COMMISSION_PERIOD_START = '2026-06-10 00:00:00'
const COMMISSION_PERIOD_END = '2026-07-09 23:59:59'
const MARKER = `SHAKIROVNA-MARINA-CONSIGNMENT-SOLD-ALTEGIO-${uaeToday()}`

/** [code, qty, label] — Altegio RTL-GEN → MoySklad */
const LINES = [
  ['00035', 1, 'Problem Control Cream 50ml (RTL-GEN-008)'],
  ['00029', 1, 'Problem Control Serum 30ml (RTL-GEN-010)'],
  ['54458', 3, 'Hyaluron Cream 50ml (RTL-GEN-034)'],
  ['00012', 1, 'Peptide Gel Mask 39g (RTL-GEN-017)'],
  ['00055', 2, 'EyeCell Eye Contour Cream 20ml (RTL-GEN-023)'],
  ['00190', 2, 'Multi Functional Anti-Wrinkle Cream 50g (RTL-GEN-031)'],
  ['00054', 1, 'Eye Contour Serum 10ml (RTL-GEN-022)'],
  ['00195', 1, 'Hyaluron Serum 30ml (RTL-GEN-035)'],
  ['00191', 1, 'Multi Functional Anti-Wrinkle Serum 30ml (RTL-GEN-015)'],
  ['00021', 1, 'Snow O₂ Cleanser 180ml (RTL-GEN-003)'],
  ['54457', 2, 'Ultra Shield SPF50 50g (RTL-GEN-033)'],
  ['00188', 1, 'Microbiome Mist 80ml (RTL-GEN-028)'],
  ['00189', 2, 'Skin Rescue Overnight Cream Mask 100g (RTL-GEN-032)'],
  ['00144', 5, 'Cushion #2 Beige (RTL-GEN-020)'],
  ['00140', 7, 'Sea Algae Mask 23g (RTL-GEN-016)'],
  ['00063', 3, 'Collagen Mask 23g (RTL-GEN-018)'],
  ['00053', 1, 'EyeCell Eye Peptide Gel Patch box (RTL-GEN-019)'],
]

const EXPECTED_TOTAL_QTY = 35

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
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
  return ((minor || 0) / 100).toFixed(2)
}

async function findCounterpartyByExactName(exactName) {
  const token = exactName.split(/\s+/)[0]
  const data = await api('GET', `/entity/counterparty?limit=100&search=${encodeURIComponent(token)}`)
  const hit = (data?.rows || []).find((r) => r.name === exactName)
  if (!hit) throw new Error(`Counterparty "${exactName}" not found`)
  return hit
}

async function fetchProductByCode(code) {
  const data = await api('GET', `/entity/product?filter=${encodeURIComponent(`code=${code}`)}&limit=1`)
  const product = data?.rows?.[0]
  if (!product) return null
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    price: Number(product.salePrices?.[0]?.value || 0),
  }
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

async function resolveProduct(code, stock) {
  const hit = stock.get(code)
  if (hit?.id) {
    if (!hit.price) {
      const p = await fetchProductByCode(code)
      if (p?.price) hit.price = p.price
    }
    return hit
  }
  const product = await fetchProductByCode(code)
  if (!product?.id) throw new Error(`Unknown product code: ${code}`)
  return product
}

async function ensureNoDuplicate(agentId) {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate report (${dup.name}, id=${dup.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Marina — consignment report only (17 SKU / 34 pcs)')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Period : ${COMMISSION_PERIOD_START.slice(0, 10)} … ${COMMISSION_PERIOD_END.slice(0, 10)}`)
  console.log(`  Marker : ${MARKER}`)

  const agent = await findCounterpartyByExactName(CUSTOMER_EXACT_NAME)
  const contract = await api('GET', `/entity/contract/${CONTRACT_ID}`)
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const stock = await fetchStockByCode()
  const resolved = []
  let totalQty = 0
  let totalMinor = 0

  console.log('\n  Lines (clinic salePrice, VAT incl.):')
  for (const [code, qty, label] of LINES) {
    const item = await resolveProduct(code, stock)
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    totalQty += qty
    totalMinor += item.price * qty
    resolved.push({ ...item, qty, label })
    console.log(
      `    ${code} ${label} x${qty} @ ${money(item.price)} → ${money(item.price * qty)} AED`
    )
  }

  if (totalQty !== EXPECTED_TOTAL_QTY) {
    throw new Error(`Qty mismatch: expected ${EXPECTED_TOTAL_QTY}, got ${totalQty}`)
  }
  console.log(`\n  Total: ${totalQty} pcs | ${money(totalMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate(agent.id)

  const positions = resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    reward: 0,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))

  const report = await api('POST', '/entity/commissionreportin', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: COMMISSION_PERIOD_START,
    commissionPeriodEnd: COMMISSION_PERIOD_END,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Shakirovna Beauty Center Dubai Marina — Altegio sales analysis 10.06.2026–08.07.2026.',
      '17 product rows / 34 pcs. Report only — no отгрузка yet.',
      'Altegio 25g algae → 00140 (23g). Peptide 38g → 00012 (39g).',
    ].join('\n'),
    positions,
  })

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
