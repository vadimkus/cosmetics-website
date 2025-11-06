import { NextRequest, NextResponse } from 'next/server'
import { getOrdersByEmail, getOrdersCountByEmail } from '@/lib/orderStorageDb'
import { errorLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Get orders for the specific user with pagination, excluding cancelled orders
    const allOrders = await getOrdersByEmail(email, limit, offset)
    const orders = allOrders.filter(order => order.status !== 'CANCELLED')
    const totalCount = await getOrdersCountByEmail(email)
    
    return NextResponse.json({ 
      orders, 
      totalCount,
      hasMore: offset + limit < totalCount
    })
  } catch (error) {
    errorLog('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
