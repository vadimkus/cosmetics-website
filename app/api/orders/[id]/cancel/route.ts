import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateOrderStatus } from '@/lib/orderStorageDb'
import { errorLog } from '@/lib/logger'
import { requireCsrfToken } from '@/lib/csrf'
import { verifySessionToken } from '@/lib/jwt'
import { findUserById } from '@/lib/userStorageDb'
import { reverseRedemptionForOrder } from '@/lib/loyalty'
import { restoreClinicPointsRedemptionForOrder } from '@/lib/homecare'

/**
 * Cancel one of your own pending orders.
 *
 * This used to check only the CSRF token, which every visitor is issued on
 * page load, so anyone who knew an order id could cancel it, at any status,
 * and trigger the loyalty reversal on an order that had already shipped. The
 * caller must now own the order, and only an unpaid pending order can be
 * cancelled from here: the same rule the mobile route applies, and the only
 * case the website shows a Cancel button for. Anything further along goes
 * through an admin, who can see what has already happened to it.
 */

async function getSessionEmail(request: NextRequest): Promise<string | null> {
  const cookie = request.cookies.get('genosys_session')
  if (!cookie) return null
  const session = verifySessionToken(cookie.value)
  if (!session) return null
  if (session.email) return session.email.toLowerCase()
  if (session.id) {
    const user = await findUserById(session.id)
    return user?.email ? user.email.toLowerCase() : null
  }
  return null
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const sessionEmail = await getSessionEmail(request)
    if (!sessionEmail) {
      return NextResponse.json({ success: false, error: 'Please sign in' }, { status: 401 })
    }

    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, customerEmail: true, status: true, paymentStatus: true },
    })

    // The same answer whether the order is missing or someone else's, so the
    // route cannot be used to probe which ids exist.
    if (!order || order.customerEmail.toLowerCase() !== sessionEmail) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const status = String(order.status || '').toUpperCase()
    if (status === 'CANCELLED') {
      return NextResponse.json({ success: true, message: 'Order already cancelled' })
    }

    const paymentStatus = String(order.paymentStatus || '').toUpperCase()
    const isPaid = paymentStatus === 'PAID' || paymentStatus === 'CONFIRMED'
    if (status !== 'PENDING' || isPaid) {
      return NextResponse.json(
        { success: false, error: 'This order can no longer be cancelled here. Please contact us and we will help.' },
        { status: 409 }
      )
    }

    const success = await updateOrderStatus(id, 'CANCELLED')
    if (!success) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Return any redeemed loyalty points (idempotent, no-op if none)
    try {
      await reverseRedemptionForOrder(id)
    } catch (loyaltyError) {
      errorLog('❌ Loyalty redemption reversal failed on cancel:', loyaltyError)
    }
    try {
      await restoreClinicPointsRedemptionForOrder(id)
    } catch (clinicPointsError) {
      errorLog('❌ Clinic Points redemption restore failed on cancel:', clinicPointsError)
    }

    return NextResponse.json({ success: true, message: 'Order cancelled successfully' })
  } catch (error) {
    errorLog('Error cancelling order:', error)
    return NextResponse.json({ success: false, error: 'Failed to cancel order' }, { status: 500 })
  }
}
