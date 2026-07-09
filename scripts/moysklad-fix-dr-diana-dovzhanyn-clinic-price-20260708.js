#!/usr/bin/env node

/**
 * Dr. Diana Dovzhanyn — fix GENCardM2607082397 from retail to clinic list.
 *   00024 Snow O₂ Cleanser 500ml: 510 → 255 (MoySklad salePrice)
 *   Delivery 45 unchanged
 *   Total: 555 → 300 AED; paymentin adjusted
 *
 *   node --import dotenv/config scripts/moysklad-fix-dr-diana-dovzhanyn-clinic-price-20260708.js
 *   node --import dotenv/config scripts/moysklad-fix-dr-diana-dovzhanyn-clinic-price-20260708.js --commit
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

const ORDER_ID = '4aa9824c-7ac0-11f1-0a80-153f001a7576'
const INVOICE_ID = '4afb6bfe-7ac0-11f1-0a80-078b0019c9d8'
const DEMAND_ID = '4bb000e0-7ac0-11f1-0a80-0da50019e526'
const PAYMENT_ID = '4bf6afec-7ac0-11f1-0a80-04c0001964a1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const CLEANSER_CODE = '00024'
const OLD_CLEANSER_MINOR = 51000
const NEW_CLEANSER_MINOR = 25500
const EXPECTED_SUM_MINOR = 30000

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

function positionPayload(p, priceMinor) {
  return {
    quantity: p.quantity,
    price: priceMinor ?? p.price,
    discount: p.discount || 0,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
    assortment: p.assortment,
  }
}

function findCleanserPosition(rows) {
  return rows.find((p) => p.assortment?.code === CLEANSER_CODE)
}

async function patchDoc(entityType, docId, label) {
  const rows = await fetchAll(`/entity/${entityType}/${docId}/positions?expand=assortment`)
  const pos = findCleanserPosition(rows)
  if (!pos) throw new Error(`${label}: cleanser line not found`)
  if (pos.price === NEW_CLEANSER_MINOR) {
    console.log(`  ${label}: cleanser already ${money(NEW_CLEANSER_MINOR)} AED`)
    return
  }
  if (pos.price !== OLD_CLEANSER_MINOR) {
    throw new Error(`${label}: unexpected cleanser price ${money(pos.price)}`)
  }
  console.log(`  ${label}: cleanser ${money(pos.price)} → ${money(NEW_CLEANSER_MINOR)} AED`)
  if (COMMIT) {
    await api('PUT', `/entity/${entityType}/${docId}/positions/${pos.id}`, positionPayload(pos, NEW_CLEANSER_MINOR))
  }
}

async function exportInvoicePdf(invoiceId, invoiceName) {
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
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const safe = String(invoiceName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ordersDir, `GENOSYS_Dr_Diana_Dovzhanyn_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Dr. Diana Dovzhanyn — retail → clinic price fix')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  00024: ${money(OLD_CLEANSER_MINOR)} → ${money(NEW_CLEANSER_MINOR)} | total ${money(EXPECTED_SUM_MINOR)} AED`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const invoice = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const payment = await api('GET', `/entity/paymentin/${PAYMENT_ID}?expand=operations`)

  console.log(`\n  Before:`)
  console.log(`    Order ${order.name}: ${money(order.sum)}`)
  console.log(`    Invoice ${invoice.name}: ${money(invoice.sum)} | payed ${money(invoice.payedSum)}`)
  console.log(`    Shipment ${demand.name}: ${money(demand.sum)} | payed ${money(demand.payedSum)}`)
  console.log(`    Payment ${payment.name}: ${money(payment.sum)} | linked ${money(payment.operations?.[0]?.linkedSum)}`)

  await patchDoc('customerorder', ORDER_ID, 'Order')
  await patchDoc('invoiceout', INVOICE_ID, 'Invoice')
  await patchDoc('demand', DEMAND_ID, 'Shipment')

  if (COMMIT) {
    const pay = await api('GET', `/entity/paymentin/${PAYMENT_ID}?expand=operations`)
    await api('PUT', `/entity/paymentin/${PAYMENT_ID}`, {
      meta: pay.meta,
      sum: EXPECTED_SUM_MINOR,
      operations: [
        {
          meta: pay.operations[0].meta,
          linkedSum: EXPECTED_SUM_MINOR,
        },
      ],
    })
  } else {
    console.log(`  Payment: ${money(payment.sum)} → ${money(EXPECTED_SUM_MINOR)} AED`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const order2 = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const invoice2 = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  const demand2 = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const payment2 = await api('GET', `/entity/paymentin/${PAYMENT_ID}?expand=operations`)

  console.log(`\n  After:`)
  console.log(`    Order ${order2.name}: ${money(order2.sum)}`)
  console.log(`    Invoice ${invoice2.name}: ${money(invoice2.sum)} | payed ${money(invoice2.payedSum)}`)
  console.log(`    Shipment ${demand2.name}: ${money(demand2.sum)} | payed ${money(demand2.payedSum)}`)
  console.log(`    Payment ${payment2.name}: ${money(payment2.sum)} | linked ${money(payment2.operations?.[0]?.linkedSum)}`)

  if (order2.sum !== EXPECTED_SUM_MINOR || invoice2.sum !== EXPECTED_SUM_MINOR || demand2.sum !== EXPECTED_SUM_MINOR) {
    throw new Error('Sum mismatch after fix')
  }
  if (demand2.payedSum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Shipment not fully paid: ${money(demand2.payedSum)}`)
  }

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice2.name)
  if (pdfPath) console.log(`\n  PDF re-exported: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
