import { NextRequest, NextResponse } from 'next/server'
import { sendOrderNotification, sendOrderConfirmation } from '@/lib/emailService'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'

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

    // Calculate order totals
    const subtotal = items.reduce((total: number, item: any) => 
      total + (item.product.price * item.quantity), 0
    )
    
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
    
    const discountAmount = 0 // You can add discount logic here if needed
    const totalBeforeVAT = subtotal - discountAmount + shipping
    const vat = totalBeforeVAT * 0.05
    const total = totalBeforeVAT + vat

    // Generate order ID
    const orderId = `Genosys Order ${Math.floor(Math.random() * 9999) + 1000}`

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

    // Send email notifications
    try {
      await Promise.all([
        sendOrderNotification(order),
        sendOrderConfirmation(order)
      ])
      console.log(`Order ${order.orderNumber} created and notifications sent`)
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError)
      // Don't fail the checkout if email fails
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
