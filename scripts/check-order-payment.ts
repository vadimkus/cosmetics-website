/**
 * Read-only payment-status inspector.
 *
 * Usage:
 *   set -a && source .env.local && set +a
 *   npx tsx scripts/check-order-payment.ts <orderNumber>
 *   npx tsx scripts/check-order-payment.ts --email <customer@email>
 *   npx tsx scripts/check-order-payment.ts --search <partial>
 */
import { prisma } from '../lib/prisma'

async function findOrders(arg1: string, arg2?: string) {
  if (arg1 === '--email' && arg2) {
    return prisma.order.findMany({
      where: { customerEmail: arg2 },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
  }
  if (arg1 === '--search' && arg2) {
    return prisma.order.findMany({
      where: { orderNumber: { contains: arg2, mode: 'insensitive' } },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
  }
  // Exact orderNumber match, case-insensitive
  const exact = await prisma.order.findFirst({
    where: { orderNumber: { equals: arg1, mode: 'insensitive' } },
    include: { items: true },
  })
  return exact ? [exact] : []
}

async function main() {
  const [arg1, arg2] = process.argv.slice(2)
  if (!arg1) {
    console.error(
      'Usage:\n' +
      '  npx tsx scripts/check-order-payment.ts <orderNumber>\n' +
      '  npx tsx scripts/check-order-payment.ts --email <customer@email>\n' +
      '  npx tsx scripts/check-order-payment.ts --search <partial>',
    )
    process.exit(1)
  }

  const orders = await findOrders(arg1, arg2)
  if (orders.length === 0) {
    console.error('❌ No matching orders')
    process.exit(1)
  }

  for (const order of orders) {
    console.log(`━━━ ORDER ${order.orderNumber} ━━━`)
    console.log(`Customer:       ${order.customerName} <${order.customerEmail}>`)
    console.log(`Phone:          ${order.customerPhone}`)
    console.log(`Created:        ${order.createdAt.toISOString()}`)
    console.log(`Updated:        ${order.updatedAt.toISOString()}`)
    console.log()
    console.log(`Status:         ${order.status}`)
    console.log(`Payment method: ${order.paymentMethod}`)
    console.log(`Payment status: ${order.paymentStatus}`)
    console.log(`Paid at:        ${order.paidAt ? order.paidAt.toISOString() : '(never)'}`)
    console.log()
    console.log(`Total:          AED ${order.total} (sub=${order.subtotal}, vat=${order.vat}, ship=${order.shipping})`)
    console.log()
    console.log(`Stripe session:  ${order.stripeSessionId || '(none)'}`)
    console.log(`Stripe intent:   ${order.stripePaymentIntentId || '(none)'}`)
    console.log(`Refunded at:     ${order.refundedAt ? order.refundedAt.toISOString() : '(never)'}`)
    console.log()
    console.log(`── Items (${order.items.length}) ──`)
    for (const it of order.items) {
      console.log(
        `  ${it.quantity}× ${it.productName}${it.size ? ` (${it.size})` : ''}${it.color ? ` [${it.color}]` : ''} — AED ${it.price}`,
      )
    }
    console.log()
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
