/**
 * Email Transporter Configuration
 * SMTP configuration and core email sending functionality
 */
import nodemailer from 'nodemailer'
import { debugLog, errorLog } from '@/lib/logger'
import { EMAIL_USER, GMAIL_USER, EMAIL_PASSWORD, GMAIL_APP_PASSWORD } from '@/lib/envValidation'

// Email configuration - Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER || GMAIL_USER,
    pass: EMAIL_PASSWORD || GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10000,  // 10s to establish connection
  greetingTimeout: 10000,    // 10s for SMTP greeting
  socketTimeout: 30000,      // 30s for socket inactivity (default was 10 MINUTES!)
})

// Verify connection configuration
transporter.verify((error, _success) => {
  if (error) {
    debugLog('❌ SMTP connection error:', error)
  } else {
    debugLog('✅ SMTP server is ready to take our messages')
  }
})

// NodemailerError type for SMTP error handling
interface NodemailerError {
  code?: string
  command?: string
}

/**
 * Send an email using the configured SMTP transporter
 * Validates environment configuration before sending
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    debugLog('📧 Attempting to send email to:', to)
    debugLog('📧 Using Gmail service')
    
    // Check if email configuration is set (support both EMAIL_* and GMAIL_* variables)
    const emailUser = EMAIL_USER || GMAIL_USER
    const emailPassword = EMAIL_PASSWORD || GMAIL_APP_PASSWORD
    
    debugLog('📧 Using email user:', emailUser)
    
    if (!emailUser) {
      const errorMsg = 'EMAIL_USER or GMAIL_USER environment variable is not set'
      errorLog('❌', errorMsg)
      return { success: false, error: errorMsg }
    }

    if (!emailPassword) {
      const errorMsg = 'EMAIL_PASSWORD or GMAIL_APP_PASSWORD environment variable is not set'
      errorLog('❌', errorMsg)
      return { success: false, error: errorMsg }
    }
    
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Genosys Middle East FZ-LLC" <${emailUser}>`,
      to,
      subject,
      html,
    }

    debugLog('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasHtml: !!mailOptions.html
    })

    const result = await transporter.sendMail(mailOptions)
    debugLog('✅ Email sent successfully')
    debugLog('✅ Message ID:', result.messageId)
    debugLog('✅ Response:', result.response)
    return { success: true, messageId: result.messageId }
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
