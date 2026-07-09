#!/usr/bin/env node

/**
 * Brau Ladies Salon LLC — 8 paymentins for remittance received 2026-07-01.
 *
 * Payment linked to shipment (after shipment moment). Orders → Доставлен.
 * Total 7,140.00 AED
 *
 *   04578/06232 1520 | 04597/06262  760 | 04639/06317  950 | 04640/06318  950
 *   04641/06319  380 | 04683/06369 1060 | 04714/06403  760 | 04736/06431  760
 *
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-paymentins-20260701.js
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-paymentins-20260701.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const AGENT_ID = 'ce7c406d-dadf-11ee-0a80-130f00597aa2' // Brau Ladies Salon LLC
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const MARKER = 'BRAU-LADIES-BULK-PAYMENT-2026-07-01'
const PAYMENT_DATE = '2026-07-01'

/** invoice, invoiceId, amountMinor, orderId, shipment, shipmentId */
const ROWS = [
  ['04578', 'e73bfd92-590c-11f1-0a80-0fed004f0535', 152000, 'de4f1f1d-590c-11f1-0a80-1764004d5fda', '06232', '0d59d159-590d-11f1-0a80-04f500501207'],
  ['04597', '1169f09f-5dc4-11f1-0a80-1091003aa14d', 76000, '0aeb2e3c-5dc4-11f1-0a80-041d00392802', '06262', '258ee411-5dc4-11f1-0a80-17a90037cc6f'],
  ['04639', 'c6018e6d-633a-11f1-0a80-0264008951fd', 95000, 'c5af6a14-633a-11f1-0a80-191f008a3ea7', '06317', 'c6b3969b-633a-11f1-0a80-01a50088c811'],
  ['04640', 'c756f138-633a-11f1-0a80-154a008a4eb2', 95000, 'c71d9fc2-633a-11f1-0a80-17b90088e52b', '06318', 'c7fdf70e-633a-11f1-0a80-16c9008820ab'],
  ['04641', 'c8ae62f3-633a-11f1-0a80-1a460088b979', 38000, 'c86c1e98-633a-11f1-0a80-0cc500870bf6', '06319', 'c98c7336-633a-11f1-0a80-154a008a4f50'],
  ['04683', 'a57e4328-6994-11f1-0a80-1e020028301c', 106000, 'a538af6c-6994-11f1-0a80-1bb30027d75f', '06369', 'a63c94e1-6994-11f1-0a80-1bb30027d77f'],
  ['04714', '64c28433-6ee7-11f1-0a80-1beb00a8468b', 76000, '6326846b-6ee7-11f1-0a80-1beb00a8457c', '06403', '6585afc9-6ee7-11f1-0a80-1e0800a803a7'],
  ['04736', '591c1f53-73b0-11f1-0a80-18ce0031fd20', 76000, '4f7c384d-73b0-11f1-0a80-1fef00321672', '06431', '813d3cab-73b0-11f1-0a80-012c0030e9f9'],
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
  const base = `${PAYMENT_DATE} 12:${String(index * 5).padStart(2, '0')}:00`
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
  const [invoiceName, invoiceId, amountMinor, orderId, shipmentName, shipmentId] = row

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
  if (invoice.name !== invoiceName || demand.name !== shipmentName) {
    throw new Error(`Name mismatch ${invoiceName}/${shipmentName}`)
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
    orderName: order.name,
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
  console.log('  Brau Ladies Salon — 8 paymentins @ shipments + delivered orders')
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
    if (orderAfter.state?.meta?.href?.split('/').pop() !== STATE_ORDER_DELIVERED_ID) {
      throw new Error(`${v.orderName}: order not set to Доставлен`)
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
    })

    console.log(`\n  ✓ ${v.invoiceName} paymentin ${created.name} | order ${v.orderName} → Доставлен`)
  }

  console.log('\n=== SUMMARY ===')
  for (const r of results) {
    console.log(
      `  ${r.invoice}/${r.shipment} | pay ${r.paymentin} | ${r.amount} AED | inv ${r.invPaid} | ship ${r.shipPaid} | ${r.order}`
    )
    console.log(`    https://online.moysklad.ru/app/#paymentin/edit?id=${r.paymentinId}`)
  }
  console.log(`\n  Posted ${results.length} paymentin(s) | total ${money(results.reduce((s, r) => s + Number(r.amount) * 100, 0))} AED`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
