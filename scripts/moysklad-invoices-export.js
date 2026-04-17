#!/usr/bin/env node

/**
 * Export MoySklad customer invoices (Счета покупателям) to Excel + Markdown.
 * Period: 01.01.2026 — 31.03.2026
 * 
 * Usage:
 *   MOYSKLAD_LOGIN="email" MOYSKLAD_PASSWORD="pass" node scripts/moysklad-invoices-export.js
 */

const fs = require('fs')
const path = require('path')

const MOYSKLAD_API = 'https://api.moysklad.ru/api/remap/1.2'
const PERIOD_FROM = '2026-01-01 00:00:00'
const PERIOD_TO = '2026-03-31 23:59:59'
const PERIOD_LABEL = '01.01.2026 — 31.03.2026'

const login = process.env.MOYSKLAD_LOGIN
const password = process.env.MOYSKLAD_PASSWORD
if (!login || !password) {
  console.error('Set MOYSKLAD_LOGIN and MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')

async function apiFetch(url) {
  const res = await fetch(url, {
    headers: { 'Authorization': AUTH, 'Accept-Encoding': 'gzip' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).substring(0, 200)}`)
  return res.json()
}

async function fetchAllInvoices() {
  let all = []
  let offset = 0
  const limit = 1000
  const filter = `moment>=${PERIOD_FROM};moment<=${PERIOD_TO}`

  while (true) {
    const url = `${MOYSKLAD_API}/entity/invoiceout?limit=${limit}&offset=${offset}&filter=${encodeURIComponent(filter)}&order=moment,asc`
    const data = await apiFetch(url)
    const rows = data.rows || []
    all = all.concat(rows)
    console.log(`  Fetched ${all.length}/${data.meta?.size || '?'} invoices...`)
    if (rows.length < limit) break
    offset += limit
  }
  return all
}

async function resolveNames(invoices) {
  const agentCache = {}
  const stateCache = {}

  for (const inv of invoices) {
    // Counterparty
    const agentHref = inv.agent?.meta?.href
    if (agentHref && !inv.agent.name) {
      if (!agentCache[agentHref]) {
        try { agentCache[agentHref] = (await apiFetch(agentHref)).name || '' } catch { agentCache[agentHref] = '' }
      }
      inv.agent.name = agentCache[agentHref]
    }
    // State
    const stateHref = inv.state?.meta?.href
    if (stateHref && !inv.state.name) {
      if (!stateCache[stateHref]) {
        try { stateCache[stateHref] = (await apiFetch(stateHref)).name || '' } catch { stateCache[stateHref] = '' }
      }
      inv.state.name = stateCache[stateHref]
    }
  }

  console.log(`  Resolved ${Object.keys(agentCache).length} counterparties, ${Object.keys(stateCache).length} states`)
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

function fmtMoney(kopecks) {
  return (kopecks / 100).toFixed(2)
}

function monthName(iso) {
  return new Date(iso).toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

function escCSV(val) {
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`
  return s
}

async function main() {
  const desktopDir = path.join(require('os').homedir(), 'Desktop')

  console.log(`\nMoySklad Customer Invoices Export — ${PERIOD_LABEL}\n`)

  // 1. Fetch invoices
  console.log('Fetching invoices...')
  const invoices = await fetchAllInvoices()

  // 2. Resolve names
  console.log('Resolving counterparty names...')
  await resolveNames(invoices)

  // 3. Build structured data
  const rows = invoices.map((inv, idx) => ({
    num: idx + 1,
    date: fmtDate(inv.moment),
    invoiceNumber: inv.name || '',
    counterparty: inv.agent?.name || '',
    status: inv.state?.name || '',
    sum: fmtMoney(inv.sum || 0),
    sumRaw: (inv.sum || 0) / 100,
    month: inv.moment ? new Date(inv.moment).getMonth() : -1,
    description: (inv.description || '').replace(/\n/g, ' '),
  }))

  const grandTotal = rows.reduce((s, r) => s + r.sumRaw, 0)

  // Monthly totals
  const months = [
    { label: 'January 2026', m: 0 },
    { label: 'February 2026', m: 1 },
    { label: 'March 2026', m: 2 },
  ]
  const monthlyTotals = months.map(({ label, m }) => {
    const monthRows = rows.filter(r => r.month === m)
    return {
      label,
      count: monthRows.length,
      total: monthRows.reduce((s, r) => s + r.sumRaw, 0),
    }
  })

  // ============================
  // EXCEL (CSV with BOM for Excel)
  // ============================
  const csvHeader = ['#', 'Date', 'Invoice #', 'Counterparty', 'Status', 'Amount (AED)', 'Description']
  const csvLines = [csvHeader.join(',')]

  for (const r of rows) {
    csvLines.push([r.num, r.date, escCSV(r.invoiceNumber), escCSV(r.counterparty), escCSV(r.status), r.sum, escCSV(r.description)].join(','))
  }

  // Add empty row then summary
  csvLines.push('')
  csvLines.push(`,,,,GRAND TOTAL:,${grandTotal.toFixed(2)},`)
  csvLines.push('')
  csvLines.push('Monthly Summary,,,,,')
  csvLines.push('Month,Invoices,,,,Amount (AED),')
  for (const mt of monthlyTotals) {
    csvLines.push(`${mt.label},${mt.count},,,,${mt.total.toFixed(2)},`)
  }
  csvLines.push(`TOTAL,${rows.length},,,,${grandTotal.toFixed(2)},`)

  const csvContent = '\uFEFF' + csvLines.join('\r\n')  // BOM for Excel UTF-8
  const csvPath = path.join(desktopDir, 'Genosys_Customer_Invoices_Q1_2026.csv')
  fs.writeFileSync(csvPath, csvContent, 'utf-8')
  console.log(`\n  Excel (CSV): ${csvPath}`)

  // ============================
  // MARKDOWN
  // ============================
  const md = []
  md.push(`# Customer Invoices — Genosys Middle East FZ-LLC`)
  md.push(`## Period: ${PERIOD_LABEL}`)
  md.push(`> Generated: ${new Date().toLocaleString('en-GB')}`)
  md.push('')
  md.push('---')
  md.push('')

  // Summary box
  md.push('## Summary')
  md.push('')
  md.push(`| | Invoices | Amount (AED) |`)
  md.push(`|---|---:|---:|`)
  for (const mt of monthlyTotals) {
    md.push(`| ${mt.label} | ${mt.count} | ${mt.total.toFixed(2)} |`)
  }
  md.push(`| **TOTAL** | **${rows.length}** | **${grandTotal.toFixed(2)}** |`)
  md.push('')
  md.push('---')
  md.push('')

  // Full table
  md.push('## All Customer Invoices')
  md.push('')
  md.push('| # | Date | Invoice # | Counterparty | Status | Amount (AED) |')
  md.push('|---:|:---:|:---|:---|:---|---:|')

  let currentMonth = -1
  for (const r of rows) {
    if (r.month !== currentMonth) {
      currentMonth = r.month
      const mTotal = monthlyTotals.find(m => m.m === currentMonth) || monthlyTotals[currentMonth]
      md.push(`| | **${mTotal?.label || ''}** | | | | |`)
    }
    md.push(`| ${r.num} | ${r.date} | ${r.invoiceNumber} | ${r.counterparty} | ${r.status} | ${r.sum} |`)
  }
  md.push(`| | | | | **GRAND TOTAL** | **${grandTotal.toFixed(2)}** |`)
  md.push('')
  md.push('---')
  md.push(`*Source: MoySklad API (api.moysklad.ru) — Genosys Middle East FZ-LLC*`)

  const mdPath = path.join(desktopDir, 'Genosys_Customer_Invoices_Q1_2026.md')
  fs.writeFileSync(mdPath, md.join('\n'), 'utf-8')
  console.log(`  Markdown:    ${mdPath}`)

  console.log(`\n  Total: ${rows.length} invoices | ${grandTotal.toFixed(2)} AED\n`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
