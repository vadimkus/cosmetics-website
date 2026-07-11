/**
 * Send Iryna Sarazhynska the customer emails for manually imported order
 * MSK-IRYNA-110726 (see scripts/import-iryna-order-20260711.js):
 *   1. Order delivered / thank-you email (with items + total)
 *   2. GENOSYS Rewards points-earned email (+558 pts)
 *
 * Run: npx tsx --env-file=.env.local scripts/send-iryna-order-emails-20260711.ts
 */
import { prisma } from '../lib/prisma'
import { sendOrderDeliveredEmail } from '../lib/email/senders'
import { sendLoyaltyPointsEarnedEmail } from '../lib/email/loyalty'

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderNumber: 'MSK-IRYNA-110726' },
    include: { items: true },
  })
  if (!order) throw new Error('Order not found')

  const user = await prisma.user.findUnique({
    where: { email: order.customerEmail },
    select: { loyaltyPoints: true, memberTier: true },
  })
  if (!user) throw new Error('User not found')

  const customerName = order.customerName.trim()

  console.log('Sending delivered email to', order.customerEmail, '…')
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
  console.log('Delivered email result:', JSON.stringify(r1))

  console.log('Sending points-earned email…')
  const r2 = await sendLoyaltyPointsEarnedEmail({
    customerName,
    customerEmail: order.customerEmail,
    orderNumber: order.orderNumber,
    points: 558,
    balance: user.loyaltyPoints,
    tier: (user.memberTier || 'MEMBER') as 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM',
    locale: 'en',
  })
  console.log('Points email result:', JSON.stringify(r2))
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error('❌', e); process.exit(1) })
