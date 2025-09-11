import { NextRequest, NextResponse } from 'next/server'
import { readOrders } from '@/lib/orderStorageDb'

export async function GET(request: NextRequest) {
  try {
    // Get all orders from storage, excluding cancelled orders
    const allOrders = await readOrders()
    console.log(`📊 Admin orders API: Found ${allOrders.length} total orders`)
    const orders = allOrders.filter(order => order.status !== 'CANCELLED')
    console.log(`📊 Admin orders API: Returning ${orders.length} non-cancelled orders`)
    
    return NextResponse.json({ 
      success: true,
      orders 
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}