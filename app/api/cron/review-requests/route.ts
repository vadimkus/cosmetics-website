import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getPreferredEmail, isApplePrivateRelayEmail } from '@/lib/emailHelpers'
import { loyaltyTrackForUser } from '@/lib/loyalty'
import { sendReviewRequestEmail, type ReviewRequestProduct } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Post-delivery review request cron — runs daily (see vercel.json).
 *
 * Finds orders first marked DELIVERED 5–21 days ago that haven't had a
 * review-request email yet, and asks the customer to rate the products
 * they haven't reviewed (+50 GENOSYS Rewards points each).
 *
 * Rules:
 * - One email per customer per run; multiple qualifying orders are merged
 *   into a single email and all get stamped reviewRequestSentAt.
 * - Guests, partner-track accounts, Apple-relay-only emails and orders
 *   whose products are all reviewed/gone are stamped without sending, so
 *   they are never reprocessed.
 * - Orders older than the window never send (no blast on first rollout).
 *
 * Query params (secret-protected like the run itself):
 * - ?dryRun=1            — report what would be sent, change nothing
 * - ?testEmail=a@b.com   — send the first candidate's email to this address
 *                          instead of customers; nothing is stamped
 */
const WINDOW_MIN_DAYS = 5
const WINDOW_MAX_DAYS = 21
const MAX_EMAILS_PER_RUN = 40

export async function GET(request: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const dryRun = searchParams.get('dryRun') === '1'
  const testEmail = searchParams.get('testEmail') || null

  const now = Date.now()
  const newestEligible = new Date(now - WINDOW_MIN_DAYS * 24 * 3600 * 1000)
  const oldestEligible = new Date(now - WINDOW_MAX_DAYS * 24 * 3600 * 1000)

  try {
    const candidates = await prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        reviewRequestSentAt: null,
        OR: [
          { deliveredAt: { gte: oldestEligible, lte: newestEligible } },
          // Orders delivered before the deliveredAt column existed fall back
          // to updatedAt (the status change is almost always the last write).
          { deliveredAt: null, updatedAt: { gte: oldestEligible, lte: newestEligible } },
        ],
      },
      include: { items: true },
      orderBy: { updatedAt: 'asc' },
      take: 200,
    })

    // Merge multiple qualifying orders per customer into one email.
    const byEmail = new Map<string, typeof candidates>()
    for (const order of candidates) {
      const key = order.customerEmail.toLowerCase()
      const list = byEmail.get(key) ?? []
      list.push(order)
      byEmail.set(key, list)
    }

    const results: Array<Record<string, unknown>> = []
    let sent = 0
    let skipped = 0

    const stampOrders = async (orderIds: string[]) => {
      if (dryRun || testEmail) return
      await prisma.order.updateMany({
        where: { id: { in: orderIds } },
        data: { reviewRequestSentAt: new Date() },
      })
    }

    for (const [email, orders] of byEmail) {
      if (sent >= MAX_EMAILS_PER_RUN) break
      const orderIds = orders.map(o => o.id)
      const orderNumbers = orders.map(o => o.orderNumber)

      const user = await findUserByEmail(email)
      // Guests can't leave reviews (login required) — stamp and move on.
      if (!user) {
        await stampOrders(orderIds)
        skipped++
        results.push({ email, orders: orderNumbers, action: 'skipped: no account' })
        continue
      }
      // Partner accounts don't earn points — the pitch doesn't apply.
      if (loyaltyTrackForUser(user) !== 'REWARDS') {
        await stampOrders(orderIds)
        skipped++
        results.push({ email, orders: orderNumbers, action: 'skipped: partner track' })
        continue
      }
      const sendTo = getPreferredEmail(user)
      if (isApplePrivateRelayEmail(sendTo)) {
        await stampOrders(orderIds)
        skipped++
        results.push({ email, orders: orderNumbers, action: 'skipped: apple relay' })
        continue
      }

      // Paid product lines only (free promo masks have price 0), deduped.
      const productIds = [...new Set(
        orders.flatMap(o => o.items.filter(i => i.price > 0).map(i => i.productId))
      )]
      const alreadyReviewed = await prisma.productReview.findMany({
        where: { userId: user.id, productId: { in: productIds } },
        select: { productId: true },
      })
      const reviewedIds = new Set(alreadyReviewed.map(r => r.productId))
      const pendingIds = productIds.filter(id => !reviewedIds.has(id))

      // Resolve to live products (visible ones only) for names/images/slugs.
      const products = pendingIds.length > 0
        ? await prisma.product.findMany({
            where: { id: { in: pendingIds }, isHidden: false },
            select: { id: true, productNumber: true, name: true, image: true },
          })
        : []

      if (products.length === 0) {
        await stampOrders(orderIds)
        skipped++
        results.push({ email, orders: orderNumbers, action: 'skipped: nothing to review' })
        continue
      }

      const emailProducts: ReviewRequestProduct[] = products.map(p => ({
        slug: p.productNumber || p.id,
        name: p.name,
        image: p.image,
      }))

      if (dryRun) {
        results.push({
          email: sendTo,
          orders: orderNumbers,
          action: 'would send',
          products: emailProducts.map(p => p.name),
        })
        sent++
        continue
      }

      await sendReviewRequestEmail({
        customerName: user.name || 'there',
        customerEmail: testEmail || sendTo,
        orderNumber: orderNumbers.join(', '),
        products: emailProducts,
      })
      await stampOrders(orderIds)
      sent++
      results.push({
        email: testEmail ? `${testEmail} (test, for ${sendTo})` : sendTo,
        orders: orderNumbers,
        action: 'sent',
        products: emailProducts.map(p => p.name),
      })

      // Test mode: one sample email is enough.
      if (testEmail) break
    }

    debugLog('Review-request cron done', { candidates: candidates.length, sent, skipped, dryRun })
    return NextResponse.json({
      success: true,
      dryRun,
      window: { from: oldestEligible.toISOString(), to: newestEligible.toISOString() },
      candidates: candidates.length,
      sent,
      skipped,
      results,
    })
  } catch (error) {
    errorLog('Review-request cron failed:', error)
    return NextResponse.json({ success: false, error: 'Review-request job failed' }, { status: 500 })
  }
}
