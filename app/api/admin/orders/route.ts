import { NextRequest, NextResponse } from 'next/server'
import { readOrders, getOrdersByEmail } from '@/lib/orderStorageDb'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('customerEmail')
    
    let orders
    
    // If customer email is provided, use the database query for better accuracy
    if (customerEmail) {
      const trimmedEmail = customerEmail.trim()
      console.log(`📊 Admin orders API: Searching for orders with email: "${trimmedEmail}"`)
      
      // Use database query to get orders by email (case-insensitive matching in database)
      const allOrdersForCustomer = await getOrdersByEmail(trimmedEmail, 1000, 0)
      console.log(`📊 Admin orders API: getOrdersByEmail returned ${allOrdersForCustomer.length} orders`)
      
      // Filter out cancelled orders
      orders = allOrdersForCustomer.filter(order => {
        const isNotCancelled = order.status !== 'CANCELLED'
        if (!isNotCancelled) {
          console.log(`📊 Filtered out cancelled order: ${order.orderNumber} (status: ${order.status})`)
        }
        return isNotCancelled
      })
      
      console.log(`📊 Admin orders API: Found ${orders.length} non-cancelled orders for customer ${trimmedEmail}`)
      if (orders.length > 0 && orders[0]) {
        const firstOrder = orders[0]
        const itemsCount = 'items' in firstOrder && Array.isArray(firstOrder.items) 
          ? firstOrder.items.length 
          : 0
        console.log(`📊 Sample order:`, {
          orderNumber: firstOrder.orderNumber,
          status: firstOrder.status,
          total: firstOrder.total,
          itemsCount
        })
      }
    } else {
      // Get all orders from storage, excluding cancelled orders
      const allOrders = await readOrders()
      console.log(`📊 Admin orders API: Found ${allOrders.length} total orders`)
      orders = allOrders.filter(order => order.status !== 'CANCELLED')
      console.log(`📊 Admin orders API: Returning ${orders.length} non-cancelled orders`)
    }
    
    // Serialize orders to ensure dates are properly converted to strings
    const serializedOrders = orders.map(order => {
      const baseOrder = {
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString()
      }
      
      // Only include items if they exist
      if ('items' in order && Array.isArray(order.items)) {
        return {
          ...baseOrder,
          items: order.items.map(item => ({
            ...item
          }))
        }
      }
      
      return baseOrder
    })
    
    console.log(`📊 Admin orders API: Returning ${serializedOrders.length} serialized orders`)
    
    return NextResponse.json({ 
      success: true,
      orders: serializedOrders
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}