import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendAdminNewOrderNotification, generateSupportLinkOrderHTML, OrderHTMLData, OrderHTMLItem } from '@/lib/email'
import { debugLog, errorLog } from '@/lib/logger'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { requireCsrfToken } from '@/lib/csrf'
import { enhanceOrderItemWithDefaultSize } from '@/lib/orderSizeDefaults'

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const orderData = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      emirate,
      items,
      subtotal,
      shippingCost,
      vatAmount,
      total,
      orderNumber,
      locale = 'en'
    } = orderData

    // Save order to database
    const orderItems: OrderItemData[] = items.map((item: { id?: string; name: string; price: number; quantity: number; image?: string; color?: string; size?: string }) => {
      // Enhance with default size if missing
      const enhanced = enhanceOrderItemWithDefaultSize({
        productName: item.name,
        size: item.size || null,
        color: item.color || null
      })
      
      return {
        productId: item.id || `product-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '/images/placeholder.jpg',
        color: enhanced.color || undefined,
        size: enhanced.size || undefined
      }
    })

    const dbOrder: OrderData = {
      orderNumber,
      customerEmail,
      customerName,
      customerPhone,
      customerEmirate: emirate,
      customerAddress,
      items: orderItems,
      subtotal,
      discountAmount: 0,
      shipping: shippingCost,
      vat: vatAmount,
      total,
      status: 'PENDING'
    }

    // Save to database with timeout protection
    let savedOrder
    try {
      const savePromise = addOrder(dbOrder)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database save timeout after 8 seconds')), 8000)
      )
      savedOrder = await Promise.race([savePromise, timeoutPromise]) as Awaited<ReturnType<typeof addOrder>>
      debugLog('✅ Support Link order saved to database:', savedOrder.id)
    } catch (dbError) {
      errorLog('⚠️ Database save failed or timed out, continuing with order processing:', dbError)
      // Continue even if database save fails - order will be processed via email
      savedOrder = { id: 'pending', orderNumber: dbOrder.orderNumber } as any
      
      // Try to save asynchronously in background (don't wait)
      addOrder(dbOrder).then((retryOrder) => {
        debugLog('✅ Support Link order saved to database (retry):', retryOrder.id)
      }).catch((retryError) => {
        errorLog('❌ Retry database save also failed:', retryError)
      })
    }

    // Prepare order HTML data with proper types
    const orderHTMLData: OrderHTMLData = {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      emirate,
      items: items.map((item: { name: string; quantity: number; price: number; total?: number; image?: string; size?: string; color?: string }): OrderHTMLItem => {
        const orderItem: OrderHTMLItem = {
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total || (item.price * item.quantity)
        }
        if (item.image) {
          orderItem.image = item.image
        }
        if (item.size) {
          orderItem.size = item.size
        }
        if (item.color) {
          orderItem.color = item.color
        }
        return orderItem
      }),
      subtotal,
      shippingCost,
      vatAmount,
      total
    }

    // Load translations
    const translations = locale === 'ar' 
      ? (await import('@/messages/ar.json')).default.orderEmail.supportLink
      : (await import('@/messages/en.json')).default.orderEmail.supportLink

    const orderHTML = generateSupportLinkOrderHTML(orderHTMLData, locale, translations)

    // Send email to customer (non-blocking - fire and forget)
    const emailSubject = translations.subject.replace('{orderNumber}', orderNumber)
    sendEmail(
      customerEmail,
      emailSubject,
      orderHTML
    ).then((result) => {
      if (result.success) {
        debugLog('✅ Support-link order confirmation email sent to:', customerEmail)
      } else {
        errorLog('❌ Failed to send support-link order confirmation email:', result.error)
      }
    }).catch((emailError) => {
      errorLog('❌ Exception sending support-link order confirmation email:', emailError)
      // Don't fail order creation if email fails
    })

    // Send admin notification for support-link order (non-blocking - fire and forget)
    debugLog('📧 Sending admin notification for support-link order:', orderNumber)
    sendAdminNewOrderNotification({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      total,
      itemCount: items.length,
      items: items.map((item: { name: string; quantity: number; price: number; image?: string; size?: string; color?: string }) => {
        const emailItem: {
          productName: string
          quantity: number
          price: number
          image: string
          size?: string
          color?: string
        } = {
          productName: item.name || 'Product',
          quantity: item.quantity,
          price: item.price,
          image: item.image || '/images/default-product.jpg'
        }
        if (item.size) {
          emailItem.size = item.size
        }
        if (item.color) {
          emailItem.color = item.color
        }
        return emailItem
      }),
      subtotal,
      shipping: shippingCost,
      vat: vatAmount,
      address: customerAddress,
      emirate: emirate
    }).then((adminResult) => {
      if (adminResult.success) {
        debugLog('✅ Admin notification sent for support-link order:', orderNumber)
      } else {
        errorLog('❌ Failed to send admin notification for support-link order:', adminResult.error)
        errorLog('❌ Admin notification error details:', JSON.stringify(adminResult, null, 2))
      }
    }).catch((emailError) => {
      errorLog('❌ Exception sending admin notification for support-link order:', emailError)
      // Don't fail order creation if email fails
    })

    // Return success response immediately (emails are sent asynchronously)
    // Don't wait for database save if it's slow - order processing continues async
    return NextResponse.json({ 
      success: true, 
      message: 'Support link order request sent successfully',
      orderId: savedOrder?.id || 'pending',
      orderNumber: orderNumber
    })

  } catch (error) {
    errorLog('Error sending support link order request:', error)
    return NextResponse.json(
      { error: 'Failed to send support link order request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
