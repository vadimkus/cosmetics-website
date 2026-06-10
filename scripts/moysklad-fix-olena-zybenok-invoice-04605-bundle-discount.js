#!/usr/bin/env node

/**
 * Olena Zybenok — invoice **04605** was created from bundle order **GENCardW2606021798**
 * without line discounts (1,312.00 vs order 1,049.60 AED).
 *
 * Copies price + discount from each customer-order line to the matching invoice line
 * (match by assortment product id + quantity).
 *
 *   node --import dotenv/config scripts/moysklad-fix-olena-zybenok-invoice-04605-bundle-discount.js
 *   node --import dotenv/config scripts/moysklad-fix-olena-zybenok-invoice-04605-bundle-discount.js --commit
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

const ORDER_NAME = 'GENCardW2606021798'
const INVOICE_NAME = '04605'

/** Fallback IDs if name lookup fails */
const ORDER_ID = '33c36766-5ef3-11f1-0a80-132d0008eb59'
const INVOICE_ID = '869c8c7a-5ef4-11f1-0a80-148200092d9f'

const EXPECTED_ORDER_SUM_MINOR = 104960
const EXPECTED_INVOICE_SUM_MINOR = 104960

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

function lineTotalMinor(p) {
  return Math.round((p.price || 0) * (p.quantity || 0) * (1 - (p.discount || 0) / 100))
}

async function resolveDoc(type, name, fallbackId) {
  const filter = encodeURIComponent(`name=${name}`)
  const list = await api('GET', `/entity/${type}?filter=${filter}&limit=5`)
  const hit = list.rows?.find(r => r.name === name) || list.rows?.[0]
  if (hit) return hit
  return api('GET', `/entity/${type}/${fallbackId}`)
}

async function getPositions(type, id) {
  const data = await api('GET', `/entity/${type}/${id}/positions?expand=assortment&limit=100`)
  return data.rows || []
}

async function main() {
  const order = await resolveDoc('customerorder', ORDER_NAME, ORDER_ID)
  const invoice = await resolveDoc('invoiceout', INVOICE_NAME, INVOICE_ID)

  console.log(`Order:   ${order.name} | ${money(order.sum)} AED | id=${order.id}`)
  console.log(`Invoice: ${invoice.name} | ${money(invoice.sum)} AED | id=${invoice.id}`)
  console.log()

  const orderRows = await getPositions('customerorder', order.id)
  const invoiceRows = await getPositions('invoiceout', invoice.id)

  if (orderRows.length !== invoiceRows.length) {
    console.warn(`WARN: line count order=${orderRows.length} invoice=${invoiceRows.length}`)
  }

  const updates = []

  for (let i = 0; i < invoiceRows.length; i++) {
    const invPos = invoiceRows[i]
    const orderPos = orderRows[i]
    const name = invPos.assortment?.name || invPos.assortment?.code || invPos.id
    if (!orderPos) {
      throw new Error(`No matching order line at index ${i} for invoice line: ${name}`)
    }

    const targetPrice = orderPos.price
    const targetDiscount = orderPos.discount || 0
    const changed =
      invPos.price !== targetPrice || (invPos.discount || 0) !== targetDiscount

    console.log(`${changed ? '>>>' : '   '} ${name}`)
    console.log(
      `    invoice: q=${invPos.quantity} @${money(invPos.price)} disc=${invPos.discount || 0}% => ${money(lineTotalMinor(invPos))}`
    )
    console.log(
      `    order:   q=${orderPos.quantity} @${money(orderPos.price)} disc=${targetDiscount}% => ${money(lineTotalMinor(orderPos))}`
    )
    if (changed) {
      updates.push({ invPos, orderPos, name, targetPrice, targetDiscount })
    }
  }

  let projectedMinor = 0
  for (const invPos of invoiceRows) {
    const u = updates.find(x => x.invPos.id === invPos.id)
    if (u) {
      projectedMinor += lineTotalMinor({
        price: u.targetPrice,
        quantity: invPos.quantity,
        discount: u.targetDiscount,
      })
    } else {
      projectedMinor += lineTotalMinor(invPos)
    }
  }

  console.log()
  console.log(`Invoice sum now:     ${money(invoice.sum)} AED`)
  console.log(`Order sum (target):  ${money(order.sum)} AED`)
  console.log(`Projected after fix: ${money(projectedMinor)} AED`)
  console.log(`Lines to update:     ${updates.length}`)

  if (updates.length === 0) {
    console.log('\nNothing to change — invoice already matches order.')
    return
  }

  if (projectedMinor !== EXPECTED_INVOICE_SUM_MINOR) {
    console.warn(
      `\nWARN: projected ${money(projectedMinor)} != expected ${money(EXPECTED_INVOICE_SUM_MINOR)} — review before commit.`
    )
  }

  if (!COMMIT) {
    console.log('\nDRY RUN. Re-run with --commit to apply.')
    return
  }

  for (const u of updates) {
    const { invPos, targetPrice, targetDiscount } = u
    await api('PUT', `/entity/invoiceout/${invoice.id}/positions/${invPos.id}`, {
      meta: invPos.meta,
      assortment: { meta: invPos.assortment.meta },
      quantity: invPos.quantity,
      price: targetPrice,
      discount: targetDiscount,
      vat: invPos.vat,
      vatEnabled: invPos.vatEnabled,
    })
    console.log(`  PUT ${u.name} → disc ${targetDiscount}% @ ${money(targetPrice)}`)
  }

  const invoice2 = await api('GET', `/entity/invoiceout/${invoice.id}`)
  const order2 = await api('GET', `/entity/customerorder/${order.id}`)
  console.log()
  console.log(`Done. Invoice: ${money(invoice2.sum)} AED | Order: ${money(order2.sum)} AED`)
  console.log(`Delta: ${((invoice2.sum - order2.sum) / 100).toFixed(2)} AED`)
  console.log(`UI: https://online.moysklad.ru/app/#invoiceout/edit?id=${invoice.id}`)
}

main().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
