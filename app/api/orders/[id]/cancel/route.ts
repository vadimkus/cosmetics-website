import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/lib/databaseService'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find the order using Prisma
    const order = await OrderService.findById(id)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order can be cancelled
    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      return NextResponse.json(
        { success: false, error: 'Order cannot be cancelled as it has already been shipped or delivered' },
        { status: 400 }
      )
    }

    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: 'Order is already cancelled' },
        { status: 400 }
      )
    }

    // Delete the order completely using Prisma
    await OrderService.delete(id)

    return NextResponse.json({ 
      success: true,
      message: 'Order cancelled and removed successfully'
    })
  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}
