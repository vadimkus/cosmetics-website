import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { errorLog } from '@/lib/logger'
import { requireCsrfToken } from '@/lib/csrf'

interface InvoiceItem {
  id?: string
  name: string
  quantity: number
  price: number
  total: number
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
}

export async function POST(request: NextRequest) {
  try {
    // CSRF protection
    const csrfCheck = await requireCsrfToken(request)
    if (!csrfCheck.valid) {
      return csrfCheck.response!
    }

    const invoiceData = await request.json()
    
    const {
      orderNumber,
      customerEmail,
      customerName,
      customerPhone,
      customerAddress,
      emirate,
      items,
      subtotal,
      shippingCost,
      vatAmount,
      total,
      locale = 'en'
    } = invoiceData

    // Load translations
    const translations = locale === 'ar' 
      ? (await import('@/messages/ar.json')).default.invoice
      : (await import('@/messages/en.json')).default.invoice

    // Generate HTML invoice
    const invoiceHtml = generateInvoiceHTML({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      emirate,
      items: items as InvoiceItem[],
      subtotal,
      shippingCost,
      vatAmount,
      total,
      locale,
      translations
    })

    // Send email with invoice
    const emailSubject = (translations?.emailSubject || 'Invoice') + ` ${orderNumber} - ${translations?.emailSubjectSuffix || 'GENOSYS Professional'}`
    
    const result = await sendEmail(
      customerEmail,
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

  } catch {
    errorLog('Error generating invoice:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

interface InvoiceTranslations {
  emailSubject?: string
  emailSubjectSuffix?: string
  invoice?: string
  orderNumber?: string
  date?: string
  customerDetails?: string
  items?: string
  quantity?: string
  price?: string
  total?: string
  subtotal?: string
  shipping?: string
  vat?: string
  grandTotal?: string
  [key: string]: string | undefined
}

function generateInvoiceHTML(data: InvoiceData & { locale: string; translations: InvoiceTranslations }): string {
  const {
    orderNumber,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    emirate,
    subtotal,
    shippingCost,
    vatAmount,
    total,
    locale,
    translations
  } = data

  const isRTL = locale === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'
  const textAlign = isRTL ? 'right' : 'left'
  const fontFamily = isRTL ? 'Arial, "Arabic Typesetting", "Segoe UI", sans-serif' : 'Arial, sans-serif'
  
  const dateStr = new Date().toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-AE', { 
    timeZone: 'Asia/Dubai', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })

  return `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${locale}">
    <head>
      <meta charset="utf-8">
      <title>${translations?.emailSubject || 'Invoice'} ${orderNumber || ''}</title>
      <style>
        body { font-family: ${fontFamily}; margin: 0; padding: 20px; background-color: #f5f5f5; direction: ${dir}; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e5e5; padding-bottom: 20px; }
        .logo { margin-bottom: 15px; }
        .logo img { max-width: 200px; height: auto; }
        .invoice-title { font-size: 28px; color: #1f2937; margin: 0; }
        .invoice-number { font-size: 16px; color: #6b7280; margin-top: 5px; }
        .customer-info, .order-details { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 1px solid #e5e5e5; padding-bottom: 5px; text-align: ${textAlign}; }
        .info-row { display: flex; margin-bottom: 8px; ${isRTL ? 'flex-direction: row-reverse;' : ''} }
        .info-label { font-weight: bold; width: 120px; color: #374151; text-align: ${textAlign}; }
        .info-value { color: #6b7280; text-align: ${textAlign}; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th, .items-table td { padding: 12px; text-align: ${textAlign}; border-bottom: 1px solid #e5e5e5; }
        .items-table th { background-color: #f9fafb; font-weight: bold; color: #374151; }
        .items-table td { color: #6b7280; }
        .total-section { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 12px; ${isRTL ? 'flex-direction: row-reverse;' : ''} }
        .total-label { font-weight: bold; color: #374151; text-align: ${textAlign}; }
        .total-value { color: #6b7280; text-align: ${textAlign}; }
        .grand-total { font-size: 18px; font-weight: bold; color: #000000; border-top: 2px solid #e5e5e5; padding-top: 10px; margin-top: 10px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #000000; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo">
            <img src="https://genosys.ae/images/genosys-logo.png" alt="GENOSYS Logo" width="200" border="0" style="display: block; max-width: 200px; height: auto; margin: 0 auto;" />
          </div>
          <h1 class="invoice-title">${translations?.title || 'Invoice'} #${(orderNumber || '').replace('GEN', '')} ${translations?.dated || 'dated:'} ${dateStr}</h1>
        </div>

        <div class="customer-info">
          <h2 class="section-title">${translations.customerInformation}</h2>
          <div class="info-row">
            <span class="info-label">${translations.name}</span>
            <span class="info-value">${customerName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">${translations.email}</span>
            <span class="info-value">${customerEmail}</span>
          </div>
          <div class="info-row">
            <span class="info-label">${translations.phone}</span>
            <span class="info-value">${customerPhone || translations.na}</span>
          </div>
          <div class="info-row">
            <span class="info-label">${translations.address}</span>
            <span class="info-value">${customerAddress || translations.na}</span>
          </div>
          <div class="info-row">
            <span class="info-label">${translations.emirate}</span>
            <span class="info-value">${emirate}</span>
          </div>
        </div>

        <div class="order-details">
          <h2 class="section-title">${translations.orderDetails}</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>${translations.product}</th>
                <th>${translations.price}</th>
                <th>${translations.quantity}</th>
                <th>${translations.total}</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map((item: InvoiceItem) => {
                const itemName = item.name || 'Product'
                const itemSlug = item.id || itemName.toLowerCase().replace(/\s+/g, '-')
                return `
                <tr>
                  <td><a href="https://genosys.ae/${locale === 'ar' ? 'ar/' : ''}products/${itemSlug}" style="color: #2563eb; text-decoration: none;">${itemName}</a></td>
                  <td>AED ${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>AED ${item.total.toFixed(2)}</td>
                </tr>
              `
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="total-section">
          <div class="total-row">
            <span class="total-label">${translations.subtotal}</span>
            <span class="total-value">AED ${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">${translations.shippingTo} ${emirate}:</span>
            <span class="total-value">${shippingCost === 0 ? (locale === 'ar' ? 'مجاني' : 'FREE') : `AED ${shippingCost.toFixed(2)}`}</span>
          </div>
          <div class="total-row">
            <span class="total-label">${translations.vat}</span>
            <span class="total-value">AED ${vatAmount.toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span class="total-label">${translations.totalLabel}</span>
            <span class="total-value">AED ${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <div style="text-align: center; margin-bottom: 15px; background-color: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <img src="https://genosys.ae/Logo/Full.png" alt="GENOSYS Logo" width="200" border="0" style="display: block; max-width: 200px; height: auto; margin: 0 auto;" />
          </div>
          <p>${translations.officialDistributor}</p>
          <p>${translations.copyright}</p>
        </div>
      </div>
    </body>
    </html>
  `
}
