import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * GET /api/orders/track/[orderNumber]
 * 
 * Public endpoint to track order status by order number.
 * Returns limited order information (no customer details for privacy).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params
    
    if (!orderNumber || typeof orderNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 }
      )
    }

    debugLog('[ORDER_TRACK] Looking up order:', orderNumber)

    // Find order by order number
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            price: true,
            image: true,
            color: true,
            size: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Calculate estimated delivery based on status and location
    const estimatedDelivery = calculateEstimatedDelivery(order.status, order.createdAt, order.customerEmirate)

    // Return limited order information (privacy-conscious)
    const trackingInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      paidAt: order.paidAt,
      emirate: order.customerEmirate,
      // Only show first name for privacy
      customerFirstName: order.customerName.split(' ')[0],
      // Order summary
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      total: order.total,
      shipping: order.shipping,
      // Status timeline
      timeline: generateStatusTimeline(order),
      // Estimated delivery
      estimatedDelivery,
      // Item details (without prices for public view)
      items: order.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        image: item.image,
        color: item.color,
        size: item.size
      }))
    }

    debugLog('[ORDER_TRACK] Order found:', orderNumber, 'Status:', order.status)

    return NextResponse.json({
      success: true,
      data: trackingInfo
    })

  } catch (error) {
    errorLog('[ORDER_TRACK] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve order information' },
      { status: 500 }
    )
  }
}

/**
 * Generate status timeline for order tracking
 */
function generateStatusTimeline(order: {
  status: string
  paymentStatus: string
  createdAt: Date
  updatedAt: Date
  paidAt: Date | null
}) {
  const timeline: Array<{
    status: string
    label: string
    timestamp: Date | null
    completed: boolean
    current: boolean
  }> = []

  const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED']
  const currentIndex = statusOrder.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  // Order placed
  timeline.push({
    status: 'PENDING',
    label: 'Order Placed',
    timestamp: order.createdAt,
    completed: true,
    current: order.status === 'PENDING'
  })

  // Payment confirmed (for non-COD)
  if (order.paymentStatus === 'paid' && order.paidAt) {
    timeline.push({
      status: 'PAYMENT_CONFIRMED',
      label: 'Payment Confirmed',
      timestamp: order.paidAt,
      completed: true,
      current: false
    })
  }

  // Order confirmed
  timeline.push({
    status: 'CONFIRMED',
    label: 'Order Confirmed',
    timestamp: currentIndex >= 1 ? order.updatedAt : null,
    completed: currentIndex >= 1,
    current: order.status === 'CONFIRMED'
  })

  // Processing
  timeline.push({
    status: 'PROCESSING',
    label: 'Processing',
    timestamp: currentIndex >= 2 ? order.updatedAt : null,
    completed: currentIndex >= 2,
    current: order.status === 'PROCESSING'
  })

  // Shipped
  timeline.push({
    status: 'SHIPPED',
    label: 'Shipped',
    timestamp: currentIndex >= 3 ? order.updatedAt : null,
    completed: currentIndex >= 3,
    current: order.status === 'SHIPPED'
  })

  // Out for delivery
  timeline.push({
    status: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    timestamp: currentIndex >= 4 ? order.updatedAt : null,
    completed: currentIndex >= 4,
    current: order.status === 'OUT_FOR_DELIVERY'
  })

  // Delivered
  timeline.push({
    status: 'DELIVERED',
    label: 'Delivered',
    timestamp: currentIndex >= 5 ? order.updatedAt : null,
    completed: currentIndex >= 5,
    current: order.status === 'DELIVERED'
  })

  // Handle cancelled orders
  if (isCancelled) {
    return [{
      status: 'PENDING',
      label: 'Order Placed',
      timestamp: order.createdAt,
      completed: true,
      current: false
    }, {
      status: 'CANCELLED',
      label: 'Order Cancelled',
      timestamp: order.updatedAt,
      completed: true,
      current: true
    }]
  }

  return timeline
}

/**
 * Calculate estimated delivery date
 */
function calculateEstimatedDelivery(
  status: string,
  createdAt: Date,
  emirate: string
): { min: Date; max: Date } | null {
  // If already delivered or cancelled, no estimate needed
  if (status === 'DELIVERED' || status === 'CANCELLED') {
    return null
  }

  const now = new Date()
  const orderDate = new Date(createdAt)

  // Base delivery days (business days)
  let minDays = 1
  let maxDays = 3

  // Adjust based on emirate
  if (emirate.toLowerCase() === 'dubai') {
    minDays = 1
    maxDays = 2
  } else if (['abu dhabi', 'sharjah', 'ajman'].includes(emirate.toLowerCase())) {
    minDays = 1
    maxDays = 3
  } else {
    // Other emirates
    minDays = 2
    maxDays = 4
  }

  // Adjust based on current status
  if (status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY') {
    minDays = 0
    maxDays = 1
  }

  // Calculate dates
  const minDate = new Date(Math.max(now.getTime(), orderDate.getTime()))
  const maxDate = new Date(Math.max(now.getTime(), orderDate.getTime()))
  
  // Add business days (skip weekends - Friday is not a workday in UAE)
  let addedDays = 0
  while (addedDays < minDays) {
    minDate.setDate(minDate.getDate() + 1)
    if (minDate.getDay() !== 5) { // Skip Friday
      addedDays++
    }
  }

  addedDays = 0
  while (addedDays < maxDays) {
    maxDate.setDate(maxDate.getDate() + 1)
    if (maxDate.getDay() !== 5) { // Skip Friday
      addedDays++
    }
  }

  return { min: minDate, max: maxDate }
}
