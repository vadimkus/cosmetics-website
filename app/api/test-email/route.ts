import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail, sendOrderConfirmationEmail, sendAdminNewUserNotification, sendAdminNewOrderNotification, sendOrderStatusUpdate, sendEmail, generateSupportLinkOrderHTML, generateCODOrderHTML } from '@/lib/email'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { errorLog } from '@/lib/logger'

export async function POST(request: NextRequest) {
  // Require admin authentication and CSRF protection
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { type, testEmail } = await request.json()

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail('Test User', testEmail)
        break
      
      case 'order':
        result = await sendOrderConfirmationEmail({
          orderNumber: 'TEST123456',
          customerName: 'Test Customer',
          customerEmail: testEmail,
          items: [
            {
              productName: 'Test Product',
              quantity: 2,
              price: 150.00,
              image: '/images/test.jpg'
            }
          ],
          subtotal: 300.00,
          shipping: 45.00,
          vat: 17.25,
          total: 362.25,
          address: 'Test Address, Dubai',
          emirate: 'Dubai'
        })
        break
      
      case 'admin-user':
        result = await sendAdminNewUserNotification('Test User', testEmail, '+971 50 123 4567', 'Test Address, Dubai')
        break
      
      case 'admin-order':
        result = await sendAdminNewOrderNotification({
          orderNumber: 'SAMPLE-' + Date.now(),
          customerName: 'John Doe',
          customerEmail: 'customer@example.com',
          customerPhone: '+971 50 123 4567',
          total: 456.75,
          itemCount: 3,
          items: [
            {
              productName: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
              quantity: 2,
              price: 150.00,
              image: 'https://genosys.ae/images/product-placeholder.jpg',
              size: 'Medium',
              color: 'Beige'
            },
            {
              productName: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
              quantity: 1,
              price: 156.75,
              image: 'https://genosys.ae/images/product-placeholder.jpg'
            }
          ],
          subtotal: 456.75,
          shipping: 0,
          vat: 22.84,
          address: '123 Business Bay, Dubai Marina, Dubai',
          emirate: 'Dubai'
        }, testEmail)
        break
      
      case 'order-status':
        result = await sendOrderStatusUpdate({
          orderNumber: 'ORD-2024-001',
          customerName: 'John Doe',
          customerEmail: testEmail,
          items: [
            {
              productName: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
              quantity: 2,
              price: 150.00,
              image: 'https://genosys.ae/images/CUSHC.png',
              color: 'Beige',
              size: 'Medium'
            },
            {
              productName: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
              quantity: 1,
              price: 156.75,
              image: 'https://genosys.ae/images/HRS.jpg'
            }
          ],
          total: 456.75
        }, 'DELIVERED')
        break
      
      case 'cod':
        const codOrderData = {
          orderNumber: 'COD2501010001',
          customerName: 'Vadim Sagatdinov',
          customerEmail: testEmail,
          customerPhone: '+971 50 123 4567',
          customerAddress: 'Dubai Marina, Building 123, Apt 456',
          emirate: 'Dubai',
          items: [
            {
              name: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
              quantity: 2,
              price: 150.00,
              total: 300.00,
              size: 'Medium',
              color: 'Beige'
            },
            {
              name: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
              quantity: 1,
              price: 156.75,
              total: 156.75
            }
          ],
          subtotal: 456.75,
          shippingCost: 0,
          vatAmount: 22.84,
          total: 479.59
        }
        
        // Load translations
        const codLocale = 'en'
        const codTranslations = (await import('@/messages/en.json')).default.orderEmail.cod
        const codHTML = generateCODOrderHTML(codOrderData, codLocale, codTranslations)
        const codSubject = codTranslations.subject.replace('#{orderNumber}', codOrderData.orderNumber).replace('{orderNumber}', codOrderData.orderNumber)
        
        result = await sendEmail(testEmail, codSubject, codHTML)
        break
      
      case 'support-link':
        const supportOrderData = {
          orderNumber: 'SUP2511300207',
          customerName: 'Vadim Sagatdinov',
          customerEmail: testEmail,
          customerPhone: '+971 559152985',
          customerAddress: 'Dubai',
          emirate: 'Dubai',
          items: [
            {
              name: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
              quantity: 2,
              price: 150.00,
              total: 300.00,
              image: 'https://genosys.ae/images/CUSHC.png',
              color: 'Beige',
              size: 'Medium'
            },
            {
              name: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
              quantity: 1,
              price: 156.75,
              total: 156.75,
              image: 'https://genosys.ae/images/HRS.jpg'
            }
          ],
          subtotal: 456.75,
          shippingCost: 45.00,
          vatAmount: 23.89,
          total: 525.64
        }
        
        // Load translations
        const locale = 'en'
        const translations = (await import('@/messages/en.json')).default.orderEmail.supportLink
        const orderHTML = generateSupportLinkOrderHTML(supportOrderData, locale, translations)
        const emailSubject = translations.subject.replace('#{orderNumber}', supportOrderData.orderNumber).replace('{orderNumber}', supportOrderData.orderNumber)
        
        result = await sendEmail(testEmail, emailSubject, orderHTML)
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type. Use: welcome, order, admin-user, admin-order, order-status, cod, or support-link' },
          { status: 400 }
        )
    }

    if (result.success && 'messageId' in result) {
      return NextResponse.json({
        success: true,
        message: `${type} email sent successfully to ${testEmail}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send ${type} email: ${result.error}` },
        { status: 500 }
      )
    }

  } catch (error) {
    errorLog('Test email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
