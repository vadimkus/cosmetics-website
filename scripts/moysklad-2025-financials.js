#!/usr/bin/env node

/**
 * Pull all 2025 financial data from MoySklad for financial statement generation.
 * Revenue (invoiceout), COGS (invoicein), payments in/out, demands, returns.
 */

const MOYSKLAD_API = 'https://api.moysklad.ru/api/remap/1.2'
const FROM = '2025-01-01 00:00:00'
const TO = '2025-12-31 23:59:59'

const login = process.env.MOYSKLAD_LOGIN
const password = process.env.MOYSKLAD_PASSWORD
if (!login || !password) { console.error('Set MOYSKLAD_LOGIN and MOYSKLAD_PASSWORD'); process.exit(1) }
const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')

async function apiFetch(url) {
  const res = await fetch(url, { headers: { 'Authorization': AUTH, 'Accept-Encoding': 'gzip' } })
  if (!res.ok) { console.error(`HTTP ${res.status} for ${url.substring(0, 120)}`); return null }
  return res.json()
}

async function fetchFiltered(endpoint, label) {
  let all = []
  let offset = 0
  const filter = `moment>=${FROM};moment<=${TO}`
  while (true) {
    const url = `${MOYSKLAD_API}${endpoint}?limit=1000&offset=${offset}&filter=${encodeURIComponent(filter)}&order=moment,asc`
    const data = await apiFetch(url)
    if (!data) break
    const rows = data.rows || []
    all = all.concat(rows)
    process.stdout.write(`  ${label}: ${all.length}/${data.meta?.size || '?'}\r`)
    if (rows.length < 1000) break
    offset += 1000
  }
  const total = all.reduce((s, r) => s + (r.sum || 0), 0)
  console.log(`  ${label}: ${all.length} docs | ${(total / 100).toFixed(2)} AED`)
  return { rows: all, total, count: all.length }
}

async function fetchAllEntities(endpoint, label) {
  let all = []
  let offset = 0
  while (true) {
    const url = `${MOYSKLAD_API}${endpoint}?limit=1000&offset=${offset}`
    const data = await apiFetch(url)
    if (!data) break
    const rows = data.rows || []
    all = all.concat(rows)
    if (rows.length < 1000) break
    offset += 1000
  }
  console.log(`  ${label}: ${all.length} entities`)
  return all
}

async function main() {
  console.log('\n=== MoySklad 2025 Financial Data ===\n')

  // Revenue & COGS
  const invoicesOut = await fetchFiltered('/entity/invoiceout', 'Invoices Out (Revenue)')
  const invoicesIn = await fetchFiltered('/entity/invoicein', 'Invoices In (COGS)')
  
  // Orders & fulfillment
  const customerOrders = await fetchFiltered('/entity/customerorder', 'Customer Orders')
  const demands = await fetchFiltered('/entity/demand', 'Shipments/Demands')
  
  // Returns
  const salesReturns = await fetchFiltered('/entity/salesreturn', 'Sales Returns')
  const purchaseReturns = await fetchFiltered('/entity/purchasereturn', 'Purchase Returns')
  
  // Payments
  const paymentsIn = await fetchFiltered('/entity/paymentin', 'Payments In')
  const paymentsOut = await fetchFiltered('/entity/paymentout', 'Payments Out')
  const cashIn = await fetchFiltered('/entity/cashin', 'Cash In')
  const cashOut = await fetchFiltered('/entity/cashout', 'Cash Out')
  
  // Purchase orders
  const purchaseOrders = await fetchFiltered('/entity/purchaseorder', 'Purchase Orders')
  const supply = await fetchFiltered('/entity/supply', 'Supply (Приёмка)')

  // Money balances (not date-filtered)
  console.log('\n  Fetching current account balances...')
  const accounts = await fetchAllEntities('/entity/account', 'Bank Accounts')

  // Monthly revenue breakdown
  console.log('\n--- Monthly Revenue (Invoices Out) ---')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  for (let m = 0; m < 12; m++) {
    const monthRows = invoicesOut.rows.filter(r => new Date(r.moment).getMonth() === m)
    const monthTotal = monthRows.reduce((s, r) => s + (r.sum || 0), 0)
    console.log(`  ${months[m]} 2025: ${monthRows.length} invoices | ${(monthTotal / 100).toFixed(2)} AED`)
  }

  // Monthly COGS breakdown  
  console.log('\n--- Monthly COGS (Invoices In + Supply) ---')
  for (let m = 0; m < 12; m++) {
    const monthInv = invoicesIn.rows.filter(r => new Date(r.moment).getMonth() === m)
    const monthSup = supply.rows.filter(r => new Date(r.moment).getMonth() === m)
    const monthTotal = [...monthInv, ...monthSup].reduce((s, r) => s + (r.sum || 0), 0)
    console.log(`  ${months[m]} 2025: ${monthInv.length + monthSup.length} docs | ${(monthTotal / 100).toFixed(2)} AED`)
  }

  // Summary
  console.log('\n========================================')
  console.log('  2025 FINANCIAL DATA SUMMARY')
  console.log('========================================')
  console.log(`  Revenue (Invoices Out):     ${(invoicesOut.total / 100).toFixed(2)} AED`)
  console.log(`  Demands (Shipments):        ${(demands.total / 100).toFixed(2)} AED`)
  console.log(`  COGS (Invoices In):         ${(invoicesIn.total / 100).toFixed(2)} AED`)
  console.log(`  COGS (Supply/Приёмка):      ${(supply.total / 100).toFixed(2)} AED`)
  console.log(`  Sales Returns:              ${(salesReturns.total / 100).toFixed(2)} AED`)
  console.log(`  Purchase Returns:           ${(purchaseReturns.total / 100).toFixed(2)} AED`)
  console.log(`  Payments In:                ${(paymentsIn.total / 100).toFixed(2)} AED`)
  console.log(`  Payments Out:               ${(paymentsOut.total / 100).toFixed(2)} AED`)
  console.log(`  Cash In:                    ${(cashIn.total / 100).toFixed(2)} AED`)
  console.log(`  Cash Out:                   ${(cashOut.total / 100).toFixed(2)} AED`)
  console.log(`  Purchase Orders:            ${(purchaseOrders.total / 100).toFixed(2)} AED`)
  
  const grossRevenue = invoicesOut.total / 100
  const grossCOGS = (invoicesIn.total + supply.total) / 100
  const grossProfit = grossRevenue - grossCOGS
  console.log(`\n  GROSS PROFIT:               ${grossProfit.toFixed(2)} AED`)
  console.log(`  Gross Margin:               ${((grossProfit / grossRevenue) * 100).toFixed(1)}%`)
  console.log('========================================\n')
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
