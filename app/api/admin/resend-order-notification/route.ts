import { NextRequest, NextResponse } from 'next/server'
import { sendAdminNewOrderNotification } from '@/lib/email'
import { getOrdersByEmail } from '@/lib/orderStorageDb'
import { Order, OrderItem } from '@prisma/client'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'

// Type definition for Order with items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection (defense in depth)
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { orderNumber, customerEmail } = await request.json()

    if (!orderNumber && !customerEmail) {
      return NextResponse.json(
        { error: 'Either orderNumber or customerEmail is required' },
        { status: 400 }
      )
    }

    let orders: OrderWithItems[] = []
    
    if (orderNumber) {
      // Get specific order by order number
      const allOrders = await getOrdersByEmail('') // Get all orders
      const specificOrder = allOrders.find(order => order.orderNumber === orderNumber)
      if (specificOrder) {
        orders = [specificOrder as OrderWithItems]
      }
    } else if (customerEmail) {
      // Get orders for specific customer
      orders = await getOrdersByEmail(customerEmail) as OrderWithItems[]
    }

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'No orders found' },
        { status: 404 }
      )
    }

    // Send admin notification for each order
    const results = []
    for (const order of orders) {
      try {
        const result = await sendAdminNewOrderNotification({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          total: order.total,
          itemCount: order.items.length
        })
        
        results.push({
          orderNumber: order.orderNumber,
          success: result.success,
          messageId: result.success && 'messageId' in result ? result.messageId : undefined,
          error: result.success ? undefined : result.error
        })
      } catch (error) {
        results.push({
          orderNumber: order.orderNumber,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} orders`,
      results
    })

  } catch (error) {
    console.error('Error resending order notifications:', error)
    return NextResponse.json(
      { error: 'Failed to resend notifications' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('email')
    
    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const orders = await getOrdersByEmail(customerEmail) as OrderWithItems[]
    
    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        itemCount: order.items.length,
        status: order.status,
        createdAt: order.createdAt
      }))
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
