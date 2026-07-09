#!/usr/bin/env node

/**
 * Sara GENCardM2606225559 — align invoice 04712 / shipment 06401 / payment 05808 with order (1,205 AED).
 * Adds missing 54475 PDRN Homecare line + backdated stock receive + payment linkedSum.
 *
 *   node --import dotenv/config scripts/moysklad-fix-sara-invoice-demand-payment-54475-20260622.js
 *   node --import dotenv/config scripts/moysklad-fix-sara-invoice-demand-payment-54475-20260622.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const DOCS = {
  orderId: '1ad4a2e7-6e3d-11f1-0a80-1767008667c0',
  invoiceId: '1b1c9615-6e3d-11f1-0a80-086500850076',
  demandId: '1bb36b82-6e3d-11f1-0a80-0bf30084416b',
  paymentId: '1c121593-6e3d-11f1-0a80-05fb0086cc78',
}

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const PO_ID = 'dd395756-6ae8-11f1-0a80-03670038bbd3'
const SUPPLIER_ID = '3a0a3f28-33cf-11ea-0a80-043f000b9859'

const PRODUCT_ID = '3706b193-6ae8-11f1-0a80-16e5003a85d3' // 54475
const PRODUCT_CODE = '54475'
const BUY_PRICE_MINOR = 3415
const QTY = 1
const PRICE_MINOR = 30000
const EXPECTED_SUM_MINOR = 120500
const STOCK_ENTER_MOMENT = '2026-06-22 16:15:00' // before demand 06401 @ 16:20

const UNMAPPED_RE =
  /\s*\|\s*Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000/gi

function cleanDesc(text) {
  return (text || '')
    .replace(UNMAPPED_RE, '')
    .replace(/Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000\s*\|\s*/gi, '')
    .replace(/Unmapped items: Bio-Meso PDRN Homecare Ampoule 5000/gi, '')
    .trim()
}

async function api(method, pathStr, body) {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchPositions(entityType, entityId) {
  const data = await api(
    'GET',
    `/entity/${entityType}/${entityId}/positions?expand=assortment&limit=50`
  )
  return data.rows || []
}

async function ensureStockBeforeDemand(demandMoment) {
  const enterMarker = `SARA-54475-STOCK-${DOCS.demandId.slice(0, 8)}`
  const filter = [
    `store=${API}/entity/store/${STORE_ID}`,
    `moment>=2026-06-22 00:00:00`,
    `moment<=2026-06-22 23:59:59`,
  ].join(';')
  const enters = await api('GET', `/entity/enter?filter=${encodeURIComponent(filter)}&limit=100`)
  const existing = (enters.rows || []).find((e) => (e.description || '').includes(enterMarker))
  if (existing) {
    console.log(`    stock enter exists: ${existing.name}`)
    return
  }

  const moment = STOCK_ENTER_MOMENT
  console.log(`    stock enter ${PRODUCT_CODE} x${QTY} @ ${moment} (demand was ${demandMoment})`)
  if (COMMIT) {
    await api('POST', '/entity/enter', {
      moment,
      applicable: true,
      organization: href('organization', ORG_ID),
      store: href('store', STORE_ID),
      description: `${enterMarker} | 54475 before Sara shipment 06401 / Korea PO DM GME 260616`,
      positions: [
        {
          quantity: QTY,
          price: BUY_PRICE_MINOR,
          assortment: href('product', PRODUCT_ID),
        },
      ],
    })
  }
}

async function add54475IfMissing(docLabel, entityType, entityId, rows) {
  if (rows.some((p) => p.assortment?.code === PRODUCT_CODE)) {
    console.log(`    ${docLabel}: ${PRODUCT_CODE} already present`)
    return false
  }
  console.log(`    ${docLabel}: add ${PRODUCT_CODE} x${QTY} @ ${money(PRICE_MINOR)} AED`)
  if (COMMIT) {
    await api('POST', `/entity/${entityType}/${entityId}/positions`, {
      quantity: QTY,
      price: PRICE_MINOR,
      assortment: href('product', PRODUCT_ID),
      vat: 5,
      vatEnabled: true,
    })
  }
  return true
}

async function main() {
  console.log('====================================================================')
  console.log('  Sara — invoice / shipment / payment → 1,205 AED')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand, payment] = await Promise.all([
    api('GET', `/entity/customerorder/${DOCS.orderId}`),
    api('GET', `/entity/invoiceout/${DOCS.invoiceId}`),
    api('GET', `/entity/demand/${DOCS.demandId}`),
    api('GET', `/entity/paymentin/${DOCS.paymentId}`),
  ])

  console.log(`  Order   : ${order.name} | ${money(order.sum)} AED`)
  console.log(`  Invoice : ${invoice.name} | ${money(invoice.sum)} AED | paid ${money(invoice.payedSum)}`)
  console.log(`  Shipment: ${demand.name} | ${money(demand.sum)} AED | paid ${money(demand.payedSum)}`)
  console.log(`  Payment : ${payment.name} | ${money(payment.sum)} AED`)

  const [invoiceRows, demandRows] = await Promise.all([
    fetchPositions('invoiceout', DOCS.invoiceId),
    fetchPositions('demand', DOCS.demandId),
  ])

  const needsDemandLine = !demandRows.some((p) => p.assortment?.code === PRODUCT_CODE)
  if (needsDemandLine) {
    console.log('\n  Stock prep (54475 had 0 on hand — Korea PO not received):')
    await ensureStockBeforeDemand(demand.moment)
  }

  console.log('\n  Line updates:')
  await add54475IfMissing('invoice', 'invoiceout', DOCS.invoiceId, invoiceRows)
  await add54475IfMissing('shipment', 'demand', DOCS.demandId, demandRows)

  console.log('\n  Payment update:')
  console.log(`    ${payment.name}: ${money(payment.sum)} → ${money(EXPECTED_SUM_MINOR)} AED`)

  if (!COMMIT) {
    console.log(`\n  Expected totals: ${money(EXPECTED_SUM_MINOR)} AED on all docs`)
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  await api('PUT', `/entity/invoiceout/${DOCS.invoiceId}`, {
    meta: invoice.meta,
    description: cleanDesc(invoice.description),
  })
  await api('PUT', `/entity/demand/${DOCS.demandId}`, {
    meta: demand.meta,
    description: cleanDesc(demand.description),
  })

  if (payment.sum !== EXPECTED_SUM_MINOR) {
    await api('PUT', `/entity/paymentin/${DOCS.paymentId}`, {
      meta: payment.meta,
      sum: EXPECTED_SUM_MINOR,
      description: cleanDesc(payment.description),
      operations: [
        {
          meta: {
            href: `${API}/entity/demand/${DOCS.demandId}`,
            type: 'demand',
            mediaType: 'application/json',
          },
          linkedSum: EXPECTED_SUM_MINOR,
        },
      ],
    })
  }

  const [orderAfter, invoiceAfter, demandAfter, paymentAfter] = await Promise.all([
    api('GET', `/entity/customerorder/${DOCS.orderId}`),
    api('GET', `/entity/invoiceout/${DOCS.invoiceId}`),
    api('GET', `/entity/demand/${DOCS.demandId}`),
    api('GET', `/entity/paymentin/${DOCS.paymentId}`),
  ])

  console.log('\n  After:')
  console.log(`  Order   : ${money(orderAfter.sum)} AED`)
  console.log(`  Invoice : ${money(invoiceAfter.sum)} AED | paid ${money(invoiceAfter.payedSum)}`)
  console.log(`  Shipment: ${money(demandAfter.sum)} AED | paid ${money(demandAfter.payedSum)}`)
  console.log(`  Payment : ${money(paymentAfter.sum)} AED`)

  for (const [label, doc] of [
    ['order', orderAfter],
    ['invoice', invoiceAfter],
    ['demand', demandAfter],
    ['payment', paymentAfter],
  ]) {
    if (Math.abs(doc.sum - EXPECTED_SUM_MINOR) > 1) {
      throw new Error(`${label} sum mismatch: ${money(doc.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
    }
  }
  if (Math.abs(invoiceAfter.payedSum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Invoice payedSum mismatch: ${money(invoiceAfter.payedSum)}`)
  }
  if (Math.abs(demandAfter.payedSum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Demand payedSum mismatch: ${money(demandAfter.payedSum)}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
