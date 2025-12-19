import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus, getOrderById, deleteOrder } from '@/lib/orderStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { sendOrderStatusUpdate } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection (defense in depth)
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { id } = await params
    const { status } = await request.json()

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']
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
      // Transform order items for email
      // getOrderById includes items relation, so we need to type assert or access safely
      const orderWithItems = order as typeof order & { items?: Array<{ productName: string; quantity: number; price: number; image: string; color?: string | null; size?: string | null }> }
      const mappedItems = orderWithItems.items ? orderWithItems.items.map(item => {
        const mappedItem: { productName: string; quantity: number; price: number; image?: string; color?: string; size?: string } = {
          productName: item.productName,
          quantity: item.quantity,
          price: item.price
        }
        if (item.image) mappedItem.image = item.image
        if (item.color) mappedItem.color = item.color
        if (item.size) mappedItem.size = item.size
        return mappedItem
      }) : undefined
      
      const emailOrder: Parameters<typeof sendOrderStatusUpdate>[0] = {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        id: order.id,
        ...(mappedItems ? { items: mappedItems } : {}),
        total: order.total,
        locale: order.locale || 'en', // Use order's locale, default to English
        ...(order.customerAddress ? { customerAddress: order.customerAddress } : {}),
        ...(order.customerEmirate ? { customerEmirate: order.customerEmirate } : {})
      }
      const emailResult = await sendOrderStatusUpdate(emailOrder, status)
      
      if (emailResult.success) {
        debugLog(`✅ Order status update email sent for order ${id} to ${order.customerEmail}`)
      } else {
        errorLog(`❌ Failed to send order status update email:`, emailResult.error)
        errorLog(`❌ Email error details:`, JSON.stringify(emailResult, null, 2))
      }
    } catch (emailError) {
      errorLog('❌ Exception sending order status update email:', emailError)
      errorLog('❌ Exception details:', emailError instanceof Error ? emailError.message : String(emailError))
      // Don't fail the status update if email fails
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order status updated successfully'
    })
  } catch {
    errorLog('Error updating order status:', error)
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
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection (defense in depth)
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

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
      
      debugLog(`✅ Deleted ${deletedByOrderNumber.count} analytics activities by order number`)
      debugLog(`✅ Deleted ${deletedByEmail.count} analytics activities by customer email`)
      
      // If no activities were deleted by order number, try to find and delete by pattern
      if (deletedByOrderNumber.count === 0) {
        debugLog(`⚠️ No activities found for order number ${order.orderNumber}, checking for pattern matches...`)
        
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
          debugLog(`🔍 Found ${patternMatches.length} potential matches for cleanup`)
          // Delete the most recent one that matches the customer email
          const mostRecent = patternMatches.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0]
          
          if (mostRecent) {
            await prisma.userAction.delete({
              where: {
                id: mostRecent.id
              }
            })
          }
          
          debugLog(`✅ Deleted most recent order activity for customer ${order.customerEmail}`)
        }
      }
    } catch (analyticsError) {
      errorLog('❌ Failed to delete analytics activities:', analyticsError)
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
  } catch {
    errorLog('Error deleting order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}