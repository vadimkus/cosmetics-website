/**
 * Add a one-off paid order to the website DB for Iryna Sarazhynska
 * (irina.adel89@gmail.com) as DELIVERED + PAID, and award GENOSYS Rewards
 * points (REWARDS track).
 *
 *   MULTI VITA RADIANCE SERUM   330
 *   MULTI VITA RADIANCE CREAM   290 (50g)
 *   subtotal 620 − 10% (one-off) = 558
 *   delivery 45 → total 603, already paid
 *
 * The sale was handled outside the website — this only mirrors it into the
 * site DB for history + points. It must NOT be pushed to MoySklad.
 *
 * Dry-run:  node scripts/import-iryna-order-20260711.js
 * Commit:   node scripts/import-iryna-order-20260711.js --commit
 *
 * Loyalty logic mirrors lib/loyalty.ts awardPointsForDeliveredOrder exactly.
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
const { PrismaClient } = require('@prisma/client')

const COMMIT = process.argv.includes('--commit')
const EMAIL = 'irina.adel89@gmail.com'
const ORDER_NUMBER = 'MSK-IRYNA-110726'
const ORDER_DATE = new Date('2026-07-11T07:00:00.000Z')

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) { console.error('No DATABASE_URL'); process.exit(1) }
let prisma
if (databaseUrl.startsWith('prisma+')) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })
} else {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  prisma = new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: databaseUrl })), log: ['error'] })
}

// One-off 10% discount on this order only. Delivery 45 AED (no discount on delivery).
const DISCOUNT_PCT = 10
const SHIPPING = 45
const LINES = [
  { productId: '21', name: 'Genosys Multi Vita Radiance Serum 30ml', retail: 330, qty: 1, size: '30ml' },
  { productId: '31', name: 'Genosys Multi Vita Radiance Cream 50g', retail: 290, qty: 1, size: '50g' },
]

const r2 = (n) => Math.round(n * 100) / 100

// ── loyalty constants (mirror lib/loyalty.ts + lib/membership.ts) ──
const POINTS_PER_AED = 1
const TIER_MULTIPLIERS = { MEMBER: 1, SILVER: 1.25, GOLD: 1.5, PLATINUM: 2 }
const computeTier = (spent, orders) =>
  spent >= 15000 || orders >= 25 ? 'PLATINUM'
  : spent >= 5000 || orders >= 10 ? 'GOLD'
  : spent >= 1000 || orders >= 3 ? 'SILVER'
  : 'MEMBER'
const isBirthdayMonth = (bday, now = new Date()) => {
  const m = String(bday || '').match(/^\d{4}-(\d{2})-\d{2}/)
  return m ? parseInt(m[1], 10) === now.getMonth() + 1 : false
}

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    select: { id: true, email: true, name: true, phone: true, address: true, discountType: true, discountPercentage: true, memberTier: true, birthday: true, loyaltyPoints: true },
  })
  if (!user) throw new Error('User not found: ' + EMAIL)

  const isPartner = Boolean(user.discountType) && (user.discountPercentage ?? 0) >= 20
  const track = isPartner ? 'PARTNER' : 'REWARDS'

  // Build items from DB products (unit prices at 10% off retail, incl VAT)
  const items = []
  let subtotal = 0
  let retailSum = 0
  for (const line of LINES) {
    const product = await prisma.product.findUnique({ where: { id: line.productId }, select: { id: true, name: true, price: true, image: true } })
    if (!product) throw new Error('Product not found: ' + line.productId + ' (' + line.name + ')')
    if (Number(product.price) !== line.retail) {
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
      image: product.image || '/images/placeholder.jpg',
      ...(line.size ? { size: line.size } : {}),
    })
  }
  subtotal = r2(subtotal)
  const shipping = SHIPPING
  const total = r2(subtotal + shipping)
  const vat = r2((total * 5) / 105)
  const discountAmount = r2(retailSum - subtotal)

  // Loyalty preview (mirror awardPointsForDeliveredOrder — shipping excluded)
  const prevTier = user.memberTier || 'MEMBER'
  const productSpend = Math.max(0, total - shipping)
  const bday = isBirthdayMonth(user.birthday)
  const base = productSpend * POINTS_PER_AED * (TIER_MULTIPLIERS[prevTier] || 1)
  const points = track === 'PARTNER' ? 0 : Math.floor(bday ? base * 2 : base)

  console.log('=== IMPORT PLAN (', COMMIT ? 'COMMIT' : 'DRY-RUN', ') ===')
  console.log('Customer:', user.name, `<${user.email}>`, '| track:', track, '| tier:', prevTier, '| points now:', user.loyaltyPoints)
  console.log('Order:', ORDER_NUMBER, '| date:', ORDER_DATE.toISOString().slice(0, 10))
  console.table(items.map((i) => ({ product: i.productName, qty: i.quantity, unit: i.price })))
  console.log({ retailSum, discountPct: DISCOUNT_PCT, discountAmount, subtotal, shipping, vat, total })
  console.log(`Loyalty: +${points} pts (basis AED ${productSpend.toFixed(2)}), birthdayMonth=${bday}`)
  console.log(`Expected new balance: ${user.loyaltyPoints} + ${points} = ${user.loyaltyPoints + points} (final = ledger sum)`)

  if (!COMMIT) {
    console.log('\nDRY-RUN only. Re-run with --commit to write.')
    await prisma.$disconnect()
    return
  }

  const existing = await prisma.order.findUnique({ where: { orderNumber: ORDER_NUMBER }, select: { id: true } })
  if (existing) {
    console.log('Order already exists:', existing.id, '— skipping create, will (re)award points idempotently.')
  }

  const order = existing || await prisma.order.create({
    data: {
      orderNumber: ORDER_NUMBER,
      customerEmail: user.email,
      customerName: (user.name || user.email).trim(),
      customerPhone: user.phone || '+971 50 185 4130',
      customerEmirate: 'Dubai',
      customerAddress: user.address || 'Town Square, Rawda Parkviews 3, 1111, Dubai',
      orderNotes: 'Manually recorded paid order (one-off 10% discount, delivery 45 AED). Handled outside the website — DO NOT push to MoySklad.',
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
      // Mark as already handled so the admin "Push" button treats it as synced.
      moySkladOrderId: ORDER_NUMBER,
      moySkladSyncedAt: ORDER_DATE,
      createdAt: ORDER_DATE,
      items: { create: items },
    },
    select: { id: true, orderNumber: true },
  })
  console.log('✅ Order row:', order.id, order.orderNumber || ORDER_NUMBER)

  // ── Award points (idempotent via (orderId, type) unique) ──
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

  // Refresh stats + materialized balance (mirror awardPointsForDeliveredOrder)
  const agg = await prisma.order.aggregate({ where: { customerEmail: user.email, status: 'DELIVERED' }, _sum: { total: true }, _count: true })
  const totalSpent = agg._sum.total ?? 0
  const totalOrders = agg._count ?? 0
  const tier = computeTier(totalSpent, totalOrders)
  const ledger = await prisma.loyaltyTransaction.aggregate({ where: { userId: user.id }, _sum: { points: true } })
  const balance = ledger._sum.points ?? 0
  await prisma.user.update({ where: { id: user.id }, data: { totalSpent, totalOrders, memberTier: tier, loyaltyPoints: balance } })

  console.log(`✅ User refreshed — totalSpent AED ${totalSpent}, orders ${totalOrders}, tier ${tier}, points balance ${balance}`)
  await prisma.$disconnect()
}

main().catch((e) => { console.error('❌', e); process.exit(1) })
