#!/usr/bin/env node

/**
 * MoySklad Restocking Analysis
 *
 * Pulls current stock + consumption (turnover) over 30 & 90 days, then flags
 * SKUs that will stock out within a configurable horizon and proposes order qty.
 *
 * Methodology:
 *   - daily_rate_30d  = outcome (last 30 days) / 30
 *   - daily_rate_90d  = outcome (last 90 days) / 90
 *   - effective_rate  = max(daily_rate_30d, daily_rate_90d * 0.7)   // bias toward recent
 *   - days_cover      = current_stock / effective_rate
 *   - suggested_order = ceil(effective_rate * TARGET_COVER_DAYS) - current_stock
 *
 * Severity buckets:
 *   CRITICAL : days_cover < 30
 *   URGENT   : 30 ≤ days_cover < 60
 *   PLAN     : 60 ≤ days_cover < 90
 *   OK       : days_cover ≥ 90
 *
 * Output: console table + docs/MOYSKLAD_RESTOCK_<date>.txt
 *
 * Usage:
 *   MOYSKLAD_LOGIN="email" MOYSKLAD_PASSWORD="pass" \
 *     node scripts/moysklad-restock-analysis.js [--horizon=60] [--target=120]
 */

const fs = require('fs')
const path = require('path')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  })
)
const HORIZON = Number(args.horizon) || 60
const TARGET_COVER_DAYS = Number(args.target) || 120

// ───────────────────────────────────────────────────────────────────
// Do-not-reorder list
// ───────────────────────────────────────────────────────────────────
// SKUs that should remain visible in stock/sales reports but MUST NOT
// appear in reorder suggestions. Typical reasons:
//   - Discontinued by manufacturer (still selling through existing stock)
//   - Being reformulated / replaced by a new SKU
//   - Seasonal SKU on hold
// When the last unit is sold, archive the product in MoySklad and remove it here.
const DO_NOT_REORDER = {
  '00042': 'EGF Repair Oxymask Cream 50ml — discontinued by manufacturer; selling through stock',
  '00028': 'Skin Whitening Serum 30ml — replaced by Multi Vita Radiance Serum line; do not restock',
}

let output = []
const origLog = console.log.bind(console)
console.log = (...a) => {
  const line = a.map((x) => (typeof x === 'string' ? x : String(x))).join(' ')
  output.push(line)
  origLog(...a)
}

function fmtDate(d) {
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

function money(cents) {
  return (cents / 100).toFixed(2)
}

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { Authorization: AUTH, 'Accept-Encoding': 'gzip' },
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`HTTP ${res.status} on ${url.slice(0, 120)} — ${txt.slice(0, 200)}`)
  }
  return res.json()
}

async function fetchTurnover(fromDate, toDate, label) {
  const out = new Map()
  let offset = 0
  const limit = 1000
  while (true) {
    const url = `${API}/report/turnover/all?momentFrom=${encodeURIComponent(fromDate)}&momentTo=${encodeURIComponent(toDate)}&limit=${limit}&offset=${offset}`
    const data = await fetchJSON(url)
    const rows = data.rows || []
    for (const r of rows) {
      const a = r.assortment || {}
      const key = a.code || a.name
      if (!key) continue
      out.set(key, {
        name: a.name || '?',
        code: a.code || '',
        beginQty: r.onPeriodStart?.quantity || 0,
        endQty: r.onPeriodEnd?.quantity || 0,
        income: r.income?.quantity || 0,
        outcome: r.outcome?.quantity || 0,
      })
    }
    console.log(`  [${label}] ${out.size} SKUs loaded${data.meta?.size ? ` / ${data.meta.size}` : ''}`)
    if (rows.length < limit) break
    offset += limit
  }
  return out
}

async function fetchArchivedCodes() {
  // Build a Set of product codes that are archived in MoySklad.
  // These still appear in historical turnover reports, so we filter them out
  // of the restock analysis to avoid false stockout alerts.
  const archived = new Set()
  let offset = 0
  const limit = 1000
  while (true) {
    const url = `${API}/entity/product?filter=archived=true&limit=${limit}&offset=${offset}`
    const data = await fetchJSON(url)
    for (const p of data.rows || []) {
      if (p.code) archived.add(p.code)
    }
    if ((data.rows || []).length < limit) break
    offset += limit
  }
  console.log(`  [archived] ${archived.size} archived product codes (will be excluded)`)
  return archived
}

async function fetchStockAll() {
  const out = new Map()
  let offset = 0
  const limit = 1000
  // stockMoreThan=-1 forces MoySklad to include zero-stock and negative-stock items
  while (true) {
    const url = `${API}/report/stock/all?limit=${limit}&offset=${offset}&stockMode=all&stockMoreThan=-1`
    const data = await fetchJSON(url)
    const rows = data.rows || []
    for (const r of rows) {
      const key = r.code || r.name
      if (!key) continue
      out.set(key, {
        name: r.name,
        code: r.code || '',
        stock: r.stock || 0,
        reserve: r.reserve || 0,
        inTransit: r.inTransit || 0,
        quantity: r.quantity || 0,
        salePriceMinor: r.salePrice || 0,
      })
    }
    console.log(`  [stock]  ${out.size} SKUs loaded${data.meta?.size ? ` / ${data.meta.size}` : ''}`)
    if (rows.length < limit) break
    offset += limit
  }
  return out
}

function severity(daysCover) {
  if (daysCover === Infinity) return 'OK'
  if (daysCover < 30) return 'CRITICAL'
  if (daysCover < 60) return 'URGENT'
  if (daysCover < 90) return 'PLAN'
  return 'OK'
}

function pad(s, n, align = 'left') {
  s = String(s)
  if (s.length > n) return s.slice(0, n - 1) + '…'
  return align === 'right' ? s.padStart(n) : s.padEnd(n)
}

async function main() {
  const now = new Date()
  const d90 = new Date(now.getTime() - 90 * 24 * 3600 * 1000)
  const d30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000)

  const from90 = fmtDate(d90)
  const from30 = fmtDate(d30)
  const to = fmtDate(now)

  console.log('╔════════════════════════════════════════════════════════════════════════════════╗')
  console.log('║  MOYSKLAD RESTOCKING ANALYSIS — Genosys Middle East FZ-LLC                    ║')
  console.log(`║  Generated: ${now.toLocaleString('en-GB').padEnd(66)}║`)
  console.log(`║  Horizon: stock-out within ${HORIZON} days  |  Target cover: ${TARGET_COVER_DAYS} days${' '.repeat(15)}║`)
  console.log('╚════════════════════════════════════════════════════════════════════════════════╝')
  console.log()
  console.log(`Fetching MoySklad data...`)
  console.log(`  90-day window: ${from90} → ${to}`)
  console.log(`  30-day window: ${from30} → ${to}`)
  console.log()

  const [stock, t90, t30, archivedCodes] = await Promise.all([
    fetchStockAll(),
    fetchTurnover(from90, to, '90d'),
    fetchTurnover(from30, to, '30d'),
    fetchArchivedCodes(),
  ])

  // Merge — iterate over union of (stock SKUs) + (turnover SKUs)
  // SKUs in turnover but NOT in stock are STOCKOUTS (MoySklad's stock report
  // hides zero-stock items by default, which otherwise loses them from the analysis).
  const allKeys = new Set([...stock.keys(), ...t90.keys(), ...t30.keys()])
  const rows = []
  for (const key of allKeys) {
    if (archivedCodes.has(key)) continue  // skip archived SKUs entirely
    const s = stock.get(key) || {
      name: (t90.get(key) || t30.get(key))?.name || '?',
      code: (t90.get(key) || t30.get(key))?.code || '',
      stock: 0,
      reserve: 0,
      inTransit: 0,
      quantity: 0,
      salePriceMinor: 0,
    }
    const t = t90.get(key) || { outcome: 0, income: 0 }
    const t30r = t30.get(key) || { outcome: 0, income: 0 }
    const rate90 = t.outcome / 90
    const rate30 = t30r.outcome / 30
    const effectiveRate = Math.max(rate30, rate90 * 0.7)
    const available = s.stock - s.reserve // free-to-sell
    const daysCover = effectiveRate > 0 ? available / effectiveRate : Infinity
    const suggested = Math.max(0, Math.ceil(effectiveRate * TARGET_COVER_DAYS) - available - s.inTransit)
    // Special severity for stockouts with active demand
    let sev = available <= 0 && effectiveRate > 0 ? 'STOCKOUT' : severity(daysCover)
    const doNotReorderReason = DO_NOT_REORDER[s.code]
    if (doNotReorderReason) sev = 'NO_REORDER'
    rows.push({
      code: s.code,
      name: s.name,
      stock: s.stock,
      reserve: s.reserve,
      inTransit: s.inTransit,
      available,
      outcome30: t30r.outcome,
      outcome90: t.outcome,
      rate30,
      rate90,
      effectiveRate,
      daysCover,
      suggested: doNotReorderReason ? 0 : suggested,
      severity: sev,
      doNotReorderReason,
      salePriceMinor: s.salePriceMinor,
    })
  }

  // Sort: severity bucket, then days cover ascending
  const sevOrder = { STOCKOUT: -1, CRITICAL: 0, URGENT: 1, PLAN: 2, OK: 3, NO_REORDER: 4 }
  rows.sort((a, b) => {
    const d = sevOrder[a.severity] - sevOrder[b.severity]
    if (d) return d
    return a.daysCover - b.daysCover
  })

  // Print table
  const sections = ['STOCKOUT', 'CRITICAL', 'URGENT', 'PLAN']
  for (const sec of sections) {
    const slice = rows.filter((r) => r.severity === sec && r.suggested > 0)
    if (!slice.length) continue
    const headline =
      sec === 'STOCKOUT'
        ? '★ STOCKOUT — 0 units available but active demand (order IMMEDIATELY)'
        : sec === 'CRITICAL'
          ? 'CRITICAL — will stock out in < 30 days (order NOW)'
          : sec === 'URGENT'
            ? 'URGENT — will stock out in 30–60 days (order this week)'
            : 'PLAN — will stock out in 60–90 days (order within 2–3 weeks)'

    console.log()
    console.log('━'.repeat(130))
    console.log(`  ${headline}  — ${slice.length} SKUs`)
    console.log('━'.repeat(130))
    console.log(
      [
        pad('Code', 6),
        pad('Product', 55),
        pad('Stock', 7, 'right'),
        pad('Resv', 6, 'right'),
        pad('Avail', 7, 'right'),
        pad('30d sold', 9, 'right'),
        pad('90d sold', 9, 'right'),
        pad('Days', 6, 'right'),
        pad('Order', 7, 'right'),
      ].join(' | ')
    )
    console.log('-'.repeat(130))
    for (const r of slice) {
      console.log(
        [
          pad(r.code || '—', 6),
          pad(r.name, 55),
          pad(r.stock, 7, 'right'),
          pad(r.reserve, 6, 'right'),
          pad(r.available, 7, 'right'),
          pad(r.outcome30, 9, 'right'),
          pad(r.outcome90, 9, 'right'),
          pad(r.daysCover === Infinity ? '∞' : r.daysCover.toFixed(0), 6, 'right'),
          pad(r.suggested, 7, 'right'),
        ].join(' | ')
      )
    }
  }

  // ── Sell-through watch — do-not-reorder items still moving ──
  const watchList = rows.filter((r) => r.severity === 'NO_REORDER' && r.effectiveRate > 0)
  if (watchList.length) {
    console.log()
    console.log('━'.repeat(130))
    console.log(`  DO NOT REORDER — sell-through watch (${watchList.length} SKUs; excluded from PO suggestions)`)
    console.log('━'.repeat(130))
    console.log(
      [
        pad('Code', 6),
        pad('Product', 55),
        pad('Stock', 7, 'right'),
        pad('30d sold', 9, 'right'),
        pad('90d sold', 9, 'right'),
        pad('Days left', 10, 'right'),
        pad('Reason', 30),
      ].join(' | ')
    )
    console.log('-'.repeat(130))
    for (const r of watchList.sort((a, b) => a.daysCover - b.daysCover)) {
      console.log(
        [
          pad(r.code || '—', 6),
          pad(r.name, 55),
          pad(r.stock, 7, 'right'),
          pad(r.outcome30, 9, 'right'),
          pad(r.outcome90, 9, 'right'),
          pad(r.daysCover === Infinity ? '∞' : r.daysCover.toFixed(0), 10, 'right'),
          pad(r.doNotReorderReason.slice(0, 30), 30),
        ].join(' | ')
      )
    }
  }

  // Summary & proposed PO
  const criticalOrUrgent = rows.filter((r) => (r.severity === 'CRITICAL' || r.severity === 'URGENT') && r.suggested > 0)
  const allOrderable = rows.filter((r) => r.severity !== 'OK' && r.severity !== 'NO_REORDER' && r.suggested > 0)

  console.log()
  console.log('═'.repeat(130))
  console.log('  PROPOSED PURCHASE ORDER — sum of `Suggested Order` to reach ' + TARGET_COVER_DAYS + '-day cover')
  console.log('═'.repeat(130))
  console.log(
    [pad('Code', 6), pad('Product', 70), pad('Order Qty', 10, 'right'), pad('Est. Value (AED)', 18, 'right')].join(
      ' | '
    )
  )
  console.log('-'.repeat(130))
  let grandTotal = 0
  let grandUnits = 0
  for (const r of allOrderable) {
    // NB: salePriceMinor is retail, not cost. Shown only as order-value indicator.
    const estValue = (r.suggested * r.salePriceMinor) / 100
    grandTotal += estValue
    grandUnits += r.suggested
    console.log(
      [
        pad(r.code || '—', 6),
        pad(r.name, 70),
        pad(r.suggested, 10, 'right'),
        pad(estValue.toFixed(2), 18, 'right'),
      ].join(' | ')
    )
  }
  console.log('-'.repeat(130))
  console.log(
    [
      pad('', 6),
      pad('TOTAL', 70),
      pad(grandUnits, 10, 'right'),
      pad(grandTotal.toFixed(2) + ' AED*', 18, 'right'),
    ].join(' | ')
  )
  console.log()
  console.log('  * Value is based on MoySklad sale price (retail). Your actual supplier cost will be ~40–60% of this.')
  console.log()

  // Counts summary
  const byBucket = rows.reduce(
    (acc, r) => {
      acc[r.severity] = (acc[r.severity] || 0) + 1
      return acc
    },
    {}
  )
  console.log('  By severity:')
  for (const k of ['STOCKOUT', 'CRITICAL', 'URGENT', 'PLAN', 'OK', 'NO_REORDER']) {
    console.log(`    ${k.padEnd(10)} ${byBucket[k] || 0} SKUs`)
  }
  console.log()

  // Save
  const outDir = path.join(__dirname, '..', 'docs')
  const stamp = now.toISOString().slice(0, 10)
  const outPath = path.join(outDir, `MOYSKLAD_RESTOCK_${stamp}.txt`)
  fs.writeFileSync(outPath, output.join('\n'), 'utf-8')
  console.log(`Report saved to: ${path.relative(path.join(__dirname, '..'), outPath)}`)
}

main().catch((e) => {
  console.error('Fatal:', e.message)
  process.exit(1)
})
