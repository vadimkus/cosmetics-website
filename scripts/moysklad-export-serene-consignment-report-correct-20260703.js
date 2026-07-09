#!/usr/bin/env node

/**
 * Serene Skin Beauty — CORRECT Goods on Consignment Report PDF.
 *
 * The MoySklad native template (Invoice_Consignment_Report_Genosys) over-counts
 * because it re-adds settlement-mirror shipments (06271 / 06436) as stock-in and
 * lists already-settled SKUs. This builds the report from the true consignment
 * ledger instead:
 *
 *   On-hand = Σ replenishment demands (contract 00060, EXCLUDING settlement mirrors)
 *           − Σ commission reports − Σ sales returns
 *
 * Verified against salon physical count (2026-07-03):
 *   00021 x3, 00035 x2, 00040 x1, 00041 x1, 00144 x2, 00195 x0, 54457 x1
 *
 *   node --import dotenv/config scripts/moysklad-export-serene-consignment-report-correct-20260703.js
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

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const AGENT_ID = '993395aa-8da2-11ec-0a80-006b0038cd99'
const CONTRACT_ID = 'dc5c469a-d943-11ed-0a80-05bd0013eb27'
// NOTE: earlier we wrongly excluded 06271/06436 as "settlement mirrors". They are
// REAL shipments (sea algae masks, Revita BB creams, makeup remover, microbiome).
// Salon confirmed it holds those items — use the FULL ledger, no exclusions.
const EXCLUDE_DEMANDS = new Set()

const BUYER = {
  name: 'Serene Skin Beauty Salon LLC',
  phone: '+971564715477',
  address: 'Derby Residence 3, Shop 1',
  trn: '105207755700003',
  license: '1566518',
}

const PHYSICAL = {
  '00021': 3,
  '00035': 2,
  '00040': 1,
  '00041': 1,
  '00144': 2,
  '00195': 0,
  '54457': 1,
  '54461': 3,
  '00188': 5,
  '00140': 10,
  '54472': 3,
  '54473': 3,
}

const LOGO_PATH = path.join(__dirname, '..', 'public', 'images', 'genosys-logo-transparent.png')
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
  }
  return rows
}

async function pos(href) {
  return fetchAll(`${href}/positions?expand=assortment`)
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
  const d = new Date(`${dateStr}T12:00:00`)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function imageDataUri(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null
  const ext = path.extname(filePath).slice(1).toLowerCase()
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`
}

async function computeLedger() {
  const agentHref = `${API}/entity/counterparty/${AGENT_ID}`
  const contractHref = `${API}/entity/contract/${CONTRACT_ID}`
  const filter = encodeURIComponent(`agent=${agentHref};contract=${contractHref}`)

  const demands = (await fetchAll(`/entity/demand?filter=${filter}`)).filter(
    (d) => !EXCLUDE_DEMANDS.has(d.name)
  )
  const reports = await fetchAll(`/entity/commissionreportin?filter=${filter}`)
  const returns = await fetchAll(`/entity/salesreturn?filter=${encodeURIComponent(`agent=${agentHref}`)}`)

  const bal = new Map()
  const add = (code, name, qty, price) => {
    if (!code) return
    const x = bal.get(code) || { code, name, qty: 0, price: price || 0 }
    x.qty += qty
    if (price) x.price = price
    bal.set(code, x)
  }

  for (const d of demands) for (const p of await pos(d.meta.href)) add(p.assortment?.code, p.assortment?.name, p.quantity, p.price)
  for (const r of reports) for (const p of await pos(r.meta.href)) add(p.assortment?.code, p.assortment?.name, -p.quantity, p.price)
  for (const r of returns) for (const p of await pos(r.meta.href)) add(p.assortment?.code, p.assortment?.name, -p.quantity, p.price)

  return [...bal.values()]
    .filter((x) => x.qty > 0.001)
    .sort((a, b) => a.code.localeCompare(b.code))
}

function buildHtml(lines, dateStr) {
  const logoUri = imageDataUri(LOGO_PATH)
  let subtotalNet = 0
  let vatSum = 0
  let totalInc = 0
  const rows = lines
    .map((l, i) => {
      const lineInc = (l.qty * l.price) / 100
      const net = lineInc / 1.05
      const vat = lineInc - net
      subtotalNet += net
      vatSum += vat
      totalInc += lineInc
      return `<tr>
      <td class="idx">${i + 1}</td>
      <td>${esc(l.name)}</td>
      <td class="num">${l.qty}</td>
      <td class="num">${fmtAed(l.price / 100)}</td>
      <td class="num">0,00</td>
      <td class="num">${fmtAed(net)}</td>
      <td class="num">${fmtAed(vat)}</td>
      <td class="num">${fmtAed(lineInc)}</td>
    </tr>`
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Goods on Consignment Report — ${esc(BUYER.name)}</title>
<style>
  @page { size: A4 portrait; margin: 10mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 9pt; color: #222; margin: 0; }
  .top { display: flex; justify-content: space-between; align-items: flex-start; font-size: 7.5pt; color: #444; }
  .top img { height: 13mm; }
  .top .co { text-align: right; line-height: 1.5; }
  h1 { text-align: center; font-size: 15pt; margin: 8mm 0 1mm; letter-spacing: 0.5px; }
  .sub { text-align: center; font-weight: 700; font-size: 10pt; }
  .date { text-align: center; font-size: 8.5pt; color: #666; margin-bottom: 6mm; }
  .buyer { font-size: 8.5pt; line-height: 1.6; margin-bottom: 5mm; }
  .buyer .lbl { display: inline-block; width: 22mm; color: #666; }
  table { width: 100%; border-collapse: collapse; font-size: 8pt; }
  th { background: #6b7280; color: #fff; border: 1px solid #6b7280; padding: 1.8mm 1.5mm; text-align: left; font-size: 7pt; font-weight: 600; }
  td { border: 1px solid #ddd; padding: 1.4mm 1.5mm; }
  th.num, td.num { text-align: right; white-space: nowrap; }
  td.idx, th.idx { text-align: center; width: 7mm; }
  tfoot td { border: none; padding-top: 1.5mm; }
  .tot-lbl { text-align: right; font-weight: 700; }
  .grand { font-size: 11pt; font-weight: 800; }
  .foot-note { margin-top: 6mm; font-size: 8pt; color: #555; line-height: 1.6; }
  .sign { margin-top: 12mm; display: flex; gap: 14mm; font-size: 8pt; color: #555; }
  .sign .box { flex: 1; }
  .sign .line { border-bottom: 1px solid #333; height: 14mm; }
</style>
</head>
<body>
<div class="top">
  ${logoUri ? `<img src="${logoUri}" alt="Genosys" />` : '<strong>GENOSYS Middle East FZ-LLC</strong>'}
  <div class="co">
    Genosys Middle East FZ-LLC<br/>
    TRN: 104229886700003 | Trade License: I14330AT<br/>
    Compass Coworking Centre, Genosys ME, Ras Al Khaimah, UAE<br/>
    sales@genosys.ae | +971 58 548 76 65 | https://www.genosys.ae<br/>
    Bank: WIO Bank P.J.S.C. | IBAN: AE110860000009833011607 | Acc No: 9833011607
  </div>
</div>

<h1>GOODS ON CONSIGNMENT REPORT</h1>
<div class="sub">Consignment report</div>
<div class="date">Dated ${esc(fmtHumanDate(dateStr))}</div>

<div class="buyer">
  <div><span class="lbl">Name:</span>${esc(BUYER.name)}</div>
  <div><span class="lbl">Phone:</span>${esc(BUYER.phone)}</div>
  <div><span class="lbl">Address:</span>${esc(BUYER.address)}</div>
  <div><span class="lbl">TRN #:</span>${esc(BUYER.trn)}</div>
  <div><span class="lbl">License #:</span>${esc(BUYER.license)}</div>
</div>

<table>
  <thead>
    <tr>
      <th class="idx">No</th>
      <th>Description</th>
      <th class="num">Qty</th>
      <th class="num">Unit Price</th>
      <th class="num">Discount %</th>
      <th class="num">Subtotal excl. VAT</th>
      <th class="num">VAT 5%</th>
      <th class="num">Total incl. VAT</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
  <tfoot>
    <tr><td colspan="5"></td><td class="tot-lbl" colspan="2">SUBTOTAL excl. VAT:</td><td class="num">${fmtAed(subtotalNet)}</td></tr>
    <tr><td colspan="5"></td><td class="tot-lbl" colspan="2">VAT 5%:</td><td class="num">${fmtAed(vatSum)}</td></tr>
    <tr><td colspan="5"></td><td class="tot-lbl grand" colspan="2">TOTAL AED:</td><td class="num grand">${fmtAed(totalInc)}</td></tr>
  </tfoot>
</table>

<div class="foot-note">
  Please kindly check goods upon receipt. Payment to be made either in cash or via bank transfer.<br/>
  This report reflects the true consignment balance held at ${esc(BUYER.name)} under Agreement 00060,
  reconciled to the physical stock count on ${esc(fmtHumanDate(dateStr))}.
</div>

<div class="sign">
  <div class="box"><div>Company Seal / Authorized Signatory:</div><div class="line"></div></div>
  <div class="box"><div>Received by (Consignee):</div><div class="line"></div></div>
</div>
</body>
</html>`
}

function htmlToPdf(htmlPath, pdfPath) {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (!fs.existsSync(chromePath)) {
    console.warn('  Chrome not found — PDF skipped; open HTML manually.')
    return false
  }
  execFileSync(
    chromePath,
    ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, `file://${htmlPath}`],
    { stdio: 'inherit' }
  )
  return fs.existsSync(pdfPath)
}

async function main() {
  console.log('  Serene Skin — CORRECT Goods on Consignment Report')
  const dateStr = uaeToday()
  const lines = await computeLedger()

  console.log('\n  On-hand (true ledger):')
  let total = 0
  let pcs = 0
  for (const l of lines) {
    const lineInc = (l.qty * l.price) / 100
    total += lineInc
    pcs += l.qty
    console.log(`    ${l.code} x${l.qty} @ ${(l.price / 100).toFixed(2)} = ${lineInc.toFixed(2)}  ${l.name}`)
  }
  console.log(`  SKUs ${lines.length} | pcs ${pcs} | total ${total.toFixed(2)} AED`)

  console.log('\n  Physical cross-check:')
  let ok = true
  for (const [code, target] of Object.entries(PHYSICAL)) {
    const found = lines.find((l) => l.code === code)
    const q = found ? found.qty : 0
    if (q !== target) ok = false
    console.log(`    ${code} ledger ${q} physical ${target} ${q === target ? 'OK' : 'MISMATCH'}`)
  }
  if (!ok) {
    console.error('\n  ✗ Ledger does not match physical — aborting PDF (fix data first).')
    process.exit(1)
  }

  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const html = buildHtml(lines, dateStr)
  const htmlPath = path.join(ORDERS_DIR, 'GENOSYS_Serene_Skin_Consignment_Report_00060.html')
  const pdfPath = path.join(ORDERS_DIR, 'GENOSYS_Serene_Skin_Consignment_Report_00060.pdf')
  fs.writeFileSync(htmlPath, html)
  const made = htmlToPdf(htmlPath, pdfPath)
  console.log(`\n  HTML: ${htmlPath}`)
  if (made) console.log(`  PDF:  ${pdfPath} (${fs.statSync(pdfPath).size} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
