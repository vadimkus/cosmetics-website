import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/orderStorageDb'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Update order status to cancelled
    const success = await updateOrderStatus(id, 'CANCELLED')

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order cancelled successfully'
    })
  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}