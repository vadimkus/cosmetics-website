#!/usr/bin/env node

/**
 * Bianco Beauty Salon SPA (Dubai Hills) — consignment sales return + PDF.
 * Agreement 00079. Photo 4 Sep 2026. Clinic list.
 *
 *   00190 Anti-Wrinkle Cream 50g ×2 @ 145
 *   00122 Radiance Cream 50g ×2 @ 145
 *   00031 Hydro Soothing Cream 50g ×1 @ 145
 *   00189 Overnight Cream Mask 100g ×1 @ 170
 *   00037 Barrier Protecting Cream 100g ×1 @ 225
 *   Total: 1,120.00 AED / 7 pcs
 *
 *   node --import dotenv/config scripts/moysklad-create-bianco-hills-sales-return-20260904.js
 *   node --import dotenv/config scripts/moysklad-create-bianco-hills-sales-return-20260904.js --commit
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

const { uaeToday, uaeTodayDmy, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'aac56118-2945-11ef-0a80-07b40031e6d1'
const CONTRACT_ID = '83eaec1b-2946-11ef-0a80-08f00030f7f3'
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const LOGO_PATH = path.join(__dirname, '..', 'public', 'images', 'genosys-logo-transparent.png')
const MARKER = `BIANCO-HILLS-RETURN-PHOTO-${uaeToday()}`

/** [code, qty, clinicAed, label] */
const LINES = [
  ['00190', 2, 145, 'Multi Functional Anti-Wrinkle Cream 50g'],
  ['00122', 2, 145, 'Multi Vita Radiance Cream 50g'],
  ['00031', 1, 145, 'Intensive Hydro Soothing Cream 50g'],
  ['00189', 1, 170, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00037', 1, 225, 'Skin Barrier Protecting Cream 100g'],
]

const EXPECTED_SUM_MINOR = 112000
const EXPECTED_QTY = 7

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
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

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return { id: row.id, name: row.name }
}

async function ensureNoDuplicate() {
  const data = await api('GET', `/entity/salesreturn?search=${encodeURIComponent(MARKER)}&limit=5`)
  if ((data.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    throw new Error(`Duplicate return marker: ${MARKER}`)
  }
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
      <td class="num">${money(Math.round(line.unit * 100))}</td>
      <td class="num">${money(Math.round(line.line * 100))}</td>
    </tr>`,
      )
      .join('')}
  </tbody>
</table>
<div class="totals">
  <div class="row"><div>Subtotal (excl. VAT)</div><div>AED ${money(Math.round(subtotalNet * 100))}</div></div>
  <div class="row"><div>VAT (5%)</div><div>AED ${money(Math.round(vatSum * 100))}</div></div>
  <div class="row total"><div>Total (incl. VAT)</div><div>AED ${money(Math.round(subtotalInc * 100))}</div></div>
</div>
<div class="notice">
  The products listed above were physically collected from <strong>${esc(agent.name)}</strong>
  on ${esc(date)} under Consignment Agreement <strong>No. ${esc(contract.name)}</strong>.
  Stock is returned to ${esc(org.name)} warehouse. Consignment balance is reduced accordingly.
</div>
<div class="sign">
  <div class="box">Consignee — returned stock<br/>Signature &amp; stamp · Date</div>
  <div class="box">Consignor — received stock<br/>Genosys representative · Signature · Date</div>
</div>
<div class="footer">
  ${esc(date)} · ${esc(org.name)} · Contract ${esc(contract.name)} · Return ${esc(doc.name)} ·
  ${totalUnits} units · AED ${money(Math.round(subtotalInc * 100))} VAT inclusive (clinic list).
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

function writePdf({ doc, agent, contract, org, lines }) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(doc.name).replace(/[^\w.-]+/g, '_')
  const htmlPath = path.join(ORDERS_DIR, `GENOSYS_Bianco_Dubai_Hills_Return_${safe}.html`)
  const pdfPath = path.join(ORDERS_DIR, `GENOSYS_Bianco_Dubai_Hills_Return_${safe}.pdf`)
  fs.writeFileSync(htmlPath, buildHtml({ doc, agent, contract, org, lines }))
  htmlToPdf(htmlPath, pdfPath)
  return { htmlPath, pdfPath }
}

async function main() {
  console.log('====================================================================')
  console.log('  Bianco Dubai Hills — consignment return (photo 4 Sep)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, org] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    api('GET', `/entity/organization/${ORG_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  const positions = []
  const pdfLines = []
  let sumMinor = 0
  let qty = 0
  for (const [code, q, unitAed, label] of LINES) {
    const item = await fetchAssortmentByCode(code)
    const priceMinor = Math.round(unitAed * 100)
    const lineMinor = priceMinor * q
    sumMinor += lineMinor
    qty += q
    positions.push({
      quantity: q,
      price: priceMinor,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
    pdfLines.push({
      code,
      name: label,
      qty: q,
      unit: unitAed,
      line: unitAed * q,
    })
    console.log(`    ${code} ${item.name} x${q} @ ${money(priceMinor)} → ${money(lineMinor)}`)
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${qty} pcs`)
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Total mismatch: ${money(sumMinor)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (qty !== EXPECTED_QTY) throw new Error(`Qty mismatch: ${qty} vs ${EXPECTED_QTY}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()
  const created = await api('POST', '/entity/salesreturn', {
    moment: uaeMomentNow(),
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Bianco Dubai Hills consignment return from photo 4 Sep 2026.',
      '00190 anti-wrinkle 50g x2; 00122 radiance 50g x2; 00031 hydro 50g x1;',
      '00189 overnight 100g x1; 00037 barrier 100g x1.',
    ].join(' | '),
    positions,
  })

  console.log(`\n  Return: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#salesreturn/edit?id=${created.id}`)

  const { pdfPath } = writePdf({
    doc: created,
    agent,
    contract,
    org,
    lines: pdfLines,
  })
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
