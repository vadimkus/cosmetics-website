#!/usr/bin/env node

/**
 * Re-export Bianco Dubai Hills salesreturn 00308 as the modern
 * Consignment Return Note (landscape HTML → PDF). Not Invoice_Return_Genosys.
 *
 *   node --import dotenv/config scripts/moysklad-reexport-bianco-hills-return-00308-20260820.js
 *   node --import dotenv/config scripts/moysklad-reexport-bianco-hills-return-00308-20260820.js --print
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

const { uaeToday, uaeTodayDmy } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const DO_PRINT = process.argv.includes('--print')

const RETURN_ID = '7bc54710-9c9b-11f1-0a80-0cc2002c753c'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const LOGO_PATH = path.join(__dirname, '..', 'public', 'images', 'genosys-logo-transparent.png')

async function api(method, pathStr) {
  const res = await fetch(API + pathStr, {
    method,
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8' },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function money(n) {
  return Number(n).toFixed(2)
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function logoUri() {
  if (!fs.existsSync(LOGO_PATH)) return ''
  return `data:image/png;base64,${fs.readFileSync(LOGO_PATH).toString('base64')}`
}

function agentAddress(agent) {
  const full = agent.actualAddressFull || {}
  const parts = [full.street, full.addInfo, full.city].filter(Boolean)
  const line = [...new Set(parts.map((p) => String(p).trim()).filter(Boolean))].join(', ')
  return line || agent.actualAddress || 'Dubai Hills Mall, 1st Floor, Dubai, UAE'
}

function buildHtml({ doc, agent, contract, org, lines }) {
  const totalUnits = lines.reduce((s, l) => s + l.qty, 0)
  const subtotalInc = lines.reduce((s, l) => s + l.line, 0)
  const subtotalNet = subtotalInc / 1.05
  const vatSum = subtotalInc - subtotalNet
  const date = uaeTodayDmy()
  const img = logoUri()

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Bianco Dubai Hills Consignment Return ${esc(doc.name)}</title>
<style>
  @page { size: A4 landscape; margin: 10mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 9.5pt; color: #1a1a1a; line-height: 1.35; margin: 0; }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5mm; border-bottom: 2px solid #d62d2d; padding-bottom: 3mm; }
  .header img { height: 14mm; width: auto; }
  .header .doc-type { text-align: right; }
  .header .doc-type h1 { margin: 0; font-size: 15pt; color: #d62d2d; }
  .header .doc-type .sub { font-size: 9pt; color: #666; margin-top: 1mm; }
  .meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4mm; margin-bottom: 5mm; }
  .meta .block .label { font-size: 7.5pt; text-transform: uppercase; color: #888; }
  .meta .block .value { font-size: 9.5pt; font-weight: 600; margin-top: 0.5mm; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-bottom: 5mm; }
  .party { border: 1px solid #ddd; border-radius: 2mm; padding: 3mm 4mm; background: #fafafa; }
  .party h3 { margin: 0 0 2mm 0; font-size: 8pt; text-transform: uppercase; color: #d62d2d; }
  .party .name { font-weight: 700; font-size: 10pt; }
  .party .addr, .party .meta-line { font-size: 8.5pt; color: #444; margin-top: 1mm; }
  table.items { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
  table.items th { background: #f3f3f3; border: 1px solid #ccc; padding: 1.8mm 2mm; text-align: left; font-size: 7.5pt; text-transform: uppercase; }
  table.items td { border: 1px solid #ddd; padding: 1.5mm 2mm; vertical-align: top; }
  table.items .num { text-align: right; white-space: nowrap; }
  table.items .code { font-family: ui-monospace, monospace; font-size: 8pt; color: #555; width: 12mm; }
  table.items .idx { width: 7mm; text-align: center; color: #888; }
  .totals { margin-top: 4mm; margin-left: auto; width: 72mm; font-size: 9pt; }
  .totals .row { display: flex; justify-content: space-between; padding: 1mm 0; border-bottom: 1px solid #eee; }
  .totals .row.total { font-weight: 700; font-size: 10.5pt; border-top: 2px solid #1a1a1a; border-bottom: none; padding-top: 2mm; margin-top: 1mm; }
  .notice { margin-top: 5mm; padding: 3mm 4mm; background: #fff8f8; border-left: 3px solid #d62d2d; font-size: 8.5pt; line-height: 1.45; }
  .sign { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 8mm; }
  .sign .box { border-top: 1px solid #bbb; padding-top: 2mm; font-size: 8pt; color: #555; min-height: 16mm; }
  .footer { margin-top: 5mm; font-size: 7.5pt; color: #888; border-top: 1px solid #e0e0e0; padding-top: 2mm; }
</style>
</head>
<body>
<div class="header">
  ${img ? `<img src="${img}" alt="Genosys Middle East FZ-LLC" />` : '<div><strong>GENOSYS Middle East FZ-LLC</strong></div>'}
  <div class="doc-type">
    <h1>Consignment Return Note</h1>
    <div class="sub">Agreement ${esc(contract.name)} · Return ${esc(doc.name)}</div>
  </div>
</div>
<div class="meta">
  <div class="block"><div class="label">Collection date</div><div class="value">${esc(date)}</div></div>
  <div class="block"><div class="label">Document</div><div class="value">${esc(doc.name)}</div></div>
  <div class="block"><div class="label">Total units</div><div class="value">${totalUnits} pcs · ${lines.length} SKUs</div></div>
</div>
<div class="parties">
  <div class="party">
    <h3>Consignor (received stock)</h3>
    <div class="name">${esc(org.name)}</div>
    <div class="addr">Compass Coworking Centre, Al Shohada Road, Al Jazeera, Al Hamra, Ras Al Khaimah, UAE</div>
    <div class="meta-line">TRN 104229886700003 · Trade License 5023192 · sales@genosys.ae</div>
  </div>
  <div class="party">
    <h3>Consignee (returned stock)</h3>
    <div class="name">${esc(agent.name)}</div>
    <div class="addr">${esc(agentAddress(agent))}</div>
    <div class="meta-line">${esc(agent.phone || '')}${agent.inn ? ` · TRN ${esc(agent.inn)}` : ''}</div>
    <div class="meta-line">Consignment Agreement No. ${esc(contract.name)}</div>
  </div>
</div>
<table class="items">
  <thead><tr><th class="idx">#</th><th class="code">Code</th><th>Product</th><th class="num">Qty</th><th class="num">Unit (AED)</th><th class="num">Line (AED)</th></tr></thead>
  <tbody>
    ${lines
      .map(
        (line, i) => `<tr>
      <td class="idx">${i + 1}</td>
      <td class="code">${esc(line.code)}</td>
      <td>${esc(line.name)}</td>
      <td class="num">${line.qty}</td>
      <td class="num">${money(line.unit)}</td>
      <td class="num">${money(line.line)}</td>
    </tr>`,
      )
      .join('')}
  </tbody>
</table>
<div class="totals">
  <div class="row"><div>Subtotal (excl. VAT)</div><div>AED ${money(subtotalNet)}</div></div>
  <div class="row"><div>VAT (5%)</div><div>AED ${money(vatSum)}</div></div>
  <div class="row total"><div>Total (incl. VAT)</div><div>AED ${money(subtotalInc)}</div></div>
</div>
<div class="notice">
  The products listed above were physically collected from <strong>${esc(agent.name)}</strong>
  on ${esc(date)} under Consignment Agreement <strong>No. ${esc(contract.name)}</strong>.
  Stock is returned to ${esc(org.name)} warehouse. Consignment balance is reduced accordingly.
  All units on this note were expired and written off (loss 00008-00500).
</div>
<div class="sign">
  <div class="box">Consignee — returned stock<br/>Signature &amp; stamp · Date</div>
  <div class="box">Consignor — received stock<br/>Genosys representative · Signature · Date</div>
</div>
<div class="footer">
  ${esc(date)} · ${esc(org.name)} · Contract ${esc(contract.name)} · Return ${esc(doc.name)} ·
  ${totalUnits} units · AED ${money(subtotalInc)} VAT inclusive (clinic list).
</div>
</body>
</html>`
}

function htmlToPdf(htmlPath, pdfPath) {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (!fs.existsSync(chromePath)) throw new Error('Chrome not found')
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
    { stdio: 'inherit' },
  )
}

function printPdfLandscape(pdfPath) {
  try {
    execFileSync('lp', ['-o', 'orientation-requested=4', pdfPath], { stdio: 'inherit' })
    console.log('  Printed landscape (orientation-requested=4)')
  } catch (e) {
    execFileSync('open', [pdfPath], { stdio: 'inherit' })
    console.log('  lp failed — opened PDF for manual print')
  }
}

async function main() {
  const [doc, org] = await Promise.all([
    api('GET', `/entity/salesreturn/${RETURN_ID}?expand=agent,contract,organization`),
    api('GET', '/entity/organization/e18525a4-33c5-11ea-0a80-043f000b2738'),
  ])
  const agent = doc.agent
  const contract = doc.contract
  const pos = await fetchAll(`/entity/salesreturn/${RETURN_ID}/positions?expand=assortment`)
  const lines = pos.map((p) => ({
    code: p.assortment?.code || '',
    name: p.assortment?.name || '',
    qty: Number(p.quantity),
    unit: (p.price || 0) / 100,
    line: ((p.price || 0) * Number(p.quantity) * (100 - (p.discount || 0))) / 10000,
  }))

  console.log(`  ${doc.name} | ${agent.name} | agr ${contract.name}`)
  for (const l of lines) console.log(`    ${l.code} x${l.qty} @ ${money(l.unit)} = ${money(l.line)}`)

  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const htmlPath = path.join(ORDERS_DIR, 'GENOSYS_Bianco_Dubai_Hills_Return_00308.html')
  const pdfPath = path.join(ORDERS_DIR, 'GENOSYS_Bianco_Dubai_Hills_Return_00308.pdf')
  fs.writeFileSync(htmlPath, buildHtml({ doc, agent, contract, org, lines }))
  htmlToPdf(htmlPath, pdfPath)
  console.log(`  PDF: ${pdfPath} (${fs.statSync(pdfPath).size} bytes)`)

  if (DO_PRINT) printPdfLandscape(pdfPath)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
