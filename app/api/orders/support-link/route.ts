import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendAdminNewOrderNotification } from '@/lib/email'
import { debugLog, errorLog } from '@/lib/logger'
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
      orderNumber
    } = orderData

    // Generate order summary HTML for support-link
    const generateSupportLinkOrderHTML = (order: any) => {
      const itemsHTML = (order.items || []).map((item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">AED ${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">AED ${item.total.toFixed(2)}</td>
        </tr>
      `).join('')

      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; font-size: 14px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="margin-bottom: 15px;">
              <img src="https://genosys.ae/_next/image?url=%2Fimages%2Fgenosys-logo.png%3Fv%3D1758554698129&w=828&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto;" />
            </div>
            <h1 style="color: #dc2626; margin: 0; font-size: 14px;">Genosys Middle East FZ-LLC</h1>
            <p style="color: #666; margin: 5px 0; font-size: 14px;">Official Genosys distributor in the United Arab Emirates</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
            <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
              Dear <strong>${order.customerName.split(' ')[0]}</strong>,
            </p>
            <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
              Your order request has been submitted. Our support team will contact you shortly to generate a secure payment link.
            </p>
            <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">
              Order Request #<strong>${order.orderNumber}</strong>
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
            <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px;">Customer Information</h3>
            <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Email:</strong> ${order.customerEmail}</p>
            <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Phone:</strong> ${order.customerPhone}</p>
            <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Address:</strong> ${order.customerAddress}</p>
            <p style="margin: 0; color: #374151; font-size: 14px;"><strong>Emirate:</strong> ${order.emirate}</p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
            <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <thead>
                <tr style="background: #dc2626; color: white;">
                  <th style="padding: 10px; text-align: left; font-size: 14px;">Product</th>
                  <th style="padding: 10px; text-align: center; font-size: 14px;">Qty</th>
                  <th style="padding: 10px; text-align: right; font-size: 14px;">Price</th>
                  <th style="padding: 10px; text-align: right; font-size: 14px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
            <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151; font-size: 14px;">Subtotal:</span>
              <span style="color: #374151; font-size: 14px;">AED ${order.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151; font-size: 14px;">Shipping to ${order.emirate}:</span>
              <span style="color: #374151; font-size: 14px;">${order.shippingCost === 0 ? 'FREE' : `AED ${order.shippingCost.toFixed(2)}`}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151; font-size: 14px;">VAT (5%):</span>
              <span style="color: #374151; font-size: 14px;">AED ${order.vatAmount.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 8px;">
              <span>Total:</span>
              <span>AED ${order.total.toFixed(2)}</span>
            </div>
          </div>

          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" 
               style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: bold; 
                      display: inline-block; 
                      margin-right: 10px;">
              Continue Shopping
            </a>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contact" 
               style="background: transparent; 
                      color: #dc2626; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border: 2px solid #dc2626; 
                      border-radius: 6px; 
                      font-weight: bold; 
                      display: inline-block;">
              Contact Support
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #000000; font-size: 14px;">
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
    debugLog('✅ Support Link order saved to database:', savedOrder.id)

    const orderHTML = generateSupportLinkOrderHTML({
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
      orderNumber
    })

    // Send email to customer
    const result = await sendEmail(
      customerEmail,
      `Order Request Submitted #${orderNumber} - GENOSYS Professional`,
      orderHTML
    )

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email')
    }

    // Send admin notification for support-link order
    debugLog('📧 Sending admin notification for support-link order:', orderNumber)
    const adminResult = await sendAdminNewOrderNotification({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      total,
      itemCount: items.length,
      items: items.map((item: { name?: string; quantity: number; price: number; image?: string }) => ({
        productName: item.name || 'Product',
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
      debugLog('✅ Admin notification sent for support-link order:', orderNumber)
    } else {
      errorLog('❌ Failed to send admin notification for support-link order:', adminResult.error)
      errorLog('❌ Admin notification error details:', JSON.stringify(adminResult, null, 2))
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Support link order request sent successfully',
      orderId: savedOrder.id,
      adminNotificationSent: adminResult.success
    })

  } catch (error) {
    errorLog('Error sending support link order request:', error)
    return NextResponse.json(
      { error: 'Failed to send support link order request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
