import { NextRequest, NextResponse } from 'next/server'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { trackUserAction } from '@/lib/analyticsServer'
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email'
// import { trackPurchase } from '@/lib/analytics' // Unused for now

export async function POST(request: NextRequest) {
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
    console.log('🔍 Order calculation debug:')
    console.log('Items received:', JSON.stringify(items, null, 2))
    
    const subtotal = items.reduce((total: number, item: any) => {
      const itemTotal = item.product.price * item.quantity
      console.log(`Item: ${item.product.name} - Price: ${item.product.price} x Qty: ${item.quantity} = ${itemTotal}`)
      return total + itemTotal
    }, 0)
    
    console.log('Subtotal calculated:', subtotal)
    
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
    
    console.log('Emirate:', customerEmirate)
    console.log('Base shipping cost:', baseShippingCost)
    console.log('Final shipping:', shipping)
    
    const discountAmount = 0 // You can add discount logic here if needed
    const totalBeforeVAT = subtotal - discountAmount + shipping
    const vat = totalBeforeVAT * 0.05
    const total = totalBeforeVAT + vat

    console.log('Discount amount:', discountAmount)
    console.log('Total before VAT:', totalBeforeVAT)
    console.log('VAT (5%):', vat)
    console.log('Final total:', total)

    // Generate order ID - shorter numeric format
    const orderId = (Math.floor(Math.random() * 900000000) + 100000000).toString()

    // Create order items
    const orderItems: OrderItemData[] = items.map((item: any) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }))

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

    // Track order creation in database
    await trackUserAction({
      action: 'order_created',
      userEmail: customerEmail,
      details: `Order #${orderId} - ${items.length} items - Total: ${total} AED`
    })

    // Track purchase in Google Analytics (server-side)
    // Note: This will be called on the server, so we need to handle it differently
    // The actual Google Analytics tracking should happen on the client side
    console.log('📊 Purchase tracking data prepared for client-side Google Analytics:', {
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

    // Send order confirmation email to customer
    try {
      await sendOrderConfirmationEmail({
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
        shipping: order.shipping,
        vat: order.vat,
        total: order.total,
        address: order.customerAddress,
        emirate: order.customerEmirate
      })
      console.log('✅ Order confirmation email sent to:', order.customerEmail)
    } catch (emailError) {
      console.error('❌ Failed to send order confirmation email:', emailError)
      // Don't fail order creation if email fails
    }

    // Send admin notification for new order
    try {
      await sendAdminNewOrderNotification({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
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
      })
      console.log('✅ Admin notification sent for new order:', order.orderNumber)
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError)
      // Don't fail order creation if email fails
    }

    // Return success response
    return NextResponse.json({ 
      orderId: orderId,
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Failed to process checkout. Please try again.' },
      { status: 500 }
    )
  }
}
