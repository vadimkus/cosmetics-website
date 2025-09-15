import { NextRequest, NextResponse } from 'next/server'
import { readOrders } from '@/lib/orderStorageDb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('customerEmail')
    
    // Get all orders from storage, excluding cancelled orders
    const allOrders = await readOrders()
    console.log(`📊 Admin orders API: Found ${allOrders.length} total orders`)
    
    let orders = allOrders.filter(order => order.status !== 'CANCELLED')
    
    // Filter by customer email if provided
    if (customerEmail) {
      orders = orders.filter(order => order.customerEmail === customerEmail)
      console.log(`📊 Admin orders API: Found ${orders.length} orders for customer ${customerEmail}`)
    }
    
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