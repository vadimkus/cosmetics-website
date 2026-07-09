#!/usr/bin/env node

/**
 * VAT Q2 2026 Validation Script
 *
 * Pulls data from MoySklad and cross-validates against the accountant's
 * VAT return draft for the period 01.04.2026 - 30.06.2026.
 *
 * Usage:
 *   node --import dotenv/config scripts/vat-q2-2026-validation.js
 */

const MOYSKLAD_API = 'https://api.moysklad.ru/api/remap/1.2'

const Q2_FROM = '2026-04-01 00:00:00'
const Q2_TO = '2026-06-30 23:59:59'

// Update when accountant sends draft
const ACCOUNTANT_FIGURES = {
  standardSalesTaxable: null,
  standardSalesVAT: null,
  consignmentQ2Taxable: null,
  consignmentQ2VAT: null,
  consignmentCarryOverTaxable: null,
  consignmentCarryOverVAT: null,
  totalOutputTaxable: null,
  totalOutputVAT: null,
  importsTaxable: 290480.5,
  importsVAT: 13832.4,
  expensesTaxable: null,
  expensesVAT: null,
  netVATPayable: null,
}

const IMPORTS = [
  { date: '2026-04-06', decl: '1010063138326', base: 7961.85 },
  { date: '2026-04-07', decl: '1010063271226', base: 7783.81 },
  { date: '2026-04-20', decl: '1010069751926', base: 26802.86 },
  { date: '2026-05-14', decl: '1010083853126', base: 50141.3 },
  { date: '2026-05-21', decl: '1010087991326', base: 63620.63 },
  { date: '2026-06-16', decl: '1010103399626', base: 60809.04 },
  { date: '2026-06-30', decl: '1010113202326', base: 59528.61 },
]

const login = process.env.MOYSKLAD_LOGIN
const password = process.env.MOYSKLAD_PASSWORD

if (!login || !password) {
  console.error('Set MOYSKLAD_LOGIN and MOYSKLAD_PASSWORD (use --import dotenv/config)')
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
        Authorization: AUTH,
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

function moneyNum(val) {
  return val / 100
}

function formatDate(isoStr) {
  if (!isoStr) return '—'
  const d = new Date(isoStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════════════════╗')
  console.log('║  VAT Q2 2026 VALIDATION — MoySklad vs Accountant Draft                  ║')
  console.log('║  Genosys Middle East FZ-LLC                                              ║')
  console.log(`║  Generated: ${new Date().toLocaleString('en-GB')}                                    ║`)
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝')

  console.log('\n📡 Fetching data from MoySklad...\n')

  const [invoicesOutQ2, demandsQ2, commQ2, invoicesInQ2] = await Promise.all([
    fetchAll('/entity/invoiceout', Q2_FROM, Q2_TO),
    fetchAll('/entity/demand', Q2_FROM, Q2_TO),
    fetchAll('/entity/commissionreportin', Q2_FROM, Q2_TO),
    fetchAll('/entity/invoicein', Q2_FROM, Q2_TO),
  ])

  const stdInvoices = invoicesOutQ2.filter((r) => r.name && /^04/.test(r.name))
  const stdTotal = stdInvoices.reduce((s, r) => s + (r.sum || 0), 0)
  const commTotal = commQ2.reduce((s, r) => s + (r.sum || 0), 0)

  console.log(`  Invoices Out Q2 (04xxx): ${stdInvoices.length} docs, ${moneyNum(stdTotal).toFixed(2)} AED incl VAT`)
  console.log(`  Commission reports Q2:   ${commQ2.length} docs, ${moneyNum(commTotal).toFixed(2)} AED incl VAT`)
  console.log(`  Shipments Q2:            ${demandsQ2.length} docs`)
  console.log(`  Invoices In Q2:          ${invoicesInQ2.length} docs`)

  const invoiceNumbers = stdInvoices.map((r) => r.name).sort()
  const commNumbers = commQ2.map((r) => r.name).sort()
  console.log(`\n  Standard invoice range: ${invoiceNumbers[0]} → ${invoiceNumbers[invoiceNumbers.length - 1]}`)
  if (commNumbers.length) {
    console.log(`  Consignment range:      ${commNumbers[0]} → ${commNumbers[commNumbers.length - 1]}`)
  }

  console.log('\n' + '═'.repeat(75))
  console.log('  IMPORTS (Customs Declarations — Q2)')
  console.log('═'.repeat(75))
  let importTaxable = 0
  let importVAT = 0
  for (const row of IMPORTS) {
    const line = row.base * 1.05
    const vat = row.base * 0.05
    importTaxable += line
    importVAT += vat
    console.log(
      `  ${row.date} | ${row.decl} | base ${row.base.toFixed(2)} → line ${line.toFixed(2)} | VAT ${vat.toFixed(2)}`
    )
  }
  console.log(`  ─────────────────────────────────────────`)
  console.log(`  Calculated total: ${importTaxable.toFixed(2)} AED (VAT ${importVAT.toFixed(2)})`)
  console.log(
    `  Prep notes total: ${ACCOUNTANT_FIGURES.importsTaxable.toFixed(2)} AED (VAT ${ACCOUNTANT_FIGURES.importsVAT.toFixed(2)})`
  )
  console.log(
    `  Match: ${Math.abs(importTaxable - ACCOUNTANT_FIGURES.importsTaxable) < 0.02 ? '✅' : '❌'}`
  )

  console.log('\n' + '═'.repeat(75))
  console.log('  MONTHLY STANDARD SALES (MoySklad 04xxx)')
  console.log('═'.repeat(75))
  for (const [label, month] of [
    ['April', 3],
    ['May', 4],
    ['June', 5],
  ]) {
    const monthInvoices = stdInvoices.filter((r) => new Date(r.moment).getMonth() === month)
    const monthSum = monthInvoices.reduce((s, r) => s + (r.sum || 0), 0)
    console.log(
      `  ${label.padEnd(12)} | ${String(monthInvoices.length).padStart(3)} invoices | ${moneyNum(monthSum).toFixed(2).padStart(12)} AED`
    )
  }

  console.log('\n' + '═'.repeat(75))
  console.log('  DRAFT MOYSKLAD TOTALS (÷1.05 for taxable)')
  console.log('═'.repeat(75))
  const draftOutputTaxable = (stdTotal + commTotal) / 100 / 1.05
  const draftOutputVAT = draftOutputTaxable * 0.05
  console.log(`  Standard taxable (est):     ${(stdTotal / 100 / 1.05).toFixed(2)} AED`)
  console.log(`  Consignment taxable (est):  ${(commTotal / 100 / 1.05).toFixed(2)} AED`)
  console.log(`  Combined output VAT (est):  ${draftOutputVAT.toFixed(2)} AED`)

  if (ACCOUNTANT_FIGURES.totalOutputTaxable == null) {
    console.log('\n  ⚠️  Accountant figures not loaded — update ACCOUNTANT_FIGURES when draft arrives.')
  }

  console.log('\n' + '═'.repeat(75))
  console.log('  FOLDER CHECKLIST')
  console.log('═'.repeat(75))
  console.log('  Q2 folder: Company_Legal/Tax/VAT/2026/Q2/')
  console.log('  See VAT_Q2_2026_PREP_NOTES.md for full submission checklist.')
  console.log('  Deadline: 28 July 2026')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
