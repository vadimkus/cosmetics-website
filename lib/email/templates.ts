/**
 * Email Templates
 * All email template definitions (HTML generation)
 */
import { SITE_URL } from '@/lib/siteConfig'
import { loadEmailTranslations, getLocaleSettings, LOGO_URL, renderEmailFooter } from './utils'
import type { OrderConfirmationEmailData, AdminNewOrderEmailData } from './types'
import { orderChannelLabel } from '@/lib/orderChannel'

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
                ${renderEmailFooter(locale)}
                
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
                
                <!-- Corporate footer (shared: support + links + legal/TRN) -->
                ${renderEmailFooter('en')}
                
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
                
                <!-- Corporate footer (shared: support + links + legal/TRN) -->
                ${renderEmailFooter('en')}
                
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
                
                <!-- Corporate footer (shared: support + links + legal/TRN) -->
                ${renderEmailFooter(orderData.locale || 'en', { trackUrl: `${SITE_URL}/track/${orderData.orderNumber}` })}
                
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
                
                <!-- Corporate footer (shared: support + links + legal/TRN) -->
                ${renderEmailFooter('en')}
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
    }
  },

  // Order confirmation email - Apple style (unified format)
  orderConfirmation: (orderData: OrderConfirmationEmailData) => {
    const locale = orderData.locale || 'en'
    const t = loadEmailTranslations(locale, 'cod')
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const textAlignReverse = isRTL ? 'left' : 'right'
    
    // Count paid items and free items
    const paidItems = orderData.items.filter(item => item.price > 0 && !item.productName.toLowerCase().includes('(free)'))
    const freeItems = orderData.items.filter(item => item.price === 0 || item.productName.toLowerCase().includes('(free)'))
    const paidItemCount = paidItems.reduce((sum, item) => sum + item.quantity, 0)
    const freeItemCount = freeItems.reduce((sum, item) => sum + item.quantity, 0)

    const userDiscountPct = orderData.discountPercentage || 0
    const orderBundleDiscountPct = orderData.bundleDiscountPercentage || 0
    const hasUserDiscount = userDiscountPct > 0
    const hasOrderBundleDiscount = orderBundleDiscountPct > 0

    const BEAUTY_BOX_PRICES: Record<string, number> = {
      'problem skin care beauty box': 1318, 'skin brightening beauty box': 1496,
      'charming look beauty box': 1520, 'anti-aging beauty box': 1390,
      'deep moisturizing beauty box': 1318, 'sensitive skin beauty box': 1696,
    }
    const BEAUTY_BOX_DISC = 15
    const getBBOriginal = (name: string): number | null => {
      const n = (name || '').trim().toLowerCase()
      for (const [k, p] of Object.entries(BEAUTY_BOX_PRICES)) { if (n.includes(k)) return p }
      return null
    }
    const isFixedPrice = (name: string): boolean => {
      const n = (name || '').trim().toLowerCase()
      if (n.includes('hydro') && n.includes('cool') && n.includes('mask')) return true
      if (n.includes('genoled') || n.includes('gentron') || n.includes('hairgen')) return true
      return false
    }

    const itemsHTML = orderData.items.map(item => {
      const isFreeItem = item.price === 0 || item.productName.toLowerCase().includes('(free)')
      const bbOriginal = getBBOriginal(item.productName)
      const isBeautyBox = bbOriginal !== null
      const isFixed = isFixedPrice(item.productName)

      // Per-item bundle discount takes priority over order-level inference
      const itemBundlePct = item.bundleDiscount ?? null
      const isItemBundle = itemBundlePct !== null && itemBundlePct > 0
      
      let originalPrice = item.price
      let totalDiscountPct = 0
      let showDiscount = false
      let discountType: 'beauty_box' | 'bundle' | 'vip' | null = null

      if (isBeautyBox && bbOriginal) {
        originalPrice = bbOriginal
        totalDiscountPct = BEAUTY_BOX_DISC
        showDiscount = true
        discountType = 'beauty_box'
      } else if (!isFixed && !isFreeItem) {
        if (isItemBundle) {
          originalPrice = originalPrice / (1 - itemBundlePct / 100)
          showDiscount = true
          discountType = 'bundle'
        } else if (hasOrderBundleDiscount && !isItemBundle && itemBundlePct === null) {
          originalPrice = originalPrice / (1 - orderBundleDiscountPct / 100)
          showDiscount = true
          discountType = 'bundle'
        } else if (hasUserDiscount) {
          originalPrice = originalPrice / (1 - userDiscountPct / 100)
          showDiscount = true
          discountType = 'vip'
        }
        totalDiscountPct = showDiscount ? Math.round((1 - item.price / originalPrice) * 100) : 0
      }
      
      const hasDiscount = showDiscount && !isFreeItem
      const itemTotal = item.price * item.quantity
      const originalTotal = originalPrice * item.quantity
      
      const discountBadges = []
      if (discountType === 'beauty_box') {
        discountBadges.push(`<span style="display: inline-block; background: #fff7ed; color: #c2410c; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-${isRTL ? 'left' : 'right'}: 4px;">-${BEAUTY_BOX_DISC}% Box</span>`)
      } else if (!isFixed && !isFreeItem) {
        if (discountType === 'bundle') {
          discountBadges.push(`<span style="display: inline-block; background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px;">-${totalDiscountPct}% Bundle</span>`)
        } else if (discountType === 'vip') {
          discountBadges.push(`<span style="display: inline-block; background: #f3e8ff; color: #9333ea; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-${isRTL ? 'left' : 'right'}: 4px;">-${userDiscountPct}% VIP</span>`)
        }
      }
      
      const priceDisplay = isFreeItem 
        ? `<span style="color: #34c759; font-weight: 600;">${t.free || 'FREE'}</span>`
        : hasDiscount
          ? `<div style="text-align: ${textAlignReverse};">
              <span style="color: #9ca3af; text-decoration: line-through; font-size: 13px;">AED ${originalTotal.toFixed(2)}</span>
              <br/>
              <span style="color: #16a34a; font-weight: 600;">AED ${itemTotal.toFixed(2)}</span>
            </div>`
          : `AED ${itemTotal.toFixed(2)}`
      
      const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${SITE_URL}${item.image}`) : ''
      
      // Qty + size/color combined line (matching success page: "Quantity: 1 • 180ml")
      const detailParts: string[] = [`${t.qty || 'Quantity'}: ${item.quantity}`]
      if (item.size) detailParts.push(item.size)
      if (item.color) detailParts.push(item.color)
      const detailLine = detailParts.join(' • ')
      
      return `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f7; vertical-align: top;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              ${imageUrl ? `<td style="width: 56px; vertical-align: top; padding-${isRTL ? 'left' : 'right'}: 12px;">
                <img src="${imageUrl}" alt="${item.productName}" width="56" height="56" style="width: 56px; height: 56px; object-fit: contain; border-radius: 8px; background-color: #f9fafb; display: block;" />
              </td>` : ''}
              <td style="vertical-align: top;">
                <div style="font-size: 14px; font-weight: 700; color: #1d1d1f; text-transform: uppercase; letter-spacing: 0.02em; text-align: ${textAlign}; line-height: 1.3;">${item.productName}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 3px; text-align: ${textAlign};">${detailLine}</div>
                ${discountBadges.length > 0
                  ? `<div style="margin-top: 4px; text-align: ${textAlign};">${discountBadges.join('')}</div>`
                  : totalDiscountPct > 0
                    ? `<div style="font-size: 12px; font-weight: 700; color: #16a34a; margin-top: 2px; text-align: ${textAlign};">(${totalDiscountPct}% OFF)</div>`
                    : ''}
              </td>
              <td style="text-align: ${textAlignReverse}; vertical-align: top; white-space: nowrap; padding-${isRTL ? 'right' : 'left'}: 12px;">${priceDisplay}</td>
            </tr>
          </table>
        </td>
      </tr>
    `}).join('')
    
    const subjectText = (t.subject || 'Order Confirmation #{orderNumber} - GENOSYS Professional').replace('{orderNumber}', orderData.orderNumber)
    
    return {
    subject: subjectText,
    html: `
      <!DOCTYPE html>
      <html lang="${locale}" dir="${isRTL ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.orderConfirmed || 'Order Confirmed'}</title>
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
                      ${t.orderConfirmed || 'Order Confirmed'}
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
                    ${(t.greeting || 'Hi {firstName},').replace('{firstName}', orderData.customerName.split(' ')[0])}<br><br>
                    ${t.greetingMessage || "Thank you for your order. We're preparing it now and will notify you when it ships."}
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
                
                <!-- Summary - Waterfall Discount Breakdown -->
                ${(() => {
                  const _hasUserDiscount = (orderData.discountAmount || 0) > 0
                  const _hasBundleDiscount = (orderData.bundleDiscountAmount || 0) > 0
                  const _hasAnyDiscount = _hasUserDiscount || _hasBundleDiscount
                  const _retailTotal = orderData.subtotal + (orderData.discountAmount || 0) + (orderData.bundleDiscountAmount || 0)
                  const _afterVipSubtotal = _retailTotal - (orderData.discountAmount || 0)
                  const _totalSaved = (orderData.discountAmount || 0) + (orderData.bundleDiscountAmount || 0)
                  
                  return `<tr>
                  <td style="padding-top: 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
                      ${_hasAnyDiscount ? `
                      <!-- Retail Price (original before discounts) -->
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">
                          ${t.retailPrice || 'Retail Price'}: (${paidItemCount} ${paidItemCount === 1 ? (t.item || 'item') : (t.items || 'items')})
                          ${freeItemCount > 0 ? `<br><span style="color: #34c759;">+ ${freeItemCount} ${t.free || 'free'} ${freeItemCount === 1 ? (t.mask || 'mask') : (t.masks || 'masks')}</span>` : ''}
                        </td>
                        <td style="padding: 8px 0; font-size: 15px; color: #9ca3af; font-weight: 500; text-align: ${textAlignReverse}; vertical-align: top; text-decoration: line-through;">AED ${_retailTotal.toFixed(2)}</td>
                      </tr>
                      ` : `
                      <!-- Subtotal (no discounts) -->
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">
                          ${t.subtotal || 'Subtotal'}: (${paidItemCount} ${paidItemCount === 1 ? (t.item || 'item') : (t.items || 'items')})
                          ${freeItemCount > 0 ? `<br><span style="color: #34c759;">+ ${freeItemCount} ${t.free || 'free'} ${freeItemCount === 1 ? (t.mask || 'mask') : (t.masks || 'masks')}</span>` : ''}
                        </td>
                        <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 500; text-align: ${textAlignReverse}; vertical-align: top;">AED ${orderData.subtotal.toFixed(2)}</td>
                      </tr>
                      `}
                      ${_hasUserDiscount ? `
                      <!-- VIP Discount -->
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #9b5de5; text-align: ${textAlign};">🏷️ ${t.yourDiscount || 'Your Discount'}${orderData.discountPercentage ? ` (${orderData.discountPercentage}%)` : ''}</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #9b5de5; font-weight: 500; text-align: ${textAlignReverse};">-AED ${(orderData.discountAmount || 0).toFixed(2)}</td>
                      </tr>
                      ` : ''}
                      ${_hasUserDiscount && _hasBundleDiscount ? `
                      <!-- Intermediate Subtotal (after VIP, before bundle) -->
                      <tr>
                        <td style="padding: 4px 0; font-size: 13px; color: #9ca3af; text-align: ${textAlign};">${t.subtotal || 'Subtotal'}</td>
                        <td style="padding: 4px 0; font-size: 13px; color: #9ca3af; font-weight: 500; text-align: ${textAlignReverse};">AED ${_afterVipSubtotal.toFixed(2)}</td>
                      </tr>
                      ` : ''}
                      ${_hasBundleDiscount ? `
                      <!-- Bundle Discount -->
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #16a34a; text-align: ${textAlign};">📦 ${t.bundleDiscount || 'Bundle Discount'}${orderData.bundleDiscountPercentage ? ` (${orderData.bundleDiscountPercentage}%)` : ''}</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #16a34a; font-weight: 500; text-align: ${textAlignReverse};">-AED ${(orderData.bundleDiscountAmount || 0).toFixed(2)}</td>
                      </tr>
                      ` : ''}
                      ${_hasAnyDiscount ? `
                      <!-- Net Subtotal separator -->
                      <tr>
                        <td colspan="2" style="padding: 4px 0;">
                          <div style="height: 1px; background-color: #e5e7eb;"></div>
                        </td>
                      </tr>
                      <!-- Net Subtotal -->
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 600; text-align: ${textAlign};">${t.netSubtotal || 'Net Subtotal'}</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 600; text-align: ${textAlignReverse};">AED ${orderData.subtotal.toFixed(2)}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">🚚 ${(t.shippingTo || 'Shipping to {emirate}').replace('{emirate}', orderData.emirate)}</td>
                        <td style="padding: 8px 0; font-size: 15px; text-align: ${textAlignReverse}; font-weight: 500; ${orderData.shipping === 0 ? 'color: #34c759;' : 'color: #1d1d1f;'}">${orderData.shipping === 0 ? (t.free || 'FREE') : `AED ${orderData.shipping.toFixed(2)}`}</td>
                      </tr>
                      ${(orderData.loyaltyDiscountAmount || 0) > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #0071e3; font-weight: 500; text-align: ${textAlign};">★ GENOSYS Rewards (${(orderData.loyaltyPointsRedeemed || 0).toLocaleString('en-US')} pts)</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #0071e3; font-weight: 500; text-align: ${textAlignReverse};">-AED ${(orderData.loyaltyDiscountAmount || 0).toFixed(2)}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">${t.vat || 'VAT (5%)'}</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 500; text-align: ${textAlignReverse};">AED ${orderData.vat.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 8px 0;">
                          <div style="background-color: #fef3c7; border-radius: 6px; padding: 8px 12px; text-align: center;">
                            <span style="font-size: 13px; color: #d97706;">${t.allPricesIncludeVat || 'All prices include 5% VAT'}</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 16px 0 8px 0;">
                          <div style="height: 2px; background-color: #1d1d1f;"></div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #1d1d1f; text-align: ${textAlign};">${t.totalLabel || 'Total:'}</td>
                        <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #dc2626; text-align: ${textAlignReverse};">AED ${orderData.total.toFixed(2)}</td>
                      </tr>
                      ${_hasAnyDiscount ? `
                      <!-- You Saved -->
                      <tr>
                        <td colspan="2" style="padding: 12px 0 0 0;">
                          <div style="background-color: #dcfce7; border-radius: 8px; padding: 10px 16px; text-align: center;">
                            <span style="font-size: 14px; color: #16a34a; font-weight: 600;">💰 ${t.youSaved || 'You saved'}: AED ${_totalSaved.toFixed(2)}</span>
                          </div>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>`
                })()}
                
                <!-- Delivery Info -->
                <tr>
                  <td style="padding-top: 40px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                      <tr>
                        <td style="padding: 24px;">
                          <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 12px; text-align: ${textAlign};">${t.deliveryDetails || 'Delivery Details'}</div>
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
                    <a href="${SITE_URL}/${locale === 'en' ? '' : locale + '/'}track/${orderData.orderNumber}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                      ${t.viewOrder || 'View Order'}
                    </a>
                  </td>
                </tr>
                
                <!-- Corporate footer (shared: support + links + legal/TRN) -->
                ${renderEmailFooter(locale, { trackUrl: `${SITE_URL}/${locale === 'en' ? '' : locale + '/'}track/${orderData.orderNumber}` })}
                
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
  adminNewOrder: (orderData: AdminNewOrderEmailData) => {
    // Partner settlement wording, derived from paymentMethod. Handles both
    // labelled strings ("Partner — CREDIT 30 DAYS (due 15/08/2026)") and raw
    // stored methods ("partner_credit") so resends stay consistent.
    const pm = String(orderData.paymentMethod || '')
    const pmLower = pm.toLowerCase()
    const isConsignment = pmLower.includes('consignment')
    const isPartner = pmLower.includes('partner')
    const isCredit = pmLower.includes('credit')
    const creditMatch = pm.match(/credit\s*(\d+)\s*days?\s*(\(due[^)]*\))?/i)
    const partnerSettlement = pmLower.includes('online')
      ? 'Online card payment'
      : isCredit
        ? creditMatch
          ? `Credit ${creditMatch[1]} days ${creditMatch[2] || ''}`.trim()
          : 'Credit terms — payment due per agreement'
        : 'Cash on delivery'
    const subjectTag = isConsignment
      ? '🏬 PARTNER CONSIGNMENT'
      : isPartner && isCredit
        ? '💳 PARTNER CREDIT'
        : isPartner
          ? '🤝 PARTNER ORDER'
          : orderData.paymentStatus === 'PAID' ? 'New Paid Order' : 'New Order'
    return {
    subject: `${subjectTag} #${orderData.orderNumber} - ${orderData.customerName} - AED ${orderData.total.toFixed(2)}`,
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

                <!-- Partner order banner (only for partner-portal orders) -->
                ${isConsignment ? `
                <tr>
                  <td style="background-color: #b45309; padding: 18px 20px; text-align: center;">
                    <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: 1px;">🏬 PARTNER CONSIGNMENT</p>
                    <p style="margin: 6px 0 0 0; color: #fef3c7; font-size: 13px; font-weight: 600;">Add to consignment stock · Same-day delivery · Settle via monthly sales report — NO invoice payment due now</p>
                  </td>
                </tr>
                ` : isPartner && isCredit ? `
                <tr>
                  <td style="background-color: #1d4ed8; padding: 18px 20px; text-align: center;">
                    <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: 1px;">💳 PARTNER CREDIT</p>
                    <p style="margin: 6px 0 0 0; color: #dbeafe; font-size: 13px; font-weight: 600;">Placed via Partner Portal · Priority handling · Same-day delivery · ${partnerSettlement}</p>
                  </td>
                </tr>
                ` : isPartner ? `
                <tr>
                  <td style="background-color: #dc2626; padding: 18px 20px; text-align: center;">
                    <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 800; letter-spacing: 1px;">🤝 PARTNER ORDER</p>
                    <p style="margin: 6px 0 0 0; color: #fee2e2; font-size: 13px; font-weight: 600;">Placed via Partner Portal · Priority handling · Same-day delivery · ${partnerSettlement}</p>
                  </td>
                </tr>
                ` : ''}
                
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

                <!-- Order Source (ADMIN ONLY — app vs website) -->
                ${orderData.orderSource ? `
                <tr>
                  <td style="padding: 0 20px 20px 20px; text-align: center;">
                    <div style="display: inline-block; background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 10px 24px;">
                      <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Order Source</p>
                      <p style="margin: 0; color: #6d28d9; font-size: 16px; font-weight: 700;">${orderChannelLabel(orderData.orderSource)}</p>
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
                            <th style="padding: 12px 8px; text-align: right; color: #111827; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                const userDiscountPct = orderData.discountPercentage || 0
                const orderBundleDiscPct = orderData.bundleDiscountPercentage || 0
                const hasUserDiscount = userDiscountPct > 0
                const hasOrderBundleDiscount = orderBundleDiscPct > 0
                
                const BB_PRICES: Record<string, number> = {
                  'problem skin care beauty box': 1318, 'skin brightening beauty box': 1496,
                  'charming look beauty box': 1520, 'anti-aging beauty box': 1390,
                  'deep moisturizing beauty box': 1318, 'sensitive skin beauty box': 1696,
                }
                const BB_DISC = 15
                const getBBOrig = (name: string): number | null => {
                  const n = (name || '').trim().toLowerCase()
                  for (const [k, p] of Object.entries(BB_PRICES)) { if (n.includes(k)) return p }
                  return null
                }
                const isFixed = (name: string): boolean => {
                  const n = (name || '').trim().toLowerCase()
                  if (n.includes('hydro') && n.includes('cool') && n.includes('mask')) return true
                  if (n.includes('genoled') || n.includes('gentron') || n.includes('hairgen')) return true
                  return false
                }
                
                return orderData.items.map(item => {
                  const isFreeItem = item.price === 0 || item.productName.toLowerCase().includes('(free)')
                  const bbOriginal = getBBOrig(item.productName)
                  const isBeautyBox = bbOriginal !== null
                  const isFixedItem = isFixed(item.productName)

                  const itemBundlePct = item.bundleDiscount ?? null
                  const isItemBundle = itemBundlePct !== null && itemBundlePct > 0
                  
                  let originalPrice = item.price
                  let totalDiscountPct = 0
                  let showDiscount = false
                  let discountType: 'beauty_box' | 'bundle' | 'vip' | null = null

                  if (isBeautyBox && bbOriginal) {
                    originalPrice = bbOriginal
                    totalDiscountPct = BB_DISC
                    showDiscount = true
                    discountType = 'beauty_box'
                  } else if (!isFixedItem && !isFreeItem) {
                    if (isItemBundle) {
                      originalPrice = originalPrice / (1 - itemBundlePct / 100)
                      showDiscount = true
                      discountType = 'bundle'
                    } else if (hasOrderBundleDiscount && !isItemBundle && itemBundlePct === null) {
                      originalPrice = originalPrice / (1 - orderBundleDiscPct / 100)
                      showDiscount = true
                      discountType = 'bundle'
                    } else if (hasUserDiscount) {
                      originalPrice = originalPrice / (1 - userDiscountPct / 100)
                      showDiscount = true
                      discountType = 'vip'
                    }
                    totalDiscountPct = showDiscount ? Math.round((1 - item.price / originalPrice) * 100) : 0
                  }
                  
                  const hasDiscount = showDiscount && !isFreeItem
                  const itemTotal = item.price * item.quantity
                  const originalTotal = originalPrice * item.quantity
                  
                  const discountBadges: string[] = []
                  if (discountType === 'beauty_box') {
                    discountBadges.push(`<span style="display: inline-block; background: #fff7ed; color: #c2410c; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">-${BB_DISC}% Box</span>`)
                  } else if (!isFixedItem && !isFreeItem) {
                    if (discountType === 'bundle') {
                      discountBadges.push(`<span style="display: inline-block; background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">-${totalDiscountPct}% Bundle</span>`)
                    } else if (discountType === 'vip') {
                      discountBadges.push(`<span style="display: inline-block; background: #f3e8ff; color: #9333ea; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">-${userDiscountPct}% VIP</span>`)
                    }
                  }
                  
                  const totalDisplay = isFreeItem ? '<span style="color: #059669; font-weight: 700;">FREE</span>' : hasDiscount
                    ? `<span style="color: #9ca3af; text-decoration: line-through; font-size: 12px;">AED ${originalTotal.toFixed(2)}</span><br><span style="color: #16a34a; font-weight: 700;">AED ${itemTotal.toFixed(2)}</span>`
                    : `AED ${itemTotal.toFixed(2)}`
                  
                  const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${SITE_URL}${item.image}`) : ''
                  
                  // Detail line: size + color
                  const details: string[] = []
                  if (item.size) details.push(`Size: ${item.size}`)
                  if (item.color) details.push(`Color: ${item.color}`)
                  
                  return `
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                              <td style="padding: 12px 8px; color: #111827; font-size: 14px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                  <tr>
                                    ${imageUrl ? `<td style="width: 48px; vertical-align: top; padding-right: 10px;">
                                      <img src="${imageUrl}" alt="${item.productName}" width="48" height="48" style="width: 48px; height: 48px; object-fit: contain; border-radius: 6px; background-color: #f9fafb; display: block;" />
                                    </td>` : ''}
                                    <td style="vertical-align: top;">
                                      <div style="font-weight: 600; text-transform: uppercase; font-size: 13px;">${item.productName}</div>
                                      ${details.length > 0 ? `<div style="color: #6b7280; font-size: 12px; margin-top: 2px;">${details.join(' · ')}</div>` : ''}
                                      ${discountBadges.length > 0
                                        ? `<div style="margin-top: 3px;">${discountBadges.join('')}</div>`
                                        : totalDiscountPct > 0
                                          ? `<div style="color: #16a34a; font-size: 12px; font-weight: 700; margin-top: 2px;">(${totalDiscountPct}% OFF)</div>`
                                          : ''}
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td style="padding: 12px 8px; text-align: center; color: #111827; font-size: 14px; font-weight: 500;">${item.quantity}</td>
                              <td style="padding: 12px 8px; text-align: right; font-size: 14px; vertical-align: top;">${totalDisplay}</td>
                </tr>
                `}).join('')
              })()}
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
                                <td style="color: #374151; font-size: 14px;">Subtotal: (${orderData.itemCount} ${orderData.itemCount === 1 ? 'item' : 'items'})</td>
                                <td align="right" style="color: #374151; font-size: 14px; font-weight: 500;">AED ${orderData.subtotal.toFixed(2)}</td>
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
                                <td style="color: #374151; font-size: 14px;">🚚 Shipping${orderData.emirate ? ` to ${orderData.emirate}` : ''}:</td>
                                <td align="right" style="font-size: 14px; font-weight: 500; ${orderData.shipping === 0 ? 'color: #059669;' : 'color: #374151;'}">${orderData.shipping === 0 ? 'FREE' : `AED ${orderData.shipping.toFixed(2)}`}</td>
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
                        <tr>
                          <td style="padding: 8px 0;">
                            <div style="background-color: #fef3c7; border-radius: 6px; padding: 8px 12px; text-align: center;">
                              <span style="font-size: 12px; color: #d97706;">All prices include 5% VAT</span>
                            </div>
                          </td>
                        </tr>
            ` : ''}
                        <tr>
                          <td style="padding: 12px 0 0 0; border-top: 2px solid #111827;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="color: #111827; font-size: 20px; font-weight: 700;">Total:</td>
                                <td align="right" style="color: #dc2626; font-size: 20px; font-weight: 700;">AED ${orderData.total.toFixed(2)}</td>
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
    }
  },

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
    const linkFallbackText = locale === 'ru'
      ? 'Кнопка не работает? Скопируйте и вставьте эту ссылку в браузер (или в приложение):'
      : locale === 'ar'
      ? 'الزر لا يعمل؟ انسخ هذا الرابط والصقه في المتصفح (أو في التطبيق):'
      : "Button not working? Copy and paste this link into your browser (or the app):"
    
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
                  
                  <!-- Plain link fallback (button-less email clients + copy into mobile app) -->
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #86868b; text-align: ${textAlign}; padding-bottom: 24px; line-height: 1.6;">
                      ${linkFallbackText}<br>
                      <a href="${resetUrl}" style="color: #0071e3; word-break: break-all; font-size: 12px;">${resetUrl}</a>
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

  // Newsletter campaign email — wraps admin-composed markdown body in branded shell.
  // Subject + bodyHtml are inserted verbatim (bodyHtml is already sanitized via renderNewsletterMarkdown).
  newsletterCampaign: (params: { subject: string; bodyHtml: string; unsubscribeUrl: string; locale?: string }) => {
    const locale = params.locale === 'ar' ? 'ar' : params.locale === 'ru' ? 'ru' : 'en'
    const { dir, textAlign } = getLocaleSettings(locale)

    const copy = {
      en: {
        footerNote: 'You\u2019re receiving this because you subscribed at genosys.ae.',
        unsubscribe: 'Unsubscribe',
        officialDistributor: 'Official Distributor in the UAE',
        copyright: '\u00A9 2026 All rights reserved.',
      },
      ar: {
        footerNote: 'تتلقى هذه الرسالة لأنك اشتركت عبر genosys.ae.',
        unsubscribe: 'إلغاء الاشتراك',
        officialDistributor: 'الموزّع الرسمي في الإمارات',
        copyright: '\u00A9 2026 جميع الحقوق محفوظة.',
      },
      ru: {
        footerNote: 'Вы получили это письмо, потому что подписались на genosys.ae.',
        unsubscribe: 'Отписаться',
        officialDistributor: 'Официальный дистрибьютор в ОАЭ',
        copyright: '\u00A9 2026 Все права защищены.',
      },
    } as const
    const c = copy[locale as keyof typeof copy]

    return {
      subject: params.subject,
      html: `
      <!DOCTYPE html>
      <html lang="${locale}" dir="${dir}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${params.subject.replace(/</g, '&lt;')}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
                <tr>
                  <td style="text-align: center; padding-bottom: 32px;">
                    <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                  </td>
                </tr>
                <tr>
                  <td style="text-align: ${textAlign}; padding-bottom: 16px;">
                    ${params.bodyHtml}
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                      ${c.footerNote}<br>
                      <a href="${params.unsubscribeUrl}" style="color: #86868b; text-decoration: underline;">${c.unsubscribe}</a><br><br>
                      Genosys Middle East FZ-LLC<br>
                      ${c.officialDistributor}<br><br>
                      ${c.copyright}
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

  // Newsletter confirmation email — sent when someone subscribes via homepage/footer form.
  // Clean Apple-style wrapper to match the rest of the email system.
  newsletterWelcome: (params: { email: string; locale?: string; unsubscribeUrl: string }) => {
    const locale = params.locale === 'ar' ? 'ar' : params.locale === 'ru' ? 'ru' : 'en'
    const { dir, textAlign } = getLocaleSettings(locale)
    const siteUrl = SITE_URL
    const shopUrl = locale === 'en' ? `${siteUrl}/products` : `${siteUrl}/${locale}/products`

    const copy = {
      en: {
        subject: 'You\u2019re on the list — GENOSYS insiders',
        heading: 'You\u2019re in.',
        subheading: 'Welcome to the GENOSYS insiders.',
        body: 'Expect expert skin tips, new launches, and pro-only offers — straight to your inbox. No spam. Never shared.',
        cta: 'Shop the catalog',
        footerNote: 'You\u2019re receiving this because you subscribed at genosys.ae.',
        unsubscribe: 'Unsubscribe',
        officialDistributor: 'Official Distributor in the UAE',
        copyright: '\u00A9 2026 All rights reserved.',
      },
      ar: {
        subject: 'تم تسجيلك \u2014 مشتركو GENOSYS',
        heading: 'تم تسجيلك.',
        subheading: 'مرحباً بك في مشتركي GENOSYS.',
        body: 'توقّع نصائح من الخبراء، إطلاقات جديدة، وعروضاً حصرية للمحترفين \u2014 مباشرةً إلى بريدك. لا بريد مزعج، ولا مشاركة للبيانات.',
        cta: 'تصفّح المنتجات',
        footerNote: 'تتلقى هذه الرسالة لأنك اشتركت عبر genosys.ae.',
        unsubscribe: 'إلغاء الاشتراك',
        officialDistributor: 'الموزّع الرسمي في الإمارات',
        copyright: '\u00A9 2026 جميع الحقوق محفوظة.',
      },
      ru: {
        subject: 'Вы в списке — GENOSYS insiders',
        heading: 'Вы подписаны.',
        subheading: 'Добро пожаловать в сообщество GENOSYS.',
        body: 'Советы экспертов, новинки и закрытые предложения для профи \u2014 прямо на вашу почту. Без спама. Не передаём третьим лицам.',
        cta: 'Открыть каталог',
        footerNote: 'Вы получили это письмо, потому что подписались на genosys.ae.',
        unsubscribe: 'Отписаться',
        officialDistributor: 'Официальный дистрибьютор в ОАЭ',
        copyright: '\u00A9 2026 Все права защищены.',
      },
    } as const
    const c = copy[locale as keyof typeof copy]

    return {
      subject: c.subject,
      html: `
      <!DOCTYPE html>
      <html lang="${locale}" dir="${dir}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${c.subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                      ${c.heading}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 32px;">
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b; letter-spacing: -0.01em;">
                      ${c.subheading}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.6; color: #1d1d1f; text-align: ${textAlign}; padding-bottom: 40px;">
                    ${c.body}
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-bottom: 48px;">
                    <a href="${shopUrl}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px; letter-spacing: -0.01em;">
                      ${c.cta}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                      ${c.footerNote}<br>
                      <a href="${params.unsubscribeUrl}" style="color: #86868b; text-decoration: underline;">${c.unsubscribe}</a><br><br>
                      Genosys Middle East FZ-LLC<br>
                      ${c.officialDistributor}<br><br>
                      ${c.copyright}
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
