#!/usr/bin/env node

/**
 * Korea reorder PO — align supplier invoice + payment to PO after GCAP01 / 54475 ×5 (+170.75 AED).
 *
 * PO sum/shipped already 58,129.35; invoice 00172 + payment 00628 still 57,958.60.
 * Fix: add 54475 line to invoice 00172; create paymentout for supply 00186 (170.75).
 *
 *   node --import dotenv/config scripts/moysklad-fix-korea-po-54475-invoice-payment-20260623.js
 *   node --import dotenv/config scripts/moysklad-fix-korea-po-54475-invoice-payment-20260623.js --commit
 */

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

const PO_ID = '61767a0d-5f3a-11f1-0a80-191700184737'
const PO_NAME = 'Korea reorder 2026-06-03 T1+T2'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const SUPPLIER_ID = '3a0a3f28-33cf-11ea-0a80-043f000b9859'

const INVOICE_ID = '49a41450-6a43-11f1-0a80-048a000f18bf'
const SUPPLY_186_ID = '0e82dba0-6e49-11f1-0a80-112d00892a2a'
const PAY_TEMPLATE_ID = '8580a569-6a43-11f1-0a80-1003000e3807' // 00628 on supply 00184

const PRODUCT_ID = '3706b193-6ae8-11f1-0a80-16e5003a85d3'
const PRODUCT_CODE = '54475'
const QTY = 5
const BUY_MINOR = 3415
const DELTA_MINOR = QTY * BUY_MINOR // 17075
const TARGET_SUM_MINOR = 5812935
const OLD_SUM_MINOR = 5795860
const MARKER = `KOREA-PO-PI-260605-GCAP01-54475-INVOICE-PAY-${uaeToday()}`

async function api(method, pathStr, body) {
  let lastErr
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
      lastErr = e
      await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
    }
  }
  throw lastErr || new Error(`Failed after retries: ${method} ${pathStr}`)
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
  }
  return rows
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function positionsHave54475(entity, id) {
  const positions = await fetchAll(`/entity/${entity}/${id}/positions?expand=assortment`)
  return positions.find((p) => p.assortment?.code === PRODUCT_CODE)
}

async function main() {
  console.log('====================================================================')
  console.log('  Korea PO — align invoice + payment for GCAP01 / 54475 ×5')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  PO   : ${PO_NAME}`)
  console.log(`  Delta: +${money(DELTA_MINOR)} AED (${PRODUCT_CODE} ×${QTY})`)

  const po = await api('GET', `/entity/purchaseorder/${PO_ID}`)
  console.log('\n  PO now:')
  console.log(`    sum         ${money(po.sum)}`)
  console.log(`    invoicedSum ${money(po.invoicedSum)}`)
  console.log(`    payedSum    ${money(po.payedSum)}`)
  console.log(`    shippedSum  ${money(po.shippedSum)}`)

  if (po.sum !== TARGET_SUM_MINOR) {
    throw new Error(`PO sum ${money(po.sum)} != expected ${money(TARGET_SUM_MINOR)}`)
  }
  if (po.invoicedSum === TARGET_SUM_MINOR && po.payedSum === TARGET_SUM_MINOR) {
    console.log('\n  Already aligned — nothing to do.')
    return
  }

  const invoice = await api('GET', `/entity/invoicein/${INVOICE_ID}`)
  const supply186 = await api('GET', `/entity/supply/${SUPPLY_186_ID}`)
  const payTemplate = await api('GET', `/entity/paymentout/${PAY_TEMPLATE_ID}`)

  console.log(`\n  Invoice ${invoice.name} : ${money(invoice.sum)} (paid ${money(invoice.payedSum)})`)
  console.log(`  Supply  ${supply186.name} : ${money(supply186.sum)} (paid ${money(supply186.payedSum)})`)
  console.log(`  Payment ${payTemplate.name} : ${money(payTemplate.sum)} → supply 00184`)

  if (invoice.sum !== OLD_SUM_MINOR && invoice.sum !== TARGET_SUM_MINOR) {
    throw new Error(`Invoice sum ${money(invoice.sum)} unexpected`)
  }
  if (invoice.sum === TARGET_SUM_MINOR) {
    console.log(`\n  Invoice already at ${money(TARGET_SUM_MINOR)} AED`)
  }
  if (supply186.sum !== DELTA_MINOR) {
    throw new Error(`Supply 00186 sum ${money(supply186.sum)} != ${money(DELTA_MINOR)}`)
  }

  const priorPay = await api(
    'GET',
    `/entity/paymentout?filter=${encodeURIComponent(`description~${MARKER}`)}&limit=5`
  )
  if (priorPay.rows?.length) {
    console.log(`\n  Marker payment already exists: ${priorPay.rows[0].name}`)
  }

  if (supply186.payedSum >= DELTA_MINOR) {
    console.log(`\n  Supply ${supply186.name} already paid ${money(supply186.payedSum)}`)
  }

  const inv54475 = await positionsHave54475('invoicein', INVOICE_ID)
  if (inv54475) {
    console.log(`\n  ${PRODUCT_CODE} already on invoice ${invoice.name}`)
  } else {
    console.log(`\n  Will add ${PRODUCT_CODE} ×${QTY} to invoice ${invoice.name}`)
  }

  if ((invoice.description || '').includes(MARKER)) {
    console.log('\n  Invoice already marked from prior run')
  }

  const needInvoiceLine = !inv54475 && invoice.sum !== TARGET_SUM_MINOR
  const needPayment = supply186.payedSum < DELTA_MINOR && !priorPay.rows?.length

  if (!needInvoiceLine && !needPayment) {
    const poCheck = await api('GET', `/entity/purchaseorder/${PO_ID}`)
    if (poCheck.payedSum === TARGET_SUM_MINOR) {
      console.log('\n  Already aligned — nothing to do.')
      return
    }
  }

  if (!COMMIT) {
    if (needInvoiceLine) console.log(`\n  Will add ${PRODUCT_CODE} ×${QTY} to invoice ${invoice.name}`)
    if (needPayment) console.log('\n  Will create paymentout +170.75 AED linked to supply 00186')
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (needInvoiceLine) {
    await api('POST', `/entity/invoicein/${INVOICE_ID}/positions`, {
      quantity: QTY,
      price: BUY_MINOR,
      assortment: href('product', PRODUCT_ID),
      vat: 5,
      vatEnabled: true,
    })
  }

  const invAfter = await api('GET', `/entity/invoicein/${INVOICE_ID}`)
  if (invAfter.sum !== TARGET_SUM_MINOR) {
    throw new Error(`Invoice after add: ${money(invAfter.sum)} != ${money(TARGET_SUM_MINOR)}`)
  }

  let payCreated = priorPay.rows?.[0] || null
  if (needPayment) {
    const paymentPayload = {
      moment: supply186.moment,
      applicable: true,
      organization: payTemplate.organization || href('organization', ORG_ID),
      agent: payTemplate.agent || href('counterparty', SUPPLIER_ID),
      sum: DELTA_MINOR,
      paymentPurpose: `Оплата по накладной № ${supply186.name} от ${supply186.moment.slice(0, 10).split('-').reverse().join('.')}. Сумма: ${money(DELTA_MINOR)} без НДС`,
      description: `${MARKER} | GCAP01 ${PRODUCT_CODE} ×${QTY} top-up on PI DM GME 260605 (supply ${supply186.name}).`,
      operations: [
        {
          meta: href('supply', SUPPLY_186_ID).meta,
          linkedSum: DELTA_MINOR,
        },
      ],
    }
    if (payTemplate.state) paymentPayload.state = payTemplate.state
    if (payTemplate.project) paymentPayload.project = payTemplate.project
    if (payTemplate.expenseItem) paymentPayload.expenseItem = payTemplate.expenseItem
    payCreated = await api('POST', '/entity/paymentout', paymentPayload)
  }

  if (!(invAfter.description || '').includes(MARKER)) {
    const invDesc = [
      invAfter.description || '',
      MARKER,
      `Added ${PRODUCT_CODE} ×${QTY} (+${money(DELTA_MINOR)} AED) to match PO after GCAP01 line.`,
    ]
      .filter(Boolean)
      .join('\n')
    await api('PUT', `/entity/invoicein/${INVOICE_ID}`, { meta: invAfter.meta, description: invDesc })
  }

  const poAfter = await api('GET', `/entity/purchaseorder/${PO_ID}`)
  const supAfter = await api('GET', `/entity/supply/${SUPPLY_186_ID}`)
  const invFinal = await api('GET', `/entity/invoicein/${INVOICE_ID}`)

  console.log('\n  Verification:')
  console.log(`  Invoice ${invFinal.name} : ${money(invFinal.sum)} AED (paid ${money(invFinal.payedSum)})`)
  console.log(`  Supply  ${supAfter.name} : ${money(supAfter.sum)} AED (paid ${money(supAfter.payedSum)})`)
  console.log(`  Payment ${payCreated?.name || '(existing)'} : ${money(payCreated?.sum || DELTA_MINOR)} AED`)
  console.log(`  PO sum / invoiced / paid / shipped:`)
  console.log(
    `    ${money(poAfter.sum)} / ${money(poAfter.invoicedSum)} / ${money(poAfter.payedSum)} / ${money(poAfter.shippedSum)}`
  )

  if (
    poAfter.sum !== TARGET_SUM_MINOR ||
    poAfter.invoicedSum !== TARGET_SUM_MINOR ||
    poAfter.payedSum !== TARGET_SUM_MINOR ||
    poAfter.shippedSum !== TARGET_SUM_MINOR
  ) {
    throw new Error('PO figures still not aligned after fix')
  }

  console.log(`\n  https://online.moysklad.ru/app/#purchaseorder/edit?id=${PO_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
