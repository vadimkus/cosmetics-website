import Stripe from 'stripe'
import { debugLog, errorLog } from '@/lib/logger'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

// Initialize Stripe with your secret key
// API version pinned explicitly to match stripe-node v22 (Dahlia) so behavior
// is deterministic instead of inheriting the SDK/account default.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-06-24.dahlia',
  typescript: true,
})

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: 'aed' as const, // UAE Dirham
  automatic_tax: false, // We calculate VAT manually
  billing_address_collection: 'required' as Stripe.Checkout.SessionCreateParams.BillingAddressCollection,
  shipping_address_collection: {
    allowed_countries: ['AE'] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[], // UAE only
  },
  // Success and cancel URLs (will be set dynamically)
  success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/checkout/cancelled`,
}

// VAT calculation helper (VAT is included in prices)
export function calculateVATFromInclusive(amount: number): number {
  // UAE VAT is 5% and prices are VAT-inclusive
  // VAT = (VAT-inclusive amount / 1.05) * 0.05
  return Math.round(((amount / 1.05) * 0.05) * 100) / 100
}

// Convert AED to fils (smallest currency unit for Stripe)
export function aedToFils(aed: number): number {
  return Math.round(aed * 100)
}

// Convert fils to AED
export function filsToAed(fils: number): number {
  return fils / 100
}

// Helper function to map Stripe alphanumeric values back to emirate names
export function mapStripeEmirateValue(stripeValue: string): string {
  const emirateMapping: Record<string, string> = {
    'Dubai': 'Dubai',
    'AbuDhabi': 'Abu Dhabi',
    'Sharjah': 'Sharjah',
    'Ajman': 'Ajman',
    'RasAlKhaimah': 'Ras Al Khaimah',
    'Fujairah': 'Fujairah',
    'UmmAlQuwain': 'Umm Al Quwain',
  }
  return emirateMapping[stripeValue] || stripeValue
}

// Validate webhook signature
export function validateWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    errorLog('Webhook signature verification failed:', error)
    throw new Error('Invalid webhook signature')
  }
}

// Create checkout session helper
export async function createCheckoutSession(params: {
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
  customerEmail: string
  customerName: string
  customerPhone: string
  shippingAddress: {
    line1: string
    city: string
    country: string
    state?: string
    postal_code?: string
  }
  orderNumber: string
  locale: string
}): Promise<Stripe.Checkout.Session> {
  try {
    debugLog('Creating Stripe checkout session:', {
      orderNumber: params.orderNumber,
      customerEmail: params.customerEmail,
      itemCount: params.lineItems.length
    })

    const session = await stripe.checkout.sessions.create({
      // Dynamic payment methods: omit payment_method_types so Checkout uses the
      // methods enabled in the Stripe Dashboard (card, Apple Pay, Google Pay, Link).
      mode: 'payment',
      currency: STRIPE_CONFIG.currency,
      
      // Line items
      line_items: params.lineItems,
      
      // Customer information
      customer_email: params.customerEmail,
      
      // Shipping address
      shipping_address_collection: STRIPE_CONFIG.shipping_address_collection,
      
      // Billing address
      billing_address_collection: STRIPE_CONFIG.billing_address_collection,
      
      // URLs
      success_url: STRIPE_CONFIG.success_url,
      cancel_url: STRIPE_CONFIG.cancel_url,
      
      // Metadata for webhook processing (includes emirate from our checkout page)
      metadata: {
        orderNumber: params.orderNumber,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        customerEmail: params.customerEmail,
        customerEmirate: params.shippingAddress.city, // Emirate already collected on checkout
        locale: params.locale,
      },
      
      // Shipping is handled via line items, not shipping options
      // This prevents double charging for shipping
      
      // Stripe Dashboard promo codes are disabled: all discounts (VIP, bundle,
      // Beauty Box) are computed server-side and baked into the line items, so a
      // Stripe-level code would let a customer underpay vs the recorded order total.
      allow_promotion_codes: false,
      
      // Automatic tax (disabled as we handle VAT manually)
      automatic_tax: {
        enabled: STRIPE_CONFIG.automatic_tax,
      },
      
      // Locale support - cast to Stripe's Locale type
      locale: (params.locale === 'ar' ? 'ar' : 'en') as Stripe.Checkout.SessionCreateParams.Locale,
      
      // Phone number collection
      phone_number_collection: {
        enabled: true,
      },
    }, {
      // Idempotency: retries or double-taps for the same order reuse the same
      // session instead of creating (and potentially charging) duplicates.
      idempotencyKey: `checkout_session_${params.orderNumber}`,
    })

    debugLog('✅ Stripe checkout session created:', {
      sessionId: session.id,
      url: session.url,
      orderNumber: params.orderNumber
    })

    return session
    
  } catch (error) {
    errorLog('❌ Failed to create Stripe checkout session:', error)
    // Log the detailed Stripe error for debugging
    if (error instanceof Error) {
      errorLog('❌ Detailed error message:', error.message)
      errorLog('❌ Error stack:', error.stack)
    }
    throw new Error(`Failed to create payment session: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Create payment intent for embedded checkout
export async function createPaymentIntent(params: {
  amount: number // Amount in AED
  customerEmail: string
  customerName: string
  customerPhone: string
  customerEmirate: string
  orderNumber: string
  locale: string
  description?: string
}): Promise<Stripe.PaymentIntent> {
  try {
    debugLog('Creating Stripe payment intent:', {
      orderNumber: params.orderNumber,
      customerEmail: params.customerEmail,
      amount: params.amount
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: aedToFils(params.amount),
      currency: STRIPE_CONFIG.currency,
      // Dynamic payment methods: methods (card, Apple Pay, Google Pay, Link)
      // are controlled from the Stripe Dashboard instead of hardcoded here.
      automatic_payment_methods: { enabled: true },
      description: params.description || `Order ${params.orderNumber}`,
      metadata: {
        orderNumber: params.orderNumber,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        customerEmail: params.customerEmail,
        customerEmirate: params.customerEmirate,
        locale: params.locale,
      },
      receipt_email: params.customerEmail,
    }, {
      // Idempotency: retries/double-taps for the same order reuse the same
      // PaymentIntent instead of creating duplicate intents (and orders).
      idempotencyKey: `payment_intent_${params.orderNumber}`,
    })

    debugLog('✅ Stripe payment intent created:', {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret ? '***' : 'missing',
      orderNumber: params.orderNumber
    })

    return paymentIntent
    
  } catch (error) {
    errorLog('❌ Failed to create Stripe payment intent:', error)
    if (error instanceof Error) {
      errorLog('❌ Detailed error message:', error.message)
      errorLog('❌ Error stack:', error.stack)
    }
    throw new Error(`Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Retrieve payment intent details
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId)
  } catch (error) {
    errorLog('❌ Failed to retrieve payment intent:', error)
    throw new Error('Failed to retrieve payment details')
  }
}

// Retrieve checkout session details
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent']
    })
  } catch (error) {
    errorLog('❌ Failed to retrieve checkout session:', error)
    throw new Error('Failed to retrieve session details')
  }
}

// Create a refund
export async function createRefund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
  try {
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    }
    
    if (amount) {
      refundParams.amount = aedToFils(amount)
    }
    
    return await stripe.refunds.create(refundParams)
  } catch (error) {
    errorLog('❌ Failed to create refund:', error)
    throw new Error('Failed to process refund')
  }
}