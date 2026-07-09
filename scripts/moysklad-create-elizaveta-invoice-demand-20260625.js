#!/usr/bin/env node

/**
 * Elizaveta Nabiieva — existing website order CODM2606256271 → invoice → shipment + PDF.
 *
 *   node --import dotenv/config scripts/moysklad-create-elizaveta-invoice-demand-20260625.js
 *   node --import dotenv/config scripts/moysklad-create-elizaveta-invoice-demand-20260625.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const INVOICE_STATE_ISSUED_ID = 'a9609013-84d0-11ea-0a80-0453000aecd1'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const ORDER_ID = '5a363151-708a-11f1-0a80-1012001a2ce8'
const WEB_ORDER_NUMBER = 'CODM2606256271'
const MARKER = `ELIZAVETA-NABIEVA-${WEB_ORDER_NUMBER}-${uaeToday()}`
const EXPECTED_SUM_MINOR = 108500

async function api(method, pathStr, body) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
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
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
      return text ? JSON.parse(text) : null
    } catch (e) {
      if (attempt === 5) throw e
      await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
    }
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

function orderPositionsPayload(rows) {
  return rows.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: { meta: p.assortment.meta },
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))
}

async function ensureNoExistingDocs() {
  const bySearch = await api(
    'GET',
    `/entity/invoiceout?search=${encodeURIComponent(WEB_ORDER_NUMBER)}&limit=10`
  )
  const activeInv = (bySearch?.rows || []).filter(
    (r) => !r.deleted && (r.description || '').includes(WEB_ORDER_NUMBER)
  )
  if (activeInv.length) {
    throw new Error(
      `Invoice already exists: ${activeInv.map((r) => r.name).join(', ')} — abort to avoid duplicate`
    )
  }
  const byMarker = await api('GET', `/entity/demand?search=${encodeURIComponent(WEB_ORDER_NUMBER)}&limit=10`)
  const activeDem = (byMarker?.rows || []).filter(
    (r) => !r.deleted && (r.description || '').includes(WEB_ORDER_NUMBER)
  )
  if (activeDem.length) {
    throw new Error(
      `Shipment already exists: ${activeDem.map((r) => r.name).join(', ')} — abort to avoid duplicate`
    )
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
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const safe = String(invoiceName || 'invoice').replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ordersDir, `GENOSYS_Elizaveta_Nabiieva_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Elizaveta Nabiieva — invoice → shipment from CODM2606256271')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=agent`)
  console.log(`  Order: ${order.name} | ${money(order.sum)} AED`)
  console.log(`  Agent: ${order.agent?.name}`)

  if (Math.abs(order.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Order sum ${money(order.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)} — fix order first`)
  }

  const orderPos = await fetchAll(
    `/entity/customerorder/${ORDER_ID}/positions?expand=assortment`
  )
  console.log('\n  Lines:')
  for (const p of orderPos) {
    console.log(
      `    ${p.assortment?.code} x${p.quantity} @ ${money(p.price)} disc=${p.discount || 0}`
    )
  }

  await ensureNoExistingDocs()

  const positions = orderPositionsPayload(orderPos)
  const shipmentAddressFull = order.shipmentAddressFull
  const agentId = order.agent.meta.href.split('/').pop()

  if (!COMMIT) {
    console.log(`\n  Would create invoice + shipment for ${money(EXPECTED_SUM_MINOR)} AED`)
    console.log(`  PDF → ~/Desktop/orders/GENOSYS_Elizaveta_Nabiieva_{invoice}.pdf`)
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const t1 = uaeMomentAddMinutes(1)
  const t2 = uaeMomentAddMinutes(3)

  let invoice
  try {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: order.vatEnabled,
      vatIncluded: order.vatIncluded,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agentId),
      customerOrder: href('customerorder', ORDER_ID),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${WEB_ORDER_NUMBER} | ${MARKER} | COD`,
      positions,
    })
  } catch {
    invoice = await api('POST', '/entity/invoiceout', {
      moment: t1,
      applicable: true,
      shared: true,
      vatEnabled: order.vatEnabled,
      vatIncluded: order.vatIncluded,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agentId),
      customerOrder: href('customerorder', ORDER_ID),
      rate: { currency: href('currency', CURRENCY_ID) },
      shipmentAddressFull,
      description: `Invoice for ${WEB_ORDER_NUMBER} | ${MARKER} | COD`,
    })
  }

  await api('PUT', `/entity/invoiceout/${invoice.id}`, {
    meta: invoice.meta,
    state: stateHref('invoiceout', INVOICE_STATE_ISSUED_ID),
  }).catch(() => {})

  invoice = await api('GET', `/entity/invoiceout/${invoice.id}`)
  console.log(`\n  1) Invoice: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)

  const invPos = await fetchAll(`/entity/invoiceout/${invoice.id}/positions`)
  const demandPositions = invPos.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))

  const demand = await api('POST', '/entity/demand', {
    moment: t2,
    applicable: true,
    shared: true,
    vatEnabled: order.vatEnabled,
    vatIncluded: order.vatIncluded,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agentId),
    store: href('store', STORE_ID),
    customerOrder: href('customerorder', ORDER_ID),
    invoicesOut: [href('invoiceout', invoice.id)],
    state: stateHref('demand', DEMAND_STATE_SHIPPED_ID),
    shipmentAddressFull,
    description: `Shipment for ${invoice.name} / ${WEB_ORDER_NUMBER} | ${MARKER} | COD`,
    positions: demandPositions,
  })
  console.log(`  2) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  if (Math.abs(invoice.sum - EXPECTED_SUM_MINOR) > 1 || Math.abs(demand.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(
      `Sum mismatch — invoice ${money(invoice.sum)} / shipment ${money(demand.sum)} vs ${money(EXPECTED_SUM_MINOR)}`
    )
  }

  console.log('\n  Exporting invoice PDF...')
  const pdfPath = await exportInvoicePdf(invoice.id, invoice.name)
  if (pdfPath) {
    console.log(`    Saved: ${pdfPath}`)
  } else {
    console.warn('  MoySklad returned no PDF — export manually from UI.')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
