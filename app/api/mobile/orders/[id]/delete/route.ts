import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/database'

/**
 * Mobile Order Delete Fallback Endpoint (POST)
 *
 * Some hosting/proxy setups block DELETE/PATCH/PUT and return 405.
 * This endpoint provides a POST alternative:
 *
 * POST /api/mobile/orders/:id/delete
 *
 * Headers Required:
 * - x-api-key
 * - Authorization: Bearer <jwt_token>
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  const { id } = await params

  debugLog('[MOBILE_ORDERS_DELETE_POST] Delete order request started', { orderId: id })

  try {
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    const authValidation = validateMobileAuth(apiKey, token)
    if (!authValidation.valid) {
      return NextResponse.json(
        { success: false, error: authValidation.error },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })
    }

    const user = await findUserByEmail(authValidation.payload.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        status: true,
        paymentStatus: true,
      },
    })

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    if (order.customerEmail !== user.email) {
      errorLog('[MOBILE_ORDERS_DELETE_POST] Unauthorized deletion attempt', {
        orderId: id,
        orderEmail: order.customerEmail,
        userEmail: user.email,
      })
      return NextResponse.json(
        { success: false, error: 'Unauthorized - This order does not belong to you' },
        { status: 403 }
      )
    }

    const isDeletable =
      (order.status === 'pending' || order.status === 'PENDING') &&
      (order.paymentStatus === 'unpaid' || order.paymentStatus === 'UNPAID')

    if (!isDeletable) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete this order' },
        { status: 400 }
      )
    }

    await prisma.order.update({
      where: { id },
      data: { status: 'DELETED', updatedAt: new Date() },
    })

    debugLog('[MOBILE_ORDERS_DELETE_POST] Order soft-deleted successfully', {
      orderId: id,
      orderNumber: order.orderNumber,
      duration: `${Date.now() - startTime}ms`,
    })

    return NextResponse.json({ success: true, message: 'Order deleted successfully' })
  } catch (error) {
    errorLog('[MOBILE_ORDERS_DELETE_POST] Delete order error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}


