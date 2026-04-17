#!/usr/bin/env node

/**
 * Pull 2025 outgoing payment details to categorize expenses.
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
  if (!res.ok) return null
  return res.json()
}

async function fetchFiltered(endpoint) {
  let all = []
  let offset = 0
  const filter = `moment>=${FROM};moment<=${TO}`
  while (true) {
    const url = `${MOYSKLAD_API}${endpoint}?limit=1000&offset=${offset}&filter=${encodeURIComponent(filter)}&order=moment,asc`
    const data = await apiFetch(url)
    if (!data) break
    all = all.concat(data.rows || [])
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return all
}

async function main() {
  console.log('\n=== 2025 Outgoing Payments Detail ===\n')

  const payments = await fetchFiltered('/entity/paymentout')
  console.log(`Total outgoing payments: ${payments.length}\n`)

  // Resolve agent names
  const agentCache = {}
  for (const p of payments) {
    const href = p.agent?.meta?.href
    if (href && !agentCache[href]) {
      const data = await apiFetch(href)
      agentCache[href] = data?.name || '?'
    }
  }

  // Resolve expense item names
  const expenseCache = {}
  for (const p of payments) {
    const href = p.expenseItem?.meta?.href
    if (href && !expenseCache[href]) {
      const data = await apiFetch(href)
      expenseCache[href] = data?.name || '?'
    }
  }

  // Group by counterparty
  const byAgent = {}
  const byExpense = {}
  
  for (const p of payments) {
    const agent = agentCache[p.agent?.meta?.href] || p.agent?.name || 'Unknown'
    const expense = expenseCache[p.expenseItem?.meta?.href] || p.expenseItem?.name || 'Uncategorized'
    const sum = (p.sum || 0) / 100

    if (!byAgent[agent]) byAgent[agent] = { total: 0, count: 0 }
    byAgent[agent].total += sum
    byAgent[agent].count++

    if (!byExpense[expense]) byExpense[expense] = { total: 0, count: 0 }
    byExpense[expense].total += sum
    byExpense[expense].count++
  }

  console.log('--- By Counterparty ---')
  const agentEntries = Object.entries(byAgent).sort((a, b) => b[1].total - a[1].total)
  for (const [name, data] of agentEntries) {
    console.log(`  ${name.padEnd(45)} ${data.count.toString().padStart(4)} payments | ${data.total.toFixed(2).padStart(14)} AED`)
  }

  console.log('\n--- By Expense Category ---')
  const expEntries = Object.entries(byExpense).sort((a, b) => b[1].total - a[1].total)
  for (const [name, data] of expEntries) {
    console.log(`  ${name.padEnd(45)} ${data.count.toString().padStart(4)} payments | ${data.total.toFixed(2).padStart(14)} AED`)
  }

  // Also pull Loss reports (убытки) if any
  console.log('\n--- Individual Payments (top 30 by amount) ---')
  const sorted = [...payments].sort((a, b) => (b.sum || 0) - (a.sum || 0))
  for (const p of sorted.slice(0, 30)) {
    const agent = agentCache[p.agent?.meta?.href] || '?'
    const expense = expenseCache[p.expenseItem?.meta?.href] || ''
    const date = new Date(p.moment).toLocaleDateString('en-GB')
    console.log(`  ${date.padEnd(12)} ${(p.name || '').padEnd(10)} ${agent.padEnd(35)} ${expense.padEnd(20)} ${((p.sum || 0) / 100).toFixed(2).padStart(14)} AED  ${(p.description || '').substring(0, 40)}`)
  }

  const totalOut = payments.reduce((s, p) => s + (p.sum || 0), 0) / 100
  console.log(`\n  TOTAL Payments Out: ${totalOut.toFixed(2)} AED`)

  // Also check for money movements (transfers between accounts)
  console.log('\n--- Checking moves (internal transfers) ---')
  const moves = await fetchFiltered('/entity/move')
  console.log(`  Stock moves: ${moves.length} docs`)

  // Check retail demand
  console.log('\n--- Loss documents ---')
  const losses = await fetchFiltered('/entity/loss')
  console.log(`  Losses: ${losses.length} docs | ${(losses.reduce((s, r) => s + (r.sum || 0), 0) / 100).toFixed(2)} AED`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
