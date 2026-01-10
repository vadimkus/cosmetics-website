/**
 * Email Transporter Configuration
 * SMTP configuration and core email sending functionality
 */

import nodemailer from 'nodemailer'
import { debugLog, errorLog } from '@/lib/logger'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getPreferredEmail } from '@/lib/emailHelpers'
import type { EmailSendResult, NodemailerError } from './types'

// Email configuration - Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || process.env.GMAIL_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD,
  },
})

// Verify connection configuration on startup
transporter.verify((error, _success) => {
  if (error) {
    debugLog('❌ SMTP connection error:', error)
  } else {
    debugLog('✅ SMTP server is ready to take our messages')
  }
})

/**
 * Send an email using the configured transporter
 * Handles contact email preferences and error logging
 */
export const sendEmail = async (to: string, subject: string, html: string): Promise<EmailSendResult> => {
  try {
    // Check if user has a different preferred contact email
    let recipientEmail = to
    try {
      const user = await findUserByEmail(to)
      if (user) {
        recipientEmail = getPreferredEmail(user)
      }
    } catch {
      // Ignore lookup failures; fall back to provided email
    }
    
    debugLog(`📧 Sending email to: ${recipientEmail}`)
    debugLog(`   Subject: ${subject}`)
    debugLog(`   Original email: ${to}`)
    if (recipientEmail !== to) {
      debugLog(`   Using contact email instead: ${recipientEmail}`)
    }
    
    const mailOptions = {
      from: {
        name: 'GENOSYS',
        address: process.env.EMAIL_USER || process.env.GMAIL_USER || 'noreply@genosys.ae'
      },
      to: recipientEmail,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    debugLog('✅ Email sent successfully!')
    debugLog(`   Message ID: ${info.messageId}`)
    debugLog(`   Response: ${info.response}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    errorLog('❌ Error sending email')
    errorLog('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error)
    errorLog('❌ Error message:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error && error.stack) {
      errorLog('❌ Error stack:', error.stack)
    }
    // Check for specific nodemailer errors
    if (error && typeof error === 'object' && 'code' in error) {
      const smtpError = error as NodemailerError
      errorLog('❌ Error code:', smtpError.code)
      errorLog('❌ Error command:', smtpError.command)
    }
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Get the configured transporter for advanced use cases
 */
export function getTransporter() {
  return transporter
}
