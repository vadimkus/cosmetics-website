import { NextRequest, NextResponse } from 'next/server'
import { readOrders } from '@/lib/orderStorage'

export async function GET(request: NextRequest) {
  try {
    // Get all orders from storage
    const orders = readOrders()
    
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