#!/usr/bin/env node

/**
 * Export Brau Ladies SOA invoices (26 Aug 2026 statement) → ~/Desktop/orders/
 * Legal_TAX clinic template. No print.
 *
 *   node --import dotenv/config scripts/moysklad-export-brau-soa-invoices-20260827.js
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const AGENT_ID = 'ce7c406d-dadf-11ee-0a80-130f00597aa2'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const SOA = [
  { name: '04975', expectedMinor: 68000 },
  { name: '04974', expectedMinor: 106000 },
  { name: '04944', expectedMinor: 38000 },
  { name: '04943', expectedMinor: 76000 },
  { name: '04942', expectedMinor: 38000 },
  { name: '04916', expectedMinor: 95000 },
  { name: '04915', expectedMinor: 95000 },
  { name: '04910', expectedMinor: 76000 },
  { name: '04890', expectedMinor: 76000 },
  { name: '04889', expectedMinor: 38000 },
  { name: '04866', expectedMinor: 76000 },
  { name: '04865', expectedMinor: 38000 },
]

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function branchSlug(invoice) {
  const raw = [
    invoice.shipmentAddressFull?.addInfo,
    invoice.shipmentAddressFull?.street,
    invoice.shipmentAddress,
    invoice.description,
  ]
    .filter(Boolean)
    .join(' ')
  const hit = raw.match(/Brau[^\n|,]*/i)
  const label = (hit ? hit[0] : 'Brau')
    .replace(/Brau Ladies Salon LLC\s*[—-]\s*/i, '')
    .replace(/Brau Ladies Salon LLC/i, 'Brau')
    .trim()
  return label.replace(/[^\w.-]+/g, '_').replace(/^_|_$/g, '') || 'Brau'
}

async function api(pathStr) {
  const res = await fetch(`${API}${pathStr}`, {
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function exportPdf(invoiceId) {
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template: {
        meta: {
          href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_LEGAL_TAX_TEMPLATE_ID}`,
          type: 'customtemplate',
          mediaType: 'application/json',
        },
      },
      extension: 'pdf',
    }),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  Brau Ladies SOA — export Legal_TAX invoices')
  console.log('====================================================================')

  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const exported = []

  for (const spec of SOA) {
    const found = await api(`/entity/invoiceout?filter=${encodeURIComponent(`name=${spec.name}`)}&limit=10`)
    const row = (found.rows || []).find((r) => r.agent?.meta?.href?.endsWith(`/${AGENT_ID}`))
    if (!row) throw new Error(`Invoice ${spec.name} not found for Brau Ladies`)

    const inv = await api(`/entity/invoiceout/${row.id}`)
    if ((inv.sum || 0) !== spec.expectedMinor) {
      throw new Error(`Invoice ${spec.name} sum ${money(inv.sum)} ≠ SOA ${money(spec.expectedMinor)}`)
    }

    const buf = await exportPdf(inv.id)
    if (!buf) throw new Error(`Invoice ${spec.name} export returned 412`)

    const out = path.join(ORDERS_DIR, `GENOSYS_Brau_Ladies_${branchSlug(inv)}_${inv.name}.pdf`)
    fs.writeFileSync(out, buf)
    exported.push({
      name: inv.name,
      date: String(inv.moment).slice(0, 10),
      sum: money(inv.sum),
      paid: money(inv.payedSum),
      file: out,
      bytes: buf.length,
    })
    console.log(`  ${inv.name} | ${money(inv.sum)} | ${String(inv.moment).slice(0, 10)} → ${path.basename(out)}`)
  }

  const total = exported.reduce((s, r) => s + Number(r.sum), 0)
  console.log(`\n  ${exported.length} PDFs | ${total.toFixed(2)} AED → ${ORDERS_DIR}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
