import { NextRequest, NextResponse, after } from 'next/server'
import { Prisma } from '@prisma/client'
import { findUserByEmail } from '@/lib/userStorageDb'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'
import { trackUserAction } from '@/lib/analyticsServer'
import { sendWelcomeEmail, sendAdminNewUserNotification } from '@/lib/email'
import { isApplePrivateRelayEmail } from '@/lib/emailHelpers'
import bcrypt from 'bcryptjs'
import { requireCsrfToken } from '@/lib/csrf'
import { validateLength, validateBirthday, INPUT_LIMITS } from '@/lib/validation'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { parseUserAgent } from '@/lib/deviceDetection'
import { getGeolocationData } from '@/lib/geolocation'
import { trackUserActivityNow } from '@/lib/activityTracker'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { validateRegistrationEmail } from '@/lib/emailDomainValidation.server'

const normalizePromo = (promo: unknown) => String(promo || '').trim().toUpperCase()

// Rate limiting for registration (mirrors mobile register: bulk account
// creation protection; generous enough for legitimate shared-IP users)
const registerLimiter = rateLimitSimple({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 registration attempts per hour per client
})

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  // Request body size limit check (DoS prevention)
  const sizeLimit = getSizeLimitForContentType(request)
  const sizeCheck = requireBodySizeLimit(request, sizeLimit)
  if (!sizeCheck.valid) {
    return sizeCheck.response!
  }

  // Rate limiting (bulk registration / spam protection)
  let clientIdentifier: string
  try {
    clientIdentifier = getClientIdentifierFromNextRequest(request)
  } catch (rateLimitError) {
    errorLog('[REGISTER] Rate limit identifier error:', rateLimitError)
    clientIdentifier = 'unknown'
  }

  const rateLimitResult = await registerLimiter(clientIdentifier)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      emirate,
      birthday,
      promoCode,
      locale = 'en',
      emailSuggestionConfirmed = false,
    } = await request.json()
    const emailCheck = await validateRegistrationEmail(email, emailSuggestionConfirmed === true)
    const normalizedEmail = emailCheck.email
    const promo = normalizePromo(promoCode)

    if (!name || !normalizedEmail || !password || !phone || !address || !emirate) {
      return NextResponse.json(
        { error: 'Name, email, password, phone, address and emirate are required' },
        { status: 400 }
      )
    }

    if (!emailCheck.valid) {
      return NextResponse.json(
        {
          error: emailCheck.error,
          code: emailCheck.code,
          suggestedEmail: emailCheck.suggestedEmail,
        },
        { status: 400 }
      )
    }

    // Aligned with the reset-password policy (min 8)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Server-side validation: Input length limits
    const nameValidation = validateLength(name, INPUT_LIMITS.USER_NAME, 'Name')
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      )
    }

    const emailValidation = validateLength(normalizedEmail, INPUT_LIMITS.USER_EMAIL, 'Email')
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    // Phone is now required - validate it
    const phoneValidation = validateLength(phone, INPUT_LIMITS.USER_PHONE, 'Phone')
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { error: phoneValidation.error },
        { status: 400 }
      )
    }

    // Address is now required - validate it
    const addressValidation = validateLength(address, INPUT_LIMITS.USER_ADDRESS, 'Address')
    if (!addressValidation.valid) {
      return NextResponse.json(
        { error: addressValidation.error },
        { status: 400 }
      )
    }

    // Emirate is now required - validate it
    const emirateValidation = validateLength(emirate, INPUT_LIMITS.USER_EMIRATE, 'Emirate')
    if (!emirateValidation.valid) {
      return NextResponse.json(
        { error: emirateValidation.error },
        { status: 400 }
      )
    }

    // Validate emirate is one of the valid UAE emirates
    const validEmirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']
    if (!validEmirates.includes(emirate)) {
      return NextResponse.json(
        { error: 'Please select a valid emirate' },
        { status: 400 }
      )
    }

    const birthdayValidation = validateBirthday(birthday)
    if (!birthdayValidation.valid) {
      return NextResponse.json(
        { error: birthdayValidation.error || 'Invalid birthday' },
        { status: 400 }
      )
    }
    const normalizedBirthday = birthdayValidation.value ?? null

    // Check if user already exists
    const existingUser = await findUserByEmail(normalizedEmail)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password with bcrypt before storing
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user object
    // Store address with emirate: "address, Emirate"
    const fullAddress = `${address}, ${emirate}`
    
    // Create user + apply promo atomically (so usedCount increments only if user creation succeeds)
    const now = new Date()
    let promoApplied: { code: string; discountPercent: number; discountType: string } | null = null

    let createdUser: Record<string, unknown> | null = null
    try {
      createdUser = await prisma.$transaction(async (tx) => {
        let discountType: string | null = null
        let discountPercentage: number | null = null

        if (promo) {
          const promoRow = await tx.promoCode.findUnique({ where: { code: promo } })
          if (promoRow?.isActive) {
            const okExpiry = !promoRow.expiresAt || promoRow.expiresAt > now
            const okUses = promoRow.maxUses == null || promoRow.usedCount < promoRow.maxUses
            if (okExpiry && okUses) {
              const maxUsesGuard =
                promoRow.maxUses == null
                  ? []
                  : [{ usedCount: { lt: promoRow.maxUses } }]
              const updated = await tx.promoCode.updateMany({
                where: {
                  id: promoRow.id,
                  isActive: true,
                  AND: [
                    { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
                    ...maxUsesGuard,
                  ],
                },
                data: { usedCount: { increment: 1 } },
              })
              if (updated.count === 1) {
                discountType = promoRow.discountType
                discountPercentage = promoRow.discountPercent
                promoApplied = { code: promoRow.code, discountPercent: promoRow.discountPercent, discountType: promoRow.discountType }
              }
            }
          }
        }

        // Detect registration source from User-Agent
        const userAgent = request.headers.get('user-agent') || ''
        const isMobileDevice = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
        const loginSource = isMobileDevice ? 'mobile_web' : 'desktop_web'
        
        const userData: Prisma.UserCreateInput = {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          phone,
          address: fullAddress,
          profilePicture: '',
          isAdmin: false,
          canSeePrices: true,
          discountType,
          discountPercentage,
          birthday: normalizedBirthday,
          lastLoginAt: now,
          lastLoginSource: loginSource,
        }
        return await tx.user.create({ data: userData })
      })
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error && 'code' in error
          ? String((error as { code?: unknown }).code || '')
          : ''
      if (code === 'P2002') {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
      }
      throw error
    }

    // Update lastActiveAt immediately for online status tracking
    if (createdUser?.id) {
      await trackUserActivityNow(createdUser.id as string)
    }

    // Return success response immediately (without password)
    // Don't make the user wait for emails/analytics - run them in background
    const { password: __, ...userWithoutPassword } = createdUser

    // Capture request headers before returning response (headers may not be available in after())
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                      request.headers.get('x-real-ip') ||
                      'Unknown'

    // Run background tasks AFTER the response is sent using Next.js after() API
    // This ensures the user gets an instant response while emails/analytics run in background
    after(async () => {
      // Track user registration
      try {
        await trackUserAction({
          action: 'user_registered',
          userEmail: normalizedEmail,
          details: `New user registered: ${name}`
        })
      } catch (err) {
        errorLog('❌ Failed to track user registration:', err)
      }

      // Send welcome email to user (skip Apple Private Relay emails)
      if (isApplePrivateRelayEmail(normalizedEmail)) {
        debugLog('⏭️ Skipping welcome email for Apple Private Relay user:', normalizedEmail)
      } else {
        try {
          await sendWelcomeEmail(name, normalizedEmail, password, locale)
          debugLog('✅ Welcome email sent to:', normalizedEmail)
        } catch (emailError) {
          errorLog('❌ Failed to send welcome email:', emailError)
        }
      }

      // Send admin notification
      try {
        // Parse device information
        const deviceInfo = parseUserAgent(userAgent)
        
        // Get geolocation data
        const geoData = await getGeolocationData(ipAddress)
        
        // Calculate age from birthday if available (skip invalid / future)
        let age: number | undefined
        if (normalizedBirthday) {
          const birthDate = new Date(`${normalizedBirthday}T00:00:00Z`)
          const today = new Date()
          age = today.getFullYear() - birthDate.getUTCFullYear()
          const monthDiff = today.getMonth() - birthDate.getUTCMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getUTCDate())) {
            age--
          }
          if (!Number.isFinite(age) || age < 0) age = undefined
        }
        
        // Build additionalInfo object, only including defined values
        const additionalInfo: Record<string, string | number> = {}
        if (ipAddress) additionalInfo.ipAddress = ipAddress
        if (geoData?.country) additionalInfo.country = geoData.country
        if (geoData?.city) additionalInfo.city = geoData.city
        additionalInfo.deviceType = deviceInfo.deviceType as string
        if (deviceInfo.deviceModel) additionalInfo.deviceModel = deviceInfo.deviceModel
        if (deviceInfo.os) additionalInfo.os = deviceInfo.os
        if (deviceInfo.browser) additionalInfo.browser = deviceInfo.browser
        if (typeof age === 'number' && age >= 0) additionalInfo.age = age
        
        const adminResult = await sendAdminNewUserNotification(
          name, 
          normalizedEmail, 
          phone, 
          fullAddress, 
          'Email/Password',
          additionalInfo
        )
        
        if (adminResult && adminResult.success) {
          debugLog('✅ Admin notification sent for new user:', normalizedEmail)
        } else {
          errorLog('❌ Failed to send admin notification:', adminResult?.error || 'Unknown error')
          errorLog('❌ Admin notification error details:', JSON.stringify(adminResult, null, 2))
        }
      } catch (emailError) {
        errorLog('❌ Exception sending admin notification:', emailError)
        errorLog('❌ Exception details:', emailError instanceof Error ? emailError.message : String(emailError))
      }
    })

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      promoApplied
    })
  } catch (error) {
    errorLog('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}