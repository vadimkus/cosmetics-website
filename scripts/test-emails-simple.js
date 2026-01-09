/**
 * Simple email test script
 * Run with: node scripts/test-emails-simple.js
 */

const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const eqIndex = line.indexOf('=')
      if (eqIndex > 0) {
        const key = line.substring(0, eqIndex).trim()
        let value = line.substring(eqIndex + 1).trim()
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        process.env[key] = value
      }
    }
  })
}

const TEST_EMAIL = process.argv[2] || 'f.this.that@gmail.com'

console.log(`\n📧 Testing email templates to: ${TEST_EMAIL}\n`)
console.log('='.repeat(50))
console.log(`Using EMAIL_USER: ${process.env.EMAIL_USER}`)

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || process.env.GMAIL_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD,
  },
})

async function sendTestEmail(to, subject, html) {
  try {
    const result = await transporter.sendMail({
      from: `"GENOSYS Test" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    })
    return { success: true, messageId: result.messageId }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Load translations
function loadTranslations(locale, section) {
  try {
    const messages = require(`../messages/${locale}.json`)
    return messages.orderEmail?.[section] || {}
  } catch {
    return {}
  }
}

// Generate Welcome Email HTML
function generateWelcomeHTML(locale, firstName, email, password) {
  const t = loadTranslations(locale, 'welcome')
  const isRTL = locale === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'
  const textAlign = isRTL ? 'right' : 'left'
  
  const greeting = (t.greeting || 'Welcome, {firstName}').replace('{firstName}', firstName)
  const accountCreated = t.accountCreated || 'Your account has been created successfully.'
  const accountDetails = t.accountDetails || 'Account Details'
  const emailLabel = t.email || 'Email:'
  const passwordLabel = t.password || 'Password:'
  const startShopping = t.startShopping || 'Start Shopping'
  const officialDist = t.officialDistributor || 'Official Distributor in the UAE'
  const copyright = t.copyright || '© 2026 All rights reserved.'
  
  return `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${dir}">
    <head><meta charset="UTF-8"><title>Welcome</title></head>
    <body style="margin:0;padding:0;background:#fff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto;padding:40px 20px;">
        <tr><td style="text-align:center;padding-bottom:32px;">
          <img src="https://genosys.ae/_next/image?url=%2FLogo%2FFull.png&w=640&q=75" alt="GENOSYS" height="32"/>
        </td></tr>
        <tr><td style="text-align:center;padding-bottom:16px;">
          <h1 style="margin:0;font-size:28px;color:#1d1d1f;">${greeting}</h1>
        </td></tr>
        <tr><td style="text-align:center;color:#86868b;padding-bottom:24px;">${accountCreated}</td></tr>
        ${password ? `
        <tr><td style="padding:24px;background:#f5f5f7;border-radius:12px;margin-bottom:24px;">
          <div style="text-transform:uppercase;font-size:12px;color:#86868b;margin-bottom:12px;text-align:${textAlign};">${accountDetails}</div>
          <div style="text-align:${textAlign};">
            <div style="margin-bottom:8px;"><span style="color:#86868b;">${emailLabel}</span> <strong>${email}</strong></div>
            <div><span style="color:#86868b;">${passwordLabel}</span> <strong>${password}</strong></div>
          </div>
        </td></tr>
        ` : ''}
        <tr><td style="text-align:center;padding:24px 0;">
          <a href="https://genosys.ae/${locale === 'en' ? '' : locale + '/'}products" style="display:inline-block;background:#0071e3;color:#fff;padding:12px 24px;border-radius:980px;text-decoration:none;font-weight:500;">${startShopping}</a>
        </td></tr>
        <tr><td style="text-align:center;color:#86868b;font-size:12px;padding-top:24px;border-top:1px solid #d2d2d7;">
          Genosys Middle East FZ-LLC<br>${officialDist}<br><br>${copyright}
        </td></tr>
      </table>
    </body>
    </html>
  `
}

// Generate Password Reset HTML
function generatePasswordResetHTML(locale, firstName) {
  const t = loadTranslations(locale, 'passwordReset')
  const isRTL = locale === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'
  const textAlign = isRTL ? 'right' : 'left'
  
  const heading = locale === 'ru' ? 'Сброс пароля' : locale === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Your Password'
  const message = locale === 'ru' 
    ? `Здравствуйте, ${firstName}, мы получили запрос на сброс вашего пароля.`
    : locale === 'ar'
    ? `مرحباً ${firstName}، تلقينا طلباً لإعادة تعيين كلمة المرور.`
    : `Hi ${firstName}, we received a request to reset your password.`
  const buttonText = t.resetButton || (locale === 'ru' ? 'Сбросить пароль' : locale === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password')
  const expiry = locale === 'ru' ? 'Ссылка действительна 30 минут' : locale === 'ar' ? 'صلاحية الرابط 30 دقيقة' : 'Link expires in 30 minutes'
  
  return `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${dir}">
    <head><meta charset="UTF-8"><title>${heading}</title></head>
    <body style="margin:0;padding:0;background:#fff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto;padding:40px 20px;">
        <tr><td style="text-align:center;padding-bottom:32px;">
          <img src="https://genosys.ae/_next/image?url=%2FLogo%2FFull.png&w=640&q=75" alt="GENOSYS" height="32"/>
        </td></tr>
        <tr><td style="text-align:center;padding-bottom:16px;">
          <div style="width:64px;height:64px;background:#f5f5f7;border-radius:50%;margin:0 auto;line-height:64px;font-size:32px;">🔐</div>
        </td></tr>
        <tr><td style="text-align:center;padding-bottom:16px;">
          <h1 style="margin:0;font-size:28px;color:#1d1d1f;">${heading}</h1>
        </td></tr>
        <tr><td style="text-align:${textAlign};color:#1d1d1f;padding-bottom:24px;">${message}</td></tr>
        <tr><td style="text-align:center;padding-bottom:24px;">
          <a href="https://genosys.ae/reset-password/test-token" style="display:inline-block;background:#0071e3;color:#fff;padding:12px 24px;border-radius:980px;text-decoration:none;font-weight:500;">${buttonText}</a>
        </td></tr>
        <tr><td style="text-align:center;padding:16px;background:#f5f5f7;border-radius:12px;">
          <div style="color:#1d1d1f;">⏱ ${expiry}</div>
        </td></tr>
      </table>
    </body>
    </html>
  `
}

// Generate COD Order HTML
function generateCODHTML(locale, orderNumber) {
  const t = loadTranslations(locale, 'cod')
  const isRTL = locale === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'
  const textAlign = isRTL ? 'right' : 'left'
  
  const orderConfirmed = locale === 'ru' ? 'Заказ подтвержден' : locale === 'ar' ? 'تم تأكيد الطلب' : 'Order Confirmed'
  const codPayment = locale === 'ru' ? '💵 Оплата: При получении' : locale === 'ar' ? '💵 الدفع: عند الاستلام' : '💵 Payment: Cash on Delivery'
  const greeting = locale === 'ru' 
    ? 'Спасибо за ваш заказ. Вы оплатите заказ наличными при получении.'
    : locale === 'ar'
    ? 'شكراً لطلبك. ستدفع نقداً عند الاستلام.'
    : 'Thank you for your order. You\'ll pay via Cash on Delivery when your order arrives.'
  const subtotal = t.subtotal || 'Subtotal'
  const shipping = (t.shippingTo || 'Shipping to {emirate}').replace('{emirate}', 'Dubai')
  const freeText = t.free || 'FREE'
  const vat = t.vat || 'VAT (5%)'
  const total = t.totalLabel || 'Total:'
  const delivery = t.deliveryInformation || 'Delivery'
  const viewOrder = locale === 'ru' ? 'Посмотреть заказ' : locale === 'ar' ? 'عرض الطلب' : 'View Order'
  
  return `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${dir}">
    <head><meta charset="UTF-8"><title>${orderConfirmed}</title></head>
    <body style="margin:0;padding:0;background:#fff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto;padding:40px 20px;">
        <tr><td style="text-align:center;padding-bottom:32px;">
          <img src="https://genosys.ae/_next/image?url=%2FLogo%2FFull.png&w=640&q=75" alt="GENOSYS" height="32"/>
        </td></tr>
        <tr><td style="text-align:center;padding-bottom:16px;">
          <div style="width:64px;height:64px;background:#34c759;border-radius:50%;margin:0 auto;line-height:64px;font-size:32px;color:#fff;">✓</div>
        </td></tr>
        <tr><td style="text-align:center;padding-bottom:8px;">
          <h1 style="margin:0;font-size:28px;color:#1d1d1f;">${orderConfirmed}</h1>
        </td></tr>
        <tr><td style="text-align:center;color:#86868b;padding-bottom:24px;">#${orderNumber}</td></tr>
        <tr><td style="text-align:${textAlign};color:#1d1d1f;padding-bottom:24px;">${greeting}</td></tr>
        <tr><td style="padding:16px;background:#fff3cd;border-radius:12px;text-align:center;margin-bottom:24px;">
          <span style="color:#856404;font-weight:500;">${codPayment}</span>
        </td></tr>
        <tr><td style="padding-top:24px;border-top:1px solid #f5f5f7;">
          <table width="100%">
            <tr><td style="color:#86868b;text-align:${textAlign};">${subtotal}</td><td style="text-align:${isRTL ? 'left' : 'right'};">AED 456.75</td></tr>
            <tr><td style="color:#86868b;text-align:${textAlign};">${shipping}</td><td style="text-align:${isRTL ? 'left' : 'right'};">${freeText}</td></tr>
            <tr><td style="color:#86868b;text-align:${textAlign};">${vat}</td><td style="text-align:${isRTL ? 'left' : 'right'};">AED 22.84</td></tr>
            <tr><td style="font-weight:600;text-align:${textAlign};padding-top:12px;border-top:1px solid #f5f5f7;">${total}</td><td style="font-weight:600;text-align:${isRTL ? 'left' : 'right'};padding-top:12px;border-top:1px solid #f5f5f7;">AED 479.59</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px;background:#f5f5f7;border-radius:12px;margin-top:24px;">
          <div style="text-transform:uppercase;font-size:12px;color:#86868b;margin-bottom:8px;text-align:${textAlign};">${delivery}</div>
          <div style="text-align:${textAlign};">Test Customer<br>Dubai Marina, Building 123<br>Dubai, UAE<br>+971 50 123 4567</div>
        </td></tr>
        <tr><td style="text-align:center;padding:24px 0;">
          <a href="https://genosys.ae/${locale === 'en' ? '' : locale + '/'}profile" style="display:inline-block;background:#0071e3;color:#fff;padding:12px 24px;border-radius:980px;text-decoration:none;font-weight:500;">${viewOrder}</a>
        </td></tr>
      </table>
    </body>
    </html>
  `
}

async function runTests() {
  const locales = ['en', 'ru', 'ar']
  let successCount = 0
  let failCount = 0
  
  // Test Welcome Emails
  console.log('\n🎉 Testing WELCOME emails...\n')
  for (const locale of locales) {
    const html = generateWelcomeHTML(locale, 'Test User', TEST_EMAIL, 'TestPass123')
    const subject = locale === 'ru' ? 'Добро пожаловать в GENOSYS' : locale === 'ar' ? 'مرحباً بك في GENOSYS' : 'Welcome to GENOSYS'
    const result = await sendTestEmail(TEST_EMAIL, `[TEST ${locale.toUpperCase()}] ${subject}`, html)
    console.log(`  ${result.success ? '✅' : '❌'} Welcome (${locale}): ${result.success ? 'SENT' : result.error}`)
    result.success ? successCount++ : failCount++
    await delay(1500)
  }
  
  // Test Password Reset Emails
  console.log('\n🔐 Testing PASSWORD RESET emails...\n')
  for (const locale of locales) {
    const html = generatePasswordResetHTML(locale, 'Test User')
    const subject = locale === 'ru' ? 'Сброс пароля - GENOSYS' : locale === 'ar' ? 'إعادة تعيين كلمة المرور - GENOSYS' : 'Reset Your Password - GENOSYS'
    const result = await sendTestEmail(TEST_EMAIL, `[TEST ${locale.toUpperCase()}] ${subject}`, html)
    console.log(`  ${result.success ? '✅' : '❌'} Password Reset (${locale}): ${result.success ? 'SENT' : result.error}`)
    result.success ? successCount++ : failCount++
    await delay(1500)
  }
  
  // Test COD Order Emails
  console.log('\n💵 Testing COD ORDER emails...\n')
  for (const locale of locales) {
    const orderNum = `COD-${locale.toUpperCase()}-${Date.now().toString().slice(-4)}`
    const html = generateCODHTML(locale, orderNum)
    const subject = locale === 'ru' ? `Подтверждение заказа ${orderNum}` : locale === 'ar' ? `تأكيد الطلب ${orderNum}` : `Order Confirmation ${orderNum}`
    const result = await sendTestEmail(TEST_EMAIL, `[TEST ${locale.toUpperCase()}] ${subject}`, html)
    console.log(`  ${result.success ? '✅' : '❌'} COD Order (${locale}): ${result.success ? 'SENT' : result.error}`)
    result.success ? successCount++ : failCount++
    await delay(1500)
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(`\n✅ Success: ${successCount} | ❌ Failed: ${failCount}`)
  console.log(`📬 Check ${TEST_EMAIL} for ${successCount} test emails\n`)
}

runTests().catch(console.error)
