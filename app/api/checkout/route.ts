import { NextRequest, NextResponse } from 'next/server'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { trackUserAction } from '@/lib/analyticsServer'
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { Product } from '@/types/index'
import { enhanceOrderItemWithDefaultSize } from '@/lib/orderSizeDefaults'
// import { trackPurchase } from '@/lib/analytics' // Unused for now

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
      customerAddress 
    } = await request.json()

    // Calculate order totals with debugging
    debugLog('🔍 Order calculation debug:')
    debugLog('Items received:', JSON.stringify(items, null, 2))
    
    const subtotal = items.reduce((total: number, item: CheckoutItem) => {
      const itemTotal = item.product.price * item.quantity
      debugLog(`Item: ${item.product.name} - Price: ${item.product.price} x Qty: ${item.quantity} = ${itemTotal}`)
      return total + itemTotal
    }, 0)
    
    debugLog('Subtotal calculated:', subtotal)
    
    // Calculate shipping (free for orders above 1000 AED)
    const emirates = [
      { name: 'Dubai', shippingCost: 45 },
      { name: 'Abu Dhabi', shippingCost: 70 },
      { name: 'Sharjah', shippingCost: 70 },
      { name: 'Ajman', shippingCost: 70 },
      { name: 'Ras Al Khaimah', shippingCost: 70 },
      { name: 'Fujairah', shippingCost: 70 },
      { name: 'Umm Al Quwain', shippingCost: 70 }
    ]
    
    const selectedEmirateData = emirates.find(e => e.name === customerEmirate)
    const baseShippingCost = selectedEmirateData?.shippingCost || 45
    const shipping = subtotal >= 1000 ? 0 : baseShippingCost
    
    debugLog('Emirate:', customerEmirate)
    debugLog('Base shipping cost:', baseShippingCost)
    debugLog('Final shipping:', shipping)
    
    const discountAmount = 0 // You can add discount logic here if needed
    const total = subtotal - discountAmount + shipping
    // Calculate VAT amount from VAT-inclusive prices
    // VAT = (VAT-inclusive amount / 1.05) * 0.05
    const vat = Math.round(((subtotal + shipping) / 1.05) * 0.05 * 100) / 100

    debugLog('Discount amount:', discountAmount)
    debugLog('Subtotal (VAT included):', subtotal)
    debugLog('Shipping (VAT included):', shipping)
    debugLog('VAT amount (calculated from inclusive prices):', vat)
    debugLog('Final total:', total)

    // Generate order ID - shorter numeric format
    const orderId = (Math.floor(Math.random() * 900000000) + 100000000).toString()

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
      status: 'PENDING'
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

    // Send order confirmation email to customer (non-blocking - fire and forget)
    sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      subtotal: order.subtotal,
      shipping: order.shipping ?? 0,
      vat: order.vat,
      total: order.total,
      address: order.customerAddress,
      emirate: order.customerEmirate
    }).then(() => {
      debugLog('✅ Order confirmation email sent to:', order.customerEmail)
    }).catch((emailError) => {
      errorLog('❌ Failed to send order confirmation email:', emailError)
      // Don't fail order creation if email fails
    })

    // Send admin notification for new order (non-blocking - fire and forget)
    sendAdminNewOrderNotification({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: customerPhone,
      total: order.total,
      itemCount: order.items.length,
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      vat: order.vat,
      address: order.customerAddress,
      emirate: order.customerEmirate
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
