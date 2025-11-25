import { debugLog, errorLog } from '@/lib/logger'
import nodemailer from 'nodemailer'

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
}

export interface AdminNewOrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string | undefined
  total: number
  itemCount: number
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
}

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
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
  welcomeUser: (userName: string, userEmail: string) => ({
    subject: 'Welcome to Genosys Middle East FZ-LLC! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">Official Genosys distributor in the United Arab Emirates</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #dc2626; margin: 0 0 15px 0;">Welcome, ${userName}! 🎉</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for joining the Genosys Middle East FZ-LLC family! As the official Genosys distributor in the United Arab Emirates, we're excited to have you as part of our community.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
            Your account has been successfully created with email: <strong>${userEmail}</strong>
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">What's Next?</h3>
          <ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Browse our premium cosmetics collection</li>
            <li>Enjoy exclusive member discounts</li>
            <li>Get early access to new products</li>
            <li>Receive personalized beauty recommendations</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;">
            Start Shopping
          </a>
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
  }),

  // Order confirmation email
  orderConfirmation: (orderData: OrderConfirmationEmailData) => ({
    subject: `Order Confirmation #${orderData.orderNumber} - Genosys Middle East FZ-LLC`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">Official Genosys distributor in the United Arab Emirates</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #16a34a; margin: 0 0 15px 0;">Order Confirmed! ✅</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
            Thank you for your order, <strong>${orderData.customerName}</strong>!
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
            Your order <strong>#${orderData.orderNumber}</strong> has been received and is being processed.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
            Our team will be in touch with you for the next steps via phone/mail/whatsapp.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">Order Details</h3>
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
              <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                ${imageUrl ? `
                <img src="${imageUrl}" alt="${item.productName}" width="60" height="60" border="0" style="display: block; width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px;" />
                ` : '<div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 6px; margin-right: 15px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 24px;">📦</div>'}
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0; color: #374151; font-size: 14px;">${item.productName}</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">Qty: ${item.quantity}${item.size ? ` | Size: ${item.size}` : ''}${item.color ? ` | Color: ${item.color}` : ''}</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; color: #dc2626; font-weight: bold;">AED ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            `
            }).join('')}
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Subtotal: </span>
              <span style="color: #374151;">AED ${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Shipping: </span>
              <span style="color: #374151;">AED ${orderData.shipping.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">VAT: </span>
              <span style="color: #374151;">AED ${orderData.vat.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 8px;">
              <span>Total: </span>
              <span>AED ${orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin: 0 0 15px 0;">Delivery Information</h3>
          <p style="color: #374151; margin: 0 0 10px 0;"><strong>Address:</strong> ${orderData.address}</p>
          <p style="color: #374151; margin: 0;"><strong>Emirate:</strong> ${orderData.emirate}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;">
            Track Your Order
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Questions about your order? Contact us at <a href="mailto:sales@genosys.ae" style="color: #dc2626;">sales@genosys.ae</a>
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            Genosys Middle East FZ-LLC - Official Genosys distributor in the United Arab Emirates
          </p>
        </div>
      </div>
    `,
  }),

  // Admin notification for new user
  adminNewUser: (userName: string, userEmail: string, userPhone?: string, userAddress?: string) => ({
    subject: `New User Registration: ${userName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">New User Registration</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          ${userPhone ? `<p><strong>Phone:</strong> ${userPhone}</p>` : ''}
          ${userAddress ? `<p><strong>Address:</strong> ${userAddress}</p>` : ''}
          <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  }),

  // Admin notification for new order
  adminNewOrder: (orderData: AdminNewOrderEmailData) => ({
    subject: `New Order #${orderData.orderNumber} - ${orderData.customerName} - AED ${orderData.total.toFixed(2)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">New Order Notification</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px; border-left: 5px solid #dc2626;">
          <h2 style="color: #dc2626; margin: 0 0 15px 0;">🛒 New Order Received!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
            A new order has been placed and requires your attention.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">Order Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
              <p style="margin: 0 0 5px 0; color: #374151;"><strong>Order Number:</strong></p>
              <p style="margin: 0; color: #dc2626; font-size: 18px; font-weight: bold;">#${orderData.orderNumber}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #374151;"><strong>Order Time:</strong></p>
              <p style="margin: 0; color: #374151;">${new Date().toLocaleString()}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #374151;"><strong>Customer Name:</strong></p>
              <p style="margin: 0; color: #374151;">${orderData.customerName}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #374151;"><strong>Customer Email:</strong></p>
              <p style="margin: 0; color: #374151;">${orderData.customerEmail}</p>
            </div>
            ${orderData.customerPhone ? `
            <div>
              <p style="margin: 0 0 5px 0; color: #374151;"><strong>Customer Phone:</strong></p>
              <p style="margin: 0; color: #374151;">
                <a href="tel:${orderData.customerPhone.replace(/\s/g, '')}" style="color: #dc2626; text-decoration: none;">${orderData.customerPhone}</a>
              </p>
            </div>
            ` : ''}
            ${orderData.address ? `
            <div>
              <p style="margin: 0 0 5px 0; color: #374151;"><strong>Delivery Address:</strong></p>
              <p style="margin: 0; color: #374151;">${orderData.address}</p>
            </div>
            ` : ''}
            ${orderData.emirate ? `
            <div>
              <p style="margin: 0 0 5px 0; color: #374151;"><strong>Emirate:</strong></p>
              <p style="margin: 0; color: #374151;">${orderData.emirate}</p>
            </div>
            ` : ''}
          </div>
        </div>
        
        ${orderData.items && orderData.items.length > 0 ? `
        <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">📦 Order Items (${orderData.itemCount} ${orderData.itemCount === 1 ? 'item' : 'items'})</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
            <thead>
              <tr style="background: #dc2626; color: white;">
                <th style="padding: 10px; text-align: left; font-size: 16px;">Product</th>
                <th style="padding: 10px; text-align: center; font-size: 16px;">Qty</th>
                <th style="padding: 10px; text-align: right; font-size: 16px;">Price</th>
                <th style="padding: 10px; text-align: right; font-size: 16px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items.map(item => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}${item.size ? ` (Size: ${item.size})` : ''}${item.color ? ` (Color: ${item.color})` : ''}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">AED ${item.price.toFixed(2)}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">AED ${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : `
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #fecaca;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">📦 Order Items</h3>
          <p style="color: #6b7280; margin: 0;">${orderData.itemCount} ${orderData.itemCount === 1 ? 'item' : 'items'} in this order (product details not available)</p>
        </div>
        `}
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">Order Summary</h3>
          <div style="space-y: 8px;">
            ${orderData.subtotal ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Subtotal: </span>
              <span style="color: #374151;">AED ${orderData.subtotal.toFixed(2)}</span>
            </div>
            ` : ''}
            ${orderData.shipping !== undefined ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Shipping: </span>
              <span style="color: #374151;">AED ${orderData.shipping.toFixed(2)}</span>
            </div>
            ` : ''}
            ${orderData.vat !== undefined ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">VAT: </span>
              <span style="color: #374151;">AED ${orderData.vat.toFixed(2)}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 8px;">
              <span>Total: </span>
              <span>AED ${orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'}/admin" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    font-weight: bold; 
                    display: inline-block;">
            View Order in Admin Panel
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            This is an automated notification from Genosys Middle East FZ-LLC
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            Official Genosys distributor in the United Arab Emirates
          </p>
        </div>
      </div>
    `,
  }),

  // Password reset email
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
    debugLog('📧 Using Gmail user:', process.env.GMAIL_USER)
    
    const mailOptions = {
      from: `"Genosys Middle East FZ-LLC" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    }

    const result = await transporter.sendMail(mailOptions)
    debugLog('✅ Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    errorLog('❌ Error sending email:', error)
    errorLog('❌ Error details:', error instanceof Error ? error.message : 'Unknown error')
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Specific email functions
export const sendWelcomeEmail = async (userName: string, userEmail: string) => {
  const template = emailTemplates.welcomeUser(userName, userEmail)
  return await sendEmail(userEmail, template.subject, template.html)
}

export const sendOrderConfirmationEmail = async (orderData: OrderConfirmationEmailData) => {
  const template = emailTemplates.orderConfirmation(orderData)
  return await sendEmail(orderData.customerEmail, template.subject, template.html)
}

export const sendAdminNewUserNotification = async (userName: string, userEmail: string, userPhone?: string, userAddress?: string) => {
  // Use ADMIN_EMAIL, or fallback to GMAIL_USER/EMAIL_USER, or use default
  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER || '5856825@gmail.com'
  
  debugLog(`📧 Sending admin new user notification to: ${adminEmail}`)
  debugLog(`📧 Admin email sources - ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'NOT_SET'}, GMAIL_USER: ${process.env.GMAIL_USER || 'NOT_SET'}, EMAIL_USER: ${process.env.EMAIL_USER || 'NOT_SET'}`)
  
  const template = emailTemplates.adminNewUser(userName, userEmail, userPhone, userAddress)
  const result = await sendEmail(adminEmail, template.subject, template.html)
  
  if (!result.success) {
    errorLog(`❌ Failed to send admin new user notification to ${adminEmail}:`, result.error)
  } else {
    debugLog(`✅ Admin new user notification sent successfully to ${adminEmail}`)
  }
  
  return result
}

export const sendAdminNewOrderNotification = async (orderData: AdminNewOrderEmailData) => {
  try {
    // Use ADMIN_EMAIL, or fallback to GMAIL_USER/EMAIL_USER, or use default
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER || '5856825@gmail.com'
    
    debugLog(`📧 Sending admin new order notification to: ${adminEmail}`)
    debugLog(`📧 Admin email sources - ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'NOT_SET'}, GMAIL_USER: ${process.env.GMAIL_USER || 'NOT_SET'}, EMAIL_USER: ${process.env.EMAIL_USER || 'NOT_SET'}`)
    debugLog(`📧 Order data for admin notification:`, JSON.stringify({
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      total: orderData.total,
      itemCount: orderData.itemCount
    }, null, 2))
    
    const template = emailTemplates.adminNewOrder(orderData)
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
        t = require('@/messages/ar.json').default.orderEmail.cod
      } else {
        t = require('@/messages/en.json').default.orderEmail.cod
      }
    } catch {
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
        t = require('@/messages/ar.json').default.orderEmail.supportLink
      } else {
        t = require('@/messages/en.json').default.orderEmail.supportLink
      }
    } catch {
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
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${textAlign};">${item.name}${item.size ? ` (${t.size} ${item.size})` : ''}${item.color ? ` (${t.color} ${item.color})` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${isRTL ? 'left' : 'right'};">AED ${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: ${isRTL ? 'left' : 'right'};">AED ${(item.total || (item.price * item.quantity)).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; font-size: 14px; direction: ${dir};">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="margin-bottom: 15px;">
          <img src="https://genosys.ae/_next/image?url=%2Fimages%2Fgenosys-logo.png%3Fv%3D1758554698129&w=828&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto;" />
        </div>
        <h1 style="color: #dc2626; margin: 0; font-size: 14px;">${t.companyName}</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">${t.officialDistributor}</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
          ${(t.dear || 'Dear {customerName},').replace('{customerName}', `<strong>${(order.customerName || 'Customer').split(' ')[0]}</strong>`)}
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0; text-align: ${textAlign};">
          ${t.orderSubmitted || 'Your order request has been submitted. Our support team will share a secure payment link for payment.'}
        </p>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; text-align: ${textAlign};">
          ${(t.orderRequest || 'Order Request #{orderNumber}').replace('#{orderNumber}', order.orderNumber || '').replace('{orderNumber}', order.orderNumber || '')}
        </p>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">${t.customerInformation}</h3>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.name}</strong> ${order.customerName}</p>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.email}</strong> ${order.customerEmail}</p>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.phone}</strong> ${order.customerPhone}</p>
        <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.address}</strong> ${order.customerAddress}</p>
        <p style="margin: 0; color: #374151; font-size: 14px; text-align: ${textAlign};"><strong>${t.emirate}</strong> ${order.emirate}</p>
      </div>

      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e5e5;">
        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 14px; text-align: ${textAlign};">${t.orderItems}</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background: #dc2626; color: white;">
              <th style="padding: 10px; text-align: ${textAlign}; font-size: 14px;">${t.product}</th>
              <th style="padding: 10px; text-align: center; font-size: 14px;">${t.qty}</th>
              <th style="padding: 10px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 14px;">${t.price}</th>
              <th style="padding: 10px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 14px;">${t.total}</th>
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
          <span style="color: #374151; font-size: 14px;">${t.subtotal}</span>
          <span style="color: #374151; font-size: 14px;">AED ${order.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span style="color: #374151; font-size: 14px;">${(t.shippingTo || 'Shipping to {emirate}:').replace('{emirate}', order.emirate || '')}</span>
          <span style="color: #374151; font-size: 14px;">${order.shippingCost === 0 ? (t.free || 'FREE') : `AED ${order.shippingCost.toFixed(2)}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span style="color: #374151; font-size: 14px;">${t.vat}</span>
          <span style="color: #374151; font-size: 14px;">AED ${order.vatAmount.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 8px; flex-direction: ${isRTL ? 'row-reverse' : 'row'};">
          <span>${t.totalLabel}</span>
          <span>AED ${order.total.toFixed(2)}</span>
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
                  color: #dc2626; 
                  padding: 12px 30px; 
                  text-decoration: none; 
                  border: 2px solid #dc2626; 
                  border-radius: 6px; 
                  font-weight: bold; 
                  display: inline-block;">
          ${t.contactSupport}
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #000000; font-size: 14px;">
        <div style="text-align: center; margin-bottom: 15px;">
          <img src="https://genosys.ae/_next/image?url=%2FLogo%2FFull.png&w=640&q=75" alt="GENOSYS Logo" style="max-width: 200px; height: auto;" />
        </div>
        <p style="color: #000000; margin: 0;">${t.officialDistributorFooter || t.officialDistributor}</p>
        <p style="color: #000000; margin: 0;">${t.copyright}</p>
      </div>
    </div>
  `
}

export const sendOrderStatusUpdate = async (order: { orderNumber: string; customerName: string; customerEmail: string; id?: string }, newStatus: string): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  try {
    const statusMessages: { [key: string]: string } = {
      'PROCESSING': 'Your order is being processed and prepared for shipment.',
      'CONFIRMED': 'Your order has been confirmed and is being prepared.',
      'PAID': 'Your order payment has been confirmed.',
      'SHIPPED': 'Great news! Your order has been shipped and is on its way to you.',
      'DELIVERED': 'Your order has been delivered successfully. Thank you for your business!',
      'CANCELLED': 'Your order has been cancelled as requested.'
    }
    
    const statusMessage = statusMessages[newStatus.toUpperCase()] || 'Your order status has been updated.'
    const orderId = order.orderNumber || order.id || 'Unknown'
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
          <p style="color: #666; margin: 5px 0;">Official Genosys distributor in the United Arab Emirates</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #dc2626; margin: 0 0 15px 0;">Order Status Update</h2>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Dear ${order.customerName},
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            ${statusMessage}
          </p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin: 0 0 15px 0;">Order Details</h3>
            <p style="color: #374151; margin: 0 0 10px 0;"><strong>Order Number:</strong> ${orderId}</p>
            <p style="color: #374151; margin: 0 0 10px 0;"><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
            <p style="color: #374151; margin: 0;"><strong>Date:</strong> ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
            If you have any questions about your order, please contact us at <a href="mailto:sales@genosys.ae" style="color: #dc2626;">sales@genosys.ae</a> or call +971 58 548 76 65.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Genosys Middle East FZ-LLC - Official Genosys distributor in the United Arab Emirates
          </p>
        </div>
      </div>
    `
    
    const subject = `Order Status Update #${orderId} - ${newStatus.toUpperCase()} - Genosys Middle East FZ-LLC`
    
    debugLog(`📧 Sending order status update email to: ${order.customerEmail}`)
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
