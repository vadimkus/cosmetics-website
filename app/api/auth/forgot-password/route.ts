import { NextRequest, NextResponse } from 'next/server'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { findUserByEmail } from '@/lib/userStorageDb'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { debugLog, errorLog } from '@/lib/logger'
import { createPasswordResetToken } from '@/lib/passwordReset'
import { sendPasswordResetEmail } from '@/lib/email'

// Rate limiter for password reset requests (20 requests per hour per IP)
const forgotPasswordLimiter = rateLimitSimple({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 attempts per hour
  message: 'Too many password reset requests. Please try again later.'
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[FORGOT-PASSWORD] Request started')
  
  try {
    // CSRF protection
    debugLog('[FORGOT-PASSWORD] Checking CSRF token...')
    const csrfCheck = await requireCsrfToken(request)
    if (!csrfCheck.valid) {
      debugLog('[FORGOT-PASSWORD] CSRF check failed')
      return csrfCheck.response!
    }
    debugLog('[FORGOT-PASSWORD] CSRF check passed', Date.now() - startTime, 'ms')

    // Request body size limit check
    debugLog('[FORGOT-PASSWORD] Checking body size...')
    const sizeLimit = getSizeLimitForContentType(request)
    const sizeCheck = requireBodySizeLimit(request, sizeLimit)
    if (!sizeCheck.valid) {
      debugLog('[FORGOT-PASSWORD] Body size check failed')
      return sizeCheck.response!
    }

    // Apply rate limiting
    debugLog('[FORGOT-PASSWORD] Getting client identifier...')
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (rateLimitError) {
      errorLog('[FORGOT-PASSWORD] Rate limit identifier error:', rateLimitError)
      clientIdentifier = 'unknown'
    }

    // Apply rate limiting - fail closed for security
    debugLog('[FORGOT-PASSWORD] Applying rate limiting...', Date.now() - startTime, 'ms')
    const rateLimitStart = Date.now()
    let rateLimitResult
    try {
      rateLimitResult = await forgotPasswordLimiter(clientIdentifier)
    } catch (rateLimitError) {
      errorLog('[FORGOT-PASSWORD] Rate limiting error:', rateLimitError)
      // Fail closed - reject request if rate limiting fails
      return NextResponse.json(
        { error: 'Rate limiting service unavailable. Please try again later.' },
        { status: 503 }
      )
    }
    debugLog('[FORGOT-PASSWORD] Rate limiting completed', Date.now() - rateLimitStart, 'ms')
    
    if (!rateLimitResult || !rateLimitResult.success) {
      debugLog('[FORGOT-PASSWORD] Rate limit exceeded')
      return NextResponse.json(
        { error: rateLimitResult?.message || 'Rate limit exceeded' },
        { status: 429 }
      )
    }
    debugLog('[FORGOT-PASSWORD] Rate limiting passed', Date.now() - startTime, 'ms')

    // Parse request body
    debugLog('[FORGOT-PASSWORD] Parsing request body...')
    const { email } = await request.json()
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    debugLog('[FORGOT-PASSWORD] Email:', email, Date.now() - startTime, 'ms')

    // Check if user exists (but don't reveal if they don't - security best practice)
    const user = await findUserByEmail(email.toLowerCase().trim())
    
    // Always return success message to prevent email enumeration attacks
    // But only send email if user actually exists
    if (user) {
      try {
        debugLog('[FORGOT-PASSWORD] User found, creating reset token...')
        
        // Create password reset token
        const plainToken = await createPasswordResetToken(user.id)
        
        // Send password reset email
        debugLog('[FORGOT-PASSWORD] Sending reset email...')
        const emailResult = await sendPasswordResetEmail(user.email, user.name, plainToken)
        
        if (emailResult.success) {
          debugLog('[FORGOT-PASSWORD] Password reset email sent successfully')
        } else {
          errorLog('[FORGOT-PASSWORD] Failed to send email:', emailResult.error)
          // Still return success to user (don't reveal email failure)
        }
      } catch {
        errorLog('[FORGOT-PASSWORD] Error processing password reset:', error)
        // Still return success to user (don't reveal internal errors)
      }
    } else {
      debugLog('[FORGOT-PASSWORD] User not found (not revealing to client)')
      // Don't reveal that user doesn't exist - security best practice
    }

    // Always return success message (prevents email enumeration)
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    })

  } catch {
    errorLog('[FORGOT-PASSWORD] Error:', error)
    // Return generic error message
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

