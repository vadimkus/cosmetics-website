import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/database'

/**
 * Mobile Order Delete Endpoint
 * 
 * DELETE /api/mobile/orders/:id - Delete user's order
 * 
 * Headers Required:
 * - x-api-key: genosys_secure_mobile_2025_v1
 * - Authorization: Bearer <jwt_token>
 * 
 * Security:
 * - Only allows deletion of orders belonging to authenticated user
 * - Only allows deletion of pending/unpaid orders
 * - Paid, shipped, or delivered orders cannot be deleted
 * 
 * Response Format:
 * {
 *   "success": true,
 *   "message": "Order deleted successfully"
 * }
 */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  const { id } = await params
  
  debugLog('[MOBILE_ORDERS_DELETE] Delete order request started', { orderId: id })

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error
        },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication token required' 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Verify user exists
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        customerEmail: true,
        status: true,
        paymentStatus: true,
        total: true
      }
    })

    if (!order) {
      debugLog('[MOBILE_ORDERS_DELETE] Order not found', { orderId: id })
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )
    }

    // Security: Verify order belongs to authenticated user
    if (order.customerEmail !== user.email) {
      errorLog('[MOBILE_ORDERS_DELETE] Unauthorized deletion attempt', {
        orderId: id,
        orderEmail: order.customerEmail,
        userEmail: user.email
      })
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized - This order does not belong to you' 
        },
        { status: 403 }
      )
    }

    // Business Rule:
    // Allow deletion for PENDING orders that are not paid.
    // Stripe orders typically have paymentStatus = "pending" until paid, so include that as deletable.
    const status = String(order.status || '').toUpperCase()
    const paymentStatus = String(order.paymentStatus || '').toUpperCase()
    const isPendingStatus = status === 'PENDING'
    const isPaidPayment = paymentStatus === 'PAID' || paymentStatus === 'CONFIRMED'
    const isDeletable = isPendingStatus && !isPaidPayment

    if (!isDeletable) {
      const reason = isPaidPayment
        ? 'Cannot delete paid orders'
        : status === 'SHIPPED'
        ? 'Cannot delete shipped orders'
        : status === 'DELIVERED'
        ? 'Cannot delete delivered orders'
        : status === 'DELETED'
        ? 'Order already deleted'
        : 'Cannot delete this order'

      debugLog('[MOBILE_ORDERS_DELETE] Order cannot be deleted', {
        orderId: id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        reason
      })

      return NextResponse.json(
        { 
          success: false, 
          error: reason
        },
        { status: 400 }
      )
    }

    // Soft delete: Set status to 'DELETED' instead of hard delete
    // This preserves order history for admin review
    await prisma.order.update({
      where: { id },
      data: {
        status: 'DELETED',
        updatedAt: new Date()
      }
    })

    debugLog('[MOBILE_ORDERS_DELETE] Order soft-deleted successfully', {
      orderId: id,
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      duration: `${Date.now() - startTime}ms`
    })

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })

  } catch {
    errorLog('[MOBILE_ORDERS_DELETE] Delete order error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

/**
 * Get specific order details
 * GET /api/mobile/orders/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  const { id } = await params
  
  debugLog('[MOBILE_ORDERS_GET] Get order request started', { orderId: id })

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error
        },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication token required' 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Verify user exists
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Get order with items
    const order = await prisma.order.findFirst({
      where: {
        id,
        customerEmail: user.email
      },
      include: {
        items: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )
    }

    // Format order data for mobile app
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderNotes: (order as any).orderNotes || '',
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shipping: order.shipping,
      vat: order.vat,
      total: order.total,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmirate: order.customerEmirate,
      customerAddress: order.customerAddress,
      locale: order.locale,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      paidAt: order.paidAt?.toISOString() || null,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        color: item.color,
        size: item.size
      }))
    }

    debugLog('[MOBILE_ORDERS_GET] Get order completed', {
      orderId: id,
      duration: `${Date.now() - startTime}ms`
    })
    
    return NextResponse.json({
      success: true,
      data: formattedOrder
    })

  } catch {
    errorLog('[MOBILE_ORDERS_GET] Get order error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    },
  })
}
