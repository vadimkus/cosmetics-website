/**
 * Import MoySklad TAX INVOICE No 04794 (09.07.2026) into the website DB for
 * Dudareva Alena (alena5014186@gmail.com) as a DELIVERED + PAID order, and
 * award GENOSYS Rewards points (REWARDS track).
 *
 * The order already exists in MoySklad — this only mirrors it into the site DB
 * so it shows in her history and earns points. It must NOT be pushed back.
 *
 * Dry-run:  node scripts/import-alena-order-04794.js
 * Commit:   node scripts/import-alena-order-04794.js --commit
 *
 * Loyalty logic mirrors lib/loyalty.ts awardPointsForDeliveredOrder exactly.
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
const { PrismaClient } = require('@prisma/client')

const COMMIT = process.argv.includes('--commit')
const EMAIL = 'alena5014186@gmail.com'
const ORDER_NUMBER = 'MSK-04794'
const INVOICE_DATE = new Date('2026-07-09T12:00:00.000Z')

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

// Invoice lines: productId (DB), display name, retail (incl VAT), qty, size/color.
// Partner/one-off discount on this invoice = 15% off retail. Delivery = free.
const DISCOUNT_PCT = 15
const LINES = [
  { productId: '41', name: 'Genosys Skin Caring Blemish Balm Cushion #2 Beige', retail: 300, qty: 1, color: 'Beige' },
  { productId: '10', name: 'Genosys Snow O₂ Cleanser 180ml', retail: 330, qty: 1, size: '180ml' },
  { productId: '29', name: 'Genosys Moisture Replenishing Hyaluron Cream 50g', retail: 290, qty: 1, size: '50g' },
  { productId: '18', name: 'Genosys Moisture Replenishing Hyaluron Serum 30ml', retail: 330, qty: 1, size: '30ml' },
  { productId: '16', name: 'Genosys Snow Booster Toner 200ml', retail: 260, qty: 1, size: '200ml' },
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

  // Build items from DB products (prices computed at 15% off retail, incl VAT)
  const items = []
  let subtotal = 0
  let retailSum = 0
  for (const line of LINES) {
    const product = await prisma.product.findUnique({ where: { id: line.productId }, select: { id: true, name: true, price: true, image: true } })
    if (!product) throw new Error('Product not found: ' + line.productId + ' (' + line.name + ')')
    if (Number(product.price) !== line.retail) {
      console.warn(`⚠️  retail mismatch for ${line.name}: invoice ${line.retail} vs DB ${product.price}`)
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
      ...(line.color ? { color: line.color } : {}),
      ...(line.size ? { size: line.size } : {}),
    })
  }
  subtotal = r2(subtotal)
  const shipping = 0
  const total = subtotal
  const vat = r2((total * 5) / 105)
  const discountAmount = r2(retailSum - subtotal)

  // Loyalty preview (mirror awardPointsForDeliveredOrder)
  const prevTier = user.memberTier || 'MEMBER'
  const productSpend = Math.max(0, total - shipping)
  const bday = isBirthdayMonth(user.birthday)
  const base = productSpend * POINTS_PER_AED * (TIER_MULTIPLIERS[prevTier] || 1)
  const points = track === 'PARTNER' ? 0 : Math.floor(bday ? base * 2 : base)
  const newTier = computeTier(total, 1)

  console.log('=== IMPORT PLAN (', COMMIT ? 'COMMIT' : 'DRY-RUN', ') ===')
  console.log('Customer:', user.name, `<${user.email}>`, '| track:', track, '| tier:', prevTier, '| points now:', user.loyaltyPoints)
  console.log('Order:', ORDER_NUMBER, '| date:', INVOICE_DATE.toISOString().slice(0, 10))
  console.table(items.map((i) => ({ product: i.productName, qty: i.quantity, unit: i.price })))
  console.log({ subtotal, discountPct: DISCOUNT_PCT, discountAmount, shipping, vat, total })
  console.log(`Loyalty: +${points} pts (basis AED ${productSpend.toFixed(2)}), tier ${prevTier} -> ${newTier}, birthdayMonth=${bday}`)
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
      customerName: user.name || user.email,
      customerPhone: user.phone || '',
      customerEmirate: 'Dubai',
      customerAddress: user.address || 'DIFC, Damac Park Towers A, apt 908, Dubai',
      orderNotes: 'Imported from MoySklad TAX INVOICE No 04794 (09.07.2026). Already in MoySklad — DO NOT push again.',
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
      paidAt: INVOICE_DATE,
      deliveredAt: INVOICE_DATE,
      // Mark as already in MoySklad so the admin "Push" button treats it as synced.
      moySkladOrderId: 'MSK-04794',
      moySkladSyncedAt: INVOICE_DATE,
      createdAt: INVOICE_DATE,
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
