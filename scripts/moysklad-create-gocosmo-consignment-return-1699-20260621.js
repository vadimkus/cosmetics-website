#!/usr/bin/env node

/**
 * GOCOSMO — additional consignment return 1,699 AED (Contract 13).
 * Goodwill alignment vs 14,011 email wording; no further dispute.
 *
 * Lines (book stock, exact 1,699): Ivory cushion x4, overnight mask x3, PCT x3.
 *
 *   node --import dotenv/config scripts/moysklad-create-gocosmo-consignment-return-1699-20260621.js
 *   node --import dotenv/config scripts/moysklad-create-gocosmo-consignment-return-1699-20260621.js --commit
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
const AGENT_ID = '465093a9-8ae0-11ef-0a80-0b5e00108550'
const CONTRACT_ID = '4f49a970-8d22-11ef-0a80-157800079792'
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'

const TARGET_SUM_MINOR = 169900
const MARKER = `GOCOSMO-CONSIGNMENT-RETURN-1699-${uaeToday()}`

/** 600 + 510 + 390 + 54 + 145 = 1,699 AED */
const LINES = [
  ['00143', 4], // Cushion Ivory 150 ×4 = 600
  ['00189', 3], // Overnight mask 170 ×3 = 510
  ['00145', 3], // Problem Control Toner 130 ×3 = 390
  ['00063', 3], // Collagen mask 18 ×3 = 54
  ['54458', 1], // Hyaluron cream 145 ×1 = 145
]

const LOGO_PATH = path.join(__dirname, '..', 'public', 'images', 'genosys-logo-transparent.png')
const OWNER_NAME = 'IULIIA MALSHONKOVA'
const OWNER_TRN = '104181479700003'
const PREMISES = '22 RT, B7, GM2, Golden Mile Galleria, Palm Jumeirah, Dubai, UAE'

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
  return (minor / 100).toFixed(2)
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
  return LINES.map(([code, qty]) => {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
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
  if (dup) throw new Error(`Duplicate return today: ${dup.name}`)
}

function buildHtml({ lines, org, agent, contract, collectionDate, returnDocName }) {
  const logoUri = imageDataUri(LOGO_PATH)
  const totalMinor = lines.reduce((s, l) => s + l.lineMinor, 0)
  const totalUnits = lines.reduce((s, l) => s + l.qty, 0)
  const subtotalInc = totalMinor / 100
  const subtotalNet = subtotalInc / 1.05
  const vatSum = subtotalInc - subtotalNet

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<title>GOCOSMO Return Note ${esc(returnDocName || 'supplement')}</title>
<style>
  @page { size: A4 landscape; margin: 10mm 12mm; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 9.5pt; color: #1a1a1a; margin: 0; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d62d2d; padding-bottom: 3mm; margin-bottom: 5mm; }
  .header img { height: 14mm; }
  .header h1 { margin: 0; font-size: 15pt; color: #d62d2d; text-align: right; }
  .sub { font-size: 9pt; color: #666; }
  table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
  th, td { border: 1px solid #ddd; padding: 1.5mm 2mm; }
  th { background: #f3f3f3; font-size: 7.5pt; text-transform: uppercase; }
  .num { text-align: right; }
  .notice { margin-top: 5mm; padding: 3mm 4mm; background: #fff8f8; border-left: 3px solid #d62d2d; font-size: 8.5pt; }
  .totals { margin-top: 4mm; margin-left: auto; width: 72mm; }
  .totals .row { display: flex; justify-content: space-between; padding: 1mm 0; }
  .totals .total { font-weight: 700; border-top: 2px solid #1a1a1a; margin-top: 1mm; padding-top: 2mm; }
</style></head><body>
<div class="header">
  ${logoUri ? `<img src="${logoUri}" alt="Genosys"/>` : '<strong>GENOSYS Middle East FZ-LLC</strong>'}
  <div><h1>Consignment Return Note</h1><div class="sub">Supplement · Agreement ${esc(contract.name)} · ${esc(returnDocName || '')}</div></div>
</div>
<p><strong>Date:</strong> ${esc(fmtHumanDate(collectionDate))} · <strong>Consignee:</strong> ${esc(agent.name)} · ${esc(PREMISES)}</p>
<table>
<thead><tr><th>#</th><th>Code</th><th>Product</th><th class="num">Qty</th><th class="num">Unit</th><th class="num">Line</th></tr></thead>
<tbody>
${lines
  .map(
    (l, i) => `<tr><td>${i + 1}</td><td>${esc(l.code)}</td><td>${esc(l.name)}</td><td class="num">${l.qty}</td><td class="num">${fmtAed(l.price / 100)}</td><td class="num">${fmtAed(l.lineMinor / 100)}</td></tr>`
  )
  .join('')}
</tbody></table>
<div class="totals">
  <div class="row"><span>Subtotal excl. VAT</span><span>AED ${fmtAed(subtotalNet)}</span></div>
  <div class="row"><span>VAT 5%</span><span>AED ${fmtAed(vatSum)}</span></div>
  <div class="row total"><span>Total incl. VAT</span><span>AED ${fmtAed(subtotalInc)}</span></div>
</div>
<div class="notice">Additional consignment stock return under Agreement ${esc(contract.name)} — <strong>AED ${fmtAed(subtotalInc)}</strong> (supplement to prior return 00299). Aligns settlement correspondence; consignment balance reduced accordingly. Report 01253 remains settled at 3,000 AED.</div>
</body></html>`
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
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (!fs.existsSync(chrome)) return false
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, `file://${htmlPath}`], {
    stdio: 'inherit',
  })
  return fs.existsSync(pdfPath)
}

function sendPdfToPrint(pdfPath) {
  if (process.platform !== 'darwin' || NO_PRINT) return
  const lp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (lp.status === 0 && lp.stdout.trim()) {
    execFileSync('lp', ['-o', 'orientation-requested=4', pdfPath], { stdio: 'inherit' })
  }
}

async function main() {
  const collectionDate = uaeToday()
  console.log('====================================================================')
  console.log('  GOCOSMO — supplemental return 1,699 AED')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [org, agent, contract] = await Promise.all([
    api('GET', `/entity/organization/${ORG_ID}`),
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])

  const stock = await fetchStockByCode()
  const lines = resolveLines(stock)
  const sumMinor = lines.reduce((s, l) => s + l.lineMinor, 0)
  const units = lines.reduce((s, l) => s + l.qty, 0)

  console.log('\n  Lines:')
  for (const line of lines) {
    console.log(`    ${line.code} ×${line.qty}  ${money(line.lineMinor)} AED  ${line.name.slice(0, 50)}`)
  }
  console.log(`\n  Total: ${money(sumMinor)} AED (${units} pcs)`)
  if (sumMinor !== TARGET_SUM_MINOR) {
    throw new Error(`Expected ${money(TARGET_SUM_MINOR)}, got ${money(sumMinor)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
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
      'Supplemental consignment return 1,699 AED — settlement alignment (Contract 13).',
      'Ivory cushion x4, overnight mask x3, PCT x3, collagen x3, hyaluron cream x1.',
      'Prior return 00299 (5,507) + report 01253 paid 3,000 remain unchanged.',
    ].join('\n'),
    positions: lines.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  console.log(`\n  Salesreturn: ${salesReturn.name} | ${money(salesReturn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#salesreturn/edit?id=${salesReturn.id}`)

  const html = buildHtml({
    lines,
    org,
    agent,
    contract,
    collectionDate,
    returnDocName: salesReturn.name,
  })
  const base = `GENOSYS_GOCOSMO_Consignment_Return_Note_${salesReturn.name}_1699AED_${collectionDate.replace(/-/g, '')}`
  const paths = desktopPaths(base)
  fs.writeFileSync(paths.html, html)
  if (htmlToPdf(paths.html, paths.pdf)) {
    console.log(`  PDF: ${paths.pdf}`)
    sendPdfToPrint(paths.pdf)
  } else {
    console.log(`  HTML: ${paths.html}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
