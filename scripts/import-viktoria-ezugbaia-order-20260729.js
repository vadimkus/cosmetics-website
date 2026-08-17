/**
 * Mirror MoySklad paid order GENCardM2607291561 into website DB for
 * Viktoria Ezugbaia (vika.ezu@alcenza.ae) — DELIVERED + PAID + GENOSYS Rewards.
 *
 * Already in MoySklad (SO/inv/ship/pay) — DO NOT push again.
 *
 *   Dry-run:  node --import dotenv/config scripts/import-viktoria-ezugbaia-order-20260729.js
 *   Commit:   node --import dotenv/config scripts/import-viktoria-ezugbaia-order-20260729.js --commit
 *
 * Prefer: npx tsx --env-file=.env.local scripts/import-viktoria-ezugbaia-order-20260729.js --commit
 */

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
const { PrismaClient } = require('@prisma/client')

const COMMIT = process.argv.includes('--commit')
const EMAIL = 'vika.ezu@alcenza.ae'
const ORDER_NUMBER = 'GENCardM2607291561'
const MOYSKLAD_ORDER_UUID = 'd6f886a1-8b32-11f1-0a80-06b7001371fd'
const ORDER_DATE = new Date('2026-07-29T09:50:00.000Z') // ~13:50 UAE

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('No DATABASE_URL')
  process.exit(1)
}
let prisma
if (databaseUrl.startsWith('prisma+') || databaseUrl.includes('accelerate') || databaseUrl.includes('prisma.io')) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })
} else {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  prisma = new PrismaClient({
    adapter: new PrismaPg(new Pool({ connectionString: databaseUrl })),
    log: ['error'],
  })
}

const DISCOUNT_PCT = 0
const SHIPPING = 45
const IMAGE_FALLBACK = '/images/genosys-logo-transparent.png'

/** Paid lines (earn points). FOC listed separately at 0 for history. */
const PAID_LINES = [
  {
    productId: '41',
    name: 'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] — #3 Camel',
    retail: 300,
    qty: 1,
    color: 'Camel',
  },
  {
    productId: '20',
    name: 'PROBLEM CONTROL SERUM',
    retail: 330,
    qty: 1,
  },
]

const FOC_LINES = [
  {
    productId: 'cmgj9ifoi00008o07p4eqmfb7',
    name: 'INTENSIVE REPAIR COLLAGEN MASK (FOC)',
    retail: 0,
    qty: 1,
  },
  {
    productId: '36',
    name: 'SOOTHING BOMB SEA ALGAE MASK (FOC)',
    retail: 0,
    qty: 1,
  },
]

const r2 = (n) => Math.round(n * 100) / 100

const POINTS_PER_AED = 1
const TIER_MULTIPLIERS = { MEMBER: 1, SILVER: 1.25, GOLD: 1.5, PLATINUM: 2 }
const computeTier = (spent, orders) =>
  spent >= 15000 || orders >= 25
    ? 'PLATINUM'
    : spent >= 5000 || orders >= 10
      ? 'GOLD'
      : spent >= 1000 || orders >= 3
        ? 'SILVER'
        : 'MEMBER'
const isBirthdayMonth = (bday, now = new Date()) => {
  const iso = String(bday || '').match(/^\d{4}-(\d{2})-\d{2}/)
  if (iso) return parseInt(iso[1], 10) === now.getMonth() + 1
  const slash = String(bday || '').match(/^(\d{2})\/(\d{2})\/\d{4}/)
  if (slash) return parseInt(slash[2], 10) === now.getMonth() + 1
  return false
}

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      discountType: true,
      discountPercentage: true,
      memberTier: true,
      birthday: true,
      loyaltyPoints: true,
    },
  })
  if (!user) throw new Error('User not found: ' + EMAIL)

  const isPartner = Boolean(user.discountType) && (user.discountPercentage ?? 0) >= 20
  const track = isPartner ? 'PARTNER' : 'REWARDS'

  const items = []
  let subtotal = 0
  let retailSum = 0

  for (const line of [...PAID_LINES, ...FOC_LINES]) {
    const product = await prisma.product.findUnique({
      where: { id: line.productId },
      select: { id: true, name: true, price: true, image: true },
    })
    if (!product) throw new Error('Product not found: ' + line.productId + ' (' + line.name + ')')
    const unit = r2(line.retail * (1 - DISCOUNT_PCT / 100))
    subtotal += unit * line.qty
    retailSum += Math.max(line.retail, 0) * line.qty
    items.push({
      productId: product.id,
      productName: line.name,
      price: unit,
      quantity: line.qty,
      image: product.image || IMAGE_FALLBACK,
      ...(line.color ? { color: line.color } : {}),
    })
  }
  subtotal = r2(subtotal)
  const shipping = SHIPPING
  const total = r2(subtotal + shipping)
  const vat = r2((total * 5) / 105)
  const discountAmount = r2(Math.max(0, retailSum - subtotal))

  const prevTier = user.memberTier || 'MEMBER'
  const productSpend = Math.max(0, total - shipping)
  const bday = isBirthdayMonth(user.birthday)
  const base = productSpend * POINTS_PER_AED * (TIER_MULTIPLIERS[prevTier] || 1)
  const points = track === 'PARTNER' ? 0 : Math.floor(bday ? base * 2 : base)

  console.log('=== IMPORT PLAN (', COMMIT ? 'COMMIT' : 'DRY-RUN', ') ===')
  console.log(
    'Customer:',
    user.name,
    `<${user.email}>`,
    '| track:',
    track,
    '| tier:',
    prevTier,
    '| points now:',
    user.loyaltyPoints,
  )
  console.log('Order:', ORDER_NUMBER, '| MoySklad:', MOYSKLAD_ORDER_UUID)
  console.table(
    items.map((i) => ({ product: i.productName, qty: i.quantity, unit: i.price, color: i.color })),
  )
  console.log({ retailSum, subtotal, shipping, vat, total })
  console.log(`Loyalty: +${points} pts (basis AED ${productSpend.toFixed(2)}), birthdayMonth=${bday}`)
  console.log(
    `Expected new balance: ${user.loyaltyPoints} + ${points} = ${user.loyaltyPoints + points}`,
  )

  if (!COMMIT) {
    console.log('\nDRY-RUN only. Re-run with --commit to write.')
    await prisma.$disconnect()
    return
  }

  const existing = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    select: { id: true },
  })
  if (existing) {
    console.log('Order already exists:', existing.id, '— will (re)award points idempotently.')
  }

  const shipAddress = 'Marina Diamond 5, App 307, Dubai'

  const order =
    existing ||
    (await prisma.order.create({
      data: {
        orderNumber: ORDER_NUMBER,
        customerEmail: user.email,
        customerName: (user.name || user.email).trim(),
        customerPhone: user.phone || '+971526091561',
        customerEmirate: 'Dubai',
        customerAddress: shipAddress,
        orderNotes:
          'Manual paid order mirrored from MoySklad GENCardM2607291561 / inv 04868 / ship 06600 / pay 05993. Camel cushion + Problem Control Serum + delivery 45; red+green masks FOC; testers FOC in MoySklad only. DO NOT push to MoySklad again.',
        subtotal,
        discountPercentage: DISCOUNT_PCT,
        discountAmount,
        shipping,
        vat,
        total,
        status: 'DELIVERED',
        locale: 'en',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        paidAt: ORDER_DATE,
        deliveredAt: ORDER_DATE,
        moySkladOrderId: MOYSKLAD_ORDER_UUID,
        moySkladSyncedAt: ORDER_DATE,
        createdAt: ORDER_DATE,
        paymentMetadata: JSON.stringify({
          source: 'manual_moysklad_mirror',
          moySkladInvoice: '04868',
          moySkladDemand: '06600',
          moySkladPaymentin: '05993',
        }),
        items: { create: items },
      },
      select: { id: true, orderNumber: true },
    }))
  console.log('✅ Order row:', order.id, order.orderNumber || ORDER_NUMBER)

  if (track !== 'PARTNER' && points > 0) {
    try {
      await prisma.loyaltyTransaction.create({
        data: {
          userId: user.id,
          points,
          type: 'ORDER_EARN',
          orderId: order.id,
          description: `Order ${ORDER_NUMBER} delivered — AED ${productSpend.toFixed(2)} in products`,
        },
      })
      console.log(`✅ Awarded +${points} pts`)
    } catch (err) {
      if (err && err.code === 'P2002') console.log('ℹ️  Points already awarded for this order — skipped.')
      else throw err
    }
  }

  const agg = await prisma.order.aggregate({
    where: { customerEmail: user.email, status: 'DELIVERED' },
    _sum: { total: true },
    _count: true,
  })
  const totalSpent = agg._sum.total ?? 0
  const totalOrders = agg._count ?? 0
  const tier = computeTier(totalSpent, totalOrders)
  const ledger = await prisma.loyaltyTransaction.aggregate({
    where: { userId: user.id },
    _sum: { points: true },
  })
  const balance = ledger._sum.points ?? 0
  await prisma.user.update({
    where: { id: user.id },
    data: {
      totalSpent,
      totalOrders,
      memberTier: tier,
      loyaltyPoints: balance,
      phone: user.phone || '+971526091561',
      address: shipAddress,
    },
  })

  console.log(
    `✅ User refreshed — totalSpent AED ${totalSpent}, orders ${totalOrders}, tier ${tier}, points balance ${balance}`,
  )
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('❌', e)
  process.exit(1)
})
