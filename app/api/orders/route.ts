import { NextRequest, NextResponse } from 'next/server'
import { getOrdersByEmail, getOrdersCountByEmail } from '@/lib/orderStorageDb'
import { errorLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const limitParam = parseInt(searchParams.get('limit') || '50')
    const offsetParam = parseInt(searchParams.get('offset') || '0')
    const limit = Number.isNaN(limitParam) ? 50 : limitParam
    const offset = Number.isNaN(offsetParam) ? 0 : offsetParam

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Get orders for the specific user with pagination, excluding cancelled and deleted orders
    const allOrders = await getOrdersByEmail(email, limit, offset)
    const orders = allOrders.filter(order => {
      const status = String(order.status || '').toUpperCase()
      return status !== 'CANCELLED' && status !== 'DELETED'
    })
    const totalCount = await getOrdersCountByEmail(email)
    
    return NextResponse.json({ 
      orders, 
      totalCount,
      hasMore: offset + limit < totalCount
    })
  } catch {
    errorLog('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
