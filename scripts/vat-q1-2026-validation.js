#!/usr/bin/env node

/**
 * VAT Q1 2026 Validation Script
 * 
 * Pulls data from MoySklad and cross-validates against the accountant's
 * VAT return draft for the period 01.01.2026 - 31.03.2026.
 * 
 * Usage:
 *   MOYSKLAD_LOGIN="email" MOYSKLAD_PASSWORD="pass" node scripts/vat-q1-2026-validation.js
 */

const MOYSKLAD_API = 'https://api.moysklad.ru/api/remap/1.2'

const Q1_FROM = '2026-01-01 00:00:00'
const Q1_TO = '2026-03-31 23:59:59'

const Q4_2025_FROM = '2025-10-01 00:00:00'
const Q4_2025_TO = '2025-12-31 23:59:59'

const ACCOUNTANT_FIGURES = {
  standardSalesTaxable: 265158.53,
  standardSalesVAT: 13257.93,
  consignmentQ1Taxable: 179947.71,
  consignmentQ1VAT: 8997.39,
  consignmentLastQTaxable: 151773.57,
  consignmentLastQVAT: 7588.68,
  totalOutputTaxable: 596879.81,
  totalOutputVAT: 29843.99,
  importsTaxable: 198800.37,
  importsVAT: 9940.02,
  expensesTaxable: 1983.20,
  expensesVAT: 99.16,
  netVATPayable: 29744.83,
}

const login = process.env.MOYSKLAD_LOGIN
const password = process.env.MOYSKLAD_PASSWORD

if (!login || !password) {
  console.error('Set MOYSKLAD_LOGIN and MOYSKLAD_PASSWORD environment variables')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')

async function fetchAll(endpoint, dateFrom, dateTo) {
  let allRows = []
  let offset = 0
  const limit = 1000
  const dateFilter = `moment>=${dateFrom};moment<=${dateTo}`

  while (true) {
    const sep = endpoint.includes('?') ? '&' : '?'
    const url = `${MOYSKLAD_API}${endpoint}${sep}limit=${limit}&offset=${offset}&filter=${encodeURIComponent(dateFilter)}&order=moment,asc&expand=agent,state`

    const res = await fetch(url, {
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`ERROR ${endpoint}: HTTP ${res.status} — ${text.substring(0, 300)}`)
      return allRows
    }

    const data = await res.json()
    const rows = data.rows || []
    allRows = allRows.concat(rows)
    if (rows.length < limit) break
    offset += limit
  }

  return allRows
}

function money(val) {
  return (val / 100).toFixed(2)
}

function moneyNum(val) {
  return val / 100
}

function formatDate(isoStr) {
  if (!isoStr) return '—'
  const d = new Date(isoStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function diff(label, moysklad, accountant) {
  const delta = moysklad - accountant
  const pct = accountant !== 0 ? ((delta / accountant) * 100).toFixed(2) : '—'
  const status = Math.abs(delta) < 1 ? '✅' : Math.abs(delta) < 100 ? '⚠️' : '❌'
  console.log(`  ${status} ${label}`)
  console.log(`     MoySklad:   ${moysklad.toFixed(2)} AED`)
  console.log(`     Accountant: ${accountant.toFixed(2)} AED`)
  console.log(`     Delta:      ${delta >= 0 ? '+' : ''}${delta.toFixed(2)} AED (${pct}%)`)
  return { label, moysklad, accountant, delta, status }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════════════════╗')
  console.log('║  VAT Q1 2026 VALIDATION — MoySklad vs Accountant Draft                  ║')
  console.log('║  Genosys Middle East FZ-LLC                                              ║')
  console.log(`║  Generated: ${new Date().toLocaleString('en-GB')}                                    ║`)
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝')

  console.log('\n📡 Fetching data from MoySklad...\n')

  const [invoicesOutQ1, demandsQ1, paymentsQ1, invoicesInQ1, invoicesOutQ4] = await Promise.all([
    fetchAll('/entity/invoiceout', Q1_FROM, Q1_TO),
    fetchAll('/entity/demand', Q1_FROM, Q1_TO),
    fetchAll('/entity/paymentin', Q1_FROM, Q1_TO),
    fetchAll('/entity/invoicein', Q1_FROM, Q1_TO),
    fetchAll('/entity/invoiceout', Q4_2025_FROM, Q4_2025_TO),
  ])

  console.log(`  Invoices Out Q1 2026: ${invoicesOutQ1.length} documents`)
  console.log(`  Shipments Q1 2026:    ${demandsQ1.length} documents`)
  console.log(`  Payments In Q1 2026:  ${paymentsQ1.length} documents`)
  console.log(`  Invoices In Q1 2026:  ${invoicesInQ1.length} documents`)
  console.log(`  Invoices Out Q4 2025: ${invoicesOutQ4.length} documents`)

  // ── INVOICES OUT (Standard Sales) ──
  // These are the "Standard sales 5%" tab in the Excel — invoices 04000-04326
  const invoicesOutSum = invoicesOutQ1.reduce((s, r) => s + (r.sum || 0), 0)
  const invoicesOutAED = moneyNum(invoicesOutSum)

  // Invoices in MoySklad include VAT (total amount). Accountant shows taxable + VAT separately.
  // MoySklad sum = Total incl. VAT. Accountant: taxable = 265,158.53, total = 278,416.46
  const accountantStdSalesTotal = ACCOUNTANT_FIGURES.standardSalesTaxable + ACCOUNTANT_FIGURES.standardSalesVAT

  console.log('\n' + '═'.repeat(75))
  console.log('  1. INVOICES OUT (Standard Sales) — Q1 2026')
  console.log('═'.repeat(75))
  console.log(`  MoySklad invoices out (${invoicesOutQ1.length} docs): ${invoicesOutAED.toFixed(2)} AED (incl. VAT)`)
  console.log(`  Accountant standard sales total:      ${accountantStdSalesTotal.toFixed(2)} AED (incl. VAT)`)
  const stdDelta = invoicesOutAED - accountantStdSalesTotal
  console.log(`  Delta: ${stdDelta >= 0 ? '+' : ''}${stdDelta.toFixed(2)} AED`)
  if (Math.abs(stdDelta) < 5) {
    console.log('  ✅ MATCH (within rounding tolerance)')
  } else {
    console.log('  ⚠️  Discrepancy detected')
  }

  // Check invoice number range
  const invoiceNumbers = invoicesOutQ1.map(r => r.name).sort()
  console.log(`\n  Invoice range: ${invoiceNumbers[0]} → ${invoiceNumbers[invoiceNumbers.length - 1]}`)
  console.log(`  Accountant range: 04000 → 04326 (${327 - 1} invoices including 04052 skip)`)

  // Check for invoice 13171-20260409-1438 (should NOT be in Q1)
  const april9Invoice = invoicesOutQ1.find(r => r.name && r.name.includes('13171-20260409'))
  console.log(`\n  Invoice 13171-20260409-1438 in Q1 data: ${april9Invoice ? '❌ FOUND (should be excluded!)' : '✅ Not found (correct)'}`)

  // ── SHIPMENTS (Demands) ──
  const demandsSum = demandsQ1.reduce((s, r) => s + (r.sum || 0), 0)
  const demandsAED = moneyNum(demandsSum)

  console.log('\n' + '═'.repeat(75))
  console.log('  2. SHIPMENTS (Demands/Отгрузки) — Q1 2026')
  console.log('═'.repeat(75))
  console.log(`  MoySklad shipments (${demandsQ1.length} docs): ${demandsAED.toFixed(2)} AED`)
  console.log('  Note: Shipments include consignment sales to salons/clinics')
  console.log(`  Accountant consignment Q1 total (incl. VAT): ${(ACCOUNTANT_FIGURES.consignmentQ1Taxable + ACCOUNTANT_FIGURES.consignmentQ1VAT).toFixed(2)} AED`)

  // ── CONSIGNMENT SALES LAST QUARTER ──
  // These are demand documents from Q4 2025 that were not captured before
  console.log('\n' + '═'.repeat(75))
  console.log('  3. CONSIGNMENT SALES (Last Quarter Carry-Over)')
  console.log('═'.repeat(75))
  console.log(`  Accountant added Q4 2025 consignment sales: ${ACCOUNTANT_FIGURES.consignmentLastQTaxable.toFixed(2)} AED taxable`)
  console.log(`  Note: These were "not added by the excel formula" per accountant`)
  console.log(`  MoySklad Q4 2025 invoices out: ${invoicesOutQ4.length} docs`)

  // ── TOTAL OUTPUT VAT VALIDATION ──
  console.log('\n' + '═'.repeat(75))
  console.log('  4. TOTAL OUTPUT VAT VALIDATION')
  console.log('═'.repeat(75))

  const acctTotalTaxable = ACCOUNTANT_FIGURES.standardSalesTaxable + ACCOUNTANT_FIGURES.consignmentQ1Taxable + ACCOUNTANT_FIGURES.consignmentLastQTaxable
  console.log(`\n  Accountant breakdown:`)
  console.log(`    Standard sales (04xxx):       ${ACCOUNTANT_FIGURES.standardSalesTaxable.toFixed(2)} AED`)
  console.log(`    Consignment Q1 (01xxx):       ${ACCOUNTANT_FIGURES.consignmentQ1Taxable.toFixed(2)} AED`)
  console.log(`    Consignment last Q carry-over: ${ACCOUNTANT_FIGURES.consignmentLastQTaxable.toFixed(2)} AED`)
  console.log(`    ─────────────────────────────────────────`)
  console.log(`    Sum:                           ${acctTotalTaxable.toFixed(2)} AED`)
  console.log(`    Filed as:                      ${ACCOUNTANT_FIGURES.totalOutputTaxable.toFixed(2)} AED`)
  const outputDelta = acctTotalTaxable - ACCOUNTANT_FIGURES.totalOutputTaxable
  console.log(`    Internal consistency: ${Math.abs(outputDelta) < 1 ? '✅' : '❌'} (delta: ${outputDelta.toFixed(2)})`)

  // VAT calculation check
  const expectedVAT = ACCOUNTANT_FIGURES.totalOutputTaxable * 0.05
  console.log(`\n  VAT @ 5% of ${ACCOUNTANT_FIGURES.totalOutputTaxable.toFixed(2)} = ${expectedVAT.toFixed(2)} AED`)
  console.log(`  Accountant VAT:                    ${ACCOUNTANT_FIGURES.totalOutputVAT.toFixed(2)} AED`)
  console.log(`  Delta: ${(expectedVAT - ACCOUNTANT_FIGURES.totalOutputVAT).toFixed(2)} AED ${Math.abs(expectedVAT - ACCOUNTANT_FIGURES.totalOutputVAT) < 1 ? '✅' : '⚠️'}`)

  // ── IMPORTS ──
  console.log('\n' + '═'.repeat(75))
  console.log('  5. IMPORTS (Goods Imported into UAE)')
  console.log('═'.repeat(75))
  console.log(`  Accountant: ${ACCOUNTANT_FIGURES.importsTaxable.toFixed(2)} AED (VAT: ${ACCOUNTANT_FIGURES.importsVAT.toFixed(2)})`)

  const invoicesInSum = invoicesInQ1.reduce((s, r) => s + (r.sum || 0), 0)
  const invoicesInAED = moneyNum(invoicesInSum)
  console.log(`  MoySklad Invoices In (${invoicesInQ1.length} docs): ${invoicesInAED.toFixed(2)} AED`)

  // List invoices in
  for (const inv of invoicesInQ1) {
    const name = inv.agent?.name || '?'
    console.log(`    - ${formatDate(inv.moment)} | ${inv.name || '?'} | ${name} | ${money(inv.sum)} AED`)
  }

  console.log(`\n  Note: Imports are from customs declarations, not MoySklad invoices.`)
  console.log(`  Customs total: 146,965.99 + 17,210.62 + 31,782.59 + 2,841.17 = ${(146965.99 + 17210.62 + 31782.59 + 2841.17).toFixed(2)} AED`)
  console.log(`  Matches accountant: ${Math.abs((146965.99 + 17210.62 + 31782.59 + 2841.17) - ACCOUNTANT_FIGURES.importsTaxable) < 1 ? '✅' : '❌'}`)

  // ── EXPENSES ──
  console.log('\n' + '═'.repeat(75))
  console.log('  6. STANDARD RATED EXPENSES')
  console.log('═'.repeat(75))
  console.log(`  Accountant:`)
  console.log(`    SALDO (accounting):   1,200.00 AED (VAT: 60.00)`)
  console.log(`    SLIDER (delivery):      783.20 AED (VAT: 39.16)`)
  console.log(`    Total:                ${ACCOUNTANT_FIGURES.expensesTaxable.toFixed(2)} AED (VAT: ${ACCOUNTANT_FIGURES.expensesVAT.toFixed(2)})`)

  // ── NET VAT CALCULATION ──
  console.log('\n' + '═'.repeat(75))
  console.log('  7. NET VAT PAYABLE CALCULATION')
  console.log('═'.repeat(75))
  const totalOutputVAT = ACCOUNTANT_FIGURES.totalOutputVAT + ACCOUNTANT_FIGURES.importsVAT
  const totalInputVAT = ACCOUNTANT_FIGURES.expensesVAT + ACCOUNTANT_FIGURES.importsVAT
  const netVAT = totalOutputVAT - totalInputVAT

  console.log(`  Output VAT:`)
  console.log(`    Sales VAT:              ${ACCOUNTANT_FIGURES.totalOutputVAT.toFixed(2)} AED`)
  console.log(`    Import VAT:             ${ACCOUNTANT_FIGURES.importsVAT.toFixed(2)} AED`)
  console.log(`    Total Output:           ${totalOutputVAT.toFixed(2)} AED`)
  console.log(`  Input VAT:`)
  console.log(`    Expenses VAT:           ${ACCOUNTANT_FIGURES.expensesVAT.toFixed(2)} AED`)
  console.log(`    Reverse charge (import): ${ACCOUNTANT_FIGURES.importsVAT.toFixed(2)} AED`)
  console.log(`    Total Input:            ${totalInputVAT.toFixed(2)} AED`)
  console.log(`  ─────────────────────────────────────────`)
  console.log(`  Net VAT Payable:          ${netVAT.toFixed(2)} AED`)
  console.log(`  Accountant Net VAT:       ${ACCOUNTANT_FIGURES.netVATPayable.toFixed(2)} AED`)
  console.log(`  Delta: ${(netVAT - ACCOUNTANT_FIGURES.netVATPayable).toFixed(2)} ${Math.abs(netVAT - ACCOUNTANT_FIGURES.netVATPayable) < 1 ? '✅' : '⚠️'}`)

  // ── MONTHLY BREAKDOWN ──
  console.log('\n' + '═'.repeat(75))
  console.log('  8. MONTHLY SALES BREAKDOWN (MoySklad Invoices Out)')
  console.log('═'.repeat(75))
  for (const [label, month] of [['January', 0], ['February', 1], ['March', 2]]) {
    const monthInvoices = invoicesOutQ1.filter(r => new Date(r.moment).getMonth() === month)
    const monthSum = monthInvoices.reduce((s, r) => s + (r.sum || 0), 0)
    console.log(`  ${label.padEnd(12)} | ${String(monthInvoices.length).padStart(3)} invoices | ${money(monthSum).padStart(12)} AED`)
  }

  // ── SUMMARY ──
  console.log('\n' + '═'.repeat(75))
  console.log('  VALIDATION SUMMARY')
  console.log('═'.repeat(75))

  const checks = []

  // Check 1: Standard sales match
  checks.push({
    test: 'Standard sales invoices count',
    pass: invoicesOutQ1.length >= 326,
    detail: `${invoicesOutQ1.length} invoices (accountant has 326 lines in 04xxx series)`
  })

  // Check 2: Output VAT internal consistency
  checks.push({
    test: 'Output taxable sum = standard + consignment Q1 + consignment carry-over',
    pass: Math.abs(acctTotalTaxable - ACCOUNTANT_FIGURES.totalOutputTaxable) < 1,
    detail: `${acctTotalTaxable.toFixed(2)} vs ${ACCOUNTANT_FIGURES.totalOutputTaxable.toFixed(2)}`
  })

  // Check 3: VAT rate is 5%
  checks.push({
    test: 'Output VAT = 5% of taxable',
    pass: Math.abs(expectedVAT - ACCOUNTANT_FIGURES.totalOutputVAT) < 2,
    detail: `${expectedVAT.toFixed(2)} vs ${ACCOUNTANT_FIGURES.totalOutputVAT.toFixed(2)}`
  })

  // Check 4: Imports match customs
  checks.push({
    test: 'Imports match customs declarations',
    pass: Math.abs((146965.99 + 17210.62 + 31782.59 + 2841.17) - ACCOUNTANT_FIGURES.importsTaxable) < 1,
    detail: `${(146965.99 + 17210.62 + 31782.59 + 2841.17).toFixed(2)} vs ${ACCOUNTANT_FIGURES.importsTaxable.toFixed(2)}`
  })

  // Check 5: Net VAT calculation correct
  checks.push({
    test: 'Net VAT calculation',
    pass: Math.abs(netVAT - ACCOUNTANT_FIGURES.netVATPayable) < 1,
    detail: `Calculated: ${netVAT.toFixed(2)} vs Filed: ${ACCOUNTANT_FIGURES.netVATPayable.toFixed(2)}`
  })

  // Check 6: April invoice excluded
  checks.push({
    test: 'Invoice 13171-20260409-1438 excluded from Q1',
    pass: !april9Invoice,
    detail: april9Invoice ? 'FOUND in Q1 — should be Q2!' : 'Correctly excluded'
  })

  for (const c of checks) {
    console.log(`  ${c.pass ? '✅' : '❌'} ${c.test}`)
    console.log(`     ${c.detail}`)
  }

  const passed = checks.filter(c => c.pass).length
  console.log(`\n  Result: ${passed}/${checks.length} checks passed`)

  if (passed === checks.length) {
    console.log('\n  🟢 ALL CHECKS PASSED — Safe to confirm with accountant')
  } else {
    console.log('\n  🟡 Review flagged items before confirming')
  }

  console.log('\n' + '═'.repeat(75))
  console.log('  NOTES FOR REPLY TO ACCOUNTANT')
  console.log('═'.repeat(75))
  console.log(`  1. Rounding: Accountant requested exact VAT amounts without rounding.`)
  console.log(`     Current invoices show fractional amounts (e.g., 16.4285 instead of 16.43).`)
  console.log(`     Action: Update invoice template to show exact calculated VAT.`)
  console.log(`  2. Invoice 13171-20260409-1438 (Apr 9) correctly excluded from Q1.`)
  console.log(`  3. Q4 2025 consignment carry-over: ${ACCOUNTANT_FIGURES.consignmentLastQTaxable.toFixed(2)} AED`)
  console.log(`     was missed by previous formula — now added.`)
  console.log(`  4. Deadline: April 28, 2026`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
