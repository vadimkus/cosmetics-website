import { NextRequest, NextResponse, after } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/database'
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { calculateMobileShipping, calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { isUserDiscountExcludedProduct } from '@/lib/mobileDiscountRules'
import { trackUserActivity } from '@/lib/activityTracker'

const extractPaymentFlow = (order: { paymentMetadata?: string | Record<string, unknown> | null; payment_metadata?: string | Record<string, unknown> | null }): string | null => {
  const raw = order?.paymentMetadata ?? order?.payment_metadata ?? null
  if (!raw) return null
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw
    const flow = String(obj?.paymentFlow || obj?.payment_flow || '').trim().toLowerCase()
    return flow || null
  } catch (error) {
    return null
  }
}

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

    // Track user activity (throttled, non-blocking)
    trackUserActivity(user.id)

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
        orderNotes: order.orderNotes || '',
        subtotal: order.subtotal,
        discountPercentage: order.discountPercentage || null,
        discountAmount: order.discountAmount,
        bundleDiscountPercentage: order.bundleDiscountPercentage || null,
        bundleDiscountAmount: order.bundleDiscountAmount || 0,
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
        paymentFlow: extractPaymentFlow(order),
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
    const whereClause: Record<string, unknown> = {
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
      paymentFlow: extractPaymentFlow(order),
      orderNotes: order.orderNotes || '',
      subtotal: order.subtotal,
      discountPercentage: order.discountPercentage || null,
      discountAmount: order.discountAmount,
      bundleDiscountPercentage: order.bundleDiscountPercentage || null,
      bundleDiscountAmount: order.bundleDiscountAmount || 0,
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

    // Validate each item and calculate totals (server-authoritative; MUST match mobile UI)
    let subtotal = 0
    let discountAmount = 0
    let bundleDiscountAmount = 0
    let bundleDiscountPct = 0
    const validatedItems = []

    for (const item of orderData.items) {
      const productId = String(item?.productId || '').trim()
      const quantity = Number(item?.quantity)

      // NOTE: promo items can have price = 0, so we must NOT use truthy checks.
      if (
        !productId ||
        !Number.isFinite(quantity) ||
        quantity <= 0 ||
        // Keep legacy validation: price must be provided (used by old clients),
        // but it is NOT trusted for calculations anymore.
        !Number.isFinite(Number(item?.price)) ||
        Number(item?.price) < 0
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

      const wantedSize = item.size ? String(item.size).trim() : null
      const wantedColor = item.color ? String(item.color).trim() : null
      const isPromo =
        item?.isPromotionItem === true ||
        String(item?.selectedSize || '').trim() === '__PROMO__' ||
        String(item?.size || '').trim() === '__PROMO__' ||
        // Client may send promo items with price 0 but without the flag; treat as promo.
        Number(item?.price) === 0

      const variant = (!isPromo && (wantedSize || wantedColor))
        ? await prisma.productVariant.findFirst({
            where: {
              productId: product.id,
              ...(wantedSize ? { size: wantedSize } : {}),
              ...(wantedColor ? { color: wantedColor } : {}),
              available: true,
            },
          })
        : null

      const baseUnit = isPromo ? 0 : Number(variant?.price ?? product.price)
      const pct = Number(user?.discountPercentage)
      const hasUserDiscount = Number.isFinite(pct) && pct > 0 && pct < 100
      const excluded = isUserDiscountExcludedProduct(product)

      // "Build Your Set" bundle items: bundle discount ONLY — no VIP/user discount stacking.
      const isBundleItem = item?.fromBundle === true
      const itemBundlePct = Number(item?.bundleDiscountPercent) || 0
      const hasBundleDiscountForItem = isBundleItem && itemBundlePct > 0 && itemBundlePct < 100

      let unitPrice: number
      if (isPromo) {
        unitPrice = 0
      } else if (hasBundleDiscountForItem) {
        // Bundle items: apply ONLY bundle discount on retail price (no VIP)
        const afterVip = baseUnit  // no VIP applied
        // Then apply bundle discount on the VIP-discounted price
        unitPrice = Math.round(afterVip * (1 - itemBundlePct / 100) * 100) / 100
        bundleDiscountAmount += (afterVip - unitPrice) * quantity
        bundleDiscountPct = itemBundlePct // capture the tier %
      } else if (!excluded && hasUserDiscount) {
        // Regular items get user VIP discount
        unitPrice = baseUnit * (1 - pct / 100)
        discountAmount += (baseUnit - unitPrice) * quantity
      } else {
        unitPrice = baseUnit
      }

      const itemTotal = unitPrice * quantity
      subtotal += itemTotal

      validatedItems.push({
        productId,
        productName: item.productName || item.name || product.name,
        price: unitPrice,
        quantity,
        image: item.image || product.image,
        color: item.color || null,
        // Preserve a stable promo marker so mobile UI can reliably show "FREE"
        size: isPromo ? '__PROMO__' : (item.size || null)
      })
    }

    // Round accumulated values to 2 decimal places (prevent floating-point drift)
    subtotal = Math.round(subtotal * 100) / 100
    discountAmount = Math.round(discountAmount * 100) / 100
    bundleDiscountAmount = Math.round(bundleDiscountAmount * 100) / 100

    // Capture user discount percentage at time of order for waterfall display
    const pctForOrder = Number(user?.discountPercentage)
    const userDiscountPctForOrder = (Number.isFinite(pctForOrder) && pctForOrder > 0 && pctForOrder < 100) ? pctForOrder : null

    // Calculate order totals (must match mobile UI: VAT INCLUDED; shipping from shared rates)
    const emirate = String(orderData.customerEmirate || 'Dubai')
    const shipping = calculateMobileShipping(subtotal, emirate)
    const total = subtotal + shipping
    const vat = calculateVatIncluded(total)

    // Generate canonical order number (Mobile)
    const paymentMethodRaw = String(orderData?.paymentMethod || '').toLowerCase()
    const payment = paymentMethodRaw === 'cod' ? 'COD' : 'CARD'
    const orderNumber = await generateUniqueOrderNumber({ channel: 'M', payment })

    // Create order
    const orderNotes = typeof orderData?.orderNotes === 'string' ? orderData.orderNotes.trim() : ''
    
    // Get preferred email for sending notifications (contactEmail if set, else regular email)
    const preferredEmail = getPreferredEmail(user)
    
    debugLog('[MOBILE_ORDERS] Email routing:', {
      userLoginEmail: user.email,
      userContactEmail: user.contactEmail || null,
      preferredEmailForNotifications: preferredEmail,
      willStoreInDB: user.email,
      willSendEmailTo: preferredEmail
    })
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: user.email,  // Store original login email for order tracking
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmirate: orderData.customerEmirate,
        customerAddress: orderData.customerAddress,
        orderNotes: orderNotes || null,
        subtotal,
        discountPercentage: userDiscountPctForOrder,
        discountAmount,
        bundleDiscountPercentage: bundleDiscountPct > 0 ? bundleDiscountPct : null,
        bundleDiscountAmount: bundleDiscountAmount > 0 ? bundleDiscountAmount : 0,
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

    // Schedule background tasks with after() — emails
    // MoySklad sync is done manually via admin panel "Push to MoySklad" button
    after(async () => {
      // 1. Send order confirmation email to customer (HIGHEST PRIORITY)
      try {
        await sendOrderConfirmationEmail({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: preferredEmail,
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
          locale: order.locale || 'en',
          discountPercentage: userDiscountPctForOrder ?? undefined,
          discountAmount: order.discountAmount ?? undefined,
          bundleDiscountPercentage: order.bundleDiscountPercentage ?? undefined,
          bundleDiscountAmount: (order.bundleDiscountAmount || 0) > 0 ? order.bundleDiscountAmount : undefined
        })
        debugLog('[MOBILE_ORDERS] ✅ Order confirmation email sent to:', order.customerEmail)
      } catch (emailError) {
        errorLog('[MOBILE_ORDERS] ❌ Failed to send order confirmation email:', emailError)
      }

      // Send admin notification for new order
      try {
        const adminResult = await sendAdminNewOrderNotification({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: preferredEmail,
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
          emirate: order.customerEmirate,
          discountPercentage: userDiscountPctForOrder ?? 0,
          discountAmount: order.discountAmount ?? 0,
          bundleDiscountPercentage: order.bundleDiscountPercentage ?? undefined,
          bundleDiscountAmount: (order.bundleDiscountAmount || 0) > 0 ? order.bundleDiscountAmount : undefined
        })
        if (adminResult.success) {
          debugLog('[MOBILE_ORDERS] ✅ Admin notification sent for new order:', order.orderNumber)
        } else {
          errorLog('[MOBILE_ORDERS] ❌ Failed to send admin notification:', adminResult.error)
        }
      } catch (emailError) {
        errorLog('[MOBILE_ORDERS] ❌ Exception sending admin notification:', emailError)
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
      discountPercentage: order.discountPercentage || null,
      discountAmount: order.discountAmount,
      bundleDiscountPercentage: order.bundleDiscountPercentage || null,
      bundleDiscountAmount: order.bundleDiscountAmount || 0,
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
