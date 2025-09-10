import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/lib/databaseService'

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would verify admin authentication here
    // For now, we'll allow access to all orders
    
    const orders = await OrderService.getAll()
    
    // Transform orders to match the expected format
    const transformedOrders = orders.map((order: any) => ({
      id: order.id,
      customerEmail: order.user?.email || 'N/A',
      customerName: order.user?.name || 'N/A',
      customerPhone: order.user?.phone || 'N/A',
      customerEmirate: 'Dubai', // Default value since not in schema
      customerAddress: order.shippingAddress,
      items: order.items?.map((item: any) => ({
        productId: item.productId,
        productName: item.product?.name || 'N/A',
        price: item.price,
        quantity: item.quantity,
        image: item.product?.image || '/images/placeholder.jpg'
      })) || [],
      subtotal: order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0,
      discountAmount: 0, // Default value since not in schema
      shipping: 45, // Default value since not in schema
      vat: order.totalAmount * 0.05, // Calculate VAT
      total: order.totalAmount,
      status: order.status.toLowerCase(),
      createdAt: order.createdAt.toISOString()
    }))
    
    // Sort orders by creation date (newest first)
    const sortedOrders = transformedOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ 
      success: true,
      orders: sortedOrders 
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
