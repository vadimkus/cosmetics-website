#!/usr/bin/env node

/**
 * Fayy Health FZCO — Statement of Account
 * Template: Genosys_SOA_CLEAN_NO_STAMP (MoySklad XLS)
 * + open invoice PDFs → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-export-fayy-health-soa.js
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

const AGENT_ID = 'ee20d7e3-d46d-11ed-0a80-0df400228557'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const SOA_TEMPLATE_XLS = path.join(
  os.homedir(),
  'Desktop',
  'Drive',
  'Genosys',
  'Print_forms',
  '2026',
  'invoice_ART',
  'SOA',
  'Genosys_SOA_CLEAN_NO_STAMP.xls'
)

const OPEN_INVOICES = [
  { name: '04511', id: 'a0de441b-4f8d-11f1-0a80-0c4e000fa39a' },
  { name: '04795', id: 'b1cb4dd1-7b96-11f1-0a80-067e000fe4f9' },
]

const OUT_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const FILL_SCRIPT = path.join(__dirname, 'fill-genosys-soa-clean-xls.py')

async function api(pathStr, opts = {}) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers: {
      Authorization: AUTH,
      Accept: opts.accept || 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    redirect: opts.redirect || 'follow',
  })
  const text = await res.text()
  if (!res.ok && !opts.allowError) {
    throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 800)}`)
  }
  return { status: res.status, text, headers: res.headers, json: text ? JSON.parse(text) : null }
}

async function fetchAll(entity) {
  const filter = encodeURIComponent(`agent=${API}/entity/counterparty/${AGENT_ID}`)
  const rows = []
  let offset = 0
  while (true) {
    const { json: data } = await api(
      `/entity/${entity}?filter=${filter}&limit=1000&offset=${offset}&order=moment,asc`
    )
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function fmtDate(momentStr) {
  if (!momentStr) return ''
  const [y, m, d] = momentStr.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

function statementDate() {
  return fmtDate(new Date().toISOString())
}

async function exportInvoicePdf(invoiceId, outPath) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_LEGAL_TAX_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await api(`/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    body,
    accept: '*/*',
    redirect: 'manual',
    allowError: true,
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Invoice export ${res.status}: ${res.text.slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Invoice export missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`Invoice PDF download HTTP ${pdfRes.status}`)
  fs.writeFileSync(outPath, Buffer.from(await pdfRes.arrayBuffer()))
}

async function main() {
  if (!fs.existsSync(SOA_TEMPLATE_XLS)) {
    throw new Error(`SOA template not found: ${SOA_TEMPLATE_XLS}`)
  }
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const agent = (await api(`/entity/counterparty/${AGENT_ID}`)).json
  const invoices = await fetchAll('invoiceout')
  const invoiceRows = invoices.map((inv) => ({
    docNo: inv.name,
    date: fmtDate(inv.moment),
    amount: money(inv.sum || 0),
    paid: money(inv.payedSum || 0),
    balance: money((inv.sum || 0) - (inv.payedSum || 0)),
  }))

  const totalPaid = invoiceRows.reduce((s, r) => s + Number(r.paid), 0).toFixed(2)
  const totalBalance = invoiceRows.reduce((s, r) => s + Number(r.balance), 0).toFixed(2)

  const payloadPath = path.join(OUT_DIR, '.soa_work', 'fayy_payload.json')
  fs.mkdirSync(path.dirname(payloadPath), { recursive: true })
  fs.writeFileSync(
    payloadPath,
    JSON.stringify(
      {
        agentName: agent.name,
        statementDate: statementDate(),
        templatePath: SOA_TEMPLATE_XLS,
        invoices: invoiceRows,
        totalPaid,
        totalBalance,
      },
      null,
      2
    )
  )

  const soaPdf = path.join(OUT_DIR, 'GENOSYS_Fayy_Health_SOA.pdf')
  execFileSync('python3', [FILL_SCRIPT, payloadPath, soaPdf], { stdio: 'inherit' })

  console.log('\nFayy Health FZCO — SOA (Genosys_SOA_CLEAN_NO_STAMP)')
  console.log(`  Outstanding: ${totalBalance} AED`)
  console.log(`  SOA PDF: ${soaPdf}`)
  console.log(`  SOA XLSX: ${soaPdf.replace(/\.pdf$/i, '.xlsx')}`)

  for (const inv of OPEN_INVOICES) {
    const out = path.join(OUT_DIR, `GENOSYS_Fayy_Health_${inv.name}.pdf`)
    await exportInvoicePdf(inv.id, out)
    console.log(`  Invoice PDF: ${out}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
