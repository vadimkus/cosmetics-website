import { NextRequest, NextResponse } from 'next/server'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { trackUserAction } from '@/lib/analyticsServer'
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { Product } from '@/types/index'
import { enhanceOrderItemWithDefaultSize } from '@/lib/orderSizeDefaults'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { findUserByEmail } from '@/lib/userStorageDb'
import { calculateMobileShipping, calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { sendWhatsAppOrderConfirmation, isTwilioConfigured } from '@/lib/twilio'

interface CheckoutItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  // Request body size limit check (DoS prevention)
  const sizeLimit = getSizeLimitForContentType(request)
  const sizeCheck = requireBodySizeLimit(request, sizeLimit)
  if (!sizeCheck.valid) {
    return sizeCheck.response!
  }

  try {
    const { 
      items, 
      customerEmail, 
      customerName, 
      customerPhone, 
      customerEmirate, 
      customerAddress,
      locale,
      paymentMethod = 'cod' // Default to COD for backward compatibility
    } = await request.json()

    debugLog('🔄 Processing checkout request:', {
      paymentMethod,
      customerEmail,
      itemCount: items.length
    })

    // Stripe payments are handled directly by the client via /api/stripe/create-checkout-session
    // This route only handles COD payments for backward compatibility
    if (paymentMethod === 'stripe') {
      debugLog('⚠️ Stripe payment received at checkout route - should go directly to /api/stripe/create-checkout-session')
      return NextResponse.json(
        { error: 'Stripe payments should be processed via /api/stripe/create-checkout-session endpoint' },
        { status: 400 }
      )
    }

    // Continue with COD processing for backward compatibility

    // Fetch user to check for contactEmail (for Apple Private Relay users)
    const user = await findUserByEmail(customerEmail)
    const emailToUse = user ? getPreferredEmail(user) : customerEmail

    debugLog('📧 Email routing:', {
      customerEmail,
      hasUser: !!user,
      hasContactEmail: !!(user?.contactEmail),
      emailToUse,
      isAppleRelay: customerEmail.includes('@privaterelay.appleid.com')
    })

    // Calculate order totals with debugging
    debugLog('🔍 Order calculation debug:')
    debugLog('Items received:', JSON.stringify(items, null, 2))
    
    const subtotal = items.reduce((total: number, item: CheckoutItem) => {
      const itemTotal = item.product.price * item.quantity
      debugLog(`Item: ${item.product.name} - Price: ${item.product.price} x Qty: ${item.quantity} = ${itemTotal}`)
      return total + itemTotal
    }, 0)
    
    debugLog('Subtotal calculated:', subtotal)
    
    // Use shared mobile checkout config for consistency
    const shipping = calculateMobileShipping(subtotal, customerEmirate)
    
    debugLog('Emirate:', customerEmirate)
    debugLog('Final shipping:', shipping)
    
    const discountAmount = 0 // You can add discount logic here if needed
    const total = subtotal - discountAmount + shipping
    const vat = calculateVatIncluded(total)

    debugLog('Discount amount:', discountAmount)
    debugLog('Subtotal (VAT included):', subtotal)
    debugLog('Shipping (VAT included):', shipping)
    debugLog('VAT amount (calculated from inclusive prices):', vat)
    debugLog('Final total:', total)

    // Generate canonical order number (COD + Website)
    const orderId = await generateUniqueOrderNumber({ channel: 'W', payment: 'COD' })

    // Create order items
    const orderItems: OrderItemData[] = items.map((item: CheckoutItem) => {
      // Enhance with default size if missing
      const enhanced = enhanceOrderItemWithDefaultSize({
        productName: item.product.name,
        size: item.selectedSize || null,
        color: item.selectedColor || null
      })
      
      return {
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        color: enhanced.color || undefined,
        size: enhanced.size || undefined
      }
    })

    // Create order object
    const order: OrderData = {
      orderNumber: orderId,
      customerEmail,
      customerName,
      customerPhone,
      customerEmirate,
      customerAddress,
      items: orderItems,
      subtotal,
      discountAmount,
      shipping,
      vat,
      total,
      status: 'PENDING',
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'pending',
      locale: locale || 'en' // Capture locale from request, default to English
    }

    // Store the order
    await addOrder(order)

    // Track order creation in database (non-blocking)
    trackUserAction({
      action: 'order_created',
      userEmail: customerEmail,
      details: `Order #${orderId} - ${items.length} items - Total: ${total} AED`
    }).catch(err => {
      errorLog('❌ Failed to track order creation:', err)
    })

    // Track purchase in Google Analytics (server-side)
    // Note: This will be called on the server, so we need to handle it differently
    // The actual Google Analytics tracking should happen on the client side
    debugLog('📊 Purchase tracking data prepared for client-side Google Analytics:', {
      orderId,
      total,
      items: orderItems.map(item => ({
        id: item.productId,
        name: item.productName,
        category: 'cosmetics', // You can make this dynamic based on product data
        price: item.price,
        quantity: item.quantity
      }))
    })

    // Send order confirmation email to customer using new template (non-blocking - fire and forget)
    sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: emailToUse, // Use preferred email (contactEmail if set, else regular email)
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image || '',
        ...(item.size ? { size: item.size } : {}),
        ...(item.color ? { color: item.color } : {})
      })),
      subtotal: order.subtotal || 0,
      shipping: order.shipping || 0,
      vat: order.vat || 0,
      total: order.total || 0,
      address: order.customerAddress || '',
      emirate: order.customerEmirate || '',
      locale: order.locale || 'en'
    }).then(() => {
      debugLog('✅ Order confirmation email sent to:', emailToUse)
    }).catch((emailError) => {
      errorLog('❌ Failed to send order confirmation email:', emailError)
      // Don't fail order creation if email fails
    })

    // Send admin notification for new order (non-blocking - fire and forget)
    sendAdminNewOrderNotification({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: emailToUse,
      customerPhone: customerPhone,
      total: order.total,
      itemCount: order.items.length,
      items: order.items.map(item => {
        const emailItem: {
          productName: string
          quantity: number
          price: number
          image: string
          size?: string
          color?: string
        } = {
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        }
        if (item.size) {
          emailItem.size = item.size
        }
        if (item.color) {
          emailItem.color = item.color
        }
        return emailItem
      }),
      subtotal: order.subtotal,
      shipping: order.shipping,
      vat: order.vat,
      address: order.customerAddress,
      emirate: order.customerEmirate,
      paymentStatus: 'COD',
      paymentMethod: 'Cash on Delivery'
    }).then((adminResult) => {
      if (adminResult.success) {
        debugLog('✅ Admin notification sent for new order:', order.orderNumber)
      } else {
        errorLog('❌ Failed to send admin notification:', adminResult.error)
        errorLog('❌ Admin notification error details:', JSON.stringify(adminResult, null, 2))
      }
    }).catch((emailError) => {
      errorLog('❌ Exception sending admin notification:', emailError)
      errorLog('❌ Exception details:', emailError instanceof Error ? emailError.message : String(emailError))
      // Don't fail order creation if email fails
    })

    // Send WhatsApp order confirmation (non-blocking - fire and forget)
    if (isTwilioConfigured() && customerPhone) {
      sendWhatsAppOrderConfirmation(customerPhone, {
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        total: order.total,
        itemCount: order.items.length,
        locale: order.locale
      }).then((whatsappResult) => {
        if (whatsappResult.success) {
          debugLog('✅ WhatsApp order confirmation sent to:', customerPhone)
        } else if (whatsappResult.skipped) {
          debugLog('⏭️ WhatsApp notification skipped:', whatsappResult.reason)
        } else {
          errorLog('❌ Failed to send WhatsApp notification:', whatsappResult.error)
        }
      }).catch((whatsappError) => {
        errorLog('❌ Exception sending WhatsApp notification:', whatsappError)
        // Don't fail order creation if WhatsApp fails
      })
    }

    // Return success response immediately (emails are sent asynchronously)
    return NextResponse.json({ 
      orderId: orderId,
      message: 'Order created successfully'
    })

  } catch (error) {
    errorLog('Error creating checkout session:', error)
    errorLog('Error details:', error instanceof Error ? error.message : 'Unknown error')
    errorLog('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Failed to process checkout. Please try again.' },
      { status: 500 }
    )
  }
}
