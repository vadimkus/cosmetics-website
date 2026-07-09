#!/usr/bin/env node

/**
 * VAT Q2 2026 — export invoice PDFs + consignment consolidated report.
 *
 *   node --import dotenv/config scripts/vat-q2-2026-export-pack.js
 *   node --import dotenv/config scripts/vat-q2-2026-export-pack.js --invoices-only
 *   node --import dotenv/config scripts/vat-q2-2026-export-pack.js --consignment-only
 *   node --import dotenv/config scripts/vat-q2-2026-export-pack.js --resume
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

const Q2_FROM = '2026-04-01 00:00:00'
const Q2_TO = '2026-06-30 23:59:59'

const VAT_Q2_ROOT = path.join(
  os.homedir(),
  'Desktop/Drive/Genosys/Company_Legal/Tax/VAT/2026/Q2'
)

const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'

const INVOICES_ONLY = process.argv.includes('--invoices-only')
const CONSIGNMENT_ONLY = process.argv.includes('--consignment-only')
const RESUME = process.argv.includes('--resume')
const CONCURRENCY = 3
const DELAY_MS = 350

const MONTH_DIRS = {
  3: 'Invoices_April_2026',
  4: 'Invoices_May_2026',
  5: 'Invoices_June_2026',
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function stamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`
}

function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function formatAmount(minor) {
  const n = (minor / 100).toFixed(2).replace('.', ',')
  return n
}

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
    if (res.status === 429 && attempt < 10) {
      await sleep(800 * attempt)
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 800)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
      await sleep(1500 * attempt)
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function fetchAll(endpoint, dateFrom, dateTo) {
  const rows = []
  let offset = 0
  const dateFilter = `moment>=${dateFrom};moment<=${dateTo}`
  while (true) {
    const sep = endpoint.includes('?') ? '&' : '?'
    const url = `${endpoint}${sep}limit=1000&offset=${offset}&filter=${encodeURIComponent(dateFilter)}&order=moment,asc&expand=agent,state`
    const data = await api('GET', url)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

async function exportPdf(entityType, entityId, templateId, extension = 'pdf') {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/${entityType}/metadata/customtemplate/${templateId}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension,
  }
  const res = await fetch(`${API}/entity/${entityType}/${entityId}/export`, {
    method: 'POST',
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status === 429) {
    await sleep(2000)
    return exportPdf(entityType, entityId, templateId, extension)
  }
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Export ${entityType}/${entityId} ${res.status}: ${t.slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const fileRes = await fetch(location)
  if (!fileRes.ok) throw new Error(`Download HTTP ${fileRes.status}`)
  return Buffer.from(await fileRes.arrayBuffer())
}

async function mapPool(items, worker, concurrency) {
  const results = []
  let idx = 0
  async function run() {
    while (idx < items.length) {
      const i = idx++
      results[i] = await worker(items[i], i)
      await sleep(DELAY_MS)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, run))
  return results
}

function batchDirForMonth(monthIndex) {
  const monthFolder = path.join(VAT_Q2_ROOT, MONTH_DIRS[monthIndex])
  const batchName = `Genosys_Invoice_Legal_TAX-${LOGIN}-${stamp()}`
  const batchDir = path.join(monthFolder, batchName)
  fs.mkdirSync(batchDir, { recursive: true })
  return batchDir
}

async function exportInvoices() {
  console.log('\n=== Standard invoices (04xxx) Q2 ===')
  const invoices = (await fetchAll('/entity/invoiceout', Q2_FROM, Q2_TO)).filter(
    (r) => r.name && /^04/.test(r.name)
  )
  console.log(`  Found ${invoices.length} invoices`)

  const batchDirs = {}
  for (const [m, dir] of Object.entries(MONTH_DIRS)) {
    const existing = fs.existsSync(path.join(VAT_Q2_ROOT, dir))
      ? fs.readdirSync(path.join(VAT_Q2_ROOT, dir)).find((n) => n.startsWith('Genosys_Invoice_Legal_TAX-'))
      : null
    batchDirs[m] = existing
      ? path.join(VAT_Q2_ROOT, dir, existing)
      : batchDirForMonth(Number(m))
    fs.mkdirSync(batchDirs[m], { recursive: true })
    console.log(`  ${dir}: ${batchDirs[m]}`)
  }

  let ok = 0
  let skip = 0
  let fail = 0

  await mapPool(
    invoices,
    async (inv) => {
      const month = new Date(inv.moment).getMonth()
      const outDir = batchDirs[month]
      if (!outDir) return
      const fileName = `Genosys_Invoice_Legal_TAX-${inv.name}.pdf`
      const outPath = path.join(outDir, fileName)
      if (RESUME && fs.existsSync(outPath) && fs.statSync(outPath).size > 500) {
        skip++
        return
      }
      try {
        const buf = await exportPdf('invoiceout', inv.id, INVOICE_LEGAL_TAX_TEMPLATE_ID)
        if (!buf) {
          console.warn(`  ⚠️  No PDF: ${inv.name}`)
          fail++
          return
        }
        fs.writeFileSync(outPath, buf)
        ok++
        if (ok % 25 === 0) console.log(`  … ${ok} exported (${inv.name})`)
      } catch (e) {
        fail++
        console.error(`  ❌ ${inv.name}: ${e.message}`)
      }
    },
    CONCURRENCY
  )

  console.log(`  Done: ${ok} exported, ${skip} skipped, ${fail} failed`)
}

async function exportConsignment() {
  console.log('\n=== Consignment reports (01308–01387) ===')
  const reports = (await fetchAll('/entity/commissionreportin', Q2_FROM, Q2_TO)).filter((r) => {
    const n = parseInt(r.name, 10)
    return r.name && !Number.isNaN(n) && n >= 1308 && n <= 1387
  })
  reports.sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10))
  console.log(`  Found ${reports.length} commission reports`)

  const outDir = path.join(VAT_Q2_ROOT, 'Consignment_invoices_All_Q2')
  fs.mkdirSync(outDir, { recursive: true })
  const pdfDir = path.join(outDir, '_individual_pdfs')
  fs.mkdirSync(pdfDir, { recursive: true })

  let ok = 0
  let skip = 0
  await mapPool(
    reports,
    async (rep) => {
      const outPath = path.join(pdfDir, `Consignment_Sales_${rep.name}.pdf`)
      if (RESUME && fs.existsSync(outPath) && fs.statSync(outPath).size > 500) {
        skip++
        return
      }
      const buf = await exportPdf('commissionreportin', rep.id, CONSIGNMENT_SALES_TEMPLATE_ID)
      if (!buf) {
        console.warn(`  ⚠️  No PDF: ${rep.name}`)
        return
      }
      fs.writeFileSync(outPath, buf)
      ok++
    },
    CONCURRENCY
  )
  console.log(`  Individual PDFs: ${ok} exported, ${skip} skipped`)

  const xlsxPath = path.join(outDir, 'Consignment_sales_report.xlsx')
  await buildConsignmentExcel(reports, xlsxPath)
  console.log(`  Excel: ${xlsxPath}`)

  const summaryPdf = path.join(outDir, 'Consignment_Inv_All.pdf')
  try {
    execFileSync('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', outDir, xlsxPath], {
      stdio: 'pipe',
    })
    const generated = path.join(outDir, 'Consignment_sales_report.pdf')
    if (fs.existsSync(generated)) {
      fs.renameSync(generated, summaryPdf)
      console.log(`  Summary PDF: ${summaryPdf}`)
    }
  } catch (e) {
    console.warn(`  Summary PDF via LibreOffice failed: ${e.message}`)
  }

  const zipPath = path.join(VAT_Q2_ROOT, 'Invoice_Consignment_Sales_ALL.zip')
  try {
    execFileSync('zip', ['-r', '-q', zipPath, '.'], { cwd: pdfDir })
    console.log(`  Zip: ${zipPath}`)
  } catch (e) {
    console.warn(`  Zip failed: ${e.message}`)
  }
}

async function buildConsignmentExcel(reports, outPath) {
  const { execFileSync: execPy } = require('child_process')
  const rows = reports.map((r) => ({
    name: r.name,
    customer: r.agent?.name || r.contract?.name || '',
    moment: r.moment,
    sum: r.sum || 0,
    payedSum: r.payedSum || 0,
    state: r.state?.name || '',
  }))
  const tmpJson = path.join(os.tmpdir(), `consignment-q2-${Date.now()}.json`)
  fs.writeFileSync(tmpJson, JSON.stringify(rows))
  const py = `
import json, openpyxl
from openpyxl import Workbook
from datetime import datetime

with open(${JSON.stringify(tmpJson)}) as f:
    rows = json.load(f)

def fmt_dt(iso):
    if not iso: return ''
    d = datetime.fromisoformat(iso.replace('Z', '+00:00'))
    return d.strftime('%d.%m.%Y %H:%M')

def fmt_amt(minor):
    return f"{minor/100:.2f}".replace('.', ',')

wb = Workbook()
ws = wb.active
header = [
    'Delivered with love', None, None, None, None, None, None,
]
lines = [
    ['Supplier:', None, None, None, None, None, None],
    ['Legal Name: Genosys Middle East FZ-LLC', None, None, None, None, None, None],
    ['Phone: +971 58 548 76 65', None, None, None, None, None, None],
    ['E-mail: sales@genosys.ae', None, None, None, None, None, None],
    ['Address: Compass Coworking Centre, Office: Genosys ME, Al Shahoda Road, Street C, P.O. Box 16111, Ras Al Khaimah, UAE.', None, None, None, None, None, None],
    ['Trade License # 5023192', None, None, None, None, None, None],
    ['TRN # 104229886700003', None, None, None, None, None, None],
    ['Web-site: https://www.genosys.ae', None, None, None, None, None, None],
    ['Instagram: Genosys.uae', None, None, None, None, None, None],
    [f'Statement date: {datetime.now().strftime("%d.%m.%Y %H:%M:%S")}', None, None, None, None, None, None],
    ['Supplier: Genosys Middle East FZ-LLC', None, None, None, None, None, None],
    [None, None, None, None, None, None, None],
    ['Consignment sales report', None, None, None, None, None, None],
    [None, None, None, None, None, None, None],
    ['Invoice number', 'Customer', 'Invoice date/time', 'Amount', 'Currency', 'Paid amount', 'Delivery status'],
]
for row in lines:
    ws.append(row)
for r in sorted(rows, key=lambda x: int(x['name']), reverse=True):
    paid = fmt_amt(r['payedSum']) if r['payedSum'] else 'pending payment'
    ws.append([
        r['name'], r['customer'], fmt_dt(r['moment']), fmt_amt(r['sum']), 'AED', paid, 'Delivered',
    ])
wb.save(${JSON.stringify(outPath)})
print('saved', ${JSON.stringify(outPath)})
`
  execPy('python3', ['-c', py], { stdio: 'inherit' })
  try { fs.unlinkSync(tmpJson) } catch {}
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════╗')
  console.log('║  VAT Q2 2026 Export Pack — Genosys Middle East FZ-LLC         ║')
  console.log(`║  Target: ${VAT_Q2_ROOT}`)
  console.log('╚══════════════════════════════════════════════════════════════════╝')

  if (!CONSIGNMENT_ONLY) await exportInvoices()
  if (!INVOICES_ONLY) await exportConsignment()

  console.log('\n✅ Export pack complete.')
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})
