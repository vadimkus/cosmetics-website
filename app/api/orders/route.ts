import { NextRequest, NextResponse } from 'next/server'
import { getOrdersByEmail } from '@/lib/orderStorageDb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Get orders for the specific user, excluding cancelled orders
    const allOrders = await getOrdersByEmail(email)
    const orders = allOrders.filter(order => order.status !== 'cancelled')
    
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
