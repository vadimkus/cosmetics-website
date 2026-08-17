#!/usr/bin/env node

/**
 * CEIA CLINIC GENCardM260813CEIA / inv 04927 — replace 54459 with 00034
 * (Multi Functional Anti-Wrinkle Cream 250g), then post shipment + Legal_TAX PDF.
 *
 *   node --import dotenv/config scripts/moysklad-amend-ceia-clinic-00034-ship-20260813.js
 *   node --import dotenv/config scripts/moysklad-amend-ceia-clinic-00034-ship-20260813.js --commit
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

const { uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORDER_ID = '9d5de526-96fe-11f1-0a80-134b00249fb7'
const INVOICE_ID = '9db35090-96fe-11f1-0a80-0b8e002473fc'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = 'd7af76af-8cc5-11f1-0a80-08f4001604b7'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'

const FROM_CODE = '54459'
const TO_CODE = '00034'
const QTY = 1
const PRICE_MINOR = 21000
const EXPECTED_SUM_MINOR = 72500

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

async function fetchProduct(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
  }
}

async function swapLine(entityType, entityId, toProduct) {
  const positions = await fetchAll(`/entity/${entityType}/${entityId}/positions?expand=assortment`)
  const hasTo = positions.find((p) => p.assortment?.code === TO_CODE)
  const fromPos = positions.find((p) => p.assortment?.code === FROM_CODE)
  if (hasTo && !fromPos) {
    console.log(`  ${entityType}: already ${TO_CODE} — skip`)
    return
  }
  if (!fromPos) throw new Error(`${entityType}: ${FROM_CODE} not found`)
  console.log(`  ${entityType}: ${FROM_CODE} → ${TO_CODE} x${QTY} @ ${money(PRICE_MINOR)}`)
  if (!COMMIT) return
  await api('DELETE', `/entity/${entityType}/${entityId}/positions/${fromPos.id}`)
  await api('POST', `/entity/${entityType}/${entityId}/positions`, {
    quantity: QTY,
    price: PRICE_MINOR,
    discount: 0,
    assortment: href('product', toProduct.id),
    vat: 5,
    vatEnabled: true,
  })
}

async function exportInvoicePdf(invoiceId, invoiceName) {
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
    throw new Error(`Invoice export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const out = path.join(ORDERS_DIR, `GENOSYS_CEIA_Clinic_${safe}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  CEIA CLINIC — swap 54459 → 00034, then ship')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const toProduct = await fetchProduct(TO_CODE)
  console.log(`  ${TO_CODE} ${toProduct.name} avail ${toProduct.available}`)
  if (toProduct.available < QTY) throw new Error(`Insufficient ${TO_CODE}`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const invoice = await api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=demands`)
  console.log(`  SO ${order.name} ${money(order.sum)}`)
  console.log(`  INV ${invoice.name} ${money(invoice.sum)} demands ${(invoice.demands || []).length}`)
  if ((invoice.demands || []).length) throw new Error('Invoice already has a shipment')

  await swapLine('customerorder', ORDER_ID, toProduct)
  await swapLine('invoiceout', INVOICE_ID, toProduct)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const soAfter = await api('GET', `/entity/customerorder/${ORDER_ID}`)
  const invAfter = await api('GET', `/entity/invoiceout/${INVOICE_ID}`)
  if (soAfter.sum !== EXPECTED_SUM_MINOR || invAfter.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum mismatch SO ${money(soAfter.sum)} INV ${money(invAfter.sum)}`)
  }

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: soAfter.meta,
    description: [
      soAfter.description || '',
      'Amended: 00034 Multi Functional Anti-Wrinkle Cream 250g x1 @210 instead of 54459.',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const invPos = await fetchAll(`/entity/invoiceout/${INVOICE_ID}/positions`)
  const demandPositions = invPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentAddMinutes(3),
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    invoicesOut: [href('invoiceout', INVOICE_ID)],
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    shipmentAddressFull: invoice.shipmentAddressFull || order.shipmentAddressFull,
    description: `Shipment from invoice ${invoice.name} / ${order.name} | 00034 Anti-Wrinkle Cream 250g + 00050 Scalp Peeling + 00048 Hair Solution Pro`,
    positions: demandPositions,
  })
  if (demand.customerOrder) throw new Error('Demand has customerOrder — recreate invoice-only')
  console.log(`  SHIP ${demand.name} ${money(demand.sum)}`)

  const pdfPath = await exportInvoicePdf(INVOICE_ID, invoice.name)
  console.log(`  PDF: ${pdfPath}`)
  console.log(`  Order:    https://online.moysklad.ru/app/#customerorder/edit?id=${ORDER_ID}`)
  console.log(`  Invoice:  https://online.moysklad.ru/app/#invoiceout/edit?id=${INVOICE_ID}`)
  console.log(`  Shipment: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
