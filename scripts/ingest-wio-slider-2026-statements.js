#!/usr/bin/env node
/**
 * Ingest Wio bank CSV exports (GENOSYS AED current account) — Slider_2026 analysis.
 *
 * Parses monthly Wio statements Jan–Jun 2026, merges transactions, dedupes by Ref. number,
 * and writes a JSON summary alongside the source CSVs.
 *
 * Usage:
 *   node scripts/ingest-wio-slider-2026-statements.js
 *   node scripts/ingest-wio-slider-2026-statements.js --dir data/wio-statements-2026-h1
 *   node scripts/ingest-wio-slider-2026-statements.js --iban AE110860000009833011607
 */

const fs = require('fs')
const path = require('path')

const DEFAULT_DIR = path.join(__dirname, '..', 'data', 'wio-statements-2026-h1')
const DEFAULT_IBAN = 'AE110860000009833011607'
const USD_IBAN = 'AE890860000009333280268'

const STATEMENT_FILES = [
  'statement(Jan 1, 2026 - Jan 31, 2026).csv',
  'statement(Feb 1, 2026 - Feb 28, 2026).csv',
  'statement(Mar 1, 2026 - Mar 31, 2026).csv',
  'statement(Apr 1, 2026 - Apr 30, 2026).csv',
  'statement(May 1, 2026 - May 31, 2026).csv',
  'statement(Jun 1, 2026 - Jun 26, 2026).csv',
]

const MONTH_LABELS = {
  '2026-01': 'Jan 2026',
  '2026-02': 'Feb 2026',
  '2026-03': 'Mar 2026',
  '2026-04': 'Apr 2026',
  '2026-05': 'May 2026',
  '2026-06': 'Jun 2026 (partial through 26th)',
}

function parseArgs() {
  const args = process.argv.slice(2)
  let dir = DEFAULT_DIR
  let iban = DEFAULT_IBAN
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir' && args[i + 1]) dir = path.resolve(args[++i])
    if (args[i] === '--iban' && args[i + 1]) iban = args[++i]
  }
  return { dir, iban }
}

/** Minimal RFC4180 CSV parser (handles quoted fields with commas). */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || (c === '\r' && text[i + 1] === '\n')) {
      row.push(field)
      if (row.length > 1 || row[0] !== '') rows.push(row)
      row = []
      field = ''
      if (c === '\r') i++
    } else if (c !== '\r') {
      field += c
    }
  }
  if (field.length || row.length) {
    row.push(field)
    if (row.length > 1 || row[0] !== '') rows.push(row)
  }
  return rows
}

function round2(n) {
  return Math.round(n * 100) / 100
}

function monthKey(dateStr) {
  return dateStr.slice(0, 7)
}

function emptyMonthBucket() {
  return { in: 0, out: 0, net: 0, count: 0 }
}

function parseStatementFile(filePath, sourceFile) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '')
  const rows = parseCsv(text)
  if (!rows.length) return []

  const header = rows[0]
  const col = (name) => header.indexOf(name)
  const idx = {
    iban: col('Account IBAN'),
    currency: col('Account currency'),
    type: col('Transaction type'),
    date: col('Date'),
    ref: col('Ref. number'),
    description: col('Description'),
    amount: col('Amount'),
    balance: col('Balance'),
    notes: col('Notes'),
    accountName: col('Account name'),
  }

  const txns = []
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    if (r.length < header.length) continue
    const ref = String(r[idx.ref] || '').trim()
    if (!ref) continue

    txns.push({
      sourceFile,
      accountName: r[idx.accountName],
      iban: r[idx.iban],
      currency: r[idx.currency],
      transactionType: r[idx.type],
      date: r[idx.date],
      refNumber: ref,
      description: r[idx.description],
      amount: parseFloat(r[idx.amount]),
      balance: parseFloat(r[idx.balance]),
      notes: r[idx.notes] || '',
    })
  }
  return txns
}

function isSlider(txn) {
  return /^slider$/i.test(String(txn.description || '').trim())
}

function isStripeInflow(txn) {
  const blob = `${txn.description || ''} ${txn.notes || ''}`.toUpperCase()
  return (
    txn.amount > 0 &&
    (blob.includes('NETWORK INTERNATIONAL') || blob.includes('STRIPE'))
  )
}

function categorizeNotable(txn) {
  const d = (txn.description || '').toLowerCase()
  const n = (txn.notes || '').toLowerCase()
  const blob = `${d} ${n}`

  if (isSlider(txn)) return 'slider'
  if (isStripeInflow(txn)) return 'stripe'
  if (/subscription fee/.test(d)) return 'wio_subscription'
  if (/cordoba/.test(blob)) return 'rent_cordoba'
  if (/saldo accounting/.test(blob)) return 'saldo_accounting'
  if (/cp world/.test(blob)) return 'cp_world_shipping'
  if (/vadim sagatdinov/.test(blob) && txn.amount < 0) return 'payroll_vadim'
  if (/bonus/.test(n) && txn.amount < 0) return 'bonus'
  if (/dts mg/.test(blob) || /invoice dubai/.test(blob)) return 'korea_supplier_usd'
  return null
}

function summarizeByMonth(transactions) {
  const byMonth = {}
  for (const t of transactions) {
    const mk = monthKey(t.date)
    if (!byMonth[mk]) byMonth[mk] = emptyMonthBucket()
    const b = byMonth[mk]
    b.count++
    if (t.amount >= 0) b.in += t.amount
    else b.out += Math.abs(t.amount)
    b.net = round2(b.in - b.out)
    b.in = round2(b.in)
    b.out = round2(b.out)
  }
  return byMonth
}

function summarizeByType(transactions) {
  const byType = {}
  for (const t of transactions) {
    const key = t.transactionType || 'Unknown'
    if (!byType[key]) byType[key] = { count: 0, in: 0, out: 0, net: 0 }
    const b = byType[key]
    b.count++
    if (t.amount >= 0) b.in += t.amount
    else b.out += Math.abs(t.amount)
  }
  for (const b of Object.values(byType)) {
    b.in = round2(b.in)
    b.out = round2(b.out)
    b.net = round2(b.in - b.out)
  }
  return byType
}

function summarizeSlider(transactions) {
  const byMonth = {}
  let totalCount = 0
  let totalSpend = 0

  for (const t of transactions) {
    if (!isSlider(t)) continue
    const mk = monthKey(t.date)
    if (!byMonth[mk]) byMonth[mk] = { count: 0, spendAed: 0 }
    byMonth[mk].count++
    byMonth[mk].spendAed = round2(byMonth[mk].spendAed + Math.abs(t.amount))
    totalCount++
    totalSpend = round2(totalSpend + Math.abs(t.amount))
  }

  return { totalCount, totalSpendAed: totalSpend, byMonth }
}

function summarizeStripe(transactions) {
  const byMonth = {}
  let totalCount = 0
  let totalIn = 0

  for (const t of transactions) {
    if (!isStripeInflow(t)) continue
    const mk = monthKey(t.date)
    if (!byMonth[mk]) byMonth[mk] = { count: 0, inflowAed: 0 }
    byMonth[mk].count++
    byMonth[mk].inflowAed = round2(byMonth[mk].inflowAed + t.amount)
    totalCount++
    totalIn = round2(totalIn + t.amount)
  }

  return { totalCount, totalInflowAed: totalIn, byMonth }
}

function perFileBalanceContinuity(allTxns, iban) {
  const checks = []
  const orderedMonths = Object.keys(MONTH_LABELS)

  for (let i = 0; i < STATEMENT_FILES.length; i++) {
    const sourceFile = STATEMENT_FILES[i]
    const fileTxns = allTxns
      .filter((t) => t.sourceFile === sourceFile && t.iban === iban)
      .sort((a, b) => a.date.localeCompare(b.date) || a.refNumber.localeCompare(b.refNumber))

    if (!fileTxns.length) continue

    const first = fileTxns[0]
    const last = fileTxns[fileTxns.length - 1]
    const opening = round2(first.balance - first.amount)
    const closing = round2(last.balance)

    checks.push({
      sourceFile,
      month: orderedMonths[i] || monthKey(first.date),
      transactionCount: fileTxns.length,
      openingBalance: opening,
      closingBalance: closing,
      firstTransactionDate: first.date,
      lastTransactionDate: last.date,
    })
  }

  const continuity = []
  for (let i = 1; i < checks.length; i++) {
    const prev = checks[i - 1]
    const curr = checks[i]
    const delta = round2(curr.openingBalance - prev.closingBalance)
    continuity.push({
      from: prev.month,
      to: curr.month,
      previousClosing: prev.closingBalance,
      currentOpening: curr.openingBalance,
      delta,
      ok: Math.abs(delta) < 0.01,
    })
  }

  return { perFile: checks, continuity }
}

function topNotableTransactions(transactions, limit = 25) {
  const notable = []
  for (const t of transactions) {
    const cat = categorizeNotable(t)
    if (!cat || cat === 'slider') continue
    notable.push({
      date: t.date,
      refNumber: t.refNumber,
      category: cat,
      description: t.description,
      amount: t.amount,
      notes: t.notes,
    })
  }
  notable.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
  return notable.slice(0, limit)
}

function aggregateTopOutflows(transactions, limit = 15) {
  return transactions
    .filter((t) => t.amount < 0 && !isSlider(t))
    .sort((a, b) => a.amount - b.amount)
    .slice(0, limit)
    .map((t) => ({
      date: t.date,
      refNumber: t.refNumber,
      description: t.description,
      amount: t.amount,
      notes: t.notes,
    }))
}

function main() {
  const { dir, iban } = parseArgs()

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`)
    process.exit(1)
  }

  const allRaw = []
  const missing = []

  for (const file of STATEMENT_FILES) {
    const fp = path.join(dir, file)
    if (!fs.existsSync(fp)) {
      missing.push(file)
      continue
    }
    allRaw.push(...parseStatementFile(fp, file))
  }

  if (missing.length) {
    console.error('Missing files:', missing.join(', '))
    process.exit(1)
  }

  // Dedupe by ref number (same ref can appear if files overlap — should not for monthly exports)
  const byRef = new Map()
  const duplicates = []

  for (const t of allRaw) {
    const key = `${t.iban}:${t.refNumber}`
    if (byRef.has(key)) {
      duplicates.push({ refNumber: t.refNumber, iban: t.iban, sources: [byRef.get(key).sourceFile, t.sourceFile] })
      continue
    }
    byRef.set(key, t)
  }

  const unique = [...byRef.values()]
  const aedTxns = unique
    .filter((t) => t.iban === iban && t.currency === 'AED')
    .sort((a, b) => a.date.localeCompare(b.date) || a.refNumber.localeCompare(b.refNumber))

  const usdTxns = unique.filter((t) => t.iban === USD_IBAN && t.currency === 'USD')

  const monthlyTotals = summarizeByMonth(aedTxns)
  const typeBreakdown = summarizeByType(aedTxns)
  const slider = summarizeSlider(aedTxns)
  const stripe = summarizeStripe(aedTxns)
  const balanceChecks = perFileBalanceContinuity(unique, iban)

  const periodStart = aedTxns[0]?.date || '2026-01-01'
  const periodEnd = aedTxns[aedTxns.length - 1]?.date || '2026-06-14'

  const summary = {
    generatedAt: new Date().toISOString(),
    sourceDirectory: dir,
    account: {
      name: aedTxns[0]?.accountName || 'GENOSYS MIDDLE EAST FZ-LLC',
      iban,
      currency: 'AED',
      type: 'Current',
      accountNumber: '9833011607',
    },
    period: {
      start: periodStart,
      end: periodEnd,
      statementFiles: STATEMENT_FILES,
    },
    totals: {
      rawRowsAllAccounts: allRaw.length,
      uniqueTransactionsAllAccounts: unique.length,
      aedTransactionCount: aedTxns.length,
      usdTransactionCount: usdTxns.length,
      duplicateRefCount: duplicates.length,
    },
    balances: {
      openingAed: balanceChecks.perFile[0]?.openingBalance ?? null,
      closingAed: balanceChecks.perFile[balanceChecks.perFile.length - 1]?.closingBalance ?? null,
      perStatementFile: balanceChecks.perFile,
      monthToMonthContinuity: balanceChecks.continuity,
      allContinuityOk: balanceChecks.continuity.every((c) => c.ok),
    },
    monthlyTotals: Object.fromEntries(
      Object.keys(MONTH_LABELS).map((mk) => [
        mk,
        {
          label: MONTH_LABELS[mk],
          ...(monthlyTotals[mk] || { in: 0, out: 0, net: 0, count: 0 }),
        },
      ]),
    ),
    periodRollup: {
      in: round2(Object.values(monthlyTotals).reduce((s, m) => s + m.in, 0)),
      out: round2(Object.values(monthlyTotals).reduce((s, m) => s + m.out, 0)),
      net: round2(Object.values(monthlyTotals).reduce((s, m) => s + m.net, 0)),
      transactionCount: aedTxns.length,
    },
    transactionTypeBreakdown: typeBreakdown,
    sliderSpend: slider,
    stripeNetworkInternationalInflows: stripe,
    notableTransactions: topNotableTransactions(aedTxns),
    topNonSliderOutflows: aggregateTopOutflows(aedTxns),
    usdAccountSummary: {
      iban: USD_IBAN,
      transactionCount: usdTxns.length,
      netUsd: round2(usdTxns.reduce((s, t) => s + t.amount, 0)),
    },
    dataQuality: {
      duplicateRefs: duplicates,
      continuityIssues: balanceChecks.continuity.filter((c) => !c.ok),
      mixedAccountsInExports: true,
      note: 'Each monthly CSV includes both AED current (9833011607) and USD current (9333280268) rows; primary analysis filters AED IBAN only.',
    },
  }

  const outPath = path.join(dir, 'wio-slider-2026-summary.json')
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2) + '\n')

  console.log('━━━ Wio Slider_2026 Statement Ingest ━━━')
  console.log(`Account: ${summary.account.name}`)
  console.log(`IBAN: ${iban}`)
  console.log(`Period: ${periodStart} → ${periodEnd}`)
  console.log(`AED transactions: ${aedTxns.length} (deduped)`)
  console.log(`Opening → Closing: AED ${summary.balances.openingAed?.toLocaleString()} → ${summary.balances.closingAed?.toLocaleString()}`)
  console.log(`Continuity OK: ${summary.balances.allContinuityOk ? 'yes' : 'NO — see JSON'}`)
  console.log('')
  console.log('Monthly (AED):')
  console.log('Month        In          Out         Net         Txns  Slider#  Slider AED')
  for (const mk of Object.keys(MONTH_LABELS)) {
    const m = summary.monthlyTotals[mk]
    const sl = summary.sliderSpend.byMonth[mk] || { count: 0, spendAed: 0 }
    console.log(
      `${mk}  ${String(m.in.toFixed(2)).padStart(10)}  ${String(m.out.toFixed(2)).padStart(10)}  ${String(m.net.toFixed(2)).padStart(10)}  ${String(m.count).padStart(5)}  ${String(sl.count).padStart(7)}  ${sl.spendAed.toFixed(2)}`,
    )
  }
  console.log('')
  console.log(`Slider total: ${summary.sliderSpend.totalCount} charges, AED ${summary.sliderSpend.totalSpendAed.toFixed(2)}`)
  console.log(`Stripe/NI inflows: ${summary.stripeNetworkInternationalInflows.totalCount} transfers, AED ${summary.stripeNetworkInternationalInflows.totalInflowAed.toFixed(2)}`)
  console.log(`JSON written: ${outPath}`)
}

main()
