#!/usr/bin/env node

/**
 * Milena — re-export invoice PDFs without MoySklad print template (no VAT breakdown).
 * Invoices 04752 (Wasl) + 04753 (JBR) → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-export-milena-invoice-pdf-no-vat-20260702.js
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
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const LOGO_PATH = path.join(__dirname, '..', 'public', 'images', 'genosys-logo-transparent.png')

const INVOICES = [
  { name: '04752', label: 'Wasl', id: '3ba1ac33-760b-11f1-0a80-04b10040ddfc' },
  { name: '04753', label: 'JBR', id: '3ef7036d-760b-11f1-0a80-0ffa0041fa4e' },
]

async function api(pathStr) {
  const res = await fetch(`${API}${pathStr}`, {
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 1200)}`)
  return JSON.parse(text)
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api(`${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function fmtAed(n) {
  return new Intl.NumberFormat('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

function fmtHumanDate(dateStr) {
  return new Date(`${dateStr.slice(0, 10)}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function imageDataUri(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null
  const ext = path.extname(filePath).slice(1).toLowerCase()
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`
}

function cleanName(raw) {
  return String(raw ?? '')
    .replace(/^\s*Genosys\s+/i, '')
    .trim()
}

function lineTotal(pos) {
  const disc = pos.discount || 0
  return (pos.quantity * (pos.price / 100)) * (1 - disc / 100)
}

function buildInvoiceHtml({ invoice, agent, org, positions, orderName }) {
  const logoUri = imageDataUri(LOGO_PATH)
  const invoiceDate = invoice.moment.slice(0, 10)
  const items = positions.map((p) => ({
    name: cleanName(p.assortment?.name || 'Item'),
    code: p.assortment?.code || '',
    qty: p.quantity,
    unit: p.price / 100,
    total: lineTotal(p),
  }))
  const total = invoice.sum / 100
  const addr = agent.actualAddress || agent.actualAddressFull?.addInfo || ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${esc(invoice.name)}</title>
<style>
  @page { size: A4 portrait; margin: 14mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 10.5pt;
    color: #1a1a1a;
    line-height: 1.4;
    margin: 0;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #d62d2d;
    padding-bottom: 4mm;
    margin-bottom: 6mm;
  }
  .header img { height: 16mm; width: auto; }
  .header .title { text-align: right; }
  .header h1 { margin: 0; font-size: 20pt; color: #d62d2d; letter-spacing: 0.5px; }
  .header .sub { font-size: 9pt; color: #666; margin-top: 1mm; }
  .meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5mm;
    margin-bottom: 6mm;
  }
  .box { border: 1px solid #ddd; border-radius: 2mm; padding: 3mm 4mm; background: #fafafa; }
  .box h3 { margin: 0 0 2mm 0; font-size: 8pt; text-transform: uppercase; color: #d62d2d; letter-spacing: 0.3px; }
  .box .name { font-weight: 700; font-size: 11pt; }
  .box .line { font-size: 9.5pt; color: #444; margin-top: 1mm; }
  table.items { width: 100%; border-collapse: collapse; font-size: 10pt; margin-bottom: 5mm; }
  table.items th {
    background: #1a1a1a;
    color: #fff;
    text-align: left;
    padding: 2mm 3mm;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  table.items td { border-bottom: 1px solid #e8e8e8; padding: 2mm 3mm; vertical-align: top; }
  table.items .num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  table.items .idx { width: 8mm; text-align: center; color: #888; }
  table.items .code { width: 14mm; font-family: ui-monospace, monospace; font-size: 8.5pt; color: #666; }
  .total-row {
    margin-left: auto;
    width: 72mm;
    display: flex;
    justify-content: space-between;
    font-size: 13pt;
    font-weight: 700;
    border-top: 2px solid #1a1a1a;
    padding-top: 3mm;
    margin-top: 2mm;
  }
  .footer {
    margin-top: 10mm;
    padding-top: 3mm;
    border-top: 1px solid #e0e0e0;
    font-size: 8.5pt;
    color: #666;
  }
</style>
</head>
<body>
<div class="header">
  ${logoUri ? `<img src="${logoUri}" alt="Genosys Middle East FZ-LLC" />` : '<div><strong>GENOSYS Middle East FZ-LLC</strong></div>'}
  <div class="title">
    <h1>Invoice</h1>
    <div class="sub">No. ${esc(invoice.name)} · ${esc(fmtHumanDate(invoiceDate))}</div>
    ${orderName ? `<div class="sub">Order ${esc(orderName)}</div>` : ''}
  </div>
</div>
<div class="meta">
  <div class="box">
    <h3>From</h3>
    <div class="name">${esc(org.name)}</div>
    <div class="line">Compass Coworking Centre, Al Shohada Road, Al Jazeera, Al Hamra, Ras Al Khaimah, UAE</div>
    <div class="line">TRN 104229886700003 · sales@genosys.ae</div>
  </div>
  <div class="box">
    <h3>Bill to</h3>
    <div class="name">${esc(agent.name)}</div>
    ${addr ? `<div class="line">${esc(addr)}</div>` : ''}
    ${agent.phone ? `<div class="line">${esc(agent.phone)}</div>` : ''}
  </div>
</div>
<table class="items">
  <thead>
    <tr>
      <th class="idx">#</th>
      <th class="code">Code</th>
      <th>Product</th>
      <th class="num">Qty</th>
      <th class="num">Unit (AED)</th>
      <th class="num">Amount (AED)</th>
    </tr>
  </thead>
  <tbody>
    ${items
      .map(
        (it, i) => `<tr>
      <td class="idx">${i + 1}</td>
      <td class="code">${esc(it.code)}</td>
      <td>${esc(it.name)}</td>
      <td class="num">${it.qty}</td>
      <td class="num">${fmtAed(it.unit)}</td>
      <td class="num">${fmtAed(it.total)}</td>
    </tr>`
      )
      .join('')}
  </tbody>
</table>
<div class="total-row">
  <span>Total</span>
  <span>AED ${fmtAed(total)}</span>
</div>
<div class="footer">
  ${esc(org.name)} · Invoice ${esc(invoice.name)} · ${items.reduce((s, i) => s + i.qty, 0)} units · AED ${fmtAed(total)}
</div>
</body>
</html>`
}

function htmlToPdf(htmlPath, pdfPath) {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (!fs.existsSync(chromePath)) throw new Error('Chrome not found for PDF export')
  execFileSync(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: 'inherit' }
  )
}

async function exportOne(spec) {
  const invoice = await api(`/entity/invoiceout/${spec.id}?expand=agent,organization,customerOrder`)
  const positions = await fetchAll(`/entity/invoiceout/${spec.id}/positions?expand=assortment`)
  const orderName = invoice.customerOrder?.name || ''

  const html = buildInvoiceHtml({
    invoice,
    agent: invoice.agent,
    org: invoice.organization,
    positions,
    orderName,
  })

  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const base = `GENOSYS_Milena_${spec.label}_${invoice.name}`
  const htmlPath = path.join(ORDERS_DIR, `${base}.html`)
  const pdfPath = path.join(ORDERS_DIR, `${base}.pdf`)
  fs.writeFileSync(htmlPath, html)
  htmlToPdf(htmlPath, pdfPath)

  console.log(`  ${spec.label}: ${pdfPath} (${fs.statSync(pdfPath).size} bytes) | ${(invoice.sum / 100).toFixed(2)} AED`)
  return pdfPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Milena — invoice PDFs (custom HTML, no VAT fields)')
  console.log('====================================================================\n')

  for (const spec of INVOICES) {
    await exportOne(spec)
  }

  console.log('\n  Done.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
