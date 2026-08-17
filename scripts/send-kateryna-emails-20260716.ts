/**
 * 1) Apply VIP 12% to Kateryna Sierova + send discount assignment email
 * 2) Send delivered + points-earned emails for MSK-KATERYNA-160726
 *
 * Run after: node scripts/import-kateryna-order-20260716.js --commit
 *   npx tsx --env-file=.env.local scripts/send-kateryna-emails-20260716.ts
 */
import { PrismaClient } from '@prisma/client'
import { sendDiscountAssignmentEmail, sendOrderDeliveredEmail } from '../lib/email/senders'
import { sendLoyaltyPointsEarnedEmail } from '../lib/email/loyalty'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate') || databaseUrl.startsWith('prisma+')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const EMAIL = 'kateryna.sierova10@gmail.com'
const ORDER_NUMBER = 'MSK-KATERYNA-160726'
const EXPECTED_POINTS = 1090

async function main() {
  const before = await prisma.user.findUnique({
    where: { email: EMAIL },
    select: {
      id: true,
      name: true,
      email: true,
      discountType: true,
      discountPercentage: true,
      loyaltyPoints: true,
      memberTier: true,
    },
  })
  if (!before) throw new Error('User not found')
  console.log('USER BEFORE', JSON.stringify(before))

  const user = await prisma.user.update({
    where: { id: before.id },
    data: { discountType: 'VIP', discountPercentage: 12, canSeePrices: true },
    select: {
      id: true,
      name: true,
      email: true,
      discountType: true,
      discountPercentage: true,
      loyaltyPoints: true,
      memberTier: true,
    },
  })
  console.log('USER AFTER VIP', JSON.stringify(user))

  const discountMail = await sendDiscountAssignmentEmail({
    customerName: user.name || 'Valued Customer',
    customerEmail: user.email,
    discountType: 'VIP',
    discountPercentage: 12,
  })
  console.log('DISCOUNT EMAIL', JSON.stringify(discountMail))

  const order = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    include: { items: true },
  })
  if (!order) throw new Error('Order not found: ' + ORDER_NUMBER)

  const customerName = order.customerName.trim()
  console.log('Sending delivered email…')
  const r1 = await sendOrderDeliveredEmail({
    orderNumber: order.orderNumber,
    customerName,
    customerEmail: order.customerEmail,
    items: order.items.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      price: i.price,
      ...(i.image ? { image: i.image } : {}),
    })),
    total: order.total,
    locale: 'en',
  })
  console.log('DELIVERED EMAIL', JSON.stringify(r1))

  const earn = await prisma.loyaltyTransaction.findFirst({
    where: { orderId: order.id, type: 'ORDER_EARN' },
    select: { points: true },
  })
  const points = earn?.points ?? EXPECTED_POINTS

  console.log('Sending points-earned email…')
  const r2 = await sendLoyaltyPointsEarnedEmail({
    customerName,
    customerEmail: order.customerEmail,
    orderNumber: order.orderNumber,
    points,
    balance: user.loyaltyPoints,
    tier: (user.memberTier || 'MEMBER') as 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM',
    locale: 'en',
  })
  console.log('POINTS EMAIL', JSON.stringify(r2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
