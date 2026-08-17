#!/usr/bin/env node

/**
 * Brau Ladies Salon LLC — paymentin for invoices 04742 + 04743 (received 2026-07-14).
 *
 *   04742 / 06438  760.00 | GENCardM2606291825
 *   04743 / 06442  380.00 | GENCardM2606291826
 *   Total 1,140.00 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-paymentins-20260714.js
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-paymentins-20260714.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const AGENT_ID = 'ce7c406d-dadf-11ee-0a80-130f00597aa2'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const MARKER = `BRAU-LADIES-PAYMENT-${uaeToday()}`
const PAYMENT_DATE = uaeToday()

/** invoice, invoiceId, amountMinor, orderId, orderName, shipment, shipmentId */
const ROWS = [
  [
    '04742',
    'f420cd80-74a3-11f1-0a80-18170000472b',
    76000,
    'e95b7af2-74a3-11f1-0a80-1f0c000049e5',
    'GENCardM2606291825',
    '06438',
    'f7aa6e92-74a3-11f1-0a80-1f0c00004d6e',
  ],
  [
    '04743',
    'af1f6121-74a5-11f1-0a80-1a640000545b',
    38000,
    'a979d539-74a5-11f1-0a80-0ecc0000505d',
    'GENCardM2606291826',
    '06442',
    '7dee363d-754b-11f1-0a80-1f0c00119f9f',
  ],
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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function orgAccountHref(id) {
  return { meta: { href: `${API}/entity/account/${id}`, type: 'account', mediaType: 'application/json' } }
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

function paymentMoment(index, shipmentMoment) {
  const base = `${PAYMENT_DATE} 17:${String(10 + index * 5).padStart(2, '0')}:00`
  if (new Date(base) <= new Date(shipmentMoment)) {
    throw new Error(`Payment moment ${base} must be after shipment ${shipmentMoment}`)
  }
  return base
}

async function findExistingPayment(invoiceName) {
  const token = `${MARKER}-${invoiceName}`
  const data = await api('GET', `/entity/paymentin?search=${encodeURIComponent(token)}&limit=10`)
  return (data.rows || []).find((r) => (r.description || '').includes(token))
}

async function verifyRow(row, index) {
  const [invoiceName, invoiceId, amountMinor, orderId, orderName, shipmentName, shipmentId] = row

  const [invoice, demand, order] = await Promise.all([
    api('GET', `/entity/invoiceout/${invoiceId}?expand=agent`),
    api('GET', `/entity/demand/${shipmentId}?expand=agent,invoicesOut`),
    api('GET', `/entity/customerorder/${orderId}?expand=state,agent`),
  ])

  if (invoice.agent?.meta?.href?.split('/').pop() !== AGENT_ID) {
    throw new Error(`${invoiceName}: invoice agent mismatch (${invoice.agent?.name})`)
  }
  if (demand.agent?.meta?.href?.split('/').pop() !== AGENT_ID) {
    throw new Error(`${shipmentName}: shipment agent mismatch`)
  }
  if (invoice.name !== invoiceName || demand.name !== shipmentName || order.name !== orderName) {
    throw new Error(`Name mismatch ${invoiceName}/${shipmentName}/${orderName}`)
  }
  if (invoice.sum !== amountMinor || demand.sum !== amountMinor) {
    throw new Error(
      `${invoiceName}: amount mismatch expected ${money(amountMinor)} inv ${money(invoice.sum)} ship ${money(demand.sum)}`
    )
  }
  const linked = (demand.invoicesOut || []).some((x) => x.meta.href.includes(invoiceId))
  if (!linked) throw new Error(`${shipmentName} not linked to invoice ${invoiceName}`)

  const existing = await findExistingPayment(invoiceName)
  const moment = paymentMoment(index, demand.moment)

  return {
    invoiceName,
    invoiceId,
    shipmentName,
    shipmentId,
    orderId,
    orderName,
    amountMinor,
    demand,
    order,
    moment,
    existing,
    alreadyPaid: demand.payedSum >= demand.sum,
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Brau Ladies Salon — paymentin 04742 + 04743')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const verified = []
  for (let i = 0; i < ROWS.length; i++) {
    const v = await verifyRow(ROWS[i], i)
    verified.push(v)
    const status = v.alreadyPaid ? 'ALREADY PAID' : v.existing ? 'PAYMENT EXISTS' : 'READY'
    console.log(
      `  ${v.invoiceName} → ${v.shipmentName} | ${money(v.amountMinor)} AED | ${v.orderName} | ${status}`
    )
  }

  const totalMinor = verified.reduce((s, v) => s + v.amountMinor, 0)
  console.log(`\n  Total: ${money(totalMinor)} AED (${verified.length} invoices)`)

  const toPost = verified.filter((v) => !v.alreadyPaid && !v.existing)
  if (toPost.length === 0) {
    console.log('\n  Nothing to post — all shipments already paid or paymentins exist.')
    return
  }

  if (!COMMIT) {
    console.log(`\n  DRY RUN — would post ${toPost.length} paymentin(s) and mark orders delivered`)
    return
  }

  const results = []
  for (const v of toPost) {
    const created = await api('POST', '/entity/paymentin', {
      applicable: true,
      moment: v.moment,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
      sum: v.amountMinor,
      description: [
        `${MARKER}-${v.invoiceName}`,
        `Invoice ${v.invoiceName} / shipment ${v.shipmentName}`,
        `Brau Ladies Salon payment ${PAYMENT_DATE}`,
        `Order ${v.orderName}`,
      ].join(' | '),
      operations: [
        {
          meta: {
            href: `${API}/entity/demand/${v.shipmentId}`,
            type: 'demand',
            mediaType: 'application/json',
          },
          linkedSum: v.amountMinor,
        },
      ],
    })

    const order = await api('GET', `/entity/customerorder/${v.orderId}`)
    await api('PUT', `/entity/customerorder/${v.orderId}`, {
      meta: order.meta,
      state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
    })

    const [invAfter, demAfter, orderAfter] = await Promise.all([
      api('GET', `/entity/invoiceout/${v.invoiceId}`),
      api('GET', `/entity/demand/${v.shipmentId}`),
      api('GET', `/entity/customerorder/${v.orderId}?expand=state`),
    ])

    if (demAfter.payedSum < demAfter.sum) {
      throw new Error(`${v.shipmentName}: shipment not fully paid after paymentin`)
    }

    results.push({
      invoice: v.invoiceName,
      shipment: v.shipmentName,
      paymentin: created.name,
      paymentinId: created.id,
      order: v.orderName,
      amount: money(v.amountMinor),
      invPaid: `${money(invAfter.payedSum)}/${money(invAfter.sum)}`,
      shipPaid: `${money(demAfter.payedSum)}/${money(demAfter.sum)}`,
      orderState: orderAfter.state?.name,
    })

    console.log(`\n  ✓ ${v.invoiceName} paymentin ${created.name} | order ${v.orderName} → Доставлен`)
  }

  console.log('\n=== SUMMARY ===')
  for (const r of results) {
    console.log(
      `  ${r.invoice}/${r.shipment} | pay ${r.paymentin} | ${r.amount} AED | inv ${r.invPaid} | ship ${r.shipPaid} | ${r.order} (${r.orderState})`
    )
    console.log(`    https://online.moysklad.ru/app/#paymentin/edit?id=${r.paymentinId}`)
  }
  console.log(`\n  Posted ${results.length} paymentin(s) | total ${money(results.reduce((s, r) => s + Number(r.amount) * 100, 0))} AED`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
