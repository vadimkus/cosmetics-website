import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendAdminNewOrderNotification, generateCODOrderHTML, OrderHTMLData, OrderHTMLItem } from '@/lib/email'
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
      total
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

    // Save to database
    const savedOrder = await addOrder(dbOrder)
    debugLog('✅ COD order saved to database:', savedOrder.id)

    // Prepare order HTML data with proper types
    const orderHTMLData: OrderHTMLData = {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      emirate,
      items: items.map((item: { name: string; quantity: number; price: number; image?: string }): OrderHTMLItem => {
        const orderItem: OrderHTMLItem = {
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }
        if (item.image) {
          orderItem.image = item.image
        }
        return orderItem
      }),
      subtotal,
      shippingCost,
      vatAmount,
      total
    }

    const orderHTML = generateCODOrderHTML(orderHTMLData)

    // Send email to customer (non-blocking - fire and forget)
    sendEmail(
      customerEmail,
      `Order Confirmation #${orderNumber} - GENOSYS Professional`,
      orderHTML
    ).then((result) => {
      if (result.success) {
        debugLog('✅ COD order confirmation email sent to:', customerEmail)
      } else {
        errorLog('❌ Failed to send COD order confirmation email:', result.error)
      }
    }).catch((emailError) => {
      errorLog('❌ Exception sending COD order confirmation email:', emailError)
      // Don't fail order creation if email fails
    })

    // Send admin notification for COD order (non-blocking - fire and forget)
    debugLog('📧 Sending admin notification for COD order:', orderNumber)
    sendAdminNewOrderNotification({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      total,
      itemCount: orderItems.length,
      items: orderItems.map((item: OrderItemData) => ({
        productName: item.productName || 'Product',
        quantity: item.quantity,
        price: item.price,
        image: item.image || '/images/default-product.jpg'
      })),
      subtotal,
      shipping: shippingCost,
      vat: vatAmount,
      address: customerAddress,
      emirate: emirate
    }).then((adminResult) => {
      if (adminResult.success) {
        debugLog('✅ Admin notification sent for COD order:', orderNumber)
      } else {
        errorLog('❌ Failed to send admin notification for COD order:', adminResult.error)
        errorLog('❌ Admin notification error details:', JSON.stringify(adminResult, null, 2))
      }
    }).catch((emailError) => {
      errorLog('❌ Exception sending admin notification for COD order:', emailError)
      // Don't fail order creation if email fails
    })

    // Return success response immediately (emails are sent asynchronously)
    return NextResponse.json({ 
      success: true, 
      message: 'COD order confirmation sent successfully',
      orderId: savedOrder.id
    })

  } catch (error) {
    errorLog('Error sending COD order confirmation:', error)
    return NextResponse.json(
      { error: 'Failed to send COD order confirmation', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
