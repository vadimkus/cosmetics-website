#!/usr/bin/env node

/**
 * GOCOSMO BEAUTY SALON — consignment return note (Contract 13).
 * Physical stock collected from salon premises (warehouse recovery visit).
 *
 * Generates landscape HTML + PDF on Desktop; optional MoySklad salesreturn (--commit).
 *
 *   node --import dotenv/config scripts/moysklad-create-gocosmo-consignment-return-note-20260621.js
 *   node --import dotenv/config scripts/moysklad-create-gocosmo-consignment-return-note-20260621.js --commit
 *   node --import dotenv/config scripts/moysklad-create-gocosmo-consignment-return-note-20260621.js --commit --no-print
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync, spawnSync } = require('child_process')

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
const NO_PRINT = process.argv.includes('--no-print')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = '465093a9-8ae0-11ef-0a80-0b5e00108550' // GOCOSMO BEAUTY SALON
const CONTRACT_ID = '4f49a970-8d22-11ef-0a80-157800079792' // Agreement 13
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'

const CUSTOMER_NAME = 'GOCOSMO BEAUTY SALON'
const OWNER_NAME = 'IULIIA MALSHONKOVA'
const OWNER_TRN = '104181479700003'
const PREMISES =
  '22 RT, B7, GM2, Golden Mile Galleria, Palm Jumeirah, Dubai, UAE'

const MARKER = `GOCOSMO-CONSIGNMENT-RETURN-COLLECTED-${uaeToday()}`

/** Photo inventory + 2 collagen + 12 sea algae (2026-06-21 collection) */
const LINES = [
  ['00129', 1],
  ['00021', 1],
  ['00035', 3],
  ['00190', 2],
  ['54458', 2],
  ['00031', 3],
  ['00189', 1],
  ['00029', 2],
  ['00195', 2],
  ['00191', 1],
  ['00027', 1],
  ['00055', 1],
  ['00053', 2],
  ['00041', 2],
  ['54457', 2],
  ['00145', 1],
  ['00143', 1],
  ['54464', 3],
  ['54467', 3],
  ['00063', 2],
  ['00140', 12],
]

const LOGO_PATH = path.join(__dirname, '..', 'public', 'images', 'genosys-logo-transparent.png')

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
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
  return (minor / 100).toFixed(2)
}

function fmtAed(n) {
  return new Intl.NumberFormat('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

function fmtHumanDate(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
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
  return LINES.map(([code, qty]) => {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown MoySklad code: ${code}`)
    if (!row.price) throw new Error(`No salePrice for ${code}`)
    return { ...row, qty, lineMinor: row.price * qty }
  })
}

async function ensureNoDuplicateReturn(agentId) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/salesreturn?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate salesreturn today: ${dup.name} (${dup.id})`)
}

function buildHtml({ lines, org, agent, contract, collectionDate }) {
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
<title>GOCOSMO Consignment Return Note — ${esc(collectionDate)}</title>
<style>
  @page { size: A4 landscape; margin: 10mm 12mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 9.5pt;
    color: #1a1a1a;
    line-height: 1.35;
    margin: 0;
  }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5mm; border-bottom: 2px solid #d62d2d; padding-bottom: 3mm; }
  .header img { height: 14mm; width: auto; }
  .header .doc-type { text-align: right; }
  .header .doc-type h1 { margin: 0; font-size: 15pt; color: #d62d2d; letter-spacing: 0.4px; }
  .header .doc-type .sub { font-size: 9pt; color: #666; margin-top: 1mm; }
  .meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4mm; margin-bottom: 5mm; }
  .meta .block .label { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.4px; color: #888; }
  .meta .block .value { font-size: 9.5pt; font-weight: 600; margin-top: 0.5mm; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-bottom: 5mm; }
  .party { border: 1px solid #ddd; border-radius: 2mm; padding: 3mm 4mm; background: #fafafa; }
  .party h3 { margin: 0 0 2mm 0; font-size: 8pt; text-transform: uppercase; color: #d62d2d; letter-spacing: 0.3px; }
  .party .name { font-weight: 700; font-size: 10pt; }
  .party .addr, .party .meta-line { font-size: 8.5pt; color: #444; margin-top: 1mm; }
  table.items { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
  table.items th { background: #f3f3f3; border: 1px solid #ccc; padding: 1.8mm 2mm; text-align: left; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.3px; }
  table.items td { border: 1px solid #ddd; padding: 1.5mm 2mm; vertical-align: top; }
  table.items .num { text-align: right; white-space: nowrap; }
  table.items .code { font-family: ui-monospace, monospace; font-size: 8pt; color: #555; width: 12mm; }
  table.items .idx { width: 7mm; text-align: center; color: #888; }
  .totals { margin-top: 4mm; margin-left: auto; width: 72mm; font-size: 9pt; }
  .totals .row { display: flex; justify-content: space-between; padding: 1mm 0; border-bottom: 1px solid #eee; }
  .totals .row.total { font-weight: 700; font-size: 10.5pt; border-top: 2px solid #1a1a1a; border-bottom: none; padding-top: 2mm; margin-top: 1mm; }
  .notice { margin-top: 5mm; padding: 3mm 4mm; background: #fff8f8; border-left: 3px solid #d62d2d; font-size: 8.5pt; line-height: 1.45; }
  .sign { margin-top: 7mm; display: flex; gap: 10mm; }
  .sign .box { flex: 1; }
  .sign .label { font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2mm; }
  .sign .line-area { border-bottom: 1px solid #1a1a1a; min-height: 16mm; }
  .sign .hint { font-size: 8pt; color: #999; margin-top: 1.5mm; font-style: italic; }
  .footer { margin-top: 5mm; font-size: 7.5pt; color: #888; border-top: 1px solid #e0e0e0; padding-top: 2mm; }
</style>
</head>
<body>

<div class="header">
  ${logoUri ? `<img src="${logoUri}" alt="Genosys Middle East FZ-LLC" />` : '<div><strong>GENOSYS Middle East FZ-LLC</strong></div>'}
  <div class="doc-type">
    <h1>Consignment Return Note</h1>
    <div class="sub">Agreement ${esc(contract.name)} · Physical stock collection</div>
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
    <div class="meta-line">Owner: ${esc(OWNER_NAME)} · TRN ${esc(OWNER_TRN)}</div>
    <div class="meta-line">Consignment Agreement No. ${esc(contract.name)}</div>
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
      <th class="num">Line (AED)</th>
    </tr>
  </thead>
  <tbody>
    ${lines
      .map(
        (line, i) => `<tr>
      <td class="idx">${i + 1}</td>
      <td class="code">${esc(line.code)}</td>
      <td>${esc(line.name)}</td>
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
  The undersigned confirm that the GENOSYS products listed above were <strong>physically collected</strong>
  from ${esc(CUSTOMER_NAME)} premises on ${esc(fmtHumanDate(collectionDate))} under Consignment Agreement
  <strong>No. ${esc(contract.name)}</strong>. Stock is returned to ${esc(org.name)} custody. Consignment
  balance for these units is reduced accordingly. Open commissioner report <strong>01253</strong> and any
  unpaid settlement under Contract 13 remain due separately.
</div>

<div class="sign">
  <div class="box">
    <div class="label">Consignee — returned stock</div>
    <div class="line-area"></div>
    <div class="hint">${esc(OWNER_NAME)} · Signature &amp; stamp · Date</div>
  </div>
  <div class="box">
    <div class="label">Consignor — received stock</div>
    <div class="line-area"></div>
    <div class="hint">Genosys representative · Signature · Date</div>
  </div>
</div>

<div class="footer">
  Generated ${esc(fmtHumanDate(collectionDate))} · ${esc(org.name)} · Contract ${esc(contract.name)} ·
  ${totalUnits} units · AED ${fmtAed(subtotalInc)} VAT inclusive (list/consignment value).
</div>

</body>
</html>`
}

function desktopPaths(baseName) {
  const desktop = path.join(os.homedir(), 'Desktop')
  const dir = fs.existsSync(desktop) ? desktop : os.tmpdir()
  return {
    html: path.join(dir, `${baseName}.html`),
    pdf: path.join(dir, `${baseName}.pdf`),
  }
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

function sendPdfToPrint(pdfPath) {
  if (process.platform !== 'darwin') return
  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status !== 0 || !whichLp.stdout.trim()) {
    execFileSync('open', [pdfPath], { stdio: 'inherit' })
    return
  }
  execFileSync('lp', ['-o', 'orientation-requested=4', pdfPath], { stdio: 'inherit' })
  console.log('  Sent to printer (landscape).')
}

async function main() {
  const collectionDate = uaeToday()
  console.log('====================================================================')
  console.log('  GOCOSMO — Consignment Return Note (physical collection)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT + documents' : 'DRY RUN (documents only preview)'}`)
  console.log(`  Date: ${collectionDate}`)
  console.log()

  const [org, agent, contract] = await Promise.all([
    api('GET', `/entity/organization/${ORG_ID}`),
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])

  console.log(`  Customer : ${agent.name}`)
  console.log(`  Contract : ${contract.name}`)
  console.log(`  Owner    : ${OWNER_NAME} (TRN ${OWNER_TRN})`)

  const stock = await fetchStockByCode()
  const lines = resolveLines(stock)

  let sumMinor = 0
  let units = 0
  console.log('\n  Lines:')
  for (const line of lines) {
    sumMinor += line.lineMinor
    units += line.qty
    console.log(
      `    ${line.code} ×${line.qty}  ${line.name.slice(0, 55)}  @ ${money(line.price)} → ${money(line.lineMinor)}`
    )
  }
  console.log(`\n  Total: ${money(sumMinor)} AED | ${units} pcs | ${lines.length} SKUs`)

  const html = buildHtml({ lines, org, agent, contract, collectionDate })
  const baseName = `GENOSYS_GOCOSMO_Consignment_Return_Note_${collectionDate.replace(/-/g, '')}`
  const paths = desktopPaths(baseName)
  fs.writeFileSync(paths.html, html)
  console.log(`\n  HTML: ${paths.html}`)

  const pdfOk = htmlToPdf(paths.html, paths.pdf)
  if (pdfOk) {
    console.log(`  PDF : ${paths.pdf} (${fs.statSync(paths.pdf).size} bytes)`)
    if (!NO_PRINT) sendPdfToPrint(paths.pdf)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — MoySklad salesreturn not posted. Re-run with --commit.')
    return
  }

  await ensureNoDuplicateReturn(agent.id)

  const salesReturn = await api('POST', '/entity/salesreturn', {
    applicable: true,
    moment: uaeMomentNow(),
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Physical consignment stock collected from GOCOSMO premises (Contract 13 recovery).',
      `${units} pcs across ${lines.length} SKUs — photo inventory + 2 collagen + 12 sea algae.`,
      'Open report 01253 settlement remains separate.',
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
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
