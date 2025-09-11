import nodemailer from 'nodemailer'

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'sales@genosys.ae',
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
  },
}

const ADMIN_EMAIL = 'sales@genosys.ae'

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport(EMAIL_CONFIG)
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount)
}

// Generate order summary HTML
const generateOrderSummaryHTML = (order: any) => {
  const itemsHTML = (order.items || []).map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.productName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Order Received</h2>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Order Details</h3>
        <p><strong>Order ID:</strong> ${order.orderNumber || order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt || new Date()).toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</p>
        <p><strong>Status:</strong> ${(order.status || 'PENDING').toUpperCase()}</p>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Customer Information</h3>
        <p><strong>Name:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Phone:</strong> ${order.customerPhone}</p>
        <p><strong>Emirate:</strong> ${order.customerEmirate}</p>
        <p><strong>Address:</strong> ${order.customerAddress}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #333;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr style="background: #007bff; color: white;">
              <th style="padding: 10px; text-align: left;">Image</th>
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Order Summary</h3>
        <p><strong>Subtotal:</strong> ${formatCurrency(order.subtotal)}</p>
        ${order.discountAmount > 0 ? `<p><strong>Discount:</strong> -${formatCurrency(order.discountAmount)}</p>` : ''}
        <p><strong>Shipping:</strong> ${formatCurrency(order.shipping)}</p>
        <p><strong>VAT (5%):</strong> ${formatCurrency(order.vat)}</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;">
        <p style="font-size: 18px; font-weight: bold; color: #007bff;"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
        <p>This is an automated notification from Genosys Middle East FZ-LLC</p>
        <p>Please process this order and update the customer accordingly.</p>
      </div>
    </div>
  `
}

// Send order notification to admin
export async function sendOrderNotification(order: any): Promise<boolean> {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"Genosys Orders" <${EMAIL_CONFIG.auth.user}>`,
      to: ADMIN_EMAIL,
      subject: `New Order #${order.orderNumber || order.id} - ${order.customerName || 'Customer'} - ${formatCurrency(order.total || order.totalAmount)}`,
      html: generateOrderSummaryHTML(order),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order notification sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending order notification:', error)
    return false
  }
}

// Send order confirmation to customer
export async function sendOrderConfirmation(order: any): Promise<boolean> {
  try {
    const transporter = createTransporter()
    
    const customerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Order Confirmation</h2>
        
        <p>Dear ${order.customerName},</p>
        
        <p>Thank you for your order! We have received your order and will process it shortly.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order.orderNumber || order.id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt || new Date()).toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</p>
          <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
        </div>

        <p>We will send you another email once your order has been shipped.</p>
        
        <p>If you have any questions, please contact us at +971 58 548 76 65.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
          <p>Genosys Middle East FZ-LLC</p>
          <p>Professional Skincare Products</p>
        </div>
      </div>
    `
    
    const mailOptions = {
      from: `"Genosys Middle East" <${EMAIL_CONFIG.auth.user}>`,
      to: order.customerEmail,
      subject: `Order Confirmation #${order.orderNumber || order.id} - Genosys Middle East`,
      html: customerHTML,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order confirmation sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending order confirmation:', error)
    return false
  }
}

// Send order status update to customer
export async function sendOrderStatusUpdate(order: any, newStatus: string): Promise<boolean> {
  try {
    const transporter = createTransporter()
    
    const statusMessages: { [key: string]: string } = {
      'PROCESSING': 'Your order is being processed and prepared for shipment.',
      'SHIPPED': 'Great news! Your order has been shipped and is on its way to you.',
      'DELIVERED': 'Your order has been delivered successfully. Thank you for your business!',
      'CANCELLED': 'Your order has been cancelled as requested.'
    }
    
    const statusMessage = statusMessages[newStatus.toUpperCase()] || 'Your order status has been updated.'
    
    const customerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Order Status Update</h2>
        
        <p>Dear ${order.customerName},</p>
        
        <p>${statusMessage}</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order.orderNumber || order.id}</p>
          <p><strong>Status:</strong> <span style="color: #007bff; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</p>
        </div>

        <p>If you have any questions about your order, please contact us at +971 58 548 76 65.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
          <p>Genosys Middle East FZ-LLC</p>
          <p>Professional Skincare Products</p>
        </div>
      </div>
    `
    
    const mailOptions = {
      from: `"Genosys Middle East" <${EMAIL_CONFIG.auth.user}>`,
      to: order.customerEmail,
      subject: `Order Status Update #${order.orderNumber || order.id} - ${newStatus.toUpperCase()}`,
      html: customerHTML,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order status update sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending order status update:', error)
    return false
  }
}
