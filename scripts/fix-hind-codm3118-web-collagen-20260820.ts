/**
 * Website CODM2608193118 — match MoySklad: one collagen mask @ 18, paid/delivered.
 *
 *   npx tsx --env-file=.env.local scripts/fix-hind-codm3118-web-collagen-20260820.ts
 *   npx tsx --env-file=.env.local scripts/fix-hind-codm3118-web-collagen-20260820.ts --commit
 */

import { prisma } from '../lib/prisma'

const COMMIT = process.argv.includes('--commit')
const ORDER_NUMBER = 'CODM2608193118'
const COLLAGEN_PRODUCT_ID = 'cmgj9ifoi00008o07p4eqmfb7'
const TOTAL = 18

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    include: { items: true },
  })
  if (!order) throw new Error(`Order not found: ${ORDER_NUMBER}`)

  const collagen = order.items.find((i) => i.productId === COLLAGEN_PRODUCT_ID)
  const drop = order.items.filter((i) => i.productId !== COLLAGEN_PRODUCT_ID)
  if (!collagen) throw new Error('Collagen line missing on website order')

  const earns = await prisma.loyaltyTransaction.findMany({
    where: { orderId: order.id },
  })

  console.log('====================================================================')
  console.log('  Website CODM2608193118 → collagen ×1 @18 paid')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')
  console.log(`  Was: ${order.status} / ${order.paymentStatus} / ${order.total} AED / ${order.items.length} items`)
  console.log(`  Drop: ${drop.map((i) => i.productName).join(', ')}`)
  console.log(`  Loyalty txs: ${earns.length}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await prisma.$transaction(async (tx) => {
    await tx.orderItem.deleteMany({
      where: { id: { in: drop.map((i) => i.id) } },
    })
    await tx.orderItem.update({
      where: { id: collagen.id },
      data: { price: TOTAL, quantity: 1 },
    })
    await tx.order.update({
      where: { id: order.id },
      data: {
        subtotal: TOTAL,
        discountAmount: 0,
        shipping: 0,
        vat: Number((TOTAL - TOTAL / 1.05).toFixed(2)),
        total: TOTAL,
        status: 'DELIVERED',
        paymentStatus: 'paid',
        paidAt: new Date(),
        deliveredAt: order.deliveredAt || new Date(),
      },
    })
    const user = await tx.user.findUnique({ where: { email: order.customerEmail } })
    if (user && user.totalSpent >= 2320) {
      await tx.user.update({
        where: { id: user.id },
        data: { totalSpent: user.totalSpent - 2320 + TOTAL },
      })
    }
    for (const txRow of earns.filter((t) => t.type === 'ORDER_EARN' && t.points > 0)) {
      await tx.loyaltyTransaction.create({
        data: {
          userId: txRow.userId,
          points: -txRow.points,
          type: 'ADJUST',
          description: `Reverse earn on ${ORDER_NUMBER} after reduce to 18 AED`,
          orderId: null,
        },
      })
      await tx.user.update({
        where: { id: txRow.userId },
        data: { loyaltyPoints: { decrement: txRow.points } },
      })
    }
  })

  const check = await prisma.order.findUnique({
    where: { id: order.id },
    include: { items: true },
  })
  console.log(`  Now: ${check?.status} / ${check?.paymentStatus} / ${check?.total} AED / ${check?.items.length} item`)
  console.log(`  Item: ${check?.items[0]?.productName} @ ${check?.items[0]?.price}`)
}

main()
  .catch((e) => {
    console.error('FATAL:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
