import { NextRequest, NextResponse } from 'next/server'
import { sendAdminNewOrderNotification } from '@/lib/email'
import { errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { getOrderByNumber } from '@/lib/orderStorageDb'
import { ORDER_ITEM_IMAGE_FALLBACK } from '@/lib/orderItemImage'

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection (defense in depth)
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { 
      orderNumber, 
    } = await request.json()

    // Validate required fields
    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Missing required field: orderNumber' },
        { status: 400 }
      )
    }

    const order = await getOrderByNumber(orderNumber)
    if (!order) {
      return NextResponse.json(
        { error: `Order not found: ${orderNumber}` },
        { status: 404 }
      )
    }

    // Send admin notification from stored order data, not submitted totals.
    const result = await sendAdminNewOrderNotification({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || undefined,
      total: order.total,
      itemCount: order.items.length,
      items: order.items.map(item => ({
        productName: item.productName || 'Product',
        quantity: item.quantity,
        price: item.price,
        image: item.image || ORDER_ITEM_IMAGE_FALLBACK,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping || 0,
      vat: order.vat,
      address: order.customerAddress || undefined,
      emirate: order.customerEmirate || undefined
    })

    if (result.success && 'messageId' in result) {
      return NextResponse.json({
        success: true,
        message: `Admin notification sent for order #${orderNumber}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send notification: ${result.error}` },
        { status: 500 }
      )
    }

  } catch (error) {
    errorLog('Error sending manual order notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
