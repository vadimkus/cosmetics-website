import { NextRequest, NextResponse } from 'next/server'
import { readOrders } from '@/lib/orderStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { requireDevelopment } from '@/lib/apiErrorHandler'

export async function GET(request: NextRequest) {
  // Development-only route
  const devCheck = requireDevelopment()
  if (devCheck) return devCheck

  try {
    // Get admin email from headers
    const adminEmail = request.headers.get('x-admin-email')
    debugLog('🔍 Test admin orders API - Admin email:', adminEmail)
    
    // Get all orders
    const allOrders = await readOrders()
    debugLog(`📊 Test API: Found ${allOrders.length} total orders`)
    
    const nonCancelledOrders = allOrders.filter(order => order.status !== 'CANCELLED')
    debugLog(`📊 Test API: Returning ${nonCancelledOrders.length} non-cancelled orders`)
    
    return NextResponse.json({ 
      success: true,
      adminEmail,
      totalOrders: allOrders.length,
      nonCancelledOrders: nonCancelledOrders.length,
      orders: nonCancelledOrders.slice(0, 3).map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        status: order.status,
        total: order.total
      }))
    })
  } catch (error) {
    errorLog('Error in test admin orders API:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

