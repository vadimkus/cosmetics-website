#!/usr/bin/env node

/**
 * Bulk send: "The Genosys UAE App Is Here" marketing email to all users
 * Excludes: jeongmi.kim.korea@gmail.com + Apple Private Relay addresses
 * Delay between sends to respect Gmail SMTP rate limits
 */

const { PrismaClient } = require('@prisma/client')
const nodemailer = require('nodemailer')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const EXCLUDED_EMAILS = [
  'jeongmi.kim.korea@gmail.com',
]

const DELAY_MS = 2000

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
const LOGO_URL = `${SITE_URL}/_next/image?url=%2FLogo%2FFull.png&w=640&q=75`
const APP_STORE_URL = 'https://apps.apple.com/ae/app/genosys-uae/id6756648064'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL is required.')
  process.exit(1)
}

let prisma
const isAccelerate = databaseUrl.startsWith('prisma+')
if (isAccelerate) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error', 'warn'] })
} else {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter, log: ['error', 'warn'] })
}

const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER
const emailPassword = process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD

if (!emailUser || !emailPassword) {
  console.error('❌ Missing email credentials.')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: emailUser, pass: emailPassword },
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
                &#128241;
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
              Your favourite Korean skincare is now just a tap away. Browse products, get personalised recommendations, and check out in minutes &mdash; all from your iPhone.
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
                      <div style="margin-bottom: 4px;">&#129516; &nbsp;AI Skin Analysis &mdash; personalised skincare routine</div>
                      <div style="margin-bottom: 4px;">&#128717;&#65039; &nbsp;Shop &amp; check out in minutes</div>
                      <div style="margin-bottom: 4px;">&#127873; &nbsp;Build Your Set with bundle discounts</div>
                      <div>&#128276; &nbsp;Push notifications for order updates</div>
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
                &#63743; &nbsp;Download on the App Store
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

function isApplePrivateRelay(email) {
  if (!email) return true
  const lower = email.toLowerCase()
  return (
    lower.includes('@privaterelay.appleid.com') ||
    lower.includes('@genosys.local') ||
    lower.startsWith('apple+') ||
    lower.startsWith('deleted+')
  )
}

function getPreferredEmail(user) {
  if (user.contactEmail && user.contactEmail.trim() !== '') {
    return user.contactEmail.trim()
  }
  return user.email
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  try {
    console.log('📋 Fetching all users from database...\n')

    const users = await prisma.user.findMany({
      select: { id: true, email: true, contactEmail: true, name: true },
    })

    console.log(`📊 Total users in database: ${users.length}\n`)

    const recipients = []
    const skipped = []

    for (const user of users) {
      const email = getPreferredEmail(user)
      const lowerEmail = email.toLowerCase()

      if (EXCLUDED_EMAILS.includes(lowerEmail)) {
        skipped.push({ email, reason: 'excluded' })
        continue
      }
      if (isApplePrivateRelay(email)) {
        skipped.push({ email, reason: 'apple-private-relay' })
        continue
      }
      recipients.push({ email, name: user.name })
    }

    console.log(`✅ Recipients to send: ${recipients.length}`)
    console.log(`⏭️  Skipped: ${skipped.length}`)
    if (skipped.length > 0) {
      for (const s of skipped) {
        console.log(`   - ${s.email} (${s.reason})`)
      }
    }
    console.log('')

    let sent = 0
    let failed = 0

    for (let i = 0; i < recipients.length; i++) {
      const { email, name } = recipients[i]
      const progress = `[${i + 1}/${recipients.length}]`

      try {
        const result = await transporter.sendMail({
          from: `"Genosys Middle East FZ-LLC" <${emailUser}>`,
          to: email,
          subject,
          html,
        })
        sent++
        console.log(`${progress} ✅ ${email} — ${result.messageId}`)
      } catch (err) {
        failed++
        console.error(`${progress} ❌ ${email} — ${err.message}`)
      }

      if (i < recipients.length - 1) {
        await sleep(DELAY_MS)
      }
    }

    console.log('\n========================================')
    console.log(`📧 Done! Sent: ${sent}, Failed: ${failed}, Skipped: ${skipped.length}`)
    console.log('========================================')
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
