#!/usr/bin/env node

/**
 * Export 2026 Statement of Account (with paid amounts) for all Bianco locations.
 * Output folder: ~/Desktop/Bianco/SOA_2026/
 *
 *   node --import dotenv/config scripts/moysklad-export-bianco-soa-2026.js
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const YEAR = 2026
const FROM = `${YEAR}-01-01 00:00:00`
const TO = `${YEAR}-12-31 23:59:59`

const OUT_DIR = path.join(os.homedir(), 'Desktop', 'Bianco', 'SOA_2026')

const LOCATIONS = [
  { slug: 'Dubai_Hills', label: 'Dubai Hills', id: 'aac56118-2945-11ef-0a80-07b40031e6d1' },
  { slug: 'DSO_Cedre', label: 'DSO / Cedre Center', id: '4c134860-9a4e-11ee-0a80-09ea0005ef84' },
  { slug: 'Layan', label: 'Layan', id: '303f576b-bc51-11ef-0a80-18d900088ff1' },
  { slug: 'JGE_Ladies', label: 'JGE Ladies', id: 'f10054f9-da25-11ef-0a80-115c0005d233' },
  { slug: 'JGE_Gents', label: 'JGE Gents', id: 'f7d1afa3-9f84-11f0-0a80-1567000e3f47' },
]

async function api(pathStr) {
  const res = await fetch(API + pathStr, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8' },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(entity, agentId) {
  const filter = encodeURIComponent(
    `agent=${API}/entity/counterparty/${agentId};moment>=${FROM};moment<=${TO}`
  )
  const rows = []
  let offset = 0
  while (true) {
    const data = await api(`/entity/${entity}?filter=${filter}&limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function fmtDate(momentStr) {
  if (!momentStr) return ''
  return momentStr.slice(0, 10).split('-').reverse().join('/')
}

function statementDate() {
  return fmtDate(new Date().toISOString())
}

function sortByMoment(a, b) {
  return String(a.moment || '').localeCompare(String(b.moment || ''))
}

function buildRows(invoices, reports) {
  const rows = []
  for (const inv of invoices) {
    rows.push({
      docNo: inv.name,
      docType: 'Invoice',
      customer: inv.agent?.name || '',
      date: inv.moment,
      amount: inv.sum || 0,
      paid: inv.payedSum || 0,
    })
  }
  for (const rep of reports) {
    rows.push({
      docNo: rep.name,
      docType: 'Commission report',
      customer: rep.agent?.name || '',
      date: rep.moment,
      amount: rep.sum || 0,
      paid: rep.payedSum || 0,
    })
  }
  rows.sort(sortByMoment)
  return rows
}

function totals(rows) {
  const amount = rows.reduce((s, r) => s + r.amount, 0)
  const paid = rows.reduce((s, r) => s + r.paid, 0)
  return { amount, paid, balance: amount - paid }
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildHtml(loc, agent, rows, payments, t) {
  const rowHtml = rows
    .map(
      (r) => `<tr>
        <td>${escapeHtml(r.docNo)}</td>
        <td>${escapeHtml(r.docType)}</td>
        <td>${escapeHtml(r.customer || agent.name)}</td>
        <td>${fmtDate(r.date)}</td>
        <td class="num">${money(r.amount)}</td>
        <td class="num">${money(r.paid)}</td>
        <td class="num">${money(r.amount - r.paid)}</td>
      </tr>`
    )
    .join('\n')

  const payHtml = payments
    .sort(sortByMoment)
    .map(
      (p) => `<tr>
        <td>${escapeHtml(p.name)}</td>
        <td>${fmtDate(p.moment)}</td>
        <td class="num">${money(p.sum)}</td>
        <td>${escapeHtml((p.description || '').slice(0, 80))}</td>
      </tr>`
    )
    .join('\n')

  const payTotal = payments.reduce((s, p) => s + (p.sum || 0), 0)

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>SOA ${escapeHtml(loc.label)} ${YEAR}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #222; }
  .header { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .brand { font-size: 14pt; font-weight: 700; color: #7a003c; }
  .meta { font-size: 8.5pt; line-height: 1.35; text-align: right; max-width: 55%; }
  h1 { text-align: center; font-size: 16pt; margin: 10px 0 12px; letter-spacing: 0.5px; }
  .summary { background: #f3f3f3; padding: 10px 12px; margin-bottom: 12px; border-radius: 4px; }
  .summary table { width: 100%; border-collapse: collapse; }
  .summary td { padding: 2px 8px 2px 0; vertical-align: top; }
  .summary .label { width: 140px; font-weight: 600; }
  h2 { font-size: 11pt; margin: 14px 0 6px; }
  table.data { width: 100%; border-collapse: collapse; margin-top: 4px; }
  table.data th { background: #666; color: #fff; padding: 6px 5px; text-align: left; font-size: 9pt; }
  table.data td { border-bottom: 1px solid #ddd; padding: 5px; vertical-align: top; }
  .num { text-align: right; white-space: nowrap; }
  .totals { margin-top: 10px; width: 320px; margin-left: auto; }
  .totals td { padding: 4px 6px; }
  .totals .label { font-weight: 600; }
  .footer { margin-top: 18px; font-size: 8.5pt; color: #555; }
</style></head><body>
<div class="header">
  <div>
    <div class="brand">GENOSYS Middle East FZ-LLC</div>
    <div>TRN: 104229886700003 | Trade License: 5023192</div>
    <div>Compass Coworking Centre, Genosys ME, Ras Al Khaimah, UAE</div>
    <div>sales@genosys.ae | +971 58 548 76 65 | https://www.genosys.ae</div>
  </div>
  <div class="meta">
    WIO Bank P.J.S.C.<br>
    IBAN: AE110860000009833011607<br>
    Acc: 9833011607
  </div>
</div>
<h1>STATEMENT OF ACCOUNT</h1>
<div class="summary">
  <table>
    <tr><td class="label">Statement date:</td><td>${statementDate()}</td></tr>
    <tr><td class="label">Customer:</td><td>${escapeHtml(agent.name)}</td></tr>
    <tr><td class="label">Location:</td><td>${escapeHtml(loc.label)}</td></tr>
    <tr><td class="label">Period:</td><td>1 January ${YEAR} – 31 December ${YEAR}</td></tr>
    <tr><td class="label">Currency:</td><td>AED (VAT inclusive where applicable)</td></tr>
    <tr><td class="label">Notes:</td><td>Invoices and commission reports with paid and outstanding balances. Incoming payments listed separately.</td></tr>
  </table>
</div>

<h2>Invoices &amp; commission reports (${YEAR})</h2>
<table class="data">
  <thead><tr>
    <th>Doc #</th><th>Type</th><th>Customer</th><th>Date</th>
    <th class="num">Amount AED</th><th class="num">Paid AED</th><th class="num">Balance AED</th>
  </tr></thead>
  <tbody>
    ${rowHtml || '<tr><td colspan="7">No documents in this period.</td></tr>'}
  </tbody>
</table>
<table class="totals">
  <tr><td class="label">Total amount:</td><td class="num">${money(t.amount)}</td></tr>
  <tr><td class="label">Paid amount:</td><td class="num">${money(t.paid)}</td></tr>
  <tr><td class="label">Pending payment:</td><td class="num">${money(t.balance)}</td></tr>
</table>

<h2>Incoming payments (${YEAR})</h2>
<table class="data">
  <thead><tr><th>Payment #</th><th>Date</th><th class="num">Amount AED</th><th>Description</th></tr></thead>
  <tbody>
    ${payHtml || '<tr><td colspan="4">No payments recorded in this period.</td></tr>'}
  </tbody>
</table>
<table class="totals">
  <tr><td class="label">Total payments:</td><td class="num">${money(payTotal)}</td></tr>
</table>

<div class="footer">Prepared for Bianco / Charisse Bianca — ${statementDate()}. Source: MoySklad.</div>
</body></html>`
}

function htmlToPdf(htmlPath, pdfPath) {
  execFileSync('soffice', [
    '--headless',
    '--convert-to',
    'pdf',
    '--outdir',
    path.dirname(pdfPath),
    htmlPath,
  ])
  const generated = htmlPath.replace(/\.html$/i, '.pdf')
  if (generated !== pdfPath && fs.existsSync(generated)) {
    fs.renameSync(generated, pdfPath)
  }
}

function rowsToCsv(rows) {
  const header = ['DocNo', 'Type', 'Customer', 'Date', 'AmountAED', 'PaidAED', 'BalanceAED']
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(
      [
        r.docNo,
        r.docType,
        `"${(r.customer || '').replace(/"/g, '""')}"`,
        fmtDate(r.date),
        money(r.amount),
        money(r.paid),
        money(r.amount - r.paid),
      ].join(',')
    )
  }
  return lines.join('\n')
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log('Output folder:', OUT_DIR)

  const indexLines = [
    `# Bianco — Statement of Account ${YEAR}`,
    '',
    'Prepared for Charisse Bianca (all Bianco locations).',
    `Generated: ${new Date().toISOString().slice(0, 19).replace('T', ' ')} UAE`,
    '',
    'Each PDF shows 2026 invoices / commission reports with **Paid** and **Balance**, plus incoming payments.',
    '',
  ]

  for (const loc of LOCATIONS) {
    console.log(`\n${loc.label}...`)
    const agent = await api(`/entity/counterparty/${loc.id}`)
    const invoices = await fetchAll('invoiceout', loc.id)
    const reports = await fetchAll('commissionreportin', loc.id)
    const payments = await fetchAll('paymentin', loc.id)

    const rows = buildRows(invoices, reports)
    const t = totals(rows)

    const base = `GENOSYS_Bianco_${loc.slug}_SOA_${YEAR}`
    const htmlPath = path.join(OUT_DIR, `${base}.html`)
    const pdfPath = path.join(OUT_DIR, `${base}.pdf`)
    const csvPath = path.join(OUT_DIR, `${base}.csv`)

    fs.writeFileSync(htmlPath, buildHtml(loc, agent, rows, payments, t))
    fs.writeFileSync(csvPath, rowsToCsv(rows))
    htmlToPdf(htmlPath, pdfPath)

    console.log(`  docs: ${rows.length} | amount ${money(t.amount)} | paid ${money(t.paid)} | balance ${money(t.balance)}`)
    console.log(`  payments: ${payments.length} | total ${money(payments.reduce((s, p) => s + (p.sum || 0), 0))}`)
    console.log(`  PDF: ${pdfPath}`)

    indexLines.push(
      `## ${loc.label}`,
      `- Customer: ${agent.name}`,
      `- Documents: ${rows.length} | Amount: ${money(t.amount)} AED | Paid: ${money(t.paid)} AED | Balance: ${money(t.balance)} AED`,
      `- PDF: \`${path.basename(pdfPath)}\``,
      `- CSV: \`${path.basename(csvPath)}\``,
      ''
    )
  }

  const readmePath = path.join(OUT_DIR, 'README.md')
  fs.writeFileSync(readmePath, indexLines.join('\n'))
  console.log(`\nREADME: ${readmePath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
