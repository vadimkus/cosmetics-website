import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/database'
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'

/**
 * Mobile Orders Endpoint
 * 
 * GET /api/mobile/orders - Get user's orders
 * GET /api/mobile/orders?orderId=xxx - Get specific order details
 * 
 * Headers Required:
 * - x-api-key: genosys_secure_mobile_2025_v1
 * - Authorization: Bearer <jwt_token>
 * 
 * Query Parameters:
 * - orderId: Get specific order by ID
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 50)
 * - status: Filter by order status (optional)
 * 
 * Response Format:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "...",
 *       "orderNumber": "...",
 *       "status": "...",
 *       "total": 0,
 *       "createdAt": "...",
 *       "items": [...]
 *     }
 *   ]
 * }
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
        orderNotes: (order as any).orderNotes || '',
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

    // Get orders
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Format orders data for mobile app
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderNotes: (order as any).orderNotes || '',
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

    debugLog('[MOBILE_ORDERS] Get orders completed', Date.now() - startTime, 'ms')
    
    // Return simplified response format for mobile app
    return NextResponse.json({
      success: true,
      data: formattedOrders
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
      const productId = String(item?.productId || '').trim()
      const quantity = Number(item?.quantity)
      const price = Number(item?.price)

      // NOTE: promo items can have price = 0, so we must NOT use truthy checks.
      if (
        !productId ||
        !Number.isFinite(quantity) ||
        quantity <= 0 ||
        !Number.isFinite(price) ||
        price < 0
      ) {
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
        where: { id: productId }
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

      const itemTotal = price * quantity
      subtotal += itemTotal

      validatedItems.push({
        productId,
        productName: item.productName || item.name || product.name,
        price,
        quantity,
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

    // Generate canonical order number (Mobile)
    const paymentMethodRaw = String(orderData?.paymentMethod || '').toLowerCase()
    const payment = paymentMethodRaw === 'cod' ? 'COD' : 'CARD'
    const orderNumber = await generateUniqueOrderNumber({ channel: 'M', payment })

    // Create order
    const orderNotes = typeof (orderData as any)?.orderNotes === 'string' ? (orderData as any).orderNotes.trim() : ''
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: user.email,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmirate: orderData.customerEmirate,
        customerAddress: orderData.customerAddress,
        orderNotes: orderNotes || null,
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

    // Send order confirmation email to customer (non-blocking - fire and forget)
    sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image || '',
        ...(item.size ? { size: item.size } : {}),
        ...(item.color ? { color: item.color } : {})
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      vat: order.vat,
      total: order.total,
      address: order.customerAddress,
      emirate: order.customerEmirate,
      locale: order.locale || 'en'
    }).then(() => {
      debugLog('[MOBILE_ORDERS] ✅ Order confirmation email sent to:', order.customerEmail)
    }).catch((emailError) => {
      errorLog('[MOBILE_ORDERS] ❌ Failed to send order confirmation email:', emailError)
      // Don't fail order creation if email fails
    })

    // Send admin notification for new order (non-blocking - fire and forget)
    sendAdminNewOrderNotification({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      total: order.total,
      itemCount: order.items.length,
      orderNotes: orderNotes || undefined,
      items: order.items.map(item => {
        const emailItem: {
          productName: string
          quantity: number
          price: number
          image: string
          size?: string
          color?: string
        } = {
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          image: item.image || ''
        }
        if (item.size) {
          emailItem.size = item.size
        }
        if (item.color) {
          emailItem.color = item.color
        }
        return emailItem
      }),
      subtotal: order.subtotal,
      shipping: order.shipping,
      vat: order.vat,
      address: order.customerAddress,
      emirate: order.customerEmirate
    }).then((adminResult) => {
      if (adminResult.success) {
        debugLog('[MOBILE_ORDERS] ✅ Admin notification sent for new order:', order.orderNumber)
      } else {
        errorLog('[MOBILE_ORDERS] ❌ Failed to send admin notification:', adminResult.error)
      }
    }).catch((emailError) => {
      errorLog('[MOBILE_ORDERS] ❌ Exception sending admin notification:', emailError)
      // Don't fail order creation if email fails
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
