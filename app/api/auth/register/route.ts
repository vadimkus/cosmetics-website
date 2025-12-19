import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'
import { trackUserAction } from '@/lib/analyticsServer'
import { sendWelcomeEmail, sendAdminNewUserNotification } from '@/lib/email'
import bcrypt from 'bcryptjs'
import { requireCsrfToken } from '@/lib/csrf'
import { validateLength, INPUT_LIMITS } from '@/lib/validation'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'

const normalizePromo = (promo: unknown) => String(promo || '').trim().toUpperCase()

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

  try {
    const { name, email, password, phone, address, emirate, birthday, promoCode } = await request.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const promo = normalizePromo(promoCode)

    if (!name || !normalizedEmail || !password || !phone || !address || !emirate) {
      return NextResponse.json(
        { error: 'Name, email, password, phone, address and emirate are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
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

    let createdUser: any = null
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

        return await tx.user.create({
          data: {
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
            birthday: birthday || null,
            lastLoginAt: now,
          } as any,
        })
      })
    } catch (e: unknown) {
      const code =
        typeof e === 'object' && e && 'code' in e
          ? String((e as { code?: unknown }).code || '')
          : ''
      if (code === 'P2002') {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
      }
      throw error
    }

    // Track user registration
    await trackUserAction({
      action: 'user_registered',
      userEmail: normalizedEmail,
      details: `New user registered: ${name}`
    })

    // Send welcome email to user (include password before hashing)
    try {
      await sendWelcomeEmail(name, normalizedEmail, password)
      debugLog('✅ Welcome email sent to:', normalizedEmail)
    } catch (emailError) {
      errorLog('❌ Failed to send welcome email:', emailError)
      // Don't fail registration if email fails
    }

    // Send admin notification
    try {
      const adminResult = await sendAdminNewUserNotification(name, normalizedEmail, phone, fullAddress, 'Email/Password')
      
      if (adminResult && adminResult.success) {
        debugLog('✅ Admin notification sent for new user:', normalizedEmail)
      } else {
        errorLog('❌ Failed to send admin notification:', adminResult?.error || 'Unknown error')
        errorLog('❌ Admin notification error details:', JSON.stringify(adminResult, null, 2))
      }
    } catch (emailError) {
      errorLog('❌ Exception sending admin notification:', emailError)
      errorLog('❌ Exception details:', emailError instanceof Error ? emailError.message : String(emailError))
      // Don't fail registration if email fails
    }

    // Return success response (without password)
    const { password: __, ...userWithoutPassword } = createdUser
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