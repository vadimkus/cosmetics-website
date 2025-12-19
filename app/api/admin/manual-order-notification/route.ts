import { NextRequest, NextResponse } from 'next/server'
import { sendAdminNewOrderNotification } from '@/lib/email'
import { errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'

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
      customerName, 
      customerEmail,
      customerPhone,
      total, 
      itemCount,
      items,
      subtotal,
      shipping,
      vat,
      address,
      emirate
    } = await request.json()

    // Validate required fields
    if (!orderNumber || !customerName || !customerEmail || !total) {
      return NextResponse.json(
        { error: 'Missing required fields: orderNumber, customerName, customerEmail, total' },
        { status: 400 }
      )
    }

    // Send admin notification
    const result = await sendAdminNewOrderNotification({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      total: Number.isNaN(parseFloat(total)) ? 0 : parseFloat(total),
      itemCount: (() => {
        const parsed = parseInt(itemCount)
        return Number.isNaN(parsed) ? (items && Array.isArray(items) ? items.length : 1) : parsed
      })(),
      items: items && Array.isArray(items) ? items.map((item: {
        productName?: string
        name?: string
        quantity: number
        price: number
        image?: string
      }) => ({
        productName: item.productName || item.name || 'Product',
        quantity: item.quantity || 1,
        price: item.price || 0,
        image: item.image || '/images/default-product.jpg'
      })) : undefined,
      subtotal: subtotal !== undefined ? (() => {
        const parsed = parseFloat(subtotal.toString())
        return Number.isNaN(parsed) ? undefined : parsed
      })() : undefined,
      shipping: shipping !== undefined ? (() => {
        const parsed = parseFloat(shipping.toString())
        return Number.isNaN(parsed) ? undefined : parsed
      })() : undefined,
      vat: vat !== undefined ? (() => {
        const parsed = parseFloat(vat.toString())
        return Number.isNaN(parsed) ? undefined : parsed
      })() : undefined,
      address: address || undefined,
      emirate: emirate || undefined
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

  } catch {
    errorLog('Error sending manual order notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
