'use client'

import { useState, useMemo } from 'react'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

type TemplateType = 'welcome' | 'order-shipped' | 'order-confirmed' | 'order-delivered' | 'discount-assigned' | 'cod' | 'support-link'
type Locale = 'en' | 'ru' | 'ar'

export default function EmailTemplatePage() {
  const [templateType, setTemplateType] = useState<TemplateType>('order-shipped')
  const [locale, setLocale] = useState<Locale>('en')
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
