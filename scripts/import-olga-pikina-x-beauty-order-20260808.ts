/**
 * Mirror Olga Pikina's existing paid X Beauty Consulting MoySklad order into
 * her website account and award the normal products-only GENOSYS Rewards.
 *
 * MoySklad is read-only in this script. No email is sent.
 *
 * Preview:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/import-olga-pikina-x-beauty-order-20260808.ts
 *
 * Import + award:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/import-olga-pikina-x-beauty-order-20260808.ts --commit
 */
/* eslint-disable no-console */
import { estimateOrderPoints, getLedgerBalance, loyaltyTrackForUser } from '../lib/loyalty'
import { computeTier } from '../lib/membership'
import { canonicalOrderItemImage } from '../lib/orderItemImage'
import { prisma } from '../lib/prisma'

const API = 'https://api.moysklad.ru/api/remap/1.2'
const COMMIT = process.argv.includes('--commit')

const EMAIL = 'olgaku4eryava@gmail.com'
const OLGA_COUNTERPARTY_ID = '0555788f-90db-11f1-0a80-040c001fd737'
const SOURCE_COUNTERPARTY_ID = '03c174b0-4581-11ea-0a80-01f80012b189'
const SOURCE_COUNTERPARTY_NAME = 'X BEAUTY CONSULTING - F.Z.C'

const ORDER_NUMBER = 'GENCardM2606166868'
const ORDER_ID = '3d182dbb-698b-11f1-0a80-036400250fc0'
const INVOICE_NUMBER = '04688'
const INVOICE_ID = '1b60dd11-6a31-11f1-0a80-0e68000a7e9a'
const DEMAND_NUMBER = '06378'
const DEMAND_ID = 'bb643708-6ac4-11f1-0a80-048a00176896'
const PAYMENT_NUMBER = '05787'
const PAYMENT_ID = 'bef3d764-6ac4-11f1-0a80-134300169662'

const PHONE = '+971585775888'
const ADDRESS = 'The Greens and Views, Fairways East tower, Apt 1804'
const EMIRATE = 'Dubai'
const SUBTOTAL_AED = 745
const SHIPPING_AED = 45
const TOTAL_AED = 790
const VAT_AED = 37.62

type ExpectedLine = {
  productId: string
  websiteProductId: string
  code: string
  quantity: number
  unitAed: number
  discountPct: number
  size: string
  namePattern: RegExp
}

const PRODUCT_LINES: ExpectedLine[] = [
  {
    productId: 'be705c7d-9808-11ee-0a80-02460037622e',
    websiteProductId: '29',
    code: '54458',
    quantity: 1,
    unitAed: 145,
    discountPct: 0,
    size: '50g',
    namePattern: /hyaluron cream/i,
  },
  {
    productId: '8a087af0-8ab3-11ed-0a80-06c700c08673',
    websiteProductId: '14',
    code: '00188',
    quantity: 1,
    unitAed: 80,
    discountPct: 0,
    size: '80ml',
    namePattern: /microbiome energy infusing mist/i,
  },
  {
    productId: 'c7a5e201-d28a-11ef-0a80-11b100116a32',
    websiteProductId: '25',
    code: '54465',
    quantity: 1,
    unitAed: 220,
    discountPct: 0,
    size: '100g',
    namePattern: /soothing repair post\s?cream/i,
  },
  {
    productId: '89b90c39-da54-11f0-0a80-166700076a14',
    websiteProductId: 'cmk449na90077e9k5anpfqz4o',
    code: '54470',
    quantity: 1,
    unitAed: 300,
    discountPct: 0,
    size: '3ml x 4 ampoules',
    namePattern: /bio[ -]meso pdrn (?:expert )?ampoule 60000/i,
  },
]

const DELIVERY_LINE = {
  assortmentId: 'a97cfeeb-814e-11ea-0a80-004a001516bd',
  code: '00089',
  quantity: 1,
  unitAed: SHIPPING_AED,
  discountPct: 0,
}

type MoySkladEntity = {
  id: string
  name: string
  moment?: string
  sum?: number
  payedSum?: number
  invoicedSum?: number
  shippedSum?: number
  applicable?: boolean
  description?: string
  agent?: { id?: string; name?: string; meta?: { href?: string } }
  state?: { name?: string }
  customerOrder?: { meta?: { href?: string } }
  invoicesOut?: Array<{ meta?: { href?: string } }>
  payments?: Array<{ linkedSum?: number; meta?: { href?: string } }>
  operations?: Array<{ linkedSum?: number; meta?: { href?: string; type?: string } }>
}

type MoySkladPosition = {
  quantity: number
  price: number
  discount: number
  assortment?: {
    id?: string
    code?: string
    name?: string
    meta?: { href?: string; type?: string }
  }
}

function entityId(entity: { id?: string; meta?: { href?: string } } | undefined): string | null {
  return entity?.id || entity?.meta?.href?.split('/').pop()?.split('?')[0] || null
}

function normalizePhone(value: unknown): string {
  const digits = String(value || '').replace(/\D/g, '')
  if (digits.startsWith('971')) return digits
  if (digits.startsWith('0') && digits.length === 10) return `971${digits.slice(1)}`
  return digits
}

function moySkladDate(value: string | undefined): Date {
  if (!value) throw new Error('MoySklad document is missing its moment.')
  const parsed = new Date(value.replace(' ', 'T') + '+04:00')
  if (Number.isNaN(parsed.getTime())) throw new Error(`Invalid MoySklad moment: ${value}`)
  return parsed
}

function requireEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: found ${String(actual)}, expected ${String(expected)}.`)
  }
}

async function moySkladGet<T>(path: string, attempt = 1): Promise<T> {
  const login = process.env.MOYSKLAD_LOGIN
  const password = process.env.MOYSKLAD_PASSWORD
  if (!login || !password) throw new Error('MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD are required.')

  const response = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`,
      Accept: 'application/json;charset=utf-8',
    },
  })
  const text = await response.text()
  if ((response.status === 429 || response.status >= 500) && attempt < 5) {
    await new Promise((resolve) => setTimeout(resolve, 700 * attempt))
    return moySkladGet<T>(path, attempt + 1)
  }
  if (!response.ok) throw new Error(`MoySklad read failed: HTTP ${response.status} ${path}`)
  return JSON.parse(text) as T
}

function verifyAgent(entity: MoySkladEntity, label: string): void {
  requireEqual(entityId(entity.agent), SOURCE_COUNTERPARTY_ID, `${label} counterparty`)
}

function verifyPositions(positions: MoySkladPosition[]): void {
  requireEqual(positions.length, PRODUCT_LINES.length + 1, 'MoySklad position count')

  for (const expected of PRODUCT_LINES) {
    const position = positions.find((row) => entityId(row.assortment) === expected.productId)
    if (!position) throw new Error(`Missing MoySklad product ${expected.code}.`)
    requireEqual(position.assortment?.code, expected.code, `${expected.code} product code`)
    requireEqual(position.quantity, expected.quantity, `${expected.code} quantity`)
    requireEqual(position.price, expected.unitAed * 100, `${expected.code} unit price`)
    requireEqual(position.discount, expected.discountPct, `${expected.code} discount`)
    if (!expected.namePattern.test(position.assortment?.name || '')) {
      throw new Error(`${expected.code} product name does not match the expected catalog item.`)
    }
  }

  const delivery = positions.find((row) => entityId(row.assortment) === DELIVERY_LINE.assortmentId)
  if (!delivery) throw new Error('Missing Excellent Delivery Dubai line.')
  requireEqual(delivery.assortment?.code, DELIVERY_LINE.code, 'delivery code')
  requireEqual(delivery.quantity, DELIVERY_LINE.quantity, 'delivery quantity')
  requireEqual(delivery.price, DELIVERY_LINE.unitAed * 100, 'delivery unit price')
  requireEqual(delivery.discount, DELIVERY_LINE.discountPct, 'delivery discount')
}

async function loadAuthoritativeEvidence() {
  const [order, invoice, demand, payment, positions] = await Promise.all([
    moySkladGet<MoySkladEntity>(`/entity/customerorder/${ORDER_ID}?expand=agent,state`),
    moySkladGet<MoySkladEntity>(`/entity/invoiceout/${INVOICE_ID}?expand=agent,state`),
    moySkladGet<MoySkladEntity>(`/entity/demand/${DEMAND_ID}?expand=agent,state`),
    moySkladGet<MoySkladEntity>(`/entity/paymentin/${PAYMENT_ID}?expand=agent`),
    moySkladGet<{ rows: MoySkladPosition[] }>(
      `/entity/customerorder/${ORDER_ID}/positions?expand=assortment&limit=100`,
    ),
  ])

  requireEqual(order.name, ORDER_NUMBER, 'MoySklad SO number')
  requireEqual(invoice.name, INVOICE_NUMBER, 'MoySklad invoice number')
  requireEqual(demand.name, DEMAND_NUMBER, 'MoySklad shipment number')
  requireEqual(payment.name, PAYMENT_NUMBER, 'MoySklad payment number')

  for (const [label, entity] of [
    ['SO', order],
    ['invoice', invoice],
    ['shipment', demand],
    ['payment', payment],
  ] as const) {
    requireEqual(entity.sum, TOTAL_AED * 100, `${label} total`)
    verifyAgent(entity, label)
  }

  requireEqual(order.state?.name, 'Доставлен', 'SO state')
  requireEqual(order.payedSum, TOTAL_AED * 100, 'SO paid sum')
  requireEqual(order.invoicedSum, TOTAL_AED * 100, 'SO invoiced sum')
  requireEqual(order.shippedSum, TOTAL_AED * 100, 'SO shipped sum')
  requireEqual(invoice.customerOrder?.meta?.href?.endsWith(`/${ORDER_ID}`), true, 'invoice/SO link')
  requireEqual(demand.invoicesOut?.some((row) => row.meta?.href?.endsWith(`/${INVOICE_ID}`)), true, 'shipment/invoice link')
  requireEqual(demand.payments?.some(
    (row) => row.meta?.href?.endsWith(`/${PAYMENT_ID}`) && row.linkedSum === TOTAL_AED * 100,
  ), true, 'shipment/payment link')
  requireEqual(payment.operations?.some(
    (row) => row.meta?.type === 'demand'
      && row.meta?.href?.endsWith(`/${DEMAND_ID}`)
      && row.linkedSum === TOTAL_AED * 100,
  ), true, 'payment/shipment operation')
  requireEqual(payment.applicable, true, 'payment posted')

  const description = order.description || ''
  if (!/Fairways East/i.test(description)
      || !/Apartment 1804/i.test(description)
      || !/Оля/i.test(description)
      || !description.replace(/\D/g, '').includes('0585775888')) {
    throw new Error('SO description does not contain the authoritative Olga/address/phone attribution.')
  }

  verifyPositions(positions.rows)

  return {
    order,
    invoice,
    demand,
    payment,
    orderDate: moySkladDate(order.moment),
    deliveredAt: moySkladDate(demand.moment),
    paidAt: moySkladDate(payment.moment),
  }
}

async function loadWebsiteState() {
  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      birthday: true,
      discountType: true,
      discountPercentage: true,
      memberTier: true,
      loyaltyPoints: true,
      totalSpent: true,
      totalOrders: true,
      moyskladCounterpartyId: true,
    },
  })
  if (!user) throw new Error(`Website user ${EMAIL} was not found.`)
  requireEqual(user.moyskladCounterpartyId, OLGA_COUNTERPARTY_ID, 'Olga website/MoySklad link')
  if (user.phone && normalizePhone(user.phone) !== normalizePhone(PHONE)) {
    throw new Error('Olga already has a different non-empty website phone; refusing to overwrite it.')
  }

  const products = await prisma.product.findMany({
    where: { id: { in: PRODUCT_LINES.map((line) => line.websiteProductId) } },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      size: true,
      variants: { select: { size: true, price: true } },
    },
  })
  if (products.length !== PRODUCT_LINES.length) {
    throw new Error(`Expected ${PRODUCT_LINES.length} website products; found ${products.length}.`)
  }
  for (const expected of PRODUCT_LINES) {
    const product = products.find((row) => row.id === expected.websiteProductId)
    if (!product || !expected.namePattern.test(product.name)) {
      throw new Error(`Website product ${expected.websiteProductId} does not match ${expected.code}.`)
    }
    if (expected.websiteProductId === '25') {
      const variant = product.variants.find((row) => row.size === '100g')
      requireEqual(variant?.price, 440, 'Postcream 100g website variant price')
    }
  }

  const [byNumber, byMoySkladId] = await Promise.all([
    prisma.order.findMany({ where: { orderNumber: ORDER_NUMBER }, include: { items: true } }),
    prisma.order.findMany({ where: { moySkladOrderId: ORDER_ID }, include: { items: true } }),
  ])
  const existingIds = new Set([...byNumber, ...byMoySkladId].map((order) => order.id))
  if (existingIds.size > 1) throw new Error('Conflicting website duplicates already exist.')
  const existing = [...byNumber, ...byMoySkladId][0] || null
  if (existing && existing.customerEmail !== EMAIL) {
    throw new Error(`Existing website order belongs to ${existing.customerEmail}, not Olga.`)
  }

  const existingEarn = existing
    ? await prisma.loyaltyTransaction.findUnique({
        where: { orderId_type: { orderId: existing.id, type: 'ORDER_EARN' } },
      })
    : null
  const ledgerBalance = await getLedgerBalance(user.id)

  return { user, products, existing, existingEarn, ledgerBalance }
}

function validateExistingOrder(
  order: Awaited<ReturnType<typeof loadWebsiteState>>['existing'],
  expectedPoints: number,
  existingEarn: Awaited<ReturnType<typeof loadWebsiteState>>['existingEarn'],
): void {
  if (!order) return
  requireEqual(order.customerEmail, EMAIL, 'existing order email')
  requireEqual(order.status, 'DELIVERED', 'existing order state')
  requireEqual(order.paymentStatus, 'paid', 'existing payment state')
  requireEqual(order.subtotal, SUBTOTAL_AED, 'existing subtotal')
  requireEqual(order.shipping, SHIPPING_AED, 'existing shipping')
  requireEqual(order.total, TOTAL_AED, 'existing total')
  requireEqual(order.discountPercentage ?? 0, 0, 'existing discount percentage')
  requireEqual(order.discountAmount, 0, 'existing discount amount')
  requireEqual(order.items.length, PRODUCT_LINES.length, 'existing item count')
  for (const expected of PRODUCT_LINES) {
    const item = order.items.find((row) => row.productId === expected.websiteProductId)
    if (!item) throw new Error(`Existing order is missing website product ${expected.websiteProductId}.`)
    requireEqual(item.quantity, expected.quantity, `${expected.code} existing quantity`)
    requireEqual(item.price, expected.unitAed, `${expected.code} existing price`)
    requireEqual(item.size, expected.size, `${expected.code} existing size`)
  }
  if (existingEarn) requireEqual(existingEarn.points, expectedPoints, 'existing loyalty award')
}

async function calculateHistoricalPoints(user: Awaited<ReturnType<typeof loadWebsiteState>>['user'], orderDate: Date) {
  const prior = await prisma.order.aggregate({
    where: {
      customerEmail: EMAIL,
      status: 'DELIVERED',
      createdAt: { lt: orderDate },
      orderNumber: { not: ORDER_NUMBER },
    },
    _sum: { total: true },
    _count: true,
  })
  const historicalTier = computeTier(prior._sum.total ?? 0, prior._count)
  const points = estimateOrderPoints({
    total: TOTAL_AED,
    shipping: SHIPPING_AED,
    user: { ...user, memberTier: historicalTier },
  })
  return { historicalTier, points }
}

async function printPlan() {
  const evidence = await loadAuthoritativeEvidence()
  const website = await loadWebsiteState()
  const historical = await calculateHistoricalPoints(website.user, evidence.orderDate)
  validateExistingOrder(website.existing, historical.points, website.existingEarn)

  console.log(`=== OLGA PREVIOUS ORDER IMPORT (${COMMIT ? 'COMMIT' : 'DRY RUN'}) ===`)
  console.log(`MoySklad chain: SO ${ORDER_NUMBER} / invoice ${INVOICE_NUMBER} / shipment ${DEMAND_NUMBER} / payment ${PAYMENT_NUMBER}`)
  console.log(`Source channel: ${SOURCE_COUNTERPARTY_NAME}; SO description identifies Olya at Olga's exact address and phone`)
  console.log('Items: 54458 @145 + 00188 @80 + 54465 @220 + 54470 @300; all qty 1, discount 0%')
  console.log(`Amounts: products AED ${SUBTOTAL_AED.toFixed(2)} + delivery AED ${SHIPPING_AED.toFixed(2)} = AED ${TOTAL_AED.toFixed(2)}`)
  console.log(`MoySklad status: delivered, shipped and payment ${PAYMENT_NUMBER} posted/linked for AED ${TOTAL_AED.toFixed(2)}`)
  console.log(`Website duplicate: ${website.existing ? website.existing.id : 'none'}`)
  console.log(`Rewards: historical tier ${historical.historicalTier}, +${historical.points}; current ledger ${website.ledgerBalance}`)
  console.log(`Expected final balance: ${website.existingEarn ? website.ledgerBalance : website.ledgerBalance + historical.points}`)
  console.log(`Phone: ${website.user.phone ? 'already matches authoritative value' : 'will add from SO attribution'}`)
  console.log('Email: disabled; this script has no email path')

  return { evidence, website, historical }
}

async function importOrder() {
  const plan = await printPlan()
  const productById = new Map(plan.website.products.map((product) => [product.id, product]))

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { email: EMAIL },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        birthday: true,
        discountType: true,
        discountPercentage: true,
        moyskladCounterpartyId: true,
      },
    })
    if (!user) throw new Error('Olga website user disappeared before commit.')
    requireEqual(user.moyskladCounterpartyId, OLGA_COUNTERPARTY_ID, 'Olga website/MoySklad link at commit')
    if (user.phone && normalizePhone(user.phone) !== normalizePhone(PHONE)) {
      throw new Error('Olga phone changed before commit; refusing to overwrite it.')
    }

    const prior = await tx.order.aggregate({
      where: {
        customerEmail: EMAIL,
        status: 'DELIVERED',
        createdAt: { lt: plan.evidence.orderDate },
        orderNumber: { not: ORDER_NUMBER },
      },
      _sum: { total: true },
      _count: true,
    })
    const historicalTier = computeTier(prior._sum.total ?? 0, prior._count)
    const expectedPoints = estimateOrderPoints({
      total: TOTAL_AED,
      shipping: SHIPPING_AED,
      user: { ...user, memberTier: historicalTier },
    })
    requireEqual(loyaltyTrackForUser(user), 'REWARDS', 'Olga loyalty track')
    requireEqual(expectedPoints, plan.historical.points, 'commit-time expected points')

    const [byNumber, byMoySkladId] = await Promise.all([
      tx.order.findMany({ where: { orderNumber: ORDER_NUMBER }, include: { items: true } }),
      tx.order.findMany({ where: { moySkladOrderId: ORDER_ID }, include: { items: true } }),
    ])
    const existingIds = new Set([...byNumber, ...byMoySkladId].map((order) => order.id))
    if (existingIds.size > 1) throw new Error('Conflicting website duplicates appeared before commit.')
    let order = [...byNumber, ...byMoySkladId][0] || null
    if (order && order.customerEmail !== EMAIL) {
      throw new Error('Existing order belongs to a different website user.')
    }

    let created = false
    if (!order) {
      order = await tx.order.create({
        data: {
          orderNumber: ORDER_NUMBER,
          customerEmail: EMAIL,
          customerName: user.name,
          customerPhone: PHONE,
          customerEmirate: EMIRATE,
          customerAddress: ADDRESS,
          orderNotes:
            `Imported from existing paid MoySklad chain under ${SOURCE_COUNTERPARTY_NAME}: ` +
            `SO ${ORDER_NUMBER}, invoice ${INVOICE_NUMBER}, shipment ${DEMAND_NUMBER}, payment ${PAYMENT_NUMBER}. ` +
            'The SO description identifies Olya at this exact address and phone. DO NOT push to MoySklad again.',
          subtotal: SUBTOTAL_AED,
          discountPercentage: 0,
          discountAmount: 0,
          shipping: SHIPPING_AED,
          vat: VAT_AED,
          total: TOTAL_AED,
          status: 'DELIVERED',
          locale: 'en',
          paymentMethod: 'bank_transfer',
          paymentStatus: 'paid',
          paidAt: plan.evidence.paidAt,
          deliveredAt: plan.evidence.deliveredAt,
          moySkladOrderId: ORDER_ID,
          moySkladSyncedAt: plan.evidence.orderDate,
          createdAt: plan.evidence.orderDate,
          paymentMetadata: JSON.stringify({
            source: 'manual_moysklad_mirror',
            sourceCounterpartyId: SOURCE_COUNTERPARTY_ID,
            sourceCounterpartyName: SOURCE_COUNTERPARTY_NAME,
            moySkladOrderId: ORDER_ID,
            moySkladInvoiceId: INVOICE_ID,
            moySkladInvoice: INVOICE_NUMBER,
            moySkladDemandId: DEMAND_ID,
            moySkladDemand: DEMAND_NUMBER,
            moySkladPaymentinId: PAYMENT_ID,
            moySkladPaymentin: PAYMENT_NUMBER,
            duplicateGuard: ORDER_NUMBER,
            emailSent: false,
          }),
          items: {
            create: PRODUCT_LINES.map((line) => {
              const product = productById.get(line.websiteProductId)
              if (!product) throw new Error(`Website product ${line.websiteProductId} disappeared.`)
              return {
                productId: product.id,
                productName: product.name,
                price: line.unitAed,
                quantity: line.quantity,
                image: canonicalOrderItemImage(product),
                size: line.size,
              }
            }),
          },
        },
        include: { items: true },
      })
      created = true
    }

    const existingEarn = await tx.loyaltyTransaction.findUnique({
      where: { orderId_type: { orderId: order.id, type: 'ORDER_EARN' } },
    })
    validateExistingOrder(order, expectedPoints, existingEarn)
    let awarded = false
    if (!existingEarn) {
      await tx.loyaltyTransaction.create({
        data: {
          userId: user.id,
          points: expectedPoints,
          type: 'ORDER_EARN',
          orderId: order.id,
          description: `Order ${ORDER_NUMBER} delivered — AED ${SUBTOTAL_AED.toFixed(2)} in products`,
        },
      })
      awarded = true
    }

    const [stats, ledger] = await Promise.all([
      tx.order.aggregate({
        where: { customerEmail: EMAIL, status: 'DELIVERED' },
        _sum: { total: true },
        _count: true,
      }),
      tx.loyaltyTransaction.aggregate({
        where: { userId: user.id },
        _sum: { points: true },
      }),
    ])
    const totalSpent = stats._sum.total ?? 0
    const totalOrders = stats._count
    const tier = computeTier(totalSpent, totalOrders)
    const balance = ledger._sum.points ?? 0

    await tx.user.update({
      where: { id: user.id },
      data: {
        phone: PHONE,
        totalSpent,
        totalOrders,
        memberTier: tier,
        loyaltyPoints: balance,
      },
    })

    return { orderId: order.id, created, awarded, points: expectedPoints, balance, totalSpent, totalOrders, tier }
  }, { maxWait: 15_000, timeout: 60_000 })

  console.log(
    `Commit result: order=${result.orderId}; created=${result.created}; ` +
    `awarded=${result.awarded}; points=${result.points}; balance=${result.balance}; tier=${result.tier}`,
  )
  return verifyFinalState()
}

async function verifyFinalState() {
  const plan = await printPlan()
  if (!plan.website.existing) throw new Error('Final verification failed: website order missing.')

  const [numberCount, moySkladCount, earnCount, user] = await Promise.all([
    prisma.order.count({ where: { orderNumber: ORDER_NUMBER } }),
    prisma.order.count({ where: { moySkladOrderId: ORDER_ID } }),
    prisma.loyaltyTransaction.count({
      where: { orderId: plan.website.existing.id, type: 'ORDER_EARN' },
    }),
    prisma.user.findUnique({
      where: { email: EMAIL },
      select: { phone: true, loyaltyPoints: true, totalSpent: true, totalOrders: true, memberTier: true },
    }),
  ])
  const balance = await getLedgerBalance(plan.website.user.id)
  validateExistingOrder(plan.website.existing, plan.historical.points, plan.website.existingEarn)

  console.log('=== FINAL VERIFICATION ===')
  console.log(`Website duplicates: orderNumber=${numberCount}, moySkladOrderId=${moySkladCount}`)
  console.log(`Order items=${plan.website.existing.items.length}; ORDER_EARN rows=${earnCount}`)
  console.log(`Points: ledger=${balance}, user=${user?.loyaltyPoints}; phone matches=${normalizePhone(user?.phone) === normalizePhone(PHONE)}`)
  console.log(`Lifetime: AED ${user?.totalSpent}, orders=${user?.totalOrders}, tier=${user?.memberTier}`)
  console.log('Email sent: no')

  if (numberCount !== 1 || moySkladCount !== 1 || earnCount !== 1) {
    throw new Error('Duplicate or missing final records detected.')
  }
  if (balance !== user?.loyaltyPoints) throw new Error('Ledger/materialized loyalty balance mismatch.')
  if (normalizePhone(user?.phone) !== normalizePhone(PHONE)) throw new Error('Authoritative phone was not stored.')
}

async function main() {
  if (COMMIT) {
    await importOrder()
  } else {
    await printPlan()
    console.log('Dry run only. Re-run with --commit after reviewing this evidence.')
  }
}

main()
  .catch((error) => {
    console.error('FATAL:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
