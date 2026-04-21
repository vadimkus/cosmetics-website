#!/usr/bin/env node

/**
 * Multi-year P&L analysis (2024, 2025, 2026 YTD) from MoySklad.
 *
 * Metrics used:
 *  - Revenue = Demand (actual shipments) — most accurate realized revenue
 *  - COGS    = sum of position cost * quantity on each Demand line (cost-of-goods-actually-shipped)
 *  - OpEx    = PaymentOut with expenseItem filtering to exclude supplier payments (COGS)
 *  - Cash In / Out = PaymentIn + CashIn / PaymentOut + CashOut (cash-basis)
 *  - Returns = SalesReturn (revenue credits)
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const login = process.env.MOYSKLAD_LOGIN
const password = process.env.MOYSKLAD_PASSWORD
if (!login || !password) { console.error('Set MOYSKLAD_LOGIN and MOYSKLAD_PASSWORD'); process.exit(1) }
const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')

async function api(url) {
  const r = await fetch(url, { headers: { Authorization: AUTH, 'Accept-Encoding': 'gzip', 'Accept': 'application/json;charset=utf-8' } })
  if (!r.ok) { console.error(`HTTP ${r.status} ${url.slice(0,120)}`); return null }
  return r.json()
}

async function fetchRange(endpoint, from, to, opts = {}) {
  let all = []
  let offset = 0
  const filter = `moment>=${from} 00:00:00;moment<=${to} 23:59:59`
  const expand = opts.expand ? `&expand=${opts.expand}` : ''
  while (true) {
    const url = `${API}${endpoint}?limit=1000&offset=${offset}&filter=${encodeURIComponent(filter)}&order=moment,asc${expand}`
    const d = await api(url)
    if (!d) break
    all = all.concat(d.rows || [])
    if ((d.rows || []).length < 1000) break
    offset += 1000
  }
  return all
}

// Fetch demand positions in batches (to compute COGS)
async function fetchDemandCOGS(demands) {
  let totalCost = 0
  let totalRevenue = 0
  let totalQty = 0
  // Demand positions come embedded when we expand=positions, but we hit query limits.
  // Instead, pull positions per demand doc in parallel batches.
  const BATCH = 25
  for (let i = 0; i < demands.length; i += BATCH) {
    const chunk = demands.slice(i, i + BATCH)
    const results = await Promise.all(chunk.map(async (d) => {
      const posHref = d.positions?.meta?.href
      if (!posHref) return { cost: 0, rev: 0, qty: 0 }
      const data = await api(posHref + '?limit=1000')
      if (!data) return { cost: 0, rev: 0, qty: 0 }
      let cost = 0, rev = 0, qty = 0
      for (const p of (data.rows || [])) {
        const q = p.quantity || 0
        const price = (p.price || 0) - ((p.price || 0) * (p.discount || 0) / 100)
        const unitCost = p.cost || 0
        cost += unitCost * q
        rev += price * q
        qty += q
      }
      return { cost, rev, qty }
    }))
    for (const r of results) {
      totalCost += r.cost
      totalRevenue += r.rev
      totalQty += r.qty
    }
    process.stdout.write(`    positions ${Math.min(i + BATCH, demands.length)}/${demands.length}\r`)
  }
  console.log('')
  return { cogs: totalCost, revenueFromPositions: totalRevenue, qty: totalQty }
}

async function analyzeYear(year, from, to) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`  ANALYZING ${year}  (${from} → ${to})`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  const demands = await fetchRange('/entity/demand', from, to)
  console.log(`  Demands (shipments):       ${demands.length} docs`)

  const invoicesOut = await fetchRange('/entity/invoiceout', from, to)
  const invoicesIn = await fetchRange('/entity/invoicein', from, to)
  const supply = await fetchRange('/entity/supply', from, to)
  const salesReturns = await fetchRange('/entity/salesreturn', from, to)
  const paymentsOut = await fetchRange('/entity/paymentout', from, to)
  const paymentsIn = await fetchRange('/entity/paymentin', from, to)
  const cashIn = await fetchRange('/entity/cashin', from, to)
  const cashOut = await fetchRange('/entity/cashout', from, to)
  const losses = await fetchRange('/entity/loss', from, to)

  console.log(`  InvoicesOut:               ${invoicesOut.length}`)
  console.log(`  InvoicesIn:                ${invoicesIn.length}`)
  console.log(`  Supply (goods received):   ${supply.length}`)
  console.log(`  Sales returns:             ${salesReturns.length}`)
  console.log(`  Payments Out:              ${paymentsOut.length}`)
  console.log(`  Payments In:               ${paymentsIn.length}`)
  console.log(`  Losses:                    ${losses.length}`)

  console.log(`\n  Computing COGS from demand positions...`)
  const { cogs, revenueFromPositions, qty } = await fetchDemandCOGS(demands)

  const demandTotal = demands.reduce((s, d) => s + (d.sum || 0), 0)

  const sum = arr => arr.reduce((s, d) => s + (d.sum || 0), 0)

  return {
    year,
    demands: demands.length,
    units: qty,
    revenue: demandTotal / 100,
    revenueFromPositions: revenueFromPositions / 100,
    cogs: cogs / 100,
    invoicesOut: sum(invoicesOut) / 100,
    invoicesIn: sum(invoicesIn) / 100,
    supply: sum(supply) / 100,
    salesReturns: sum(salesReturns) / 100,
    paymentsOut: sum(paymentsOut) / 100,
    paymentsIn: sum(paymentsIn) / 100,
    cashIn: sum(cashIn) / 100,
    cashOut: sum(cashOut) / 100,
    losses: sum(losses) / 100,
    paymentsOutRaw: paymentsOut,
    cashOutRaw: cashOut,
  }
}

async function resolveExpenseCategories(paymentsOut) {
  const expenseCache = {}
  const agentCache = {}
  const uniqueExpHrefs = [...new Set(paymentsOut.map(p => p.expenseItem?.meta?.href).filter(Boolean))]
  const uniqueAgentHrefs = [...new Set(paymentsOut.map(p => p.agent?.meta?.href).filter(Boolean))]

  await Promise.all(uniqueExpHrefs.map(async href => {
    const d = await api(href)
    expenseCache[href] = d?.name || '?'
  }))
  await Promise.all(uniqueAgentHrefs.map(async href => {
    const d = await api(href)
    agentCache[href] = d?.name || '?'
  }))

  const byExpense = {}
  const byAgent = {}
  for (const p of paymentsOut) {
    const exp = expenseCache[p.expenseItem?.meta?.href] || 'Uncategorized / Supplier'
    const agt = agentCache[p.agent?.meta?.href] || 'Unknown'
    const amt = (p.sum || 0) / 100
    byExpense[exp] = (byExpense[exp] || 0) + amt
    byAgent[agt] = (byAgent[agt] || 0) + amt
  }
  return { byExpense, byAgent }
}

function fmt(n) { return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

function printPnL(y) {
  const grossProfit = y.revenue - y.cogs
  const grossMarginPct = y.revenue > 0 ? (grossProfit / y.revenue) * 100 : 0
  console.log(`\n  ┌─ P&L ${y.year} (shipment-basis / accrual) ─────────────────────────┐`)
  console.log(`  │ Revenue (Demands, gross)       ${fmt(y.revenue).padStart(15)} AED │`)
  console.log(`  │ Sales Returns                 -${fmt(y.salesReturns).padStart(14)} AED │`)
  const netRev = y.revenue - y.salesReturns
  console.log(`  │ Net Revenue                    ${fmt(netRev).padStart(15)} AED │`)
  console.log(`  │ COGS (cost of goods shipped)  -${fmt(y.cogs).padStart(14)} AED │`)
  console.log(`  │ ═══════════════════════════════════════════════ │`)
  console.log(`  │ GROSS PROFIT                   ${fmt(grossProfit).padStart(15)} AED │`)
  console.log(`  │ Gross Margin                   ${grossMarginPct.toFixed(1).padStart(15)} %   │`)
  console.log(`  │ Units shipped                  ${y.units.toLocaleString().padStart(15)}     │`)
  console.log(`  │ Demand docs                    ${y.demands.toLocaleString().padStart(15)}     │`)
  console.log(`  └──────────────────────────────────────────────────┘`)
}

function printCashflow(y) {
  const totalIn = y.paymentsIn + y.cashIn
  const totalOut = y.paymentsOut + y.cashOut
  const net = totalIn - totalOut
  console.log(`\n  ┌─ CASH FLOW ${y.year} ────────────────────────────────────────┐`)
  console.log(`  │ Payments In (bank)             ${fmt(y.paymentsIn).padStart(15)} AED │`)
  console.log(`  │ Cash In (till)                 ${fmt(y.cashIn).padStart(15)} AED │`)
  console.log(`  │ TOTAL CASH IN                  ${fmt(totalIn).padStart(15)} AED │`)
  console.log(`  │                                                  │`)
  console.log(`  │ Payments Out (bank)           -${fmt(y.paymentsOut).padStart(14)} AED │`)
  console.log(`  │ Cash Out (till)               -${fmt(y.cashOut).padStart(14)} AED │`)
  console.log(`  │ TOTAL CASH OUT                -${fmt(totalOut).padStart(14)} AED │`)
  console.log(`  │ ═══════════════════════════════════════════════ │`)
  console.log(`  │ NET CASH FLOW                  ${fmt(net).padStart(15)} AED │`)
  console.log(`  └──────────────────────────────────────────────────┘`)
}

async function main() {
  console.log('\n═══════════════════════════════════════════════════════════════════')
  console.log('  GENOSYS UAE — MULTI-YEAR P&L ANALYSIS (MoySklad data)')
  console.log('═══════════════════════════════════════════════════════════════════')

  const today = new Date().toISOString().slice(0, 10)
  const years = [
    { year: 2024, from: '2024-01-01', to: '2024-12-31' },
    { year: 2025, from: '2025-01-01', to: '2025-12-31' },
    { year: 2026, from: '2026-01-01', to: today },
  ]

  const results = []
  for (const y of years) {
    const r = await analyzeYear(y.year, y.from, y.to)
    results.push(r)
    printPnL(r)
    printCashflow(r)

    // Expense categorization
    console.log(`\n  Resolving expense categories for ${r.year}...`)
    const { byExpense, byAgent } = await resolveExpenseCategories(r.paymentsOutRaw)
    console.log(`\n  ┌─ TOP EXPENSE CATEGORIES ${r.year} ──────────────────────────┐`)
    const topExp = Object.entries(byExpense).sort((a, b) => b[1] - a[1]).slice(0, 10)
    for (const [name, amt] of topExp) {
      console.log(`  │ ${name.padEnd(34)} ${fmt(amt).padStart(15)} AED │`)
    }
    console.log(`  └──────────────────────────────────────────────────┘`)

    console.log(`\n  ┌─ TOP COUNTERPARTIES (outflow) ${r.year} ────────────────────┐`)
    const topAgent = Object.entries(byAgent).sort((a, b) => b[1] - a[1]).slice(0, 10)
    for (const [name, amt] of topAgent) {
      console.log(`  │ ${name.slice(0, 34).padEnd(34)} ${fmt(amt).padStart(15)} AED │`)
    }
    console.log(`  └──────────────────────────────────────────────────┘`)
  }

  // Comparison table
  console.log('\n\n═══════════════════════════════════════════════════════════════════')
  console.log('  3-YEAR COMPARISON')
  console.log('═══════════════════════════════════════════════════════════════════')
  const rows = [
    ['Metric', '2024', '2025', '2026 YTD'],
    ['Revenue (gross)', ...results.map(r => fmt(r.revenue))],
    ['Sales Returns', ...results.map(r => fmt(r.salesReturns))],
    ['Net Revenue', ...results.map(r => fmt(r.revenue - r.salesReturns))],
    ['COGS', ...results.map(r => fmt(r.cogs))],
    ['Gross Profit', ...results.map(r => fmt(r.revenue - r.salesReturns - r.cogs))],
    ['Gross Margin %', ...results.map(r => {
      const gp = r.revenue - r.salesReturns - r.cogs
      return r.revenue > 0 ? ((gp / r.revenue) * 100).toFixed(1) + '%' : '—'
    })],
    ['Units shipped', ...results.map(r => r.units.toLocaleString())],
    ['Payments Out (all)', ...results.map(r => fmt(r.paymentsOut))],
    ['Payments In (all)', ...results.map(r => fmt(r.paymentsIn))],
    ['Net cash flow', ...results.map(r => fmt((r.paymentsIn + r.cashIn) - (r.paymentsOut + r.cashOut)))],
    ['Losses (inventory)', ...results.map(r => fmt(r.losses))],
  ]

  const colW = [22, 18, 18, 18]
  for (const row of rows) {
    console.log(row.map((c, i) => String(c).padStart(i === 0 ? -colW[i] : colW[i]).padEnd(i === 0 ? colW[i] : undefined)).join(' │ '))
    if (row[0] === 'Metric') console.log('─'.repeat(colW.reduce((a, b) => a + b + 3, 0)))
  }

  // Save results as JSON for further analysis
  const fs = require('fs')
  fs.writeFileSync('/tmp/genosys-pnl.json', JSON.stringify(results, null, 2))
  console.log('\n  Raw data saved to /tmp/genosys-pnl.json')
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
