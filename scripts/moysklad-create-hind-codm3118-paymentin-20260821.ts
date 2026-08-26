/**
 * Hind Lougay CODM2608193118 — COD cash received.
 * Paymentin linked to shipment 06716, then SO → Доставлен and website DELIVERED/paid.
 *
 *   npx tsx --env-file=.env --env-file=.env.local scripts/moysklad-create-hind-codm3118-paymentin-20260821.ts
 *   npx tsx --env-file=.env --env-file=.env.local scripts/moysklad-create-hind-codm3118-paymentin-20260821.ts --commit
 */

import { prisma } from '../lib/prisma'
import { awardClinicPointsForOrder } from '../lib/homecare'
import { awardPointsForDeliveredOrder } from '../lib/loyalty'

const { uaeMomentAddMinutes } = require('./lib/moysklad-uae-date') as {
  uaeMomentAddMinutes: (minutes: number, base?: Date) => string
}

const COMMIT = process.argv.includes('--commit')
const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  throw new Error('set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const MARKER = 'HIND-LOUGAY-PAYMENTIN-04950-2026-08-21'

const DOCS = {
  orderId: '45ceef4f-9c02-11f1-0a80-00600002b283',
  orderName: 'CODM2608193118',
  invoiceId: '46274c4f-9c02-11f1-0a80-084e0001f70f',
  invoiceName: '04950',
  demandId: 'f85320ad-9c83-11f1-0a80-06a90022155b',
  demandName: '06716',
  amountMinor: 232000,
  expectedEmail: 'hlougay@gmail.com',
  expectedAgent: 'Hind Lougay',
}

async function api(method: string, pathStr: string, body?: unknown, attempt = 1): Promise<any> {
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
  } catch (e: any) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function href(type: string, id: string) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function orgAccountHref(id: string) {
  return { meta: { href: `${API}/entity/account/${id}`, type: 'account', mediaType: 'application/json' } }
}

function stateHref(entityType: string, stateId: string) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor: number) {
  return ((minor || 0) / 100).toFixed(2)
}

function idFromMeta(meta?: { href?: string }) {
  return meta?.href?.split('/').pop() || ''
}

async function main() {
  console.log('====================================================================')
  console.log('  Hind Lougay — paymentin 2,320 @ 04950 / 06716')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand, webOrder, dup] = await Promise.all([
    api('GET', `/entity/customerorder/${DOCS.orderId}?expand=state,agent`),
    api('GET', `/entity/invoiceout/${DOCS.invoiceId}?expand=agent`),
    api('GET', `/entity/demand/${DOCS.demandId}?expand=agent,invoicesOut`),
    prisma.order.findUnique({
      where: { orderNumber: DOCS.orderName },
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        customerName: true,
        status: true,
        paymentStatus: true,
        deliveredAt: true,
        paidAt: true,
        total: true,
      },
    }),
    api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=10`),
  ])

  const agentId = idFromMeta(order.agent?.meta)
  console.log(`  Customer: ${order.agent?.name} (${agentId})`)
  console.log(`  Order: ${order.name} | ${order.state?.name || '?'} | ${money(order.sum)}`)
  console.log(`  Invoice ${invoice.name}: ${money(invoice.sum)} (paid ${money(invoice.payedSum)})`)
  console.log(`  Shipment ${demand.name}: ${money(demand.sum)} (paid ${money(demand.payedSum)})`)
  console.log(`  demand.customerOrder: ${demand.customerOrder ? 'YES (unexpected)' : 'none'}`)
  console.log(
    `  Website: ${webOrder?.orderNumber} | ${webOrder?.status}/${webOrder?.paymentStatus} | ${webOrder?.total}`,
  )

  if (order.name !== DOCS.orderName) throw new Error(`Order name mismatch: ${order.name}`)
  if (invoice.name !== DOCS.invoiceName) throw new Error(`Invoice name mismatch: ${invoice.name}`)
  if (demand.name !== DOCS.demandName) throw new Error(`Demand name mismatch: ${demand.name}`)
  if (order.agent?.name !== DOCS.expectedAgent) throw new Error(`Unexpected agent: ${order.agent?.name}`)
  if (!agentId) throw new Error('Missing counterparty id')
  if (invoice.sum !== DOCS.amountMinor || demand.sum !== DOCS.amountMinor) {
    throw new Error(`Amount mismatch — expected ${money(DOCS.amountMinor)}`)
  }
  if (!(demand.invoicesOut || []).some((x: any) => x.meta.href.includes(DOCS.invoiceId))) {
    throw new Error('Shipment not linked to invoice 04950')
  }
  if (demand.customerOrder) throw new Error('Demand has customerOrder — expected invoice-only')
  if (!webOrder) throw new Error('Website order not found')
  if (webOrder.customerEmail !== DOCS.expectedEmail) {
    throw new Error(`Website email mismatch: ${webOrder.customerEmail}`)
  }

  if ((dup.rows || []).some((r: any) => (r.description || '').includes(MARKER))) {
    console.log('\n  SKIP — already booked')
    return
  }

  const alreadyPaid = (demand.payedSum || 0) >= demand.sum
  if (alreadyPaid) console.log('\n  Already paid — ensuring Доставлен / website DELIVERED')

  if (!COMMIT) {
    console.log(`\n  Would post paymentin ${money(DOCS.amountMinor)} AED @ shipment ${demand.name}`)
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  if (!alreadyPaid) {
    const moment = uaeMomentAddMinutes(10)
    if (new Date(moment.replace(' ', 'T')) <= new Date(String(demand.moment).replace(' ', 'T'))) {
      throw new Error(`Payment moment must be after shipment ${demand.moment}`)
    }
    const paymentIn = await api('POST', '/entity/paymentin', {
      moment,
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agentId),
      organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
      sum: DOCS.amountMinor,
      description: [
        MARKER,
        `Invoice ${DOCS.invoiceName} / shipment ${DOCS.demandName}`,
        `Order ${DOCS.orderName}`,
        'COD cash received — Hind Lougay 2,320 AED.',
      ].join(' | '),
      operations: [
        {
          meta: {
            href: `${API}/entity/demand/${DOCS.demandId}`,
            type: 'demand',
            mediaType: 'application/json',
          },
          linkedSum: DOCS.amountMinor,
        },
      ],
    })
    console.log(`\n  Paymentin: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
    console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
  }

  if (idFromMeta(order.state?.meta) !== STATE_ORDER_DELIVERED_ID) {
    await api('PUT', `/entity/customerorder/${DOCS.orderId}`, {
      meta: order.meta,
      state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
    })
    console.log(`  Order ${order.name} → Доставлен`)
  }

  const now = new Date()
  await prisma.order.update({
    where: { id: webOrder.id },
    data: {
      status: 'DELIVERED',
      paymentStatus: 'paid',
      paidAt: webOrder.paidAt || now,
      ...(webOrder.deliveredAt ? {} : { deliveredAt: now }),
    },
  })

  const clinic = await awardClinicPointsForOrder(webOrder.id)
  const loyalty = await awardPointsForDeliveredOrder(webOrder.id)

  const [finalOrder, finalDemand, invAfter] = await Promise.all([
    api('GET', `/entity/customerorder/${DOCS.orderId}?expand=state`),
    api('GET', `/entity/demand/${DOCS.demandId}`),
    api('GET', `/entity/invoiceout/${DOCS.invoiceId}`),
  ])

  console.log(`  Invoice paid: ${money(invAfter.payedSum)} / ${money(invAfter.sum)} AED`)
  console.log(`  Shipment paid: ${money(finalDemand.payedSum)} / ${money(finalDemand.sum)} AED`)
  console.log(
    `  MS=${finalOrder.state?.name} | web=DELIVERED/paid | clinic=${clinic?.awarded ? clinic.points : 0} | loyalty=${loyalty?.awarded ? loyalty.points : 0}`,
  )
}

main()
  .catch((e) => {
    console.error('FATAL:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
