#!/usr/bin/env node

/**
 * Korea PO DM GME 260616 ship — supplier invoicein + paymentout @ supply 00187.
 * Aligns PO columns: Выставлено счетов + Оплачено = 55,453.23 AED.
 *
 *   node --import dotenv/config scripts/moysklad-create-po-dm-gme-260616-ship-invoice-payment-20260703.js
 *   node --import dotenv/config scripts/moysklad-create-po-dm-gme-260616-ship-invoice-payment-20260703.js --commit
 */

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

const PO_ID = '5f77462f-6ed1-11f1-0a80-076300a0934e'
const PO_NAME = 'DM GME 260616 ship'
const SUPPLY_ID = '098def25-76ca-11f1-0a80-04b6001751a4'
const SUPPLY_NAME = '00187'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const SUPPLIER_ID = '3a0a3f28-33cf-11ea-0a80-043f000b9859'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const EXPENSE_ITEM_ID = '8dcf5b24-0a01-11e4-bb69-002590a32f46' // Закупка товаров
const PAYMENT_STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'
const EXPECTED_SUM_MINOR = 5545323
const MARKER = `KOREA-INVOICE-PAY-DM-GME-260616-SHIP-${uaeToday()}`

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

function dmyFromMoment(moment) {
  const [y, m, d] = moment.slice(0, 10).split('-')
  return `${d}.${m}.${y}`
}

async function loadSupplyPositions() {
  const rows = await fetchAll(`/entity/supply/${SUPPLY_ID}/positions?expand=assortment`)
  return rows.map((p) => ({
    quantity: p.quantity,
    price: p.price,
    assortment: { meta: p.assortment.meta },
    vat: p.vat ?? 0,
    vatEnabled: p.vatEnabled ?? false,
  }))
}

async function main() {
  console.log('====================================================================')
  console.log('  Korea PO — invoicein + paymentout @ supply 00187')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [po, supply] = await Promise.all([
    api('GET', `/entity/purchaseorder/${PO_ID}?expand=agent`),
    api('GET', `/entity/supply/${SUPPLY_ID}?expand=agent,purchaseOrder`),
  ])

  console.log(`\n  PO ${po.name}: sum ${money(po.sum)} | invoiced ${money(po.invoicedSum)} | paid ${money(po.payedSum)} | received ${money(po.shippedSum)}`)
  console.log(`  Supply ${supply.name}: sum ${money(supply.sum)} | paid ${money(supply.payedSum)}`)

  if (po.name !== PO_NAME) throw new Error(`PO name mismatch: ${po.name}`)
  if (supply.name !== SUPPLY_NAME) throw new Error(`Supply name mismatch: ${supply.name}`)
  if (supply.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Supply sum ${money(supply.sum)} != ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (po.shippedSum !== EXPECTED_SUM_MINOR) {
    throw new Error(`PO not fully received: ${money(po.shippedSum)}`)
  }

  if (po.invoicedSum >= EXPECTED_SUM_MINOR && po.payedSum >= EXPECTED_SUM_MINOR) {
    console.log('\n  PO already invoiced and paid — nothing to do.')
    return
  }

  const priorInv = await api('GET', `/entity/invoicein?search=${encodeURIComponent(MARKER)}&limit=5`)
  const priorPay = await api('GET', `/entity/paymentout?search=${encodeURIComponent(MARKER)}&limit=5`)
  if ((priorInv.rows || []).length || (priorPay.rows || []).length) {
    console.log('\n  Marker already posted — skip')
    return
  }

  const positions = await loadSupplyPositions()
  if (positions.length !== 38) throw new Error(`Expected 38 supply lines, got ${positions.length}`)

  const invoiceMoment = uaeMomentAddMinutes(1, new Date(supply.moment.replace(' ', 'T') + '+04:00'))
  const paymentMoment = uaeMomentNow()

  console.log(`\n  Will create invoicein ${money(EXPECTED_SUM_MINOR)} AED @ ${invoiceMoment}`)
  console.log(`  Will create paymentout ${money(EXPECTED_SUM_MINOR)} AED @ ${paymentMoment} → supply ${supply.name}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const invoice = await api('POST', '/entity/invoicein', {
    moment: invoiceMoment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', SUPPLIER_ID),
    purchaseOrder: href('purchaseorder', PO_ID),
    rate: { currency: href('currency', CURRENCY_ID) },
    description: [
      MARKER,
      'Supplier invoice DM GME 260616 shipping invoice — T/T paid.',
      'USD 15,098.80 | AWB 607-54108224 | CPIP-160626-081300.',
      `Linked to supply ${supply.name} / PO ${po.name}.`,
    ].join(' | '),
    positions,
  })

  const payment = await api('POST', '/entity/paymentout', {
    moment: paymentMoment,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', SUPPLIER_ID),
    sum: EXPECTED_SUM_MINOR,
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref('paymentout', PAYMENT_STATE_PAID_ID),
    paymentPurpose: `Оплата по накладной № ${supply.name} от ${dmyFromMoment(supply.moment)}. Сумма: ${money(EXPECTED_SUM_MINOR)} без НДС`,
    description: [
      MARKER,
      'T/T payment DM GME 260616 ship — Korea air import paid.',
      `Invoice ${invoice.name} / supply ${supply.name} / PO ${po.name}.`,
    ].join(' | '),
    operations: [
      {
        meta: href('supply', SUPPLY_ID).meta,
        linkedSum: EXPECTED_SUM_MINOR,
      },
    ],
  })

  const [poAfter, supAfter, invAfter] = await Promise.all([
    api('GET', `/entity/purchaseorder/${PO_ID}`),
    api('GET', `/entity/supply/${SUPPLY_ID}`),
    api('GET', `/entity/invoicein/${invoice.id}`),
  ])

  console.log(`\n  Invoicein: ${invoice.name} | ${money(invoice.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#invoicein/edit?id=${invoice.id}`)
  console.log(`  Paymentout: ${payment.name} | ${money(payment.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${payment.id}`)
  console.log(`\n  PO: invoiced ${money(poAfter.invoicedSum)} | paid ${money(poAfter.payedSum)} | received ${money(poAfter.shippedSum)}`)
  console.log(`  Supply paid: ${money(supAfter.payedSum)} / ${money(supAfter.sum)}`)
  console.log(`  Invoice paid: ${money(invAfter.payedSum)} / ${money(invAfter.sum)}`)

  if (
    poAfter.invoicedSum !== EXPECTED_SUM_MINOR ||
    poAfter.payedSum !== EXPECTED_SUM_MINOR ||
    supAfter.payedSum !== EXPECTED_SUM_MINOR
  ) {
    throw new Error('PO/supply not fully invoiced/paid after posting')
  }

  console.log(`\n  https://online.moysklad.ru/app/#purchaseorder/edit?id=${PO_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
