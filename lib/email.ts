import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
  },
})

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP connection error:', error)
  } else {
    console.log('✅ SMTP server is ready to take our messages')
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
  orderConfirmation: (orderData: {
    orderNumber: string
    customerName: string
    customerEmail: string
    items: Array<{
      productName: string
      quantity: number
      price: number
      image: string
    }>
    subtotal: number
    shipping: number
    vat: number
    total: number
    address: string
    emirate: string
  }) => ({
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
            ${orderData.items.map(item => `
              <div style="display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                <img src="${item.image}" alt="${item.productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px;">
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0; color: #374151; font-size: 14px;">${item.productName}</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">Qty: ${item.quantity}</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; color: #dc2626; font-weight: bold;">AED ${item.price.toFixed(2)}</p>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Subtotal:</span>
              <span style="color: #374151;">AED ${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Shipping:</span>
              <span style="color: #374151;">AED ${orderData.shipping.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">VAT:</span>
              <span style="color: #374151;">AED ${orderData.vat.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 8px;">
              <span>Total:</span>
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
  adminNewUser: (userName: string, userEmail: string) => ({
    subject: `New User Registration: ${userName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">New User Registration</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  }),

  // Admin notification for new order
  adminNewOrder: (orderData: {
    orderNumber: string
    customerName: string
    customerEmail: string
    total: number
    itemCount: number
  }) => ({
    subject: `New Order #${orderData.orderNumber} - ${orderData.customerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">New Order Received</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Customer:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          <p><strong>Total Amount:</strong> AED ${orderData.total.toFixed(2)}</p>
          <p><strong>Items:</strong> ${orderData.itemCount}</p>
          <p><strong>Order Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  }),
}

// Email sending functions
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log('📧 Attempting to send email to:', to)
    console.log('📧 Using Gmail service')
    console.log('📧 Using Gmail user:', process.env.GMAIL_USER)
    
    const mailOptions = {
      from: `"Genosys Middle East FZ-LLC" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error')
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Specific email functions
export const sendWelcomeEmail = async (userName: string, userEmail: string) => {
  const template = emailTemplates.welcomeUser(userName, userEmail)
  return await sendEmail(userEmail, template.subject, template.html)
}

export const sendOrderConfirmationEmail = async (orderData: any) => {
  const template = emailTemplates.orderConfirmation(orderData)
  return await sendEmail(orderData.customerEmail, template.subject, template.html)
}

export const sendAdminNewUserNotification = async (userName: string, userEmail: string) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER
  if (!adminEmail) {
    console.warn('⚠️ Admin email not configured')
    return { success: false, error: 'Admin email not configured' }
  }
  
  const template = emailTemplates.adminNewUser(userName, userEmail)
  return await sendEmail(adminEmail, template.subject, template.html)
}

export const sendAdminNewOrderNotification = async (orderData: any) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER
  if (!adminEmail) {
    console.warn('⚠️ Admin email not configured')
    return { success: false, error: 'Admin email not configured' }
  }
  
  const template = emailTemplates.adminNewOrder(orderData)
  return await sendEmail(adminEmail, template.subject, template.html)
}
