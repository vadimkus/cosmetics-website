#!/usr/bin/env node

/**
 * Official payment receipt — NOVA MEDICAL CENTER FAB cheque 248360 / AED 2,700
 * against invoice 04931 (SO GENCardM260812NOVA / SHIP 06687).
 *
 * Header.png + Stamp.png from ~/Desktop/orders/. PDF lands there. No print. No paymentin.
 *
 *   node --import dotenv/config scripts/generate-nova-medical-center-cheque-receipt-20260819.js
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), override: false })

const { uaeToday } = require('./lib/moysklad-uae-date')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const HEADER_PATH = path.join(ORDERS_DIR, 'Header.png')
const STAMP_PATH = path.join(ORDERS_DIR, 'Stamp.png')
const INVOICE_NAME = '04931'
const DOC_NO = 'GME-RCP-20260819-04931'
const ISSUE_DATE = uaeToday()
const PDF_PATH = path.join(ORDERS_DIR, 'GENOSYS_Nova_Medical_Center_Receipt_04931.pdf')

const CHEQUE = {
  number: '248360',
  date: '2026-08-17',
  amount: 2700,
  amountWords: 'TWO THOUSAND SEVEN HUNDRED ONLY',
  bank: 'First Abu Dhabi Bank PJSC (FAB)',
  branch: 'Al Ain New',
  iban: 'AE910351561323454912014',
  type: 'A/C Payee',
  payee: 'GENOSYS MIDDLE EAST FZ-LLC',
}

const CUSTOMER = {
  name: 'NOVA MEDICAL CENTER',
  address: 'Al Noor Complex, Al Muwaiji, Saed Bin Tahnon Al Awal St, Al Ain, Abu Dhabi, United Arab Emirates',
  trn: '100255565200003',
  license: 'CN-1212562',
  phone: '+971506914962',
}

async function msGet(pathStr, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : `${API}${pathStr}`
  const res = await fetch(url, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
  })
  const text = await res.text()
  if ((res.status === 429 || res.status >= 500) && attempt < 6) {
    await new Promise((r) => setTimeout(r, 700 * attempt))
    return msGet(pathStr, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

function imageDataUri(filePath) {
  const ext = path.extname(filePath).slice(1).toLowerCase()
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`
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
  const d = new Date(`${dateStr}T12:00:00+04:00`)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Dubai' })
}

function cleanName(raw) {
  return String(raw ?? '').replace(/^\s*Genosys\s+/i, '').trim()
}

async function main() {
  if (!fs.existsSync(HEADER_PATH)) throw new Error(`Missing header: ${HEADER_PATH}`)
  if (!fs.existsSync(STAMP_PATH)) throw new Error(`Missing stamp: ${STAMP_PATH}`)

  const search = await msGet(
    `/entity/invoiceout?filter=name=${encodeURIComponent(INVOICE_NAME)}&limit=1&expand=positions.assortment`
  )
  const invoice = search.rows?.[0]
  if (!invoice) throw new Error(`Invoice ${INVOICE_NAME} not found`)
  if (invoice.sum !== CHEQUE.amount * 100) {
    throw new Error(`Invoice ${INVOICE_NAME} is ${invoice.sum / 100} AED, cheque is ${CHEQUE.amount}`)
  }

  const items = (invoice.positions?.rows || []).map((p) => ({
    code: p.assortment?.code || '',
    name: cleanName(p.assortment?.name),
    qty: p.quantity,
    unit: p.price / 100,
    total: p.quantity * (p.price / 100) * (1 - (p.discount || 0) / 100),
  }))

  const headerDataUri = imageDataUri(HEADER_PATH)
  const stampDataUri = imageDataUri(STAMP_PATH)
  const vatSum = (invoice.vatSum || 0) / 100
  const totalInc = invoice.sum / 100

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Payment Receipt — ${esc(CUSTOMER.name)} — ${esc(INVOICE_NAME)}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    color: #1a1a1a; font-size: 8.4pt; line-height: 1.26; margin: 0; padding: 0;
  }
  .page {
    width: 210mm; height: 296.5mm; position: relative;
    padding: 56mm 12mm 10mm 12mm; overflow: hidden; background: #fff;
  }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; }
  .letterhead img { width: 100%; height: auto; display: block; }
  h1 {
    font-size: 12pt; font-weight: 700; margin: 0 0 0.4mm 0;
    text-transform: uppercase; letter-spacing: 0.4px; color: #d62d2d; text-align: center;
  }
  .subtitle { text-align: center; color: #666; font-size: 8.2pt; margin: 0 0 2.4mm 0; }
  .meta {
    border: 1px solid #e0e0e0; border-radius: 3px; padding: 1.8mm 3mm;
    background: #fafafa; margin-bottom: 2.4mm; display: grid;
    grid-template-columns: 1fr 1fr 1fr; gap: 1.2mm 4mm; font-size: 8pt;
  }
  .meta .label { color: #666; font-size: 6.8pt; text-transform: uppercase; letter-spacing: 0.3px; }
  .meta .value { font-weight: 600; }
  .party {
    border: 1px solid #e0e0e0; border-radius: 3px; padding: 1.8mm 3mm; margin-bottom: 2.4mm;
  }
  .party h3 {
    margin: 0 0 0.6mm 0; font-size: 7.2pt; color: #666; text-transform: uppercase;
    letter-spacing: 0.3px; font-weight: 600;
  }
  .party .name { font-weight: 700; font-size: 9.4pt; }
  .party .detail { font-size: 8pt; color: #333; }
  .paybox {
    border: 1px solid #d62d2d; background: #fef7f7; border-radius: 3px;
    padding: 1.8mm 3mm; margin-bottom: 2.4mm;
  }
  .paybox h3 {
    margin: 0 0 1mm 0; font-size: 8pt; text-transform: uppercase;
    letter-spacing: 0.3px; color: #d62d2d;
  }
  .paygrid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8mm 4mm; font-size: 8pt; }
  .paygrid .label { color: #666; font-size: 6.6pt; text-transform: uppercase; letter-spacing: 0.25px; }
  .paygrid .value { font-weight: 600; }
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 1.6mm; font-size: 7.7pt; }
  table.items thead th {
    background: #1a1a1a; color: #fff; text-align: left; padding: 0.9mm 1.6mm;
    font-weight: 600; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.25px;
  }
  table.items tbody td { border-bottom: 1px solid #ececec; padding: 0.65mm 1.6mm; vertical-align: top; }
  table.items tbody tr:nth-child(even) td { background: #fafafa; }
  table.items .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  table.items .code { width: 15mm; color: #666; }
  table.items .qty { width: 11mm; }
  table.items .price { width: 18mm; }
  table.items .total { width: 20mm; font-weight: 600; }
  .bottom { display: flex; gap: 6mm; align-items: flex-end; margin-top: 1mm; }
  .bottom .left { flex: 1; }
  .totals { width: 58mm; font-size: 8.4pt; }
  .totals .row { display: flex; justify-content: space-between; padding: 0.5mm 0; border-bottom: 1px solid #ececec; }
  .totals .row.total { border-bottom: none; border-top: 2px solid #1a1a1a; font-weight: 700; font-size: 10pt; padding-top: 1.2mm; margin-top: 0.5mm; }
  .highlight {
    border-left: 3px solid #d62d2d; background: #fef7f7; padding: 1.6mm 2.8mm;
    margin: 0 0 2mm 0; font-weight: 600; font-size: 8.6pt;
  }
  .sign .label { font-size: 7pt; color: #666; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 1mm; }
  .sign .stamp { width: 52mm; height: auto; display: block; }
  .sign .sig-text { font-size: 7.6pt; margin-top: 0.8mm; }
  .footer-note {
    margin-top: 2.2mm; padding-top: 1.4mm; border-top: 1px solid #e0e0e0;
    font-size: 7pt; color: #666; line-height: 1.35;
  }
</style>
</head>
<body>
<div class="page">
<div class="letterhead"><img src="${headerDataUri}" alt="Genosys Middle East FZ-LLC" /></div>

<h1>Official Payment Receipt</h1>
<div class="subtitle">Received with thanks</div>

<div class="meta">
  <div>
    <div class="label">Receipt No.</div>
    <div class="value">${esc(DOC_NO)}</div>
  </div>
  <div>
    <div class="label">Receipt Date</div>
    <div class="value">${esc(fmtHumanDate(ISSUE_DATE))}</div>
  </div>
  <div>
    <div class="label">Against Invoice</div>
    <div class="value">${esc(invoice.name)} · ${esc(fmtHumanDate(invoice.moment.slice(0, 10)))}</div>
  </div>
  <div>
    <div class="label">Sales Order</div>
    <div class="value">GENCardM260812NOVA</div>
  </div>
  <div>
    <div class="label">Shipment</div>
    <div class="value">06687</div>
  </div>
  <div>
    <div class="label">Amount Received</div>
    <div class="value">AED ${fmtAed(CHEQUE.amount)}</div>
  </div>
</div>

<div class="party">
  <h3>Received From</h3>
  <div class="name">${esc(CUSTOMER.name)}</div>
  <div class="detail">${esc(CUSTOMER.address)}</div>
  <div class="detail">TRN ${esc(CUSTOMER.trn)} · License ${esc(CUSTOMER.license)} · Phone ${esc(CUSTOMER.phone)}</div>
</div>

<div class="paybox">
  <h3>Cheque received</h3>
  <div class="paygrid">
    <div>
      <div class="label">Cheque No.</div>
      <div class="value">${esc(CHEQUE.number)}</div>
    </div>
    <div>
      <div class="label">Cheque Date</div>
      <div class="value">${esc(fmtHumanDate(CHEQUE.date))}</div>
    </div>
    <div>
      <div class="label">Type</div>
      <div class="value">${esc(CHEQUE.type)}</div>
    </div>
    <div>
      <div class="label">Bank / Branch</div>
      <div class="value">${esc(CHEQUE.bank)}, ${esc(CHEQUE.branch)}</div>
    </div>
    <div>
      <div class="label">Drawer IBAN</div>
      <div class="value">${esc(CHEQUE.iban)}</div>
    </div>
    <div>
      <div class="label">Payee</div>
      <div class="value">${esc(CHEQUE.payee)}</div>
    </div>
    <div style="grid-column: 1 / -1;">
      <div class="label">Amount in words</div>
      <div class="value">${esc(CHEQUE.amountWords)} (AED ${fmtAed(CHEQUE.amount)})</div>
    </div>
  </div>
</div>

<table class="items">
  <thead>
    <tr>
      <th class="code">Code</th>
      <th>Product</th>
      <th class="qty num">Qty</th>
      <th class="price num">Unit</th>
      <th class="total num">Line</th>
    </tr>
  </thead>
  <tbody>
    ${items
      .map(
        (it) => `
    <tr>
      <td class="code">${esc(it.code)}</td>
      <td>${esc(it.name)}</td>
      <td class="qty num">${it.qty}</td>
      <td class="price num">${fmtAed(it.unit)}</td>
      <td class="total num">${fmtAed(it.total)}</td>
    </tr>`
      )
      .join('')}
  </tbody>
</table>

<div class="highlight">
  Received with thanks from ${esc(CUSTOMER.name)} the sum of <strong>AED ${fmtAed(CHEQUE.amount)}</strong>
  by FAB cheque No.&nbsp;${esc(CHEQUE.number)}, in full settlement of invoice <strong>${esc(invoice.name)}</strong>.
</div>

<div class="bottom">
  <div class="left sign">
    <div class="label">Authorized Signatory / Company Print</div>
    <img class="stamp" src="${stampDataUri}" alt="Genosys company seal" />
    <div class="sig-text">
      <strong>Vadim Sagatdinov</strong> · Manager · Genosys Middle East FZ-LLC · ${esc(fmtHumanDate(ISSUE_DATE))}
    </div>
  </div>
  <div class="totals">
    <div class="row"><div class="label">VAT included</div><div class="value">AED ${fmtAed(vatSum)}</div></div>
    <div class="row total"><div class="label">Invoice total</div><div class="value">AED ${fmtAed(totalInc)}</div></div>
  </div>
</div>

<div class="footer-note">
  ${esc(DOC_NO)} · Issued ${esc(fmtHumanDate(ISSUE_DATE))} · This receipt confirms physical receipt of the cheque
  named above against invoice ${esc(invoice.name)} / sales order GENCardM260812NOVA / shipment 06687.
  Clinic prices are VAT inclusive. Document is electronically generated and carries the company print.
</div>
</div>

</body>
</html>`

  const tmpDir = path.join(__dirname, '..', 'tmp')
  fs.mkdirSync(tmpDir, { recursive: true })
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const htmlPath = path.join(tmpDir, 'nova-medical-center-receipt-04931.html')
  fs.writeFileSync(htmlPath, html)

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (!fs.existsSync(chromePath)) throw new Error(`Google Chrome not found at ${chromePath}`)

  execFileSync(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      `--print-to-pdf=${PDF_PATH}`,
      `file://${htmlPath}`,
    ],
    { stdio: 'inherit' }
  )

  if (!fs.existsSync(PDF_PATH)) throw new Error('PDF was not created')
  console.log(`HTML: ${htmlPath}`)
  console.log(`PDF:  ${PDF_PATH} (${fs.statSync(PDF_PATH).size} bytes)`)
  console.log(`Receipt ${DOC_NO} · INV ${invoice.name} · cheque ${CHEQUE.number} · AED ${fmtAed(CHEQUE.amount)}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
