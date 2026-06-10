#!/usr/bin/env node
/**
 * GENOSYS UAE YTD profitability from MoySklad (profit report + payment-outs + losses).
 * Methodology aligned with docs/SESSION_CHANGES_2026-05-16_MONTH_TO_DATE_FINANCIAL_CHECK.md
 *
 * Usage:
 *   node --import dotenv/config scripts/moysklad-ytd-profitability.js
 *   node --import dotenv/config scripts/moysklad-ytd-profitability.js --from 2026-01-01 --to 2026-06-07
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const login = process.env.MOYSKLAD_LOGIN
const password = process.env.MOYSKLAD_PASSWORD
if (!login || !password) {
  console.error('Set MOYSKLAD_LOGIN and MOYSKLAD_PASSWORD in .env')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')

function parseArgs() {
  const args = process.argv.slice(2)
  let from = '2026-01-01'
  let to = '2026-06-07'
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--from' && args[i + 1]) from = args[++i]
    if (args[i] === '--to' && args[i + 1]) to = args[++i]
  }
  return { from, to }
}

async function apiGet(path, attempt = 1) {
  const url = path.startsWith('http') ? path : `${API}${path}`
  const r = await fetch(url, {
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })
  if (r.status === 429 && attempt < 8) {
    await new Promise((res) => setTimeout(res, 800 * attempt))
    return apiGet(path, attempt + 1)
  }
  if (!r.ok) {
    const text = await r.text()
    throw new Error(`HTTP ${r.status} ${url.slice(0, 100)} — ${text.slice(0, 200)}`)
  }
  await new Promise((res) => setTimeout(res, 350))
  return r.json()
}

async function fetchAllRows(path) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const page = await apiGet(`${path}${sep}limit=1000&offset=${offset}`)
    const pageRows = page.rows || []
    rows.push(...pageRows)
    if (pageRows.length < 1000) break
    offset += 1000
  }
  return rows
}

async function fetchDocs(endpoint, fromMoment, toMoment) {
  const filter = `moment>=${fromMoment};moment<=${toMoment}`
  return fetchAllRows(`/entity/${endpoint}?filter=${encodeURIComponent(filter)}&order=moment,asc`)
}

function cents(v) {
  return (v || 0) / 100
}

function fmt(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function exVat(inclVat) {
  return inclVat / 1.05
}

function isGoodsPurchase(expense) {
  return /закупка товаров|goods purchase/i.test(expense || '')
}

function isTaxPayment(expense, description = '') {
  return /налоги|tax/i.test(`${expense} ${description}`)
}

async function resolveName(ref, cache) {
  if (ref?.name) return ref.name
  const href = ref?.meta?.href
  if (!href) return '(unknown)'
  if (cache.has(href)) return cache.get(href)
  const data = await apiGet(href)
  const name = data.name || '(unknown)'
  cache.set(href, name)
  return name
}

async function resolvePayments(rows) {
  const cache = new Map()
  const payments = []
  for (const row of rows) {
    const expense = await resolveName(row.expenseItem, cache)
    const agent = await resolveName(row.agent, cache)
    payments.push({
      date: (row.moment || '').slice(0, 10),
      number: row.name || '',
      agent,
      expense,
      description: row.description || '',
      amount: cents(row.sum),
    })
  }
  return payments
}

function bucketExpenses(payments) {
  const buckets = {}
  for (const p of payments) {
    buckets[p.expense] = (buckets[p.expense] || 0) + p.amount
  }
  return Object.entries(buckets).sort((a, b) => b[1] - a[1])
}

async function main() {
  const { from, to } = parseArgs()
  const fromMoment = `${from} 00:00:00`
  const toMoment = `${to} 23:59:59`
  const momentParams = `momentFrom=${encodeURIComponent(fromMoment)}&momentTo=${encodeURIComponent(toMoment)}`

  console.log(`\nGENOSYS UAE profitability — ${from} → ${to} (UAE time)\n`)

  console.log('Fetching profit reports…')
  const byProduct = await fetchAllRows(`/report/profit/byproduct?${momentParams}`)
  const byCounterparty = await fetchAllRows(`/report/profit/bycounterparty?${momentParams}`)
  console.log('Fetching payment/cash/loss docs…')
  const paymentOut = await fetchDocs('paymentout', fromMoment, toMoment)
  const cashOut = await fetchDocs('cashout', fromMoment, toMoment)
  const paymentIn = await fetchDocs('paymentin', fromMoment, toMoment)
  const cashIn = await fetchDocs('cashin', fromMoment, toMoment)
  const losses = await fetchDocs('loss', fromMoment, toMoment)

  const sellSum = byCounterparty.reduce((s, r) => s + cents(r.sellSum), 0)
  const returnSum = byCounterparty.reduce((s, r) => s + cents(r.returnSum), 0)
  const sellCost = byCounterparty.reduce((s, r) => s + cents(r.sellCostSum), 0)
  const returnCost = byCounterparty.reduce((s, r) => s + cents(r.returnCostSum), 0)
  const profitReport = byCounterparty.reduce((s, r) => s + cents(r.profit), 0)

  const revenueInclVat = sellSum - returnSum
  const cogs = sellCost - returnCost
  const grossProfitInclVat = profitReport
  const revenueExVat = exVat(revenueInclVat)
  const grossProfitExVat = revenueExVat - cogs
  const grossMarginExVat = revenueExVat > 0 ? (grossProfitExVat / revenueExVat) * 100 : 0

  const soldQty = byProduct
    .filter((r) => r.assortment?.meta?.type !== 'service')
    .reduce((s, r) => s + (r.sellQuantity || 0) - (r.returnQuantity || 0), 0)

  const outgoing = await resolvePayments([...paymentOut, ...cashOut])
  const totalPaid = outgoing.reduce((s, p) => s + p.amount, 0)
  const stockExcluded = outgoing.filter((p) => isGoodsPurchase(p.expense)).reduce((s, p) => s + p.amount, 0)
  const taxExcluded = outgoing.filter((p) => isTaxPayment(p.expense, p.description)).reduce((s, p) => s + p.amount, 0)
  const operatingOpex = totalPaid - stockExcluded - taxExcluded
  const writeOffs = losses.reduce((s, r) => s + cents(r.sum), 0)

  const netClean = grossProfitExVat - operatingOpex - writeOffs
  const cashCollected = paymentIn.reduce((s, r) => s + cents(r.sum), 0) + cashIn.reduce((s, r) => s + cents(r.sum), 0)
  const cashPaid = totalPaid
  const cashNet = cashCollected - cashPaid

  const expenseBuckets = bucketExpenses(outgoing.filter((p) => !isGoodsPurchase(p.expense) && !isTaxPayment(p.expense, p.description)))

  const result = {
    period: { from, to },
    revenueInclVat,
    revenueExVat,
    cogs,
    grossProfitInclVat,
    grossProfitExVat,
    grossMarginExVat,
    soldQty,
    totalPaid,
    stockExcluded,
    taxExcluded,
    operatingOpex,
    writeOffs,
    netClean,
    cashCollected,
    cashPaid,
    cashNet,
    expenseBuckets,
  }

  console.log('=== P&L (MoySklad profit report) ===')
  console.log(`Revenue incl. VAT:     AED ${fmt(revenueInclVat)}`)
  console.log(`Revenue excl. VAT:     AED ${fmt(revenueExVat)}`)
  console.log(`COGS:                  AED ${fmt(cogs)}`)
  console.log(`Gross profit excl VAT: AED ${fmt(grossProfitExVat)}`)
  console.log(`Gross margin excl VAT: ${grossMarginExVat.toFixed(2)}%`)
  console.log(`Sold quantity:         ${soldQty.toLocaleString()} units`)
  console.log('')
  console.log('=== Cash outflows ===')
  console.log(`Total payment-outs:    AED ${fmt(totalPaid)}`)
  console.log(`  − Stock purchases:   AED ${fmt(stockExcluded)} (excluded — inventory)`)
  console.log(`  − VAT/tax remit:     AED ${fmt(taxExcluded)} (excluded — pass-through)`)
  console.log(`Operating opex:        AED ${fmt(operatingOpex)}`)
  console.log(`Write-offs/losses:     AED ${fmt(writeOffs)}`)
  console.log('')
  console.log('=== Net result ===')
  console.log(`Net clean money:       AED ${fmt(netClean)}`)
  console.log(`  (= gross profit ex VAT − operating opex − write-offs)`)
  console.log('')
  console.log('=== Cash flow ===')
  console.log(`Cash in (payment-in):  AED ${fmt(cashCollected)}`)
  console.log(`Cash out (all):        AED ${fmt(cashPaid)}`)
  console.log(`Cash net:              AED ${fmt(cashNet)}`)
  console.log('')
  console.log('=== Top operating expense buckets ===')
  for (const [name, amt] of expenseBuckets.slice(0, 8)) {
    console.log(`  ${name.padEnd(36)} AED ${fmt(amt)}`)
  }

  console.log('\n--- JSON ---')
  console.log(JSON.stringify(result, null, 2))
}

main().catch((err) => {
  console.error('Fatal:', err.message || err)
  process.exit(1)
})
