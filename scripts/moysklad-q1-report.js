#!/usr/bin/env node

/**
 * MoySklad Q1 2026 Invoice Report
 * 
 * Pulls all invoices (outgoing + incoming), customer orders, and demand documents
 * from MoySklad for the period 01.01.2026 - 31.03.2026.
 * 
 * Usage:
 *   MOYSKLAD_LOGIN="email" MOYSKLAD_PASSWORD="pass" node scripts/moysklad-q1-report.js
 */

const fs = require('fs')
const path = require('path')

const MOYSKLAD_API = 'https://api.moysklad.ru/api/remap/1.2'
const MOMENT_FROM = '2026-01-01 00:00:00'
const MOMENT_TO = '2026-03-31 23:59:59'

let outputLines = []
const origLog = console.log.bind(console)
console.log = function(...args) {
  const line = args.map(a => typeof a === 'string' ? a : String(a)).join(' ')
  outputLines.push(line)
  origLog(...args)
}

const login = process.env.MOYSKLAD_LOGIN
const password = process.env.MOYSKLAD_PASSWORD

if (!login || !password) {
  console.error('ERROR: Set MOYSKLAD_LOGIN and MOYSKLAD_PASSWORD environment variables')
  console.error('Usage: MOYSKLAD_LOGIN="email" MOYSKLAD_PASSWORD="pass" node scripts/moysklad-q1-report.js')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')

async function fetchAll(endpoint, label) {
  let allRows = []
  let offset = 0
  const limit = 1000
  const dateFilter = `moment>=${MOMENT_FROM};moment<=${MOMENT_TO}`

  while (true) {
    const sep = endpoint.includes('?') ? '&' : '?'
    const url = `${MOYSKLAD_API}${endpoint}${sep}limit=${limit}&offset=${offset}&filter=${encodeURIComponent(dateFilter)}&order=moment,asc`

    const res = await fetch(url, {
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`ERROR fetching ${label}: HTTP ${res.status} — ${text.substring(0, 300)}`)
      return allRows
    }

    const data = await res.json()
    const rows = data.rows || []
    allRows = allRows.concat(rows)

    console.log(`  [${label}] Fetched ${allRows.length}${data.meta?.size ? '/' + data.meta.size : ''} rows...`)

    if (rows.length < limit) break
    offset += limit
  }

  return allRows
}

function formatDate(isoStr) {
  if (!isoStr) return '—'
  const d = new Date(isoStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatMoney(val) {
  if (val == null) return '—'
  return (val / 100).toFixed(2)
}

function agentName(row) {
  return row.agent?.name || '—'
}

function stateName(row) {
  return row.state?.name || '—'
}

function printSection(title, rows, type) {
  console.log('\n' + '='.repeat(100))
  console.log(`  ${title}  (${rows.length} documents)`)
  console.log('='.repeat(100))

  if (rows.length === 0) {
    console.log('  No documents found for this period.\n')
    return 0
  }

  const header = [
    '#'.padEnd(4),
    'Date'.padEnd(12),
    'Number'.padEnd(18),
    'Counterparty'.padEnd(35),
    'Status'.padEnd(16),
    'Sum (AED)'.padStart(14),
  ].join(' | ')

  console.log(header)
  console.log('-'.repeat(100))

  let total = 0
  rows.forEach((row, idx) => {
    const sum = row.sum || 0
    total += sum
    const line = [
      String(idx + 1).padEnd(4),
      formatDate(row.moment).padEnd(12),
      (row.name || '—').padEnd(18),
      agentName(row).substring(0, 35).padEnd(35),
      stateName(row).substring(0, 16).padEnd(16),
      formatMoney(sum).padStart(14),
    ].join(' | ')
    console.log(line)
  })

  console.log('-'.repeat(100))
  console.log(`${'TOTAL'.padEnd(4)} | ${''.padEnd(12)} | ${''.padEnd(18)} | ${''.padEnd(35)} | ${''.padEnd(16)} | ${formatMoney(total).padStart(14)}`)
  return total
}

function printPositions(rows, label) {
  let allItems = []

  for (const row of rows) {
    if (row.positions?.rows) {
      for (const pos of row.positions.rows) {
        allItems.push({
          docName: row.name,
          docDate: formatDate(row.moment),
          product: pos.assortment?.name || '?',
          qty: pos.quantity || 0,
          price: pos.price || 0,
          sum: (pos.quantity || 0) * (pos.price || 0),
        })
      }
    }
  }

  if (allItems.length === 0) return

  console.log(`\n  ${label} — Line Items Detail (${allItems.length} items)`)
  console.log('-'.repeat(120))
  const hdr = [
    'Doc #'.padEnd(16),
    'Date'.padEnd(12),
    'Product'.padEnd(45),
    'Qty'.padStart(6),
    'Price'.padStart(12),
    'Sum'.padStart(14),
  ].join(' | ')
  console.log(hdr)
  console.log('-'.repeat(120))

  for (const item of allItems) {
    console.log([
      item.docName.padEnd(16),
      item.docDate.padEnd(12),
      item.product.substring(0, 45).padEnd(45),
      String(item.qty).padStart(6),
      formatMoney(item.price).padStart(12),
      formatMoney(item.sum).padStart(14),
    ].join(' | '))
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════════════════════════════════════╗')
  console.log('║                     MOYSKLAD REPORT: Q1 2026 (01.01.2026 — 31.03.2026)                        ║')
  console.log('║                     Genosys Middle East FZ-LLC                                                 ║')
  console.log(`║                     Generated: ${new Date().toLocaleString('en-GB')}${''.padEnd(40)}║`)
  console.log('╚══════════════════════════════════════════════════════════════════════════════════════════════════╝')

  console.log('\nFetching data from MoySklad API...')

  // Fetch all documents in parallel
  const [invoicesOut, invoicesIn, customerOrders, demands, payments] = await Promise.all([
    fetchAll('/entity/invoiceout', 'Invoices Out (Счета покупателям)'),
    fetchAll('/entity/invoicein', 'Invoices In (Счета поставщикам)'),
    fetchAll('/entity/customerorder', 'Customer Orders (Заказы покупателей)'),
    fetchAll('/entity/demand', 'Shipments (Отгрузки)'),
    fetchAll('/entity/paymentin', 'Incoming Payments (Входящие платежи)'),
  ])

  // Resolve counterparty names and states (uses caching — unique agents fetched once)
  console.log('\nResolving counterparty names and statuses...')
  const allDocs = [...invoicesOut, ...invoicesIn, ...customerOrders, ...demands, ...payments]
  const agentCache = {}
  const stateCache = {}

  for (const row of allDocs) {
    if (row.agent?.meta?.href && !row.agent.name) {
      const href = row.agent.meta.href
      if (!agentCache[href]) {
        const res = await fetch(href, {
          headers: { 'Authorization': AUTH, 'Accept-Encoding': 'gzip' },
        }).catch(() => null)
        if (res?.ok) {
          const data = await res.json()
          agentCache[href] = data.name || '?'
        } else {
          agentCache[href] = '?'
        }
      }
      row.agent.name = agentCache[href]
    }
    if (row.state?.meta?.href && !row.state.name) {
      const href = row.state.meta.href
      if (!stateCache[href]) {
        const res = await fetch(href, {
          headers: { 'Authorization': AUTH, 'Accept-Encoding': 'gzip' },
        }).catch(() => null)
        if (res?.ok) {
          const data = await res.json()
          stateCache[href] = data.name || '?'
        } else {
          stateCache[href] = '?'
        }
      }
      row.state.name = stateCache[href]
    }
  }
  console.log(`Resolved ${Object.keys(agentCache).length} unique counterparties, ${Object.keys(stateCache).length} unique states`)

  // Print summaries
  const totalOut = printSection('INVOICES OUT — Счета покупателям (Invoices to Customers)', invoicesOut, 'out')
  const totalIn = printSection('INVOICES IN — Счета поставщикам (Invoices from Suppliers)', invoicesIn, 'in')
  const totalOrders = printSection('CUSTOMER ORDERS — Заказы покупателей', customerOrders, 'order')
  const totalDemands = printSection('SHIPMENTS — Отгрузки (Fulfilled/Shipped)', demands, 'demand')
  const totalPayments = printSection('INCOMING PAYMENTS — Входящие платежи', payments, 'pay')

  // Print line item details for invoices
  printPositions(invoicesOut, 'Invoices Out')
  printPositions(invoicesIn, 'Invoices In')
  printPositions(customerOrders, 'Customer Orders')
  printPositions(demands, 'Shipments')

  // Summary
  console.log('\n' + '='.repeat(100))
  console.log('  SUMMARY — Q1 2026')
  console.log('='.repeat(100))
  console.log(`  Invoices Out (to customers):   ${invoicesOut.length} docs   |   ${formatMoney(totalOut)} AED`)
  console.log(`  Invoices In (from suppliers):   ${invoicesIn.length} docs   |   ${formatMoney(totalIn)} AED`)
  console.log(`  Customer Orders:                ${customerOrders.length} docs   |   ${formatMoney(totalOrders)} AED`)
  console.log(`  Shipments (Demands):            ${demands.length} docs   |   ${formatMoney(totalDemands)} AED`)
  console.log(`  Incoming Payments:              ${payments.length} docs   |   ${formatMoney(totalPayments)} AED`)
  console.log('='.repeat(100))

  // Monthly breakdown
  console.log('\n  MONTHLY BREAKDOWN')
  console.log('-'.repeat(60))
  for (const [monthLabel, monthNum] of [['January', '01'], ['February', '02'], ['March', '03']]) {
    const monthOrders = customerOrders.filter(r => {
      const d = new Date(r.moment)
      return d.getMonth() === parseInt(monthNum) - 1
    })
    const monthSum = monthOrders.reduce((s, r) => s + (r.sum || 0), 0)
    const monthDemands = demands.filter(r => {
      const d = new Date(r.moment)
      return d.getMonth() === parseInt(monthNum) - 1
    })
    const monthDemandSum = monthDemands.reduce((s, r) => s + (r.sum || 0), 0)
    console.log(`  ${monthLabel.padEnd(12)} | Orders: ${String(monthOrders.length).padStart(3)} (${formatMoney(monthSum).padStart(12)} AED) | Shipped: ${String(monthDemands.length).padStart(3)} (${formatMoney(monthDemandSum).padStart(12)} AED)`)
  }
  console.log('-'.repeat(60))

  console.log('\nReport complete.\n')

  // Save to file
  const outPath = path.join(__dirname, '..', 'docs', 'MOYSKLAD_Q1_2026_REPORT.txt')
  fs.writeFileSync(outPath, outputLines.join('\n'), 'utf-8')
  console.log(`Report saved to: ${outPath}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
