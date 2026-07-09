#!/usr/bin/env node

/**
 * Export all Brau Ladies Salon LLC invoices issued in June 2026 → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-export-brau-ladies-june-invoices-20260630.js
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

const AGENT_ID = 'ce7c406d-dadf-11ee-0a80-130f00597aa2' // Brau Ladies Salon LLC
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const PERIOD = {
  start: '2026-06-01 00:00:00',
  end: '2026-06-30 23:59:59',
}

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
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function pdfPath(invoiceName) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  return path.join(ORDERS_DIR, `GENOSYS_Brau_Ladies_${invoiceName}.pdf`)
}

async function exportInvoicePdf(invoiceId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_RETAIL_PRINT_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  Brau Ladies — export June 2026 invoices → ~/Desktop/orders/')
  console.log('====================================================================\n')

  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${PERIOD.start}`,
    `moment<=${PERIOD.end}`,
  ].join(';')

  const invoices = await fetchAll(`/entity/invoiceout?filter=${encodeURIComponent(filter)}&order=moment,asc`)

  if (invoices.length === 0) {
    console.log('  No invoices found for June 2026.')
    return
  }

  console.log(`  Found ${invoices.length} invoice(s):\n`)

  const exported = []
  for (const inv of invoices) {
    const out = pdfPath(inv.name)
    const buf = await exportInvoicePdf(inv.id)
    if (!buf) {
      console.log(`  ⚠ ${inv.name} — export skipped (412)`)
      continue
    }
    fs.writeFileSync(out, buf)
    exported.push({
      name: inv.name,
      date: inv.moment.slice(0, 10),
      sum: money(inv.sum),
      path: out,
      bytes: buf.length,
    })
    console.log(`  ✓ ${inv.name} | ${money(inv.sum)} AED | ${inv.moment.slice(0, 10)} → ${out}`)
  }

  console.log(`\n  Exported ${exported.length} PDF(s) to ${ORDERS_DIR}`)
  console.log('\n=== JSON ===')
  console.log(JSON.stringify(exported, null, 2))
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
