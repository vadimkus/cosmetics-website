import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { createPaymentIntent, getPaymentIntent } from '@/lib/stripe'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { enhanceOrderItemWithDefaultSize } from '@/lib/orderSizeDefaults'
import { debugLog, errorLog } from '@/lib/logger'
import { CartItem, Product } from '@/types/index'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { findUserByEmail } from '@/lib/userStorageDb'
import { calculateMobileShipping, calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/jwt'
import { resolveRedemptionForCheckout } from '@/lib/loyalty'
import { getProductById } from '@/lib/productsDb'
import { getCartLinePricing } from '@/lib/cartPricing'
import {
  getValidatedBundleDiscountPercent,
  isAllowedFreeGiftProduct,
  isSubmittedBundleLine,
  allowedFreeGiftUnits,
  freeGiftKind,
} from '@/lib/checkoutPricingGuards'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import {
  computeHomecareEligibleAmounts,
  selectWinningHomecareAttribution,
  validateHomecareAttribution,
  type SubmittedHomecareAttribution,
  type ValidHomecareAttribution,
} from '@/lib/homecare'

// Each call hits Stripe (billable) + writes an order + N product lookups.
// Cap per-IP to blunt DoS / billing amplification. Genuine checkout retries
// stay well under this.
const paymentIntentLimiter = rateLimitSimple({ name: 'pi', windowMs: 60 * 1000, max: 8 })

interface CheckoutItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
  fromBundle?: boolean
  bundleDiscountPercent?: number
  homecare?: SubmittedHomecareAttribution
}

interface ServerPricedCheckoutItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
  unitPrice: number
  lineTotal: number
  discountAmount: number
  discountPercentage: number
  discountType: string
  discountDesc?: string
  fromBundle?: boolean
  bundleDiscountPercent?: number
  homecareAttribution?: ValidHomecareAttribution | null
  homecareEligibleAmount?: number
}

function isSubmittedFreeGift(item: CheckoutItem): boolean {
  const submittedName = String(item.product?.name || '').toLowerCase()
  const submittedCategory = String(item.product?.category || '').toLowerCase()
  const submittedPrice = Number(item.product?.price)

  return (
    submittedPrice === 0 ||
    submittedName.includes('(free)') ||
    submittedCategory === 'free-gift' ||
    String(item.selectedSize || '').trim() === '__PROMO__'
  )
}

function getSubmittedProductId(item: CheckoutItem): string {
  return String(item.product?.id || item.product?.productNumber || '').trim()
}

export async function POST(request: NextRequest) {
  // Per-IP rate limit (before any expensive work)
  const rl = await paymentIntentLimiter(getClientIdentifierFromNextRequest(request))
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many payment attempts. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

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
      orderNotes: rawOrderNotes,
      redeemPoints,
      locale 
    } = await request.json()

    // Optional customer delivery notes (length-capped, plain text)
    const orderNotes =
      typeof rawOrderNotes === 'string' && rawOrderNotes.trim()
        ? rawOrderNotes.trim().slice(0, 1000)
        : null

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

    debugLog('🔄 Creating Stripe payment intent:', {
      customerEmail,
      customerName,
      itemCount: items.length,
      emirate: customerEmirate
    })

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
    
    // Calculate totals from server-recomputed prices. Client-submitted product prices
    // are ignored except for explicit free-gift markers generated by checkout.
    let subtotal = 0
    let discountAmount = 0  // User discount
    let bundleDiscountAmount = 0  // Bundle discount
    let bundleDiscountPercent: number | null = null  // Bundle discount percentage (same for all bundle items)
    const pricedItems: ServerPricedCheckoutItem[] = []
    const productRecords: Array<{ item: CheckoutItem; product: Product }> = []

    for (const item of items as CheckoutItem[]) {
      const productId = getSubmittedProductId(item)
      if (!productId) {
        return NextResponse.json(
          { error: 'Invalid cart item' },
          { status: 400 }
        )
      }

      const product = await getProductById(productId)
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.product?.name || productId}` },
          { status: 400 }
        )
      }

      productRecords.push({ item, product })
    }

    const bundleLineCount = productRecords.filter(({ item, product }) =>
      isSubmittedBundleLine(item.bundleDiscountPercent, product)
    ).length

    // Free-gift candidates, validated against the spend threshold after the
    // paid subtotal is known (below).
    const freeGiftCandidates: Array<{ item: CheckoutItem; product: Product; quantity: number; selectedColor: string; selectedSize: string }> = []

    for (const { item, product } of productRecords) {
      const quantity = Number(item.quantity) || 0
      const selectedSize = String(item.selectedSize || '').trim()
      const selectedColor = String(item.selectedColor || '').trim()
      const isFreeGift = isSubmittedFreeGift(item) && isAllowedFreeGiftProduct(product)
      const bundlePct = getValidatedBundleDiscountPercent(item.bundleDiscountPercent, product, bundleLineCount)

      if (quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for ${product.name}` },
          { status: 400 }
        )
      }

      if (isFreeGift) {
        freeGiftCandidates.push({ item, product, quantity, selectedColor, selectedSize })
        continue
      }

      // Out-of-stock enforcement (paid items only).
      if (!product.inStock) {
        return NextResponse.json(
          { error: `${product.name} is currently out of stock` },
          { status: 400 }
        )
      }

      const cartItem: CartItem = {
        product,
        quantity,
        ...(selectedColor ? { selectedColor } : {}),
        ...(selectedSize ? { selectedSize } : {}),
        ...(bundlePct ? { fromBundle: true, bundleDiscountPercent: bundlePct } : {}),
      }
      const pricing = getCartLinePricing(cartItem, user)
      subtotal += pricing.lineTotal
      const homecareAttribution = await validateHomecareAttribution({
        ...(item.homecare ? { attribution: item.homecare } : {}),
        product,
        selectedSize,
      })

      if (pricing.discountType === 'bundle') {
        bundleDiscountAmount += pricing.discountAmount
        if (pricing.discountPercentage > 0) bundleDiscountPercent = pricing.discountPercentage
        debugLog(`Bundle item: ${product.name} - Bundle discount: ${pricing.discountPercentage}% = ${pricing.discountAmount.toFixed(2)} AED (no VIP applied)`)
      } else if (pricing.discountType === 'user' || pricing.discountType === 'black_friday') {
        discountAmount += pricing.discountAmount
      }

      let discountDesc = ''
      if (pricing.discountAmount > 0) {
        if (pricing.discountType === 'bundle') {
          discountDesc = `${Math.round(pricing.discountPercentage)}% Bundle discount applied (was AED ${pricing.retailUnitPrice.toFixed(2)})`
        } else if (pricing.discountType === 'user' || pricing.discountType === 'black_friday') {
          discountDesc = `${Math.round(pricing.discountPercentage)}% discount applied (was AED ${pricing.retailUnitPrice.toFixed(2)})`
        }
      }

      pricedItems.push({
        product,
        quantity,
        ...(selectedColor ? { selectedColor } : {}),
        ...(selectedSize ? { selectedSize } : {}),
        unitPrice: pricing.unitPrice,
        lineTotal: pricing.lineTotal,
        discountAmount: pricing.discountAmount,
        discountPercentage: pricing.discountPercentage,
        discountType: pricing.discountType,
        ...(discountDesc ? { discountDesc } : {}),
        ...(pricing.discountType === 'bundle' ? { fromBundle: true } : {}),
        ...(pricing.discountType === 'bundle' ? { bundleDiscountPercent: pricing.discountPercentage } : {}),
        ...(homecareAttribution ? { homecareAttribution } : {}),
      })
    }
    
    subtotal = Math.round(subtotal * 100) / 100
    discountAmount = Math.round(discountAmount * 100) / 100
    bundleDiscountAmount = Math.round(bundleDiscountAmount * 100) / 100

    // Admit only the free masks the spend threshold allows.
    {
      const allowance = allowedFreeGiftUnits(subtotal)
      let collagenLeft = allowance.collagen
      let seaAlgaeLeft = allowance.seaAlgae
      for (const g of freeGiftCandidates) {
        const kind = freeGiftKind(g.product)
        let grant = 0
        if (kind === 'collagen') { grant = Math.min(g.quantity, collagenLeft); collagenLeft -= grant }
        else if (kind === 'sea_algae') { grant = Math.min(g.quantity, seaAlgaeLeft); seaAlgaeLeft -= grant }
        if (grant <= 0) continue
        pricedItems.push({
          product: {
            ...g.product,
            name: String(g.item.product?.name || `${g.product.name} (FREE)`),
          },
          quantity: grant,
          ...(g.selectedColor ? { selectedColor: g.selectedColor } : {}),
          ...(g.selectedSize ? { selectedSize: g.selectedSize } : {}),
          unitPrice: 0,
          lineTotal: 0,
          discountAmount: 0,
          discountPercentage: 0,
          discountType: 'free_gift',
        })
      }
    }
    
    debugLog('Discount breakdown:', { 
      userDiscount: discountAmount, 
      bundleDiscount: bundleDiscountAmount, 
      bundleDiscountPercent,
      total: discountAmount + bundleDiscountAmount 
    })

    // Loyalty redemption (GENOSYS Rewards): requires a logged-in session matching
    // the customer email. The charge amount is reduced now; the points ledger
    // entry is written by the Stripe webhook when payment actually succeeds,
    // so abandoned payment attempts never consume points.
    let loyaltyRedemption = { points: 0, amountAed: 0 }
    const requestedRedeemPoints = Math.floor(Number(redeemPoints) || 0)
    if (requestedRedeemPoints > 0 && user) {
      try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('genosys_session')
        const session = sessionCookie?.value ? verifySessionToken(sessionCookie.value) : null
        const sessionEmail = String(session?.email || '').trim().toLowerCase()
        const allowedEmails = new Set(
          [user.email, user.contactEmail].filter(Boolean).map(e => String(e).trim().toLowerCase())
        )
        if (sessionEmail && allowedEmails.has(sessionEmail)) {
          loyaltyRedemption = await resolveRedemptionForCheckout({
            user,
            requestedPoints: requestedRedeemPoints,
            productSubtotal: subtotal,
          })
        }
      } catch (redeemError) {
        errorLog('❌ Loyalty redemption resolution failed (payment continues without it):', redeemError)
      }
    }

    // Calculate shipping and total (shipping threshold uses pre-redemption subtotal)
    const shipping = calculateMobileShipping(subtotal, customerEmirate)
    const total = Math.round((subtotal + shipping - loyaltyRedemption.amountAed) * 100) / 100
    const vat = calculateVatIncluded(total)
    const winningHomecare = selectWinningHomecareAttribution(
      pricedItems.map(item => item.homecareAttribution || null),
    )
    const homecareEligibleAmounts = computeHomecareEligibleAmounts(
      pricedItems.map(item => ({
        lineTotal: item.lineTotal,
        attribution:
          winningHomecare &&
          item.homecareAttribution?.scriptId === winningHomecare.scriptId &&
          item.homecareAttribution.versionId === winningHomecare.versionId
            ? item.homecareAttribution
            : null,
      })),
      loyaltyRedemption.amountAed,
    )
    pricedItems.forEach((item, index) => {
      item.homecareEligibleAmount = homecareEligibleAmounts[index] || 0
    })
    const homecareAttributedSubtotal = Math.round(
      homecareEligibleAmounts.reduce((sum, amount) => sum + amount, 0) * 100,
    ) / 100

    // Idempotency check: Look for recent pending CARD orders from same customer with same total
    const recentDuplicateCheck = await prisma.order.findFirst({
      where: {
        customerEmail: customerEmail.trim().toLowerCase(),
        paymentMethod: 'stripe',
        paymentStatus: 'pending',
        total: total,
        homecareScriptVersionId: winningHomecare?.versionId || null,
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
    const orderItems: OrderItemData[] = pricedItems.map((item) => {
      const enhanced = enhanceOrderItemWithDefaultSize({
        productName: item.product.name,
        size: item.selectedSize || null,
        color: item.selectedColor || null
      })
      
      return {
        productId: item.product.id,
        productName: item.product.name,
        price: item.unitPrice,
        quantity: item.quantity,
        image: item.product.image,
        color: enhanced.color || '',
        size: enhanced.size || '',
        ...(item.fromBundle && item.bundleDiscountPercent ? { bundleDiscount: item.bundleDiscountPercent } : {}),
        ...(item.homecareEligibleAmount && item.homecareAttribution && winningHomecare
          ? {
              homecareScriptItemId: item.homecareAttribution.scriptItemId,
              homecareScriptVersionId: winningHomecare.versionId,
              homecareEligibleAmount: item.homecareEligibleAmount,
            }
          : {}),
      }
    })

    // Build description for Stripe
    const itemNames = pricedItems.slice(0, 3).map((item) => item.product.name).join(', ')
    const description = pricedItems.length > 3 
      ? `${itemNames} and ${pricedItems.length - 3} more items` 
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
      ...(orderNotes ? { orderNotes } : {}),
      items: orderItems,
      subtotal,
      discountPercentage: hasUserDiscount ? userDiscountPct : 0,
      discountAmount,
      ...(bundleDiscountPercent ? { bundleDiscountPercentage: bundleDiscountPercent } : {}),
      bundleDiscountAmount,
      loyaltyPointsRedeemed: loyaltyRedemption.points,
      loyaltyDiscountAmount: loyaltyRedemption.amountAed,
      ...(winningHomecare && homecareAttributedSubtotal > 0
        ? {
            homecareScriptId: winningHomecare.scriptId,
            homecareScriptVersionId: winningHomecare.versionId,
            homecareAttributedSubtotal,
          }
        : {}),
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
      loyaltyPointsRedeemed: loyaltyRedemption.points,
      loyaltyDiscountAmount: loyaltyRedemption.amountAed,
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
    Sentry.captureException(error, { tags: { area: 'checkout', op: 'create-payment-intent' } })
    
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
