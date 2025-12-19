import Stripe from 'stripe'
import { debugLog, errorLog } from '@/lib/logger'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
})

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: 'aed', // UAE Dirham
  automatic_tax: false, // We calculate VAT manually
  billing_address_collection: 'required',
  shipping_address_collection: {
    allowed_countries: ['AE'], // UAE only
  },
  // Success and cancel URLs (will be set dynamically)
  success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/checkout/cancelled`,
} as const

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
  } catch {
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
      payment_method_types: ['card', 'link'],
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
      
      // Metadata for webhook processing
      metadata: {
        orderNumber: params.orderNumber,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        customerEmail: params.customerEmail,
        locale: params.locale,
      },
      
      // Custom fields for additional info
      custom_fields: [
        {
          key: 'emirate',
          label: {
            type: 'custom',
            custom: 'Emirate',
          },
          type: 'dropdown',
          dropdown: {
            options: [
              { label: 'Dubai', value: 'Dubai' },
              { label: 'Abu Dhabi', value: 'AbuDhabi' },
              { label: 'Sharjah', value: 'Sharjah' },
              { label: 'Ajman', value: 'Ajman' },
              { label: 'Ras Al Khaimah', value: 'RasAlKhaimah' },
              { label: 'Fujairah', value: 'Fujairah' },
              { label: 'Umm Al Quwain', value: 'UmmAlQuwain' },
            ],
          },
        },
      ],
      
      // Shipping is handled via line items, not shipping options
      // This prevents double charging for shipping
      
      // Allow promotion codes
      allow_promotion_codes: true,
      
      // Automatic tax (disabled as we handle VAT manually)
      automatic_tax: {
        enabled: STRIPE_CONFIG.automatic_tax,
      },
      
      // Locale support
      locale: params.locale === 'ar' ? 'ar' : 'en',
      
      // Phone number collection
      phone_number_collection: {
        enabled: true,
      },
    } as any)

    debugLog('✅ Stripe checkout session created:', {
      sessionId: session.id,
      url: session.url,
      orderNumber: params.orderNumber
    })

    return session
    
  } catch {
    errorLog('❌ Failed to create Stripe checkout session:', error)
    // Log the detailed Stripe error for debugging
    if (error instanceof Error) {
      errorLog('❌ Detailed error message:', error.message)
      errorLog('❌ Error stack:', error.stack)
    }
    throw new Error(`Failed to create payment session: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Retrieve payment intent details
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId)
  } catch {
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
  } catch {
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
  } catch {
    errorLog('❌ Failed to create refund:', error)
    throw new Error('Failed to process refund')
  }
}