import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendAdminNewOrderNotification, generateCODOrderHTML, OrderHTMLData, OrderHTMLItem } from '@/lib/email'
import { debugLog, errorLog } from '@/lib/logger'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { requireCsrfToken } from '@/lib/csrf'
import { enhanceOrderItemWithDefaultSize } from '@/lib/orderSizeDefaults'

// Helper function to detect device type from User-Agent
function detectDeviceType(userAgent: string | null): string {
  if (!userAgent) return 'Unknown'
  
  const ua = userAgent.toLowerCase()
  
  // Check for mobile devices
  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'Mobile'
  }
  
  // Check for tablet devices
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'Tablet'
  }
  
  // Default to desktop
  return 'Desktop'
}

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    // Detect device type from User-Agent header
    const userAgent = request.headers.get('user-agent')
    const deviceType = detectDeviceType(userAgent)
    
    const orderData = await request.json()
    const {
      orderNumber,
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
      locale = 'en'
    } = orderData

    // Validate required fields
    if (!customerEmail || !customerEmail.trim()) {
      errorLog('❌ COD order missing customerEmail:', orderNumber)
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      )
    }

    if (!orderNumber) {
      errorLog('❌ COD order missing orderNumber')
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      )
    }

    debugLog('📧 COD order received:', {
      orderNumber,
      customerEmail,
      customerName,
      itemCount: items?.length || 0
    })

    // Save order to database
    const orderItems: OrderItemData[] = items.map((item: { id?: string; name: string; price: number; quantity: number; image?: string; color?: string; size?: string }) => {
      // Enhance with default size if missing
      const itemName = item.name || 'Product'
      const enhanced = enhanceOrderItemWithDefaultSize({
        productName: itemName,
        size: item.size || null,
        color: item.color || null
      })
      
      return {
        productId: item.id || `product-${itemName.toLowerCase().replace(/\s+/g, '-')}`,
        productName: itemName,
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
      status: 'PENDING',
      locale: locale || 'en' // Capture locale from request, default to English
    }

    // Save to database with timeout protection
    let savedOrder
    try {
      const savePromise = addOrder(dbOrder)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database save timeout after 8 seconds')), 8000)
      )
      savedOrder = await Promise.race([savePromise, timeoutPromise]) as Awaited<ReturnType<typeof addOrder>>
      debugLog('✅ COD order saved to database:', savedOrder.id)
    } catch (dbError) {
      errorLog('⚠️ Database save failed or timed out, continuing with order processing:', dbError)
      // Continue even if database save fails - order will be processed via email
      // Create a minimal order object for fallback (matches Order type structure)
      savedOrder = {
        id: 'pending',
        orderNumber: dbOrder.orderNumber,
        customerEmail: dbOrder.customerEmail,
        customerName: dbOrder.customerName,
        customerPhone: dbOrder.customerPhone,
        customerEmirate: dbOrder.customerEmirate,
        customerAddress: dbOrder.customerAddress,
        subtotal: dbOrder.subtotal,
        discountAmount: dbOrder.discountAmount ?? 0,
        shipping: dbOrder.shipping ?? 0,
        vat: dbOrder.vat,
        total: dbOrder.total,
        status: dbOrder.status ?? 'PENDING',
        locale: dbOrder.locale ?? 'en',
        sessionId: dbOrder.sessionId ?? null,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        stripeSessionId: null,
        stripePaymentIntentId: null,
        stripeCustomerId: null,
        paidAt: null,
        refundedAt: null,
        refundAmount: null,
        paymentMetadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: []
      } as Awaited<ReturnType<typeof addOrder>>
      
      // Try to save asynchronously in background (don't wait)
      addOrder(dbOrder).then((retryOrder) => {
        debugLog('✅ COD order saved to database (retry):', retryOrder.id)
      }).catch((retryError) => {
        errorLog('❌ Retry database save also failed:', retryError)
      })
    }

    // Prepare order HTML data with proper types
    const orderHTMLData: OrderHTMLData = {
      orderNumber,
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || 'N/A',
      customerPhone: customerPhone || 'N/A',
      customerAddress: (customerAddress && customerAddress.trim()) || 'N/A',
      emirate: (emirate && emirate.trim()) || 'N/A',
      items: items.map((item: { name: string; quantity: number; price: number; image?: string; size?: string; color?: string }): OrderHTMLItem => {
        // Enhance with default size if missing
        const itemName = item.name || 'Product'
        const originalSize = (item.size && item.size.trim()) || null
        const enhanced = enhanceOrderItemWithDefaultSize({
          productName: itemName,
          size: originalSize,
          color: (item.color && item.color.trim()) || null
        })
        
        debugLog(`📦 COD Order Item: ${itemName}`)
        debugLog(`   Original size: ${originalSize || 'none'}`)
        debugLog(`   Enhanced size: ${enhanced.size || 'none'}`)
        debugLog(`   Color: ${enhanced.color || 'none'}`)
        
        const orderItem: OrderHTMLItem = {
          name: itemName,
          quantity: item.quantity,
          price: item.price
        }
        if (item.image) {
          orderItem.image = item.image
        }
        // Always set size if we have it (from item or default)
        if (enhanced.size && enhanced.size.trim()) {
          orderItem.size = enhanced.size.trim()
        }
        if (enhanced.color && enhanced.color.trim()) {
          orderItem.color = enhanced.color.trim()
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
      ? (await import('@/messages/ar.json')).default.orderEmail.cod
      : locale === 'ru'
      ? (await import('@/messages/ru.json')).default.orderEmail.cod
      : (await import('@/messages/en.json')).default.orderEmail.cod

    const orderHTML = generateCODOrderHTML(orderHTMLData, locale, translations)

    // Send email to customer (non-blocking - fire and forget)
    const emailSubject = (translations?.subject || `Order Confirmation #${orderNumber} - GENOSYS Professional`).replace('#{orderNumber}', orderNumber).replace('{orderNumber}', orderNumber)
    
    debugLog('📧 Attempting to send COD confirmation email to customer:', customerEmail)
    debugLog('📧 Email subject:', emailSubject)
    
    sendEmail(
      customerEmail.trim(),
      emailSubject,
      orderHTML
    ).then((result) => {
      if (result.success) {
        debugLog('✅ COD order confirmation email sent successfully to:', customerEmail)
        debugLog('✅ Message ID:', result.messageId || 'N/A')
      } else {
        errorLog('❌ FAILED to send COD order confirmation email to:', customerEmail)
        errorLog('❌ Error:', result.error)
        errorLog('❌ Order number:', orderNumber)
      }
    }).catch((emailError) => {
      errorLog('❌ EXCEPTION sending COD order confirmation email to:', customerEmail)
      errorLog('❌ Exception:', emailError)
      errorLog('❌ Order number:', orderNumber)
      errorLog('❌ Stack:', emailError instanceof Error ? emailError.stack : 'No stack')
      // Don't fail order creation if email fails
    })

    // Send admin notification for COD order (non-blocking - fire and forget)
    debugLog('📧 Sending admin notification for COD order:', orderNumber)
    debugLog('📧 Order data:', JSON.stringify({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      total,
      itemCount: orderItems.length,
      subtotal,
      shippingCost,
      vatAmount
    }, null, 2))
    
    debugLog('📧 Calling sendAdminNewOrderNotification for COD order:', orderNumber)
    const adminNotificationPromise = sendAdminNewOrderNotification({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      total,
      itemCount: orderItems.length,
      items: orderItems.map((item: OrderItemData) => {
        const emailItem: {
          productName: string
          quantity: number
          price: number
          image: string
          size?: string
          color?: string
        } = {
          productName: item.productName || 'Product',
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
      address: (customerAddress && customerAddress.trim()) || undefined,
      emirate: (emirate && emirate.trim()) || undefined,
      deviceType
    })
    
    adminNotificationPromise.then((adminResult) => {
      if (adminResult.success) {
        debugLog('✅ Admin notification sent successfully for COD order:', orderNumber)
        debugLog('✅ Admin notification result:', JSON.stringify(adminResult, null, 2))
      } else {
        errorLog('❌ FAILED to send admin notification for COD order:', orderNumber)
        errorLog('❌ Admin notification error:', adminResult.error)
        errorLog('❌ Admin notification error details:', JSON.stringify(adminResult, null, 2))
      }
    }).catch((emailError) => {
      errorLog('❌ EXCEPTION sending admin notification for COD order:', orderNumber)
      errorLog('❌ Exception details:', emailError)
      errorLog('❌ Exception stack:', emailError instanceof Error ? emailError.stack : 'No stack')
      // Don't fail order creation if email fails
    })

    // Return success response immediately (emails are sent asynchronously)
    // Don't wait for database save if it's slow - order processing continues async
    return NextResponse.json({ 
      success: true, 
      message: 'COD order confirmation sent successfully',
      orderId: savedOrder?.id || 'pending',
      orderNumber: orderNumber
    })

  } catch (error) {
    errorLog('Error sending COD order confirmation:', error)
    return NextResponse.json(
      { error: 'Failed to send COD order confirmation', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
