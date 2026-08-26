/**
 * Delete website order CODM2608193118 only. MoySklad stays as-is.
 *
 *   npx tsx --env-file=.env.local scripts/delete-hind-codm3118-web-order-20260820.ts
 *   npx tsx --env-file=.env.local scripts/delete-hind-codm3118-web-order-20260820.ts --commit
 */

import { prisma } from '../lib/prisma'

const COMMIT = process.argv.includes('--commit')
const ORDER_NUMBER = 'CODM2608193118'

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    include: { items: true, customer: { select: { id: true, email: true, totalSpent: true, totalOrders: true } } },
  })
  if (!order) {
    console.log(`Website order ${ORDER_NUMBER} already gone`)
    return
  }

  const loyalty = await prisma.loyaltyTransaction.findMany({
    where: { orderId: order.id },
  })
  const clinicPts = await prisma.clinicPointTransaction.findMany({
    where: { orderId: order.id },
  })

  console.log('====================================================================')
  console.log('  Delete website CODM2608193118 only')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')
  console.log(`  ${order.status} / ${order.paymentStatus} / ${order.total} AED / ${order.items.length} items`)
  console.log(`  Customer: ${order.customerEmail} (${order.customer?.id})`)
  console.log(`  Loyalty txs: ${loyalty.length} | Clinic point txs: ${clinicPts.length}`)
  for (const i of order.items) {
    console.log(`    ${i.productName} ×${i.quantity} @ ${i.price}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (loyalty.length) {
    await prisma.loyaltyTransaction.updateMany({
      where: { orderId: order.id },
      data: { orderId: null },
    })
  }

  await prisma.order.delete({ where: { id: order.id } })

  const gone = await prisma.order.findUnique({ where: { orderNumber: ORDER_NUMBER } })
  console.log(`  Deleted. Still exists: ${Boolean(gone)}`)
}

main()
  .catch((e) => {
    console.error('FATAL:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
