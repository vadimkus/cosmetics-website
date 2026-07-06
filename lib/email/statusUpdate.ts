/**
 * Order Status Update Email
 * Sends status update notifications with dynamic HTML templates
 */
import { debugLog, errorLog } from '@/lib/logger'
import { SITE_URL } from '@/lib/siteConfig'
import { loadEmailTranslations, LOGO_URL } from './utils'
import { sendEmail } from './transporter'
import { emailTemplates } from './templates'
import { calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import enFallbackMessages from '@/messages/en.json'

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
    let t = loadEmailTranslations(locale, 'statusUpdate')
    
    // If translations are empty, use hardcoded fallback
    if (!t || Object.keys(t).length === 0) {
      errorLog('Failed to load translations for order status update, using fallback')
      // Fallback to English
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const enMsgs = enFallbackMessages as Record<string, any>
        t = enMsgs.default?.orderEmail?.statusUpdate || enMsgs.orderEmail?.statusUpdate
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
            CANCELLED: "Your order has been cancelled. If this wasn't expected — or you'd like help placing a new order — just reply to this email or message us on WhatsApp, and we'll make it right.",
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
        const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${SITE_URL}${item.image}`) : ''
        const itemTotal = item.price * item.quantity
        const isFreeItem = item.price === 0 || item.productName.toLowerCase().includes('(free)')
        
        // Qty + size/color combined line
        const detailParts: string[] = [`Qty: ${item.quantity}`]
        if (item.size) detailParts.push(item.size)
        if (item.color) detailParts.push(item.color)
        const detailLine = detailParts.join(' • ')
        
        const priceDisplay = isFreeItem
          ? `<span style="color: #16a34a; font-weight: 700;">FREE</span>`
          : `<span style="font-weight: 600; font-size: 15px; color: #1d1d1f;">AED ${itemTotal.toFixed(2)}</span>`
        
        return `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f7; vertical-align: top;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  ${imageUrl ? `<td style="width: 48px; vertical-align: top; padding-${isRTL ? 'left' : 'right'}: 10px;">
                    <img src="${imageUrl}" alt="${item.productName}" width="48" height="48" style="width: 48px; height: 48px; object-fit: contain; border-radius: 6px; background-color: #f9fafb; display: block;" />
                  </td>` : ''}
                  <td style="vertical-align: top;">
                    <div style="font-size: 14px; font-weight: 700; color: #1d1d1f; text-transform: uppercase; letter-spacing: 0.02em; text-align: ${textAlign}; line-height: 1.3;">${item.productName}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 3px; text-align: ${textAlign};">${detailLine}</div>
                  </td>
                  <td style="text-align: ${isRTL ? 'left' : 'right'}; vertical-align: top; white-space: nowrap; padding-${isRTL ? 'right' : 'left'}: 12px;">${priceDisplay}</td>
                </tr>
              </table>
            </td>
          </tr>
        `
      }).join('')
      
      const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const vat = calculateVatIncluded(order.total || subtotal)
      
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

