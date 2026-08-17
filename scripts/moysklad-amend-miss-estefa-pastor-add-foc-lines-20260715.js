#!/usr/bin/env node

/**
 * Miss Estefa Pastor — add FOC lines to existing website order GENCardM2607155574
 * (invoice 04822 / shipment 06545), then remove mistaken separate FOC chain
 * GENCardM2607156917 / 04823 / 06546.
 *
 *   54475 BIO-MESO PDRN Homecare Ampoule 5000 ×1 @ 150 clinic, 100% discount
 *   00063 Intensive Repair Collagen Mask 23g ×5 @ 18 clinic, 100% discount
 *   Paid total unchanged: 320.00 AED
 *
 *   node --import dotenv/config scripts/moysklad-amend-miss-estefa-pastor-add-foc-lines-20260715.js
 *   node --import dotenv/config scripts/moysklad-amend-miss-estefa-pastor-add-foc-lines-20260715.js --commit
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

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORDER_ID = '2e351945-801c-11f1-0a80-1c840036dd67' // GENCardM2607155574
const INVOICE_ID = '2e70c9fd-801c-11f1-0a80-0b9900361ef0' // 04822
const DEMAND_ID = '2ee5ca08-801c-11f1-0a80-0c9c0037cc3b' // 06545
const PAYMENT_ID = '2f2b37b3-801c-11f1-0a80-19b6003738aa' // 05941

const WRONG_ORDER_ID = 'b99370bb-801c-11f1-0a80-0dbf00369e36' // GENCardM2607156917
const WRONG_INVOICE_ID = 'b9cfaa5f-801c-11f1-0a80-0b9900364fc7' // 04823
const WRONG_DEMAND_ID = 'bb28687e-801c-11f1-0a80-02830035ce18' // 06546

const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'
const EXPECTED_SUM_MINOR = 32000
const MARKER = `MISS-ESTEFA-FOC-PDRN-COLLAGEN-${uaeToday()}`

/** [code, productId, qty, retailAed, discountPct] */
const ADD_LINES = [
  ['54475', '3706b193-6ae8-11f1-0a80-16e5003a85d3', 1, 150, 100],
  ['00063', '51e74608-45cb-11ea-0a80-01f80015bea2', 5, 18, 100],
]

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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function lineCode(pos) {
  return pos.assortment?.code || ''
}

function buildAddPayload([code, productId, qty, retailAed, discountPct]) {
  return {
    quantity: qty,
    price: Math.round(retailAed * 100),
    discount: discountPct,
    assortment: href('product', productId),
    vat: 5,
    vatEnabled: true,
  }
}

async function addMissingLines(entityType, docId, label) {
  const rows = await fetchAll(`/entity/${entityType}/${docId}/positions?expand=assortment`)
  const codes = new Set(rows.map((p) => lineCode(p)))
  for (const line of ADD_LINES) {
    const [code] = line
    if (codes.has(code)) {
      const existing = rows.find((p) => lineCode(p) === code)
      if (existing?.discount === 100) {
        console.log(`  ${label}: ${code} already present @ 100% off — skip`)
        continue
      }
      throw new Error(`${label}: ${code} present but not 100% off — manual review`)
    }
    const payload = buildAddPayload(line)
    console.log(
      `  ${label}: + ${code} x${payload.quantity} @ ${money(payload.price)} AED, ${payload.discount}% off`
    )
    if (COMMIT) await api('POST', `/entity/${entityType}/${docId}/positions`, payload)
  }
}

async function deleteWrongChain() {
  console.log('\n  Removing mistaken separate FOC chain:')
  for (const [label, type, id] of [
    ['Shipment 06546', 'demand', WRONG_DEMAND_ID],
    ['Invoice 04823', 'invoiceout', WRONG_INVOICE_ID],
    ['Order GENCardM2607156917', 'customerorder', WRONG_ORDER_ID],
  ]) {
    try {
      const doc = await api('GET', `/entity/${type}/${id}`)
      console.log(`    delete ${label} (${doc.name}, ${money(doc.sum)} AED)`)
      if (COMMIT) await api('DELETE', `/entity/${type}/${id}`)
    } catch (e) {
      if (e.message.includes('HTTP 404')) {
        console.log(`    ${label} already gone`)
      } else {
        throw e
      }
    }
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
  const outPath = path.join(ordersDir, `GENOSYS_Miss_Estefa_Pastor_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Estefa Pastor — amend GENCardM2607155574 + remove duplicate')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand, payment] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
    api('GET', `/entity/paymentin/${PAYMENT_ID}?expand=operations`),
  ])

  console.log(`\n  Target order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  Invoice ${invoice.name} | Shipment ${demand.name} | Payment ${payment.name}`)

  console.log('\n  Add FOC lines to SO / invoice / shipment:')
  await addMissingLines('customerorder', ORDER_ID, 'Order')
  await addMissingLines('invoiceout', INVOICE_ID, 'Invoice')
  await addMissingLines('demand', DEMAND_ID, 'Shipment')

  if (!COMMIT) {
    console.log(`\n  Expected paid total unchanged: ${money(EXPECTED_SUM_MINOR)} AED`)
    console.log('  Will delete duplicate chain GENCardM2607156917 / 04823 / 06546')
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const orderMeta = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: orderMeta.meta,
    description: [orderMeta.description || '', MARKER, '54475 PDRN Homecare 5000 x1 FOC; 00063 collagen mask x5 FOC.'].join(
      ' | '
    ),
  })

  await deleteWrongChain()

  const [order2, invoice2, demand2, payment2] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}`),
    api('GET', `/entity/paymentin/${PAYMENT_ID}?expand=operations`),
  ])

  console.log(`\n  After amend:`)
  console.log(`    Order ${order2.name}: ${money(order2.sum)} AED`)
  console.log(`    Invoice ${invoice2.name}: ${money(invoice2.sum)} | payed ${money(invoice2.payedSum)}`)
  console.log(`    Shipment ${demand2.name}: ${money(demand2.sum)} | payed ${money(demand2.payedSum)}`)
  console.log(`    Payment ${payment2.name}: ${money(payment2.sum)} | linked ${money(payment2.operations?.[0]?.linkedSum)}`)

  if (order2.sum !== EXPECTED_SUM_MINOR || invoice2.sum !== EXPECTED_SUM_MINOR || demand2.sum !== EXPECTED_SUM_MINOR) {
    throw new Error('Sum mismatch — paid total should remain 320.00 AED')
  }
  if (demand2.payedSum !== EXPECTED_SUM_MINOR || payment2.sum !== EXPECTED_SUM_MINOR) {
    throw new Error('Payment linkage mismatch')
  }

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice2.name)
  if (pdfPath) console.log(`\n  PDF: ${pdfPath}`)

  console.log(`\n  https://online.moysklad.ru/app/#customerorder/edit?id=${ORDER_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
