/**
 * Khadija Faidar CODM2608138202 — cash received, delivered.
 * Payment in linked to shipment 06681, then SO → Доставлен and website DELIVERED/paid.
 *
 *   npx tsx --env-file=.env --env-file=.env.local scripts/moysklad-create-khadija-faidar-paymentin-04928-20260813.ts
 *   npx tsx --env-file=.env --env-file=.env.local scripts/moysklad-create-khadija-faidar-paymentin-04928-20260813.ts --commit
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
const MARKER = 'KHADIJA-FAIDAR-PAYMENTIN-04928-2026-08-13'

const DOCS = {
  orderId: 'a0a896be-9725-11f1-0a80-09ec00337e7c',
  orderName: 'CODM2608138202',
  invoiceId: 'a10a8824-9725-11f1-0a80-0360003338ff',
  invoiceName: '04928',
  demandId: 'a221a1c2-9725-11f1-0a80-03600033392a',
  demandName: '06681',
  amountMinor: 77000,
  websiteOrderId: 'cmsrkjju5000004kz570f3a95',
  expectedEmail: 'khadijafaidar6@gmail.com',
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
  console.log('  Khadija Faidar — paymentin @ 04928 / 06681 + delivered')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [order, invoice, demand, webOrder] = await Promise.all([
    api('GET', `/entity/customerorder/${DOCS.orderId}?expand=state,agent`),
    api('GET', `/entity/invoiceout/${DOCS.invoiceId}?expand=agent`),
    api('GET', `/entity/demand/${DOCS.demandId}?expand=agent,invoicesOut`),
    prisma.order.findUnique({
      where: { id: DOCS.websiteOrderId },
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        customerName: true,
        status: true,
        paymentStatus: true,
        deliveredAt: true,
        total: true,
      },
    }),
  ])

  const agentId = idFromMeta(order.agent?.meta)
  console.log(`  Customer: ${order.agent?.name} (${agentId})`)
  console.log(`  Order: ${order.name} | ${order.state?.name || '?'} | ${money(order.sum)}`)
  console.log(`  Invoice ${invoice.name}: ${money(invoice.sum)} (paid ${money(invoice.payedSum)})`)
  console.log(`  Shipment ${demand.name}: ${money(demand.sum)} (paid ${money(demand.payedSum)})`)
  console.log(`  demand.customerOrder: ${demand.customerOrder ? 'YES (unexpected)' : 'none'}`)
  console.log(
    `  Website: ${webOrder?.orderNumber} | ${webOrder?.status}/${webOrder?.paymentStatus} | ${webOrder?.total}`
  )

  if (order.name !== DOCS.orderName) throw new Error(`Order name mismatch: ${order.name}`)
  if (invoice.name !== DOCS.invoiceName) throw new Error(`Invoice name mismatch: ${invoice.name}`)
  if (demand.name !== DOCS.demandName) throw new Error(`Demand name mismatch: ${demand.name}`)
  if (invoice.sum !== DOCS.amountMinor || demand.sum !== DOCS.amountMinor) {
    throw new Error(`Amount mismatch — expected ${money(DOCS.amountMinor)}`)
  }
  if (!(demand.invoicesOut || []).some((x: any) => x.meta.href.includes(DOCS.invoiceId))) {
    throw new Error('Shipment not linked to invoice 04928')
  }
  if (!webOrder) throw new Error('Website order not found')
  if (webOrder.orderNumber !== DOCS.orderName) {
    throw new Error(`Website order number mismatch: ${webOrder.orderNumber}`)
  }
  if (webOrder.customerEmail !== DOCS.expectedEmail) {
    throw new Error(`Website email mismatch: ${webOrder.customerEmail}`)
  }
  if (!agentId) throw new Error('Missing counterparty id on SO')
  if (order.agent?.name !== 'Khadija Faidar') {
    throw new Error(`Unexpected agent name: ${order.agent?.name}`)
  }

  const alreadyPaid = (demand.payedSum || 0) >= demand.sum
  if (alreadyPaid) {
    console.log('\n  Already paid — ensuring Доставлен / website DELIVERED')
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (!alreadyPaid) {
    const moment = uaeMomentAddMinutes(5)
    const paymentIn = await api('POST', '/entity/paymentin', {
      moment,
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', agentId),
      organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
      sum: DOCS.amountMinor,
      description: [
        MARKER,
        `Payment for ${DOCS.demandName} / ${DOCS.invoiceName} / ${DOCS.orderName}`,
        'Cash on delivery — Khadija Faidar 770 AED.',
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
    console.log(`\n  Payment in: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
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
      ...(webOrder.deliveredAt ? {} : { deliveredAt: now }),
    },
  })

  const clinic = await awardClinicPointsForOrder(webOrder.id)
  const loyalty = await awardPointsForDeliveredOrder(webOrder.id)

  const [finalOrder, finalDemand] = await Promise.all([
    api('GET', `/entity/customerorder/${DOCS.orderId}?expand=state`),
    api('GET', `/entity/demand/${DOCS.demandId}`),
  ])

  console.log(
    `  ✓ MS=${finalOrder.state?.name} payed=${money(finalDemand.payedSum)} | ` +
      `web=DELIVERED/paid | clinic=${clinic?.awarded ? clinic.points : 0} | ` +
      `loyalty=${loyalty?.awarded ? loyalty.points : 0}`
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
