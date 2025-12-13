import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/database'

/**
 * Mobile Orders Endpoint
 * 
 * GET /api/mobile/orders - Get user's orders with pagination
 * GET /api/mobile/orders?orderId=xxx - Get specific order details
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt_token>
 * 
 * Query Parameters:
 * - orderId: Get specific order by ID
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 50)
 * - status: Filter by order status (optional)
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_ORDERS] Get orders request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error
        },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication token required' 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Verify user exists
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const status = searchParams.get('status')

    // If specific order is requested
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          customerEmail: user.email
        },
        include: {
          items: true
        }
      })

      if (!order) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Order not found' 
          },
          { status: 404 }
        )
      }

      // Format order data for mobile app
      const formattedOrder = {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        shipping: order.shipping,
        vat: order.vat,
        total: order.total,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmirate: order.customerEmirate,
        customerAddress: order.customerAddress,
        locale: order.locale,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        paidAt: order.paidAt?.toISOString() || null,
        items: order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          color: item.color,
          size: item.size
        }))
      }

      debugLog('[MOBILE_ORDERS] Get specific order completed', Date.now() - startTime, 'ms')
      
      return NextResponse.json({
        success: true,
        data: formattedOrder
      })
    }

    // Get user's orders with pagination
    const skip = (page - 1) * limit
    
    // Build where clause
    const whereClause: any = {
      customerEmail: user.email
    }
    
    if (status) {
      whereClause.status = status
    }

    // Get orders and total count
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        include: {
          items: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({
        where: whereClause
      })
    ])

    // Format orders data for mobile app
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shipping: order.shipping,
      vat: order.vat,
      total: order.total,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmirate: order.customerEmirate,
      customerAddress: order.customerAddress,
      locale: order.locale,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      paidAt: order.paidAt?.toISOString() || null,
      itemCount: order.items.length,
      // Include first few items for preview
      items: order.items.slice(0, 3).map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        color: item.color,
        size: item.size
      }))
    }))

    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    debugLog('[MOBILE_ORDERS] Get orders completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      data: {
        orders: formattedOrders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPreviousPage
        }
      }
    })

  } catch (error) {
    errorLog('[MOBILE_ORDERS] Get orders error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_ORDERS] Create order request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error
        },
        { status: authValidation.status || 500 }
      )
    }

    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication token required' 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Verify user exists
    const user = await findUserByEmail(tokenPayload.email)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Parse request body
    const orderData = await request.json()
    
    // Validate required fields
    const requiredFields = ['items', 'customerName', 'customerPhone', 'customerEmirate', 'customerAddress']
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Missing required field: ${field}` 
          },
          { status: 400 }
        )
      }
    }

    // Validate items
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order must contain at least one item' 
        },
        { status: 400 }
      )
    }

    // Validate each item and calculate totals
    let subtotal = 0
    const validatedItems = []

    for (const item of orderData.items) {
      if (!item.productId || !item.quantity || !item.price) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Each item must have productId, quantity, and price' 
          },
          { status: 400 }
        )
      }

      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Product not found: ${item.productId}` 
          },
          { status: 404 }
        )
      }

      const itemTotal = item.price * item.quantity
      subtotal += itemTotal

      validatedItems.push({
        productId: item.productId,
        productName: item.productName || product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || product.image,
        color: item.color || null,
        size: item.size || null
      })
    }

    // Calculate order totals
    const discountAmount = orderData.discountAmount || 0
    const shipping = orderData.shipping || 0
    const vat = orderData.vat || (subtotal - discountAmount + shipping) * 0.05 // 5% VAT
    const total = subtotal - discountAmount + shipping + vat

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: user.email,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmirate: orderData.customerEmirate,
        customerAddress: orderData.customerAddress,
        subtotal,
        discountAmount,
        shipping,
        vat,
        total,
        paymentMethod: orderData.paymentMethod || 'cod',
        locale: orderData.locale || 'en',
        items: {
          create: validatedItems
        }
      },
      include: {
        items: true
      }
    })

    // Format response
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shipping: order.shipping,
      vat: order.vat,
      total: order.total,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmirate: order.customerEmirate,
      customerAddress: order.customerAddress,
      locale: order.locale,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        color: item.color,
        size: item.size
      }))
    }

    debugLog('[MOBILE_ORDERS] Create order completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: formattedOrder
    }, { status: 201 })

  } catch (error) {
    errorLog('[MOBILE_ORDERS] Create order error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    },
  })
}
