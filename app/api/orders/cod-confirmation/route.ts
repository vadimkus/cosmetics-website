import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendAdminNewOrderNotification } from '@/lib/email'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { requireCsrfToken } from '@/lib/csrf'

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

    // Generate order confirmation HTML for COD (using same template as order confirmation)
    const generateCODOrderHTML = (order: any) => {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e5e5; padding-bottom: 20px;">
            <div style="margin-bottom: 15px;">
              <img src="https://genosys.ae/_next/image?url=%2Fimages%2Fgenosys-logo.png%3Fv%3D1758554698129&w=828&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto;" />
            </div>
            <h1 style="color: #1f2937; margin: 0; font-size: 28px;">Order Confirmation #${order.orderNumber}</h1>
            <p style="color: #6b7280; margin: 5px 0; font-size: 16px;">dated: ${new Date().toLocaleDateString('en-AE', { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
              Thank you for your order, <strong>${order.customerName.split(' ')[0]}</strong>!
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
              Your order <strong>#${order.orderNumber}</strong> has been received and is being processed. You will pay via Cash on Delivery when your order arrives.
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
              Our team will be in touch with you for the next steps via phone/mail/whatsapp.
            </p>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #dc2626; margin: 0 0 15px 0;">Order Details</h3>
            <div style="margin-bottom: 20px;">
              ${order.items.map((item: any) => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #e5e7eb;">
                  <div style="flex: 1; min-width: 0; margin-right: 20px;">
                    <h4 style="margin: 0 0 5px 0; color: #374151; font-size: 16px; word-wrap: break-word;">${item.name}</h4>
                    <p style="margin: 0; color: #6b7280; font-size: 16px;">Qty: ${item.quantity}</p>
                  </div>
                  <div style="text-align: right; min-width: 80px; flex-shrink: 0;">
                    <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 16px;">AED ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0;">
                <span style="color: #374151; font-size: 16px;">Subtotal:</span>
                <span style="color: #374151; font-size: 16px; font-weight: 500;">AED ${order.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0;">
                <span style="color: #374151; font-size: 16px;">Shipping to ${order.emirate}:</span>
                <span style="color: #374151; font-size: 16px; font-weight: 500;">${order.shippingCost === 0 ? 'FREE' : `AED ${order.shippingCost.toFixed(2)}`}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0;">
                <span style="color: #374151; font-size: 16px;">VAT (5%):</span>
                <span style="color: #374151; font-size: 16px; font-weight: 500;">AED ${order.vatAmount.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 15px; margin-top: 15px; background: #f9fafb; padding: 15px; border-radius: 6px;">
                <span>Total:</span>
                <span>AED ${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #dc2626; margin: 0 0 15px 0;">Delivery Information</h3>
            <p style="color: #374151; margin: 0 0 10px 0; font-size: 16px;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="color: #374151; margin: 0 0 10px 0; font-size: 16px;"><strong>Phone:</strong> ${order.customerPhone}</p>
            <p style="color: #374151; margin: 0 0 10px 0; font-size: 16px;"><strong>Address:</strong> ${order.customerAddress}</p>
            <p style="color: #374151; margin: 0; font-size: 16px;"><strong>Emirate:</strong> ${order.emirate}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://wa.me/971585487665?text=Hi! I need help with my order ${order.orderNumber}. Can you assist me?" 
               style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: bold; 
                      display: inline-block;">
              Contact Support via WhatsApp
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #000000; font-size: 14px;">
            <div style="text-align: center; margin-bottom: 15px;">
              <img src="https://genosys.ae/_next/image?url=%2FLogo%2FFull.png&w=640&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto;" />
            </div>
            <p style="color: #000000; margin: 0;">Official Distributor in the UAE</p>
            <p style="color: #000000; margin: 0;">© 2025 Genosys Middle East FZ-LLC. All rights reserved.</p>
          </div>
        </div>
      `
    }

    // Save order to database
    const orderItems: OrderItemData[] = items.map((item: any) => ({
      productId: item.id || `product-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || '/images/placeholder.jpg'
    }))

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
    console.log('✅ COD order saved to database:', savedOrder.id)

    const orderHTML = generateCODOrderHTML({
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
    })

    // Send email to customer
    const result = await sendEmail(
      customerEmail,
      `Order Confirmation #${orderNumber} - GENOSYS Professional`,
      orderHTML
    )

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email')
    }

    // Send admin notification for COD order
    console.log('📧 Sending admin notification for COD order:', orderNumber)
    const adminResult = await sendAdminNewOrderNotification({
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
    })

    if (adminResult.success) {
      console.log('✅ Admin notification sent for COD order:', orderNumber)
    } else {
      console.error('❌ Failed to send admin notification for COD order:', adminResult.error)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'COD order confirmation sent successfully',
      orderId: savedOrder.id,
      adminNotificationSent: adminResult.success
    })

  } catch (error) {
    console.error('Error sending COD order confirmation:', error)
    return NextResponse.json(
      { error: 'Failed to send COD order confirmation', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
