#!/usr/bin/env node

/**
 * Brau Ladies Salon LLC — paymentin for SOA open invoices (received 2026-08-01).
 * Marks linked customer orders as Доставлен.
 *
 *   04841/06568 760 | 04840/06567 760 | 04818/06539 300
 *   04812/06532 760 | 04811/06531 760 | 04791/06507 380
 *   04785/06499 760 | 04758/06465 760 | 04757/06464 300
 *   04739/06435 380
 *   Total 5,920.00 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-paymentins-20260801.js
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-paymentins-20260801.js --commit
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

/** [invoice, invoiceId, amountMinor, orderId, orderName, shipment, shipmentId] */
const ROWS = [
  [
    '04841',
    '0200bd8d-8440-11f1-0a80-0ca600805590',
    76000,
    '01c5d4aa-8440-11f1-0a80-0dc800808266',
    'GENCardM260720BRAUJBRP20',
    '06568',
    '02c07ed7-8440-11f1-0a80-0f9b007df6fa',
  ],
  [
    '04840',
    'febe22be-843f-11f1-0a80-1b64007eb99d',
    76000,
    'fe776dd0-843f-11f1-0a80-1b64007eb987',
    'GENCardM260720BRAUADUP20',
    '06567',
    'ff7099a3-843f-11f1-0a80-1005007fd738',
  ],
  [
    '04818',
    'ed6c4a58-7f74-11f1-0a80-19b6001aaecd',
    30000,
    'ed2feecb-7f74-11f1-0a80-0c9c001b0c1b',
    'GENCardM260714BRAUHC',
    '06539',
    'ee35ff89-7f74-11f1-0a80-04cd001a427d',
  ],
  [
    '04812',
    'ac320b8a-7ebd-11f1-0a80-08020080aa5a',
    76000,
    'abfa3390-7ebd-11f1-0a80-0ee10080b193',
    'GENCardM260713BRAUJBRP20',
    '06532',
    'acd92dd1-7ebd-11f1-0a80-154b0083e448',
  ],
  [
    '04811',
    '834812d0-7ebd-11f1-0a80-1b46008161b6',
    76000,
    '8300faab-7ebd-11f1-0a80-11570080f58b',
    'GENCardM260713BRAUADUP20',
    '06531',
    '83e6dcee-7ebd-11f1-0a80-154b0083dd05',
  ],
  [
    '04791',
    '7a996484-7b67-11f1-0a80-0edd0010f67f',
    38000,
    '7a619038-7b67-11f1-0a80-078f001122ec',
    'GENCardM260709BRAUP10',
    '06507',
    '7b44882f-7b67-11f1-0a80-0c7400106091',
  ],
  [
    '04785',
    'fda59966-7ab0-11f1-0a80-078b0015db4c',
    76000,
    'fd6bf1fa-7ab0-11f1-0a80-153f0016984d',
    'GENCardM260708BRAUP20',
    '06499',
    'fffddba7-7ab0-11f1-0a80-175e001598f8',
  ],
  [
    '04758',
    '3d3fb4e7-76a9-11f1-0a80-0d9f000ee817',
    76000,
    '3d04f597-76a9-11f1-0a80-1c6d000f36c7',
    'GENCardM260703BRAUJBR',
    '06465',
    '3decdde6-76a9-11f1-0a80-1f21000e4e8b',
  ],
  [
    '04757',
    '39d07655-76a9-11f1-0a80-04b6000eecd8',
    30000,
    '3961cc87-76a9-11f1-0a80-0556000f63c6',
    'GENCardM260703BRAUADU',
    '06464',
    '3ab612f3-76a9-11f1-0a80-08c2000e7ae4',
  ],
  [
    '04739',
    '4e034391-7454-11f1-0a80-1526000642c6',
    38000,
    '4625337f-7454-11f1-0a80-135d0006b395',
    'GENCardM2606291823',
    '06435',
    'ad60cb43-7459-11f1-0a80-135d0007f325',
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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
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
  const base = `${PAYMENT_DATE} 18:${String(10 + index).padStart(2, '0')}:00`
  if (new Date(base.replace(' ', 'T')) <= new Date(shipmentMoment)) {
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
      `${invoiceName}: amount mismatch expected ${money(amountMinor)} inv ${money(invoice.sum)} ship ${money(demand.sum)}`,
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
  console.log('  Brau Ladies Salon — SOA paymentins (10 invoices)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Payment date: ${PAYMENT_DATE}\n`)

  const verified = []
  for (let i = 0; i < ROWS.length; i++) {
    const v = await verifyRow(ROWS[i], i)
    verified.push(v)
    const status = v.alreadyPaid ? 'ALREADY PAID' : v.existing ? 'PAYMENT EXISTS' : 'READY'
    console.log(
      `  ${v.invoiceName} → ${v.shipmentName} | ${money(v.amountMinor)} AED | ${v.orderName} | ${status}`,
    )
  }

  const totalMinor = verified.reduce((s, v) => s + v.amountMinor, 0)
  console.log(`\n  Total: ${money(totalMinor)} AED (${verified.length} invoices)`)
  if (totalMinor !== 592000) {
    throw new Error(`Total ${money(totalMinor)} ≠ expected 5920.00`)
  }

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
        `Brau Ladies Salon SOA remittance ${PAYMENT_DATE}`,
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
      `  ${r.invoice}/${r.shipment} | pay ${r.paymentin} | ${r.amount} AED | inv ${r.invPaid} | ship ${r.shipPaid} | ${r.order} (${r.orderState})`,
    )
  }
  console.log(
    `\n  Posted ${results.length} paymentin(s) | total ${money(results.reduce((s, r) => s + Number(r.amount) * 100, 0))} AED`,
  )
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
