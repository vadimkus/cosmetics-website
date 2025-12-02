'use client'

import { useState } from 'react'

type TemplateType = 'welcome' | 'order-shipped' | 'order-confirmed' | 'order-delivered' | 'discount-assigned'

export default function EmailTemplatePage() {
  const [templateType, setTemplateType] = useState<TemplateType>('order-shipped')
  const [userName, setUserName] = useState('John Doe')
  const [userEmail, setUserEmail] = useState('user@example.com')
  const [password, setPassword] = useState('MySecurePassword123!')
  const [orderNumber, setOrderNumber] = useState('ORD-2024-001')
  const [orderTotal, setOrderTotal] = useState('456.75')
  const [deliveryAddress, setDeliveryAddress] = useState('Dubai Marina, Building 123, Apt 456')
  const [deliveryEmirate, setDeliveryEmirate] = useState('Dubai')
  const [discountType, setDiscountType] = useState<'CLINIC' | 'VIP'>('CLINIC')
  const [discountPercentage, setDiscountPercentage] = useState('15')

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
    return {
      subject: `Order Shipped #${orderNum} > Genosys Middle East FZ-LLC`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0;">${name},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Your order has been <u>shipped.</u>
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile" style="color: #374151; text-decoration: none;">Order details:</a>
            </h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Order number:</span> <strong style="color: #374151;">#${orderNum}</strong>
            </p>
            ${totalNum > 0 ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Total:</span> <strong style="color: #374151;">AED ${totalNum.toFixed(2)}</strong>
            </p>
            ` : ''}
          </div>
          
          ${address || emirate ? `
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Delivery info:</h3>
            ${address ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Address:</span> <strong style="color: #374151;">${address}</strong>
            </p>
            ` : ''}
            ${emirate ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Emirate:</span> <strong style="color: #374151;">${emirate}</strong>
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
            Contact us: WhatsApp
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

  // Generate order delivered email template
  const generateOrderDeliveredEmail = (name: string, orderNum: string, total: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
    const instagramIconUrl = `${baseUrl}/Logo/insta.png`
    const whatsappIconUrl = `${baseUrl}/Logo/wa.png`
    const facebookIconUrl = `${baseUrl}/Logo/fb.png`
    const totalNum = parseFloat(total) || 0
    return {
      subject: `Order Delivered #${orderNum} > Genosys Middle East FZ-LLC`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0;">${name},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Your order has been <u>delivered.</u>
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
              <a href="${siteUrl}/profile" style="color: #374151; text-decoration: none;">Order details:</a>
            </h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Order number:</span> <strong style="color: #374151;">#${orderNum}</strong>
            </p>
            ${totalNum > 0 ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Total:</span> <strong style="color: #374151;">AED ${totalNum.toFixed(2)}</strong>
            </p>
            ` : ''}
          </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">Follow us</p>
          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
            <tr>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://www.instagram.com/genosys.uae/" style="text-decoration: none; display: inline-block;">
                  <img src="${instagramIconUrl}" alt="Instagram" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">Insta</p>
                </a>
              </td>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I need help with my order #${orderNum}. Can you assist me?`)}" style="text-decoration: none; display: inline-block;">
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

  // Generate discount assignment email template
  const generateDiscountAssignedEmail = (name: string, discountType: 'CLINIC' | 'VIP', discountPercentage: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
    const instagramIconUrl = `${baseUrl}/Logo/insta.png`
    const whatsappIconUrl = `${baseUrl}/Logo/wa.png`
    const facebookIconUrl = `${baseUrl}/Logo/fb.png`
    const discountNum = parseFloat(discountPercentage) || 0
    return {
      subject: 'Special Discount Assigned > Genosys Middle East FZ-LLC',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0;">${name},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            This is to inform you that a special discount has been assigned.
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Discount details:</h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Type:</span> <strong style="color: #374151;">${discountNum < 50 ? 'VIP' : (discountType === 'CLINIC' ? 'Clinic Partner' : 'VIP')}</strong>
            </p>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Discount:</span> <strong style="color: #dc2626; font-size: 16px;">${discountNum}% OFF</strong>
            </p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
            This discount will be automatically applied to all eligible products when you next login to <a href="https://www.genosys.ae" style="color: #dc2626; text-decoration: none;">www.genosys.ae</a>
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/login" 
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
        
        <div style="text-align: center; margin: 20px 0;">
          <p style="color: #374151; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">Follow us</p>
          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
            <tr>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://www.instagram.com/genosys.uae/" style="text-decoration: none; display: inline-block;">
                  <img src="${instagramIconUrl}" alt="Instagram" width="34" height="34" style="max-width: 34px; height: auto; display: block; margin: 0 auto;" border="0" />
                  <p style="color: #374151; font-size: 11px; margin: 6px 0 0 0; text-align: center;">Insta</p>
                </a>
              </td>
              <td style="padding: 0 12px; text-align: center;">
                <a href="https://wa.me/971585487665?text=${encodeURIComponent(`Hi! I have a question about my ${discountNum < 50 ? 'VIP' : (discountType === 'CLINIC' ? 'clinic' : 'VIP')} discount. Can you assist me?`)}" style="text-decoration: none; display: inline-block;">
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

  // Generate order confirmed email template
  const generateOrderConfirmedEmail = (name: string, orderNum: string, total: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const totalNum = parseFloat(total) || 0
    return {
      subject: `Order Confirmed #${orderNum} > Genosys Middle East FZ-LLC`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #dc2626;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">United Arab Emirates <span style="font-size: 0.8em;">❤️</span></p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin: 0 0 15px 0;">${name},</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Your order has been received and is being <u>processed.</u>
          </p>
          <div style="background: #f9fafb; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile" style="color: #374151; text-decoration: none;">Order details:</a>
            </h3>
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Order number:</span> <strong style="color: #374151;">#${orderNum}</strong>
            </p>
            ${totalNum > 0 ? `
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 6px 0;">
              <span style="color: #9ca3af;">Total:</span> <strong style="color: #374151;">AED ${totalNum.toFixed(2)}</strong>
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
            Contact us: WhatsApp
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
          
          {/* Template Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Type
            </label>
            <div className="flex gap-2">
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
            
            {(templateType === 'order-shipped' || templateType === 'order-confirmed' || templateType === 'order-delivered') && (
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
