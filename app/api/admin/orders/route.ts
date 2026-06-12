import { NextRequest, NextResponse } from 'next/server'
import { readOrders, getOrdersByEmail, countOrders, READ_ORDERS_DEFAULT_LIMIT } from '@/lib/orderStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'
import { prisma } from '@/lib/database'

// Hard ceiling so a hand-crafted ?limit= can't trigger an unbounded scan.
const MAX_ORDERS_LIMIT = 2000

function parseBoundedInt(value: string | null, fallback: number, max: number): number {
  const n = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(n) || n < 0) return fallback
  return Math.min(n, max)
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('customerEmail')
    
    let orders
    let total: number | undefined
    let pageLimit: number | undefined
    let pageOffset: number | undefined
    
    // If customer email is provided, use the database query for better accuracy
    if (customerEmail) {
      const trimmedEmail = customerEmail.trim()
      debugLog(`📊 Admin orders API: Searching for orders with email: "${trimmedEmail}"`)
      
      // Use database query to get orders by email (case-insensitive matching in database)
      const allOrdersForCustomer = await getOrdersByEmail(trimmedEmail, 1000, 0)
      debugLog(`📊 Admin orders API: getOrdersByEmail returned ${allOrdersForCustomer.length} orders`)
      
      // Filter out cancelled + deleted orders
      orders = allOrdersForCustomer.filter(order => {
        const status = String(order.status || '').toUpperCase()
        const keep = status !== 'CANCELLED' && status !== 'DELETED'
        if (!keep) {
          debugLog(`📊 Filtered out order: ${order.orderNumber} (status: ${order.status})`)
        }
        return keep
      })
      
      debugLog(`📊 Admin orders API: Found ${orders.length} non-cancelled orders for customer ${trimmedEmail}`)
      if (orders.length > 0 && orders[0]) {
        const firstOrder = orders[0]
        const itemsCount = 'items' in firstOrder && Array.isArray(firstOrder.items) 
          ? firstOrder.items.length 
          : 0
        debugLog(`📊 Sample order:`, {
          orderNumber: firstOrder.orderNumber,
          status: firstOrder.status,
          total: firstOrder.total,
          itemsCount
        })
      }
    } else {
      // Get recent orders from storage, excluding deleted (keeps cancelled).
      // Bounded by limit/offset so the query stays fast as the table grows;
      // defaults return the newest READ_ORDERS_DEFAULT_LIMIT orders.
      const limit = parseBoundedInt(searchParams.get('limit'), READ_ORDERS_DEFAULT_LIMIT, MAX_ORDERS_LIMIT)
      const offset = parseBoundedInt(searchParams.get('offset'), 0, Number.MAX_SAFE_INTEGER)
      debugLog(`📊 Admin orders API: Calling readOrders(limit=${limit}, offset=${offset})...`)
      const allOrders = await readOrders(limit, offset)
      debugLog(`📊 Admin orders API: readOrders returned ${allOrders.length} orders`)
      
      if (allOrders.length === 0 && offset === 0) {
        debugLog('⚠️ Admin orders API: readOrders returned empty array!')
        // Try a direct query to see if it's a Prisma issue
        try {
          const directCount = await prisma.order.count()
          debugLog(`📊 Direct Prisma count: ${directCount} orders in database`)
        } catch (countError) {
          errorLog('❌ Error counting orders directly:', countError)
        }
      }
      
      orders = allOrders.filter(order => {
        const status = String(order.status || '').toUpperCase()
        return status !== 'DELETED'
      })
      // Total non-deleted count for pagination metadata (additive; existing
      // UI ignores it and just reads `orders`).
      total = await countOrders()
      pageLimit = limit
      pageOffset = offset
      debugLog(`📊 Admin orders API: Returning ${orders.length} non-deleted orders (page) of ${total} total`)
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
    
    debugLog(`📊 Admin orders API: Returning ${serializedOrders.length} serialized orders`)
    
    return NextResponse.json({ 
      success: true,
      orders: serializedOrders,
      ...(total !== undefined ? { total, limit: pageLimit, offset: pageOffset } : {})
    })
  } catch (error) {
    errorLog('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}