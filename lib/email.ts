import { debugLog, errorLog } from '@/lib/logger'
import nodemailer from 'nodemailer'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { SITE_URL } from '@/lib/siteConfig'

// Logo URL using site URL configuration
const LOGO_URL = `${SITE_URL}/_next/image?url=%2FLogo%2FFull.png&w=640&q=75`

// Email translation types
type EmailTranslationSection = 'cod' | 'supportLink' | 'stripePaymentConfirmation' | 'statusUpdate' | 'welcome' | 'passwordReset' | 'discountAssigned'

/**
 * Load email translations for a given locale and section
 */
function loadEmailTranslations(locale: string, section: EmailTranslationSection): Record<string, any> {
  try {
    let messages: any
    if (locale === 'ar') {
      messages = require('@/messages/ar.json')
    } else if (locale === 'ru') {
      messages = require('@/messages/ru.json')
    } else {
      messages = require('@/messages/en.json')
    }
    
    const translations = messages.default?.orderEmail?.[section] || messages.orderEmail?.[section]
    if (translations) {
      return translations
    }
  } catch (error) {
    errorLog(`Failed to load ${section} translations for locale ${locale}:`, error)
  }
  
  // Fallback to English
  try {
    const enMessages = require('@/messages/en.json')
    return enMessages.default?.orderEmail?.[section] || enMessages.orderEmail?.[section] || {}
  } catch {
    return {}
  }
}

/**
 * Get RTL and text alignment settings for a locale
 */
export function getLocaleSettings(locale: string) {
  const isRTL = locale === 'ar'
  return {
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'right' : 'left',
    textAlignReverse: isRTL ? 'left' : 'right',
    dateLocale: locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE'
  }
}

// TypeScript interfaces for email data
export interface OrderConfirmationEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    productName: string
    quantity: number
    price: number
    image: string
    size?: string
    color?: string
    discountLabel?: string // e.g., "50% OFF" or "15% OFF - Bundle Discount"
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
}

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
    image: string
    size?: string
    color?: string
  }> | undefined
  subtotal?: number | undefined
  shipping?: number | undefined
  vat?: number | undefined
  address?: string | undefined
  emirate?: string | undefined
  deviceType?: string | undefined
  paymentMethod?: string | undefined
  paymentStatus?: 'PAID' | 'PENDING' | 'COD' | undefined
  discountPercentage?: number | undefined
  discountAmount?: number | undefined
}

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
  },
})

// Verify connection configuration
transporter.verify((error, _success) => {
  if (error) {
    debugLog('❌ SMTP connection error:', error)
  } else {
    debugLog('✅ SMTP server is ready to take our messages')
  }
})

// Email templates
export const emailTemplates = {
  // Welcome email for new user registration - Apple style
  welcomeUser: (userName: string, userEmail: string, password?: string, locale: string = 'en') => {
    const t = loadEmailTranslations(locale, 'welcome')
    const { dir, textAlign } = getLocaleSettings(locale)
    const firstName = userName.split(' ')[0]
    const siteUrl = SITE_URL
    const productsUrl = locale === 'en' ? `${siteUrl}/products` : `${siteUrl}/${locale}/products`
    
    return {
    subject: t.subject || 'Welcome to GENOSYS',
    html: `
      <!DOCTYPE html>
      <html lang="${locale}" dir="${dir}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.subject || 'Welcome to GENOSYS'}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
                
                <!-- Logo -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                  </td>
                </tr>
                
                <!-- Main Heading -->
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                      ${(t.greeting || 'Welcome, {firstName}').replace('{firstName}', firstName)}
                    </h1>
                  </td>
                </tr>
                
                <!-- Subheading -->
                <tr>
                  <td style="text-align: center; padding-bottom: 40px;">
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b; letter-spacing: -0.01em;">
                      ${t.accountCreated || 'Your account has been created successfully.'}
                    </p>
                  </td>
                </tr>
                
          ${password ? `
                <!-- Account Details Card -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                      <tr>
                        <td style="padding: 24px;">
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 16px; text-align: ${textAlign};">${t.accountDetails || 'Account Details'}</div>
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f; line-height: 1.6; text-align: ${textAlign};">
                            <div style="margin-bottom: 8px;">
                              <span style="color: #86868b;">${t.email || 'Email:'}</span> <strong>${userEmail}</strong>
          </div>
                            <div>
                              <span style="color: #86868b;">${t.password || 'Password:'}</span> <strong style="font-family: 'SF Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: 0.5px;">${password}</strong>
        </div>
        </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                
                <!-- CTA Button -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <a href="${productsUrl}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px; letter-spacing: -0.01em;">
                      ${t.startShopping || 'Start Shopping'}
                    </a>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                      Genosys Middle East FZ-LLC<br>
                      ${t.officialDistributor || 'Official Distributor in the UAE'}<br><br>
                      ${t.copyright || '© 2026 All rights reserved.'}
        </div>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
    }
  },

  // Order shipped email - Apple style
  orderShipped: (orderData: { orderNumber: string; customerName: string; customerEmail: string; items?: Array<{ productName: string; quantity: number; price: number; image?: string }>; total?: number; customerAddress?: string; customerEmirate?: string }) => ({
    subject: `Your Order Has Shipped`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Shipped</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
                
                <!-- Logo -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                  </td>
                </tr>
                
                <!-- Status Icon -->
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <div style="display: inline-block; width: 64px; height: 64px; background-color: #34c759; border-radius: 50%; line-height: 64px; font-size: 32px;">
                      📦
        </div>
                  </td>
                </tr>
                
                <!-- Main Heading -->
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                      Your Order Has Shipped
                    </h1>
                  </td>
                </tr>
                
                <!-- Order Number -->
                <tr>
                  <td style="text-align: center; padding-bottom: 32px;">
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b;">
                      #${orderData.orderNumber}
                    </span>
                  </td>
                </tr>
                
                <!-- Message -->
                <tr>
                  <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: center; padding-bottom: 32px;">
                    Hi ${orderData.customerName.split(' ')[0]}, your order is on its way and will arrive soon.
                  </td>
                </tr>
                
            ${orderData.total ? `
                <!-- Order Total -->
                <tr>
                  <td style="text-align: center; padding-bottom: 32px;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #86868b;">Order Total</div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 600; color: #1d1d1f; margin-top: 4px;">AED ${orderData.total.toFixed(2)}</div>
                  </td>
                </tr>
            ` : ''}
          
          ${orderData.customerAddress || orderData.customerEmirate ? `
                <!-- Delivery Info -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                      <tr>
                        <td style="padding: 24px;">
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 12px;">Delivering To</div>
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f; line-height: 1.5;">
                            ${orderData.customerAddress || ''}${orderData.customerAddress && orderData.customerEmirate ? '<br>' : ''}${orderData.customerEmirate ? `${orderData.customerEmirate}, UAE` : ''}
          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
          ` : ''}
                
                <!-- CTA Button -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <a href="${SITE_URL}/track/${orderData.orderNumber}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                      View Order
                    </a>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                      Genosys Middle East FZ-LLC<br>
                      Official Distributor in the UAE<br><br>
                      © 2026 All rights reserved.
        </div>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  // Order confirmed email - Apple style
  orderConfirmed: (orderData: { orderNumber: string; customerName: string; customerEmail: string; items?: Array<{ productName: string; quantity: number; price: number; image?: string }>; total?: number }) => ({
    subject: `Order Confirmed`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmed</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
                
                <!-- Logo -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                  </td>
                </tr>
                
                <!-- Status Icon -->
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <div style="display: inline-block; width: 64px; height: 64px; background-color: #0071e3; border-radius: 50%; line-height: 64px; font-size: 32px;">
                      ✓
        </div>
                  </td>
                </tr>
                
                <!-- Main Heading -->
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                      Order Confirmed
                    </h1>
                  </td>
                </tr>
                
                <!-- Order Number -->
                <tr>
                  <td style="text-align: center; padding-bottom: 32px;">
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b;">
                      #${orderData.orderNumber}
                    </span>
                  </td>
                </tr>
                
                <!-- Message -->
                <tr>
                  <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: center; padding-bottom: 32px;">
                    Hi ${orderData.customerName.split(' ')[0]}, we've received your order and it's being processed.
                  </td>
                </tr>
                
            ${orderData.total ? `
                <!-- Order Total -->
                <tr>
                  <td style="text-align: center; padding-bottom: 32px;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #86868b;">Order Total</div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 600; color: #1d1d1f; margin-top: 4px;">AED ${orderData.total.toFixed(2)}</div>
                  </td>
                </tr>
            ` : ''}
                
                <!-- CTA Button -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <a href="${SITE_URL}/track/${orderData.orderNumber}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                      View Order
                    </a>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                      Genosys Middle East FZ-LLC<br>
                      Official Distributor in the UAE<br><br>
                      © 2026 All rights reserved.
        </div>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  // Order delivered email - Apple style
  orderDelivered: (orderData: { orderNumber: string; customerName: string; customerEmail: string; items?: Array<{ productName: string; quantity: number; price: number; image?: string }>; total?: number; locale?: string }) => {
    return {
    subject: `Your Order Has Been Delivered`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Delivered</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
                
                <!-- Logo -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                  </td>
                </tr>
                
                <!-- Status Icon -->
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <div style="display: inline-block; width: 64px; height: 64px; background-color: #34c759; border-radius: 50%; line-height: 64px; font-size: 32px;">
                      ✓
        </div>
                  </td>
                </tr>
                
                <!-- Main Heading -->
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                      Delivered
                    </h1>
                  </td>
                </tr>
                
                <!-- Order Number -->
                <tr>
                  <td style="text-align: center; padding-bottom: 32px;">
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b;">
                      Order #${orderData.orderNumber}
                    </span>
                  </td>
                </tr>
                
                <!-- Message -->
                <tr>
                  <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: center; padding-bottom: 32px;">
                    Hi ${orderData.customerName.split(' ')[0]}, your order has been delivered. We hope you love your products!
                  </td>
                </tr>
                
            ${orderData.total ? `
                <!-- Order Total -->
                <tr>
                  <td style="text-align: center; padding-bottom: 32px;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #86868b;">Order Total</div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 600; color: #1d1d1f; margin-top: 4px;">AED ${orderData.total.toFixed(2)}</div>
                  </td>
                </tr>
            ` : ''}
                
                <!-- CTA Button -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <a href="${SITE_URL}/products" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                      Shop Again
                </a>
              </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                      Genosys Middle East FZ-LLC<br>
                      Official Distributor in the UAE<br><br>
                      © 2026 All rights reserved.
                    </div>
              </td>
                </tr>
                
              </table>
              </td>
            </tr>
          </table>
      </body>
      </html>
    `
    }
  },

  // Discount assignment email - Apple style
  discountAssigned: (discountData: { customerName: string; customerEmail: string; discountType: 'CLINIC' | 'VIP'; discountPercentage: number; locale?: string }) => {
    const discountLabel = discountData.discountPercentage < 50 ? 'VIP' : (discountData.discountType === 'CLINIC' ? 'Clinic Partner' : 'VIP')
    
    return {
    subject: `Your ${discountLabel} Discount is Active`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Discount Activated</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
                
                <!-- Logo -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                  </td>
                </tr>
                
                <!-- Discount Badge -->
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #5e5ce6 0%, #bf5af2 100%); color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 48px; font-weight: 700; padding: 24px 40px; border-radius: 16px; letter-spacing: -0.02em;">
                      ${discountData.discountPercentage}% OFF
        </div>
                  </td>
                </tr>
                
                <!-- Main Heading -->
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                      ${discountLabel} Status Activated
                    </h1>
              </td>
                </tr>
                
                <!-- Message -->
                <tr>
                  <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: center; padding-bottom: 32px;">
                    Hi ${discountData.customerName.split(' ')[0]}, your ${discountLabel} discount is now active on your account. Enjoy ${discountData.discountPercentage}% off on all products.
              </td>
                </tr>
                
                <!-- Info Card -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                      <tr>
                        <td style="padding: 24px;">
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 12px;">How It Works</div>
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f; line-height: 1.6;">
                            Your discount is automatically applied at checkout when you're logged in. No code needed.
                          </div>
              </td>
            </tr>
          </table>
                  </td>
                </tr>
                
                <!-- CTA Button -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <a href="${SITE_URL}/products" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                      Start Shopping
                    </a>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                      Genosys Middle East FZ-LLC<br>
                      Official Distributor in the UAE<br><br>
                      © 2026 All rights reserved.
        </div>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
    }
  },

  // Order confirmation email - Apple style
  orderConfirmation: (orderData: OrderConfirmationEmailData) => {
    const isRTL = orderData.locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    
    // Generate items HTML
    const itemsHTML = orderData.items.map(item => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f7; vertical-align: top;">
          <div style="font-size: 15px; font-weight: 500; color: #1d1d1f; letter-spacing: -0.01em; text-align: ${textAlign};">${item.productName}</div>
          ${item.size || item.color ? `<div style="font-size: 13px; color: #86868b; margin-top: 4px; text-align: ${textAlign};">${item.size ? `Size: ${item.size}` : ''}${item.size && item.color ? ' · ' : ''}${item.color ? `Color: ${item.color}` : ''}</div>` : ''}
          ${item.discountLabel ? `<div style="font-size: 12px; color: #34c759; font-weight: 500; margin-top: 4px; text-align: ${textAlign};">(${item.discountLabel})</div>` : ''}
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #f5f5f7; text-align: center; font-size: 15px; color: #1d1d1f; vertical-align: top;">×${item.quantity}</td>
        <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f7; text-align: ${isRTL ? 'left' : 'right'}; font-size: 15px; color: #1d1d1f; font-weight: 500; vertical-align: top;">AED ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('')
    
    return {
    subject: `Order Confirmation #${orderData.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html lang="${orderData.locale || 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
                
                <!-- Logo -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                  </td>
                </tr>
                
                <!-- Status Icon -->
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <div style="display: inline-block; width: 64px; height: 64px; background-color: #34c759; border-radius: 50%; line-height: 64px; font-size: 32px; color: #ffffff;">
                      ✓
        </div>
                  </td>
                </tr>
                
                <!-- Main Heading -->
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                      Order Confirmed
                    </h1>
                  </td>
                </tr>
                
                <!-- Order Number -->
                <tr>
                  <td style="text-align: center; padding-bottom: 40px;">
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b;">
                      #${orderData.orderNumber}
                    </span>
                  </td>
                </tr>
                
                <!-- Greeting -->
                <tr>
                  <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: ${textAlign}; padding-bottom: 24px;">
                    Hi ${orderData.customerName.split(' ')[0]},<br><br>
                    Thank you for your order. We're preparing it now and will notify you when it ships.
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding: 8px 0 32px 0;">
                    <div style="height: 1px; background-color: #d2d2d7;"></div>
                  </td>
                </tr>
                
                <!-- Items -->
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      ${itemsHTML}
                    </table>
                  </td>
                </tr>
                
                <!-- Summary -->
                <tr>
                  <td style="padding-top: 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">Subtotal</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${orderData.subtotal.toFixed(2)}</td>
                      </tr>
                      ${orderData.discountAmount && orderData.discountAmount > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #34c759; text-align: ${textAlign};">🏷️ Discount${orderData.discountPercentage ? ` (${orderData.discountPercentage}%)` : ''}</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #34c759; font-weight: 500; text-align: ${isRTL ? 'left' : 'right'};">-AED ${orderData.discountAmount.toFixed(2)}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">Shipping</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">${orderData.shipping === 0 ? 'Free' : `AED ${orderData.shipping.toFixed(2)}`}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">VAT (5%)</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${orderData.vat.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 16px 0 8px 0;">
                          <div style="height: 1px; background-color: #d2d2d7;"></div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${textAlign};">Total</td>
                        <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${orderData.total.toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Delivery Info -->
                <tr>
                  <td style="padding-top: 40px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                      <tr>
                        <td style="padding: 24px;">
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 12px; text-align: ${textAlign};">Delivery Details</div>
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f; line-height: 1.5; text-align: ${textAlign};">
                            ${orderData.customerName}<br>
                            ${orderData.address}<br>
                            ${orderData.emirate}, UAE
        </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- CTA Button -->
                <tr>
                  <td style="text-align: center; padding-top: 40px;">
                    <a href="${SITE_URL}/track/${orderData.orderNumber}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                      View Order
                    </a>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding-top: 64px; text-align: center;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                      Genosys Middle East FZ-LLC<br>
                      Official Distributor in the UAE<br><br>
                      © 2026 All rights reserved.
          </div>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
    }
  },

  // Admin notification for new user
  adminNewUser: (
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
  ) => ({
    subject: `New User Registration: ${userName}${registrationMethod ? ` (${registrationMethod})` : ''}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New User Registration</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 30px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">🎉 New User Registration</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 0; font-size: 14px;">Genosys Middle East FZ-LLC</p>
                  </td>
                </tr>
                
                <!-- User Information -->
                <tr>
                  <td style="padding: 30px 20px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">👤 User Information</h2>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${userName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                          <p style="margin: 4px 0 0 0;"><a href="mailto:${userEmail}" style="color: #dc2626; text-decoration: none; font-size: 15px;">${userEmail}</a></p>
                        </td>
                      </tr>
                      ${userPhone ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Phone</p>
                          <p style="margin: 4px 0 0 0;"><a href="tel:${userPhone.replace(/\s/g, '')}" style="color: #111827; text-decoration: none; font-size: 15px;">${userPhone}</a></p>
                        </td>
                      </tr>
                      ` : ''}
                      ${userAddress ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Address</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 14px; line-height: 1.5;">${userAddress}</p>
                        </td>
                      </tr>
                      ` : ''}
                      ${additionalInfo?.age ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Age</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 15px;">${additionalInfo.age} years old</p>
                        </td>
                      </tr>
                      ` : ''}
                      ${additionalInfo?.gender ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Gender</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 15px;">${additionalInfo.gender}</p>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Registration Method</p>
                          <p style="margin: 4px 0 0 0;">
                            <span style="display: inline-block; background-color: ${
                              registrationMethod === 'Google OAuth' ? '#4285f4' :
                              registrationMethod === 'Apple Sign In' ? '#000000' :
                              '#dc2626'
                            }; color: #ffffff; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 600;">
                              ${registrationMethod === 'Google OAuth' ? '🔵 ' : registrationMethod === 'Apple Sign In' ? '🍎 ' : '📧 '}${registrationMethod || 'Email/Password'}
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Registration Time</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 15px;">🕐 ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai', dateStyle: 'full', timeStyle: 'medium' })}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                ${additionalInfo && (additionalInfo.ipAddress || additionalInfo.deviceType) ? `
                <!-- Technical Information -->
                <tr>
                  <td style="padding: 0 20px 30px 20px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">💻 Device & Location</h2>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      ${additionalInfo.ipAddress ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">IP Address</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 14px; font-family: 'Courier New', monospace;">${additionalInfo.ipAddress}</p>
                        </td>
                      </tr>
                      ` : ''}
                      ${additionalInfo.country || additionalInfo.city ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 15px;">
                            📍 ${additionalInfo.city ? `${additionalInfo.city}, ` : ''}${additionalInfo.country || 'Unknown'}
                          </p>
                        </td>
                      </tr>
                      ` : ''}
                      ${additionalInfo.deviceType ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Device Type</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 15px;">
                            ${additionalInfo.deviceType === 'mobile' ? '📱' : additionalInfo.deviceType === 'tablet' ? '📲' : '💻'} ${additionalInfo.deviceType.charAt(0).toUpperCase() + additionalInfo.deviceType.slice(1)}
                          </p>
                        </td>
                      </tr>
                      ` : ''}
                      ${additionalInfo.deviceModel ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Device Model</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 14px;">${additionalInfo.deviceModel}</p>
                        </td>
                      </tr>
                      ` : ''}
                      ${additionalInfo.os ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Operating System</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 14px;">${additionalInfo.os}</p>
                        </td>
                      </tr>
                      ` : ''}
                      ${additionalInfo.browser ? `
                      <tr>
                        <td style="padding: 12px 0;">
                          <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Browser</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 14px;">${additionalInfo.browser}</p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
                ` : ''}
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  // Admin notification for new order
  adminNewOrder: (orderData: AdminNewOrderEmailData) => ({
    subject: `${orderData.paymentStatus === 'PAID' ? 'New Paid Order' : 'New Order'} #${orderData.orderNumber} - ${orderData.customerName} - AED ${orderData.total.toFixed(2)}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>New Order Notification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; line-height: 1.6;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 20px 0;">
          <tr>
            <td align="center" style="padding: 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                    <h1 style="color: #111827; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">Genosys Middle East FZ-LLC</h1>
                    <p style="color: #6b7280; margin: 0; font-size: 14px; font-weight: 500;">New Order Notification</p>
                  </td>
                </tr>
                
                <!-- Order Number Highlight -->
                <tr>
                  <td style="padding: 24px 20px; text-align: center; background-color: #ffffff;">
                    <div style="display: inline-block; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 24px;">
                      <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
                      <p style="margin: 0; color: #111827; font-size: 28px; font-weight: 700; letter-spacing: 1px;">#${orderData.orderNumber}</p>
            </div>
                  </td>
                </tr>
                
                <!-- Payment Status -->
                ${orderData.paymentStatus ? `
                <tr>
                  <td style="padding: 0 20px 20px 20px; text-align: center;">
                    <div style="display: inline-block; background-color: ${orderData.paymentStatus === 'PAID' ? '#dcfce7' : orderData.paymentStatus === 'COD' ? '#fef3c7' : '#dbeafe'}; border: 1px solid ${orderData.paymentStatus === 'PAID' ? '#86efac' : orderData.paymentStatus === 'COD' ? '#fcd34d' : '#93c5fd'}; border-radius: 8px; padding: 12px 24px;">
                      <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Payment Status</p>
                      <p style="margin: 0; color: ${orderData.paymentStatus === 'PAID' ? '#16a34a' : orderData.paymentStatus === 'COD' ? '#d97706' : '#2563eb'}; font-size: 18px; font-weight: 700;">
                        ${orderData.paymentStatus === 'PAID' ? '✅ PAID' : orderData.paymentStatus === 'COD' ? '💵 Cash on Delivery' : '🔗 Awaiting Payment'}
                      </p>
                      ${orderData.paymentMethod ? `<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">via ${orderData.paymentMethod}</p>` : ''}
                    </div>
                  </td>
                </tr>
                ` : ''}
                
                <!-- Order Information -->
                <tr>
                  <td style="padding: 0 20px 20px 20px;">
                    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                      <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 18px; font-weight: 700; text-align: center;">Order Information</h3>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 8px 0; text-align: center;">
                            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Order Time</p>
                            <p style="margin: 0; color: #111827; font-size: 15px; font-weight: 500;">${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; text-align: center;">Customer Name</p>
                            <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 600; text-align: center;">${orderData.customerName}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; text-align: center;">
                            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Email</p>
                            <p style="margin: 0;">
                              <a href="mailto:${orderData.customerEmail}" style="color: #111827; text-decoration: none; font-size: 14px; word-break: break-all;">${orderData.customerEmail}</a>
                            </p>
                          </td>
                        </tr>
            ${orderData.customerPhone ? `
                        <tr>
                          <td style="padding: 12px 0; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Phone</p>
                            <p style="margin: 0;">
                              <a href="tel:${orderData.customerPhone.replace(/\s/g, '')}" style="color: #111827; text-decoration: none; font-size: 15px; font-weight: 500;">${orderData.customerPhone}</a>
                            </p>
                          </td>
                        </tr>
            ` : ''}
            ${orderData.address ? `
                        <tr>
                          <td style="padding: 12px 0; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Delivery Address</p>
                            <p style="margin: 0; color: #111827; font-size: 14px; line-height: 1.5;">${orderData.address}</p>
                          </td>
                        </tr>
            ` : ''}
            ${orderData.orderNotes ? `
                        <tr>
                          <td style="padding: 12px 0; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Order Notes</p>
                            <p style="margin: 0; color: #111827; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${String(orderData.orderNotes).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                          </td>
                        </tr>
            ` : ''}
            ${orderData.emirate ? `
                        <tr>
                          <td style="padding: 12px 0; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Emirate</p>
                            <p style="margin: 0; color: #111827; font-size: 15px; font-weight: 500;">${orderData.emirate}</p>
                          </td>
                        </tr>
            ` : ''}
            ${orderData.deviceType ? `
                        <tr>
                          <td style="padding: 12px 0; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Device Type</p>
                            <p style="margin: 0; color: #111827; font-size: 15px; font-weight: 500;">${orderData.deviceType}</p>
                          </td>
                        </tr>
            ` : ''}
                      </table>
          </div>
                  </td>
                </tr>
        
                <!-- Order Items -->
        ${orderData.items && orderData.items.length > 0 ? `
                <tr>
                  <td style="padding: 0 20px 20px 20px;">
                    <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; overflow-x: auto;">
                      <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 18px; font-weight: 700; text-align: center;">Order Items (${orderData.itemCount} ${orderData.itemCount === 1 ? 'item' : 'items'})</h3>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%; border-collapse: collapse;">
            <thead>
                          <tr style="background-color: #f9fafb;">
                            <th style="padding: 12px 8px; text-align: left; color: #111827; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Product</th>
                            <th style="padding: 12px 8px; text-align: center; color: #111827; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Qty</th>
                            <th style="padding: 12px 8px; text-align: right; color: #111827; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Price</th>
                            <th style="padding: 12px 8px; text-align: right; color: #111827; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items.map(item => `
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                              <td style="padding: 12px 8px; color: #111827; font-size: 14px;">
                                ${item.productName}${item.size ? `<br><span style="color: #6b7280; font-size: 12px;">Size: ${item.size}</span>` : ''}${item.color ? `<br><span style="color: #6b7280; font-size: 12px;">Color: ${item.color}</span>` : ''}
                              </td>
                              <td style="padding: 12px 8px; text-align: center; color: #111827; font-size: 14px; font-weight: 500;">${item.quantity}</td>
                              <td style="padding: 12px 8px; text-align: right; color: #111827; font-size: 14px;">AED ${item.price.toFixed(2)}</td>
                              <td style="padding: 12px 8px; text-align: right; color: #111827; font-size: 14px; font-weight: 600;">AED ${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
                  </td>
                </tr>
                ` : `
                <tr>
                  <td style="padding: 0 20px 20px 20px;">
                    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
                      <h3 style="color: #111827; margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">Order Items</h3>
                      <p style="color: #6b7280; margin: 0; font-size: 14px;">${orderData.itemCount} ${orderData.itemCount === 1 ? 'item' : 'items'} in this order (product details not available)</p>
        </div>
                  </td>
                </tr>
                `}
                
                <!-- Order Summary -->
                <tr>
                  <td style="padding: 0 20px 20px 20px;">
                    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
                      <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 18px; font-weight: 700; text-align: center;">Order Summary</h3>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            ${orderData.subtotal ? `
                        <tr>
                          <td style="padding: 8px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="color: #374151; font-size: 14px;">Subtotal:</td>
                                <td align="right" style="color: #374151; font-size: 14px; font-weight: 500;">AED ${orderData.subtotal.toFixed(2)}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
            ` : ''}
            ${(orderData.discountPercentage && orderData.discountPercentage > 0) || (orderData.discountAmount && orderData.discountAmount > 0) ? `
                        <tr>
                          <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="color: #059669; font-size: 14px; font-weight: 600;">🏷️ Discount${orderData.discountPercentage ? ` (${orderData.discountPercentage}%)` : ''}:</td>
                                <td align="right" style="color: #059669; font-size: 14px; font-weight: 600;">-AED ${orderData.discountAmount ? orderData.discountAmount.toFixed(2) : '0.00'}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
            ` : ''}
            ${orderData.shipping !== undefined ? `
                        <tr>
                          <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="color: #374151; font-size: 14px;">Shipping:</td>
                                <td align="right" style="color: #374151; font-size: 14px; font-weight: 500;">AED ${orderData.shipping.toFixed(2)}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
            ` : ''}
            ${orderData.vat !== undefined ? `
                        <tr>
                          <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="color: #374151; font-size: 14px;">VAT (5%):</td>
                                <td align="right" style="color: #374151; font-size: 14px; font-weight: 500;">AED ${orderData.vat.toFixed(2)}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
            ` : ''}
                        <tr>
                          <td style="padding: 12px 0 0 0; border-top: 2px solid #111827;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="color: #111827; font-size: 20px; font-weight: 700;">Total:</td>
                                <td align="right" style="color: #111827; font-size: 20px; font-weight: 700;">AED ${orderData.total.toFixed(2)}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
            </div>
                  </td>
                </tr>
        
                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 20px 24px 20px; text-align: center;">
          <a href="${SITE_URL}/admin" 
                       style="display: inline-block; background-color: #111827; 
                              color: #ffffff; 
                              padding: 14px 32px; 
                    text-decoration: none; 
                              border-radius: 8px; 
                              font-weight: 600; 
                              font-size: 15px;
                              transition: all 0.3s ease;">
            View Order in Admin Panel
          </a>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }),

  // Password reset email
  blackFridaySale: (userName: string, blogLink: string) => ({
    subject: '✨ BLACK FRIDAY SALE — 20% OFF ✨',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="margin-bottom: 20px;">
            <img src="${SITE_URL}/Logo/Full.png" 
                 alt="Genosys Middle East FZ-LLC" 
                 width="200" 
                 height="auto"
                 style="max-width: 200px; height: auto; margin: 0 auto; display: block; border: 0;" />
          </div>
          <h1 style="color: #dc2626; margin: 0; font-size: 28px;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">Official Genosys distributor in the United Arab Emirates</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px; text-align: center; color: white;">
          <h2 style="color: white; margin: 0 0 10px 0; font-size: 32px;">✨ BLACK FRIDAY SALE ✨</h2>
          <p style="color: white; font-size: 24px; font-weight: bold; margin: 10px 0;">20% OFF</p>
          <p style="color: white; font-size: 18px; margin: 10px 0;">Nov 26th — Nov 28th</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Dear ${(userName || 'Valued Customer').split(' ')[0]},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            This year, we're giving you something special.
          </p>
          <p style="color: #dc2626; font-size: 18px; font-weight: bold; margin: 0 0 20px 0;">
            –20% on ALL GENOSYS products, exclusively for online purchases.
          </p>
        </div>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #dc2626;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 20px;">How to get the discount:</h3>
          <ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Order directly through our official website: <a href="https://www.genosys.ae" style="color: #dc2626; font-weight: bold;">www.genosys.ae</a></li>
            <li>or place your order via Instagram Direct Message: <a href="https://instagram.com/Genosys.UAE" style="color: #dc2626; font-weight: bold;">@Genosys.UAE</a></li>
          </ul>
          <p style="color: #374151; font-size: 14px; margin: 15px 0 0 0; font-weight: bold;">
            No promo codes. No minimum spend.
          </p>
          <p style="color: #374151; font-size: 14px; margin: 5px 0 0 0;">
            Just premium professional skincare — now with a rare Black Friday offer.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${blogLink}" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    color: white; 
                    padding: 15px 40px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;
                    font-size: 16px;">
            Learn More About Black Friday Sale
          </a>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${SITE_URL}/products" 
             style="background: #1f2937; 
                    color: white; 
                    padding: 15px 40px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;
                    font-size: 16px;">
            Shop Now
          </a>
        </div>
        
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 2px solid #dc2626;">
          <p style="color: #dc2626; font-size: 16px; font-weight: bold; margin: 0;">
            💥 Valid for online purchases only.
          </p>
          <p style="color: #374151; font-size: 14px; margin: 10px 0 0 0;">
            Don't miss it — our biggest yearly offer ends Nov 28th.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <div style="margin-bottom: 20px;">
            <img src="${SITE_URL}/Logo/Full.png" 
                 alt="Genosys Middle East FZ-LLC" 
                 width="200" 
                 height="auto"
                 style="max-width: 200px; height: auto; margin: 0 auto; display: block; border: 0;" />
          </div>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Need help? Contact us at <a href="mailto:sales@genosys.ae" style="color: #dc2626;">sales@genosys.ae</a> or <a href="https://wa.me/971585487665" style="color: #dc2626;">+971 58 548 76 65</a>
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            Genosys Middle East FZ-LLC - Official Genosys distributor in the United Arab Emirates
          </p>
        </div>
      </div>
    `
  }),

  // Password reset email - Apple style
  passwordReset: (userName: string, resetToken: string, locale: string = 'en') => {
    const t = loadEmailTranslations(locale, 'passwordReset')
    const { dir, textAlign } = getLocaleSettings(locale)
    const siteUrl = SITE_URL
    const resetUrl = `${siteUrl}/reset-password/${resetToken}`
    const firstName = (userName || 'there').split(' ')[0]
    
    // Localized text
    const headingText = locale === 'ru' ? 'Сброс пароля' : locale === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Your Password'
    const messageText = locale === 'ru' 
      ? `Здравствуйте, ${firstName}, мы получили запрос на сброс вашего пароля. Нажмите кнопку ниже, чтобы создать новый пароль.`
      : locale === 'ar'
      ? `مرحباً ${firstName}، تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. انقر على الزر أدناه لإنشاء كلمة مرور جديدة.`
      : `Hi ${firstName}, we received a request to reset your password. Click the button below to create a new one.`
    const buttonText = t.resetButton || (locale === 'ru' ? 'Сбросить пароль' : locale === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password')
    const expiryText = locale === 'ru' 
      ? '⏱ Эта ссылка действительна <strong>30 минут</strong>'
      : locale === 'ar'
      ? '⏱ تنتهي صلاحية هذا الرابط خلال <strong>30 دقيقة</strong>'
      : '⏱ This link expires in <strong>30 minutes</strong>'
    const securityText = locale === 'ru'
      ? 'Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.<br>Ваш пароль останется без изменений.'
      : locale === 'ar'
      ? 'إذا لم تطلب هذا، يمكنك تجاهل هذا البريد الإلكتروني بأمان.<br>ستبقى كلمة المرور الخاصة بك دون تغيير.'
      : "If you didn't request this, you can safely ignore this email.<br>Your password will remain unchanged."
    
    return {
      subject: t.subject || headingText,
      html: `
        <!DOCTYPE html>
        <html lang="${locale}" dir="${dir}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${headingText}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
                  
                  <!-- Logo -->
                  <tr>
                    <td style="text-align: center; padding-bottom: 48px;">
                      <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                    </td>
                  </tr>
                  
                  <!-- Lock Icon -->
                  <tr>
                    <td style="text-align: center; padding-bottom: 24px;">
                      <div style="display: inline-block; width: 64px; height: 64px; background-color: #f5f5f7; border-radius: 50%; line-height: 64px; font-size: 32px;">
                        🔐
          </div>
                    </td>
                  </tr>
                  
                  <!-- Main Heading -->
                  <tr>
                    <td style="text-align: center; padding-bottom: 12px;">
                      <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                        ${headingText}
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Message -->
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: ${textAlign}; padding-bottom: 32px;">
                      ${messageText}
                    </td>
                  </tr>
                  
                  <!-- CTA Button -->
                  <tr>
                    <td style="text-align: center; padding-bottom: 32px;">
                      <a href="${resetUrl}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                ${buttonText}
              </a>
                    </td>
                  </tr>
                  
                  <!-- Expiry Notice -->
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f;">
                              ${expiryText}
            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Security Notice -->
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #86868b; text-align: ${textAlign}; padding-bottom: 32px; line-height: 1.6;">
                      ${securityText}
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                        Genosys Middle East FZ-LLC<br>
                        ${t.officialDistributor || 'Official Distributor in the UAE'}<br><br>
                        ${t.copyright || '© 2026 All rights reserved.'}
          </div>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    }
  },
}

// Email sending functions
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    debugLog('📧 Attempting to send email to:', to)
    debugLog('📧 Using Gmail service')
    
    // Check if email configuration is set (support both EMAIL_* and GMAIL_* variables)
    const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER
    const emailPassword = process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD
    
    debugLog('📧 Using email user:', emailUser)
    
    if (!emailUser) {
      const errorMsg = 'EMAIL_USER or GMAIL_USER environment variable is not set'
      errorLog('❌', errorMsg)
      return { success: false, error: errorMsg }
    }

    if (!emailPassword) {
      const errorMsg = 'EMAIL_PASSWORD or GMAIL_APP_PASSWORD environment variable is not set'
      errorLog('❌', errorMsg)
      return { success: false, error: errorMsg }
    }
    
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Genosys Middle East FZ-LLC" <${emailUser}>`,
      to,
      subject,
      html,
    }

    debugLog('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasHtml: !!mailOptions.html
    })

    const result = await transporter.sendMail(mailOptions)
    debugLog('✅ Email sent successfully')
    debugLog('✅ Message ID:', result.messageId)
    debugLog('✅ Response:', result.response)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    errorLog('❌ Error sending email')
    errorLog('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error)
    errorLog('❌ Error message:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error && error.stack) {
      errorLog('❌ Error stack:', error.stack)
    }
    // Check for specific nodemailer errors
    // NodemailerError has code and command properties
    interface NodemailerError {
      code?: string
      command?: string
    }
    if (error && typeof error === 'object' && 'code' in error) {
      const smtpError = error as NodemailerError
      errorLog('❌ Error code:', smtpError.code)
      errorLog('❌ Error command:', smtpError.command)
    }
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

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
    // PRODUCTION DEBUG - using console.log to ensure visibility in Vercel logs
    console.log(`📧 Sending order confirmation email to: ${orderData.customerEmail}`)
    console.log(`📧 Order: ${orderData.orderNumber}, Customer: ${orderData.customerName}`)
    console.log(`🎟️ CUSTOMER EMAIL DISCOUNT DATA: discountPercentage=${orderData.discountPercentage}, discountAmount=${orderData.discountAmount}`)
    
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
  // Use ADMIN_EMAIL, or fallback to GMAIL_USER/EMAIL_USER, or use default
  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER || '5856825@gmail.com'
  
  debugLog(`📧 ===== ADMIN NEW USER NOTIFICATION =====`)
  debugLog(`📧 Sending admin new user notification to: ${adminEmail}`)
  debugLog(`📧 User: ${userName} (${userEmail})`)
  debugLog(`📧 Registration method: ${registrationMethod || 'Unknown'}`)
  debugLog(`📧 Additional info:`, additionalInfo)
  debugLog(`📧 Admin email sources - ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'NOT_SET'}, GMAIL_USER: ${process.env.GMAIL_USER || 'NOT_SET'}, EMAIL_USER: ${process.env.EMAIL_USER || 'NOT_SET'}`)
  debugLog(`📧 GMAIL_APP_PASSWORD: ${process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT_SET'}`)
  
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
    // Use provided recipientEmail, or ADMIN_EMAIL, or fallback to GMAIL_USER/EMAIL_USER, or use default
    const adminEmail = recipientEmail || process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER || '5856825@gmail.com'
    
    // PRODUCTION DEBUG - using console.log to ensure visibility in Vercel logs
    console.log(`📧 Sending admin new order notification to: ${adminEmail}`)
    console.log(`📧 Order data for admin notification:`, JSON.stringify({
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      total: orderData.total,
      itemCount: orderData.itemCount,
      discountPercentage: orderData.discountPercentage,
      discountAmount: orderData.discountAmount
    }))
    console.log(`🎟️ ADMIN EMAIL DISCOUNT DATA: discountPercentage=${orderData.discountPercentage}, discountAmount=${orderData.discountAmount}`)
    
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

// Order status update email
export interface OrderStatusUpdateEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
}

// Order HTML generation interfaces
export interface OrderHTMLItem {
  name: string
  quantity: number
  price: number
  image?: string
  total?: number
  size?: string
  color?: string
  discountLabel?: string // e.g., "50% OFF" or "15% OFF - Bundle Discount"
}

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
}

// Order HTML template generation functions - Apple style
export const generateCODOrderHTML = (order: OrderHTMLData, locale: string = 'en', _translations?: any): string => {
  const t = loadEmailTranslations(locale, 'cod')
  const isRTL = locale === 'ar'
  const textAlign = isRTL ? 'right' : 'left'
  const textAlignReverse = isRTL ? 'left' : 'right'
  const firstName = (order.customerName || 'Customer').split(' ')[0]
  
  // Localized labels
  const sizeLabel = t.size || 'Size:'
  const colorLabel = t.color || 'Color:'
  const orderConfirmedText = locale === 'ru' ? 'Заказ подтвержден' : locale === 'ar' ? 'تم تأكيد الطلب' : 'Order Confirmed'
  const codPaymentText = locale === 'ru' ? '💵 Оплата: При получении' : locale === 'ar' ? '💵 الدفع: عند الاستلام' : '💵 Payment: Cash on Delivery'
  const greetingText = locale === 'ru' 
    ? `Здравствуйте, ${firstName},<br><br>Спасибо за ваш заказ. Вы оплатите заказ наличными при получении. Мы уведомим вас, когда он будет отправлен.`
    : locale === 'ar'
    ? `مرحباً ${firstName}،<br><br>شكراً لطلبك. ستدفع نقداً عند الاستلام عند وصول طلبك. سنخبرك عندما يتم شحنه.`
    : `Hi ${firstName},<br><br>Thank you for your order. You'll pay via Cash on Delivery when your order arrives. We'll notify you when it ships.`

  // Generate items HTML
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f7; vertical-align: top;">
        <div style="font-size: 15px; font-weight: 500; color: #1d1d1f; letter-spacing: -0.01em; text-align: ${textAlign};">${item.name}</div>
        ${item.size || item.color ? `<div style="font-size: 13px; color: #86868b; margin-top: 4px; text-align: ${textAlign};">${item.size ? `${sizeLabel} ${item.size}` : ''}${item.size && item.color ? ' · ' : ''}${item.color ? `${colorLabel} ${item.color}` : ''}</div>` : ''}
        ${item.discountLabel ? `<div style="font-size: 12px; color: #34c759; font-weight: 500; margin-top: 4px; text-align: ${textAlign};">(${item.discountLabel})</div>` : ''}
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #f5f5f7; text-align: center; font-size: 15px; color: #1d1d1f; vertical-align: top;">×${item.quantity}</td>
      <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f7; text-align: ${textAlignReverse}; font-size: 15px; color: #1d1d1f; font-weight: 500; vertical-align: top;">AED ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${orderConfirmedText}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
              
              <!-- Logo -->
              <tr>
                <td style="text-align: center; padding-bottom: 48px;">
                  <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                </td>
              </tr>
              
              <!-- Status Icon -->
              <tr>
                <td style="text-align: center; padding-bottom: 24px;">
                  <div style="display: inline-block; width: 64px; height: 64px; background-color: #34c759; border-radius: 50%; line-height: 64px; font-size: 32px; color: #ffffff;">
                    ✓
        </div>
                </td>
              </tr>
              
              <!-- Main Heading -->
              <tr>
                <td style="text-align: center; padding-bottom: 12px;">
                  <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                    ${orderConfirmedText}
                  </h1>
                </td>
              </tr>
              
              <!-- Order Number -->
              <tr>
                <td style="text-align: center; padding-bottom: 40px;">
                  <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b;">
                    #${order.orderNumber}
                  </span>
                </td>
              </tr>
              
              <!-- Greeting -->
              <tr>
                <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: ${textAlign}; padding-bottom: 24px;">
                  ${greetingText}
                </td>
              </tr>
              
              <!-- COD Badge -->
              <tr>
                <td style="padding-bottom: 32px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff3cd; border-radius: 12px;">
                    <tr>
                      <td style="padding: 16px 24px; text-align: center;">
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #856404; font-weight: 500;">
                          ${codPaymentText}
      </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Divider -->
              <tr>
                <td style="padding: 8px 0 32px 0;">
                  <div style="height: 1px; background-color: #d2d2d7;"></div>
                </td>
            </tr>
              
              <!-- Items -->
              <tr>
                <td>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    ${itemsHTML}
                  </table>
                </td>
              </tr>
              
              <!-- Summary -->
              <tr>
                <td style="padding-top: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">${t.subtotal || 'Subtotal'}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${textAlignReverse};">AED ${order.subtotal.toFixed(2)}</td>
                    </tr>
                    ${order.discountAmount && order.discountAmount > 0 ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #34c759; text-align: ${textAlign};">🏷️ ${locale === 'ar' ? 'الخصم' : locale === 'ru' ? 'Скидка' : 'Discount'}${order.discountPercentage ? ` (${order.discountPercentage}%)` : ''}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #34c759; font-weight: 500; text-align: ${textAlignReverse};">-AED ${order.discountAmount.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">${(t.shippingTo || 'Shipping to {emirate}').replace('{emirate}', order.emirate)}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${textAlignReverse};">${order.shippingCost === 0 ? (t.free || 'FREE') : `AED ${order.shippingCost.toFixed(2)}`}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">${t.vat || 'VAT (5%)'}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${textAlignReverse};">AED ${order.vatAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 16px 0 8px 0;">
                        <div style="height: 1px; background-color: #d2d2d7;"></div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${textAlign};">${t.totalLabel || 'Total:'}</td>
                      <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${textAlignReverse};">AED ${order.total.toFixed(2)}</td>
                    </tr>
        </table>
                </td>
              </tr>
              
              <!-- Delivery Info -->
              <tr>
                <td style="padding-top: 40px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                    <tr>
                      <td style="padding: 24px;">
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 12px; text-align: ${textAlign};">${t.deliveryInformation || 'Delivery'}</div>
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f; line-height: 1.5; text-align: ${textAlign};">
                          ${order.customerName}<br>
                          ${order.customerAddress}<br>
                          ${order.emirate}, ${locale === 'ar' ? 'الإمارات' : locale === 'ru' ? 'ОАЭ' : 'UAE'}<br>
                          ${order.customerPhone}
          </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- CTA Button -->
              <tr>
                <td style="text-align: center; padding-top: 40px;">
                  <a href="${SITE_URL}/track/${order.orderNumber}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                    ${locale === 'ru' ? 'Посмотреть заказ' : locale === 'ar' ? 'عرض الطلب' : 'View Order'}
                  </a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding-top: 64px; text-align: center;">
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                    Genosys Middle East FZ-LLC<br>
                    ${t.officialDistributor || 'Official Distributor in the UAE'}<br><br>
                    ${t.copyright || `© ${new Date().getFullYear()} Genosys Middle East FZ-LLC. All rights reserved.`}
        </div>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export const generateSupportLinkOrderHTML = (order: OrderHTMLData, locale: string = 'en', _translations?: any): string => {
  // Apple-style minimalist template - uses hardcoded English text for clean design
  const isRTL = locale === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'
  const textAlign = isRTL ? 'right' : 'left'
  const siteUrl = SITE_URL
  const productsUrl = locale === 'ar' ? `${siteUrl}/ar/products` : `${siteUrl}/products`

  // Apple-style minimalist item rows
  const itemsHTML = order.items.map((item) => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f7; vertical-align: top;">
        <div style="font-size: 15px; font-weight: 500; color: #1d1d1f; letter-spacing: -0.01em; text-align: ${textAlign};">${item.name || 'Product'}</div>
        ${item.size || item.color ? `<div style="font-size: 13px; color: #86868b; margin-top: 4px; text-align: ${textAlign};">${item.size ? `Size: ${item.size}` : ''}${item.size && item.color ? ' · ' : ''}${item.color ? `Color: ${item.color}` : ''}</div>` : ''}
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #f5f5f7; text-align: center; font-size: 15px; color: #1d1d1f; vertical-align: top;">×${item.quantity || 0}</td>
      <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f7; text-align: ${isRTL ? 'left' : 'right'}; font-size: 15px; color: #1d1d1f; font-weight: 500; vertical-align: top;">AED ${(item.total || ((item.price || 0) * (item.quantity || 0))).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${dir}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Request Submitted</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
              
              <!-- Logo -->
              <tr>
                <td style="text-align: center; padding-bottom: 48px;">
                  <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                </td>
              </tr>
              
              <!-- Main Heading -->
              <tr>
                <td style="text-align: center; padding-bottom: 12px;">
                  <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em; line-height: 1.1;">
                    Order Request Submitted
                  </h1>
                </td>
              </tr>
              
              <!-- Order Number -->
              <tr>
                <td style="text-align: center; padding-bottom: 40px;">
                  <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b; letter-spacing: -0.01em;">
                    #${order.orderNumber || 'N/A'}
                  </span>
                </td>
            </tr>
              
              <!-- Greeting -->
              <tr>
                <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: ${textAlign}; padding-bottom: 24px; letter-spacing: -0.01em;">
                  Hi ${(order.customerName || 'Customer').split(' ')[0]},<br><br>
                  Thank you for your order. Our team will review your request and send you a secure payment link shortly.
                </td>
              </tr>
              
              <!-- Divider -->
              <tr>
                <td style="padding: 8px 0 32px 0;">
                  <div style="height: 1px; background-color: #d2d2d7;"></div>
                </td>
              </tr>
              
              <!-- Items Section -->
              <tr>
                <td>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            ${itemsHTML}
        </table>
                </td>
              </tr>
              
              <!-- Summary -->
              <tr>
                <td style="padding-top: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">Subtotal</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${(order.subtotal || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">Shipping</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">${(order.shippingCost || 0) === 0 ? 'Free' : `AED ${(order.shippingCost || 0).toFixed(2)}`}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">VAT (5%)</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${(order.vatAmount || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 16px 0 8px 0;">
                        <div style="height: 1px; background-color: #d2d2d7;"></div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${textAlign}; letter-spacing: -0.01em;">Total</td>
                      <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'}; letter-spacing: -0.01em;">AED ${(order.total || 0).toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Delivery Info -->
              <tr>
                <td style="padding-top: 40px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                    <tr>
                      <td style="padding: 24px;">
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 12px; text-align: ${textAlign};">Delivery Details</div>
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f; line-height: 1.5; text-align: ${textAlign};">
                          ${order.customerName || 'N/A'}<br>
                          ${order.customerAddress || 'N/A'}<br>
                          ${order.emirate || 'N/A'}, UAE<br>
                          ${order.customerPhone || ''}
        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- CTA Button -->
              <tr>
                <td style="padding-top: 40px; text-align: center;">
                  <a href="${productsUrl}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px; letter-spacing: -0.01em;">
                    Continue Shopping
                  </a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding-top: 64px; text-align: center;">
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                    Genosys Middle East FZ-LLC<br>
                    Official Distributor in the UAE<br><br>
                    © 2026 All rights reserved.
        </div>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// Generate Stripe Payment Confirmation Email HTML - Apple style
export const generateStripePaymentConfirmationHTML = (order: OrderHTMLData, locale: string = 'en', _translations?: any): string => {
  const isRTL = locale === 'ar'
  const textAlign = isRTL ? 'right' : 'left'
  const siteUrl = SITE_URL

  // Generate items HTML
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f7; vertical-align: top;">
        <div style="font-size: 15px; font-weight: 500; color: #1d1d1f; letter-spacing: -0.01em; text-align: ${textAlign};">${item.name || 'Product'}</div>
        ${item.size || item.color ? `<div style="font-size: 13px; color: #86868b; margin-top: 4px; text-align: ${textAlign};">${item.size ? `Size: ${item.size}` : ''}${item.size && item.color ? ' · ' : ''}${item.color ? `Color: ${item.color}` : ''}</div>` : ''}
        ${item.discountLabel ? `<div style="font-size: 12px; color: #34c759; font-weight: 500; margin-top: 4px; text-align: ${textAlign};">(${item.discountLabel})</div>` : ''}
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #f5f5f7; text-align: center; font-size: 15px; color: #1d1d1f; vertical-align: top;">×${item.quantity || 0}</td>
      <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f7; text-align: ${isRTL ? 'left' : 'right'}; font-size: 15px; color: #1d1d1f; font-weight: 500; vertical-align: top;">AED ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
              
              <!-- Logo -->
              <tr>
                <td style="text-align: center; padding-bottom: 48px;">
                  <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                </td>
              </tr>
              
              <!-- Status Icon -->
              <tr>
                <td style="text-align: center; padding-bottom: 24px;">
                  <div style="display: inline-block; width: 64px; height: 64px; background-color: #34c759; border-radius: 50%; line-height: 64px; font-size: 32px; color: #ffffff;">
                    ✓
      </div>
                </td>
              </tr>
              
              <!-- Main Heading -->
              <tr>
                <td style="text-align: center; padding-bottom: 12px;">
                  <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                    Payment Confirmed
                  </h1>
                </td>
              </tr>
              
              <!-- Order Number -->
              <tr>
                <td style="text-align: center; padding-bottom: 40px;">
                  <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b;">
                    #${order.orderNumber || 'N/A'}
                  </span>
                </td>
              </tr>
              
              <!-- Greeting -->
              <tr>
                <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: ${textAlign}; padding-bottom: 24px;">
                  Hi ${(order.customerName || 'Customer').split(' ')[0]},<br><br>
                  Your payment was successful. We're preparing your order now and will notify you when it ships.
                </td>
              </tr>
              
              <!-- Payment Badge -->
              <tr>
                <td style="padding-bottom: 32px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #d1fae5; border-radius: 12px;">
                    <tr>
                      <td style="padding: 16px 24px; text-align: center;">
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #065f46; font-weight: 500;">
                          💳 Paid via Stripe
      </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Divider -->
              <tr>
                <td style="padding: 8px 0 32px 0;">
                  <div style="height: 1px; background-color: #d2d2d7;"></div>
                </td>
            </tr>
              
              <!-- Items -->
              <tr>
                <td>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            ${itemsHTML}
        </table>
                </td>
              </tr>
              
              <!-- Summary -->
              <tr>
                <td style="padding-top: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">Subtotal</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${(order.subtotal || 0).toFixed(2)}</td>
                    </tr>
                    ${order.discountAmount && order.discountAmount > 0 ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #34c759; text-align: ${textAlign};">🏷️ Discount${order.discountPercentage ? ` (${order.discountPercentage}%)` : ''}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #34c759; font-weight: 500; text-align: ${isRTL ? 'left' : 'right'};">-AED ${order.discountAmount.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">Shipping</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">${(order.shippingCost || 0) === 0 ? 'Free' : `AED ${(order.shippingCost || 0).toFixed(2)}`}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">VAT (5%)</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${(order.vatAmount || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 16px 0 8px 0;">
                        <div style="height: 1px; background-color: #d2d2d7;"></div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${textAlign};">Total Paid</td>
                      <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${(order.total || 0).toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Delivery Info -->
              <tr>
                <td style="padding-top: 40px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                    <tr>
                      <td style="padding: 24px;">
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 12px; text-align: ${textAlign};">Delivery Details</div>
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f; line-height: 1.5; text-align: ${textAlign};">
                          ${order.customerName || 'N/A'}<br>
                          ${order.customerAddress || 'N/A'}<br>
                          ${order.emirate || 'N/A'}, UAE<br>
                          ${order.customerPhone || ''}
      </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- CTA Button -->
              <tr>
                <td style="text-align: center; padding-top: 40px;">
                  <a href="${siteUrl}/track/${order.orderNumber}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                    View Order
                  </a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding-top: 64px; text-align: center;">
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                    Genosys Middle East FZ-LLC<br>
                    Official Distributor in the UAE<br><br>
                    © 2026 All rights reserved.
        </div>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export const sendOrderStatusUpdate = async (order: { orderNumber: string; customerName: string; customerEmail: string; id?: string; items?: Array<{ productName: string; quantity: number; price: number; image?: string; color?: string; size?: string }>; total?: number; customerAddress?: string; customerEmirate?: string; locale?: string }, newStatus: string): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  try {
    const statusKey = newStatus.toUpperCase()
    
    // Use the new order shipped template for SHIPPED status
    if (statusKey === 'SHIPPED') {
      const template = emailTemplates.orderShipped({
        orderNumber: order.orderNumber || order.id || 'Unknown',
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        ...(order.items ? { items: order.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          ...(item.image ? { image: item.image } : {})
        })) } : {}),
        ...(order.total ? { total: order.total } : {}),
        ...(order.customerAddress ? { customerAddress: order.customerAddress } : {}),
        ...(order.customerEmirate ? { customerEmirate: order.customerEmirate } : {})
      })
      const result = await sendEmail(order.customerEmail, template.subject, template.html)
      
      if (!result.success) {
        errorLog(`❌ Failed to send order shipped email to ${order.customerEmail}:`, result.error)
        return { success: false, error: result.error || 'Unknown error' }
      } else {
        debugLog(`✅ Order shipped email sent successfully to ${order.customerEmail}`)
        return result.messageId 
          ? { success: true, messageId: result.messageId }
          : { success: true }
      }
    }
    
    // Use the new order confirmed template for CONFIRMED status
    if (statusKey === 'CONFIRMED') {
      const template = emailTemplates.orderConfirmed({
        orderNumber: order.orderNumber || order.id || 'Unknown',
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        ...(order.items ? { items: order.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          ...(item.image ? { image: item.image } : {})
        })) } : {}),
        ...(order.total ? { total: order.total } : {})
      })
      const result = await sendEmail(order.customerEmail, template.subject, template.html)
      
      if (!result.success) {
        errorLog(`❌ Failed to send order confirmed email to ${order.customerEmail}:`, result.error)
        return { success: false, error: result.error || 'Unknown error' }
      } else {
        debugLog(`✅ Order confirmed email sent successfully to ${order.customerEmail}`)
        return result.messageId 
          ? { success: true, messageId: result.messageId }
          : { success: true }
      }
    }
    
    // Use the new order delivered template for DELIVERED status
    if (statusKey === 'DELIVERED') {
      const template = emailTemplates.orderDelivered({
        orderNumber: order.orderNumber || order.id || 'Unknown',
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        locale: order.locale || 'en',
        ...(order.items ? { items: order.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          ...(item.image ? { image: item.image } : {})
        })) } : {}),
        ...(order.total ? { total: order.total } : {})
      })
      const result = await sendEmail(order.customerEmail, template.subject, template.html)
      
      if (!result.success) {
        errorLog(`❌ Failed to send order delivered email to ${order.customerEmail}:`, result.error)
        return { success: false, error: result.error || 'Unknown error' }
      } else {
        debugLog(`✅ Order delivered email sent successfully to ${order.customerEmail}`)
        return result.messageId 
          ? { success: true, messageId: result.messageId }
          : { success: true }
      }
    }
    
    const locale = order.locale || 'en'
    
    // Load translations using helper function
    let t: any = loadEmailTranslations(locale, 'statusUpdate')
    
    // If translations are empty, use hardcoded fallback
    if (!t || Object.keys(t).length === 0) {
      errorLog('Failed to load translations for order status update, using fallback')
      // Fallback to English
      try {
        const enMessages = require('@/messages/en.json')
        t = enMessages.default?.orderEmail?.statusUpdate || enMessages.orderEmail?.statusUpdate
      } catch (fallbackError) {
        errorLog('Failed to load fallback translations:', fallbackError)
        // Hardcoded fallback
        t = {
          subject: 'Order Status Update #{orderNumber} - {status} - Genosys Middle East FZ-LLC',
          companyName: 'Genosys Middle East FZ-LLC',
          uae: 'United Arab Emirates <span style="font-size: 0.8em;">❤️</span>',
          dear: 'Dear {customerName},',
          greeting: 'Hope you are doing well. Today is the special day!',
          orderNumber: 'Order Number:',
          status: 'Status:',
          date: 'Date:',
          orderItems: 'Order Items',
          qty: 'Qty:',
          subtotal: 'Subtotal:',
          vat: 'VAT (5%):',
          total: 'Total:',
          vatNote: '*All prices are VAT inclusive (5%)',
          contactQuestion: 'If you have any questions about your order, please contact us now via',
          viewOrderStatus: 'You can view your order status on our website:',
          officialDistributor: 'Genosys Middle East FZ-LLC is the official distributor of GENOSYS professional Korean dermacosmetics in the United Arab Emirates.',
          customerService: 'Customer Service',
          callUs: 'Call us:',
          emailUs: 'Email us:',
          hours: 'Monday to Sunday 9:00 - 21:00',
          businessLocation: 'Business Location',
          locationMap: 'Location Map',
          copyright: '© 2026 Genosys Middle East FZ-LLC. All rights reserved.',
          statusMessages: {
            PROCESSING: 'Your order is being processed and prepared for shipment.',
            CONFIRMED: 'Your order has been confirmed and is being prepared.',
            PAID: 'Your order payment has been confirmed.',
            SHIPPED: 'Your order has been shipped.',
            DELIVERED: 'We appreciate your placing the order with us! ❤️<br>Order {orderNumber} has been delivered successfully!',
            CANCELLED: 'Your order has been cancelled as requested.',
            default: 'Your order status has been updated.'
          }
        }
      }
    }
    
    const isRTL = locale === 'ar'
    const dir = isRTL ? 'rtl' : 'ltr'
    const textAlign = isRTL ? 'right' : 'left'
    const dateLocale = locale === 'ar' ? 'ar-AE' : 'en-AE'
    const orderId = order.orderNumber || order.id || 'Unknown'
    const baseUrl = SITE_URL
    
    // Social media icons removed - using simplified Apple-style footer
    
    // Get status message from translations, with special handling for DELIVERED
    // Note: SHIPPED status is handled above with the new template
    let statusMessage = t.statusMessages[statusKey] || t.statusMessages.default
    if (statusKey === 'DELIVERED') {
      statusMessage = statusMessage.replace('{orderNumber}', orderId)
    }
    // Underline only "shipped" word for SHIPPED status
    if (statusKey === 'SHIPPED') {
      if (locale === 'ru') {
        statusMessage = statusMessage.replace('отправлен', '<span style="text-decoration: underline;">отправлен</span>')
      } else if (locale === 'ar') {
        statusMessage = statusMessage.replace('شحن', '<span style="text-decoration: underline;">شحن</span>')
      } else {
        statusMessage = statusMessage.replace('shipped', '<span style="text-decoration: underline;">shipped</span>')
      }
    }
    
    // Get translated status label for display in email body and subject
    const translatedStatus = t.statusLabels?.[statusKey] || statusKey
    
    // Status-specific styling for Apple design
    const statusStyles: Record<string, { icon: string; color: string; bgColor: string }> = {
      PROCESSING: { icon: '⏳', color: '#ff9500', bgColor: '#fff7ed' },
      CONFIRMED: { icon: '✓', color: '#34c759', bgColor: '#f0fdf4' },
      PAID: { icon: '💳', color: '#34c759', bgColor: '#d1fae5' },
      SHIPPED: { icon: '📦', color: '#0071e3', bgColor: '#eff6ff' },
      DELIVERED: { icon: '✓', color: '#34c759', bgColor: '#f0fdf4' },
      CANCELLED: { icon: '✕', color: '#ff3b30', bgColor: '#fef2f2' },
      default: { icon: 'ℹ', color: '#86868b', bgColor: '#f5f5f7' }
    }
    const style = statusStyles[statusKey] || statusStyles['default']!
    
    // Generate Apple-style items HTML if items are available
    let appleItemsHTML = ''
    if (order.items && order.items.length > 0) {
      const itemRows = order.items.map(item => {
        return `
          <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f7; vertical-align: top;">
              <div style="font-size: 15px; font-weight: 500; color: #1d1d1f; letter-spacing: -0.01em; text-align: ${textAlign};">${item.productName}</div>
              ${item.size || item.color ? `<div style="font-size: 13px; color: #86868b; margin-top: 4px; text-align: ${textAlign};">${item.size ? `Size: ${item.size}` : ''}${item.size && item.color ? ' · ' : ''}${item.color ? `Color: ${item.color}` : ''}</div>` : ''}
                  </td>
            <td style="padding: 16px 12px; border-bottom: 1px solid #f5f5f7; text-align: center; font-size: 15px; color: #1d1d1f; vertical-align: top;">×${item.quantity}</td>
            <td style="padding: 16px 0; border-bottom: 1px solid #f5f5f7; text-align: ${isRTL ? 'left' : 'right'}; font-size: 15px; color: #1d1d1f; font-weight: 500; vertical-align: top;">AED ${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `
      }).join('')
      
      const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const vat = subtotal * (5 / 105)
      
      appleItemsHTML = `
        <!-- Items Section -->
        <tr>
          <td style="padding: 8px 0 32px 0;">
            <div style="height: 1px; background-color: #d2d2d7;"></div>
          </td>
        </tr>
        <tr>
          <td>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              ${itemRows}
            </table>
          </td>
        </tr>
            ${order.total ? `
              <tr>
          <td style="padding-top: 24px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
              <tr>
                <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">Subtotal</td>
                <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">VAT (5%)</td>
                <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${vat.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 16px 0 8px 0;">
                  <div style="height: 1px; background-color: #d2d2d7;"></div>
                      </td>
                    </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${textAlign};">Total</td>
                <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${isRTL ? 'left' : 'right'};">AED ${order.total.toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            ` : ''}
      `
    }
    
    const html = `
      <!DOCTYPE html>
      <html lang="${locale}" dir="${dir}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
                
                <!-- Logo -->
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                  </td>
                </tr>
                
                <!-- Status Icon -->
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <div style="display: inline-block; width: 64px; height: 64px; background-color: ${style.color}; border-radius: 50%; line-height: 64px; font-size: 32px; color: #ffffff;">
                      ${style.icon}
          </div>
                  </td>
                </tr>
                
                <!-- Main Heading -->
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                      Order ${translatedStatus}
                    </h1>
                </td>
                </tr>
                
                <!-- Order Number -->
                <tr>
                  <td style="text-align: center; padding-bottom: 40px;">
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b;">
                      #${orderId}
                    </span>
                </td>
                </tr>
                
                <!-- Greeting -->
                <tr>
                  <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: ${textAlign}; padding-bottom: 24px;">
                    Hi ${order.customerName.split(' ')[0]},<br><br>
                    ${statusMessage}
                </td>
                </tr>
                
                <!-- Status Badge -->
                <tr>
                  <td style="padding-bottom: 32px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${style.bgColor}; border-radius: 12px;">
                      <tr>
                        <td style="padding: 20px 24px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #86868b; text-align: ${textAlign};">Status</td>
                              <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: ${style.color}; font-weight: 600; text-align: ${isRTL ? 'left' : 'right'};">${translatedStatus}</td>
                            </tr>
                            <tr>
                              <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #86868b; padding-top: 12px; text-align: ${textAlign};">Updated</td>
                              <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f; padding-top: 12px; text-align: ${isRTL ? 'left' : 'right'};">${new Date().toLocaleDateString(dateLocale, { timeZone: 'Asia/Dubai', day: 'numeric', month: 'short', year: 'numeric' })}</td>
              </tr>
            </table>
                </td>
                      </tr>
                    </table>
                </td>
                </tr>
                
                ${appleItemsHTML}
                
                <!-- CTA Button -->
                <tr>
                  <td style="text-align: center; padding-top: 40px;">
                    <a href="${baseUrl}/track/${order.orderNumber}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                      View Order
                  </a>
                </td>
              </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding-top: 64px; text-align: center;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                      Genosys Middle East FZ-LLC<br>
                      Official Distributor in the UAE<br><br>
                      © 2026 All rights reserved.
                    </div>
              </td>
            </tr>
                
              </table>
              </td>
            </tr>
          </table>
      </body>
      </html>
    `
    
    // Use translated status label (already calculated above)
    const subject = t.subject.replace('{orderNumber}', orderId).replace('{status}', translatedStatus)
    
    debugLog(`📧 Sending order status update email to: ${order.customerEmail}`)
    // No attachments - using direct URLs like footer logo
    const result = await sendEmail(order.customerEmail, subject, html)
    
    if (!result.success) {
      errorLog(`❌ Failed to send order status update email to ${order.customerEmail}:`, result.error)
      return { success: false, error: result.error || 'Unknown error' }
    } else {
      debugLog(`✅ Order status update email sent successfully to ${order.customerEmail}`)
      return result.messageId 
        ? { success: true, messageId: result.messageId }
        : { success: true }
    }
  } catch (error) {
    errorLog('Error sending order status update email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}

