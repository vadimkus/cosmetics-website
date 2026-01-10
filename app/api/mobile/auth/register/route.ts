import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { findUserByEmail } from '@/lib/userStorageDb'
import { prisma } from '@/lib/database'
import { generateMobileToken, validateMobileAuth } from '@/lib/jwt'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { debugLog, errorLog } from '@/lib/logger'
import { trackUserAction } from '@/lib/analyticsServer'
import { sendWelcomeEmail, sendAdminNewUserNotification } from '@/lib/email'
import { validateLength, INPUT_LIMITS } from '@/lib/validation'
import bcrypt from 'bcryptjs'
import { parseUserAgent } from '@/lib/deviceDetection'
import { getGeolocationData } from '@/lib/geolocation'

// Rate limiting for mobile registration
const mobileRegisterLimiter = rateLimitSimple({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registration attempts per hour
})

/**
 * Mobile Registration Endpoint
 * POST /api/mobile/auth/register
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Content-Type: application/json
 * 
 * Body:
 * - name: User full name
 * - email: User email
 * - password: User password (min 6 characters)
 * - phone: User phone number
 * - address: User address
 * - emirate: UAE emirate
 * - birthday: (optional) User birthday
 * 
 * Returns:
 * - success: boolean
 * - user: User data (without password)
 * - token: JWT authentication token
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_AUTH] Registration request started')

  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    const authValidation = validateMobileAuth(apiKey, null)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error 
        },
        { status: authValidation.status || 500 }
      )
    }

    // Apply rate limiting
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (error) {
      errorLog('[MOBILE_AUTH] Rate limit identifier error:', error)
      clientIdentifier = 'unknown'
    }

    const rateLimitResult = await mobileRegisterLimiter(clientIdentifier)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many registration attempts. Please try again later.' 
        },
        { status: 429 }
      )
    }

    // Parse request body
    const { name, email, password, phone, address, emirate, birthday, gender, promoCode, locale = 'en' } = await request.json()
    const promo = String(promoCode || '').trim().toUpperCase()

    // Validate required fields
    if (!name || !email || !password || !phone || !address || !emirate) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name, email, password, phone, address and emirate are required' 
        },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password must be at least 6 characters' 
        },
        { status: 400 }
      )
    }

    // Server-side validation: Input length limits
    const nameValidation = validateLength(name, INPUT_LIMITS.USER_NAME, 'Name')
    if (!nameValidation.valid) {
      return NextResponse.json(
        { success: false, error: nameValidation.error },
        { status: 400 }
      )
    }

    const emailValidation = validateLength(email, INPUT_LIMITS.USER_EMAIL, 'Email')
    if (!emailValidation.valid) {
      return NextResponse.json(
        { success: false, error: emailValidation.error },
        { status: 400 }
      )
    }

    const phoneValidation = validateLength(phone, INPUT_LIMITS.USER_PHONE, 'Phone')
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error },
        { status: 400 }
      )
    }

    const addressValidation = validateLength(address, INPUT_LIMITS.USER_ADDRESS, 'Address')
    if (!addressValidation.valid) {
      return NextResponse.json(
        { success: false, error: addressValidation.error },
        { status: 400 }
      )
    }

    const emirateValidation = validateLength(emirate, INPUT_LIMITS.USER_EMIRATE, 'Emirate')
    if (!emirateValidation.valid) {
      return NextResponse.json(
        { success: false, error: emirateValidation.error },
        { status: 400 }
      )
    }

    // Validate emirate is one of the valid UAE emirates
    const validEmirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']
    if (!validEmirates.includes(emirate)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please select a valid emirate' 
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User with this email already exists' 
        },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const fullAddress = `${address}, ${emirate}`
    
    const now = new Date()
    let promoApplied: { code: string; discountPercent: number; discountType: string } | null = null

    const createdUser = await prisma.$transaction(async (tx) => {
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

      const userData: Prisma.UserCreateInput = {
        name,
        email,
        password: hashedPassword,
        phone,
        address: fullAddress,
        profilePicture: null,
        isAdmin: false,
        canSeePrices: true,
        discountType,
        discountPercentage,
        birthday: birthday || null,
        lastLoginAt: now,
      }
      return await tx.user.create({ data: userData })
    })

    // Track user registration
    try {
      await trackUserAction({
        action: 'mobile_user_registered',
        userEmail: email,
        details: `New mobile user registered: ${name}`
      })
    } catch (error) {
      errorLog('Error tracking user registration:', error)
      // Don't fail registration if tracking fails
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(name, email, password, locale)
      debugLog('✅ Welcome email sent to:', email)
    } catch (error) {
      errorLog('❌ Failed to send welcome email:', error)
      // Don't fail registration if email fails
    }

    // Send admin notification
    try {
      // Extract device and location information
      const userAgent = request.headers.get('user-agent') || 'Unknown'
      const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                        request.headers.get('x-real-ip') ||
                        'Unknown'
      
      // Parse device information
      const deviceInfo = parseUserAgent(userAgent)
      
      // Get geolocation data
      const geoData = await getGeolocationData(ipAddress)
      
      // Calculate age from birthday if available
      let age: number | undefined
      if (birthday) {
        const birthDate = new Date(birthday)
        const today = new Date()
        age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
      }
      
      // Build additionalInfo object, only including defined values
      const additionalInfo: any = {}
      if (ipAddress) additionalInfo.ipAddress = ipAddress
      if (geoData?.country) additionalInfo.country = geoData.country
      if (geoData?.city) additionalInfo.city = geoData.city
      additionalInfo.deviceType = deviceInfo.deviceType as string
      if (deviceInfo.deviceModel) additionalInfo.deviceModel = deviceInfo.deviceModel
      if (deviceInfo.os) additionalInfo.os = deviceInfo.os
      if (deviceInfo.browser) additionalInfo.browser = deviceInfo.browser
      if (age) additionalInfo.age = age
      if (gender) additionalInfo.gender = String(gender)
      
      const adminResult = await sendAdminNewUserNotification(
        name, 
        email, 
        phone, 
        fullAddress, 
        'Mobile App',
        additionalInfo
      )
      
      if (adminResult?.success) {
        debugLog('✅ Admin notification sent for new mobile user:', email)
      } else {
        errorLog('❌ Failed to send admin notification:', adminResult?.error || 'Unknown error')
      }
    } catch (error) {
      errorLog('❌ Exception sending admin notification:', error)
      // Don't fail registration if email fails
    }

    // Generate JWT token
    const token = generateMobileToken({
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      isAdmin: createdUser.isAdmin || false,
      canSeePrices: createdUser.canSeePrices !== false
    })

    // Return success response (without password)
    const { password: __, ...userWithoutPassword } = createdUser

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_AUTH] Registration successful for ${email} in ${duration}ms`)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Registration successful',
      promoApplied,
    })

  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_AUTH] Registration error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
