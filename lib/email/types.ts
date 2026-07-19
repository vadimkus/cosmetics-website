/**
 * Email Types and Interfaces
 * Centralized type definitions for all email-related functionality
 */

// Email translation sections
export type EmailTranslationSection =
  | 'cod'
  | 'stripePaymentConfirmation'
  | 'statusUpdate'
  | 'welcome'
  | 'passwordReset'
  | 'discountAssigned'

// Locale settings for RTL/LTR support
export interface LocaleSettings {
  isRTL: boolean
  dir: 'rtl' | 'ltr'
  textAlign: 'right' | 'left'
  textAlignReverse: 'left' | 'right'
  dateLocale: string
}

// Order confirmation email data
export interface OrderConfirmationEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    productName: string
    quantity: number
    price: number
    originalPrice?: number | undefined // Original price before discount
    image: string
    size?: string
    color?: string
    discountLabel?: string | undefined // e.g., "50% OFF" or "15% OFF - Bundle Discount"
    bundleDiscount?: number | null | undefined // Per-item bundle discount %
  }>
  subtotal: number
  shipping: number
  vat: number
  total: number
  address: string
  emirate: string
  locale?: string
  discountPercentage?: number | undefined
  discountAmount?: number | undefined
  bundleDiscountPercentage?: number | undefined
  bundleDiscountAmount?: number | undefined
  loyaltyPointsRedeemed?: number | undefined
  loyaltyDiscountAmount?: number | undefined
  clinicPointsDiscountAmount?: number | undefined
}

// Admin new order notification data
export interface AdminNewOrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string | undefined
  total: number
  itemCount: number
  orderNotes?: string | undefined
  items?: Array<{
    productName: string
    quantity: number
    price: number
    originalPrice?: number | undefined // Original price before discount
    image: string
    size?: string
    color?: string
    discountLabel?: string | undefined
    bundleDiscount?: number | null | undefined // Per-item bundle discount %
  }> | undefined
  subtotal?: number | undefined
  shipping?: number | undefined
  vat?: number | undefined
  address?: string | undefined
  emirate?: string | undefined
  deviceType?: string | undefined
  paymentMethod?: string | undefined
  paymentStatus?: 'PAID' | 'PENDING' | 'COD' | undefined
  // Admin-only: which channel the order came from ('app' | 'website').
  // Usually derived from the order number in sendAdminNewOrderNotification.
  orderSource?: 'app' | 'website' | undefined
  // Optional raw payment metadata (JSON) used as a backstop for channel detection
  paymentMetadata?: string | null | undefined
  discountPercentage?: number | undefined
  discountAmount?: number | undefined
  bundleDiscountPercentage?: number | undefined
  bundleDiscountAmount?: number | undefined
  loyaltyPointsRedeemed?: number | undefined
  loyaltyDiscountAmount?: number | undefined
  clinicPointsDiscountAmount?: number | undefined
}

// Order status update email data
export interface OrderStatusUpdateEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
}

// Order HTML item for HTML generation
export interface OrderHTMLItem {
  name: string
  quantity: number
  price: number
  originalPrice?: number | undefined // Original price before discount (for display)
  image?: string | undefined
  total?: number | undefined
  size?: string | undefined
  color?: string | undefined
  discountLabel?: string | undefined // e.g., "50% OFF" or "15% OFF - Bundle Discount"
  bundleDiscount?: number | null | undefined // Per-item bundle discount % (null = not a bundle item)
}

// Order HTML data for HTML generation
export interface OrderHTMLData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  emirate: string
  items: OrderHTMLItem[]
  subtotal: number
  shippingCost: number
  vatAmount: number
  total: number
  discountPercentage?: number | undefined
  discountAmount?: number | undefined
  bundleDiscountPercentage?: number | undefined
  bundleDiscountAmount?: number | undefined
  loyaltyPointsRedeemed?: number | undefined
  loyaltyDiscountAmount?: number | undefined
  loyaltyPointsExpected?: number | undefined
  clinicPointsDiscountAmount?: number | undefined
}
