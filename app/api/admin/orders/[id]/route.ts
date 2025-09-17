import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus, getOrderById, deleteOrder } from '@/lib/orderStorageDb'
import { sendOrderStatusUpdate } from '@/lib/emailService'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()

    // Validate status
    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Check if order exists
    const order = await getOrderById(id)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order status in database
    const success = await updateOrderStatus(id, status)
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update order status' },
        { status: 500 }
      )
    }

    // Send email notification to customer about status change
    try {
      await sendOrderStatusUpdate(order, status)
      console.log(`Order status update email sent for order ${id} to ${order.customerEmail}`)
    } catch (emailError) {
      console.error('Error sending order status update email:', emailError)
      // Don't fail the status update if email fails
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order status updated successfully'
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if order exists
    const order = await getOrderById(id)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Delete related user actions from analytics (order_created activities)
    try {
      // Delete activities that match the order number exactly
      const deletedByOrderNumber = await prisma.userAction.deleteMany({
        where: {
          action: 'order_created',
          details: {
            contains: order.orderNumber
          }
        }
      })
      
      // Also delete activities that match the customer email and are order-related
      // This catches cases where order numbers might not match exactly
      const deletedByEmail = await prisma.userAction.deleteMany({
        where: {
          action: 'order_created',
          userEmail: order.customerEmail,
          details: {
            contains: 'items - Total:'
          }
        }
      })
      
      console.log(`✅ Deleted ${deletedByOrderNumber.count} analytics activities by order number`)
      console.log(`✅ Deleted ${deletedByEmail.count} analytics activities by customer email`)
      
      // If no activities were deleted by order number, try to find and delete by pattern
      if (deletedByOrderNumber.count === 0) {
        console.log(`⚠️ No activities found for order number ${order.orderNumber}, checking for pattern matches...`)
        
        // Look for activities that might reference this order with different formatting
        const patternMatches = await prisma.userAction.findMany({
          where: {
            action: 'order_created',
            userEmail: order.customerEmail,
            details: {
              contains: 'items - Total:'
            }
          }
        })
        
        if (patternMatches.length > 0) {
          console.log(`🔍 Found ${patternMatches.length} potential matches for cleanup`)
          // Delete the most recent one that matches the customer email
          const mostRecent = patternMatches.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0]
          
          await prisma.userAction.delete({
            where: {
              id: mostRecent.id
            }
          })
          
          console.log(`✅ Deleted most recent order activity for customer ${order.customerEmail}`)
        }
      }
    } catch (analyticsError) {
      console.error('❌ Failed to delete analytics activities:', analyticsError)
      // Don't fail order deletion if analytics cleanup fails
    }

    // Delete order from database
    const deleted = await deleteOrder(id)
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete order' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}