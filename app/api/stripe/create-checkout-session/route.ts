import { NextRequest, NextResponse } from 'next/server'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { createCheckoutSession, aedToFils } from '@/lib/stripe'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { enhanceOrderItemWithDefaultSize } from '@/lib/orderSizeDefaults'
import { debugLog, errorLog } from '@/lib/logger'
import { Product } from '@/types/index'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { findUserByEmail } from '@/lib/userStorageDb'
import { calculateMobileShipping, calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { prisma } from '@/lib/prisma'

interface CheckoutItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

interface StripeProductData {
  name: string
  description: string
  metadata?: {
    product_id: string
    color: string
    size: string
  }
  images?: string[]
}

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  // Request body size limit check
  const sizeLimit = getSizeLimitForContentType(request)
  const sizeCheck = requireBodySizeLimit(request, sizeLimit)
  if (!sizeCheck.valid) {
    return sizeCheck.response!
  }

  try {
    const { 
      items, 
      customerEmail, 
      customerName, 
      customerPhone, 
      customerEmirate, 
      customerAddress,
      locale 
    } = await request.json()

    debugLog('🔄 Creating Stripe checkout session:', {
      customerEmail,
      customerName,
      itemCount: items.length,
      emirate: customerEmirate
    })

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      )
    }

    if (!customerEmail || !customerName || !customerPhone || !customerEmirate || !customerAddress) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      )
    }

    // Fetch user to check for contactEmail (for Apple Private Relay users)
    const user = await findUserByEmail(customerEmail)
    const emailToUse = user ? getPreferredEmail(user) : customerEmail

    debugLog('📧 Email routing for Stripe:', {
      customerEmail,
      hasUser: !!user,
      hasContactEmail: !!(user?.contactEmail),
      emailToUse,
      isAppleRelay: customerEmail.includes('@privaterelay.appleid.com')
    })

    // Calculate order totals
    const subtotal = items.reduce((total: number, item: CheckoutItem) => {
      return total + (item.product.price * item.quantity)
    }, 0)

    // Use shared mobile checkout config for consistency
    const shipping = calculateMobileShipping(subtotal, customerEmirate)
    
    const discountAmount = 0
    const total = subtotal - discountAmount + shipping
    const vat = calculateVatIncluded(total)

    // Idempotency check: Look for recent pending CARD orders from same customer with same total
    // This prevents duplicate orders from double-clicks or network retries
    const recentDuplicateCheck = await prisma.order.findFirst({
      where: {
        customerEmail: customerEmail.trim().toLowerCase(),
        paymentMethod: 'stripe',
        paymentStatus: 'pending',
        total: total,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Within last 5 minutes
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (recentDuplicateCheck) {
      debugLog('⚠️ Duplicate order detected, returning existing session:', {
        existingOrderNumber: recentDuplicateCheck.orderNumber,
        customerEmail,
        total
      })
      
      // Return existing session info if available
      if (recentDuplicateCheck.stripeSessionId) {
        return NextResponse.json({ 
          sessionId: recentDuplicateCheck.stripeSessionId,
          orderId: recentDuplicateCheck.orderNumber,
          message: 'Using existing checkout session',
          isDuplicate: true
        })
      }
    }

    // Generate canonical order number (Card + Website)
    const orderId = await generateUniqueOrderNumber({ channel: 'W', payment: 'CARD' })

    // Create order items for database
    const orderItems: OrderItemData[] = items.map((item: CheckoutItem) => {
      const enhanced = enhanceOrderItemWithDefaultSize({
        productName: item.product.name,
        size: item.selectedSize || null,
        color: item.selectedColor || null
      })
      
      return {
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        color: enhanced.color || '',
        size: enhanced.size || ''
      }
    })

    // Create Stripe line items
    const lineItems = items.map((item: CheckoutItem) => {
      // Ensure image URL is absolute and valid
      let imageUrl: string | undefined
      try {
        if (item.product.image) {
          if (item.product.image.startsWith('http')) {
            // Already absolute URL
            new URL(item.product.image) // Validate URL
            imageUrl = item.product.image
          } else {
            // Make relative URL absolute
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
            const fullUrl = `${baseUrl}${item.product.image.startsWith('/') ? '' : '/'}${item.product.image}`
            new URL(fullUrl) // Validate URL
            imageUrl = fullUrl
          }
        }
      } catch (error) {
        // If image URL is invalid, don't include it (Stripe will show default)
        debugLog('⚠️ Invalid image URL for product, skipping:', item.product.name, item.product.image)
        imageUrl = undefined
      }
      
      const productData: StripeProductData = {
        name: item.product.name,
        description: item.product.description.substring(0, 300), // Stripe has limits
        metadata: {
          product_id: item.product.id,
          color: item.selectedColor || '',
          size: item.selectedSize || ''
        }
      }
      
      // Only add images if we have a valid URL
      if (imageUrl) {
        productData.images = [imageUrl]
      }
      
      return {
        price_data: {
          currency: 'aed',
          product_data: productData,
          unit_amount: aedToFils(item.product.price), // Convert AED to fils
        },
        quantity: item.quantity,
      }
    })

    // Add shipping as a line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'aed',
          product_data: {
            name: `Shipping to ${customerEmirate}`,
            description: 'Standard delivery',
          },
          unit_amount: aedToFils(shipping),
        },
        quantity: 1,
      })
    }

    // Create Stripe checkout session (use preferred email)
    const session = await createCheckoutSession({
      lineItems,
      customerEmail: emailToUse, // Use preferred email for Stripe
      customerName,
      customerPhone,
      shippingAddress: {
        line1: customerAddress,
        city: customerEmirate,
        country: 'AE', // UAE
      },
      orderNumber: orderId,
      locale: locale || 'en'
    })

    // Create order in database with PENDING status and Stripe session ID
    const order: OrderData = {
      orderNumber: orderId,
      customerEmail,
      customerName,
      customerPhone,
      customerEmirate,
      customerAddress,
      items: orderItems,
      subtotal,
      discountAmount,
      shipping,
      vat,
      total,
      status: 'PENDING',
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      stripeSessionId: session.id,
      locale: locale || 'en'
    }

    // Store the order
    await addOrder(order)

    debugLog('✅ Order created with Stripe session:', {
      orderId,
      sessionId: session.id,
      total,
      customerEmail
    })

    // Return session details for frontend
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
      orderId: orderId,
      message: 'Checkout session created successfully'
    })

  } catch (error) {
    // Type guard for Stripe-like errors with additional properties
    interface StripeErrorLike extends Error {
      code?: string
      statusCode?: number
      requestId?: string
      param?: string
      type?: string
    }
    
    const isStripeError = (err: unknown): err is StripeErrorLike => {
      return err instanceof Error && ('type' in err || 'code' in err)
    }
    
    // Extract error details safely
    const stripeErr = isStripeError(error) ? error : null
    
    errorLog('❌ Error creating Stripe checkout session:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error,
      code: stripeErr?.code,
      statusCode: stripeErr?.statusCode,
      requestId: stripeErr?.requestId,
      param: stripeErr?.param,
      stripeError: stripeErr?.type || (error instanceof Error ? error.name : 'Unknown'),
      fullError: error
    })
    
    // Return user-friendly error message with more details for debugging
    if (error instanceof Error && error.message.includes('Invalid API key')) {
      return NextResponse.json(
        { error: 'Payment service configuration error. Please try again later.' },
        { status: 503 }
      )
    }
    
    // Provide more detailed error in development
    const isDev = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      { 
        error: 'Failed to create payment session. Please try again.',
        details: isDev ? {
          message: error instanceof Error ? error.message : 'Unknown error',
          type: error instanceof Error ? error.constructor.name : typeof error,
          code: stripeErr?.code,
          param: stripeErr?.param
        } : undefined
      },
      { status: 500 }
    )
  }
}