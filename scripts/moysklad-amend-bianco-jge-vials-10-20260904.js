#!/usr/bin/env node

/**
 * Bianco JGE Ladies INV 05023 — all vial lines → 10.
 * SO GENCardM260904JGEL / INV 05023 / SHIP 06811. Re-export Legal_TAX.
 *
 *   node --import dotenv/config scripts/moysklad-amend-bianco-jge-vials-10-20260904.js
 *   node --import dotenv/config scripts/moysklad-amend-bianco-jge-vials-10-20260904.js --commit
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
const COMMIT = process.argv.includes('--commit')

const ORDER_ID = 'b433dc9a-a862-11f1-0a80-08bb00692016'
const INVOICE_ID = 'b4ec37e8-a862-11f1-0a80-0bf600675c01'
const DEMAND_ID = 'b6375d92-a862-11f1-0a80-0bf600675f0e'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const VIAL_QTY = 10
const VIAL_FROM = {
  '00015': 30,
  '00069': 20,
  '00020': 20,
  '00071': 30,
  '00018': 20,
  '00065': 20,
}
const KEEP = {
  '00011': 3,
  '00012': 10,
  '00013': 1,
  '00024': 1,
  '00032': 1,
  '00025': 1,
}
const EXPECTED_SUM_MINOR = 393500

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function exportInvoicePdf(invoiceId) {
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
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function amendDoc(type, id, label) {
  const doc = await api('GET', `/entity/${type}/${id}`)
  const pos = await api('GET', `/entity/${type}/${id}/positions?expand=assortment&limit=50`)
  const rows = pos.rows || []
  console.log(`  ${label} ${doc.name} ${money(doc.sum)} (${rows.length} lines)`)

  const seen = new Set()
  for (const line of rows) {
    const code = line.assortment?.code
    seen.add(code)
    if (VIAL_FROM[code] != null) {
      const from = VIAL_FROM[code]
      if (line.quantity !== from && line.quantity !== VIAL_QTY) {
        throw new Error(`${label} ${code}: qty ${line.quantity}, expected ${from} or ${VIAL_QTY}`)
      }
      console.log(`    ${code} ${line.assortment.name} x${line.quantity} → ${VIAL_QTY}`)
      if (COMMIT && line.quantity !== VIAL_QTY) {
        await api('PUT', `/entity/${type}/${id}/positions/${line.id}`, {
          quantity: VIAL_QTY,
          price: line.price,
          discount: line.discount || 0,
          vat: 5,
          vatEnabled: true,
        })
      }
      continue
    }
    if (KEEP[code] != null) {
      if (line.quantity !== KEEP[code]) {
        throw new Error(`${label} ${code}: qty ${line.quantity}, expected keep ${KEEP[code]}`)
      }
      console.log(`    ${code} keep x${line.quantity}`)
      continue
    }
    throw new Error(`${label}: unexpected line ${code}`)
  }

  for (const code of [...Object.keys(VIAL_FROM), ...Object.keys(KEEP)]) {
    if (!seen.has(code)) throw new Error(`${label}: missing ${code}`)
  }

  if (!COMMIT) return

  const after = await api('GET', `/entity/${type}/${id}`)
  if (after.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`${label} sum ${money(after.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }
  console.log(`    → ${money(after.sum)}`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Bianco JGE 05023 — vial lines → 10')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('  Target: 3,935.00 AED')

  await amendDoc('customerorder', ORDER_ID, 'SO')
  await amendDoc('invoiceout', INVOICE_ID, 'INV')
  await amendDoc('demand', DEMAND_ID, 'SHIP')

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const so = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: so.meta,
    description: [
      so.description || '',
      '2026-09-04: all vial lines reduced to 10. Total 3935 AED unpaid.',
    ].join('\n'),
  })

  const pdfBuf = await exportInvoicePdf(INVOICE_ID)
  const outPath = path.join(ORDERS_DIR, 'GENOSYS_Bianco_JGE_Ladies_05023.pdf')
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF: ${outPath} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
