import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { debugLog, errorLog } from '@/lib/logger'
import { requireCsrfToken } from '@/lib/csrf'
import { getPreferredEmail, isApplePrivateRelayEmail } from '@/lib/emailHelpers'
import { findUserByEmail, findUserById } from '@/lib/userStorageDb'
import { SITE_URL, LEGAL_INFO, SOCIAL_LINKS } from '@/lib/siteConfig'
import { LOGO_URL } from '@/lib/email/utils'
import { getOrderByNumber, OrderWithItems } from '@/lib/orderStorageDb'
import { verifySessionToken } from '@/lib/jwt'
import { verifyAdminSessionToken } from '@/lib/adminAuth'

interface InvoiceItem {
  id?: string
  name: string
  image?: string
  quantity: number
  price: number
  total: number
  size?: string
  color?: string
}

interface InvoiceData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  emirate: string
  items: InvoiceItem[]
  subtotal: number
  shippingCost: number
  vatAmount: number
  total: number
  locale?: string
  discountPercentage?: number
  discountAmount?: number
  bundleDiscountPercentage?: number
  bundleDiscountAmount?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = Record<string, any>

function loadInvoiceTranslations(locale: string): Translations {
  // Inline translations to avoid async import issues
  const translations: Record<string, Translations> = {
    en: {
      title: 'TAX INVOICE',
      dated: 'dated:',
      customerInformation: 'Customer Information',
      name: 'Name:',
      email: 'Email:',
      phone: 'Phone:',
      address: 'Address:',
      emirate: 'Emirate:',
      orderDetails: 'Order Details',
      product: 'Product',
      price: 'Price',
      quantity: 'Quantity',
      qty: 'Qty',
      total: 'Total',
      subtotal: 'Subtotal',
      retailPrice: 'Retail Price',
      netSubtotal: 'Net Subtotal',
      shippingTo: 'Shipping to',
      vat: 'VAT (5%)',
      totalLabel: 'Total:',
      free: 'FREE',
      allPricesIncludeVat: 'All prices include 5% VAT',
      yourDiscount: 'Your Discount',
      bundleDiscount: 'Bundle Discount',
      youSaved: 'You saved',
      item: 'item',
      items: 'items',
      officialDistributor: 'Official Distributor in the UAE',
      copyright: '© 2026 Genosys Middle East FZ-LLC. All rights reserved.',
      emailSubject: 'Invoice',
      emailSubjectSuffix: 'GENOSYS Professional',
      na: 'N/A',
      viewOrder: 'View Order',
      trnLabel: 'TRN',
      licenseLabel: 'Trade License',
      bankLabel: 'Bank',
      ibanLabel: 'IBAN',
      accountLabel: 'Acc No'
    },
    ar: {
      title: 'فاتورة ضريبية',
      dated: 'بتاريخ:',
      customerInformation: 'معلومات العميل',
      name: 'الاسم:',
      email: 'البريد الإلكتروني:',
      phone: 'الهاتف:',
      address: 'العنوان:',
      emirate: 'الإمارة:',
      orderDetails: 'تفاصيل الطلب',
      product: 'المنتج',
      price: 'السعر',
      quantity: 'الكمية',
      qty: 'الكمية',
      total: 'الإجمالي',
      subtotal: 'المجموع الفرعي',
      retailPrice: 'سعر التجزئة',
      netSubtotal: 'المجموع الصافي',
      shippingTo: 'الشحن إلى',
      vat: 'ضريبة القيمة المضافة (5%)',
      totalLabel: 'الإجمالي:',
      free: 'مجاني',
      allPricesIncludeVat: 'جميع الأسعار شاملة ضريبة القيمة المضافة 5%',
      yourDiscount: 'خصمك',
      bundleDiscount: 'خصم الحزمة',
      youSaved: 'وفّرت',
      item: 'منتج',
      items: 'منتجات',
      officialDistributor: 'الموزع الرسمي في الإمارات',
      copyright: '© 2026 شركة GENOSYS الشرق الأوسط FZ-LLC. جميع الحقوق محفوظة.',
      emailSubject: 'فاتورة',
      emailSubjectSuffix: 'GENOSYS الاحترافية',
      na: 'غير متوفر',
      viewOrder: 'عرض الطلب',
      trnLabel: 'الرقم الضريبي',
      licenseLabel: 'الرخصة التجارية',
      bankLabel: 'البنك',
      ibanLabel: 'IBAN',
      accountLabel: 'رقم الحساب'
    },
    ru: {
      title: 'НАЛОГОВЫЙ СЧЁТ',
      dated: 'дата:',
      customerInformation: 'Информация о клиенте',
      name: 'Имя:',
      email: 'Электронная почта:',
      phone: 'Телефон:',
      address: 'Адрес:',
      emirate: 'Эмират:',
      orderDetails: 'Детали заказа',
      product: 'Продукт',
      price: 'Цена',
      quantity: 'Количество',
      qty: 'Кол-во',
      total: 'Итого',
      subtotal: 'Подытог',
      retailPrice: 'Розничная цена',
      netSubtotal: 'Подытог со скидкой',
      shippingTo: 'Доставка в',
      vat: 'НДС (5%)',
      totalLabel: 'Итого:',
      free: 'БЕСПЛАТНО',
      allPricesIncludeVat: 'Все цены включают НДС 5%',
      yourDiscount: 'Ваша скидка',
      bundleDiscount: 'Скидка за набор',
      youSaved: 'Вы сэкономили',
      item: 'товар',
      items: 'товаров',
      officialDistributor: 'Официальный дистрибьютор в ОАЭ',
      copyright: '© 2026 Genosys Middle East FZ-LLC. Все права защищены.',
      emailSubject: 'Счёт',
      emailSubjectSuffix: 'GENOSYS Professional',
      na: 'Н/Д',
      viewOrder: 'Посмотреть заказ',
      trnLabel: 'TRN (налоговый №)',
      licenseLabel: 'Торговая лицензия',
      bankLabel: 'Банк',
      ibanLabel: 'IBAN',
      accountLabel: 'Счёт №'
    }
  }
  return (translations[locale] || translations['en']) as Translations
}

export async function POST(request: NextRequest) {
  try {
    // CSRF protection
    const csrfCheck = await requireCsrfToken(request)
    if (!csrfCheck.valid) {
      return csrfCheck.response!
    }

    const submittedInvoiceData: InvoiceData = await request.json()
    
    const {
      orderNumber,
      locale = 'en'
    } = submittedInvoiceData

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: 'orderNumber is required' },
        { status: 400 }
      )
    }

    const order = await getOrderByNumber(orderNumber)
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    // Authorize: only the order owner (session email matches) or an admin may
    // trigger an invoice email. Previously any caller could re-send invoices
    // to customers by enumerating order numbers.
    const sessionCookie = request.cookies.get('genosys_session')
    const session = sessionCookie ? verifySessionToken(sessionCookie.value) : null
    let sessionEmail: string | null = null
    if (session?.email) {
      sessionEmail = session.email.toLowerCase()
    } else if (session?.id) {
      const u = await findUserById(session.id)
      sessionEmail = u?.email ? u.email.toLowerCase() : null
    }
    const isOwner = !!sessionEmail && sessionEmail === order.customerEmail.toLowerCase()
    const adminCookie = request.cookies.get('admin-session')
    const isAdmin = adminCookie ? !!verifyAdminSessionToken(adminCookie.value) : false
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    const invoiceData = buildInvoiceDataFromOrder(order, locale)
    const customerEmail = order.customerEmail

    // Load translations
    const t = loadInvoiceTranslations(invoiceData.locale || locale)

    // Generate HTML invoice
    const invoiceHtml = generateInvoiceHTML(invoiceData, t)

    // Find user to get preferred email (contact email if available)
    const user = await findUserByEmail(customerEmail)
    const emailToUse = user ? getPreferredEmail(user) : customerEmail
    
    // Skip sending to Apple Private Relay emails
    if (isApplePrivateRelayEmail(emailToUse)) {
      debugLog(`⏭️ Skipping invoice email for Apple Private Relay user: ${emailToUse}`)
      return NextResponse.json({ 
        success: false, 
        message: 'Cannot send invoice to Apple Private Relay email. Please add a contact email in your profile.' 
      }, { status: 400 })
    }

    // Send email with invoice
    const emailSubject = `${t.emailSubject} ${orderNumber} - ${t.emailSubjectSuffix}`
    
    const result = await sendEmail(
      emailToUse,
      emailSubject,
      invoiceHtml
    )

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Invoice generated and sent successfully' 
    })

  } catch (error) {
    errorLog('Error generating invoice:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

function buildInvoiceDataFromOrder(order: OrderWithItems, requestedLocale?: string): InvoiceData {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    emirate: order.customerEmirate,
    items: order.items.map(item => ({
      id: item.productId,
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: Math.round(item.price * item.quantity * 100) / 100,
      ...(item.image ? { image: item.image } : {}),
      ...(item.size ? { size: item.size } : {}),
      ...(item.color ? { color: item.color } : {}),
    })),
    subtotal: order.subtotal,
    shippingCost: order.shipping || 0,
    vatAmount: order.vat,
    total: order.total,
    locale: requestedLocale || order.locale || 'en',
    ...(order.discountPercentage ? { discountPercentage: order.discountPercentage } : {}),
    ...(order.discountAmount ? { discountAmount: order.discountAmount } : {}),
    ...(order.bundleDiscountPercentage ? { bundleDiscountPercentage: order.bundleDiscountPercentage } : {}),
    ...(order.bundleDiscountAmount ? { bundleDiscountAmount: order.bundleDiscountAmount } : {}),
  }
}

// Exported for preview/testing (scripts) — not a route handler.
export function generateInvoiceHTML(data: InvoiceData, t: Translations): string {
  const {
    orderNumber,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    emirate,
    items,
    subtotal,
    shippingCost,
    vatAmount,
    total,
    locale = 'en',
    discountPercentage = 0,
    discountAmount = 0,
    bundleDiscountPercentage = 0,
    bundleDiscountAmount = 0
  } = data

  const isRTL = locale === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'
  const textAlign = isRTL ? 'right' : 'left'
  const textAlignReverse = isRTL ? 'left' : 'right'
  
  const dateStr = new Date().toLocaleDateString(
    locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE', 
    { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' }
  )

  // Discount calculations
  const hasUserDiscount = discountPercentage > 0
  const hasBundleDiscount = bundleDiscountPercentage > 0
  const hasAnyDiscount = hasUserDiscount || hasBundleDiscount

  // Count items
  const paidItems = items.filter(item => item.price > 0 && !item.name.toLowerCase().includes('(free)'))
  const freeItems = items.filter(item => item.price === 0 || item.name.toLowerCase().includes('(free)'))
  const paidItemCount = paidItems.reduce((sum, item) => sum + item.quantity, 0)
  const freeItemCount = freeItems.reduce((sum, item) => sum + item.quantity, 0)

  // Retail total (before discounts)
  const retailTotal = subtotal + discountAmount + bundleDiscountAmount
  const totalSaved = discountAmount + bundleDiscountAmount

  // Generate items HTML with images, badges, strikethrough
  const itemsHTML = items.map((item) => {
    const isFreeItem = item.price === 0 || item.name.toLowerCase().includes('(free)')
    const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${SITE_URL}${item.image}`) : ''
    
    // Reverse-calculate original price
    let originalPrice = item.price
    if (hasUserDiscount && !isFreeItem) {
      originalPrice = originalPrice / (1 - discountPercentage / 100)
    }
    if (hasBundleDiscount && !isFreeItem) {
      originalPrice = originalPrice / (1 - bundleDiscountPercentage / 100)
    }
    
    const hasDiscount = hasAnyDiscount && !isFreeItem
    const itemTotal = item.price * item.quantity
    const originalTotal = originalPrice * item.quantity
    const totalDiscountPct = hasDiscount
      ? Math.round((1 - item.price / originalPrice) * 100)
      : 0

    // Discount badges
    const badges: string[] = []
    if (hasUserDiscount && !isFreeItem) {
      badges.push(`<span style="display: inline-block; background: #f3e8ff; color: #9333ea; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-${isRTL ? 'left' : 'right'}: 4px;">-${discountPercentage}% VIP</span>`)
    }
    if (hasBundleDiscount && !isFreeItem) {
      badges.push(`<span style="display: inline-block; background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">-${bundleDiscountPercentage}% Bundle</span>`)
    }

    // Price display
    const priceDisplay = isFreeItem
      ? `<span style="color: #16a34a; font-weight: 700; font-size: 14px;">${t.free}</span>`
      : hasDiscount
        ? `<div style="text-align: ${textAlignReverse};">
            <span style="color: #9ca3af; text-decoration: line-through; font-size: 12px;">AED ${originalTotal.toFixed(2)}</span>
            <br/>
            <span style="color: #16a34a; font-weight: 700; font-size: 15px;">AED ${itemTotal.toFixed(2)}</span>
          </div>`
        : `<span style="font-weight: 600; font-size: 15px; color: #1d1d1f;">AED ${itemTotal.toFixed(2)}</span>`

    // Qty + size/color combined line
    const detailParts: string[] = [`${t.qty}: ${item.quantity}`]
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
    `
  }).join('')

  const trackUrl = `${SITE_URL}/${locale === 'en' ? '' : locale + '/'}track/${orderNumber}`

  return `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title} #${orderNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
              
              <!-- Letterhead: logo + seller legal identity (UAE tax invoice requirements) -->
              <tr>
                <td style="padding-bottom: 28px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="vertical-align: top; text-align: ${textAlign};">
                        <img src="${LOGO_URL}" alt="GENOSYS" style="height: 30px; width: auto;" />
                      </td>
                      <td style="vertical-align: top; text-align: ${textAlignReverse}; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #6e6e73; line-height: 1.7;">
                        <strong style="font-size: 12px; color: #1d1d1f;">${LEGAL_INFO.companyName}</strong><br>
                        ${t.trnLabel}: ${LEGAL_INFO.trn} &nbsp;·&nbsp; ${t.licenseLabel}: ${LEGAL_INFO.license}<br>
                        ${LEGAL_INFO.registeredAddress}<br>
                        ${SOCIAL_LINKS.email} &nbsp;·&nbsp; ${SOCIAL_LINKS.phoneDisplay} &nbsp;·&nbsp; genosys.ae
                      </td>
                    </tr>
                  </table>
                  <div style="height: 1px; background-color: #d2d2d7; margin-top: 20px;"></div>
                </td>
              </tr>
              
              <!-- Invoice Title -->
              <tr>
                <td style="text-align: center; padding-bottom: 8px;">
                  <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                    ${t.title}
                  </h1>
                </td>
              </tr>
              
              <!-- Order Number & Date -->
              <tr>
                <td style="text-align: center; padding-bottom: 40px;">
                  <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #86868b;">
                    #${orderNumber} &nbsp;|&nbsp; ${t.dated} ${dateStr}
                  </span>
                </td>
              </tr>
              
              <!-- Customer Details Card -->
              <tr>
                <td style="padding-bottom: 32px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                    <tr>
                      <td style="padding: 24px;">
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 16px; text-align: ${textAlign};">${t.customerInformation}</div>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f; line-height: 1.6;">
                          <tr>
                            <td style="padding: 4px 0; color: #86868b; text-align: ${textAlign}; width: 100px; vertical-align: top;">${t.name}</td>
                            <td style="padding: 4px 0; font-weight: 500; text-align: ${textAlign};">${customerName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; color: #86868b; text-align: ${textAlign}; vertical-align: top;">${t.email}</td>
                            <td style="padding: 4px 0; text-align: ${textAlign};">${customerEmail}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; color: #86868b; text-align: ${textAlign}; vertical-align: top;">${t.phone}</td>
                            <td style="padding: 4px 0; text-align: ${textAlign};">${customerPhone || t.na}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; color: #86868b; text-align: ${textAlign}; vertical-align: top;">${t.address}</td>
                            <td style="padding: 4px 0; text-align: ${textAlign};">${customerAddress || t.na}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; color: #86868b; text-align: ${textAlign}; vertical-align: top;">${t.emirate}</td>
                            <td style="padding: 4px 0; text-align: ${textAlign};">${emirate}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Divider -->
              <tr>
                <td style="padding: 0 0 24px 0;">
                  <div style="height: 1px; background-color: #d2d2d7;"></div>
                </td>
              </tr>
              
              <!-- Items Section Title -->
              <tr>
                <td style="padding-bottom: 16px;">
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; text-align: ${textAlign};">${t.orderDetails}</div>
                </td>
              </tr>
              
              <!-- Items -->
              <tr>
                <td>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
                    ${itemsHTML}
                  </table>
                </td>
              </tr>
              
              <!-- Summary Section -->
              <tr>
                <td style="padding-top: 24px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;">
                    ${hasAnyDiscount ? `
                    <!-- Retail Price -->
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">
                        ${t.retailPrice}: (${paidItemCount} ${paidItemCount === 1 ? t.item : t.items})
                        ${freeItemCount > 0 ? `<br><span style="color: #34c759;">+ ${freeItemCount} ${t.free}</span>` : ''}
                      </td>
                      <td style="padding: 8px 0; font-size: 15px; color: #9ca3af; font-weight: 500; text-align: ${textAlignReverse}; vertical-align: top; text-decoration: line-through;">AED ${retailTotal.toFixed(2)}</td>
                    </tr>
                    ` : `
                    <!-- Subtotal -->
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">
                        ${t.subtotal}: (${paidItemCount} ${paidItemCount === 1 ? t.item : t.items})
                        ${freeItemCount > 0 ? `<br><span style="color: #34c759;">+ ${freeItemCount} ${t.free}</span>` : ''}
                      </td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 500; text-align: ${textAlignReverse}; vertical-align: top;">AED ${subtotal.toFixed(2)}</td>
                    </tr>
                    `}
                    ${hasUserDiscount ? `
                    <!-- VIP Discount -->
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #9b5de5; text-align: ${textAlign};">🏷️ ${t.yourDiscount} (${discountPercentage}%)</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #9b5de5; font-weight: 500; text-align: ${textAlignReverse};">-AED ${discountAmount.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${hasBundleDiscount ? `
                    <!-- Bundle Discount -->
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #16a34a; text-align: ${textAlign};">📦 ${t.bundleDiscount} (${bundleDiscountPercentage}%)</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #16a34a; font-weight: 500; text-align: ${textAlignReverse};">-AED ${bundleDiscountAmount.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${hasAnyDiscount ? `
                    <!-- Separator -->
                    <tr>
                      <td colspan="2" style="padding: 4px 0;">
                        <div style="height: 1px; background-color: #e5e7eb;"></div>
                      </td>
                    </tr>
                    <!-- Net Subtotal -->
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 600; text-align: ${textAlign};">${t.netSubtotal}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 600; text-align: ${textAlignReverse};">AED ${subtotal.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    <!-- Shipping -->
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">🚚 ${t.shippingTo} ${emirate}</td>
                      <td style="padding: 8px 0; font-size: 15px; text-align: ${textAlignReverse}; font-weight: 500; ${shippingCost === 0 ? 'color: #34c759;' : 'color: #1d1d1f;'}">${shippingCost === 0 ? t.free : `AED ${shippingCost.toFixed(2)}`}</td>
                    </tr>
                    <!-- VAT -->
                    <tr>
                      <td style="padding: 8px 0; font-size: 15px; color: #6b7280; text-align: ${textAlign};">${t.vat}</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #1d1d1f; font-weight: 500; text-align: ${textAlignReverse};">AED ${vatAmount.toFixed(2)}</td>
                    </tr>
                    <!-- VAT Note -->
                    <tr>
                      <td colspan="2" style="padding: 8px 0;">
                        <div style="background-color: #fef3c7; border-radius: 6px; padding: 8px 12px; text-align: center;">
                          <span style="font-size: 13px; color: #d97706;">${t.allPricesIncludeVat}</span>
                        </div>
                      </td>
                    </tr>
                    <!-- Total Divider -->
                    <tr>
                      <td colspan="2" style="padding: 16px 0 8px 0;">
                        <div style="height: 2px; background-color: #1d1d1f;"></div>
                      </td>
                    </tr>
                    <!-- Grand Total -->
                    <tr>
                      <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #1d1d1f; text-align: ${textAlign};">${t.totalLabel}</td>
                      <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #dc2626; text-align: ${textAlignReverse};">AED ${total.toFixed(2)}</td>
                    </tr>
                    ${hasAnyDiscount ? `
                    <!-- You Saved -->
                    <tr>
                      <td colspan="2" style="padding: 12px 0 0 0;">
                        <div style="background-color: #dcfce7; border-radius: 8px; padding: 10px 16px; text-align: center;">
                          <span style="font-size: 14px; color: #16a34a; font-weight: 600;">💰 ${t.youSaved}: AED ${totalSaved.toFixed(2)}</span>
                        </div>
                      </td>
                    </tr>
                    ` : ''}
                  </table>
                </td>
              </tr>
              
              <!-- CTA Button -->
              <tr>
                <td style="text-align: center; padding-top: 40px;">
                  <a href="${trackUrl}" style="display: inline-block; background-color: #0071e3; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 980px;">
                    ${t.viewOrder}
                  </a>
                </td>
              </tr>
              
              <!-- Footer: legal identity + banking details -->
              <tr>
                <td style="padding-top: 56px;">
                  <div style="height: 1px; background-color: #e5e7eb; margin-bottom: 20px;"></div>
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.8; text-align: center;">
                    <strong style="color: #6e6e73;">${LEGAL_INFO.companyName}</strong> — ${t.officialDistributor}<br>
                    ${t.trnLabel}: ${LEGAL_INFO.trn} &nbsp;·&nbsp; ${t.licenseLabel}: ${LEGAL_INFO.license}<br>
                    ${LEGAL_INFO.registeredAddress}<br>
                    ${t.bankLabel}: ${LEGAL_INFO.bankName} &nbsp;·&nbsp; ${t.ibanLabel}: ${LEGAL_INFO.iban} &nbsp;·&nbsp; ${t.accountLabel}: ${LEGAL_INFO.accountNo}<br><br>
                    ${t.copyright}
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
