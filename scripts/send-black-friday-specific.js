require('dotenv').config({ path: '.env.local' })
const nodemailer = require('nodemailer')

const TARGET_EMAILS = [
  'anastasiia@canaryclub.com',
  'yekaterina.larionova@gmail.com'
]
const BLOG_LINK = 'https://genosys.ae/blog/black-friday-sale-20-off'

// Email template
const emailHtml = (userName) => `
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
      <a href="${BLOG_LINK}" 
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
      <a href="https://genosys.ae/products" 
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

async function sendToSpecific() {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ Missing email credentials. Please check .env.local file')
      process.exit(1)
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    console.log('📧 Sending Black Friday email to specific addresses...')
    console.log('📧 Using Gmail account:', process.env.GMAIL_USER)
    console.log(`📧 Target emails: ${TARGET_EMAILS.join(', ')}`)

    const results = {
      sent: 0,
      failed: 0,
      errors: []
    }

    for (let i = 0; i < TARGET_EMAILS.length; i++) {
      const email = TARGET_EMAILS[i]
      try {
        console.log(`[${i + 1}/${TARGET_EMAILS.length}] Sending to ${email}...`)

        const result = await transporter.sendMail({
          from: `"Genosys Middle East FZ-LLC" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: '✨ BLACK FRIDAY SALE — 20% OFF ✨',
          html: emailHtml('Valued Customer'),
        })

        results.sent++
        console.log(`✅ Sent to ${email} (Message ID: ${result.messageId})`)

        // Small delay between emails
        if (i < TARGET_EMAILS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (error) {
        results.failed++
        const errorMessage = error.message || 'Unknown error'
        results.errors.push({ email, error: errorMessage })
        console.error(`❌ Failed to send to ${email}:`, errorMessage)
      }
    }

    console.log('\n📊 Summary:')
    console.log(`✅ Successfully sent: ${results.sent}`)
    console.log(`❌ Failed: ${results.failed}`)

    if (results.errors.length > 0) {
      console.log('\n❌ Errors:')
      results.errors.forEach(({ email, error }) => {
        console.log(`  - ${email}: ${error}`)
      })
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

sendToSpecific()

