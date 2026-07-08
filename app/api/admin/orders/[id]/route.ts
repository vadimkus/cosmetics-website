import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus, getOrderById, deleteOrder } from '@/lib/orderStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { sendOrderStatusUpdate } from '@/lib/email'
import { getPreferredEmail, isApplePrivateRelayEmail } from '@/lib/emailHelpers'
import { findUserByEmail } from '@/lib/userStorageDb'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { isTwilioConfigured } from '@/lib/twilio'
import { sendOrderStatusPushNotification, isValidExpoPushToken, OrderStatus, Locale } from '@/lib/expoPush'
import { awardPointsForDeliveredOrder, reverseRedemptionForOrder } from '@/lib/loyalty'
import { sendLoyaltyPointsEarnedEmail, sendLoyaltyTierUpgradeEmail } from '@/lib/email'

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

    // Return redeemed loyalty points when an order is cancelled (idempotent)
    if (status === 'CANCELLED') {
      try {
        const reversed = await reverseRedemptionForOrder(id)
        if (reversed) debugLog(`✅ Loyalty: redeemed points returned for cancelled order ${order.orderNumber}`)
      } catch (loyaltyError) {
        errorLog('❌ Loyalty redemption reversal failed on admin cancel:', loyaltyError)
      }
    }

    // Award loyalty points when the order is delivered (idempotent, non-blocking)
    if (status === 'DELIVERED') {
      try {
        const loyalty = await awardPointsForDeliveredOrder(id)
        if (loyalty?.awarded && loyalty.points > 0) {
          debugLog(`✅ Loyalty: +${loyalty.points} pts for order ${order.orderNumber} (balance ${loyalty.balance})`)
          // Notify customer about earned points (skip Apple relay)
          const loyaltyUser = await findUserByEmail(order.customerEmail)
          const loyaltyEmail = loyaltyUser ? getPreferredEmail(loyaltyUser) : order.customerEmail
          if (!isApplePrivateRelayEmail(loyaltyEmail)) {
            await sendLoyaltyPointsEarnedEmail({
              customerName: order.customerName,
              customerEmail: loyaltyEmail,
              orderNumber: order.orderNumber,
              points: loyalty.points,
              balance: loyalty.balance,
              tier: loyalty.tier,
            }).catch(e => errorLog('❌ Loyalty points email failed:', e))
            if (loyalty.tierUpgraded) {
              await sendLoyaltyTierUpgradeEmail({
                customerName: order.customerName,
                customerEmail: loyaltyEmail,
                tier: loyalty.tier,
                balance: loyalty.balance,
              }).catch(e => errorLog('❌ Loyalty tier email failed:', e))
            }
          }
        }
      } catch (loyaltyError) {
        errorLog('❌ Loyalty award failed (status update continues):', loyaltyError)
      }
    }

    // Send email notification to customer about status change
    try {
      // Find user to get preferred email (contact email if available)
      const user = await findUserByEmail(order.customerEmail)
      const emailToUse = user ? getPreferredEmail(user) : order.customerEmail
      
      // Skip sending to Apple Private Relay emails
      if (isApplePrivateRelayEmail(emailToUse)) {
        debugLog(`⏭️ Skipping order status email for Apple Private Relay user: ${emailToUse}`)
      } else {
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
          customerEmail: emailToUse,
          id: order.id,
          ...(mappedItems ? { items: mappedItems } : {}),
          total: order.total,
          locale: order.locale || 'en', // Use order's locale, default to English
          ...(order.customerAddress ? { customerAddress: order.customerAddress } : {}),
          ...(order.customerEmirate ? { customerEmirate: order.customerEmirate } : {})
        }
        const emailResult = await sendOrderStatusUpdate(emailOrder, status)
        
        if (emailResult.success) {
          debugLog(`✅ Order status update email sent for order ${id} to ${emailToUse}`)
        } else {
          errorLog(`❌ Failed to send order status update email:`, emailResult.error)
          errorLog(`❌ Email error details:`, JSON.stringify(emailResult, null, 2))
        }
      }
    } catch (emailError) {
      errorLog('❌ Exception sending order status update email:', emailError)
      errorLog('❌ Exception details:', emailError instanceof Error ? emailError.message : String(emailError))
      // Don't fail the status update if email fails
    }

    // Send WhatsApp notification (non-blocking)
    if (isTwilioConfigured() && order.customerPhone) {
      try {
        const whatsappResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'}/api/whatsapp/order-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.INTERNAL_API_KEY || ''
          },
          body: JSON.stringify({
            orderId: id,
            orderNumber: order.orderNumber,
            status
          })
        })
        
        const whatsappResult = await whatsappResponse.json()
        if (whatsappResult.success) {
          debugLog(`✅ WhatsApp notification sent for order ${id}`)
        } else if (whatsappResult.skipped) {
          debugLog(`⏭️ WhatsApp notification skipped: ${whatsappResult.reason}`)
        } else {
          errorLog(`❌ WhatsApp notification failed:`, whatsappResult.error)
        }
      } catch (whatsappError) {
        errorLog('❌ Exception sending WhatsApp notification:', whatsappError)
        // Don't fail the status update if WhatsApp fails
      }
    }

    // Send Expo Push Notification to mobile app (non-blocking)
    try {
      // Find user to get their Expo push token
      const userForPush = await findUserByEmail(order.customerEmail)
      
      if (userForPush?.expoPushToken && isValidExpoPushToken(userForPush.expoPushToken)) {
        const pushResult = await sendOrderStatusPushNotification({
          expoPushToken: userForPush.expoPushToken,
          orderNumber: order.orderNumber,
          status: status as OrderStatus,
          orderId: id,
          locale: (order.locale || 'en') as Locale,
        })
        
        if (pushResult.success) {
          debugLog(`✅ Push notification sent for order ${id} (ticket: ${pushResult.ticketId})`)
        } else {
          errorLog(`❌ Push notification failed for order ${id}:`, pushResult.error)
          
          // If device is no longer registered, clear the token
          if (pushResult.error === 'DeviceNotRegistered') {
            debugLog(`🗑️ Clearing invalid push token for user ${userForPush.email}`)
            await prisma.user.update({
              where: { id: userForPush.id },
              data: { expoPushToken: null },
            })
          }
        }
      } else {
        debugLog(`⏭️ No valid push token for user ${order.customerEmail}, skipping push notification`)
      }
    } catch (pushError) {
      errorLog('❌ Exception sending push notification:', pushError)
      // Don't fail the status update if push fails
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order status updated successfully'
    })
  } catch (error) {
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
          },
          take: 50, // bound the scan — cleanup only needs recent matches
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
  } catch (error) {
    errorLog('Error deleting order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}