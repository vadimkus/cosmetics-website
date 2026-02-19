require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const nodemailer = require('nodemailer')

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
const LOGO_URL = `${SITE_URL}/_next/image?url=%2FLogo%2FFull.png&w=640&q=75`
const APP_STORE_URL = 'https://apps.apple.com/ae/app/genosys-uae/id6756648064'

const targetEmail = process.argv[2] || 'f.this.that@gmail.com'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || process.env.GMAIL_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 30000,
})

const subject = 'The Genosys UAE App Is Here'

const html = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download the Genosys UAE App</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-font-smoothing: antialiased;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 580px;">
          
          <!-- Logo -->
          <tr>
            <td style="text-align: center; padding-bottom: 48px;">
              <img src="${LOGO_URL}" alt="GENOSYS" style="height: 32px; width: auto;" />
            </td>
          </tr>
          
          <!-- Status Icon -->
          <tr>
            <td style="text-align: center; padding-bottom: 24px;">
              <div style="display: inline-block; width: 64px; height: 64px; background-color: #0071e3; border-radius: 50%; line-height: 64px; font-size: 32px; color: #ffffff;">
                📱
              </div>
            </td>
          </tr>
          
          <!-- Main Heading -->
          <tr>
            <td style="text-align: center; padding-bottom: 12px;">
              <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
                The Genosys UAE App Is Here
              </h1>
            </td>
          </tr>
          
          <!-- Subtitle -->
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; color: #86868b;">
                Now available on the App Store
              </span>
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; line-height: 1.5; color: #1d1d1f; text-align: center; padding-bottom: 32px;">
              Your favourite Korean skincare is now just a tap away. Browse products, get personalised recommendations, and check out in minutes — all from your iPhone.
            </td>
          </tr>
          
          <!-- Features Card -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f7; border-radius: 12px;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 16px;">What's Inside</div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #1d1d1f; line-height: 2.0;">
                      <div style="margin-bottom: 4px;">🧬 &nbsp;AI Skin Analysis — personalised skincare routine</div>
                      <div style="margin-bottom: 4px;">🛍️ &nbsp;Shop & check out in minutes</div>
                      <div style="margin-bottom: 4px;">🎁 &nbsp;Build Your Set with bundle discounts</div>
                      <div>🔔 &nbsp;Push notifications for order updates</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="text-align: center; padding-bottom: 16px;">
              <a href="${APP_STORE_URL}" style="display: inline-block; background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 500; text-decoration: none; padding: 14px 32px; border-radius: 980px; letter-spacing: -0.01em;">
                 &nbsp;Download on the App Store
              </a>
            </td>
          </tr>
          
          <!-- Secondary Link -->
          <tr>
            <td style="text-align: center; padding-bottom: 48px;">
              <a href="${SITE_URL}/products" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #0071e3; text-decoration: none; font-weight: 500;">
                or continue shopping on genosys.ae &rarr;
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding-top: 32px; border-top: 1px solid #d2d2d7;">
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #86868b; line-height: 1.6;">
                Genosys Middle East FZ-LLC<br>
                Official Distributor in the UAE<br><br>
                &copy; 2026 All rights reserved.
              </div>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

async function sendEmail() {
  const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER
  const emailPassword = process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD

  if (!emailUser || !emailPassword) {
    console.error('❌ Missing email credentials. Set EMAIL_USER/EMAIL_PASSWORD or GMAIL_USER/GMAIL_APP_PASSWORD in .env.local')
    process.exit(1)
  }

  console.log(`📧 Sending app launch marketing email to: ${targetEmail}`)
  console.log(`📧 From: ${emailUser}`)
  console.log(`📧 Subject: ${subject}`)
  console.log('')

  try {
    const result = await transporter.sendMail({
      from: `"Genosys Middle East FZ-LLC" <${emailUser}>`,
      to: targetEmail,
      subject,
      html,
    })

    console.log('✅ Email sent successfully!')
    console.log(`📬 Message ID: ${result.messageId}`)
    console.log(`📬 Response: ${result.response}`)
  } catch (error) {
    console.error('❌ Failed to send email:', error.message)
    if (error.code) console.error('❌ Error code:', error.code)
    process.exit(1)
  }
}

sendEmail()
