import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'
import { sendReviewRequestEmail } from '@/lib/email'
import { getPreferredEmail, isApplePrivateRelayEmail } from '@/lib/emailHelpers'
import { loyaltyTrackForUser } from '@/lib/loyalty'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Post-delivery review-request cron (daily, see vercel.json).
 *
 * Finds orders DELIVERED ~4-8 days ago (updatedAt is when the status was set)
 * that haven't received a review request yet, and emails the customer a
 * "rate your products, earn 50 pts each" prompt with direct links.
 *
 * Idempotency: orders are stamped with reviewRequestSentAt whether an email
 * went out or the order was skipped (partner account, relay email, all
 * products already reviewed) — each order is processed exactly once.
 */
const WINDOW_MIN_DAYS = 4
const WINDOW_MAX_DAYS = 8
const MAX_EMAILS_PER_RUN = 40
const MAX_PRODUCTS_PER_EMAIL = 6

export async function GET(request: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = Date.now()
  const windowStart = new Date(now - WINDOW_MAX_DAYS * 24 * 3600 * 1000)
  const windowEnd = new Date(now - WINDOW_MIN_DAYS * 24 * 3600 * 1000)

  try {
    const orders = await prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        reviewRequestSentAt: null,
        updatedAt: { gte: windowStart, lte: windowEnd },
      },
      include: { items: true, customer: true },
      orderBy: { updatedAt: 'asc' },
      take: MAX_EMAILS_PER_RUN,
    })

    let sent = 0
    let skipped = 0

    for (const order of orders) {
      const stamp = () =>
        prisma.order.update({
          where: { id: order.id },
          data: { reviewRequestSentAt: new Date() },
        })

      try {
        const user = order.customer
        const email = user ? getPreferredEmail(user) : order.customerEmail

        // Skip: partner accounts (email copy is points-centric) and
        // unreachable Apple relay addresses.
        if (!user || loyaltyTrackForUser(user) === 'PARTNER' || isApplePrivateRelayEmail(email)) {
          await stamp()
          skipped++
          continue
        }

        // Paid product lines only (no free promo masks), de-duplicated.
        const seen = new Set<string>()
        const candidates = order.items.filter(item => {
          if (item.price <= 0 || seen.has(item.productId)) return false
          seen.add(item.productId)
          return true
        })

        // Drop products this customer already reviewed.
        const reviewed = await prisma.productReview.findMany({
          where: { userId: user.id, productId: { in: candidates.map(i => i.productId) } },
          select: { productId: true },
        })
        const reviewedIds = new Set(reviewed.map(r => r.productId))
        const products = candidates
          .filter(i => !reviewedIds.has(i.productId))
          .slice(0, MAX_PRODUCTS_PER_EMAIL)
          .map(i => ({ id: i.productId, name: i.productName, image: i.image }))

        if (products.length === 0) {
          await stamp()
          skipped++
          continue
        }

        await sendReviewRequestEmail({
          customerName: order.customerName,
          customerEmail: email,
          orderNumber: order.orderNumber,
          products,
        })
        await stamp()
        sent++
      } catch (orderError) {
        // Leave the order unstamped only if the email itself failed —
        // it will be retried while it stays inside the window.
        errorLog(`[review-requests] failed for order ${order.orderNumber}:`, orderError)
      }
    }

    debugLog(`[review-requests] processed ${orders.length} orders — sent ${sent}, skipped ${skipped}`)
    return NextResponse.json({ success: true, processed: orders.length, sent, skipped })
  } catch (error) {
    errorLog('[review-requests] cron failed:', error)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}
