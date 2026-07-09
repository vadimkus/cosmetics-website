#!/usr/bin/env node

/**
 * Rise UP — consignment return to warehouse (Agreement 34).
 * Physical stock collected from clinic (photo inventory 2026-07-02).
 *
 *   node --import dotenv/config scripts/moysklad-create-rise-up-consignment-return-20260702.js
 *   node --import dotenv/config scripts/moysklad-create-rise-up-consignment-return-20260702.js --commit
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

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'b83e0d80-5d8f-11f1-0a80-065d0075240c' // Rise UP
const CONTRACT_ID = 'c91330fa-5d90-11f1-0a80-1af00073b7c8' // Agreement 34
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'

const CONTACT_NAME = 'Irina Kovalenko'
const CONTACT_PHONE = '+971501025360'
const CONTACT_EMAIL = 'Irina_01-01@mail.ru'
const PREMISES = 'Office 906, The Metropolis Tower, Business Bay, Dubai, UAE'

const MARKER = `Rise UP consignment return collected ${uaeToday()}`

/** [code, qty, label] — photo inventory 2026-07-02 */
const LINES = [
  ['54464', 4, 'Skin Caring Blemish Balm Cushion #3 Camel'],
  ['54473', 1, 'Revita Glow BB Cream #02 Natural 50g'],
  ['54472', 1, 'Revita Glow BB Cream #01 Bright 50g'],
  ['00035', 1, 'Intensive Problem Control Cream 50g'],
  ['00031', 1, 'Intensive Hydro Soothing Cream 50g'],
  ['54461', 2, 'Skin Defender Lip & Eye Makeup Remover 200ml'],
]

const LOGO_PATH = path.join(__dirname, '..', 'public', 'images', 'genosys-logo-transparent.png')
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function fmtAed(n) {
  return new Intl.NumberFormat('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

function fmtHumanDate(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function imageDataUri(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null
  const ext = path.extname(filePath).slice(1).toLowerCase()
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function resolveLines(stock) {
  return LINES.map(([code, qty, label]) => {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code} (${label})`)
    if (!row.price) throw new Error(`No salePrice for ${code}`)
    return { ...row, qty, label, lineMinor: row.price * qty }
  })
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/salesreturn?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate salesreturn: ${dup.name} (${dup.id})`)
}

function buildHtml({ lines, org, agent, contract, collectionDate, returnDocName }) {
  const logoUri = imageDataUri(LOGO_PATH)
  const totalMinor = lines.reduce((s, l) => s + l.lineMinor, 0)
  const totalUnits = lines.reduce((s, l) => s + l.qty, 0)
  const subtotalInc = totalMinor / 100
  const subtotalNet = subtotalInc / 1.05
  const vatSum = subtotalInc - subtotalNet

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Rise UP Consignment Return — ${esc(collectionDate)}</title>
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
  .footer { margin-top: 5mm; font-size: 7.5pt; color: #888; border-top: 1px solid #e0e0e0; padding-top: 2mm; }
</style>
</head>
<body>
<div class="header">
  ${logoUri ? `<img src="${logoUri}" alt="Genosys Middle East FZ-LLC" />` : '<div><strong>GENOSYS Middle East FZ-LLC</strong></div>'}
  <div class="doc-type">
    <h1>Consignment Return Note</h1>
    <div class="sub">Agreement ${esc(contract.name)}${returnDocName ? ` · Return ${esc(returnDocName)}` : ''}</div>
  </div>
</div>
<div class="meta">
  <div class="block"><div class="label">Collection date</div><div class="value">${esc(fmtHumanDate(collectionDate))}</div></div>
  <div class="block"><div class="label">Reference</div><div class="value">${esc(MARKER)}</div></div>
  <div class="block"><div class="label">Total units</div><div class="value">${totalUnits} pcs · ${lines.length} SKUs</div></div>
</div>
<div class="parties">
  <div class="party">
    <h3>Consignor (received stock)</h3>
    <div class="name">${esc(org.name)}</div>
    <div class="addr">Compass Coworking Centre, Al Shohada Road, Al Jazeera, Al Hamra, Ras Al Khaimah, UAE</div>
    <div class="meta-line">TRN 104229886700003 · sales@genosys.ae</div>
  </div>
  <div class="party">
    <h3>Consignee (returned stock)</h3>
    <div class="name">${esc(agent.name)}</div>
    <div class="addr">${esc(PREMISES)}</div>
    <div class="meta-line">${esc(CONTACT_NAME)} · ${esc(CONTACT_PHONE)} · ${esc(CONTACT_EMAIL)}</div>
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
      <td>${esc(line.label || line.name)}</td>
      <td class="num">${line.qty}</td>
      <td class="num">${fmtAed(line.price / 100)}</td>
      <td class="num">${fmtAed(line.lineMinor / 100)}</td>
    </tr>`
      )
      .join('')}
  </tbody>
</table>
<div class="totals">
  <div class="row"><div>Subtotal (excl. VAT)</div><div>AED ${fmtAed(subtotalNet)}</div></div>
  <div class="row"><div>VAT (5%)</div><div>AED ${fmtAed(vatSum)}</div></div>
  <div class="row total"><div>Total (incl. VAT)</div><div>AED ${fmtAed(subtotalInc)}</div></div>
</div>
<div class="notice">
  The products listed above were physically collected from <strong>${esc(agent.name)}</strong> on
  ${esc(fmtHumanDate(collectionDate))} under Consignment Agreement <strong>No. ${esc(contract.name)}</strong>.
  Stock is returned to ${esc(org.name)} warehouse. Consignment balance is reduced accordingly.
  Open commissioner report <strong>01394</strong> (5,004 AED sold) remains due separately.
</div>
<div class="footer">
  ${esc(fmtHumanDate(collectionDate))} · ${esc(org.name)} · Contract ${esc(contract.name)} ·
  ${totalUnits} units · AED ${fmtAed(subtotalInc)} VAT inclusive (consignment list value).
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
  return fs.existsSync(pdfPath)
}

function writeDocuments({ lines, org, agent, contract, returnDocName }) {
  const collectionDate = uaeToday()
  const html = buildHtml({ lines, org, agent, contract, collectionDate, returnDocName })
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const base = `GENOSYS_Rise_UP_Consignment_Return_${returnDocName || collectionDate.replace(/-/g, '')}`
  const htmlPath = path.join(ORDERS_DIR, `${base}.html`)
  const pdfPath = path.join(ORDERS_DIR, `${base}.pdf`)
  fs.writeFileSync(htmlPath, html)
  const pdfOk = htmlToPdf(htmlPath, pdfPath)
  return { htmlPath, pdfPath, pdfOk }
}

async function main() {
  console.log('====================================================================')
  console.log('  Rise UP — consignment return to warehouse (Agreement 34)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [org, agent, contract] = await Promise.all([
    api('GET', `/entity/organization/${ORG_ID}`),
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])

  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const stock = await fetchStockByCode()
  const lines = resolveLines(stock)

  let sumMinor = 0
  let units = 0
  console.log('\n  Return lines:')
  for (const line of lines) {
    sumMinor += line.lineMinor
    units += line.qty
    console.log(
      `    ${line.code} ×${line.qty}  ${(line.label || line.name).slice(0, 52)}  @ ${money(line.price)} → ${money(line.lineMinor)}`
    )
  }
  console.log(`\n  Total: ${money(sumMinor)} AED | ${units} pcs | ${lines.length} SKUs`)

  if (!COMMIT) {
    const preview = writeDocuments({ lines, org, agent, contract, returnDocName: 'DRYRUN' })
    console.log(`\n  Preview HTML: ${preview.htmlPath}`)
    if (preview.pdfOk) console.log(`  Preview PDF : ${preview.pdfPath}`)
    console.log('\n  DRY RUN — MoySklad salesreturn not posted. Re-run with --commit.')
    return
  }

  await ensureNoDuplicate()

  const salesReturn = await api('POST', '/entity/salesreturn', {
    applicable: true,
    moment: uaeMomentNow(),
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Physical consignment stock returned from Rise UP (Agreement 34).',
      `${units} pcs / ${lines.length} SKUs — photo inventory 2026-07-02.`,
      'Report 01394 settlement remains separate.',
    ].join('\n'),
    positions: lines.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  console.log(`\n  Posted salesreturn: ${salesReturn.name} | ${money(salesReturn.sum)} AED`)
  console.log(`  UI: https://online.moysklad.ru/app/#salesreturn/edit?id=${salesReturn.id}`)

  const docs = writeDocuments({ lines, org, agent, contract, returnDocName: salesReturn.name })
  console.log(`  HTML: ${docs.htmlPath}`)
  if (docs.pdfOk) {
    console.log(`  PDF : ${docs.pdfPath} (${fs.statSync(docs.pdfPath).size} bytes)`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
