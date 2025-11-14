#!/usr/bin/env node

/**
 * Script to send a test email to the admin
 * Usage: node scripts/send-test-admin-email.js [order|user]
 */

require('dotenv').config({ path: '.env.local' })
require('dotenv').config()

const nodemailer = require('nodemailer')

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Get admin email
const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER || '5856825@gmail.com'

const type = process.argv[2] || 'order'

console.log('🧪 Sending test admin email...')
console.log(`📧 Admin email: ${adminEmail}`)
console.log(`📧 Type: ${type}`)
console.log('')

async function sendTestEmail() {
  try {
    let subject, html
    
    if (type === 'order') {
      subject = `Test Order Notification #TEST-${Date.now()} - Genosys Middle East FZ-LLC`
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; margin: 0;">Genosys Middle East FZ-LLC</h1>
            <p style="color: #666; margin: 5px 0;">Test Order Notification</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px; border-left: 5px solid #dc2626;">
            <h2 style="color: #dc2626; margin: 0 0 15px 0;">🛒 Test Order Notification</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
              This is a test email to verify admin email notifications are working correctly.
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #dc2626; margin: 0 0 15px 0;">Order Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #374151;"><strong>Order Number:</strong></p>
                <p style="margin: 0; color: #dc2626; font-size: 18px; font-weight: bold;">#TEST-${Date.now()}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #374151;"><strong>Order Time:</strong></p>
                <p style="margin: 0; color: #374151;">${new Date().toLocaleString()}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #374151;"><strong>Customer Name:</strong></p>
                <p style="margin: 0; color: #374151;">Test Customer</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #374151;"><strong>Customer Email:</strong></p>
                <p style="margin: 0; color: #374151;">test@example.com</p>
              </div>
            </div>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
            <h3 style="color: #dc2626; margin: 0 0 15px 0;">📦 Order Items (4 items)</h3>
            <div style="space-y: 10px;">
              <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #f3f4f6;">
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0; color: #374151; font-size: 16px; font-weight: 600;">SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Quantity: 1 × AED 180.00 = AED 180.00 | Size: 1pc | Color: Beige</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 18px;">AED 180.00</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #f3f4f6;">
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0; color: #374151; font-size: 16px; font-weight: 600;">SNOW O₂ CLEANSER</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Quantity: 2 × AED 95.00 = AED 190.00 | Size: 180ml</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 18px;">AED 190.00</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #f3f4f6;">
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0; color: #374151; font-size: 16px; font-weight: 600;">INTENSIVE PROBLEM CONTROL TONER</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Quantity: 1 × AED 120.00 = AED 120.00 | Size: 200ml</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 18px;">AED 120.00</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #f3f4f6;">
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0; color: #374151; font-size: 16px; font-weight: 600;">MULTI VITA RADIANCE SERUM</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Quantity: 1 × AED 150.00 = AED 150.00 | Size: 30ml</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 18px;">AED 150.00</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #dc2626; margin: 0 0 15px 0;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Subtotal:</span>
              <span style="color: #374151;">AED 550.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">Shipping:</span>
              <span style="color: #374151;">AED 45.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #374151;">VAT:</span>
              <span style="color: #374151;">AED 28.25</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 8px;">
              <span>Total:</span>
              <span>AED 587.25</span>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              This is a test notification from Genosys Middle East FZ-LLC
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
              Official Genosys distributor in the United Arab Emirates
            </p>
          </div>
        </div>
      `
    } else {
      subject = 'Test User Notification - Genosys Middle East FZ-LLC'
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626;">Test User Registration Notification</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> Test User</p>
            <p><strong>Email:</strong> test@example.com</p>
            <p><strong>Phone:</strong> +971 50 123 4567</p>
            <p><strong>Address:</strong> Test Address, Dubai</p>
            <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
              This is a test notification to verify admin email notifications are working correctly.
            </p>
          </div>
        </div>
      `
    }
    
    const result = await transporter.sendMail({
      from: `"Genosys Middle East FZ-LLC" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: subject,
      html: html
    })
    
    console.log('✅ Test email sent successfully!')
    console.log(`📧 Message ID: ${result.messageId}`)
    console.log(`📧 Sent to: ${adminEmail}`)
    console.log(`📧 Subject: ${subject}`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error sending test email:', error.message)
    if (error.response) {
      console.error('Response:', error.response)
    }
    process.exit(1)
  }
}

sendTestEmail()
