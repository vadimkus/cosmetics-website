import { NextRequest, NextResponse } from 'next/server'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { createPaymentIntent, getPaymentIntent } from '@/lib/stripe'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { enhanceOrderItemWithDefaultSize } from '@/lib/orderSizeDefaults'
import { debugLog, errorLog } from '@/lib/logger'
import { Product } from '@/types/index'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { findUserByEmail } from '@/lib/userStorageDb'
import { calculateMobileShipping, calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { prisma } from '@/lib/prisma'
import { isUserDiscountExcludedProduct } from '@/lib/mobileDiscountRules'

interface CheckoutItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
  fromBundle?: boolean
  bundleDiscountPercent?: number
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

    debugLog('🔄 Creating Stripe payment intent:', {
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

    debugLog('📧 Email routing for Payment Intent:', {
      customerEmail,
      hasUser: !!user,
      hasContactEmail: !!(user?.contactEmail),
      emailToUse,
      isAppleRelay: customerEmail.includes('@privaterelay.appleid.com')
    })

    // Get user's discount percentage
    const userDiscountPct = Number(user?.discountPercentage || 0)
    const hasUserDiscount = Number.isFinite(userDiscountPct) && userDiscountPct > 0 && userDiscountPct < 100
    
    debugLog('User discount for Payment Intent:', { hasUserDiscount, userDiscountPct, userId: user?.id })
    
    // Calculate totals from already-discounted prices
    // Track both user discount and bundle discount separately
    let subtotal = 0
    let discountAmount = 0  // User discount
    let bundleDiscountAmount = 0  // Bundle discount
    let bundleDiscountPercent: number | null = null  // Bundle discount percentage (same for all bundle items)
    
    for (const item of items as CheckoutItem[]) {
      const itemPrice = item.product.price  // Already the final discounted price
      const itemTotal = itemPrice * item.quantity
      subtotal += itemTotal
      
      // Check if this is a bundle item
      if (item.fromBundle && item.bundleDiscountPercent && item.bundleDiscountPercent > 0) {
        bundleDiscountPercent = item.bundleDiscountPercent
        
        // Bundle items: ONLY bundle discount on retail price (no VIP)
        // Final price = retail price * (1 - bundleDiscount/100)
        // So: retail price = final price / (1 - bundleDiscount/100)
        const retailPrice = itemPrice / (1 - item.bundleDiscountPercent / 100)
        const itemBundleDiscount = (retailPrice - itemPrice) * item.quantity
        bundleDiscountAmount += itemBundleDiscount
        
        debugLog(`Bundle item: ${item.product.name} - Bundle discount: ${item.bundleDiscountPercent}% = ${itemBundleDiscount.toFixed(2)} AED (no VIP applied)`)
      } else if (hasUserDiscount) {
        // Non-bundle item with user discount
        const excluded = isUserDiscountExcludedProduct(item.product)
        if (!excluded) {
          const originalPrice = itemPrice / (1 - userDiscountPct / 100)
          const itemDiscount = (originalPrice - itemPrice) * item.quantity
          discountAmount += itemDiscount
        }
      }
    }
    
    subtotal = Math.round(subtotal * 100) / 100
    discountAmount = Math.round(discountAmount * 100) / 100
    bundleDiscountAmount = Math.round(bundleDiscountAmount * 100) / 100
    
    debugLog('Discount breakdown:', { 
      userDiscount: discountAmount, 
      bundleDiscount: bundleDiscountAmount, 
      bundleDiscountPercent,
      total: discountAmount + bundleDiscountAmount 
    })

    // Calculate shipping and total
    const shipping = calculateMobileShipping(subtotal, customerEmirate)
    const total = subtotal + shipping
    const vat = calculateVatIncluded(total)

    // Idempotency check: Look for recent pending CARD orders from same customer with same total
    const recentDuplicateCheck = await prisma.order.findFirst({
      where: {
        customerEmail: customerEmail.trim().toLowerCase(),
        paymentMethod: 'stripe',
        paymentStatus: 'pending',
        total: total,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000)
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (recentDuplicateCheck) {
      debugLog('⚠️ Duplicate order detected for payment intent:', {
        existingOrderNumber: recentDuplicateCheck.orderNumber,
        customerEmail,
        total
      })
      
      // Return existing payment intent if available and still valid
      if (recentDuplicateCheck.stripePaymentIntentId) {
        try {
          const existingIntent = await getPaymentIntent(recentDuplicateCheck.stripePaymentIntentId)
          
          // Check if the payment intent is still active
          if (existingIntent.status === 'requires_payment_method' || existingIntent.status === 'requires_action') {
            debugLog('✅ Returning existing active payment intent:', {
              paymentIntentId: existingIntent.id
            })
            return NextResponse.json({ 
              clientSecret: existingIntent.client_secret,
              orderId: recentDuplicateCheck.orderNumber,
              total: total,
              message: 'Using existing payment intent',
              isDuplicate: true
            })
          }
          
          debugLog('⚠️ Existing payment intent is no longer active, creating new one:', {
            intentStatus: existingIntent.status
          })
        } catch (intentError) {
          debugLog('⚠️ Could not retrieve existing payment intent, creating new one:', intentError)
        }
      }
    }

    // Generate order number
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

    // Build description for Stripe
    const itemNames = items.slice(0, 3).map((item: CheckoutItem) => item.product.name).join(', ')
    const description = items.length > 3 
      ? `${itemNames} and ${items.length - 3} more items` 
      : itemNames

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent({
      amount: total,
      customerEmail: emailToUse,
      customerName,
      customerPhone,
      customerEmirate,
      orderNumber: orderId,
      locale: locale || 'en',
      description: `Order ${orderId}: ${description}`
    })

    // Create order in database with PENDING status
    const order: OrderData = {
      orderNumber: orderId,
      customerEmail,
      customerName,
      customerPhone,
      customerEmirate,
      customerAddress,
      items: orderItems,
      subtotal,
      discountPercentage: hasUserDiscount ? userDiscountPct : 0,
      discountAmount,
      ...(bundleDiscountPercent ? { bundleDiscountPercentage: bundleDiscountPercent } : {}),
      bundleDiscountAmount,
      shipping,
      vat,
      total,
      status: 'PENDING',
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      locale: locale || 'en'
    }

    // Store the order
    await addOrder(order)

    debugLog('✅ Order created with payment intent:', {
      orderId,
      paymentIntentId: paymentIntent.id,
      total,
      customerEmail
    })

    // Return client secret for frontend
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      orderId: orderId,
      total: total,
      message: 'Payment intent created successfully'
    })

  } catch (error) {
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
    
    const stripeErr = isStripeError(error) ? error : null
    
    errorLog('❌ Error creating payment intent:', {
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
    
    if (error instanceof Error && error.message.includes('Invalid API key')) {
      return NextResponse.json(
        { error: 'Payment service configuration error. Please try again later.' },
        { status: 503 }
      )
    }
    
    const isDev = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      { 
        error: 'Failed to create payment. Please try again.',
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
