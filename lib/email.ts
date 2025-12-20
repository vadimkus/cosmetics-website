import { debugLog, errorLog } from '@/lib/logger'
import nodemailer from 'nodemailer'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getPreferredEmail } from '@/lib/emailHelpers'

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
  }>
  subtotal: number
  shipping: number
  vat: number
  total: number
  address: string
  emirate: string
  locale?: string
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
  // Welcome email for new user registration
  welcomeUser: (userName: string, userEmail: string, password?: string) => ({
    subject: 'Account details > Genosys Middle East FZ-LLC',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0;">Welcome, ${userName}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Registration is done. Thank you for joining.
          </p>
          ${password ? `
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Account details:</h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">login:</span> <strong style="color: #374151;">${userEmail}</strong>
            </p>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">password:</span> <strong style="color: #374151; font-family: 'Courier New', monospace; letter-spacing: 0.5px;">${password}</strong>
            </p>
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" 
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
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
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
    `,
  }),

  // Order shipped email (based on welcome template design)
  orderShipped: (orderData: { orderNumber: string; customerName: string; customerEmail: string; items?: Array<{ productName: string; quantity: number; price: number; image?: string }>; total?: number; customerAddress?: string; customerEmirate?: string }) => ({
    subject: `Order Shipped #${orderData.orderNumber} > Genosys Middle East FZ-LLC`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0;">${orderData.customerName},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Your order has been <u>shipped.</u>
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile" style="color: #374151; text-decoration: none;">Order details:</a>
            </h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Order number:</span> <strong style="color: #374151;">#${orderData.orderNumber}</strong>
            </p>
            ${orderData.total ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Total:</span> <strong style="color: #374151;">AED ${orderData.total.toFixed(2)}</strong>
            </p>
            ` : ''}
          </div>
          
          ${orderData.customerAddress || orderData.customerEmirate ? `
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Delivery info:</h3>
            ${orderData.customerAddress ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Address:</span> <strong style="color: #374151;">${orderData.customerAddress}</strong>
            </p>
            ` : ''}
            ${orderData.customerEmirate ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Emirate:</span> <strong style="color: #374151;">${orderData.customerEmirate}</strong>
            </p>
            ` : ''}
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I need help with my order #${orderData.orderNumber}. Can you assist me?`)}" 
             style="background: #128C7E; 
                    color: white; 
                    padding: 10px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    font-size: 14px;
                    display: inline-block;
                    letter-spacing: 0.3px;">
            Contact us: WhatsApp
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
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
    `,
  }),

  // Order confirmed email (based on welcome template design)
  orderConfirmed: (orderData: { orderNumber: string; customerName: string; customerEmail: string; items?: Array<{ productName: string; quantity: number; price: number; image?: string }>; total?: number }) => ({
    subject: `Order Confirmed #${orderData.orderNumber} > Genosys Middle East FZ-LLC`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0;">${orderData.customerName},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Your order has been received and is being <u>processed.</u>
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile" style="color: #374151; text-decoration: none;">Order details:</a>
            </h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Order number:</span> <strong style="color: #374151;">#${orderData.orderNumber}</strong>
            </p>
            ${orderData.total ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Total:</span> <strong style="color: #374151;">AED ${orderData.total.toFixed(2)}</strong>
            </p>
            ` : ''}
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I need help with my order #${orderData.orderNumber}. Can you assist me?`)}" 
             style="background: #128C7E; 
                    color: white; 
                    padding: 10px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    font-size: 14px;
                    display: inline-block;
                    letter-spacing: 0.3px;">
            Contact us: WhatsApp
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
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
    `,
  }),

  // Order delivered email (based on welcome template design)
  orderDelivered: (orderData: { orderNumber: string; customerName: string; customerEmail: string; items?: Array<{ productName: string; quantity: number; price: number; image?: string }>; total?: number; locale?: string }) => {
    const locale = orderData.locale || 'en'
    let t: any
    try {
      if (locale === 'ar') {
        t = require('@/messages/ar.json').orderEmail.orderDelivered
      } else if (locale === 'ru') {
        t = require('@/messages/ru.json').orderEmail.orderDelivered
      } else {
        t = require('@/messages/en.json').orderEmail.orderDelivered
      }
    } catch (error) {
      t = require('@/messages/en.json').orderEmail.orderDelivered
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
    const instagramIconUrl = `${baseUrl}/Logo/insta.png`
    const whatsappIconUrl = `${baseUrl}/Logo/wa.png`
    const facebookIconUrl = `${baseUrl}/Logo/fb.png`
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const dir = isRTL ? 'rtl' : 'ltr'
    
    return {
    subject: t.subject.replace('{orderNumber}', orderData.orderNumber).replace('#{orderNumber}', orderData.orderNumber),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0; text-align: ${textAlign};">${orderData.customerName},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: ${textAlign};">
            ${t.delivered}
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: ${textAlign};">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${locale === 'ar' ? 'ar/' : locale === 'ru' ? 'ru/' : ''}profile" style="color: #374151; text-decoration: none;">${t.orderDetails}</a>
            </h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t.orderNumber}</span> <strong style="color: #374151;">#${orderData.orderNumber}</strong>
            </p>
            ${orderData.total ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t.total}</span> <strong style="color: #374151;">AED ${orderData.total.toFixed(2)}</strong>
            </p>
            ` : ''}
          </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">${t.followUs}</p>
          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
            <tr>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://www.instagram.com/genosys.uae/" style="text-decoration: none; display: inline-block;">
                  <img src="${instagramIconUrl}" alt="Instagram" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">Insta</p>
                </a>
              </td>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I need help with my order #${orderData.orderNumber}. Can you assist me?`)}" style="text-decoration: none; display: inline-block;">
                  <img src="${whatsappIconUrl}" alt="WhatsApp" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">WhatsApp</p>
                </a>
              </td>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://www.facebook.com/genosys.ae" style="text-decoration: none; display: inline-block;">
                  <img src="${facebookIconUrl}" alt="Facebook" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">FB</p>
                </a>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
            <img src="https://genosys.ae/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto; display: block;" />
          </a>
          <p style="color: #6b7280; font-size: 14px; margin: 8px 0;">
            ${t.officialDistributor}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
            ${t.copyright}
          </p>
        </div>
      </div>
    `
    }
  },

  // Discount assignment email (based on order shipped template design)
  discountAssigned: (discountData: { customerName: string; customerEmail: string; discountType: 'CLINIC' | 'VIP'; discountPercentage: number; locale?: string }) => {
    const locale = discountData.locale || 'en'
    let t: any
    try {
      if (locale === 'ar') {
        t = require('@/messages/ar.json').orderEmail.discountAssigned
      } else if (locale === 'ru') {
        t = require('@/messages/ru.json').orderEmail.discountAssigned
      } else {
        t = require('@/messages/en.json').orderEmail.discountAssigned
      }
    } catch (error) {
      t = require('@/messages/en.json').orderEmail.discountAssigned
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
    const instagramIconUrl = `${baseUrl}/Logo/insta.png`
    const whatsappIconUrl = `${baseUrl}/Logo/wa.png`
    const facebookIconUrl = `${baseUrl}/Logo/fb.png`
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const dir = isRTL ? 'rtl' : 'ltr'
    
    return {
    subject: t.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0; text-align: ${textAlign};">${discountData.customerName},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: ${textAlign};">
            ${t.greeting}
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: ${textAlign};">${t.discountDetails}</h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t.type}</span> <strong style="color: #374151;">${discountData.discountPercentage < 50 ? 'VIP' : (discountData.discountType === 'CLINIC' ? (locale === 'ru' ? 'Клиника' : locale === 'ar' ? 'شريك العيادة' : 'Clinic Partner') : 'VIP')}</strong>
            </p>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0; text-align: ${textAlign};">
              <span style="color: #9ca3af;">${t.discount}</span> <strong style="color: #dc2626; font-size: 16px;">${discountData.discountPercentage}% ${locale === 'ru' ? 'СКИДКА' : locale === 'ar' ? 'خصم' : 'OFF'}</strong>
            </p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0; text-align: ${textAlign};">
            ${t.discountInfo} <a href="https://www.genosys.ae" style="color: #dc2626; text-decoration: none;">www.genosys.ae</a>
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${locale === 'ar' ? 'ar/' : locale === 'ru' ? 'ru/' : ''}login" 
             style="background: #dc2626; 
                    color: white; 
                    padding: 10px 24px; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    font-size: 14px;
                    display: inline-block;
                    letter-spacing: 0.3px;">
            ${t.login}
          </a>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">${t.followUs}</p>
          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
            <tr>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://www.instagram.com/genosys.uae/" style="text-decoration: none; display: inline-block;">
                  <img src="${instagramIconUrl}" alt="Instagram" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">Insta</p>
                </a>
              </td>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I have a question about my ${discountData.discountPercentage < 50 ? 'VIP' : (discountData.discountType === 'CLINIC' ? 'clinic' : 'VIP')} discount. Can you assist me?`)}" style="text-decoration: none; display: inline-block;">
                  <img src="${whatsappIconUrl}" alt="WhatsApp" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">WhatsApp</p>
                </a>
              </td>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://www.facebook.com/genosys.ae" style="text-decoration: none; display: inline-block;">
                  <img src="${facebookIconUrl}" alt="Facebook" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">FB</p>
                </a>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
            <img src="https://genosys.ae/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto; display: block;" />
          </a>
          <p style="color: #6b7280; font-size: 14px; margin: 8px 0;">
            ${t.officialDistributor}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
            ${t.copyright}
          </p>
        </div>
      </div>
    `
    }
  },

  // Order confirmation email
  orderConfirmation: (orderData: OrderConfirmationEmailData) => {
    const locale = orderData.locale || 'en'
    let t: any
    try {
      if (locale === 'ar') {
        t = require('@/messages/ar.json').orderEmail.orderConfirmation
      } else if (locale === 'ru') {
        t = require('@/messages/ru.json').orderEmail.orderConfirmation
      } else {
        t = require('@/messages/en.json').orderEmail.orderConfirmation
      }
    } catch (error) {
      t = require('@/messages/en.json').orderEmail.orderConfirmation
    }
    
    const isRTL = locale === 'ar'
    const textAlign = isRTL ? 'right' : 'left'
    const dir = isRTL ? 'rtl' : 'ltr'
    const flexDirection = isRTL ? 'row-reverse' : 'row'
    
    return {
    subject: t.subject.replace('{orderNumber}', orderData.orderNumber).replace('#{orderNumber}', orderData.orderNumber),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #16a34a; margin: 0 0 15px 0; text-align: ${textAlign};">${t.orderConfirmed}</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
            ${t.thankYou.replace('{customerName}', `<strong>${orderData.customerName}</strong>`)}
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
            ${t.orderReceived.replace('{orderNumber}', `<strong>#${orderData.orderNumber}</strong>`).replace('#{orderNumber}', `<strong>#${orderData.orderNumber}</strong>`)}
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0; text-align: ${textAlign};">
            ${t.teamContact}
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; text-align: ${textAlign};">${t.orderDetails}</h3>
          <div style="margin-bottom: 20px;">
            ${orderData.items.map(item => {
              // Construct image URL - handle both absolute and relative paths
              let imageUrl = ''
              if (item.image) {
                if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
                  imageUrl = item.image // Already absolute
                } else if (item.image.startsWith('//')) {
                  imageUrl = `https:${item.image}` // Protocol-relative
                } else {
                  // Relative path - prepend domain
                  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
                  imageUrl = `${baseUrl}${item.image.startsWith('/') ? item.image : '/' + item.image}`
                }
              }
              
              return `
              <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e7eb; flex-direction: ${flexDirection};">
                ${imageUrl ? `
                <img src="${imageUrl}" alt="${item.productName}" width="60" height="60" border="0" style="display: block; width: 60px; height: 60px; object-fit: cover; border-radius: 6px; ${isRTL ? 'margin-left' : 'margin-right'}: 15px;" />
                ` : `<div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 6px; ${isRTL ? 'margin-left' : 'margin-right'}: 15px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 24px;">📦</div>`}
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0; color: #374151; font-size: 14px; text-align: ${textAlign};">${item.productName}</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: ${textAlign};">${t.qty} ${item.quantity}${item.size ? ` | ${t.size} ${item.size}` : ''}${item.color ? ` | ${t.color} ${item.color}` : ''}</p>
                </div>
                <div style="text-align: ${isRTL ? 'left' : 'right'};">
                  <p style="margin: 0; color: #dc2626; font-weight: bold;">AED ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            `
            }).join('')}
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${flexDirection};">
              <span style="color: #374151;">${t.subtotal}</span>
              <span style="color: #374151;">AED ${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${flexDirection};">
              <span style="color: #374151;">${t.shipping}</span>
              <span style="color: #374151;">AED ${orderData.shipping.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${flexDirection};">
              <span style="color: #374151;">${t.vat}</span>
              <span style="color: #374151;">AED ${orderData.vat.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 8px; flex-direction: ${flexDirection};">
              <span>${t.total}</span>
              <span>AED ${orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; text-align: ${textAlign};">${t.deliveryInformation}</h3>
          <p style="color: #374151; margin: 0 0 10px 0; text-align: ${textAlign};"><strong>${t.address}</strong> ${orderData.address}</p>
          <p style="color: #374151; margin: 0; text-align: ${textAlign};"><strong>${t.emirate}</strong> ${orderData.emirate}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${locale === 'ar' ? 'ar/' : locale === 'ru' ? 'ru/' : ''}profile" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;">
            ${t.trackOrder}
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <div style="text-align: center; margin-bottom: 15px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'}/products" style="display: block; margin: 0 auto 15px; max-width: 170px;">
              <img src="https://genosys.ae/_next/image?url=%2FLogo%2FupLOGO.png&w=384&q=75" alt="Genosys Logo" style="max-width: 170px; height: auto; margin: 0 auto; display: block;" />
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: ${textAlign};">
            ${t.questions} <a href="mailto:sales@genosys.ae" style="color: #dc2626;">sales@genosys.ae</a>
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0; text-align: ${textAlign};">
            ${t.officialDistributor}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0; text-align: ${textAlign};">
            ${t.copyright}
          </p>
        </div>
      </div>
    `
    }
  },

  // Admin notification for new user
  adminNewUser: (userName: string, userEmail: string, userPhone?: string, userAddress?: string, registrationMethod?: string) => ({
    subject: `New User Registration: ${userName}${registrationMethod ? ` (${registrationMethod})` : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">New User Registration</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          ${userPhone ? `<p><strong>Phone:</strong> ${userPhone}</p>` : ''}
          ${userAddress ? `<p><strong>Address:</strong> ${userAddress}</p>` : ''}
          ${registrationMethod ? `<p><strong>Registration Method:</strong> ${registrationMethod}</p>` : ''}
          <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  }),

  // Admin notification for new order
  adminNewOrder: (orderData: AdminNewOrderEmailData) => ({
    subject: `New Order #${orderData.orderNumber} - ${orderData.customerName} - AED ${orderData.total.toFixed(2)}`,
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
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'}/admin" 
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
            <img src="https://genosys.ae/Logo/Full.png" 
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
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'}/products" 
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
            <img src="https://genosys.ae/Logo/Full.png" 
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

  passwordReset: (userName: string, resetToken: string) => {
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'}/reset-password/${resetToken}`
    return {
      subject: 'Reset Your Password - Genosys Middle East FZ-LLC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
            <p style="color: #666; margin: 5px 0;">Official Genosys distributor in the United Arab Emirates</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h2 style="color: #dc2626; margin: 0 0 15px 0;">Password Reset Request</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Dear ${(userName || 'User').split(' ')[0]},
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Click the button below to reset your Genosys password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                        color: white; 
                        padding: 14px 32px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: bold; 
                        display: inline-block;
                        font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 5px 0; word-break: break-all;">
              ${resetUrl}
            </p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 600;">
                ⏰ This link will expire in 30 minutes.
              </p>
            </div>
            
            <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #991b1b; font-size: 14px; margin: 0;">
                <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Never share this link with anyone. GENOSYS will never ask for your password.
              </p>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Need help? Contact us at <a href="mailto:sales@genosys.ae" style="color: #dc2626;">sales@genosys.ae</a>
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
              Genosys Middle East FZ-LLC - Official Genosys distributor in the United Arab Emirates
            </p>
          </div>
        </div>
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
    if (error && typeof error === 'object' && 'code' in error) {
      errorLog('❌ Error code:', (error as any).code)
      errorLog('❌ Error command:', (error as any).command)
    }
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Specific email functions
export const sendWelcomeEmail = async (userName: string, userEmail: string, password?: string) => {
  const template = emailTemplates.welcomeUser(userName, userEmail, password)
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
  const template = emailTemplates.orderConfirmation(orderData)
  return await sendEmail(orderData.customerEmail, template.subject, template.html)
}

export const sendAdminNewUserNotification = async (userName: string, userEmail: string, userPhone?: string, userAddress?: string, registrationMethod?: string) => {
  // Use ADMIN_EMAIL, or fallback to GMAIL_USER/EMAIL_USER, or use default
  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER || '5856825@gmail.com'
  
  debugLog(`📧 ===== ADMIN NEW USER NOTIFICATION =====`)
  debugLog(`📧 Sending admin new user notification to: ${adminEmail}`)
  debugLog(`📧 User: ${userName} (${userEmail})`)
  debugLog(`📧 Registration method: ${registrationMethod || 'Unknown'}`)
  debugLog(`📧 Admin email sources - ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'NOT_SET'}, GMAIL_USER: ${process.env.GMAIL_USER || 'NOT_SET'}, EMAIL_USER: ${process.env.EMAIL_USER || 'NOT_SET'}`)
  debugLog(`📧 GMAIL_APP_PASSWORD: ${process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT_SET'}`)
  
  const template = emailTemplates.adminNewUser(userName, userEmail, userPhone, userAddress, registrationMethod)
  
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
    
    debugLog(`📧 Sending admin new order notification to: ${adminEmail}`)
    debugLog(`📧 Admin email sources - ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'NOT_SET'}, GMAIL_USER: ${process.env.GMAIL_USER || 'NOT_SET'}, EMAIL_USER: ${process.env.EMAIL_USER || 'NOT_SET'}`)
    debugLog(`📧 Order data for admin notification:`, JSON.stringify({
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      total: orderData.total,
      itemCount: orderData.itemCount
    }, null, 2))
    
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

export const sendPasswordResetEmail = async (userEmail: string, userName: string, resetToken: string) => {
  const template = emailTemplates.passwordReset(userName, resetToken)
  debugLog(`📧 Sending password reset email to: ${userEmail}`)
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
}

// Order HTML template generation functions
export const generateCODOrderHTML = (order: OrderHTMLData, locale: string = 'en', translations?: any): string => {
  // Load translations if not provided
  let t: any
  if (translations) {
    t = translations
  } else {
    // Fallback: load translations synchronously (not ideal, but works)
    try {
      if (locale === 'ar') {
        t = require('@/messages/ar.json').orderEmail.cod
      } else {
        t = require('@/messages/en.json').orderEmail.cod
      }
    } catch (error) {
      // Fallback to English if translations fail to load
      t = {
        title: `Order Confirmation #${order.orderNumber}`,
        dated: 'dated:',
        thankYou: `Thank you for your order, {customerName}!`,
        orderReceived: `Your order #${order.orderNumber} has been received and is being processed. You will pay via Cash on Delivery when your order arrives.`,
        teamContact: 'Our team will be in touch with you for the next steps via phone/mail/whatsapp.',
        orderItems: 'Order Items',
        product: 'Product',
        qty: 'Qty',
        price: 'Price',
        total: 'Total',
        size: 'Size:',
        color: 'Color:',
        subtotal: 'Subtotal:',
        shippingTo: `Shipping to {emirate}:`,
        free: 'FREE',
        vat: 'VAT (5%):',
        totalLabel: 'Total:',
        deliveryInformation: 'Delivery Information',
        name: 'Name:',
        phone: 'Phone:',
        address: 'Address:',
        emirate: 'Emirate:',
        contactSupport: 'Contact Support via WhatsApp',
        officialDistributor: 'Official Distributor in the UAE',
        copyright: '© 2025 Genosys Middle East FZ-LLC. All rights reserved.'
      }
    }
  }

  const isRTL = locale === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'
  const textAlign = isRTL ? 'right' : 'left'
  const dateLocale = locale === 'ar' ? 'ar-AE' : 'en-AE'

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; direction: ${dir};">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e5e5; padding-bottom: 20px;">
        <div style="margin-bottom: 15px;">
          <img src="https://genosys.ae/_next/image?url=%2Fimages%2Fgenosys-logo.png%3Fv%3D1758554698129&w=828&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto;" />
        </div>
        <h1 style="color: #1f2937; margin: 0; font-size: 28px;">${(t.title || `Order Confirmation #${order.orderNumber}`).replace('#{orderNumber}', order.orderNumber || '').replace('{orderNumber}', order.orderNumber || '')}</h1>
        <p style="color: #6b7280; margin: 5px 0; font-size: 16px;">${t.dated || 'dated:'} ${new Date().toLocaleDateString(dateLocale, { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
      </div>
      
      <div style="background: white; border: 1px solid #e5e7eb; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
          ${(t.thankYou || `Thank you for your order, {customerName}!`).replace('{customerName}', `<strong>${(order.customerName || 'Customer').split(' ')[0]}</strong>`)}
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
          ${(t.orderReceived || `Your order #${order.orderNumber} has been received and is being processed. You will pay via Cash on Delivery when your order arrives.`).replace('#{orderNumber}', order.orderNumber || '').replace('{orderNumber}', order.orderNumber || '')}
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0; text-align: ${textAlign};">
          ${t.teamContact}
        </p>
      </div>
      
      <div style="background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; text-align: ${textAlign};">${t.orderItems}</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background: #dc2626; color: white;">
              <th style="padding: 10px; text-align: ${textAlign}; font-size: 16px;">${t.product}</th>
              <th style="padding: 10px; text-align: center; font-size: 16px;">${t.qty}</th>
              <th style="padding: 10px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 16px;">${t.price}</th>
              <th style="padding: 10px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 16px;">${t.total}</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${textAlign};">${item.name}${item.size ? ` (${t.size} ${item.size})` : ''}${item.color ? ` (${t.color} ${item.color})` : ''}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${isRTL ? 'left' : 'right'};">AED ${item.price.toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${isRTL ? 'left' : 'right'};">AED ${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
            <span style="color: #374151; font-size: 16px;">${t.subtotal}</span>
            <span style="color: #374151; font-size: 16px; font-weight: 500;">AED ${order.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
            <span style="color: #374151; font-size: 16px;">${(t.shippingTo || `Shipping to {emirate}:`).replace('{emirate}', order.emirate || '')}</span>
            <span style="color: #374151; font-size: 16px; font-weight: 500;">${order.shippingCost === 0 ? (t.free || 'FREE') : `AED ${order.shippingCost.toFixed(2)}`}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
            <span style="color: #374151; font-size: 16px;">${t.vat}</span>
            <span style="color: #374151; font-size: 16px; font-weight: 500;">AED ${order.vatAmount.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 15px; margin-top: 15px; background: #f9fafb; padding: 15px; border-radius: 6px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
            <span>${t.totalLabel}</span>
            <span>AED ${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div style="background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; text-align: ${textAlign};">${t.deliveryInformation}</h3>
        <p style="color: #374151; margin: 0 0 10px 0; font-size: 16px; text-align: ${textAlign};"><strong>${t.name}</strong> ${order.customerName}</p>
        <p style="color: #374151; margin: 0 0 10px 0; font-size: 16px; text-align: ${textAlign};"><strong>${t.phone}</strong> ${order.customerPhone}</p>
        <p style="color: #374151; margin: 0 0 10px 0; font-size: 16px; text-align: ${textAlign};"><strong>${t.address}</strong> ${order.customerAddress}</p>
        <p style="color: #374151; margin: 0; font-size: 16px; text-align: ${textAlign};"><strong>${t.emirate}</strong> ${order.emirate}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wa.me/971585487665?text=${encodeURIComponent(locale === 'ar' ? `مرحباً! أحتاج مساعدة بخصوص طلبي ${order.orderNumber}. هل يمكنك مساعدتي؟` : `Hi! I need help with my order ${order.orderNumber}. Can you assist me?`)}" 
           style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); 
                  color: white; 
                  padding: 12px 30px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: bold; 
                  display: inline-block;">
          ${t.contactSupport}
        </a>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #000000; font-size: 14px;">
        <div style="text-align: center; margin-bottom: 15px;">
          <img src="https://genosys.ae/_next/image?url=%2FLogo%2FFull.png&w=640&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto;" />
        </div>
        <p style="color: #000000; margin: 0;">${t.officialDistributor}</p>
        <p style="color: #000000; margin: 0;">${t.copyright}</p>
      </div>
    </div>
  `
}

export const generateSupportLinkOrderHTML = (order: OrderHTMLData, locale: string = 'en', translations?: any): string => {
  // Load translations if not provided
  let t: any
  if (translations) {
    t = translations
  } else {
    try {
      if (locale === 'ar') {
        t = require('@/messages/ar.json').orderEmail.supportLink
      } else {
        t = require('@/messages/en.json').orderEmail.supportLink
      }
    } catch (error) {
      // Fallback to English
      t = {
        companyName: 'Genosys Middle East FZ-LLC',
        officialDistributor: 'Official Genosys distributor in the United Arab Emirates',
        dear: 'Dear {customerName},',
        orderSubmitted: 'Your order request has been submitted. Our support team will share a secure payment link for payment.',
        orderRequest: 'Order Request #{orderNumber}',
        customerInformation: 'Customer Information',
        name: 'Name:',
        email: 'Email:',
        phone: 'Phone:',
        address: 'Address:',
        emirate: 'Emirate:',
        orderItems: 'Order Items',
        product: 'Product',
        qty: 'Qty',
        price: 'Price',
        total: 'Total',
        size: 'Size:',
        color: 'Color:',
        orderSummary: 'Order Summary',
        subtotal: 'Subtotal:',
        shippingTo: 'Shipping to {emirate}:',
        free: 'FREE',
        vat: 'VAT (5%):',
        totalLabel: 'Total:',
        continueShopping: 'Continue Shopping',
        contactSupport: 'Contact Support',
        officialDistributorFooter: 'Official Distributor in the UAE',
        copyright: '© 2025 Genosys Middle East FZ-LLC. All rights reserved.'
      }
    }
  }

  const isRTL = locale === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'
  const textAlign = isRTL ? 'right' : 'left'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
  const productsUrl = locale === 'ar' ? `${siteUrl}/ar/products` : `${siteUrl}/products`
  const contactUrl = locale === 'ar' ? `${siteUrl}/ar/contact` : `${siteUrl}/contact`

  const itemsHTML = order.items.map((item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${textAlign};">${item.name || 'Product'}${item.size ? ` (Size: ${item.size})` : ''}${item.color ? ` (Color: ${item.color})` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 0}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${isRTL ? 'left' : 'right'};">AED ${(item.price || 0).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${isRTL ? 'left' : 'right'};">AED ${(item.total || ((item.price || 0) * (item.quantity || 0))).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; font-size: 14px; direction: ${dir};">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc2626; margin: 0; font-size: 14px;">${t.companyName}</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
          ${(t.dear || 'Dear {customerName},').replace('{customerName}', `<strong>${(order.customerName || 'Customer').split(' ')[0]}</strong>`)}
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
          ${t.orderSubmitted || 'Your order request has been submitted. Our support team will share a secure payment link shortly.'}
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; text-align: ${textAlign};">
          Order Request <span style="color: #dc2626;">#${order.orderNumber || 'N/A'}</span>
        </p>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">${t.customerInformation}</h3>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.name || 'Name:'}</strong> ${order.customerName || 'N/A'}</p>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.email || 'Email:'}</strong> ${order.customerEmail || 'N/A'}</p>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.phone || 'Phone:'}</strong> ${order.customerPhone || 'N/A'}</p>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.address || 'Address:'}</strong> ${order.customerAddress || 'N/A'}</p>
        <p style="margin: 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.emirate || 'Emirate:'}</strong> ${order.emirate || 'N/A'}</p>
      </div>

      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">${t.orderItems}</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background: #dc2626; color: white;">
              <th style="padding: 10px; text-align: ${textAlign}; font-size: 14px;">${t.product || 'Product'}</th>
              <th style="padding: 10px; text-align: center; font-size: 14px;">${t.qty || 'Qty'}</th>
              <th style="padding: 10px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 14px;">${t.price || 'Price'}</th>
              <th style="padding: 10px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 14px;">${t.total || 'Total'}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>

      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">${t.orderSummary}</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span style="color: #374151; font-size: 14px;">${t.subtotal || 'Subtotal:'}</span>
          <span style="color: #374151; font-size: 14px;">AED ${(order.subtotal || 0).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span style="color: #374151; font-size: 14px;">Shipping to ${order.emirate || 'N/A'}:</span>
          <span style="color: #374151; font-size: 14px;">${(order.shippingCost || 0) === 0 ? (t.free || 'FREE') : `AED ${(order.shippingCost || 0).toFixed(2)}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span style="color: #374151; font-size: 14px;">${t.vat || 'VAT (5%):'}</span>
          <span style="color: #374151; font-size: 14px;">AED ${(order.vatAmount || 0).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span>${t.totalLabel || 'Total:'}</span>
          <span>AED ${(order.total || 0).toFixed(2)}</span>
        </div>
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
          ${t.continueShopping}
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
          ${t.contactSupport}
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #000000; font-size: 14px;">
        <div style="text-align: center; margin-bottom: 15px;">
          <img src="https://genosys.ae/_next/image?url=%2FLogo%2FFull.png&w=640&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
        </div>
        <p style="color: #000000; margin: 0;">${t.officialDistributorFooter || t.officialDistributor}</p>
        <p style="color: #000000; margin: 0;">© 2026 Genosys Middle East FZ-LLC. All rights reserved.</p>
      </div>
    </div>
  `
}

// Generate Stripe Payment Confirmation Email HTML (based on support-link template)
export const generateStripePaymentConfirmationHTML = (order: OrderHTMLData, locale: string = 'en', translations?: any): string => {
  // Load translations with robust fallback
  let t: any
  
  try {
    if (translations) {
      t = translations
    } else {
      let messages: any
      if (locale === 'ar') {
        messages = require('@/messages/ar.json')
      } else if (locale === 'ru') {
        messages = require('@/messages/ru.json')
      } else {
        messages = require('@/messages/en.json')
      }
      
      // Safely access nested translation object
      t = messages?.orderEmail?.stripePaymentConfirmation || {}
    }
  } catch (error) {
    console.log('Translation loading failed, using fallbacks:', error)
    t = {}
  }
  
  // Ensure all required translation keys have fallbacks
  const fallbacks = {
    companyName: 'Genosys Middle East FZ-LLC',
    subject: 'Payment Confirmed - Order #{orderNumber}',
    officialDistributor: 'Official Genosys distributor in the United Arab Emirates',
    dear: 'Dear {customerName},',
    paymentReceived: 'Thank you! Your payment has been successfully received and your order is confirmed.',
    orderConfirmed: 'Order Confirmed #{orderNumber}',
    paymentMethod: 'Payment Method: Stripe (Online Payment)',
        customerInformation: 'Customer Information',
        name: 'Name:',
        email: 'Email:',
        phone: 'Phone:',
        address: 'Address:',
        emirate: 'Emirate:',
        orderItems: 'Order Items',
        product: 'Product',
        qty: 'Qty',
        price: 'Price',
        total: 'Total',
        size: 'Size:',
        color: 'Color:',
        orderSummary: 'Order Summary',
        subtotal: 'Subtotal:',
        shippingTo: 'Shipping to {emirate}:',
        free: 'FREE',
        vat: 'VAT (5%):',
        totalLabel: 'Total Paid:',
        nextSteps: 'What happens next?',
        processingOrder: 'We are now processing your order and will ship it within 1-2 business days.',
        trackingInfo: 'You will receive tracking information once your order ships.',
        continueShopping: 'Continue Shopping',
    contactSupport: 'Contact Support',
    officialDistributorFooter: 'Official Distributor in the UAE',
    copyright: '© 2026 Genosys Middle East FZ-LLC. All rights reserved.'
  }
  
  // Merge loaded translations with fallbacks
  t = { ...fallbacks, ...t }

  const isRTL = locale === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'
  const textAlign = isRTL ? 'right' : 'left'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
  const productsUrl = locale === 'ar' ? `${siteUrl}/ar/products` : locale === 'ru' ? `${siteUrl}/ru/products` : `${siteUrl}/products`
  const contactUrl = locale === 'ar' ? `${siteUrl}/ar/contact` : locale === 'ru' ? `${siteUrl}/ru/contact` : `${siteUrl}/contact`

  const itemsHTML = order.items.map((item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${textAlign};">${item.name || 'Product'}${item.size ? ` (Size: ${item.size})` : ''}${item.color ? ` (Color: ${item.color})` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 0}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${isRTL ? 'left' : 'right'};">AED ${(item.price || 0).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${isRTL ? 'left' : 'right'};">AED ${(item.total || ((item.price || 0) * (item.quantity || 0))).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; font-size: 14px; direction: ${dir};">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc2626; margin: 0; font-size: 18px;">${t.companyName}</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
      </div>
      
      <!-- Payment Success Banner -->
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
        <h2 style="color: white; margin: 0; font-size: 20px;">✅ ${t.paymentReceived || 'Payment Confirmed!'}</h2>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; text-align: ${textAlign};">
          ${(t.dear || 'Dear {customerName},').replace('{customerName}', `<strong>${(order.customerName || 'Customer').split(' ')[0]}</strong>`)}
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
          ${t.paymentReceived || 'Thank you! Your payment has been successfully received and your order is confirmed.'}
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
          Order Confirmed <span style="color: #dc2626; font-weight: bold;">#${order.orderNumber || 'N/A'}</span>
        </p>
        <p style="color: #10b981; font-size: 14px; line-height: 1.6; margin: 0; text-align: ${textAlign}; font-weight: bold;">
          ${t.paymentMethod || 'Payment Method: Stripe (Online Payment)'}
        </p>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">${t.customerInformation}</h3>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.name || 'Name:'}</strong> ${order.customerName || 'N/A'}</p>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.email || 'Email:'}</strong> ${order.customerEmail || 'N/A'}</p>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.phone || 'Phone:'}</strong> ${order.customerPhone || 'N/A'}</p>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.address || 'Address:'}</strong> ${order.customerAddress || 'N/A'}</p>
        <p style="margin: 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.emirate || 'Emirate:'}</strong> ${order.emirate || 'N/A'}</p>
      </div>

      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">${t.orderItems}</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background: #dc2626; color: white;">
              <th style="padding: 10px; text-align: ${textAlign}; font-size: 14px;">${t.product || 'Product'}</th>
              <th style="padding: 10px; text-align: center; font-size: 14px;">${t.qty || 'Qty'}</th>
              <th style="padding: 10px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 14px;">${t.price || 'Price'}</th>
              <th style="padding: 10px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 14px;">${t.total || 'Total'}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>

      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">${t.orderSummary}</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span style="color: #374151; font-size: 14px;">${t.subtotal || 'Subtotal:'}</span>
          <span style="color: #374151; font-size: 14px;">AED ${(order.subtotal || 0).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span style="color: #374151; font-size: 14px;">Shipping to ${order.emirate || 'N/A'}:</span>
          <span style="color: #374151; font-size: 14px;">${(order.shippingCost || 0) === 0 ? (t.free || 'FREE') : `AED ${(order.shippingCost || 0).toFixed(2)}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span style="color: #374151; font-size: 14px;">${t.vat || 'VAT (5%):'}</span>
          <span style="color: #374151; font-size: 14px;">AED ${(order.vatAmount || 0).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; color: #10b981; border-top: 2px solid #10b981; padding-top: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span>${t.totalLabel || 'Total Paid:'}</span>
          <span>AED ${(order.total || 0).toFixed(2)}</span>
        </div>
      </div>

      <!-- Next Steps Section -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e9ecef;">
        <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px; text-align: ${textAlign};">${t.nextSteps || 'What happens next?'}</h3>
        <ul style="color: #374151; font-size: 14px; line-height: 1.6; padding-left: ${isRTL ? '0' : '20px'}; padding-right: ${isRTL ? '20px' : '0'}; text-align: ${textAlign};">
          <li style="margin-bottom: 8px;">${t.processingOrder || 'We are now processing your order and will ship it within 1-2 business days.'}</li>
          <li>${t.trackingInfo || 'You will receive tracking information once your order ships.'}</li>
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
          ${t.continueShopping}
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
          ${t.contactSupport}
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #000000; font-size: 14px;">
        <div style="text-align: center; margin-bottom: 15px;">
          <img src="https://genosys.ae/_next/image?url=%2FLogo%2FFull.png&w=640&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
        </div>
        <p style="color: #000000; margin: 0;">${t.officialDistributorFooter || t.officialDistributor}</p>
        <p style="color: #000000; margin: 0;">${t.copyright}</p>
      </div>
    </div>
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
    
    // Load translations
    let t: any
    try {
      if (locale === 'ar') {
        const arMessages = require('@/messages/ar.json')
        t = arMessages.default?.orderEmail?.statusUpdate || arMessages.orderEmail?.statusUpdate
      } else {
        const enMessages = require('@/messages/en.json')
        t = enMessages.default?.orderEmail?.statusUpdate || enMessages.orderEmail?.statusUpdate
      }
    } catch (error) {
      errorLog('Failed to load translations for order status update:', error)
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
    
    // Social media icons - use same location as footer logo (Logo folder) for Gmail compatibility
    // This matches the footer logo approach which loads fine in Gmail without attachments
    // Images are now deployed to production at /Logo/insta.png, /Logo/wa.png, /Logo/fb.png
    const instagramIconUrl = `${baseUrl}/Logo/insta.png`
    const whatsappIconUrl = `${baseUrl}/Logo/wa.png`
    const facebookIconUrl = `${baseUrl}/Logo/fb.png`
    
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
    
    // Generate items breakdown HTML if items are available
    let itemsHTML = ''
    if (order.items && order.items.length > 0) {
      const itemsList = order.items.map(item => {
        // Ensure absolute HTTPS URL for email compatibility
        // Remove Next.js image optimization parameters and use direct image URLs
        let imageUrl = item.image || ''
        const originalImageUrl = imageUrl // Keep for debugging
        
        // Process image URL to ensure it's absolute and HTTPS (same pattern as logo)
        // Logo works: ${baseUrl}/Logo/upLOGO.png
        // Product images should work: ${baseUrl}/images/CUSHC.png
        
        if (imageUrl && imageUrl.trim()) {
          const trimmedUrl = imageUrl.trim()
          
          // If it's a Next.js optimized image URL, extract the original path
          if (trimmedUrl.includes('_next/image')) {
            const urlMatch = trimmedUrl.match(/url=([^&]+)/)
            if (urlMatch && urlMatch[1]) {
              try {
                const decodedPath = decodeURIComponent(urlMatch[1])
                // Remove any query parameters and ensure clean path
                const parts = decodedPath.split('?')
                const cleanPath = (parts[0] || '').split('&')[0] || decodedPath
                // Ensure path starts with /
                const normalizedPath = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath
                imageUrl = `${baseUrl}${normalizedPath}`
              } catch (error) {
                debugLog(`❌ Failed to decode Next.js image URL: ${trimmedUrl}`, error)
                imageUrl = `${baseUrl}/images/genosys-logo.png`
              }
            } else {
              debugLog(`⚠️ Could not extract path from Next.js URL: ${trimmedUrl}`)
              imageUrl = `${baseUrl}/images/genosys-logo.png`
            }
          } 
          // If it's already an absolute URL (http/https)
          else if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
            // Remove query parameters for email compatibility
            const parts = trimmedUrl.split('?')
            imageUrl = (parts[0] || '').split('&')[0] || trimmedUrl
            // Ensure HTTPS (but keep localhost as http for development)
            if (imageUrl.startsWith('http://') && !imageUrl.includes('localhost')) {
              imageUrl = imageUrl.replace('http://', 'https://')
            }
          }
          // If it's a local/relative path, make it absolute (same as logo: /Logo/upLOGO.png)
          else {
            // Remove query parameters and ensure path starts with /
            const parts = trimmedUrl.split('?')
            const cleanPath = (parts[0] || '').split('&')[0] || trimmedUrl
            // Handle both /images/... and images/... formats
            let normalizedPath = cleanPath
            if (!normalizedPath.startsWith('/')) {
              normalizedPath = '/' + normalizedPath
            }
            // Ensure it follows the same pattern as logo: /Logo/upLOGO.png -> /images/CUSHC.png
            imageUrl = `${baseUrl}${normalizedPath}`
          }
        } else {
          // No image provided - use logo as fallback
          debugLog(`⚠️ No image provided for product: ${item.productName}`)
          imageUrl = `${baseUrl}/images/genosys-logo.png`
        }
        
        // Final cleanup: ensure no double slashes (except after protocol)
        imageUrl = imageUrl.replace(/([^:]\/)\/+/g, '$1')
        
        // Debug logging with full details
        debugLog(`📦 Order item image processing: ${item.productName}`)
        debugLog(`   Original image: "${originalImageUrl}"`)
        debugLog(`   Base URL: "${baseUrl}"`)
        debugLog(`   Final URL: "${imageUrl}"`)
        debugLog(`   Image exists check: Will try to load from ${imageUrl}`)
        
        // Additional validation: ensure the URL is properly formatted
        if (!imageUrl || imageUrl.trim() === '') {
          errorLog(`❌ Empty image URL for product: ${item.productName}`)
          imageUrl = `${baseUrl}/images/genosys-logo.png`
        }
        
        // Ensure URL is valid
        try {
          new URL(imageUrl)
        } catch (error) {
          errorLog(`❌ Invalid image URL constructed: "${imageUrl}" for product: ${item.productName}`)
          errorLog(`   Original was: "${originalImageUrl}"`)
          imageUrl = `${baseUrl}/images/genosys-logo.png`
        }
        
        const itemTotal = (item.price * item.quantity).toFixed(2)
        const variantInfo = [item.size, item.color].filter(Boolean).join(' • ')
        
        return `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="80" style="${isRTL ? 'padding-left' : 'padding-right'}: 12px; vertical-align: top;">
                    <img src="${imageUrl}" alt="${item.productName.replace(/"/g, '&quot;')}" width="80" height="80" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; display: block; border: 1px solid #e5e7eb; max-width: 80px;" border="0" onerror="this.onerror=null; this.src='${baseUrl}/images/genosys-logo.png';" />
                  </td>
                  <td style="vertical-align: top;">
                    <p style="color: #374151; font-size: 12px; font-weight: 500; margin: 0 0 4px 0; line-height: 1.4;">${item.productName}</p>
                    ${variantInfo ? `<p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${variantInfo}</p>` : ''}
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">Qty: ${item.quantity} × AED ${item.price.toFixed(2)}</p>
                  </td>
                  <td style="text-align: ${isRTL ? 'left' : 'right'}; vertical-align: top; ${isRTL ? 'padding-right' : 'padding-left'}: 12px;">
                    <p style="color: #374151; font-size: 12px; font-weight: 600; margin: 0; white-space: nowrap;">${itemTotal} AED</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `
      }).join('')
      
      // Calculate subtotal from all items
      const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      // Calculate VAT (5% of VAT-inclusive amount: VAT = amount * (5/105))
      const vat = subtotal * (5 / 105)
      
      itemsHTML = `
        <div style="margin: 25px 0;">
          <h3 style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 15px 0; text-align: ${textAlign};">${t.orderItems}</h3>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f9fafb; border-radius: 8px; padding: 15px;">
            ${itemsList}
            ${order.total ? `
              <tr>
                <td style="padding-top: 15px; border-top: 2px solid #e5e7eb;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: ${isRTL ? 'left' : 'right'};">
                        <p style="color: #374151; font-size: 12px; margin: 0 0 6px 0;">${t.subtotal} AED ${subtotal.toFixed(2)}</p>
                        <p style="color: #374151; font-size: 12px; margin: 0 0 6px 0;">${t.vat} AED ${vat.toFixed(2)}</p>
                        <p style="color: #374151; font-size: 14px; font-weight: 600; margin: 0;">${t.total} AED ${order.total.toFixed(2)}</p>
                        <p style="color: #6b7280; font-size: 11px; margin: 4px 0 0 0; font-style: italic;">${t.vatNote}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            ` : ''}
          </table>
        </div>
      `
    }
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 4px solid #dc2626; background: #ffffff; box-shadow: 0 0 0 2px #ffffff, 0 0 0 6px #dc2626; direction: ${dir};">
        <div style="text-align: center; margin-bottom: 15px; position: relative;">
          <h1 style="color: #dc2626; margin: 0;">${t.companyName}</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 12px; ${isRTL ? 'padding-right' : 'padding-left'}: 3.2em;">${t.uae}</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0; text-align: ${textAlign};">
            ${t.dear.replace('{customerName}', order.customerName)}
          </p>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; text-align: ${textAlign};">
            ${t.greeting}
          </p>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; text-align: ${textAlign};">
            ${statusMessage}
          </p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 12px 0;">
            <p style="color: #374151; margin: 0 0 10px 0; font-size: 13px; text-align: ${textAlign};"><strong>${t.orderNumber}</strong> ${orderId}</p>
            <p style="color: #374151; margin: 0 0 10px 0; font-size: 13px; text-align: ${textAlign};"><strong>${t.status}</strong> <span style="color: #dc2626; font-weight: bold;">${translatedStatus}</span></p>
            <p style="color: #374151; margin: 0; font-size: 13px; text-align: ${textAlign};"><strong>${t.date}</strong> ${new Date().toLocaleString(dateLocale, { timeZone: 'Asia/Dubai' })}</p>
          </div>
          
          ${itemsHTML}
          
          <div style="margin: 25px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #374151; font-size: 13px; line-height: 1.6; margin: 0 0 12px 0; text-align: ${textAlign};">
              ${t.contactQuestion} <a href="https://wa.me/971585487665" style="color: #dc2626; text-decoration: none;">+971 58 548 76 65</a> (WhatsApp).
            </p>
            
            <p style="color: #374151; font-size: 13px; line-height: 1.6; margin: 0; text-align: ${textAlign};">
              ${t.viewOrderStatus} <a href="https://www.genosys.ae/${locale === 'ar' ? 'ar/' : ''}profile" style="color: #dc2626; text-decoration: none;">www.genosys.ae/${locale === 'ar' ? 'ar/' : ''}profile</a>
            </p>
          </div>
        </div>
        
        <!-- Footer Section -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 30px;">
          <!-- Social Media Icons -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="border-top: 1px solid #e5e7eb; margin-bottom: 20px;"></div>
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
              <tr>
                <td style="padding: 0 12px; text-align: center;">
                  <a href="https://www.instagram.com/genosys.uae/" style="text-decoration: none; display: inline-block;">
                    <img src="${instagramIconUrl}" alt="Instagram" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                    <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">Insta</p>
                  </a>
                </td>
                <td style="padding: 0 12px; text-align: center;">
                  <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I need help with my order ${orderId}. Can you assist me?`)}" style="text-decoration: none; display: inline-block;">
                    <img src="${whatsappIconUrl}" alt="WhatsApp" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                    <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">WA</p>
                  </a>
                </td>
                <td style="padding: 0 12px; text-align: center;">
                  <a href="https://www.facebook.com/genosys.ae" style="text-decoration: none; display: inline-block;">
                    <img src="${facebookIconUrl}" alt="Facebook" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                    <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">FB</p>
                  </a>
                </td>
              </tr>
            </table>
            <div style="border-top: 1px solid #e5e7eb; margin-top: 20px;"></div>
          </div>
          
          <!-- Company Overview -->
          <div style="text-align: center; margin-bottom: 20px;">
            <p style="color: #374151; font-size: 13px; line-height: 1.6; margin: 0; text-align: ${textAlign};">
              ${t.officialDistributor}
            </p>
          </div>
          
          <!-- Two Column Footer -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <!-- Left Column: Customer Service -->
              <td width="50%" style="${isRTL ? 'padding-left' : 'padding-right'}: 20px; vertical-align: top;">
                <p style="color: #374151; font-size: 13px; font-weight: 600; margin: 0 0 8px 0; text-align: ${textAlign};">${t.customerService}</p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0 0 4px 0; text-align: ${textAlign};">
                  ${t.callUs} <a href="tel:+971585487665" style="color: #374151; text-decoration: none;">+971 58 548 76 65</a>
                </p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0 0 4px 0; text-align: ${textAlign};">
                  ${t.emailUs} <a href="mailto:sales@genosys.ae" style="color: #374151; text-decoration: none;">sales@genosys.ae</a>
                </p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0; text-align: ${textAlign};">
                  ${t.hours}
                </p>
              </td>
              
              <!-- Right Column: Business Location -->
              <td width="50%" style="${isRTL ? 'padding-right' : 'padding-left'}: 20px; vertical-align: top;">
                <p style="color: #374151; font-size: 13px; font-weight: 600; margin: 0 0 8px 0; text-align: ${textAlign};">${t.businessLocation}</p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0 0 4px 0; text-align: ${textAlign};">
                  Cordoba Residence Villa E02
                </p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0 0 4px 0; text-align: ${textAlign};">
                  Dubai, United Arab Emirates
                </p>
                <p style="color: #374151; font-size: 12px; line-height: 1.6; margin: 0; text-align: ${textAlign};">
                  <a href="https://maps.app.goo.gl/ZBxVoXdTNvECFwNw5" style="color: #374151; text-decoration: underline;">${t.locationMap}</a>
                </p>
              </td>
            </tr>
          </table>
          
          <!-- Company Copyright -->
          <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <div style="margin-bottom: 15px;">
              <img src="${baseUrl}/Logo/upLOGO.png" alt="GENOSYS Logo" width="180" height="54" style="max-width: 180px; height: auto; display: block; margin: 0 auto;" border="0" />
            </div>
            <p style="color: #6b7280; font-size: 11px; line-height: 1.5; margin: 0;">
              ${t.copyright}
            </p>
          </div>
        </div>
      </div>
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

