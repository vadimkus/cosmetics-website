import { NextRequest, NextResponse } from 'next/server'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { createCheckoutSession, aedToFils } from '@/lib/stripe'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { enhanceOrderItemWithDefaultSize } from '@/lib/orderSizeDefaults'
import { debugLog, errorLog } from '@/lib/logger'
import { Product } from '@/types/index'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'

interface CheckoutItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
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

    // Calculate order totals
    const subtotal = items.reduce((total: number, item: CheckoutItem) => {
      return total + (item.product.price * item.quantity)
    }, 0)

    // Calculate shipping based on emirate
    const emirates = [
      { name: 'Dubai', shippingCost: 45 },
      { name: 'Abu Dhabi', shippingCost: 70 },
      { name: 'Sharjah', shippingCost: 70 },
      { name: 'Ajman', shippingCost: 70 },
      { name: 'Ras Al Khaimah', shippingCost: 70 },
      { name: 'Fujairah', shippingCost: 70 },
      { name: 'Umm Al Quwain', shippingCost: 70 }
    ]
    
    const selectedEmirateData = emirates.find(e => e.name === customerEmirate)
    const baseShippingCost = selectedEmirateData?.shippingCost || 45
    const shipping = subtotal >= 1000 ? 0 : baseShippingCost
    
    const discountAmount = 0
    const total = subtotal - discountAmount + shipping
    const vat = Math.round(((subtotal + shipping) / 1.05) * 0.05 * 100) / 100

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
      
      const productData: any = {
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

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      lineItems,
      customerEmail,
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
    errorLog('❌ Error creating Stripe checkout session:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error,
      code: (error as any)?.code,
      statusCode: (error as any)?.statusCode,
      requestId: (error as any)?.requestId,
      param: (error as any)?.param,
      stripeError: (error as any)?.type || (error as any)?.name || 'Unknown',
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
          code: (error as any)?.code,
          param: (error as any)?.param
        } : undefined
      },
      { status: 500 }
    )
  }
}