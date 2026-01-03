import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, generateSupportLinkOrderHTML } from '@/lib/email'
import { errorLog, debugLog } from '@/lib/logger'
import { prisma } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, orderNumber } = await request.json()
    const testEmail = email || 'f.this.that@gmail.com'

    let supportOrderData: any

    // If orderNumber is provided, fetch from database
    if (orderNumber) {
      debugLog('Fetching order from database:', orderNumber)
      const order = await prisma.order.findFirst({
        where: { orderNumber },
        include: { items: true }
      })

      if (order) {
        supportOrderData = {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: testEmail, // Use the override email
          customerPhone: order.customerPhone || '',
          customerAddress: order.customerAddress || '',
          emirate: order.customerEmirate || 'Dubai',
          items: order.items.map(item => ({
            name: item.productName || 'Product',
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            image: item.image || '',
            color: item.color || undefined,
            size: item.size || undefined
          })),
          subtotal: order.subtotal || 0,
          shippingCost: order.shipping || 0,
          vatAmount: order.vat || 0,
          total: order.total
        }
        debugLog('Order found:', supportOrderData.orderNumber)
      } else {
        return NextResponse.json(
          { error: `Order not found: ${orderNumber}` },
          { status: 404 }
        )
      }
    } else {
      // Use sample data
      supportOrderData = {
        orderNumber: 'SUP2511300207',
        customerName: 'Vadim Sagatdinov',
        customerEmail: testEmail,
        customerPhone: '+971 559152985',
        customerAddress: 'Dubai',
        emirate: 'Dubai',
        items: [
          {
            name: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
            quantity: 2,
            price: 150.00,
            total: 300.00,
            image: 'https://genosys.ae/images/CUSHC.png',
            color: 'Beige',
            size: 'Medium'
          },
          {
            name: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
            quantity: 1,
            price: 156.75,
            total: 156.75,
            image: 'https://genosys.ae/images/HRS.jpg'
          }
        ],
        subtotal: 456.75,
        shippingCost: 45.00,
        vatAmount: 23.89,
        total: 525.64
      }
    }
    
    // Generate email with Apple-style template
    const locale = 'en'
    const orderHTML = generateSupportLinkOrderHTML(supportOrderData, locale)
    const emailSubject = `Order Request Submitted #${supportOrderData.orderNumber} - GENOSYS Professional`
    
    const result = await sendEmail(testEmail, emailSubject, orderHTML)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Support link order email sent successfully to ${testEmail}`,
        orderNumber: supportOrderData.orderNumber,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send email: ${result.error}` },
        { status: 500 }
      )
    }

  } catch (error) {
    errorLog('Error sending sample support link email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

