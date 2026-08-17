#!/usr/bin/env node

/**
 * Ilmira Hairulina — consignment sales report + return (Agreement 00003).
 *
 * Sales (231 AED): collagen x5, sea algae x2, SPF40 x1
 * Return: PC toner x3, PC cream 50/250, PC serum x3, SPF50 x2, Snow O2, mist, overnight, EPI, post cream 20g
 *
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-consignment-sales-return-20260714.js
 *   node --import dotenv/config scripts/moysklad-create-ilmira-hairulina-consignment-sales-return-20260714.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'a7c023a6-4681-11ea-0a80-067800209158'
const CONTRACT_ID = '4c3b2437-80e3-11ea-0a80-05d4001412ae'

const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'

const MARKER = `ILMIRA-HAIRULINA-CONSIGNMENT-SALES-RETURN-${uaeToday()}`
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const LOGO_PATH = path.join(__dirname, '..', 'public', 'images', 'genosys-logo-transparent.png')

/** [code, qty, label] — Aloe mask = Sea Algae 00140 */
const SALES_LINES = [
  ['00063', 5, 'Intensive Repair Collagen Mask 23g'],
  ['00140', 2, 'Soothing Bomb Sea Algae Mask 25g (Aloe)'],
  ['00041', 1, 'Multi Sun Cream SPF40/PA++ 40g'],
]

const RETURN_LINES = [
  ['00145', 3, 'Problem Control Toner 200ml'],
  ['00035', 1, 'Intensive Problem Control Cream 50g'],
  ['00036', 1, 'Intensive Problem Control Cream 250g'],
  ['00029', 3, 'Problem Control Serum 30ml'],
  ['54457', 2, 'Ultra Shield Sun Cream SPF50 50g'],
  ['00021', 1, 'Snow O₂ Cleanser 180ml'],
  ['00188', 1, 'Microbiome Energy Infusing Mist 80ml'],
  ['00189', 1, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00129', 1, 'EPI Turnover Boosting Peeling Gel 100g'],
  ['00038', 1, 'Soothing Repair Post Cream 20g'],
]

/** Customer physical remainder to keep on consignment (for recon). */
const TARGET_REMAINDER = {
  '00038': 1, // smoothing/soothing repair post cream 20g
  '00041': 1,
  '00035': 1,
  '00036': 1,
  '00190': 1,
  '00034': 1,
  '00031': 1,
  '00188': 1,
  '00021': 1,
  '00012': 5, // peptide gel mask singles = 1 box
  '00063': 10,
  '00140': 15,
}

const EXPECTED_SALES_MINOR = 23100

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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
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

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
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

async function buildBookLedger() {
  const agentHref = encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)
  const demands = (await fetchAll(`/entity/demand?filter=agent=${agentHref}`)).filter((d) =>
    d.contract?.meta?.href?.includes(CONTRACT_ID)
  )
  const reports = (await fetchAll(`/entity/commissionreportin?filter=agent=${agentHref}`)).filter((r) =>
    r.contract?.meta?.href?.includes(CONTRACT_ID)
  )
  const returns = (await fetchAll(`/entity/salesreturn?filter=agent=${agentHref}`)).filter((r) =>
    r.contract?.meta?.href?.includes(CONTRACT_ID)
  )

  const ledger = new Map()
  async function add(type, id, sign) {
    const pos = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
    for (const p of pos) {
      const code = p.assortment?.code
      if (!code) continue
      ledger.set(code, (ledger.get(code) || 0) + Number(p.quantity) * sign)
    }
  }
  for (const d of demands) await add('demand', d.id, 1)
  for (const r of reports) await add('commissionreportin', r.id, -1)
  for (const r of returns) await add('salesreturn', r.id, -1)
  return ledger
}

function resolveLines(stock, lineDefs) {
  return lineDefs.map(([code, qty, label]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code} (${label})`)
    if (!item.price) throw new Error(`No consignment salePrice for ${code}`)
    return { ...item, qty, label, lineMinor: item.price * qty }
  })
}

async function ensureNoDuplicate() {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate report: ${dup.name}`)
  const returns = await fetchAll(`/entity/salesreturn?filter=${encodeURIComponent(filter)}`)
  const dupRet = returns.find((r) => (r.description || '').includes(MARKER))
  if (dupRet) throw new Error(`Duplicate return: ${dupRet.name}`)
}

function projectLedger(ledger, salesLines, returnLines) {
  const proj = new Map(ledger)
  for (const [code, qty] of salesLines) proj.set(code, (proj.get(code) || 0) - qty)
  for (const [code, qty] of returnLines) proj.set(code, (proj.get(code) || 0) - qty)
  return proj
}

function printRecon(ledger, stock, salesResolved, returnResolved) {
  const salesMap = new Map(SALES_LINES.map(([c, q]) => [c, q]))
  const returnMap = new Map(RETURN_LINES.map(([c, q]) => [c, q]))
  const projected = projectLedger(ledger, salesMap, returnMap)

  console.log('\n  ── Book ledger BEFORE today ──')
  for (const [code, qty] of [...ledger.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (qty !== 0) console.log(`    ${code} x${qty}`)
  }

  console.log('\n  ── After sales report + return (projected book) vs customer remainder ──')
  const allCodes = new Set([...Object.keys(TARGET_REMAINDER), ...projected.keys()])
  let mismatches = 0
  for (const code of [...allCodes].sort()) {
    const tgt = TARGET_REMAINDER[code]
    const proj = projected.get(code) || 0
    if (tgt === undefined && proj === 0) continue
    if (tgt === undefined) {
      console.log(`    ${code} proj ${proj} (not on customer keep list)`)
      continue
    }
    const ok = proj === tgt
    if (!ok) mismatches++
    console.log(
      `    ${code} proj ${proj} | customer ${tgt} | ${ok ? 'OK' : 'MISMATCH'} | ${(stock.get(code)?.name || '').slice(0, 42)}`
    )
  }

  if (mismatches) {
    console.log(`\n  ⚠ ${mismatches} SKU(s) still mismatch after posted sales/return.`)
    console.log('    Collagen 00063: book may need +4 prior unreported sales to reach 10 pcs.')
    console.log('    Sea algae 00140: customer keep 15 vs projected 13 — verify physical count.')
    console.log('    PC cream 00035 / mist 00188: +1 each on book vs customer keep — check shelf.')
  } else {
    console.log('\n  ✓ All customer keep SKUs reconcile.')
  }

  const salesMinor = salesResolved.reduce((s, l) => s + l.lineMinor, 0)
  const returnMinor = returnResolved.reduce((s, l) => s + l.lineMinor, 0)
  console.log(`\n  Sales total: ${money(salesMinor)} AED (expected ${money(EXPECTED_SALES_MINOR)})`)
  console.log(`  Return list value: ${money(returnMinor)} AED`)
}

async function exportCommissionSalesPdf(reportId, reportName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/customtemplate/${CONSIGNMENT_SALES_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/commissionreportin/${reportId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Sales PDF export ${res.status}: ${t.slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Sales PDF missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`Sales PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, `GENOSYS_Ilmira_Hairulina_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return { out, bytes: buf.length }
}

function buildReturnHtml({ lines, org, agent, contract, returnDocName }) {
  const logoB64 = fs.existsSync(LOGO_PATH) ? fs.readFileSync(LOGO_PATH).toString('base64') : ''
  const subtotalInc = lines.reduce((s, l) => s + l.lineMinor, 0) / 100
  const subtotalNet = subtotalInc / 1.05
  const vatSum = subtotalInc - subtotalNet
  const totalUnits = lines.reduce((s, l) => s + l.qty, 0)
  const collectionDate = uaeToday()

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<title>Consignment Return — ${esc(agent.name)}</title>
<style>
@page { size: A4 landscape; margin: 14mm; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 11px; color: #111; }
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.logo img { height: 42px; }
h1 { font-size: 18px; margin: 0 0 4px; }
.meta { color: #444; line-height: 1.5; }
table { width: 100%; border-collapse: collapse; margin-top: 12px; }
th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
th { background: #f3f3f3; }
.num { text-align: right; }
.totals { margin-top: 14px; max-width: 320px; margin-left: auto; }
.totals .row { display: flex; justify-content: space-between; padding: 3px 0; }
.totals .total { font-weight: 700; border-top: 1px solid #999; margin-top: 4px; padding-top: 6px; }
.notice { margin-top: 16px; font-size: 10px; color: #333; line-height: 1.5; }
.footer { margin-top: 20px; font-size: 9px; color: #666; }
</style></head>
<body>
<div class="header">
  <div>
    <h1>Consignment Stock Return</h1>
    <div class="meta">
      <strong>${esc(agent.name)}</strong><br/>
      Agreement <strong>${esc(contract.name)}</strong><br/>
      Date: ${esc(collectionDate)}<br/>
      Document: ${esc(returnDocName || 'pending')}
    </div>
  </div>
  <div class="logo">${logoB64 ? `<img src="data:image/png;base64,${logoB64}" alt="GENOSYS"/>` : ''}</div>
</div>
<div class="meta"><strong>${esc(org.name)}</strong> — products collected from consignment partner premises and returned to warehouse.</div>
<table>
  <thead><tr><th>#</th><th>Code</th><th>Product</th><th class="num">Qty</th><th class="num">Price AED</th><th class="num">Line AED</th></tr></thead>
  <tbody>
    ${lines
      .map(
        (line, i) => `<tr>
      <td>${i + 1}</td><td>${esc(line.code)}</td><td>${esc(line.label || line.name)}</td>
      <td class="num">${line.qty}</td><td class="num">${fmtAed(line.price / 100)}</td><td class="num">${fmtAed(line.lineMinor / 100)}</td>
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
<div class="notice">Stock returned to ${esc(org.name)} warehouse. Consignment balance under Agreement ${esc(contract.name)} is reduced accordingly.</div>
<div class="footer">${esc(collectionDate)} · ${totalUnits} units · list value AED ${fmtAed(subtotalInc)} VAT inclusive</div>
</body></html>`
}

function htmlToPdf(htmlPath, pdfPath) {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (!fs.existsSync(chromePath)) {
    console.warn('  Chrome not found — return PDF skipped')
    return false
  }
  execFileSync(
    chromePath,
    ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, `file://${htmlPath}`],
    { stdio: 'inherit' }
  )
  return fs.existsSync(pdfPath)
}

function writeReturnDocuments({ lines, org, agent, contract, returnDocName }) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const base = `GENOSYS_Ilmira_Hairulina_Consignment_Return_${returnDocName}`
  const htmlPath = path.join(ORDERS_DIR, `${base}.html`)
  const pdfPath = path.join(ORDERS_DIR, `${base}.pdf`)
  fs.writeFileSync(htmlPath, buildReturnHtml({ lines, org, agent, contract, returnDocName }))
  const pdfOk = htmlToPdf(htmlPath, pdfPath)
  return { htmlPath, pdfPath, pdfOk }
}

async function main() {
  console.log('====================================================================')
  console.log('  Ilmira Hairulina — consignment sales + return (Agreement 00003)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [org, agent, contract, stock, ledgerBefore] = await Promise.all([
    api('GET', `/entity/organization/${ORG_ID}`),
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
    buildBookLedger(),
  ])

  console.log(`  Customer: ${agent.name} (${agent.phone || '—'})`)
  console.log(`  Agreement: ${contract.name}`)

  const salesResolved = resolveLines(stock, SALES_LINES)
  const returnResolved = resolveLines(stock, RETURN_LINES)

  console.log('\n  Sales lines:')
  for (const line of salesResolved) {
    console.log(`    ${line.code} x${line.qty} @ ${money(line.price)} = ${money(line.lineMinor)} | ${line.label}`)
  }
  const salesMinor = salesResolved.reduce((s, l) => s + l.lineMinor, 0)
  if (Math.abs(salesMinor - EXPECTED_SALES_MINOR) > 1) {
    throw new Error(`Sales total ${money(salesMinor)} != ${money(EXPECTED_SALES_MINOR)}`)
  }

  console.log('\n  Return lines:')
  for (const line of returnResolved) {
    console.log(`    ${line.code} x${line.qty} @ ${money(line.price)} = ${money(line.lineMinor)} | ${line.label}`)
  }

  printRecon(ledgerBefore, stock, salesResolved, returnResolved)

  if (COMMIT) await ensureNoDuplicate()

  if (!COMMIT) {
    const preview = writeReturnDocuments({ lines: returnResolved, org, agent, contract, returnDocName: 'DRYRUN' })
    console.log(`\n  Return preview: ${preview.htmlPath}`)
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(2)

  const report = await api('POST', '/entity/commissionreportin', {
    moment: t0,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: '2026-07-01 00:00:00',
    commissionPeriodEnd: `${uaeToday()} 23:59:59`,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Ilmira Hairulina | Agreement 00003.',
      'Sold: collagen 00063 x5, sea algae 00140 x2, SPF40 00041 x1.',
      'Total 231 AED per customer WhatsApp 2026-07-14.',
    ].join('\n'),
    positions: salesResolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  })
  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  const salesPdf = await exportCommissionSalesPdf(report.id, report.name)
  console.log(`  Sales PDF: ${salesPdf.out} (${salesPdf.bytes} bytes)`)

  const salesReturn = await api('POST', '/entity/salesreturn', {
    moment: t1,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Ilmira Hairulina consignment return collected 2026-07-14.',
      'PC toner/serum/creams, SPF50, Snow O2, mist, overnight, EPI, post cream 20g.',
    ].join(' | '),
    positions: returnResolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })
  console.log(`  Return: ${salesReturn.name} | ${money(salesReturn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#salesreturn/edit?id=${salesReturn.id}`)

  const retDocs = writeReturnDocuments({
    lines: returnResolved,
    org,
    agent,
    contract,
    returnDocName: salesReturn.name,
  })
  console.log(`  Return PDF: ${retDocs.pdfOk ? retDocs.pdfPath : retDocs.htmlPath}`)

  const ledgerAfter = await buildBookLedger()
  printRecon(ledgerAfter, stock, [], [])
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
