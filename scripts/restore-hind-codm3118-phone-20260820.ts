/**
 * Restore Hind Lougay's paid CODM2608193118 website mirror and replace the
 * transposed phone number in MoySklad + website customer records.
 *
 * Dry run:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/restore-hind-codm3118-phone-20260820.ts
 * Commit:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/restore-hind-codm3118-phone-20260820.ts --commit
 */
import { awardPointsForDeliveredOrder } from '../lib/loyalty'
import { canonicalOrderItemImage } from '../lib/orderItemImage'
import { prisma } from '../lib/prisma'

const API = 'https://api.moysklad.ru/api/remap/1.2'
const COMMIT = process.argv.includes('--commit')

const EMAIL = 'hlougay@gmail.com'
const PHONE = '+971507086962'
const OLD_PHONE = '+971507806962'
const ADDRESS_LINE1 = 'Mohamed Bin Zayed Zone 14 Inshad Street Compound 23 Villa 28'
const EMIRATE = 'Abu Dhabi'

const ORDER_NUMBER = 'CODM2608193118'
const INVOICE_NUMBER = '04950'
const DEMAND_NUMBER = '06716'
const PAYMENT_NUMBER = '06101'
const MOYSKLAD_ORDER_ID = '45ceef4f-9c02-11f1-0a80-00600002b283'
const MOYSKLAD_CUSTOMER_ID = '45a12fb9-9c02-11f1-0a80-1f9d00026ae6'
const PRODUCT_ID = 'cmgj9ifoi00008o07p4eqmfb7'
const TOTAL_AED = 18

type MoySkladEntity = {
  id: string
  name: string
  moment?: string
  sum?: number
  payedSum?: number
  phone?: string
  email?: string
  state?: { name?: string }
  agent?: { meta?: { href?: string } }
  demands?: Array<{ meta?: { href?: string } }>
}

function moySkladAuth(): string {
  const login = process.env.MOYSKLAD_LOGIN
  const password = process.env.MOYSKLAD_PASSWORD
  if (!login || !password) throw new Error('MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD are required.')
  return `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`
}

async function moySklad<T>(method: 'GET' | 'PUT', path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: moySkladAuth(),
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`MoySklad ${method} ${path}: HTTP ${response.status} ${text.slice(0, 500)}`)
  return JSON.parse(text) as T
}

async function namedEntity(type: string, name: string): Promise<MoySkladEntity> {
  const result = await moySklad<{ rows: MoySkladEntity[] }>(
    'GET',
    `/entity/${type}?filter=${encodeURIComponent(`name=${name}`)}&limit=10`,
  )
  const exact = result.rows.filter((row) => row.name === name)
  if (exact.length !== 1) throw new Error(`Expected one ${type} ${name}; found ${exact.length}.`)
  return exact[0]
}

function moySkladDate(value: string | undefined, label: string): Date {
  if (!value) throw new Error(`${label} has no moment.`)
  const parsed = new Date(value.replace(' ', 'T') + '+04:00')
  if (Number.isNaN(parsed.getTime())) throw new Error(`Invalid ${label} moment: ${value}`)
  return parsed
}

async function loadPlan() {
  const [customer, order, invoice, demand, payment, user, product, byNumber, byMoySkladId] =
    await Promise.all([
      moySklad<MoySkladEntity>('GET', `/entity/counterparty/${MOYSKLAD_CUSTOMER_ID}`),
      moySklad<MoySkladEntity>(
        'GET',
        `/entity/customerorder/${MOYSKLAD_ORDER_ID}?expand=state`,
      ),
      namedEntity('invoiceout', INVOICE_NUMBER),
      namedEntity('demand', DEMAND_NUMBER),
      namedEntity('paymentin', PAYMENT_NUMBER),
      prisma.user.findUnique({
        where: { email: EMAIL },
        include: { addresses: true },
      }),
      prisma.product.findUnique({
        where: { id: PRODUCT_ID },
        select: { id: true, productNumber: true, name: true, image: true },
      }),
      prisma.order.findMany({
        where: { orderNumber: ORDER_NUMBER },
        include: { items: true },
      }),
      prisma.order.findMany({
        where: { moySkladOrderId: MOYSKLAD_ORDER_ID },
        include: { items: true },
      }),
    ])

  if (!user || user.name !== 'Hind Lougay') throw new Error(`Unexpected website user for ${EMAIL}.`)
  if (!product || product.productNumber !== '53' || !/collagen mask/i.test(product.name)) {
    throw new Error('Website collagen product mismatch.')
  }
  if (customer.name !== 'Hind Lougay' || customer.email !== EMAIL) {
    throw new Error('MoySklad customer mismatch.')
  }
  if (order.id !== MOYSKLAD_ORDER_ID || order.name !== ORDER_NUMBER) {
    throw new Error('MoySklad order mismatch.')
  }
  for (const [label, entity] of [
    ['order', order],
    ['invoice', invoice],
    ['demand', demand],
    ['payment', payment],
  ] as const) {
    if (entity.sum !== TOTAL_AED * 100) {
      throw new Error(`${label} ${entity.name} sum is ${entity.sum}; expected ${TOTAL_AED * 100}.`)
    }
  }
  if (order.state?.name !== 'Доставлен' || order.payedSum !== TOTAL_AED * 100) {
    throw new Error(`MoySklad order is not delivered and fully paid.`)
  }

  const existing = [...byNumber, ...byMoySkladId]
  const existingIds = new Set(existing.map((row) => row.id))
  if (existingIds.size > 1) throw new Error('Conflicting website order duplicates found.')
  if (existing[0] && existing[0].customerEmail !== EMAIL) {
    throw new Error('Existing website order belongs to another customer.')
  }

  return { customer, order, invoice, demand, payment, user, product, existing: existing[0] || null }
}

async function commitPlan(plan: Awaited<ReturnType<typeof loadPlan>>) {
  await moySklad<MoySkladEntity>('PUT', `/entity/counterparty/${MOYSKLAD_CUSTOMER_ID}`, {
    phone: PHONE,
  })

  const orderDate = moySkladDate(plan.order.moment, 'order')
  const paidAt = moySkladDate(plan.payment.moment, 'payment')
  const deliveredAt = moySkladDate(plan.demand.moment, 'shipment')
  const vat = Number((TOTAL_AED - TOTAL_AED / 1.05).toFixed(2))
  const image = canonicalOrderItemImage(plan.product)

  const restored = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: plan.user.id },
      data: {
        phone: PHONE,
        address: `${ADDRESS_LINE1}, ${EMIRATE}`,
        moyskladCounterpartyId: MOYSKLAD_CUSTOMER_ID,
      },
    })
    await tx.address.updateMany({
      where: { userId: plan.user.id },
      data: { phone: PHONE },
    })

    if (plan.existing) {
      await tx.order.update({
        where: { id: plan.existing.id },
        data: {
          customerPhone: PHONE,
          status: 'DELIVERED',
          paymentStatus: 'paid',
          paidAt,
          deliveredAt,
          moySkladOrderId: MOYSKLAD_ORDER_ID,
          moySkladSyncedAt: orderDate,
        },
      })
      return tx.order.findUniqueOrThrow({
        where: { id: plan.existing.id },
        include: { items: true },
      })
    }

    return tx.order.create({
      data: {
        orderNumber: ORDER_NUMBER,
        customerEmail: EMAIL,
        customerName: plan.user.name,
        customerPhone: PHONE,
        customerEmirate: EMIRATE,
        customerAddress: ADDRESS_LINE1,
        orderNotes:
          `Restored from existing paid MoySklad chain: SO ${ORDER_NUMBER}, invoice ${INVOICE_NUMBER}, ` +
          `shipment ${DEMAND_NUMBER}, payment ${PAYMENT_NUMBER}. DO NOT push to MoySklad again.`,
        subtotal: TOTAL_AED,
        discountPercentage: 0,
        discountAmount: 0,
        shipping: 0,
        vat,
        total: TOTAL_AED,
        status: 'DELIVERED',
        locale: 'en',
        paymentMethod: 'cod',
        paymentStatus: 'paid',
        paidAt,
        deliveredAt,
        moySkladOrderId: MOYSKLAD_ORDER_ID,
        moySkladSyncedAt: orderDate,
        createdAt: orderDate,
        paymentMetadata: JSON.stringify({
          source: 'restored_moysklad_mirror',
          moySkladCustomerId: MOYSKLAD_CUSTOMER_ID,
          moySkladOrderId: MOYSKLAD_ORDER_ID,
          moySkladInvoice: INVOICE_NUMBER,
          moySkladDemand: DEMAND_NUMBER,
          moySkladPaymentin: PAYMENT_NUMBER,
          duplicateGuard: ORDER_NUMBER,
          restoredAt: new Date().toISOString(),
        }),
        items: {
          create: {
            productId: plan.product.id,
            productName: plan.product.name,
            price: TOTAL_AED,
            quantity: 1,
            image,
          },
        },
      },
      include: { items: true },
    })
  })

  const rewards = await awardPointsForDeliveredOrder(restored.id)
  if (!rewards) throw new Error('Failed to refresh delivered-order totals and rewards.')
  return { restored, rewards }
}

async function verify() {
  const [customer, user, order] = await Promise.all([
    moySklad<MoySkladEntity>('GET', `/entity/counterparty/${MOYSKLAD_CUSTOMER_ID}`),
    prisma.user.findUnique({
      where: { email: EMAIL },
      include: { addresses: true },
    }),
    prisma.order.findUnique({
      where: { orderNumber: ORDER_NUMBER },
      include: { items: true },
    }),
  ])
  if (customer.phone !== PHONE) throw new Error(`MoySklad phone verification failed: ${customer.phone}`)
  if (user?.phone !== PHONE || user.addresses.some((address) => address.phone !== PHONE)) {
    throw new Error('Website phone verification failed.')
  }
  if (
    !order ||
    order.customerPhone !== PHONE ||
    order.status !== 'DELIVERED' ||
    order.paymentStatus !== 'paid' ||
    order.total !== TOTAL_AED ||
    order.items.length !== 1 ||
    order.items[0].productId !== PRODUCT_ID ||
    order.items[0].quantity !== 1 ||
    order.items[0].price !== TOTAL_AED
  ) {
    throw new Error('Website order verification failed.')
  }
  return { customer, user, order }
}

async function main() {
  const plan = await loadPlan()
  console.log('====================================================================')
  console.log(`  Hind Lougay phone + ${ORDER_NUMBER} website restoration`)
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')
  console.log(`  Phone: ${plan.customer.phone || '—'} / ${plan.user.phone || '—'} → ${PHONE}`)
  console.log(`  Old transposed number: ${OLD_PHONE}`)
  console.log(`  MoySklad: ${plan.order.name} / ${plan.invoice.name} / ${plan.demand.name} / ${plan.payment.name}`)
  console.log(`  Chain: DELIVERED + paid / AED ${TOTAL_AED.toFixed(2)}`)
  console.log(`  Website order: ${plan.existing ? `exists (${plan.existing.id})` : 'missing — will restore'}`)
  console.log(`  Item: ${plan.product.name} ×1 @ AED ${TOTAL_AED.toFixed(2)}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const result = await commitPlan(plan)
  const checked = await verify()
  console.log(`\n  MoySklad phone: ${checked.customer.phone}`)
  console.log(`  Website user phone: ${checked.user?.phone}`)
  console.log(`  Website order: ${checked.order.orderNumber} / ${checked.order.status} / ${checked.order.paymentStatus}`)
  console.log(`  Website total: AED ${checked.order.total.toFixed(2)} / ${checked.order.items.length} item`)
  console.log(
    `  Rewards: awarded=${result.rewards.awarded} points=${result.rewards.points} ` +
      `balance=${result.rewards.balance}; lifetime ${checked.user?.totalOrders} order / AED ${checked.user?.totalSpent}`,
  )
}

main()
  .catch((error) => {
    console.error('FATAL:', error instanceof Error ? error.message : error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
