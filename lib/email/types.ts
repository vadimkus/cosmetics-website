/**
 * Email Types and Interfaces
 * Centralized type definitions for all email-related functionality
 */

// Email translation sections
export type EmailTranslationSection = 
  | 'cod' 
  | 'supportLink' 
  | 'stripePaymentConfirmation' 
  | 'statusUpdate' 
  | 'welcome' 
  | 'passwordReset' 
  | 'discountAssigned'

// Order item in emails
export interface OrderEmailItem {
  productName: string
  quantity: number
  price: number
  image?: string
  size?: string
  color?: string
}

// Order confirmation email data
export interface OrderConfirmationEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: OrderEmailItem[]
  subtotal: number
  shipping: number
  vat: number
  total: number
  address: string
  emirate: string
  locale?: string
}

// Admin new order notification data
export interface AdminNewOrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  total: number
  itemCount: number
  orderNotes?: string
  items?: OrderEmailItem[]
  subtotal?: number
  shipping?: number
  vat?: number
  address?: string
  emirate?: string
  paymentMethod?: string
  paymentStatus?: string
  locale?: string
}

// Admin new user notification data
export interface AdminNewUserEmailData {
  userName: string
  userEmail: string
  userPhone?: string
  registrationSource?: string
}

// Order HTML data for generators
export interface OrderHTMLData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: OrderEmailItem[]
  subtotal: number
  shipping: number
  vat: number
  total: number
  address?: string
  emirate?: string
  orderNotes?: string
  paymentMethod?: string
  paymentStatus?: string
  id?: string
}

// Discount assignment email data
export interface DiscountEmailData {
  customerName: string
  customerEmail: string
  discountType: 'CLINIC' | 'VIP'
  discountPercentage: number
  locale?: string
}

// Email send result
export interface EmailSendResult {
  success: boolean
  error?: string
  messageId?: string
}

// Locale settings for RTL/LTR support
export interface LocaleSettings {
  isRTL: boolean
  dir: 'rtl' | 'ltr'
  textAlign: 'right' | 'left'
  textAlignReverse: 'left' | 'right'
  dateLocale: string
}

// Nodemailer error type
export interface NodemailerError {
  code?: string
  command?: string
}

// Email template result
export interface EmailTemplateResult {
  subject: string
  html: string
}
