/**
 * Fahed Alyahyaee CODW2609038242 — COD cash received.
 * Paymentin linked to shipment 06805, then SO → Доставлен and website DELIVERED/paid.
 *
 *   npx tsx --env-file=.env --env-file=.env.local scripts/moysklad-create-fahed-alyahyaee-paymentin-05018-20260905.ts
 *   npx tsx --env-file=.env --env-file=.env.local scripts/moysklad-create-fahed-alyahyaee-paymentin-05018-20260905.ts --commit
 */

import { prisma } from '../lib/prisma'
import { awardClinicPointsForOrder } from '../lib/homecare'
import { awardPointsForDeliveredOrder } from '../lib/loyalty'

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date') as {
  uaeToday: (now?: Date) => string
  uaeMomentNow: (now?: Date) => string
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
const MARKER = `FAHED-ALYAHYAEE-PAYMENTIN-05018-${uaeToday()}`

const DOCS = {
  orderId: 'c913de9b-a7a2-11f1-0a80-1fd1002ebea5',
  orderName: 'CODW2609038242',
  invoiceId: 'c955edd6-a7a2-11f1-0a80-17d5002e25df',
  invoiceName: '05018',
  demandId: 'c9d38845-a7a2-11f1-0a80-182d002fcbfb',
  demandName: '06805',
  amountMinor: 36000,
  expectedAgent: "Fahed Alyahyaee's",
  expectedEmail: 'falyahyaee0@gmail.com',
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
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
      type: 'account',
      mediaType: 'application/json',
    },
  }
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

function paymentMomentAfter(demandMoment: string) {
  const now = uaeMomentNow()
  if (new Date(now.replace(' ', 'T')) > new Date(String(demandMoment).replace(' ', 'T'))) return now
  return uaeMomentAddMinutes(10)
}

async function main() {
  console.log('====================================================================')
  console.log('  Fahed Alyahyaee — paymentin 360 @ 05018 / 06805')
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
    throw new Error('Shipment not linked to invoice 05018')
  }
  if (demand.customerOrder) throw new Error('Demand has customerOrder — expected invoice-only')
  if (!webOrder) throw new Error('Website order not found')
  if (webOrder.customerEmail !== DOCS.expectedEmail) {
    throw new Error(`Website email mismatch: ${webOrder.customerEmail}`)
  }
  if (Math.abs((webOrder.total || 0) - 360) > 0.01) {
    throw new Error(`Website total mismatch: ${webOrder.total}`)
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
    const paymentIn = await api('POST', '/entity/paymentin', {
      moment: paymentMomentAfter(demand.moment),
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agentId),
      organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
      sum: DOCS.amountMinor,
      description: [
        MARKER,
        `Invoice ${DOCS.invoiceName} / shipment ${DOCS.demandName}`,
        `Order ${DOCS.orderName}`,
        'COD cash received — Fahed Alyahyaee 360 AED.',
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
