#!/usr/bin/env node

/**
 * Brau Ladies Salon LLC — 6,300 AED ENBD instant transfer 1 Sep 2026.
 * Pays 10 UAE SOA invoices. Leaves KSA 04915 + 04916 (1,900 AED) unpaid.
 *
 * Bank: +6,300.00 AED | 1 Sep 13:37:01 | ref 20260901EBI6B98111336596029
 * Note: "masks jum and ss"
 *
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-paymentins-20260901.js
 *   node --import dotenv/config scripts/moysklad-create-brau-ladies-paymentins-20260901.js --commit
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
const AGENT_ID = 'ce7c406d-dadf-11ee-0a80-130f00597aa2'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const MARKER = 'BRAU-LADIES-PAYMENT-2026-09-01-6300'
const BANK_REF = '20260901EBI6B98111336596029'
const PAYMENT_DATE = '2026-09-01'
const EXPECTED_TOTAL_MINOR = 630000

/** [invoice, invoiceId, amountMinor, orderId, orderName, shipment, shipmentId] */
const ROWS = [
  [
    '04975',
    '72d7e386-a066-11f1-0a80-0910002b8d94',
    68000,
    '72663083-a066-11f1-0a80-0e3c0029f791',
    'GENCardM260825BRAUDIFC',
    '06739',
    '73947dd6-a066-11f1-0a80-1fb500295090',
  ],
  [
    '04974',
    '6e733582-a066-11f1-0a80-028b0029fbd5',
    106000,
    '6e1da097-a066-11f1-0a80-178d0029f451',
    'GENCardM260825BRAUADU',
    '06738',
    '6f7c35fb-a066-11f1-0a80-178d0029f4b3',
  ],
  [
    '04944',
    '648f5727-9aed-11f1-0a80-0f2100291a70',
    38000,
    '644b0c06-9aed-11f1-0a80-083f00296d0f',
    'GENCardM260818BRAUJBRP10',
    '06700',
    '65b45012-9aed-11f1-0a80-075c002a654b',
  ],
  [
    '04943',
    '20c71b0d-9aea-11f1-0a80-1b3d002a2a43',
    76000,
    '208bb872-9aea-11f1-0a80-1b3d002a2a37',
    'GENCardM260818BRAUADUP20',
    '06699',
    '217cf729-9aea-11f1-0a80-0e2f002a7de4',
  ],
  [
    '04942',
    '1cf648e5-9aea-11f1-0a80-075c00290bc4',
    38000,
    '1caa29da-9aea-11f1-0a80-09f4002a5efe',
    'GENCardM260818BRAUSP10',
    '06698',
    '1da1a6ec-9aea-11f1-0a80-0e2f002a7c35',
  ],
  [
    '04910',
    '7c545cd2-94c2-11f1-0a80-0cac008caa76',
    76000,
    '7c1bea07-94c2-11f1-0a80-040f008cbafd',
    'GENCardM260810BRAUADUP20',
    '06659',
    '130e5fe3-9644-11f1-0a80-02d500281754',
  ],
  [
    '04890',
    '2e319044-908f-11f1-0a80-0fd5000e2561',
    76000,
    '2dff3b86-908f-11f1-0a80-1a44000ed364',
    'GENCardM260805BRAUADUP20',
    '06634',
    '0615bfa1-9644-11f1-0a80-195c0027be7d',
  ],
  [
    '04889',
    'd3ec2bc8-908e-11f1-0a80-0806000ec791',
    38000,
    'd2f9db6f-908e-11f1-0a80-1950000e4283',
    'GENCardM260805BRAUSP10',
    '06633',
    'cfa0b656-9643-11f1-0a80-035e0029fa5d',
  ],
  [
    '04866',
    '1c5b97e4-8a55-11f1-0a80-1f3b001357da',
    76000,
    '1c149023-8a55-11f1-0a80-1cb50013c583',
    'GENCardM260728BRAUADUP20',
    '06598',
    'eb2bc196-8a58-11f1-0a80-05400008092f',
  ],
  [
    '04865',
    'bb06bc38-8a54-11f1-0a80-1f3b0013407d',
    38000,
    'bac39f51-8a54-11f1-0a80-1ae20013d5a5',
    'GENCardM260728BRAUSP10',
    '06597',
    '6b9e7f6d-9090-11f1-0a80-1950000e8c94',
  ],
]

const LEAVE_KSA = [
  { invoice: '04915', branch: 'KSA Canopy', amount: '950.00' },
  { invoice: '04916', branch: 'KSA Centeria', amount: '950.00' },
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
        ...(body ? { 'Content-Type': 'application/json' } : {}),
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
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
      type: 'account',
      mediaType: 'application/json',
    },
  }
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

function paymentMoment(index) {
  const second = String(1 + index).padStart(2, '0')
  return `${PAYMENT_DATE} 13:37:${second}`
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
  const moment = paymentMoment(index)
  if (new Date(moment.replace(' ', 'T')) <= new Date(demand.moment)) {
    throw new Error(`Payment moment ${moment} must be after shipment ${demand.moment}`)
  }

  return {
    invoiceName,
    invoiceId,
    shipmentName,
    shipmentId,
    orderId,
    orderName,
    amountMinor,
    moment,
    existing,
    alreadyPaid: demand.payedSum >= demand.sum,
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Brau Ladies Salon — 6,300 AED remittance (KSA left unpaid)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Bank ref: ${BANK_REF}`)
  console.log(`  Payment date: ${PAYMENT_DATE} 13:37\n`)

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
  console.log(`\n  Total to apply: ${money(totalMinor)} AED (${verified.length} invoices)`)
  if (totalMinor !== EXPECTED_TOTAL_MINOR) {
    throw new Error(`Total ${money(totalMinor)} ≠ expected ${money(EXPECTED_TOTAL_MINOR)}`)
  }

  console.log('\n  Leave unpaid (KSA pays separately):')
  for (const row of LEAVE_KSA) {
    console.log(`    ${row.invoice} ${row.branch} ${row.amount} AED`)
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
        `ENBD instant ${BANK_REF}`,
        `masks jum and ss`,
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
    console.log(`    https://online.moysklad.ru/app/#paymentin/edit?id=${r.paymentinId}`)
  }
  console.log(
    `\n  Posted ${results.length} paymentin(s) | total ${money(results.reduce((s, r) => s + Number(r.amount) * 100, 0))} AED`,
  )
  console.log('  KSA 04915 + 04916 / 1,900 AED left unpaid')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
