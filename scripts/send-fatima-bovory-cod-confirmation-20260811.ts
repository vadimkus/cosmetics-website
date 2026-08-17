/**
 * One-off: send COD order confirmation email to Fatima Bovory for CODW2608118113.
 * Customer only — no admin notification.
 *
 *   npx tsx --env-file=.env.local scripts/send-fatima-bovory-cod-confirmation-20260811.ts
 *   npx tsx --env-file=.env.local scripts/send-fatima-bovory-cod-confirmation-20260811.ts --commit
 */

import { prisma } from '../lib/prisma'
import { sendOrderConfirmationEmail } from '../lib/email/senders'
import { getPreferredEmail } from '../lib/emailHelpers'
import { estimateOrderPoints } from '../lib/loyalty'
import { SITE_URL } from '../lib/siteConfig'

const ORDER_NUMBER = 'CODW2608118113'
const EXPECTED_EMAIL = 'ndeyaa90@yahoo.fr'
const EMAIL_MARKER = 'oneOffCodConfirmation20260811'
const COMMIT = process.argv.includes('--commit')

type EmailMarker = {
  recipient: string
  subject: string
  messageId: string
  acceptedAt: string
}

function parseMetadata(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

function absoluteImage(path: string | null | undefined): string {
  const p = (path || '').trim()
  if (!p) return `${SITE_URL}/images/genosys-logo-transparent.png`
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  return `${SITE_URL}${p.startsWith('/') ? '' : '/'}${p}`
}

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    include: { items: true, customer: true },
  })
  if (!order) throw new Error(`Order not found: ${ORDER_NUMBER}`)
  if (order.customerEmail.toLowerCase() !== EXPECTED_EMAIL) {
    throw new Error(`Email mismatch: ${order.customerEmail}`)
  }

  const metadata = parseMetadata(order.paymentMetadata)
  if (metadata[EMAIL_MARKER]) {
    const marker = metadata[EMAIL_MARKER] as EmailMarker
    console.log(`Already sent (${marker.messageId}) — skipping.`)
    return
  }

  const preferredEmail = getPreferredEmail(order.customer) || order.customerEmail
  const payload = {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: preferredEmail,
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      image: absoluteImage(item.image),
      ...(item.size ? { size: item.size } : {}),
      ...(item.color ? { color: item.color } : {}),
      bundleDiscount: item.bundleDiscount ?? undefined,
    })),
    subtotal: order.subtotal,
    shipping: order.shipping,
    vat: order.vat,
    total: order.total,
    address: order.customerAddress,
    emirate: order.customerEmirate,
    locale: order.locale || 'en',
    loyaltyPointsRedeemed:
      (order.loyaltyPointsRedeemed || 0) > 0 ? order.loyaltyPointsRedeemed : undefined,
    loyaltyDiscountAmount:
      (order.loyaltyDiscountAmount || 0) > 0 ? order.loyaltyDiscountAmount : undefined,
    loyaltyPointsExpected: estimateOrderPoints({
      total: order.total,
      shipping: order.shipping,
      user: order.customer,
    }),
    rewardsCreditTiming: 'cod' as const,
  }

  console.log('=== Fatima COD confirmation (one-off) ===')
  console.log(`Order: ${ORDER_NUMBER}`)
  console.log(`To: ${preferredEmail}`)
  console.log(`Total: AED ${order.total} | items: ${order.items.length}`)
  console.log(`Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  for (const item of order.items) {
    console.log(`  - ${item.productName} ${item.size || ''} ×${item.quantity} @ ${item.price}`)
  }

  if (!COMMIT) {
    console.log('\nDry run only. Re-run with --commit to send.')
    return
  }

  const result = await sendOrderConfirmationEmail(payload)
  if (!result.success || !result.messageId) {
    throw new Error(`SMTP did not accept email: ${result.error || 'missing messageId'}`)
  }

  const marker: EmailMarker = {
    recipient: preferredEmail,
    subject: `Order Confirmation #${ORDER_NUMBER}`,
    messageId: result.messageId,
    acceptedAt: new Date().toISOString(),
  }
  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentMetadata: JSON.stringify({ ...metadata, [EMAIL_MARKER]: marker }),
    },
  })

  console.log(`Sent. messageId=${result.messageId}`)
}

main()
  .catch((e) => {
    console.error('FATAL:', e instanceof Error ? e.message : e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
