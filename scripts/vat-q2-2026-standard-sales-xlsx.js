#!/usr/bin/env node

/**
 * VAT Q2 2026 — Standard (normal) sales Excel for accountant.
 *
 *   node --import dotenv/config scripts/vat-q2-2026-standard-sales-xlsx.js
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
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

const OUT_PATH = path.join(
  os.homedir(),
  'Desktop/Drive/Genosys/Company_Legal/Tax/VAT/2026/Q2/Standard_sales_report.xlsx'
)

async function api(pathStr) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 400)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAllInvoicesOut() {
  const rows = []
  let offset = 0
  const dateFilter = `moment>=${Q2_FROM};moment<=${Q2_TO}`

  while (true) {
    // MoySklad drops expanded agent.name on large pages — resolve via cache below.
    const url = `/entity/invoiceout?limit=1000&offset=${offset}&filter=${encodeURIComponent(dateFilter)}&order=moment,asc`
    const data = await api(url)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }

  return rows.filter((r) => r.name && /^04/.test(String(r.name)))
}

async function resolveAgentsAndStates(rows) {
  const agentCache = {}
  const stateCache = {}

  for (const row of rows) {
    if (row.agent?.meta?.href && !row.agent.name) {
      const href = row.agent.meta.href
      if (!agentCache[href]) {
        const data = await api(href).catch(() => null)
        agentCache[href] = data?.name || '?'
      }
      row.agent.name = agentCache[href]
    }
    if (row.state?.meta?.href && !row.state.name) {
      const href = row.state.meta.href
      if (!stateCache[href]) {
        const data = await api(href).catch(() => null)
        stateCache[href] = data?.name || '?'
      }
      row.state.name = stateCache[href]
    }
  }

  console.log(
    `  Resolved ${Object.keys(agentCache).length} counterparties, ${Object.keys(stateCache).length} states`
  )
}

function fmtDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function fmtAmount(minor) {
  return (minor / 100).toFixed(2).replace('.', ',')
}

function paidLabel(row) {
  const sum = row.sum || 0
  const paid = row.payedSum || 0
  if (paid >= sum && sum > 0) return fmtAmount(sum)
  if (paid > 0) return fmtAmount(paid)
  return 'pending payment'
}

function deliveryStatus(row) {
  const state = (row.state?.name || '').toLowerCase()
  if (state.includes('оплачен') || state.includes('paid')) return 'Delivered'
  if (state.includes('выписан') || state.includes('issued')) return 'Delivered'
  return row.state?.name || 'Delivered'
}

async function writeExcel(invoices) {
  const payload = invoices.map((r) => ({
    name: r.name,
    customer: r.agent?.name || '',
    moment: r.moment,
    sum: r.sum || 0,
    paid: paidLabel(r),
    status: deliveryStatus(r),
  }))

  const tmpJson = path.join(os.tmpdir(), `standard-sales-q2-${Date.now()}.json`)
  fs.writeFileSync(tmpJson, JSON.stringify(payload))

  const py = `
import json, sys
from datetime import datetime
from openpyxl import Workbook

rows = json.load(open(sys.argv[1]))
out = sys.argv[2]
now = datetime.now().strftime('%d.%m.%Y %H:%M:%S')

def fmt_dt(iso):
    if not iso: return ''
    d = datetime.fromisoformat(iso.replace('Z', '+00:00'))
    return d.strftime('%d.%m.%Y %H:%M')

def fmt_amt(minor):
    return f"{minor/100:.2f}".replace('.', ',')

wb = Workbook()
ws = wb.active
header_lines = [
    ['Delivered with love'] + [None]*6,
    ['Supplier:'] + [None]*6,
    ['Legal Name: Genosys Middle East FZ-LLC'] + [None]*6,
    ['Phone: +971 58 548 76 65'] + [None]*6,
    ['E-mail: sales@genosys.ae'] + [None]*6,
    ['Address: Compass Coworking Centre, Office: Genosys ME, Al Shahoda Road, Street C, P.O. Box 16111, Ras Al Khaimah, UAE.'] + [None]*6,
    ['Trade License # 5023192'] + [None]*6,
    ['TRN # 104229886700003'] + [None]*6,
    ['Web-site: https://www.genosys.ae'] + [None]*6,
    ['Instagram: Genosys.uae'] + [None]*6,
    [f'Statement date: {now}'] + [None]*6,
    ['Supplier: Genosys Middle East FZ-LLC'] + [None]*6,
    [None]*7,
    ['Standard sales report'] + [None]*6,
    [None]*7,
    ['Invoice number', 'Customer', 'Invoice date/time', 'Amount', 'Currency', 'Paid amount', 'Delivery status'],
]
for line in header_lines:
    ws.append(line)

for r in sorted(rows, key=lambda x: int(x['name']), reverse=True):
    ws.append([
        r['name'], r['customer'], fmt_dt(r['moment']), fmt_amt(r['sum']), 'AED', r['paid'], r['status'],
    ])

total = sum(r['sum'] for r in rows)
ws.append([None]*7)
ws.append(['TOTAL', None, None, fmt_amt(total), 'AED', None, None])
ws.append(['Count', len(rows), None, None, None, None, None])

wb.save(out)
print(len(rows), fmt_amt(total))
`

  const out = execFileSync('python3', ['-c', py, tmpJson, OUT_PATH], { encoding: 'utf8' }).trim()
  fs.unlinkSync(tmpJson)
  return out
}

async function main() {
  console.log('Fetching Q2 standard sales (04xxx) from MoySklad…')
  const invoices = await fetchAllInvoicesOut()
  console.log(`  ${invoices.length} invoices (${invoices[0]?.name} → ${invoices[invoices.length - 1]?.name})`)
  console.log('Resolving customer names…')
  await resolveAgentsAndStates(invoices)
  const missingNames = invoices.filter((r) => !r.agent?.name || r.agent.name === '?').length
  if (missingNames) console.warn(`  WARNING: ${missingNames} invoices still missing customer name`)

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  const summary = await writeExcel(invoices)
  console.log(`\nSaved: ${OUT_PATH}`)
  console.log(`  Rows: ${summary}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
