import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'
import { verifySessionToken } from '@/lib/jwt'
import { findUserById } from '@/lib/userStorageDb'
import { verifyAdminSessionToken } from '@/lib/adminAuth'

/**
 * GET /api/orders/success/[orderNumber]
 * 
 * Endpoint for the success page to get full order details.
 * Returns complete order PII (name/email/phone/address) — so it is
 * authenticated: the caller must either own the order (session email matches
 * order.customerEmail) or be an admin. Previously this was fully open and
 * allowed enumerating customer PII by order number.
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params
    
    if (!orderNumber || typeof orderNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 }
      )
    }

    debugLog('[ORDER_SUCCESS] Looking up order:', orderNumber)

    // Find order by order number
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            quantity: true,
            price: true,
            image: true,
            color: true,
            size: true,
            bundleDiscount: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Authorize: only the order owner (matching session email) or an admin
    // may read this order's PII.
    const sessionEmail = await getSessionEmail(request)
    const isOwner = !!sessionEmail && sessionEmail === order.customerEmail.toLowerCase()
    let isAdmin = false
    if (!isOwner) {
      const adminCookie = request.cookies.get('admin-session')
      isAdmin = adminCookie ? !!verifyAdminSessionToken(adminCookie.value) : false
    }
    if (!isOwner && !isAdmin) {
      // 404 (not 403) so the endpoint doesn't confirm the order exists to a
      // non-owner probing order numbers.
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Get delivery estimate based on emirate
    const isDubai = order.customerEmirate.toLowerCase() === 'dubai'
    const deliveryEstimate = isDubai
      ? { time: '1-2 hours', type: 'hours' as const }
      : { time: '1-2 business days', type: 'days' as const }

    // Return full order information for success page
    const orderData = {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      // Customer info
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      // Delivery address
      customerAddress: order.customerAddress,
      customerEmirate: order.customerEmirate,
      // Pricing breakdown
      subtotal: order.subtotal,
      shipping: order.shipping,
      vat: order.vat,
      total: order.total,
      // User discount
      discountPercentage: order.discountPercentage,
      discountAmount: order.discountAmount,
      // Bundle discount
      bundleDiscountPercentage: order.bundleDiscountPercentage,
      bundleDiscountAmount: order.bundleDiscountAmount,
      // Items with full details
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        color: item.color,
        size: item.size,
        bundleDiscount: item.bundleDiscount
      })),
      // Delivery estimate
      deliveryEstimate,
      // Item count
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
    }

    debugLog('[ORDER_SUCCESS] Order found:', orderNumber)

    return NextResponse.json({
      success: true,
      data: orderData
    })

  } catch (error) {
    errorLog('[ORDER_SUCCESS] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve order information' },
      { status: 500 }
    )
  }
}
