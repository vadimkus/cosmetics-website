#!/usr/bin/env node

/**
 * Brau Ladies Salon LLC — bulk paymentin for 8 paid invoices (remittance list 2026-06-30).
 *
 * Payment linked to shipment (after shipment moment). Orders → Доставлен.
 *
 *   04426/06038  380 | 04452/06068  380 | 04453/06069  760 | 04482/06113  760
 *   04483/06114  380 | 04502/06145 1060 | 04542/06192  760 | 04543/06193  570
 *   Total 5,050.00 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-paymentins-20260630.js
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-paymentins-20260630.js --commit
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

const MARKER = 'BRAU-LADIES-BULK-PAYMENT-2026-06-30'

/** invoice, invoiceId, amountMinor, orderId, shipment, shipmentId */
const ROWS = [
  ['04426', 'f7adc8cb-4248-11f1-0a80-02a90038c269', 38000, 'eddc8fd4-4248-11f1-0a80-1b7500384544', '06038', 'dfab5603-4249-11f1-0a80-03b3003957e4'],
  ['04452', 'a3a95792-457b-11f1-0a80-0d7f001fe102', 38000, '9cdffde4-457b-11f1-0a80-196d0020bbf7', '06068', 'bfc10d04-457b-11f1-0a80-1ba100200161'],
  ['04453', 'f6d2b6a6-457b-11f1-0a80-04090020d2dc', 76000, 'ec71f27a-457b-11f1-0a80-01380021920a', '06069', '1881eb05-457c-11f1-0a80-03c40020e99d'],
  ['04482', '953c7cc7-4b7a-11f1-0a80-0c4600554ca1', 76000, '85fbf3d8-4b7a-11f1-0a80-1558005722c0', '06113', 'a4450dff-4b7a-11f1-0a80-1b590055c8a1'],
  ['04483', 'e13035b0-4b7a-11f1-0a80-1b590055d63d', 38000, 'dd4e4cab-4b7a-11f1-0a80-042500548bb0', '06114', 'bfb0e8f2-4b80-11f1-0a80-0713002b18a1'],
  ['04502', '4a97462e-4ecb-11f1-0a80-0eec00112ff6', 106000, '2f72a2fb-4ecb-11f1-0a80-134100115c8d', '06145', 'ef0fd38d-4ef5-11f1-0a80-04940000c894'],
  ['04542', '658423d7-5376-11f1-0a80-1ad6000f4ebf', 76000, '5da88081-5376-11f1-0a80-138a000ec005', '06192', '80b693e9-5376-11f1-0a80-1d3a000eb2fc'],
  ['04543', '98863dec-5376-11f1-0a80-1b73000edd55', 57000, '93a5354d-5376-11f1-0a80-075d000f07ea', '06193', 'daca0c45-5376-11f1-0a80-075d000f173a'],
]

const PAYMENT_DATE = '2026-06-30'

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

async function findExistingPayment(invoiceName, shipmentName) {
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

  const existing = await findExistingPayment(invoiceName, shipmentName)
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
    invoice,
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
