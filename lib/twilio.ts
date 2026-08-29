/**
 * Twilio WhatsApp Integration Service
 * 
 * This module provides WhatsApp messaging capabilities via Twilio API.
 * 
 * SETUP REQUIRED:
 * 1. Create a Twilio account at https://www.twilio.com
 * 2. Enable WhatsApp Business API in Twilio Console
 * 3. Get your Account SID and Auth Token
 * 4. Set up a WhatsApp Sender (phone number or WhatsApp Business Profile)
 * 5. Create message templates for transactional messages
 * 6. Add environment variables (see .env.example)
 */

import { debugLog, errorLog } from '@/lib/logger'

// Twilio configuration from environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER // Format: +971XXXXXXXXX

// Check if Twilio is configured
export function isTwilioConfigured(): boolean {
  return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_NUMBER)
}

// WhatsApp message types
export type WhatsAppMessageType = 
  | 'order_confirmation'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'payment_received'
  | 'abandoned_cart'
  | 'back_in_stock'
  | 'welcome'
  | 'custom'

// Message template interface
export interface WhatsAppTemplate {
  type: WhatsAppMessageType
  contentSid?: string | undefined // Twilio Content Template SID (for approved templates)
  fallbackMessage: (vars: Record<string, string>) => string
}

// Twilio Content Template SIDs (to be filled after creating templates in Twilio)
// These are placeholders - replace with actual SIDs from Twilio Console
export const WHATSAPP_TEMPLATES: Record<WhatsAppMessageType, WhatsAppTemplate> = {
  order_confirmation: {
    type: 'order_confirmation',
    contentSid: process.env.TWILIO_TEMPLATE_ORDER_CONFIRMATION,
    fallbackMessage: (vars) => 
      `✅ *Order Confirmed!*\n\n` +
      `Thank you for your order, ${vars.customerName}!\n\n` +
      `🛒 Order: #${vars.orderNumber}\n` +
      `💰 Total: ${vars.total} AED\n` +
      `📦 Items: ${vars.itemCount}\n\n` +
      `We'll notify you when your order ships.\n\n` +
      `Track your order: ${vars.trackingUrl}\n\n` +
      `_GENOSYS Middle East_`
  },
  order_shipped: {
    type: 'order_shipped',
    contentSid: process.env.TWILIO_TEMPLATE_ORDER_SHIPPED,
    fallbackMessage: (vars) =>
      `🚚 *Your Order is On the Way!*\n\n` +
      `Great news, ${vars.customerName}!\n\n` +
      `Order #${vars.orderNumber} has been shipped.\n\n` +
      `📍 Delivering to: ${vars.emirate}\n` +
      `⏱️ Estimated delivery: ${vars.estimatedDelivery}\n\n` +
      `Track your order: ${vars.trackingUrl}\n\n` +
      `_GENOSYS Middle East_`
  },
  order_delivered: {
    type: 'order_delivered',
    contentSid: process.env.TWILIO_TEMPLATE_ORDER_DELIVERED,
    fallbackMessage: (vars) =>
      `🎉 *Order Delivered!*\n\n` +
      `Hi ${vars.customerName},\n\n` +
      `Your order #${vars.orderNumber} has been delivered!\n\n` +
      `We hope you love your GENOSYS products! ✨\n\n` +
      `Questions? Reply to this message or contact us.\n\n` +
      `_GENOSYS Middle East_`
  },
  order_cancelled: {
    type: 'order_cancelled',
    contentSid: process.env.TWILIO_TEMPLATE_ORDER_CANCELLED,
    fallbackMessage: (vars) =>
      `❌ *Order Cancelled*\n\n` +
      `Hi ${vars.customerName},\n\n` +
      `Order #${vars.orderNumber} has been cancelled.\n\n` +
      `${vars.reason ? `Reason: ${vars.reason}\n\n` : ''}` +
      `If this wasn't expected, just reply here - we'll make it right and can place a new order for you in minutes.\n\n` +
      `_GENOSYS Middle East_`
  },
  payment_received: {
    type: 'payment_received',
    contentSid: process.env.TWILIO_TEMPLATE_PAYMENT_RECEIVED,
    fallbackMessage: (vars) =>
      `💳 *Payment Received!*\n\n` +
      `Thank you, ${vars.customerName}!\n\n` +
      `We've received your payment for order #${vars.orderNumber}.\n` +
      `Amount: ${vars.total} AED\n\n` +
      `Your order is now being processed.\n\n` +
      `_GENOSYS Middle East_`
  },
  abandoned_cart: {
    type: 'abandoned_cart',
    contentSid: process.env.TWILIO_TEMPLATE_ABANDONED_CART,
    fallbackMessage: (vars) =>
      `👋 *Did you forget something?*\n\n` +
      `Hi ${vars.customerName},\n\n` +
      `You left ${vars.itemCount} item(s) in your bag.\n\n` +
      `Complete your order: ${vars.cartUrl}\n\n` +
      `_GENOSYS Middle East_`
  },
  back_in_stock: {
    type: 'back_in_stock',
    contentSid: process.env.TWILIO_TEMPLATE_BACK_IN_STOCK,
    fallbackMessage: (vars) =>
      `🔔 *Back in Stock!*\n\n` +
      `Hi ${vars.customerName},\n\n` +
      `Great news! ${vars.productName} is back in stock.\n\n` +
      `Get it now: ${vars.productUrl}\n\n` +
      `_GENOSYS Middle East_`
  },
  welcome: {
    type: 'welcome',
    contentSid: process.env.TWILIO_TEMPLATE_WELCOME,
    fallbackMessage: (vars) =>
      `👋 *Welcome to GENOSYS!*\n\n` +
      `Hi ${vars.customerName},\n\n` +
      `Thank you for joining GENOSYS Middle East!\n\n` +
      `Discover premium Korean dermacosmetics at genosys.ae\n\n` +
      `_GENOSYS Middle East_`
  },
  custom: {
    type: 'custom',
    fallbackMessage: (vars) => vars.message || ''
  }
}

// Result interface
export interface WhatsAppSendResult {
  success: boolean
  messageId?: string
  error?: string
  skipped?: boolean
  reason?: string
}

/**
 * Format phone number for WhatsApp
 * Ensures the number is in international format with country code
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '')
  
  // Handle UAE numbers
  if (cleaned.startsWith('0')) {
    // Local UAE number starting with 0 (e.g., 0501234567)
    cleaned = '971' + cleaned.substring(1)
  } else if (cleaned.startsWith('971')) {
    // Already has country code
  } else if (cleaned.length === 9 && (cleaned.startsWith('5') || cleaned.startsWith('4'))) {
    // UAE mobile/landline without country code
    cleaned = '971' + cleaned
  }
  
  return '+' + cleaned
}

/**
 * Validate if a phone number can receive WhatsApp messages
 */
export function isValidWhatsAppNumber(phone: string): boolean {
  const formatted = formatPhoneForWhatsApp(phone)
  // Basic validation: should be +971 followed by 9 digits
  return /^\+971[0-9]{9}$/.test(formatted)
}

/**
 * Send a WhatsApp message via Twilio
 */
export async function sendWhatsAppMessage(
  to: string,
  messageType: WhatsAppMessageType,
  variables: Record<string, string>
): Promise<WhatsAppSendResult> {
  // Check if Twilio is configured
  if (!isTwilioConfigured()) {
    debugLog('[TWILIO] WhatsApp not configured - skipping message')
    return {
      success: false,
      skipped: true,
      reason: 'Twilio WhatsApp not configured'
    }
  }

  // Format and validate phone number
  const formattedPhone = formatPhoneForWhatsApp(to)
  if (!isValidWhatsAppNumber(to)) {
    debugLog('[TWILIO] Invalid phone number:', to)
    return {
      success: false,
      error: 'Invalid phone number format'
    }
  }

  // Get template
  const template = WHATSAPP_TEMPLATES[messageType]
  if (!template) {
    return {
      success: false,
      error: `Unknown message type: ${messageType}`
    }
  }

  try {
    // Build Twilio API URL
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
    
    // Prepare the message body
    const fromNumber = `whatsapp:${TWILIO_WHATSAPP_NUMBER}`
    const toNumber = `whatsapp:${formattedPhone}`
    
    // Build form data
    const formData = new URLSearchParams()
    formData.append('From', fromNumber)
    formData.append('To', toNumber)
    
    // Use Content Template if available (recommended for business messages)
    if (template.contentSid) {
      formData.append('ContentSid', template.contentSid)
      // Convert variables to ContentVariables JSON format
      // Twilio expects: {"1": "value1", "2": "value2", ...}
      const contentVars: Record<string, string> = {}
      const varKeys = Object.keys(variables)
      varKeys.forEach((key, index) => {
        const value = variables[key]
        if (value !== undefined) {
          contentVars[(index + 1).toString()] = value
        }
      })
      formData.append('ContentVariables', JSON.stringify(contentVars))
    } else {
      // Use fallback plain text message (for sandbox/testing)
      const messageBody = template.fallbackMessage(variables)
      formData.append('Body', messageBody)
    }
    
    // Make API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    
    const result = await response.json()
    
    if (response.ok) {
      debugLog('[TWILIO] WhatsApp message sent:', {
        to: formattedPhone,
        type: messageType,
        messageSid: result.sid
      })
      
      return {
        success: true,
        messageId: result.sid
      }
    } else {
      errorLog('[TWILIO] Failed to send WhatsApp:', result)
      return {
        success: false,
        error: result.message || 'Failed to send message'
      }
    }
    
  } catch (error) {
    errorLog('[TWILIO] WhatsApp send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Send order confirmation via WhatsApp
 */
export async function sendWhatsAppOrderConfirmation(
  phone: string,
  orderData: {
    customerName: string
    orderNumber: string
    total: number
    itemCount: number
    locale?: string | undefined
  }
): Promise<WhatsAppSendResult> {
  const trackingUrl = `https://genosys.ae/track/${orderData.orderNumber}`
  
  return sendWhatsAppMessage(phone, 'order_confirmation', {
    customerName: orderData.customerName,
    orderNumber: orderData.orderNumber,
    total: orderData.total.toFixed(2),
    itemCount: orderData.itemCount.toString(),
    trackingUrl
  })
}

/**
 * Send order shipped notification via WhatsApp
 */
export async function sendWhatsAppOrderShipped(
  phone: string,
  orderData: {
    customerName: string
    orderNumber: string
    emirate: string
    estimatedDelivery: string
  }
): Promise<WhatsAppSendResult> {
  const trackingUrl = `https://genosys.ae/track/${orderData.orderNumber}`
  
  return sendWhatsAppMessage(phone, 'order_shipped', {
    customerName: orderData.customerName,
    orderNumber: orderData.orderNumber,
    emirate: orderData.emirate,
    estimatedDelivery: orderData.estimatedDelivery,
    trackingUrl
  })
}

/**
 * Send order delivered notification via WhatsApp
 */
export async function sendWhatsAppOrderDelivered(
  phone: string,
  orderData: {
    customerName: string
    orderNumber: string
  }
): Promise<WhatsAppSendResult> {
  return sendWhatsAppMessage(phone, 'order_delivered', {
    customerName: orderData.customerName,
    orderNumber: orderData.orderNumber
  })
}

/**
 * Send order cancelled notification via WhatsApp
 */
export async function sendWhatsAppOrderCancelled(
  phone: string,
  orderData: {
    customerName: string
    orderNumber: string
    reason?: string | undefined
  }
): Promise<WhatsAppSendResult> {
  return sendWhatsAppMessage(phone, 'order_cancelled', {
    customerName: orderData.customerName,
    orderNumber: orderData.orderNumber,
    reason: orderData.reason || ''
  })
}

/**
 * Send payment received notification via WhatsApp
 */
export async function sendWhatsAppPaymentReceived(
  phone: string,
  orderData: {
    customerName: string
    orderNumber: string
    total: number
  }
): Promise<WhatsAppSendResult> {
  return sendWhatsAppMessage(phone, 'payment_received', {
    customerName: orderData.customerName,
    orderNumber: orderData.orderNumber,
    total: orderData.total.toFixed(2)
  })
}

/**
 * Send abandoned cart reminder via WhatsApp
 */
export async function sendWhatsAppAbandonedCart(
  phone: string,
  data: {
    customerName: string
    itemCount: number
  }
): Promise<WhatsAppSendResult> {
  return sendWhatsAppMessage(phone, 'abandoned_cart', {
    customerName: data.customerName,
    itemCount: data.itemCount.toString(),
    cartUrl: 'https://genosys.ae/cart'
  })
}

/**
 * Send back in stock notification via WhatsApp
 */
export async function sendWhatsAppBackInStock(
  phone: string,
  data: {
    customerName: string
    productName: string
    productId: string
  }
): Promise<WhatsAppSendResult> {
  return sendWhatsAppMessage(phone, 'back_in_stock', {
    customerName: data.customerName,
    productName: data.productName,
    productUrl: `https://genosys.ae/products/${data.productId}`
  })
}

/**
 * Send welcome message via WhatsApp
 */
export async function sendWhatsAppWelcome(
  phone: string,
  customerName: string
): Promise<WhatsAppSendResult> {
  return sendWhatsAppMessage(phone, 'welcome', {
    customerName
  })
}
