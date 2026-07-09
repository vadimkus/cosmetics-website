#!/usr/bin/env node

/**
 * Generate a zero-balance / no-outstanding-debt certificate PDF for a MoySklad counterparty.
 *
 *   node --import dotenv/config scripts/generate-customer-no-debt-certificate.js \
 *     --agent 12b051b0-4e21-11ee-0a80-063e000814cc \
 *     --header "/Users/vadimkus/Desktop/Drive/Genosys/Print_forms/2026/ART/header.png" \
 *     --stamp  "$HOME/Desktop/orders/Stamp.png" \
 *     --out    "$HOME/Desktop/orders/GENOSYS_FaceRoom_Marina_Zero_Balance_20260709.pdf" \
 *     --doc-no GME-NOD-2026-FR-001 \
 *     --reason "Branch closure — customer requested confirmation of zero balance."
 */

const path = require('path')
const fs = require('fs')
const os = require('os')
const { execFileSync } = require('child_process')

require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), override: false })

const { uaeToday } = require('./lib/moysklad-uae-date')

function parseArgs(argv) {
  const out = {}
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        out[key] = next
        i++
      } else {
        out[key] = true
      }
    }
  }
  return out
}

const args = parseArgs(process.argv)
const agentId = args.agent
const headerPath = args.header
const stampPath = args.stamp
const outPath =
  args.out ||
  path.join(os.homedir(), 'Desktop', 'orders', `GENOSYS_Zero_Balance_${uaeToday()}.pdf`)
const docNo = args['doc-no'] || `GME-NOD-${uaeToday().replace(/-/g, '')}`
const reason = args.reason || ''
const branchLabel = args.branch || ''
const addressOverride = args.address || ''

if (!agentId) {
  console.error('ERROR: --agent <counterparty-id> is required')
  process.exit(1)
}
if (!headerPath || !fs.existsSync(headerPath)) {
  console.error('ERROR: --header <image-path> is required and must exist')
  process.exit(1)
}
if (stampPath && !fs.existsSync(stampPath)) {
  console.error('ERROR: --stamp path does not exist:', stampPath)
  process.exit(1)
}

const API = 'https://api.moysklad.ru/api/remap/1.2'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const login = process.env.MOYSKLAD_LOGIN?.trim()
const password = process.env.MOYSKLAD_PASSWORD?.trim()
if (!login || !password) {
  console.error('ERROR: MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD not set')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')

function imageDataUri(filePath) {
  if (!filePath) return null
  const ext = path.extname(filePath).slice(1).toLowerCase()
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
  const b64 = fs.readFileSync(filePath).toString('base64')
  return `data:${mime};base64,${b64}`
}

async function msGet(pathStr) {
  const url = pathStr.startsWith('http') ? pathStr : `${API}${pathStr}`
  const res = await fetch(url, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(entity, agentHref) {
  const filter = encodeURIComponent(`agent=${agentHref}`)
  const rows = []
  let offset = 0
  while (true) {
    const data = await msGet(`/entity/${entity}?filter=${filter}&limit=1000&offset=${offset}`)
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

function fmtHumanDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtHumanDateRu(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function main() {
  const agent = await msGet(`/entity/counterparty/${agentId}`)
  const org = await msGet(`/entity/organization/${ORG_ID}`)
  const agentHref = `${API}/entity/counterparty/${agentId}`

  const invoices = await fetchAll('invoiceout', agentHref)
  const unpaidInvoices = invoices.filter((d) => (d.sum || 0) > (d.payedSum || 0) + 1)
  const openOrders = (await fetchAll('customerorder', agentHref)).filter(
    (d) => (d.sum || 0) > (d.payedSum || 0) + 1
  )

  console.log(`Customer: ${agent.name}`)
  console.log(`Invoices: ${invoices.length} total, ${unpaidInvoices.length} unpaid`)
  console.log(`Open unpaid orders: ${openOrders.length}`)

  if (unpaidInvoices.length) {
    console.error('ERROR: unpaid invoices exist — cannot issue zero-balance certificate')
    for (const u of unpaidInvoices.slice(0, 10)) {
      console.error(`  ${u.name} ${u.moment?.slice(0, 10)} ${(u.sum / 100).toFixed(2)} AED`)
    }
    process.exit(1)
  }

  const issueDate = uaeToday()
  const trn = agent.legalAddressFull?.comment || agent.actualAddressFull?.comment || ''
  const licenseNo = agent.email || agent.fax || ''
  const customerAddress =
    addressOverride ||
    agent.actualAddress ||
    agent.actualAddressFull?.addInfo ||
    agent.legalAddress ||
    ''
  const customerLabel = branchLabel ? `${agent.name} — ${branchLabel}` : agent.name

  const headerDataUri = imageDataUri(headerPath)
  const stampDataUri = imageDataUri(stampPath)

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Certificate of Zero Balance — ${esc(agent.name)}</title>
<style>
  @page { size: A4; margin: 14mm 14mm 18mm 14mm; }
  * { box-sizing: border-box; }
  html, body {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    color: #1a1a1a; font-size: 10.5pt; line-height: 1.55; margin: 0; padding: 0;
  }
  .header { margin-bottom: 8mm; }
  .header img { width: 100%; display: block; }
  h1 {
    font-size: 14pt; font-weight: 700; margin: 0 0 2mm 0; text-transform: uppercase;
    letter-spacing: 0.4px; color: #d62d2d; text-align: center;
  }
  h2 {
    font-size: 11pt; font-weight: 600; margin: 5mm 0 2mm 0; color: #333;
    text-transform: uppercase; letter-spacing: 0.25px;
  }
  .subtitle { text-align: center; color: #666; font-size: 9.5pt; margin-bottom: 6mm; }
  .meta {
    border: 1px solid #e0e0e0; border-radius: 3px; padding: 3.5mm 4.5mm;
    background: #fafafa; margin-bottom: 6mm; font-size: 9.5pt;
    display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 6mm;
  }
  .meta .label { color: #666; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.3px; }
  .meta .value { font-weight: 600; }
  .parties { display: flex; gap: 6mm; margin-bottom: 6mm; }
  .party { flex: 1; border: 1px solid #e0e0e0; border-radius: 3px; padding: 3.5mm 4.5mm; }
  .party h3 {
    margin: 0 0 1.5mm 0; font-size: 8.5pt; color: #666; text-transform: uppercase;
    letter-spacing: 0.3px; font-weight: 600;
  }
  .party .name { font-weight: 700; font-size: 10.5pt; margin-bottom: 1mm; }
  .party .detail { font-size: 9pt; color: #333; margin-top: 0.5mm; }
  .body-text { margin-bottom: 4mm; text-align: justify; }
  .body-text p { margin: 0 0 3mm 0; }
  .highlight {
    border-left: 3px solid #d62d2d; background: #fef7f7; padding: 3.5mm 4.5mm;
    margin: 4mm 0 6mm 0; font-weight: 600;
  }
  .ru-block {
    margin-top: 7mm; padding-top: 5mm; border-top: 1px solid #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  }
  .ru-block h1 { font-size: 12.5pt; letter-spacing: 0; }
  .sign { margin-top: 8mm; display: flex; gap: 10mm; align-items: flex-end; }
  .sign .box { flex: 1; }
  .sign .label {
    font-size: 8.5pt; color: #666; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2mm;
  }
  .sign .line-area {
    min-height: 28mm; display: flex; align-items: center; justify-content: flex-start;
    padding: 1mm 0;
  }
  .sign .stamp { width: 58mm; height: auto; display: block; }
  .sign .sig-text { font-size: 9.5pt; margin-top: 1.5mm; }
  .footer-note {
    margin-top: 8mm; padding-top: 3mm; border-top: 1px solid #e0e0e0;
    font-size: 8.5pt; color: #666; line-height: 1.5;
  }
</style>
</head>
<body>

<div class="header"><img src="${headerDataUri}" alt="Genosys Middle East FZ-LLC" /></div>

<h1>Certificate of Zero Balance</h1>
<div class="subtitle">Confirmation of No Outstanding Financial Obligations</div>

<div class="meta">
  <div>
    <div class="label">Document No.</div>
    <div class="value">${esc(docNo)}</div>
  </div>
  <div>
    <div class="label">Issue Date</div>
    <div class="value">${esc(fmtHumanDate(issueDate))}</div>
  </div>
</div>

<div class="parties">
  <div class="party">
    <h3>Issued By</h3>
    <div class="name">${esc(org.legalTitle || org.name)}</div>
    <div class="detail">${esc(org.actualAddress || 'Cordoba Residence, Villa E02, Dubai, UAE')}</div>
    <div class="detail">TRN: 104229886700003 · License: 5023192</div>
    <div class="detail">${esc(org.email || 'sales@genosys.ae')} · ${esc(org.phone || '+971585487665')}</div>
  </div>
  <div class="party">
    <h3>Customer</h3>
    <div class="name">${esc(agent.name)}</div>
    ${branchLabel ? `<div class="detail"><strong>Branch:</strong> ${esc(branchLabel)}</div>` : ''}
    <div class="detail">${esc(customerAddress)}</div>
    ${licenseNo ? `<div class="detail">License No.: ${esc(licenseNo)}</div>` : ''}
    ${trn ? `<div class="detail">TRN: ${esc(trn)}</div>` : ''}
    ${agent.phone ? `<div class="detail">Phone: ${esc(agent.phone)}</div>` : ''}
  </div>
</div>

<div class="body-text">
  <p>
    This is to certify that, as of <strong>${esc(fmtHumanDate(issueDate))}</strong>, the above-named customer
    account with <strong>${esc(org.legalTitle || org.name)}</strong> has been reviewed and confirmed to have
    <strong>no outstanding balance, unpaid invoices, overdue payments, or any other financial obligations</strong>
    payable to the Supplier in connection with the supply of GENOSYS professional products and related services
    ${branchLabel ? ` at the <strong>${esc(branchLabel)}</strong> location` : ''}.
  </p>
  <p>
    All tax invoices issued to this customer have been settled in full. There are no open receivables,
    pending charges, or unsettled amounts due to the Supplier as of the date of this certificate.
  </p>
  ${reason ? `<p><em>Context:</em> ${esc(reason)}</p>` : ''}
</div>

<div class="highlight">
  Balance due to Genosys Middle East FZ-LLC from ${esc(customerLabel)}: <strong>AED 0.00 (Zero)</strong>
</div>

<div class="ru-block">
  <h1>Справка об отсутствии задолженности</h1>
  <div class="body-text">
    <p>
      Настоящим подтверждаем, что по состоянию на <strong>${esc(fmtHumanDateRu(issueDate))}</strong>
      у клиента <strong>${esc(customerLabel)}</strong> отсутствует задолженность перед
      <strong>${esc(org.legalTitle || org.name)}</strong>, включая неоплаченные счета, просроченные платежи
      и иные финансовые обязательства, связанные с поставками профессиональной продукции GENOSYS
      ${branchLabel ? ` (филиал: ${esc(branchLabel)})` : ''}.
    </p>
    <p>
      Все выставленные счета оплачены в полном объёме. Задолженность клиента перед поставщиком составляет
      <strong>0,00 AED (ноль)</strong>.
    </p>
  </div>
</div>

<div class="sign">
  <div class="box">
    <div class="label">Authorized Signatory</div>
    <div class="line-area">
      ${stampDataUri ? `<img class="stamp" src="${stampDataUri}" alt="Company seal" />` : ''}
    </div>
    <div class="sig-text">
      <strong>Vadim Sagatdinov</strong><br />
      Director · ${esc(org.legalTitle || org.name)}<br />
      ${esc(fmtHumanDate(issueDate))}
    </div>
  </div>
</div>

<div class="footer-note">
  Document ${esc(docNo)} · Issued ${esc(fmtHumanDate(issueDate))} · For official use only.
  This certificate reflects the Supplier's accounting records as of the issue date.
  Generated for ${esc(customerLabel)} (${invoices.length} invoices reviewed, 0 outstanding).
</div>

</body>
</html>`

  const tmpDir = path.join(__dirname, '..', 'tmp')
  fs.mkdirSync(tmpDir, { recursive: true })
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  const safeName = path.basename(outPath, '.pdf').replace(/[^\w.-]+/g, '_')
  const htmlPath = path.join(tmpDir, `${safeName}.html`)
  fs.writeFileSync(htmlPath, html)
  console.log(`HTML: ${htmlPath}`)

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (!fs.existsSync(chromePath)) {
    console.error('ERROR: Google Chrome not found at', chromePath)
    process.exit(1)
  }

  execFileSync(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      `--print-to-pdf=${outPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: 'inherit' }
  )

  if (!fs.existsSync(outPath)) {
    console.error('ERROR: PDF was not created')
    process.exit(1)
  }
  console.log(`\nPDF: ${outPath} (${fs.statSync(outPath).size} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
