#!/usr/bin/env node

/**
 * Family Class Polyclinic GENCardM260622FCPH — set all line qty to 1.
 * Order / invoice 04708 / shipment 06397: 1,705 → 875 AED.
 *
 *   node --import dotenv/config scripts/moysklad-fix-family-class-polyclinic-hair-qty1-20260622.js
 *   node --import dotenv/config scripts/moysklad-fix-family-class-polyclinic-hair-qty1-20260622.js --commit
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
  orderId: 'ed51f0f4-6e0a-11f1-0a80-16ec0078962e',
  invoiceId: 'ee151bc9-6e0a-11f1-0a80-1d59007b283f',
  demandId: 'ef5004f7-6e0a-11f1-0a80-00ad00781b28',
}

const TARGET_QTY = 1
const EXPECTED_SUM_MINOR = 87500

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

async function setProductQtyToOne(docLabel, pathPrefix, rows) {
  let changed = 0
  for (const p of rows) {
    const type = p.assortment?.meta?.type
    if (type === 'service') {
      console.log(`    skip service ${p.assortment?.name || 'delivery'} qty=${p.quantity}`)
      continue
    }
    if (type !== 'product') continue
    const code = p.assortment?.code || '?'
    if (p.quantity === TARGET_QTY) {
      console.log(`    ${docLabel} ${code} already qty ${TARGET_QTY}`)
      continue
    }
    console.log(`    ${docLabel} ${code} ${p.quantity} → ${TARGET_QTY}`)
    if (COMMIT) {
      await api('PUT', `${pathPrefix}/${p.id}`, {
        meta: p.meta,
        assortment: { meta: p.assortment.meta },
        quantity: TARGET_QTY,
        price: p.price,
        discount: p.discount || 0,
        vat: p.vat,
        vatEnabled: p.vatEnabled,
      })
    }
    changed++
  }
  return changed
}

async function main() {
  console.log('====================================================================')
  console.log('  Family Class Polyclinic — qty all products → 1')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand] = await Promise.all([
    api('GET', `/entity/customerorder/${DOCS.orderId}`),
    api('GET', `/entity/invoiceout/${DOCS.invoiceId}`),
    api('GET', `/entity/demand/${DOCS.demandId}`),
  ])
  console.log(`  Order   : ${order.name} | ${money(order.sum)} AED`)
  console.log(`  Invoice : ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`  Shipment: ${demand.name} | ${money(demand.sum)} AED`)

  const [orderRows, invoiceRows, demandRows] = await Promise.all([
    fetchPositions('customerorder', DOCS.orderId),
    fetchPositions('invoiceout', DOCS.invoiceId),
    fetchPositions('demand', DOCS.demandId),
  ])

  console.log('\n  Updates:')
  await setProductQtyToOne('order', `/entity/customerorder/${DOCS.orderId}/positions`, orderRows)
  await setProductQtyToOne('invoice', `/entity/invoiceout/${DOCS.invoiceId}/positions`, invoiceRows)
  await setProductQtyToOne('demand', `/entity/demand/${DOCS.demandId}/positions`, demandRows)

  if (!COMMIT) {
    console.log(`\n  Expected total after fix: ${money(EXPECTED_SUM_MINOR)} AED`)
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  const [orderAfter, invoiceAfter, demandAfter] = await Promise.all([
    api('GET', `/entity/customerorder/${DOCS.orderId}`),
    api('GET', `/entity/invoiceout/${DOCS.invoiceId}`),
    api('GET', `/entity/demand/${DOCS.demandId}`),
  ])
  console.log(`\n  After:`)
  console.log(`  Order   : ${money(orderAfter.sum)} AED`)
  console.log(`  Invoice : ${money(invoiceAfter.sum)} AED`)
  console.log(`  Shipment: ${money(demandAfter.sum)} AED`)

  if (Math.abs(orderAfter.sum - EXPECTED_SUM_MINOR) > 1) {
    throw new Error(`Order sum mismatch: ${money(orderAfter.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
