/**
 * Email Sender Functions
 * Wrapper functions for sending specific email types
 */
import { debugLog, errorLog } from '@/lib/logger'
import { ADMIN_EMAIL, GMAIL_USER, EMAIL_USER, GMAIL_APP_PASSWORD } from '@/lib/envValidation'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { sendEmail } from './transporter'
import { emailTemplates } from './templates'
import type { OrderConfirmationEmailData, AdminNewOrderEmailData } from './types'

// Specific email functions
export const sendWelcomeEmail = async (userName: string, userEmail: string, password?: string, locale: string = 'en') => {
  const template = emailTemplates.welcomeUser(userName, userEmail, password, locale)
  return await sendEmail(userEmail, template.subject, template.html)
}

export const sendOrderShippedEmail = async (orderData: { orderNumber: string; customerName: string; customerEmail: string; items?: Array<{ productName: string; quantity: number; price: number; image?: string }>; total?: number; customerAddress?: string; customerEmirate?: string }) => {
  const template = emailTemplates.orderShipped(orderData)
  return await sendEmail(orderData.customerEmail, template.subject, template.html)
}

export const sendOrderConfirmedEmail = async (orderData: { orderNumber: string; customerName: string; customerEmail: string; items?: Array<{ productName: string; quantity: number; price: number; image?: string }>; total?: number }) => {
  const template = emailTemplates.orderConfirmed(orderData)
  return await sendEmail(orderData.customerEmail, template.subject, template.html)
}

export const sendOrderDeliveredEmail = async (orderData: { orderNumber: string; customerName: string; customerEmail: string; items?: Array<{ productName: string; quantity: number; price: number; image?: string }>; total?: number; locale?: string }) => {
  const template = emailTemplates.orderDelivered(orderData)
  return await sendEmail(orderData.customerEmail, template.subject, template.html)
}

export const sendDiscountAssignmentEmail = async (discountData: { customerName: string; customerEmail: string; discountType: 'CLINIC' | 'VIP'; discountPercentage: number; locale?: string }) => {
  const template = emailTemplates.discountAssigned(discountData)
  return await sendEmail(discountData.customerEmail, template.subject, template.html)
}

export const sendOrderConfirmationEmail = async (orderData: OrderConfirmationEmailData) => {
  try {
    // PRODUCTION DEBUG - using debugLog to ensure visibility in Vercel logs
    debugLog(`📧 Sending order confirmation email to: ${orderData.customerEmail}`)
    debugLog(`📧 Order: ${orderData.orderNumber}, Customer: ${orderData.customerName}`)
    debugLog(`🎟️ CUSTOMER EMAIL DISCOUNT DATA: discountPercentage=${orderData.discountPercentage}, discountAmount=${orderData.discountAmount}`)
    
    const template = emailTemplates.orderConfirmation(orderData)
    debugLog(`📧 Template generated, subject: ${template.subject}`)
    
    const result = await sendEmail(orderData.customerEmail, template.subject, template.html)
    
    if (!result.success) {
      errorLog(`❌ FAILED to send order confirmation email to ${orderData.customerEmail}`)
      errorLog(`❌ Error:`, result.error)
      errorLog(`❌ Order number:`, orderData.orderNumber)
    } else {
      debugLog(`✅ Order confirmation email sent successfully to ${orderData.customerEmail}`)
      debugLog(`✅ Message ID:`, result.messageId)
    }
    
    return result
  } catch (error) {
    errorLog(`❌ EXCEPTION in sendOrderConfirmationEmail:`)
    errorLog(`❌ Error:`, error)
    errorLog(`❌ Order number:`, orderData.orderNumber)
    errorLog(`❌ Stack:`, error instanceof Error ? error.stack : 'No stack')
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const sendAdminNewUserNotification = async (
  userName: string, 
  userEmail: string, 
  userPhone?: string, 
  userAddress?: string, 
  registrationMethod?: string,
  additionalInfo?: {
    ipAddress?: string
    country?: string
    city?: string
    deviceType?: string
    deviceModel?: string
    os?: string
    browser?: string
    age?: number
    gender?: string
  }
) => {
  // Use ADMIN_EMAIL, or fallback to GMAIL_USER/EMAIL_USER
  const adminEmail = ADMIN_EMAIL || GMAIL_USER || EMAIL_USER
  
  if (!adminEmail) {
    errorLog('📧 ⚠️ Cannot send admin new user notification: No admin email configured (set ADMIN_EMAIL, GMAIL_USER, or EMAIL_USER)')
    return
  }
  
  debugLog(`📧 ===== ADMIN NEW USER NOTIFICATION =====`)
  debugLog(`📧 Sending admin new user notification to: ${adminEmail}`)
  debugLog(`📧 User: ${userName} (${userEmail})`)
  debugLog(`📧 Registration method: ${registrationMethod || 'Unknown'}`)
  debugLog(`📧 Additional info:`, additionalInfo)
  debugLog(`📧 Admin email sources - ADMIN_EMAIL: ${ADMIN_EMAIL || 'NOT_SET'}, GMAIL_USER: ${GMAIL_USER || 'NOT_SET'}, EMAIL_USER: ${EMAIL_USER || 'NOT_SET'}`)
  debugLog(`📧 GMAIL_APP_PASSWORD: ${GMAIL_APP_PASSWORD ? 'SET' : 'NOT_SET'}`)
  
  const template = emailTemplates.adminNewUser(userName, userEmail, userPhone, userAddress, registrationMethod, additionalInfo)
  
  // Try sending with retry logic
  let result: { success: boolean; messageId?: string; error?: string } | undefined
  let lastError: string | undefined
  const maxRetries = 2
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    debugLog(`📧 Attempt ${attempt} of ${maxRetries} to send admin notification`)
    result = await sendEmail(adminEmail, template.subject, template.html)
    
    if (result && result.success) {
      debugLog(`✅ Admin new user notification sent successfully to ${adminEmail} on attempt ${attempt}`)
      debugLog(`✅ Message ID: ${result.messageId}`)
      break
    } else {
      lastError = result?.error
      errorLog(`❌ Attempt ${attempt} failed: ${result?.error || 'Unknown error'}`)
      if (attempt < maxRetries) {
        // Wait 1 second before retry
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }
  
  if (!result || !result.success) {
    errorLog(`❌ ===== FAILED TO SEND ADMIN NOTIFICATION AFTER ${maxRetries} ATTEMPTS =====`)
    errorLog(`❌ Final error: ${lastError || 'Unknown error'}`)
    errorLog(`❌ User: ${userName} (${userEmail})`)
    errorLog(`❌ Admin email: ${adminEmail}`)
  } else {
    debugLog(`✅ ===== ADMIN NOTIFICATION SENT SUCCESSFULLY =====`)
  }
  
  return result || { success: false, error: lastError || 'Unknown error' }
}

export const sendAdminNewOrderNotification = async (orderData: AdminNewOrderEmailData, recipientEmail?: string) => {
  try {
    // Use provided recipientEmail, or ADMIN_EMAIL, or fallback to GMAIL_USER/EMAIL_USER
    const adminEmail = recipientEmail || ADMIN_EMAIL || GMAIL_USER || EMAIL_USER
    
    if (!adminEmail) {
      errorLog('📧 ⚠️ Cannot send admin order notification: No admin email configured (set ADMIN_EMAIL, GMAIL_USER, or EMAIL_USER)')
      return { success: false, error: 'No admin email configured' }
    }
    
    // PRODUCTION DEBUG - using debugLog to ensure visibility in Vercel logs
    debugLog(`📧 Sending admin new order notification to: ${adminEmail}`)
    debugLog(`📧 Order data for admin notification:`, JSON.stringify({
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      total: orderData.total,
      itemCount: orderData.itemCount,
      discountPercentage: orderData.discountPercentage,
      discountAmount: orderData.discountAmount
    }))
    debugLog(`🎟️ ADMIN EMAIL DISCOUNT DATA: discountPercentage=${orderData.discountPercentage}, discountAmount=${orderData.discountAmount}`)
    
    let customerEmailForAdmin = String(orderData.customerEmail || '').trim()
    try {
      if (customerEmailForAdmin) {
        const user = await findUserByEmail(customerEmailForAdmin)
        if (user) {
          customerEmailForAdmin = getPreferredEmail(user)
        }
      }
    } catch {
      // Ignore lookup failures; fall back to provided email
    }

    const adminOrderData = { ...orderData, customerEmail: customerEmailForAdmin }
    const template = emailTemplates.adminNewOrder(adminOrderData)
    debugLog(`📧 Admin email template generated, subject: ${template.subject}`)
    
    const result = await sendEmail(adminEmail, template.subject, template.html)
    
    if (!result.success) {
      errorLog(`❌ FAILED to send admin new order notification to ${adminEmail}`)
      errorLog(`❌ Error:`, result.error)
      errorLog(`❌ Order number:`, orderData.orderNumber)
    } else {
      debugLog(`✅ Admin new order notification sent successfully to ${adminEmail}`)
      debugLog(`✅ Message ID:`, result.messageId)
      debugLog(`✅ Order number:`, orderData.orderNumber)
    }
    
    return result
  } catch (error) {
    errorLog(`❌ EXCEPTION in sendAdminNewOrderNotification:`)
    errorLog(`❌ Error:`, error)
    errorLog(`❌ Order number:`, orderData.orderNumber)
    errorLog(`❌ Stack:`, error instanceof Error ? error.stack : 'No stack')
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const sendPasswordResetEmail = async (userEmail: string, userName: string, resetToken: string, locale: string = 'en') => {
  const template = emailTemplates.passwordReset(userName, resetToken, locale)
  debugLog(`📧 Sending password reset email to: ${userEmail} (locale: ${locale})`)
  return await sendEmail(userEmail, template.subject, template.html)
}

export const sendBlackFridayEmail = async (userEmail: string, userName: string, blogLink: string) => {
  const template = emailTemplates.blackFridaySale(userName, blogLink)
  return await sendEmail(userEmail, template.subject, template.html)
}
