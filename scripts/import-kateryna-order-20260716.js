/**
 * Add a one-off paid order to the website DB for Kateryna Sierova
 * (kateryna.sierova10@gmail.com) as DELIVERED + PAID, and award GENOSYS
 * Rewards points (REWARDS track).
 *
 *   SNOW O₂ CLEANSER 180ml                          330
 *   EZ CO₂ MASK KIT                                 460
 *   SKIN CARING BLEMISH BALM CUSHION #3 Camel       300
 *   retail subtotal 1,090 + delivery 45 → total 1,135
 *
 * Sale handled outside the website — mirrors into site DB for history +
 * points. Must NOT be pushed to MoySklad.
 *
 * Dry-run:  node scripts/import-kateryna-order-20260716.js
 * Commit:   node scripts/import-kateryna-order-20260716.js --commit
 *
 * Loyalty logic mirrors lib/loyalty.ts awardPointsForDeliveredOrder exactly.
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
const { PrismaClient } = require('@prisma/client')

const COMMIT = process.argv.includes('--commit')
const EMAIL = 'kateryna.sierova10@gmail.com'
const ORDER_NUMBER = 'MSK-KATERYNA-160726'
const ORDER_DATE = new Date('2026-07-16T05:30:00.000Z')

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
const LINES = [
  { productId: '10', name: 'SNOW O₂ CLEANSER 180ml', retail: 330, qty: 1, size: '180ml' },
  { productId: '38', name: 'EZ CO₂ MASK KIT', retail: 460, qty: 1 },
  {
    productId: '41',
    name: 'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] — #3 Camel',
    retail: 300,
    qty: 1,
    color: 'Camel',
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
  if (slash) return parseInt(slash[2], 10) === now.getMonth() + 1 // DD/MM/YYYY
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
  for (const line of LINES) {
    const product = await prisma.product.findUnique({
      where: { id: line.productId },
      select: { id: true, name: true, price: true, image: true },
    })
    if (!product) throw new Error('Product not found: ' + line.productId + ' (' + line.name + ')')
    if (Number(product.price) !== line.retail && !line.size) {
      console.warn(`⚠️  retail mismatch for ${line.name}: given ${line.retail} vs DB ${product.price}`)
    }
    const unit = r2(line.retail * (1 - DISCOUNT_PCT / 100))
    subtotal += unit * line.qty
    retailSum += line.retail * line.qty
    items.push({
      productId: product.id,
      productName: line.name,
      price: unit,
      quantity: line.qty,
      image: product.image || IMAGE_FALLBACK,
      ...(line.size ? { size: line.size } : {}),
      ...(line.color ? { color: line.color } : {}),
    })
  }
  subtotal = r2(subtotal)
  const shipping = SHIPPING
  const total = r2(subtotal + shipping)
  const vat = r2((total * 5) / 105)
  const discountAmount = r2(retailSum - subtotal)

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
    '| account discount:',
    user.discountType,
    user.discountPercentage,
  )
  console.log('Order:', ORDER_NUMBER, '| date:', ORDER_DATE.toISOString().slice(0, 10))
  console.table(items.map((i) => ({ product: i.productName, qty: i.quantity, unit: i.price, size: i.size, color: i.color })))
  console.log({ retailSum, discountPct: DISCOUNT_PCT, discountAmount, subtotal, shipping, vat, total })
  console.log(`Loyalty: +${points} pts (basis AED ${productSpend.toFixed(2)}), birthdayMonth=${bday}`)
  console.log(
    `Expected new balance: ${user.loyaltyPoints} + ${points} = ${user.loyaltyPoints + points} (final = ledger sum)`,
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
    console.log('Order already exists:', existing.id, '— skipping create, will (re)award points idempotently.')
  }

  const order =
    existing ||
    (await prisma.order.create({
      data: {
        orderNumber: ORDER_NUMBER,
        customerEmail: user.email,
        customerName: (user.name || user.email).trim(),
        customerPhone: user.phone || '+971562190979',
        customerEmirate: 'Dubai',
        customerAddress: user.address || 'Oasis Villas 13, JVC, Dubai',
        orderNotes:
          'Manually recorded paid order (retail prices, delivery 45 AED). Handled outside the website — DO NOT push to MoySklad.',
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
        moySkladOrderId: ORDER_NUMBER,
        moySkladSyncedAt: ORDER_DATE,
        createdAt: ORDER_DATE,
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
    data: { totalSpent, totalOrders, memberTier: tier, loyaltyPoints: balance },
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
