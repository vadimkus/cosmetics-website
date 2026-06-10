#!/usr/bin/env node
/**
 * Final validation of 2025 statements vs live MoySklad data.
 * Pulls Revenue, COGS, Inventory at 31.12.2025, AR/AP at 31.12.2025, Losses (write-offs).
 * Compares against the figures on the regenerated PDFs.
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const login = process.env.MOYSKLAD_LOGIN
const password = process.env.MOYSKLAD_PASSWORD
if (!login || !password) { console.error('Set MOYSKLAD_LOGIN and MOYSKLAD_PASSWORD'); process.exit(1) }
const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')

async function api(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch(url, { headers: { Authorization: AUTH, 'Accept-Encoding': 'gzip', 'Accept': 'application/json;charset=utf-8' } })
      if (r.status === 429 || r.status >= 500) { await new Promise(r => setTimeout(r, 600 * (attempt + 1))); continue }
      if (!r.ok) { console.error(`HTTP ${r.status} ${url.slice(0, 140)}`); return null }
      return r.json()
    } catch (e) {
      if (attempt === 3) { console.error('Fetch failed', e.message); return null }
      await new Promise(r => setTimeout(r, 600 * (attempt + 1)))
    }
  }
  return null
}

async function fetchRange(endpoint, from, to) {
  let all = []; let offset = 0
  const filter = `moment>=${from} 00:00:00;moment<=${to} 23:59:59`
  while (true) {
    const url = `${API}${endpoint}?limit=1000&offset=${offset}&filter=${encodeURIComponent(filter)}&order=moment,asc`
    const d = await api(url); if (!d) break
    all = all.concat(d.rows || [])
    if ((d.rows || []).length < 1000) break
    offset += 1000
  }
  return all
}

async function fetchDemandCOGSandRevenue(demands) {
  let totalCost = 0, totalRev = 0
  const BATCH = 25
  for (let i = 0; i < demands.length; i += BATCH) {
    const chunk = demands.slice(i, i + BATCH)
    const results = await Promise.all(chunk.map(async (d) => {
      const posHref = d.positions?.meta?.href
      if (!posHref) return { cost: 0, rev: 0 }
      const data = await api(posHref + '?limit=1000')
      if (!data) return { cost: 0, rev: 0 }
      let cost = 0, rev = 0
      for (const p of (data.rows || [])) {
        const q = p.quantity || 0
        const price = (p.price || 0) - ((p.price || 0) * (p.discount || 0) / 100)
        cost += (p.cost || 0) * q
        rev += price * q
      }
      return { cost, rev }
    }))
    for (const r of results) { totalCost += r.cost; totalRev += r.rev }
    process.stdout.write(`    positions ${Math.min(i + BATCH, demands.length)}/${demands.length}\r`)
  }
  console.log('')
  return { cogs: totalCost / 100, revenue: totalRev / 100 }
}

async function fetchInventoryAtDate(dateISO) {
  // stock/all snapshot at moment=dateISO (using ?moment=)
  // returns rows with .stock (qty) and .price (avg cost in kopecks/cents)
  let all = []; let offset = 0
  while (true) {
    const url = `${API}/report/stock/all?limit=1000&offset=${offset}&moment=${encodeURIComponent(dateISO)}`
    const d = await api(url); if (!d) break
    all = all.concat(d.rows || [])
    if ((d.rows || []).length < 1000) break
    offset += 1000
  }
  let totalValue = 0; let totalQty = 0
  for (const r of all) {
    totalValue += (r.stock || 0) * (r.price || 0) / 100
    totalQty += (r.stock || 0)
  }
  return { value: totalValue / 100, qty: totalQty, lines: all.length }
}

async function fetchOutstanding(endpoint, from, to, sign) {
  // Sums sum/100 across all docs in range for the AR/AP rough check
  const rows = await fetchRange(endpoint, from, to)
  let total = 0
  for (const r of rows) total += (r.sum || 0)
  return { total: total / 100, count: rows.length }
}

async function fetchLosses(from, to) {
  let all = []; let offset = 0
  const filter = `moment>=${from} 00:00:00;moment<=${to} 23:59:59`
  while (true) {
    const url = `${API}/entity/loss?limit=1000&offset=${offset}&filter=${encodeURIComponent(filter)}&order=moment,asc`
    const d = await api(url); if (!d) break
    all = all.concat(d.rows || [])
    if ((d.rows || []).length < 1000) break
    offset += 1000
  }
  let totalSum = 0
  for (const r of all) totalSum += (r.sum || 0)
  return { count: all.length, total: totalSum / 100 }
}

async function main() {
  const FROM = '2025-01-01', TO = '2025-12-31', AT = '2025-12-31 23:59:59'
  console.log('━━━ 2025 FINAL FIGURES VALIDATION ━━━')
  console.log(`Period: ${FROM} → ${TO}\n`)

  console.log('1) Pulling Demands (revenue + COGS)...')
  const demands = await fetchRange('/entity/demand', FROM, TO)
  console.log(`   Demand docs: ${demands.length}`)
  const { cogs, revenue: revDemand } = await fetchDemandCOGSandRevenue(demands)
  // Also sum top-level demand.sum (gross before discount calc) for cross-check
  let demandTopSum = 0
  for (const d of demands) demandTopSum += (d.sum || 0)
  demandTopSum /= 100

  console.log('\n2) Pulling SalesReturns (revenue credits)...')
  const returns = await fetchRange('/entity/salesreturn', FROM, TO)
  let returnsSum = 0
  for (const r of returns) returnsSum += (r.sum || 0)
  returnsSum /= 100

  console.log('\n3) Pulling Inventory snapshot at 31.12.2025 (cost basis)...')
  const inv = await fetchInventoryAtDate(AT)
  console.log(`   Lines: ${inv.lines}, Qty: ${inv.qty}, Value: AED ${inv.value.toFixed(2)}`)

  console.log('\n4) Pulling Losses (inventory write-offs) for 2025...')
  const losses = await fetchLosses(FROM, TO)

  console.log('\n5) Pulling Invoice/Payment streams for AR/AP rough check...')
  const invoiceOut = await fetchOutstanding('/entity/invoiceout', FROM, TO, +1)
  const paymentIn  = await fetchOutstanding('/entity/paymentin',  FROM, TO, -1)
  const cashIn     = await fetchOutstanding('/entity/cashin',     FROM, TO, -1)
  const invoiceIn  = await fetchOutstanding('/entity/invoicein',  FROM, TO, +1)
  const paymentOut = await fetchOutstanding('/entity/paymentout', FROM, TO, -1)
  const cashOut    = await fetchOutstanding('/entity/cashout',    FROM, TO, -1)

  // === REPORT ===
  const PDF = {
    revenue: 1365229,
    cogs: 415366,
    inventory: 92743,
    writeoffs: 25194,
    ar: 10286,
    apTrade: 5769,
    apVAT: 14231,
    cash: 166953,
  }
  const fmt = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
  const diffPct = (live, pdf) => pdf ? `${((live - pdf) / pdf * 100).toFixed(2)}%` : 'n/a'

  console.log('\n══════════ COMPARISON: LIVE MoySklad  vs  PDF figures ══════════\n')

  console.log('REVENUE')
  console.log(`  PDF                            : AED ${fmt(PDF.revenue)}`)
  console.log(`  Live | Demand sum (top-level)  : AED ${fmt(demandTopSum)}   diff ${fmt(demandTopSum - PDF.revenue)}  (${diffPct(demandTopSum, PDF.revenue)})`)
  console.log(`  Live | Demand positions (revenue line items) : AED ${fmt(revDemand)}   diff ${fmt(revDemand - PDF.revenue)}  (${diffPct(revDemand, PDF.revenue)})`)
  console.log(`  Live | SalesReturns (credits)  : AED ${fmt(returnsSum)}`)
  console.log(`  Live | Net = Demand - Returns  : AED ${fmt(demandTopSum - returnsSum)}   diff ${fmt((demandTopSum - returnsSum) - PDF.revenue)}  (${diffPct(demandTopSum - returnsSum, PDF.revenue)})`)

  console.log('\nCOST OF REVENUE (COGS)')
  console.log(`  PDF                            : AED ${fmt(PDF.cogs)}`)
  console.log(`  Live | sum(unit_cost*qty) from demand positions : AED ${fmt(cogs)}   diff ${fmt(cogs - PDF.cogs)}  (${diffPct(cogs, PDF.cogs)})`)

  console.log('\nINVENTORY @ 31.12.2025 (cost basis)')
  console.log(`  PDF                            : AED ${fmt(PDF.inventory)}`)
  console.log(`  Live | stock/all moment=31.12  : AED ${fmt(inv.value)}   diff ${fmt(inv.value - PDF.inventory)}  (${diffPct(inv.value, PDF.inventory)})`)

  console.log('\nINVENTORY WRITE-OFFS (Losses)')
  console.log(`  PDF                            : AED ${fmt(PDF.writeoffs)}`)
  console.log(`  Live | sum of Loss docs 2025   : AED ${fmt(losses.total)}   diff ${fmt(losses.total - PDF.writeoffs)}  (${diffPct(losses.total, PDF.writeoffs)})   (count=${losses.count})`)

  console.log('\nDOCUMENT FLOW SUMMARY (for AR/AP context)')
  console.log(`  Invoices Out (issued in 2025)  : AED ${fmt(invoiceOut.total)}   docs=${invoiceOut.count}`)
  console.log(`  Payments In (received in 2025) : AED ${fmt(paymentIn.total)}   docs=${paymentIn.count}`)
  console.log(`  Cash In (cashbox in 2025)      : AED ${fmt(cashIn.total)}   docs=${cashIn.count}`)
  console.log(`  Net (InvOut - PayIn - CashIn)  : AED ${fmt(invoiceOut.total - paymentIn.total - cashIn.total)}`)
  console.log(`  Invoices In (supplier 2025)    : AED ${fmt(invoiceIn.total)}   docs=${invoiceIn.count}`)
  console.log(`  Payments Out (paid in 2025)    : AED ${fmt(paymentOut.total)}   docs=${paymentOut.count}`)
  console.log(`  Cash Out (cashbox in 2025)     : AED ${fmt(cashOut.total)}   docs=${cashOut.count}`)
  console.log(`  Net (InvIn - PayOut - CashOut) : AED ${fmt(invoiceIn.total - paymentOut.total - cashOut.total)}`)

  console.log('\nNOTE: AR/AP shown as 2025 movement only — outstanding balance at year-end requires opening receivables/payables, which MoySklad CRM tariff blocks via /report/counterparty.')
  console.log('Use the differential vs PDF as a sanity check on direction of accumulation, not a balance-level reconciliation.')

  console.log('\n══════════ DONE ══════════')
}

main().catch(e => { console.error(e); process.exit(1) })
