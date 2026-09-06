#!/usr/bin/env node

/**
 * GENCardM2609016564 was attached to 2020 Olga Lysenko (Arjan) by name match.
 * Real customer is Miss Olga — same phone, Studio City Laya Heights 331.
 * Relink SO / INV / SHIP / paymentin. Put Studio City on the invoice.
 *
 *   node --import dotenv/config scripts/moysklad-reassign-olga-lysenko-to-miss-olga-20260901.js
 *   node --import dotenv/config scripts/moysklad-reassign-olga-lysenko-to-miss-olga-20260901.js --commit
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

const WRONG_CP_ID = '6315990c-228d-11eb-0a80-044e002c6351'
const RIGHT_CP_ID = 'cadebb81-69e1-11ef-0a80-0d27000f91c7'
const ORDER_ID = '45a6260f-a5d4-11f1-0a80-18220025d4f7'
const INVOICE_ID = '45e3fd21-a5d4-11f1-0a80-18220025d51b'
const DEMAND_ID = '46b6a980-a5d4-11f1-0a80-1433002c4b27'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const RETAIL_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const EMAIL = 'olgalita888@gmail.com'

const SHIP_FULL = {
  country: { meta: { href: `${API}/entity/country/${COUNTRY_UAE_ID}`, type: 'country', mediaType: 'application/json' } },
  city: 'Dubai',
  street: 'Dubai Studio City, Laya Heights, apartment 331',
  addInfo: '',
}

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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

async function exportInvoicePdf(invoiceId) {
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template: {
        meta: {
          href: `${API}/entity/invoiceout/metadata/customtemplate/${RETAIL_TEMPLATE_ID}`,
          type: 'customtemplate',
          mediaType: 'application/json',
        },
      },
      extension: 'pdf',
    }),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  const [wrong, right, so, inv, ship] = await Promise.all([
    api('GET', `/entity/counterparty/${WRONG_CP_ID}`),
    api('GET', `/entity/counterparty/${RIGHT_CP_ID}`),
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
  ])
  const pays = await api(
    'GET',
    `/entity/paymentin?filter=operations=${API}/entity/demand/${DEMAND_ID}&limit=5`,
  ).catch(() => ({ rows: [] }))

  console.log('====================================================================')
  console.log('  Reassign GENCardM2609016564 → Miss Olga (Studio City)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Wrong CP: ${wrong.name} ${wrong.phone} | ${wrong.actualAddress}`)
  console.log(`  Right CP: ${right.name} ${right.phone} | ${right.actualAddress}`)
  console.log(`  SO ${so.name} agent=${so.agent?.meta?.href?.split('/').pop()} ship=${so.shipmentAddress}`)
  console.log(`  INV ${inv.name} ship=${inv.shipmentAddress || 'BLANK'}`)
  console.log(`  SHIP ${ship.name} ship=${ship.shipmentAddress}`)
  console.log(`  Payments: ${(pays.rows || []).map((p) => p.name).join(', ') || 'none'}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await api('PUT', `/entity/counterparty/${RIGHT_CP_ID}`, {
    meta: right.meta,
    email: EMAIL,
  })

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: so.meta,
    agent: href('counterparty', RIGHT_CP_ID),
    shipmentAddressFull: SHIP_FULL,
  })
  await api('PUT', `/entity/invoiceout/${INVOICE_ID}`, {
    meta: inv.meta,
    agent: href('counterparty', RIGHT_CP_ID),
    shipmentAddressFull: SHIP_FULL,
  })
  await api('PUT', `/entity/demand/${DEMAND_ID}`, {
    meta: ship.meta,
    agent: href('counterparty', RIGHT_CP_ID),
    shipmentAddressFull: SHIP_FULL,
  })
  for (const pay of pays.rows || []) {
    await api('PUT', `/entity/paymentin/${pay.id}`, {
      meta: pay.meta,
      agent: href('counterparty', RIGHT_CP_ID),
    })
  }

  const pdf = await exportInvoicePdf(INVOICE_ID)
  const out = path.join(ORDERS_DIR, 'GENOSYS_Olga_Lysenko_05005.pdf')
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  fs.writeFileSync(out, pdf)
  console.log(`  PDF: ${out}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
