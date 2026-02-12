/**
 * Email HTML Generators
 * Functions that generate order-related HTML emails (COD, Support Link, Stripe)
 */
import { SITE_URL } from '@/lib/siteConfig'
import { loadEmailTranslations, LOGO_URL } from './utils'
import type { OrderHTMLData } from './types'

/**
 * Shared enhanced item renderer for all email templates.
 * Matches the success page layout: image + name + "Quantity: X • size" + (XX% OFF) + badges + strikethrough price
 */
/**
 * Check if an item name indicates a product that is excluded from user VIP discounts.
 * Devices and Hydro Cool Mask have fixed pricing — no discount display at all.
 */
function isFixedPriceItem(itemName: string): boolean {
  const name = (itemName || '').trim().toLowerCase()
  if (!name) return false
  if (name.includes('hydro') && name.includes('cool') && name.includes('mask')) return true
  if (name.includes('genoled') || name.includes('gentron') || name.includes('hairgen')) return true
  return false
}

/** Beauty box original prices (before the built-in 15% bundle discount) */
const BEAUTY_BOX_ORIGINAL_PRICES: Record<string, number> = {
  'problem skin care beauty box': 1318,
  'skin brightening beauty box': 1496,
  'charming look beauty box': 1520,
  'anti-aging beauty box': 1390,
  'deep moisturizing beauty box': 1318,
}
const BEAUTY_BOX_DISCOUNT_PCT = 15

function getBeautyBoxOriginalPrice(itemName: string): number | null {
  const n = (itemName || '').trim().toLowerCase()
  for (const [key, price] of Object.entries(BEAUTY_BOX_ORIGINAL_PRICES)) {
    if (n.includes(key)) return price
  }
  return null
}

function renderEnhancedItemRows(
  order: OrderHTMLData,
  locale: string,
  opts: { qtyLabel?: string; freeLabel?: string }
): string {
  const isRTL = locale === 'ar'
  const textAlign = isRTL ? 'right' : 'left'
  const textAlignReverse = isRTL ? 'left' : 'right'
  
  const qtyLabel = opts.qtyLabel || (locale === 'ru' ? 'Количество' : locale === 'ar' ? 'الكمية' : 'Quantity')
  const freeLabel = opts.freeLabel || (locale === 'ru' ? 'БЕСПЛАТНО' : locale === 'ar' ? 'مجاني' : 'FREE')
  
  // Extract discount percentages from order-level data
  const userDiscountPct = order.discountPercentage || 0
  const bundleDiscountPct = order.bundleDiscountPercentage || 0
  const hasUserDiscount = userDiscountPct > 0
  const hasBundleDiscount = bundleDiscountPct > 0
  
  return order.items.map(item => {
    const isFreeItem = item.price === 0 || item.name.toLowerCase().includes('(free)')
    const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${SITE_URL}${item.image}`) : ''
    
    // Check if this is a beauty box (has its own built-in 15% discount)
    const beautyBoxOriginal = getBeautyBoxOriginalPrice(item.name)
    const isBeautyBox = beautyBoxOriginal !== null
    // Devices and Hydro Cool Mask — fixed price, no discount display
    const isFixedPrice = isFixedPriceItem(item.name)
    
    // Calculate original price and discount percentage per item
    let originalPrice = item.price
    let totalDiscountPct = 0
    let showDiscount = false
    
    if (isBeautyBox && beautyBoxOriginal) {
      // Beauty box: show the built-in 15% bundle discount
      originalPrice = beautyBoxOriginal
      totalDiscountPct = BEAUTY_BOX_DISCOUNT_PCT
      showDiscount = true
    } else if (!isFixedPrice && !isFreeItem) {
      // Bundle and VIP discounts are mutually exclusive per item.
      // Prefer bundle discount when present (bundle items don't get VIP).
      if (hasBundleDiscount) {
        originalPrice = originalPrice / (1 - bundleDiscountPct / 100)
        showDiscount = true
      } else if (hasUserDiscount) {
        originalPrice = originalPrice / (1 - userDiscountPct / 100)
        showDiscount = true
      }
      totalDiscountPct = showDiscount
        ? Math.round((1 - item.price / originalPrice) * 100)
        : 0
    }
    
    const hasDiscount = showDiscount && !isFreeItem
    const itemTotal = item.price * item.quantity
    const originalTotal = originalPrice * item.quantity
    
    // Build discount badges
    const badges: string[] = []
    if (isBeautyBox) {
      badges.push(`<span style="display: inline-block; background: #fff7ed; color: #c2410c; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-${isRTL ? 'left' : 'right'}: 4px;">-${BEAUTY_BOX_DISCOUNT_PCT}% Box</span>`)
    } else if (!isFixedPrice && !isFreeItem) {
      // Show only one badge: bundle OR VIP (mutually exclusive)
      if (hasBundleDiscount) {
        badges.push(`<span style="display: inline-block; background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">-${bundleDiscountPct}% Bundle</span>`)
      } else if (hasUserDiscount) {
        badges.push(`<span style="display: inline-block; background: #f3e8ff; color: #9333ea; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-${isRTL ? 'left' : 'right'}: 4px;">-${userDiscountPct}% VIP</span>`)
      }
    }
    
    // Price column
    const priceDisplay = isFreeItem
      ? `<span style="color: #16a34a; font-weight: 700; font-size: 14px;">${freeLabel}</span>`
      : hasDiscount
        ? `<div style="text-align: ${textAlignReverse};">
            <span style="color: #9ca3af; text-decoration: line-through; font-size: 12px;">AED ${originalTotal.toFixed(2)}</span>
            <br/>
            <span style="color: #16a34a; font-weight: 700; font-size: 15px;">AED ${itemTotal.toFixed(2)}</span>
          </div>`
        : `<span style="font-weight: 600; font-size: 15px; color: #1d1d1f;">AED ${itemTotal.toFixed(2)}</span>`
    
    // Qty + size/color combined line (matching success page: "Quantity: 1 • 180ml")
    const detailParts: string[] = [`${qtyLabel}: ${item.quantity}`]
    if (item.size) detailParts.push(item.size)
    if (item.color) detailParts.push(item.color)
    const detailLine = detailParts.join(' • ')
    
    return `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f7; vertical-align: top;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            ${imageUrl ? `<td style="width: 56px; vertical-align: top; padding-${isRTL ? 'left' : 'right'}: 12px;">
              <img src="${imageUrl}" alt="${item.name}" width="56" height="56" style="width: 56px; height: 56px; object-fit: contain; border-radius: 8px; background-color: #f9fafb; display: block;" />
            </td>` : ''}
            <td style="vertical-align: top;">
              <div style="font-size: 14px; font-weight: 700; color: #1d1d1f; text-transform: uppercase; letter-spacing: 0.02em; text-align: ${textAlign}; line-height: 1.3;">${item.name}</div>
              <div style="font-size: 12px; color: #6b7280; margin-top: 3px; text-align: ${textAlign};">${detailLine}</div>
              ${totalDiscountPct > 0 ? `<div style="font-size: 12px; font-weight: 700; color: #16a34a; margin-top: 2px; text-align: ${textAlign};">(${totalDiscountPct}% OFF)</div>` : ''}
              ${badges.length > 0 ? `<div style="margin-top: 4px; text-align: ${textAlign};">${badges.join('')}</div>` : ''}
            </td>
            <td style="text-align: ${textAlignReverse}; vertical-align: top; white-space: nowrap; padding-${isRTL ? 'right' : 'left'}: 12px;">${priceDisplay}</td>
          </tr>
        </table>
      </td>
    </tr>
  `}).join('')
}

// Order HTML template generation functions - Apple style
export const generateCODOrderHTML = (order: OrderHTMLData, locale: string = 'en', _translations?: Record<string, unknown>): string => {
  const t = loadEmailTranslations(locale, 'cod')
  const isRTL = locale === 'ar'
  const textAlign = isRTL ? 'right' : 'left'
  const textAlignReverse = isRTL ? 'left' : 'right'
  const firstName = (order.customerName || 'Customer').split(' ')[0]
  
  // Localized labels
  const orderConfirmedText = locale === 'ru' ? 'Заказ подтвержден' : locale === 'ar' ? 'تم تأكيد الطلب' : 'Order Confirmed'
  const codPaymentText = locale === 'ru' ? '💵 Оплата: При получении' : locale === 'ar' ? '💵 الدفع: عند الاستلام' : '💵 Payment: Cash on Delivery'
  const greetingText = locale === 'ru' 
    ? `Здравствуйте, ${firstName},<br><br>Спасибо за ваш заказ. Вы оплатите заказ наличными при получении. Мы уведомим вас, когда он будет отправлен.`
    : locale === 'ar'
    ? `مرحباً ${firstName}،<br><br>شكراً لطلبك. ستدفع نقداً عند الاستلام عند وصول طلبك. سنخبرك عندما يتم شحنه.`
    : `Hi ${firstName},<br><br>Thank you for your order. You'll pay via Cash on Delivery when your order arrives. We'll notify you when it ships.`

  // Count paid items and free items
  const paidItems = order.items.filter(item => item.price > 0 && !item.name.toLowerCase().includes('(free)'))
  const freeItems = order.items.filter(item => item.price === 0 || item.name.toLowerCase().includes('(free)'))
  const paidItemCount = paidItems.reduce((sum, item) => sum + item.quantity, 0)
  const freeItemCount = freeItems.reduce((sum, item) => sum + item.quantity, 0)

  // Generate items HTML using shared enhanced renderer (matches success page)
  const itemsHTML = renderEnhancedItemRows(order, locale, {})

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
              
              <!-- Summary - Waterfall Discount Breakdown -->
              ${(() => {
                const _hasUserDiscount = (order.discountAmount || 0) > 0
                const _hasBundleDiscount = (order.bundleDiscountAmount || 0) > 0
                const _hasAnyDiscount = _hasUserDiscount || _hasBundleDiscount
                const _retailTotal = order.subtotal + (order.discountAmount || 0) + (order.bundleDiscountAmount || 0)
                const _afterVipSubtotal = _retailTotal - (order.discountAmount || 0)
                const _totalSaved = (order.discountAmount || 0) + (order.bundleDiscountAmount || 0)
                const _retailPriceLabel = locale === 'ar' ? 'سعر التجزئة' : locale === 'ru' ? 'Розничная цена' : 'Retail Price'
                const _yourDiscountLabel = locale === 'ar' ? 'خصمك' : locale === 'ru' ? 'Ваша скидка' : 'Your Discount'
                const _bundleDiscountLabel = locale === 'ar' ? 'خصم الباقة' : locale === 'ru' ? 'Скидка набора' : 'Bundle Discount'
                const _netSubtotalLabel = locale === 'ar' ? 'المجموع الفرعي' : locale === 'ru' ? 'Подытог' : 'Net Subtotal'
                const _subtotalLabel = locale === 'ar' ? 'المجموع الفرعي' : locale === 'ru' ? 'Подытог' : 'Subtotal'
                const _youSavedLabel = locale === 'ar' ? 'وفرت' : locale === 'ru' ? 'Вы сэкономили' : 'You saved'
                const _vatNotice = locale === 'ar' ? 'جميع الأسعار تشمل ضريبة القيمة المضافة 5%' : locale === 'ru' ? 'Все цены включают НДС 5%' : 'All prices include 5% VAT'
                
                return `<tr>
                <td style="padding-top: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
                    ${_hasAnyDiscount ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">
                        ${_retailPriceLabel}: (${paidItemCount} ${paidItemCount === 1 ? 'item' : 'items'})
                        ${freeItemCount > 0 ? `<br><span style="color: #34c759;">+ ${freeItemCount} free ${freeItemCount === 1 ? 'mask' : 'masks'}</span>` : ''}
                      </td>
                      <td style="padding: 8px 0; font-size: 15px; color: #9ca3af; font-weight: 500; text-align: ${textAlignReverse}; vertical-align: top; text-decoration: line-through;">AED ${_retailTotal.toFixed(2)}</td>
                    </tr>
                    ` : `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">
                        ${t.subtotal || 'Subtotal'}: (${paidItemCount} ${paidItemCount === 1 ? 'item' : 'items'})
                        ${freeItemCount > 0 ? `<br><span style="color: #34c759;">+ ${freeItemCount} free ${freeItemCount === 1 ? 'mask' : 'masks'}</span>` : ''}
                      </td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 500; text-align: ${textAlignReverse}; vertical-align: top;">AED ${order.subtotal.toFixed(2)}</td>
                    </tr>
                    `}
                    ${_hasUserDiscount ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #9b5de5; text-align: ${textAlign};">🏷️ ${_yourDiscountLabel}${order.discountPercentage ? ` (${order.discountPercentage}%)` : ''}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #9b5de5; font-weight: 500; text-align: ${textAlignReverse};">-AED ${(order.discountAmount || 0).toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${_hasUserDiscount && _hasBundleDiscount ? `
                    <tr>
                      <td style="padding: 4px 0; font-size: 13px; color: #9ca3af; text-align: ${textAlign};">${_subtotalLabel}</td>
                      <td style="padding: 4px 0; font-size: 13px; color: #9ca3af; font-weight: 500; text-align: ${textAlignReverse};">AED ${_afterVipSubtotal.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${_hasBundleDiscount ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #16a34a; text-align: ${textAlign};">📦 ${_bundleDiscountLabel}${order.bundleDiscountPercentage ? ` (${order.bundleDiscountPercentage}%)` : ''}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #16a34a; font-weight: 500; text-align: ${textAlignReverse};">-AED ${(order.bundleDiscountAmount || 0).toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${_hasAnyDiscount ? `
                    <tr>
                      <td colspan="2" style="padding: 4px 0;"><div style="height: 1px; background-color: #e5e7eb;"></div></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 600; text-align: ${textAlign};">${_netSubtotalLabel}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 600; text-align: ${textAlignReverse};">AED ${order.subtotal.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">
                        🚚 ${(t.shippingTo || 'Shipping to {emirate}').replace('{emirate}', order.emirate)}
                      </td>
                      <td style="padding: 8px 0; font-size: 15px; text-align: ${textAlignReverse}; font-weight: 500; ${order.shippingCost === 0 ? 'color: #34c759;' : 'color: #1d1d1f;'}">${order.shippingCost === 0 ? 'FREE' : `AED ${order.shippingCost.toFixed(2)}`}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">${t.vat || 'VAT (5%)'}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 500; text-align: ${textAlignReverse};">AED ${order.vatAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 8px 0;">
                        <div style="background-color: #fef3c7; border-radius: 6px; padding: 8px 12px; text-align: center;">
                          <span style="font-size: 13px; color: #d97706;">${_vatNotice}</span>
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
                      <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #dc2626; text-align: ${textAlignReverse};">AED ${order.total.toFixed(2)}</td>
                    </tr>
                    ${_hasAnyDiscount ? `
                    <tr>
                      <td colspan="2" style="padding: 12px 0 0 0;">
                        <div style="background-color: #dcfce7; border-radius: 8px; padding: 10px 16px; text-align: center;">
                          <span style="font-size: 14px; color: #16a34a; font-weight: 600;">💰 ${_youSavedLabel}: AED ${_totalSaved.toFixed(2)}</span>
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
                  <a href="${SITE_URL}/${locale === 'en' ? '' : locale + '/'}track/${order.orderNumber}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
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

export const generateSupportLinkOrderHTML = (order: OrderHTMLData, locale: string = 'en', _translations?: Record<string, unknown>): string => {
  // Apple-style minimalist template - unified format
  const isRTL = locale === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'
  const textAlign = isRTL ? 'right' : 'left'
  const textAlignReverse = isRTL ? 'left' : 'right'
  const siteUrl = SITE_URL
  const productsUrl = locale === 'ar' ? `${siteUrl}/ar/products` : `${siteUrl}/products`

  // Count paid items and free items
  const paidItems = order.items.filter(item => item.price > 0 && !(item.name || '').toLowerCase().includes('(free)'))
  const freeItems = order.items.filter(item => item.price === 0 || (item.name || '').toLowerCase().includes('(free)'))
  const paidItemCount = paidItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const freeItemCount = freeItems.reduce((sum, item) => sum + (item.quantity || 0), 0)

  // Generate items HTML using shared enhanced renderer (matches success page)
  const itemsHTML = renderEnhancedItemRows(order, locale, {})

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
              
              <!-- Summary - Waterfall Discount Breakdown -->
              ${(() => {
                const _hasUserDiscount = (order.discountAmount || 0) > 0
                const _hasBundleDiscount = (order.bundleDiscountAmount || 0) > 0
                const _hasAnyDiscount = _hasUserDiscount || _hasBundleDiscount
                const _retailTotal = (order.subtotal || 0) + (order.discountAmount || 0) + (order.bundleDiscountAmount || 0)
                const _afterVipSubtotal = _retailTotal - (order.discountAmount || 0)
                const _totalSaved = (order.discountAmount || 0) + (order.bundleDiscountAmount || 0)
                
                return `<tr>
                <td style="padding-top: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
                    ${_hasAnyDiscount ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">
                        Retail Price: (${paidItemCount} ${paidItemCount === 1 ? 'item' : 'items'})
                        ${freeItemCount > 0 ? `<br><span style="color: #34c759;">+ ${freeItemCount} free ${freeItemCount === 1 ? 'mask' : 'masks'}</span>` : ''}
                      </td>
                      <td style="padding: 8px 0; font-size: 15px; color: #9ca3af; font-weight: 500; text-align: ${textAlignReverse}; vertical-align: top; text-decoration: line-through;">AED ${_retailTotal.toFixed(2)}</td>
                    </tr>
                    ` : `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">
                        Subtotal: (${paidItemCount} ${paidItemCount === 1 ? 'item' : 'items'})
                        ${freeItemCount > 0 ? `<br><span style="color: #34c759;">+ ${freeItemCount} free ${freeItemCount === 1 ? 'mask' : 'masks'}</span>` : ''}
                      </td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 500; text-align: ${textAlignReverse}; vertical-align: top;">AED ${(order.subtotal || 0).toFixed(2)}</td>
                    </tr>
                    `}
                    ${_hasUserDiscount ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #9b5de5; text-align: ${textAlign};">🏷️ Your Discount${order.discountPercentage ? ` (${order.discountPercentage}%)` : ''}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #9b5de5; font-weight: 500; text-align: ${textAlignReverse};">-AED ${(order.discountAmount || 0).toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${_hasUserDiscount && _hasBundleDiscount ? `
                    <tr>
                      <td style="padding: 4px 0; font-size: 13px; color: #9ca3af; text-align: ${textAlign};">Subtotal</td>
                      <td style="padding: 4px 0; font-size: 13px; color: #9ca3af; font-weight: 500; text-align: ${textAlignReverse};">AED ${_afterVipSubtotal.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${_hasBundleDiscount ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #16a34a; text-align: ${textAlign};">📦 Bundle Discount${order.bundleDiscountPercentage ? ` (${order.bundleDiscountPercentage}%)` : ''}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #16a34a; font-weight: 500; text-align: ${textAlignReverse};">-AED ${(order.bundleDiscountAmount || 0).toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${_hasAnyDiscount ? `
                    <tr>
                      <td colspan="2" style="padding: 4px 0;"><div style="height: 1px; background-color: #e5e7eb;"></div></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 600; text-align: ${textAlign};">Net Subtotal</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 600; text-align: ${textAlignReverse};">AED ${(order.subtotal || 0).toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">🚚 Shipping to ${order.emirate || 'UAE'}</td>
                      <td style="padding: 8px 0; font-size: 15px; text-align: ${textAlignReverse}; font-weight: 500; ${(order.shippingCost || 0) === 0 ? 'color: #34c759;' : 'color: #1d1d1f;'}">${(order.shippingCost || 0) === 0 ? 'FREE' : `AED ${(order.shippingCost || 0).toFixed(2)}`}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">VAT (5%)</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 500; text-align: ${textAlignReverse};">AED ${(order.vatAmount || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 8px 0;">
                        <div style="background-color: #fef3c7; border-radius: 6px; padding: 8px 12px; text-align: center;">
                          <span style="font-size: 13px; color: #d97706;">All prices include 5% VAT</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 16px 0 8px 0;">
                        <div style="height: 2px; background-color: #1d1d1f;"></div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #1d1d1f; text-align: ${textAlign};">Total:</td>
                      <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #dc2626; text-align: ${textAlignReverse};">AED ${(order.total || 0).toFixed(2)}</td>
                    </tr>
                    ${_hasAnyDiscount ? `
                    <tr>
                      <td colspan="2" style="padding: 12px 0 0 0;">
                        <div style="background-color: #dcfce7; border-radius: 8px; padding: 10px 16px; text-align: center;">
                          <span style="font-size: 14px; color: #16a34a; font-weight: 600;">💰 You saved: AED ${_totalSaved.toFixed(2)}</span>
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
export const generateStripePaymentConfirmationHTML = (order: OrderHTMLData, locale: string = 'en', _translations?: Record<string, unknown>): string => {
  const isRTL = locale === 'ar'
  const textAlign = isRTL ? 'right' : 'left'
  const siteUrl = SITE_URL

  // Generate items HTML using shared enhanced renderer (matches success page)
  const itemsHTML = renderEnhancedItemRows(order, locale, {})

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
              
              <!-- Summary - Waterfall Discount Breakdown -->
              ${(() => {
                const _hasUserDiscount = (order.discountAmount || 0) > 0
                const _hasBundleDiscount = (order.bundleDiscountAmount || 0) > 0
                const _hasAnyDiscount = _hasUserDiscount || _hasBundleDiscount
                const _retailTotal = (order.subtotal || 0) + (order.discountAmount || 0) + (order.bundleDiscountAmount || 0)
                const _afterVipSubtotal = _retailTotal - (order.discountAmount || 0)
                const _totalSaved = (order.discountAmount || 0) + (order.bundleDiscountAmount || 0)
                const _textAlignReverse = isRTL ? 'left' : 'right'
                
                return `<tr>
                <td style="padding-top: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
                    ${_hasAnyDiscount ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">Retail Price</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #9ca3af; text-align: ${_textAlignReverse}; text-decoration: line-through;">AED ${_retailTotal.toFixed(2)}</td>
                    </tr>
                    ` : `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">Subtotal</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${_textAlignReverse};">AED ${(order.subtotal || 0).toFixed(2)}</td>
                    </tr>
                    `}
                    ${_hasUserDiscount ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #9b5de5; text-align: ${textAlign};">🏷️ Your Discount${order.discountPercentage ? ` (${order.discountPercentage}%)` : ''}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #9b5de5; font-weight: 500; text-align: ${_textAlignReverse};">-AED ${(order.discountAmount || 0).toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${_hasUserDiscount && _hasBundleDiscount ? `
                    <tr>
                      <td style="padding: 4px 0; font-size: 13px; color: #9ca3af; text-align: ${textAlign};">Subtotal</td>
                      <td style="padding: 4px 0; font-size: 13px; color: #9ca3af; font-weight: 500; text-align: ${_textAlignReverse};">AED ${_afterVipSubtotal.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${_hasBundleDiscount ? `
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #16a34a; text-align: ${textAlign};">📦 Bundle Discount${order.bundleDiscountPercentage ? ` (${order.bundleDiscountPercentage}%)` : ''}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #16a34a; font-weight: 500; text-align: ${_textAlignReverse};">-AED ${(order.bundleDiscountAmount || 0).toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${_hasAnyDiscount ? `
                    <tr>
                      <td colspan="2" style="padding: 4px 0;"><div style="height: 1px; background-color: #e5e7eb;"></div></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 600; text-align: ${textAlign};">Net Subtotal</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 600; text-align: ${_textAlignReverse};">AED ${(order.subtotal || 0).toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">Shipping</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${_textAlignReverse};">${(order.shippingCost || 0) === 0 ? 'Free' : `AED ${(order.shippingCost || 0).toFixed(2)}`}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #86868b; text-align: ${textAlign};">VAT (5%)</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; text-align: ${_textAlignReverse};">AED ${(order.vatAmount || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 16px 0 8px 0;">
                        <div style="height: 1px; background-color: #d2d2d7;"></div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${textAlign};">Total Paid</td>
                      <td style="padding: 8px 0; font-size: 17px; font-weight: 600; color: #1d1d1f; text-align: ${_textAlignReverse};">AED ${(order.total || 0).toFixed(2)}</td>
                    </tr>
                    ${_hasAnyDiscount ? `
                    <tr>
                      <td colspan="2" style="padding: 12px 0 0 0;">
                        <div style="background-color: #dcfce7; border-radius: 8px; padding: 10px 16px; text-align: center;">
                          <span style="font-size: 14px; color: #16a34a; font-weight: 600;">💰 You saved: AED ${_totalSaved.toFixed(2)}</span>
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
