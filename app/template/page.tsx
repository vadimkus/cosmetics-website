'use client'

import { useState, useMemo } from 'react'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

type TemplateType = 'welcome' | 'order-shipped' | 'order-confirmed' | 'order-delivered' | 'discount-assigned' | 'cod' | 'support-link' | 'stripe-payment-confirmation'
type Locale = 'en' | 'ru' | 'ar'
type DesignVariant = 'current' | 'v2-minimal'

export default function EmailTemplatePage() {
  const [templateType, setTemplateType] = useState<TemplateType>('order-shipped')
  const [locale, setLocale] = useState<Locale>('en')
  const [designVariant, setDesignVariant] = useState<DesignVariant>('current')
  const [userName, setUserName] = useState('John Doe')
  const [userEmail, setUserEmail] = useState('user@example.com')
  const [userPhone, setUserPhone] = useState('+971 50 123 4567')
  const [password, setPassword] = useState('MySecurePassword123!')
  const [orderNumber, setOrderNumber] = useState('ORD-2024-001')
  const [orderTotal, setOrderTotal] = useState('456.75')
  const [orderSubtotal, setOrderSubtotal] = useState('400.00')
  const [orderShipping, setOrderShipping] = useState('0')
  const [orderVat, setOrderVat] = useState('20.00')
  const [deliveryAddress, setDeliveryAddress] = useState('Dubai Marina, Building 123, Apt 456')
  const [deliveryEmirate, setDeliveryEmirate] = useState('Dubai')
  const [discountType, setDiscountType] = useState<'CLINIC' | 'VIP'>('CLINIC')
  const [discountPercentage, setDiscountPercentage] = useState('15')
  const [orderItems, setOrderItems] = useState('GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]')

  // Load translations based on locale
  const messages = useMemo(() => {
    if (locale === 'ar') return arMessages
    if (locale === 'ru') return ruMessages
    return enMessages
  }, [locale])

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: unknown = messages
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        value = undefined
        break
      }
    }
    
    if (typeof value !== 'string') {
      return key
    }
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [paramKey, paramValue]) => 
          str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
        value
      )
    }
    
    return value
  }

  const tf = (key: string, fallback: string, params?: Record<string, string | number>) => {
    const v = t(key, params)
    return v === key ? fallback : v
  }

  const getBaseUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
  const getLocalePrefix = () => (locale === 'ar' ? 'ar/' : locale === 'ru' ? 'ru/' : '')
  const WHATSAPP_NUMBER = '971585487665'

  const formatAed = (value: string | number) => {
    const n = typeof value === 'string' ? parseFloat(value) : value
    if (!Number.isFinite(n)) return ''
    return `AED ${n.toFixed(2)}`
  }

  const buildV2Shell = (opts: {
    subject: string
    heading: string
    greetingLine: string
    bodyLine?: string
    primaryCta?: { label: string; href: string }
    secondaryCta?: { label: string; href: string }
    detailsRows?: Array<{ label: string; value: string }>
    extraBlockHtml?: string
  }) => {
    const baseUrl = getBaseUrl()
    const dir = locale === 'ar' ? 'rtl' : 'ltr'
    const textAlign = locale === 'ar' ? 'right' : 'left'
    const prefix = getLocalePrefix()
    const logoUrl = `${baseUrl}/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75`
    const instaIconUrl = `${baseUrl}/Logo/insta.png`
    const whatsappIconUrl = `${baseUrl}/Logo/wa.png`
    const facebookIconUrl = `${baseUrl}/Logo/fb.png`

    const uaeLine = tf('orderEmail.statusUpdate.uae', 'United Arab Emirates ❤️')
    const officialDistributor = tf('orderEmail.orderDelivered.officialDistributor', 'Official Distributor in the UAE.')
    const copyright = tf('orderEmail.orderDelivered.copyright', '© 2026 Genosys Middle East FZ-LLC. All rights reserved.')

    const followUs = tf('orderEmail.orderDelivered.followUs', 'Follow us')
    const instaLabel = tf('orderEmail.orderDelivered.insta', 'Insta')
    const waLabel = tf('orderEmail.orderDelivered.whatsApp', 'WhatsApp')
    const fbLabel = tf('orderEmail.orderDelivered.fb', 'FB')

    const detailsHtml = (opts.detailsRows && opts.detailsRows.length > 0)
      ? `
        <div style="background: #f9fafb; padding: 18px 20px; border-radius: 12px; margin-top: 18px; border: 1px solid #e5e7eb;">
          <h3 style="color: #111827; margin: 0 0 10px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; text-align: ${textAlign};">
            ${tf('orderEmail.orderDelivered.orderDetails', 'Order details:')}
          </h3>
          ${opts.detailsRows
            .map(
              (r) => `
                <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
                  <span style="color: #9ca3af;">${r.label}</span> <strong style="color: #111827;">${r.value}</strong>
                </p>
              `
            )
            .join('')}
        </div>
      `
      : ''

    const ctas = `
      <div style="text-align: center; margin: 22px 0 0 0;">
        ${opts.primaryCta ? `
          <a href="${opts.primaryCta.href}"
             style="background: #dc2626; color: #ffffff; padding: 12px 22px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">
            ${opts.primaryCta.label}
          </a>
        ` : ''}
        ${opts.secondaryCta ? `
          <div style="margin-top: 10px;">
            <a href="${opts.secondaryCta.href}"
               style="background: #128C7E; color: #ffffff; padding: 12px 22px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">
              ${opts.secondaryCta.label}
            </a>
          </div>
        ` : ''}
      </div>
    `

    return {
      subject: opts.subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f3f4f6; padding: 24px 12px; direction: ${dir};">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 16px;">
              <div style="font-size: 20px; font-weight: 800; color: #dc2626; letter-spacing: -0.2px;">Genosys Middle East FZ-LLC</div>
              <div style="font-size: 13px; color: #6b7280; margin-top: 6px;">${uaeLine}</div>
            </div>

            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 22px 20px;">
              <div style="text-align: ${textAlign};">
                <div style="display: inline-block; padding: 6px 10px; border-radius: 999px; background: #fef2f2; color: #991b1b; font-size: 12px; font-weight: 700; margin-bottom: 12px;">
                  ${opts.heading}
                </div>
              </div>

              <h2 style="color: #111827; margin: 0 0 10px 0; font-size: 18px; font-weight: 800; text-align: ${textAlign};">
                ${opts.greetingLine}
              </h2>

              ${opts.bodyLine ? `
                <p style="color: #374151; font-size: 15px; line-height: 1.65; margin: 0 0 0 0; text-align: ${textAlign};">
                  ${opts.bodyLine}
                </p>
              ` : ''}

              ${detailsHtml}

              ${opts.extraBlockHtml || ''}

              ${ctas}
            </div>

            <div style="text-align: center; margin: 18px 0 0 0;">
              <p style="color: #111827; font-size: 13px; margin: 0 0 10px 0; font-weight: 700;">${followUs}</p>
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 0 12px; text-align: center;">
                    <a href="https://www.instagram.com/genosys.uae/" style="text-decoration: none; display: inline-block;">
                      <img src="${instaIconUrl}" alt="Instagram" width="32" height="32" style="max-width: 32px; height: auto; display: block; margin: 0 auto;" border="0" />
                      <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">${instaLabel}</p>
                    </a>
                  </td>
                  <td style="padding: 0 12px; text-align: center;">
                    <a href="https://wa.me/${WHATSAPP_NUMBER}" style="text-decoration: none; display: inline-block;">
                      <img src="${whatsappIconUrl}" alt="WhatsApp" width="32" height="32" style="max-width: 32px; height: auto; display: block; margin: 0 auto;" border="0" />
                      <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">${waLabel}</p>
                    </a>
                  </td>
                  <td style="padding: 0 12px; text-align: center;">
                    <a href="https://www.facebook.com/genosys.ae" style="text-decoration: none; display: inline-block;">
                      <img src="${facebookIconUrl}" alt="Facebook" width="32" height="32" style="max-width: 32px; height: auto; display: block; margin: 0 auto;" border="0" />
                      <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">${fbLabel}</p>
                    </a>
                  </td>
                </tr>
              </table>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center; margin-top: 16px;">
              <a href="${baseUrl}/${prefix}products" style="display: block; margin: 0 auto 12px; max-width: 170px;">
                <img src="${logoUrl}" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto; display: block;" />
              </a>
              <p style="color: #6b7280; font-size: 13px; margin: 6px 0;">${officialDistributor}</p>
              <p style="color: #6b7280; font-size: 12px; margin: 6px 0 0 0;">${copyright}</p>
            </div>
          </div>
        </div>
      `
    }
  }

  const getV2Template = () => {
    const baseUrl = getBaseUrl()
    const prefix = getLocalePrefix()

    const orderRows = [
      { label: tf('orderEmail.orderDelivered.orderNumber', 'Order number:'), value: `#${orderNumber}` },
      ...(orderTotal ? [{ label: tf('orderEmail.orderDelivered.total', 'Total:'), value: formatAed(orderTotal) }] : [])
    ]

    const supportHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      locale === 'ru'
        ? `Здравствуйте! Нужна помощь по заказу #${orderNumber}.`
        : locale === 'ar'
          ? `مرحباً! أحتاج مساعدة بخصوص طلبي #${orderNumber}.`
          : `Hi! I need help with my order #${orderNumber}.`
    )}`

    switch (templateType) {
      case 'order-delivered':
        return buildV2Shell({
          subject: tf('orderEmail.orderDelivered.subject', `Order Delivered #${orderNumber} > Genosys Middle East FZ-LLC`, { orderNumber }),
          heading: tf('orderEmail.orderDelivered.subject', `Order Delivered #${orderNumber}`, { orderNumber }).split(' > ')[0],
          greetingLine: tf('orderEmail.supportLink.dear', `Dear ${userName},`, { customerName: userName }),
          bodyLine: tf('orderEmail.orderDelivered.delivered', 'Your order has been delivered.'),
          detailsRows: orderRows,
          primaryCta: { label: tf('orderEmail.orderConfirmation.trackOrder', 'View your order'), href: `${baseUrl}/${prefix}profile` },
          secondaryCta: { label: tf('orderEmail.orderConfirmation.questions', 'Contact Support via WhatsApp'), href: supportHref }
        })

      case 'order-confirmed':
        return buildV2Shell({
          subject: tf('orderEmail.orderConfirmation.subject', `Order Confirmed #${orderNumber} > Genosys Middle East FZ-LLC`, { orderNumber }),
          heading: tf('orderEmail.orderConfirmation.orderConfirmed', 'Order confirmed'),
          greetingLine: tf('orderEmail.orderConfirmation.thankYou', `Thank you for your order, ${userName}!`, { customerName: userName }),
          bodyLine: tf('orderEmail.orderConfirmation.orderReceived', `Your order #${orderNumber} has been received and is being processed.`, { orderNumber }),
          detailsRows: orderRows,
          primaryCta: { label: tf('orderEmail.orderConfirmation.trackOrder', 'Track your order'), href: `${baseUrl}/${prefix}profile` },
          secondaryCta: { label: tf('orderEmail.orderConfirmation.questions', 'Contact Support via WhatsApp'), href: supportHref }
        })

      case 'order-shipped':
        return buildV2Shell({
          subject: `${locale === 'ru'
            ? `Заказ отправлен #${orderNumber} > Genosys Middle East FZ-LLC`
            : locale === 'ar'
              ? `تم شحن الطلب #${orderNumber} > Genosys Middle East FZ-LLC`
              : `Order Shipped #${orderNumber} > Genosys Middle East FZ-LLC`}`,
          heading: locale === 'ru' ? 'Заказ отправлен' : locale === 'ar' ? 'تم شحن الطلب' : 'Order shipped',
          greetingLine: tf('orderEmail.supportLink.dear', `Dear ${userName},`, { customerName: userName }),
          bodyLine: tf('orderEmail.statusUpdate.statusMessages.SHIPPED', 'Your order has been shipped.'),
          detailsRows: orderRows,
          primaryCta: { label: tf('orderEmail.orderConfirmation.trackOrder', 'Track your order'), href: `${baseUrl}/${prefix}profile` },
          secondaryCta: { label: tf('orderEmail.orderConfirmation.questions', 'Contact Support via WhatsApp'), href: supportHref }
        })

      case 'welcome':
        return buildV2Shell({
          subject: locale === 'ru'
            ? 'Данные аккаунта > Genosys Middle East FZ-LLC'
            : locale === 'ar'
              ? 'تفاصيل الحساب > Genosys Middle East FZ-LLC'
              : 'Account details > Genosys Middle East FZ-LLC',
          heading: locale === 'ru' ? 'Добро пожаловать' : locale === 'ar' ? 'مرحباً' : 'Welcome',
          greetingLine: locale === 'ru' ? `Здравствуйте, ${userName}!` : locale === 'ar' ? `مرحباً ${userName}!` : `Welcome, ${userName}!`,
          bodyLine: locale === 'ru'
            ? 'Ваш аккаунт готов. Вы можете войти и начать покупки.'
            : locale === 'ar'
              ? 'حسابك جاهز. يمكنك تسجيل الدخول وبدء التسوق.'
              : 'Your account is ready. You can sign in and start shopping.',
          primaryCta: { label: locale === 'ru' ? 'Войти' : locale === 'ar' ? 'تسجيل الدخول' : 'Sign in', href: `${baseUrl}/${prefix}login` },
          secondaryCta: { label: locale === 'ru' ? 'Связаться в WhatsApp' : locale === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp support', href: `https://wa.me/${WHATSAPP_NUMBER}` },
          extraBlockHtml: password ? `
            <div style="background: #f9fafb; padding: 18px 20px; border-radius: 12px; margin-top: 18px; border: 1px solid #e5e7eb; text-align: ${locale === 'ar' ? 'right' : 'left'};">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px;">
                ${locale === 'ru' ? 'Данные для входа' : locale === 'ar' ? 'بيانات تسجيل الدخول' : 'Sign-in details'}
              </p>
              <p style="color: #6b7280; font-size: 13px; margin: 6px 0;">
                <span style="color: #9ca3af;">${locale === 'ru' ? 'Email:' : locale === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</span>
                <strong style="color: #111827;">${userEmail}</strong>
              </p>
              <p style="color: #6b7280; font-size: 13px; margin: 6px 0;">
                <span style="color: #9ca3af;">${locale === 'ru' ? 'Пароль:' : locale === 'ar' ? 'كلمة المرور:' : 'Password:'}</span>
                <strong style="color: #111827; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace;">${password}</strong>
              </p>
            </div>
          ` : undefined
        })

      case 'discount-assigned': {
        const pct = parseFloat(discountPercentage) || 0
        return buildV2Shell({
          subject: tf('orderEmail.discountAssigned.subject', 'Special Discount Assigned > Genosys Middle East FZ-LLC'),
          heading: locale === 'ru' ? 'Скидка' : locale === 'ar' ? 'خصم' : 'Discount',
          greetingLine: tf('orderEmail.supportLink.dear', `Dear ${userName},`, { customerName: userName }),
          bodyLine: tf('orderEmail.discountAssigned.greeting', 'A special discount has been assigned to your account.'),
          detailsRows: [
            { label: tf('orderEmail.discountAssigned.type', 'Type:'), value: discountType },
            { label: tf('orderEmail.discountAssigned.discount', 'Discount:'), value: `${pct}%` }
          ],
          primaryCta: { label: tf('orderEmail.discountAssigned.loginButton', 'Login'), href: `${baseUrl}/${prefix}login` },
          secondaryCta: { label: tf('orderEmail.orderConfirmation.questions', 'Contact Support via WhatsApp'), href: `https://wa.me/${WHATSAPP_NUMBER}` }
        })
      }

      case 'cod':
        return buildV2Shell({
          subject: tf('orderEmail.cod.subject', `Order Confirmation #${orderNumber} > Genosys Middle East FZ-LLC`, { orderNumber }),
          heading: tf('orderEmail.cod.cod', 'Cash on Delivery'),
          greetingLine: tf('orderEmail.cod.thankYou', `Thank you for your order, ${userName}!`, { customerName: userName }),
          bodyLine: tf('orderEmail.cod.orderReceived', `Your order #${orderNumber} has been received and is being processed. You will pay via Cash on Delivery when your order arrives.`, { orderNumber }),
          detailsRows: [
            { label: tf('orderEmail.cod.orderRequest', 'Order'), value: `#${orderNumber}` },
            ...(orderTotal ? [{ label: tf('orderEmail.cod.totalLabel', 'Total:'), value: formatAed(orderTotal) }] : []),
            { label: tf('orderEmail.cod.emirate', 'Emirate:'), value: deliveryEmirate || '' }
          ].filter(r => r.value),
          primaryCta: { label: tf('orderEmail.supportLink.continueShopping', 'Continue Shopping'), href: `${baseUrl}/${prefix}products` },
          secondaryCta: { label: tf('orderEmail.cod.contactSupport', 'Contact Support via WhatsApp'), href: supportHref }
        })

      case 'support-link':
        return buildV2Shell({
          subject: tf('orderEmail.supportLink.subject', `Order Request Submitted #${orderNumber} > Genosys Middle East FZ-LLC`, { orderNumber }),
          heading: locale === 'ru' ? 'Заявка принята' : locale === 'ar' ? 'تم استلام الطلب' : 'Request received',
          greetingLine: tf('orderEmail.supportLink.dear', `Dear ${userName},`, { customerName: userName }),
          bodyLine: tf('orderEmail.supportLink.orderSubmitted', 'Your order request has been submitted. Our support team will share a secure payment link shortly.'),
          detailsRows: [
            { label: tf('orderEmail.supportLink.orderRequest', 'Order Request'), value: `#${orderNumber}` },
            ...(orderTotal ? [{ label: tf('orderEmail.orderDelivered.total', 'Total:'), value: formatAed(orderTotal) }] : []),
            { label: tf('orderEmail.supportLink.emirate', 'Emirate:'), value: deliveryEmirate || '' }
          ].filter(r => r.value),
          primaryCta: { label: tf('orderEmail.supportLink.continueShopping', 'Continue Shopping'), href: `${baseUrl}/${prefix}products` },
          secondaryCta: { label: tf('orderEmail.supportLink.contactSupport', 'Contact Support via WhatsApp'), href: supportHref }
        })

      case 'stripe-payment-confirmation':
        return buildV2Shell({
          subject: tf('orderEmail.stripePaymentConfirmation.orderConfirmed', `Order Confirmed #${orderNumber} > Genosys Middle East FZ-LLC`, { orderNumber }),
          heading: locale === 'ru' ? 'Оплата получена' : locale === 'ar' ? 'تم تأكيد الدفع' : 'Payment confirmed',
          greetingLine: tf('orderEmail.supportLink.dear', `Dear ${userName},`, { customerName: userName }),
          bodyLine: locale === 'ru'
            ? `Мы получили оплату по заказу #${orderNumber}. Спасибо!`
            : locale === 'ar'
              ? `تم استلام الدفع للطلب #${orderNumber}. شكراً لك!`
              : `We’ve received your payment for order #${orderNumber}. Thank you!`,
          detailsRows: orderRows,
          primaryCta: { label: tf('orderEmail.orderConfirmation.trackOrder', 'View your order'), href: `${baseUrl}/${prefix}profile` },
          secondaryCta: { label: tf('orderEmail.orderConfirmation.questions', 'Contact Support via WhatsApp'), href: supportHref }
        })

      default:
        return buildV2Shell({
          subject: `Order Update #${orderNumber} > Genosys Middle East FZ-LLC`,
          heading: 'Order update',
          greetingLine: `Dear ${userName},`,
          bodyLine: 'Your order has been updated.',
          detailsRows: orderRows,
          primaryCta: { label: 'View your order', href: `${baseUrl}/${prefix}profile` },
          secondaryCta: { label: 'Contact Support via WhatsApp', href: supportHref }
        })
    }
  }

  // Generate welcome email template (same as in lib/email.ts)
  const generateWelcomeEmail = (name: string, email: string, pwd?: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return {
      subject: 'Account details > Genosys Middle East FZ-LLC',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0;">Welcome, ${name}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Registration is done. Thank you for joining.
          </p>
          ${pwd ? `
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Account details:</h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">login:</span> <strong style="color: #374151;">${email}</strong>
            </p>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">password:</span> <strong style="color: #374151; font-family: 'Courier New', monospace; letter-spacing: 0.5px;">${pwd}</strong>
            </p>
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/products" 
             style="background: #dc2626; 
                    color: white; 
                    padding: 10px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    font-size: 14px;
                    display: inline-block;
                    letter-spacing: 0.3px;">
            Login
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <a href="${siteUrl}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
            <img src="https://genosys.ae/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto; display: block;" />
          </a>
          <p style="color: #6b7280; font-size: 14px; margin: 8px 0;">
            Official Distributor in the UAE.
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
            © 2026 Genosys Middle East FZ-LLC. All rights reserved.
          </p>
        </div>
      </div>
    `
    }
  }

  // Generate order shipped email template
  const generateOrderShippedEmail = (name: string, orderNum: string, total: string, address?: string, emirate?: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const totalNum = parseFloat(total) || 0
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const dir = isRTL ? 'rtl' : 'ltr'
    
    // Get shipped message - using a simple translated message with underlined "shipped"
    const shippedMessage = locale === 'ru' 
      ? 'Ваш заказ <span style="text-decoration: underline;">отправлен</span>.' 
      : locale === 'ar' 
      ? 'تم <span style="text-decoration: underline;">شحن</span> طلبك.' 
      : 'Your order has been <span style="text-decoration: underline;">shipped</span>.'
    
    return {
      subject: locale === 'ru' ? `Заказ отправлен #${orderNum} > Genosys Middle East FZ-LLC` : locale === 'ar' ? `تم شحن الطلب #${orderNum} > Genosys Middle East FZ-LLC` : `Order Shipped #${orderNum} > Genosys Middle East FZ-LLC`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0; text-align: ${textAlign};">${name},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: ${textAlign};">
            ${shippedMessage}
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: ${textAlign};">
              <a href="${siteUrl}/${locale === 'ar' ? 'ar/' : locale === 'ru' ? 'ru/' : ''}profile" style="color: #374151; text-decoration: none;">${t('orderEmail.orderDelivered.orderDetails')}</a>
            </h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t('orderEmail.orderDelivered.orderNumber')}</span> <strong style="color: #374151;">#${orderNum}</strong>
            </p>
            ${totalNum > 0 ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t('orderEmail.orderDelivered.total')}</span> <strong style="color: #374151;">AED ${totalNum.toFixed(2)}</strong>
            </p>
            ` : ''}
          </div>
          
          ${address || emirate ? `
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: ${textAlign};">${t('orderEmail.orderConfirmation.deliveryInformation')}</h3>
            ${address ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t('orderEmail.orderConfirmation.address')}</span> <strong style="color: #374151;">${address}</strong>
            </p>
            ` : ''}
            ${emirate ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t('orderEmail.orderConfirmation.emirate')}</span> <strong style="color: #374151;">${emirate}</strong>
            </p>
            ` : ''}
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I need help with my order #${orderNum}. Can you assist me?`)}" 
             style="background: #128C7E; 
                    color: white; 
                    padding: 10px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    font-size: 14px;
                    display: inline-block;
                    letter-spacing: 0.3px;">
            ${locale === 'ru' ? 'Свяжитесь с нами: WhatsApp' : locale === 'ar' ? 'اتصل بنا: WhatsApp' : 'Contact us: WhatsApp'}
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <a href="${siteUrl}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
            <img src="https://genosys.ae/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto; display: block;" />
          </a>
          <p style="color: #6b7280; font-size: 14px; margin: 8px 0;">
            ${t('orderEmail.orderDelivered.officialDistributor')}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
            ${t('orderEmail.orderDelivered.copyright')}
          </p>
        </div>
      </div>
    `
    }
  }

  // Generate order delivered email template
  const generateOrderDeliveredEmail = (name: string, orderNum: string, total: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
    const instagramIconUrl = `${baseUrl}/Logo/insta.png`
    const whatsappIconUrl = `${baseUrl}/Logo/wa.png`
    const facebookIconUrl = `${baseUrl}/Logo/fb.png`
    const totalNum = parseFloat(total) || 0
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const dir = isRTL ? 'rtl' : 'ltr'
    
    return {
      subject: t('orderEmail.orderDelivered.subject').replace('{orderNumber}', orderNum).replace('#{orderNumber}', orderNum),
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0; text-align: ${textAlign};">${name},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: ${textAlign};">
            ${t('orderEmail.orderDelivered.delivered')}
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: ${textAlign};">
              <a href="${siteUrl}/${locale === 'ar' ? 'ar/' : locale === 'ru' ? 'ru/' : ''}profile" style="color: #374151; text-decoration: none;">${t('orderEmail.orderDelivered.orderDetails')}</a>
            </h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t('orderEmail.orderDelivered.orderNumber')}</span> <strong style="color: #374151;">#${orderNum}</strong>
            </p>
            ${totalNum > 0 ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t('orderEmail.orderDelivered.total')}</span> <strong style="color: #374151;">AED ${totalNum.toFixed(2)}</strong>
            </p>
            ` : ''}
          </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">${t('orderEmail.orderDelivered.followUs')}</p>
          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
            <tr>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://www.instagram.com/genosys.uae/" style="text-decoration: none; display: inline-block;">
                  <img src="${instagramIconUrl}" alt="Instagram" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">${t('orderEmail.orderDelivered.insta')}</p>
                </a>
              </td>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I need help with my order #${orderNum}. Can you assist me?`)}" style="text-decoration: none; display: inline-block;">
                  <img src="${whatsappIconUrl}" alt="WhatsApp" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">${t('orderEmail.orderDelivered.whatsApp')}</p>
                </a>
              </td>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://www.facebook.com/genosys.ae" style="text-decoration: none; display: inline-block;">
                  <img src="${facebookIconUrl}" alt="Facebook" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">${t('orderEmail.orderDelivered.fb')}</p>
                </a>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <a href="${siteUrl}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
            <img src="https://genosys.ae/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto; display: block;" />
          </a>
          <p style="color: #6b7280; font-size: 14px; margin: 8px 0;">
            ${t('orderEmail.orderDelivered.officialDistributor')}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
            ${t('orderEmail.orderDelivered.copyright')}
          </p>
        </div>
      </div>
    `
    }
  }

  // Generate discount assignment email template
  const generateDiscountAssignedEmail = (name: string, discountType: 'CLINIC' | 'VIP', discountPercentage: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
    const instagramIconUrl = `${baseUrl}/Logo/insta.png`
    const whatsappIconUrl = `${baseUrl}/Logo/wa.png`
    const facebookIconUrl = `${baseUrl}/Logo/fb.png`
    const discountNum = parseFloat(discountPercentage) || 0
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const dir = isRTL ? 'rtl' : 'ltr'
    
    // Get discount type display name
    const discountTypeDisplay = discountNum < 50 ? 'VIP' : (discountType === 'CLINIC' ? (locale === 'ru' ? 'Клиника' : locale === 'ar' ? 'شريك العيادة' : 'Clinic Partner') : 'VIP')
    const discountOffText = locale === 'ru' ? 'СКИДКА' : locale === 'ar' ? 'خصم' : 'OFF'
    
    return {
      subject: t('orderEmail.discountAssigned.subject'),
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0; text-align: ${textAlign};">${name},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: ${textAlign};">
            ${t('orderEmail.discountAssigned.greeting')}
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: ${textAlign};">${t('orderEmail.discountAssigned.discountDetails')}</h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t('orderEmail.discountAssigned.type')}</span> <strong style="color: #374151;">${discountTypeDisplay}</strong>
            </p>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t('orderEmail.discountAssigned.discount')}</span> <strong style="color: #dc2626; font-size: 16px;">${discountNum}% ${discountOffText}</strong>
            </p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0; text-align: ${textAlign};">
            ${t('orderEmail.discountAssigned.explanation').replace('www.genosys.ae', '<a href="https://www.genosys.ae" style="color: #dc2626; text-decoration: none;">www.genosys.ae</a>')}
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/${locale === 'ar' ? 'ar/' : locale === 'ru' ? 'ru/' : ''}login" 
             style="background: #dc2626; 
                    color: white; 
                    padding: 10px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    font-size: 14px;
                    display: inline-block;
                    letter-spacing: 0.3px;">
            ${t('orderEmail.discountAssigned.loginButton')}
          </a>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">${t('orderEmail.discountAssigned.followUs')}</p>
          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
            <tr>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://www.instagram.com/genosys.uae/" style="text-decoration: none; display: inline-block;">
                  <img src="${instagramIconUrl}" alt="Instagram" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">${t('orderEmail.discountAssigned.insta')}</p>
                </a>
              </td>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I have a question about my ${discountNum < 50 ? 'VIP' : (discountType === 'CLINIC' ? 'clinic' : 'VIP')} discount. Can you assist me?`)}" style="text-decoration: none; display: inline-block;">
                  <img src="${whatsappIconUrl}" alt="WhatsApp" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">${t('orderEmail.discountAssigned.whatsApp')}</p>
                </a>
              </td>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://www.facebook.com/genosys.ae" style="text-decoration: none; display: inline-block;">
                  <img src="${facebookIconUrl}" alt="Facebook" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">${t('orderEmail.discountAssigned.fb')}</p>
                </a>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <a href="${siteUrl}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
            <img src="https://genosys.ae/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto; display: block;" />
          </a>
          <p style="color: #6b7280; font-size: 14px; margin: 8px 0;">
            ${t('orderEmail.discountAssigned.officialDistributor')}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
            ${t('orderEmail.discountAssigned.copyright')}
          </p>
        </div>
      </div>
    `
    }
  }

  // Generate COD order email template
  const generateCODEmail = (name: string, _email: string, phone: string, orderNum: string, _subtotal: string, _shipping: string, _vat: string, _total: string, address: string, emirate: string) => {
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const dir = isRTL ? 'rtl' : 'ltr'
    
    const subject = t('orderEmail.cod.subject', { orderNumber: orderNum }).replace('#{orderNumber}', orderNum).replace('{orderNumber}', orderNum)
    
    return {
      subject,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e5e5; padding-bottom: 20px;">
          <h1 style="color: #1f2937; margin: 0; font-size: 28px;">${t('orderEmail.cod.title', { orderNumber: orderNum }).replace('#{orderNumber}', orderNum).replace('{orderNumber}', orderNum)}</h1>
          <p style="color: #6b7280; margin: 5px 0; font-size: 16px;">${t('orderEmail.cod.dated')} ${new Date().toLocaleDateString(locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-AE' : 'en-AE', { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
        </div>
        
        <div style="background: white; border: 1px solid #e5e7eb; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
            ${t('orderEmail.cod.thankYou', { customerName: name.split(' ')[0] || name })}
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
            ${t('orderEmail.cod.orderReceived', { orderNumber: orderNum })}
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0; text-align: ${textAlign};">
            ${t('orderEmail.cod.teamContact')}
          </p>
        </div>
        
        <div style="background: white; border: 1px solid #e5e5e5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; text-align: ${textAlign};">${t('orderEmail.cod.orderItems')}</h3>
          <p style="color: #374151; margin: 0; text-align: ${textAlign};">${orderItems}</p>
        </div>
        
        <div style="background: white; border: 1px solid #e5e5e5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; text-align: ${textAlign};">${t('orderEmail.cod.deliveryInformation')}</h3>
          <p style="color: #374151; margin: 0 0 10px 0; font-size: 16px; text-align: ${textAlign};"><strong>${t('orderEmail.cod.name')}</strong> ${name}</p>
          <p style="color: #374151; margin: 0 0 10px 0; font-size: 16px; text-align: ${textAlign};"><strong>${t('orderEmail.cod.phone')}</strong> ${phone}</p>
          <p style="color: #374151; margin: 0 0 10px 0; font-size: 16px; text-align: ${textAlign};"><strong>${t('orderEmail.cod.address')}</strong> ${address}</p>
          <p style="color: #374151; margin: 0; font-size: 16px; text-align: ${textAlign};"><strong>${t('orderEmail.cod.emirate')}</strong> ${emirate}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wa.me/971585487665" 
             style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;">
            ${t('orderEmail.cod.contactSupport')}
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #000000; font-size: 14px;">
          <div style="text-align: center; margin-bottom: 15px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
              <img src="https://genosys.ae/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto; display: block;" />
            </a>
          </div>
          <p style="color: #000000; margin: 0;">${t('orderEmail.cod.officialDistributor')}</p>
          <p style="color: #000000; margin: 0;">${t('orderEmail.cod.copyright')}</p>
        </div>
      </div>
    `
    }
  }

  // Generate Support Link order email template
  const generateSupportLinkEmail = (name: string, email: string, phone: string, orderNum: string, _subtotal: string, _shipping: string, _vat: string, _total: string, address: string, emirate: string) => {
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const dir = isRTL ? 'rtl' : 'ltr'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const productsUrl = locale === 'ar' ? `${siteUrl}/ar/products` : locale === 'ru' ? `${siteUrl}/ru/products` : `${siteUrl}/products`
    const contactUrl = locale === 'ar' ? `${siteUrl}/ar/contact` : locale === 'ru' ? `${siteUrl}/ru/contact` : `${siteUrl}/contact`
    
    return {
      subject: t('orderEmail.supportLink.subject', { orderNumber: orderNum }).replace('#{orderNumber}', orderNum).replace('{orderNumber}', orderNum),
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; font-size: 14px; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0; font-size: 14px;">${t('orderEmail.supportLink.companyName')}</h1>
          <p style="color: #666; margin: 5px 0; font-size: 14px;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
            ${t('orderEmail.supportLink.dear', { customerName: name.split(' ')[0] || name })}
          </p>
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
            ${t('orderEmail.supportLink.orderSubmitted')}
          </p>
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; text-align: ${textAlign};">
            ${t('orderEmail.supportLink.orderRequest', { orderNumber: orderNum })}
          </p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">${t('orderEmail.supportLink.customerInformation')}</h3>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t('orderEmail.supportLink.name')}</strong> ${name}</p>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t('orderEmail.supportLink.email')}</strong> ${email}</p>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t('orderEmail.supportLink.phone')}</strong> ${phone}</p>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t('orderEmail.supportLink.address')}</strong> ${address}</p>
          <p style="margin: 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t('orderEmail.supportLink.emirate')}</strong> ${emirate}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">${t('orderEmail.supportLink.orderItems')}</h3>
          <p style="color: #374151; margin: 0; text-align: ${textAlign};">${orderItems}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${productsUrl}" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block; 
                    margin-${isRTL ? 'left' : 'right'}: 10px;">
            ${t('orderEmail.supportLink.continueShopping')}
          </a>
          <a href="${contactUrl}" 
             style="background: transparent; 
                    color: #16a34a; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border: 2px solid #16a34a; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;">
            ${t('orderEmail.supportLink.contactSupport')}
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #000000; font-size: 14px;">
          <p style="color: #000000; margin: 0;">${t('orderEmail.supportLink.officialDistributorFooter') || t('orderEmail.supportLink.officialDistributor')}</p>
          <p style="color: #000000; margin: 0;">© 2026 Genosys Middle East FZ-LLC. All rights reserved.</p>
        </div>
      </div>
    `
    }
  }

  // Generate Stripe Payment Confirmation email template
  const generateStripePaymentConfirmationEmail = (name: string, email: string, phone: string, orderNum: string, _subtotal: string, _shipping: string, _vat: string, total: string, address: string, emirate: string) => {
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const dir = isRTL ? 'rtl' : 'ltr'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const totalNum = parseFloat(total) || 0

    const productsUrl = locale === 'ar' ? `${siteUrl}/ar/products` : locale === 'ru' ? `${siteUrl}/ru/products` : `${siteUrl}/products`
    const contactUrl = locale === 'ar' ? `${siteUrl}/ar/contact` : locale === 'ru' ? `${siteUrl}/ru/contact` : `${siteUrl}/contact`

    return {
      subject: `Payment Confirmed - Order #${orderNum}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; font-size: 14px; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0; font-size: 18px;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0; font-size: 14px;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <!-- Payment Success Banner -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <h2 style="color: white; margin: 0; font-size: 20px;">✅ Payment Confirmed!</h2>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; text-align: ${textAlign};">
            Dear <strong>${name.split(' ')[0] || name}</strong>,
          </p>
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
            Thank you! Your payment has been successfully received and your order is confirmed.
          </p>
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
            Order Confirmed <span style="color: #dc2626; font-weight: bold;">#${orderNum}</span>
          </p>
          <p style="color: #10b981; font-size: 14px; line-height: 1.6; margin: 0; text-align: ${textAlign}; font-weight: bold;">
            Payment Method: Stripe (Online Payment)
          </p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">Customer Information</h3>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>Name:</strong> ${name}</p>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>Phone:</strong> ${phone}</p>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>Address:</strong> ${address}</p>
          <p style="margin: 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>Emirate:</strong> ${emirate}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">Order Items</h3>
          <p style="color: #374151; margin: 0; text-align: ${textAlign};">${orderItems}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">Order Summary</h3>
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; color: #10b981; border-top: 2px solid #10b981; padding-top: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
            <span>Total Paid:</span>
            <span>AED ${totalNum.toFixed(2)}</span>
          </div>
        </div>

        <!-- Next Steps Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e9ecef;">
          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px; text-align: ${textAlign};">What happens next?</h3>
          <ul style="color: #374151; font-size: 14px; line-height: 1.6; padding-left: ${isRTL ? '0' : '20px'}; padding-right: ${isRTL ? '20px' : '0'}; text-align: ${textAlign};">
            <li style="margin-bottom: 8px;">We are now processing your order and will ship it within 1-2 business days.</li>
            <li>You will receive tracking information once your order ships.</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${productsUrl}" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block; 
                    margin-${isRTL ? 'left' : 'right'}: 10px;">
            Continue Shopping
          </a>
          <a href="${contactUrl}" 
             style="background: transparent; 
                    color: #16a34a; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border: 2px solid #16a34a; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;">
            Contact Support
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #000000; font-size: 14px;">
          <div style="text-align: center; margin-bottom: 15px;">
            <img src="https://genosys.ae/_next/image?url=%2FLogo%2FFull.png&w=640&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
          </div>
          <p style="color: #000000; margin: 0;">Official Distributor in the UAE</p>
          <p style="color: #000000; margin: 0;">© 2026 Genosys Middle East FZ-LLC. All rights reserved.</p>
        </div>
      </div>
    `
    }
  }

  // Generate order confirmed email template
  const generateOrderConfirmedEmail = (name: string, orderNum: string, total: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const totalNum = parseFloat(total) || 0
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const dir = isRTL ? 'rtl' : 'ltr'
    
    return {
      subject: t('orderEmail.orderConfirmation.subject', { orderNumber: orderNum }).replace('#{orderNumber}', orderNum).replace('{orderNumber}', orderNum),
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0; text-align: ${textAlign};">${name},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: ${textAlign};">
            ${t('orderEmail.orderConfirmation.orderReceived', { orderNumber: orderNum })}
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: ${textAlign};">
              <a href="${siteUrl}/${locale === 'ar' ? 'ar/' : locale === 'ru' ? 'ru/' : ''}profile" style="color: #374151; text-decoration: none;">${t('orderEmail.orderConfirmation.orderDetails')}</a>
            </h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t('orderEmail.orderDelivered.orderNumber')}</span> <strong style="color: #374151;">#${orderNum}</strong>
            </p>
            ${totalNum > 0 ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t('orderEmail.orderDelivered.total')}</span> <strong style="color: #374151;">AED ${totalNum.toFixed(2)}</strong>
            </p>
            ` : ''}
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I need help with my order #${orderNum}. Can you assist me?`)}" 
             style="background: #128C7E; 
                    color: white; 
                    padding: 10px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    font-size: 14px;
                    display: inline-block;
                    letter-spacing: 0.3px;">
            ${locale === 'ru' ? 'Свяжитесь с нами: WhatsApp' : locale === 'ar' ? 'اتصل بنا: WhatsApp' : 'Contact us: WhatsApp'}
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <a href="${siteUrl}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
            <img src="https://genosys.ae/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto; display: block;" />
          </a>
          <p style="color: #6b7280; font-size: 14px; margin: 8px 0;">
            ${t('orderEmail.orderConfirmation.officialDistributor')}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
            ${t('orderEmail.orderDelivered.copyright')}
          </p>
        </div>
      </div>
    `
    }
  }

  const getTemplate = () => {
    if (designVariant === 'v2-minimal') {
      return getV2Template()
    }
    switch (templateType) {
      case 'welcome':
        return generateWelcomeEmail(userName, userEmail, password)
      case 'order-shipped':
        return generateOrderShippedEmail(userName, orderNumber, orderTotal, deliveryAddress, deliveryEmirate)
      case 'order-confirmed':
        return generateOrderConfirmedEmail(userName, orderNumber, orderTotal)
      case 'order-delivered':
        return generateOrderDeliveredEmail(userName, orderNumber, orderTotal)
      case 'discount-assigned':
        return generateDiscountAssignedEmail(userName, discountType, discountPercentage)
      case 'cod':
        return generateCODEmail(userName, userEmail, userPhone, orderNumber, orderSubtotal, orderShipping, orderVat, orderTotal, deliveryAddress, deliveryEmirate)
      case 'support-link':
        return generateSupportLinkEmail(userName, userEmail, userPhone, orderNumber, orderSubtotal, orderShipping, orderVat, orderTotal, deliveryAddress, deliveryEmirate)
      case 'stripe-payment-confirmation':
        return generateStripePaymentConfirmationEmail(userName, userEmail, userPhone, orderNumber, orderSubtotal, orderShipping, orderVat, orderTotal, deliveryAddress, deliveryEmirate)
      default:
        return generateOrderShippedEmail(userName, orderNumber, orderTotal)
    }
  }

  const template = getTemplate()

  const getTemplateName = () => {
    switch (templateType) {
      case 'welcome':
        return 'Welcome Email (Registration Confirmation)'
      case 'order-shipped':
        return 'Order Shipped Email'
      case 'order-confirmed':
        return 'Order Confirmed Email'
      case 'order-delivered':
        return 'Order Delivered Email'
      case 'discount-assigned':
        return 'Discount Assignment Email'
      case 'cod':
        return 'COD Order Confirmation Email'
      case 'support-link':
        return 'Support Link Order Request Email'
      case 'stripe-payment-confirmation':
        return 'Stripe Payment Confirmation Email'
      default:
        return 'Order Shipped Email'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Template Preview</h1>
          <p className="text-gray-600 mb-4">
            Preview and customize email templates for Genosys Middle East FZ-LLC
          </p>
          
          {/* Language Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language / اللغة / Язык
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setLocale('en')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  locale === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLocale('ru')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  locale === 'ru'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Русский
              </button>
              <button
                onClick={() => setLocale('ar')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  locale === 'ar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Design Variant */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Design
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setDesignVariant('current')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  designVariant === 'current'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Current
              </button>
              <button
                onClick={() => setDesignVariant('v2-minimal')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  designVariant === 'v2-minimal'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                V2 Minimal (recommended)
              </button>
              <div className="text-sm text-gray-500 flex items-center">
                Uses the “Order Delivered” style as the base and unifies wording/layout across all templates.
              </div>
            </div>
          </div>

          {/* Template Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Type
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTemplateType('order-shipped')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  templateType === 'order-shipped'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Order Shipped
              </button>
              <button
                onClick={() => setTemplateType('order-confirmed')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  templateType === 'order-confirmed'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Order Confirmed
              </button>
              <button
                onClick={() => setTemplateType('order-delivered')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  templateType === 'order-delivered'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Order Delivered
              </button>
              <button
                onClick={() => setTemplateType('welcome')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  templateType === 'welcome'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Welcome Email
              </button>
              <button
                onClick={() => setTemplateType('discount-assigned')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  templateType === 'discount-assigned'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Discount Assigned
              </button>
              <button
                onClick={() => setTemplateType('cod')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  templateType === 'cod'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                COD Order
              </button>
              <button
                onClick={() => setTemplateType('support-link')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  templateType === 'support-link'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Support Link
              </button>
              <button
                onClick={() => setTemplateType('stripe-payment-confirmation')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  templateType === 'stripe-payment-confirmation'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Stripe Payment Confirmation
              </button>
            </div>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Email
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter customer email"
              />
            </div>
            
            {templateType === 'welcome' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter password"
                />
              </div>
            )}
            
            {(templateType === 'order-shipped' || templateType === 'order-confirmed' || templateType === 'order-delivered' || templateType === 'cod' || templateType === 'support-link') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter order number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Total (AED)
                  </label>
                  <input
                    type="text"
                    value={orderTotal}
                    onChange={(e) => setOrderTotal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter order total"
                  />
                </div>
                
                {(templateType === 'cod' || templateType === 'support-link') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Phone
                      </label>
                      <input
                        type="text"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtotal (AED)
                      </label>
                      <input
                        type="text"
                        value={orderSubtotal}
                        onChange={(e) => setOrderSubtotal(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter subtotal"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping (AED)
                      </label>
                      <input
                        type="text"
                        value={orderShipping}
                        onChange={(e) => setOrderShipping(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter shipping cost"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        VAT (AED)
                      </label>
                      <input
                        type="text"
                        value={orderVat}
                        onChange={(e) => setOrderVat(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter VAT amount"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Items
                      </label>
                      <input
                        type="text"
                        value={orderItems}
                        onChange={(e) => setOrderItems(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter order items"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter delivery address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emirate
                      </label>
                      <input
                        type="text"
                        value={deliveryEmirate}
                        onChange={(e) => setDeliveryEmirate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter emirate"
                      />
                    </div>
                  </>
                )}
                
                {templateType === 'order-shipped' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter delivery address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emirate
                      </label>
                      <input
                        type="text"
                        value={deliveryEmirate}
                        onChange={(e) => setDeliveryEmirate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter emirate"
                      />
                    </div>
                  </>
                )}
              </>
            )}
            
            {templateType === 'discount-assigned' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'CLINIC' | 'VIP')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="CLINIC">CLINIC</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter discount percentage"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Email Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Email Header Bar */}
          <div className="bg-gray-200 px-4 py-3 border-b border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 ml-3 font-medium">Email Preview</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Subject:</span> {template.subject}
              </div>
            </div>
          </div>
          
          {/* Email Content */}
          <div className="p-8 bg-white">
            <div 
              className="max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: template.html }}
            />
          </div>
        </div>

        {/* Email Details */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Email Details</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Subject:</span>
              <span className="ml-2 text-gray-600">{template.subject}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Recipient:</span>
              <span className="ml-2 text-gray-600">{userEmail}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Template:</span>
              <span className="ml-2 text-gray-600">{getTemplateName()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
