/**
 * Email template for sending gift certificates to customers
 * This can be used with nodemailer or your email service
 */

import { SITE_URL } from '@/lib/siteConfig'
import { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM } from '@/lib/envValidation'

interface CertificateEmailProps {
  recipientName?: string
  recipientEmail: string
  certificateCode: string
  amount: number
  currency: string
  senderName?: string
  senderMessage?: string
  certificateUrl: string
}

export function generateCertificateEmail({
  recipientName = 'Valued Customer',
  recipientEmail: _recipientEmail, // Used by caller (sendCertificateEmail)
  certificateCode,
  amount,
  currency = 'AED',
  senderName,
  senderMessage,
  certificateUrl,
}: CertificateEmailProps): { subject: string; html: string; text: string } {
  const subject = `${senderName ? `${senderName} sent you a ` : ''}GENOSYS Gift Certificate - ${amount} ${currency}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GENOSYS Gift Certificate</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #fff5f7 0%, #ffe4e6 100%); min-height: 100vh;">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header with gradient -->
    <div style="background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); padding: 40px 20px; text-align: center;">
      <img src="${SITE_URL}/Logo/BIGLogo-high.png" alt="GENOSYS" style="max-width: 200px; height: auto; margin-bottom: 20px;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        🎁 You've Received a Gift Certificate!
      </h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      ${senderName ? `
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
            <strong style="color: #78350f;">From:</strong> ${senderName}
          </p>
          ${senderMessage ? `
            <p style="margin: 15px 0 0 0; color: #92400e; font-size: 14px; line-height: 1.6; font-style: italic;">
              "${senderMessage}"
            </p>
          ` : ''}
        </div>
      ` : ''}

      <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
        Dear ${recipientName},
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
        ${senderName ? `${senderName} has sent you` : 'You have received'} a gift certificate for premium GENOSYS Korean dermacosmetics!
      </p>

      <!-- Certificate Badge -->
      <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 3px solid #ec4899; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
        <div style="color: #9f1239; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">
          Certificate Code
        </div>
        <div style="background: white; border-radius: 8px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 4px;">
            ${certificateCode}
          </div>
        </div>
        <div style="margin-top: 20px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); color: white; padding: 20px 40px; border-radius: 50px; box-shadow: 0 4px 12px rgba(244, 63, 94, 0.4);">
            <span style="font-size: 36px; font-weight: bold;">${amount}</span>
            <span style="font-size: 24px; margin-left: 5px;">${currency}</span>
          </div>
        </div>
      </div>

      <!-- QR Code -->
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
          Scan to view your certificate
        </p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(certificateUrl)}" 
             alt="Certificate QR Code" 
             style="border-radius: 8px; border: 2px solid #e5e7eb; padding: 10px; background: white;">
      </div>

      <!-- How to Redeem -->
      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 16px;">
          🎯 How to Redeem
        </h3>
        <ol style="color: #047857; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
          <li>Visit <a href="${SITE_URL}" style="color: #059669; text-decoration: none; font-weight: 600;">${SITE_URL.replace('https://', '')}</a></li>
          <li>Choose your favorite products</li>
          <li>Enter your certificate code at checkout</li>
          <li>The amount will be deducted from your order total</li>
        </ol>
      </div>

      <!-- View Certificate Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="${certificateUrl}" 
           style="display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3); transition: all 0.3s;">
          View Full Certificate →
        </a>
      </div>

      <!-- Terms -->
      <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <p style="color: #78350f; font-size: 13px; line-height: 1.6; margin: 0;">
          <strong>📅 Validity:</strong> This certificate is valid for 6 months from the date of issue.<br>
          <strong>💎 Usage:</strong> Can be used for any GENOSYS products or services.<br>
          <strong>🔄 Transfer:</strong> Can be gifted to another person.<br>
          <strong>⚠️ Note:</strong> Non-refundable and cannot be exchanged for cash.
        </p>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
        If you have any questions, please don't hesitate to contact us.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #1f2937; padding: 30px; text-align: center;">
      <div style="margin-bottom: 20px;">
        <a href="mailto:sales@genosys.ae" style="color: #f9fafb; text-decoration: none; margin: 0 10px; font-size: 14px;">
          📧 sales@genosys.ae
        </a>
        <span style="color: #9ca3af;">|</span>
        <a href="tel:+971585487665" style="color: #f9fafb; text-decoration: none; margin: 0 10px; font-size: 14px;">
          📞 +971 58 548 76 65
        </a>
      </div>
      <div style="margin-bottom: 20px;">
        <a href="${SITE_URL}" style="color: #f9fafb; text-decoration: none; font-size: 14px;">
          🌐 ${SITE_URL.replace('https://', '')}
        </a>
      </div>
      <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0; font-style: italic;">
        Professional Korean Dermacosmetics in UAE
      </p>
      <p style="color: #6b7280; font-size: 11px; margin: 10px 0 0 0;">
        © ${new Date().getFullYear()} GENOSYS Middle East FZ-LLC. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
GENOSYS Gift Certificate

${senderName ? `From: ${senderName}\n${senderMessage ? `Message: "${senderMessage}"\n` : ''}` : ''}

Dear ${recipientName},

${senderName ? `${senderName} has sent you` : 'You have received'} a gift certificate for premium GENOSYS Korean dermacosmetics!

Certificate Code: ${certificateCode}
Amount: ${amount} ${currency}

How to Redeem:
1. Visit www.genosys.ae
2. Choose your favorite products
3. Enter your certificate code at checkout
4. The amount will be deducted from your order total

View your certificate online: ${certificateUrl}

Validity: 6 months from date of issue
Terms: Valid for any GENOSYS products. Non-refundable, cannot be exchanged for cash.

Questions? Contact us:
Email: sales@genosys.ae
Phone: +971 58 548 76 65
Website: www.genosys.ae

© ${new Date().getFullYear()} GENOSYS Middle East FZ-LLC
Professional Korean Dermacosmetics in UAE
  `

  return { subject, html, text }
}

// Example usage with nodemailer (for API route)
export async function sendCertificateEmail(props: CertificateEmailProps): Promise<boolean> {
  try {
    // Import nodemailer dynamically
    const nodemailer = await import('nodemailer')
    
    // Create transporter (configure with your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT || 587),
      secure: EMAIL_SECURE === 'true',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    })

    const { subject, html, text } = generateCertificateEmail(props)

    // Send email
    await transporter.sendMail({
      from: `"GENOSYS Middle East" <${EMAIL_FROM || 'sales@genosys.ae'}>`,
      to: props.recipientEmail,
      subject,
      text,
      html,
    })

    return true
  } catch (error) {
    console.error('Failed to send certificate email:', error)
    return false
  }
}

