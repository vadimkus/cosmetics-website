import { NextRequest, NextResponse } from 'next/server'
import { addUser, findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { trackUserAction } from '@/lib/analyticsServer'
import { sendWelcomeEmail, sendAdminNewUserNotification } from '@/lib/email'
import bcrypt from 'bcryptjs'
import { requireCsrfToken } from '@/lib/csrf'
import { validateLength, INPUT_LIMITS } from '@/lib/validation'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'

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
    const { name, email, password, phone, address, emirate, birthday } = await request.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()

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
    
    const newUser = {
      name,
      email: normalizedEmail,
      password: hashedPassword, // Store hashed password
      phone: phone, // Phone is now required
      address: fullAddress, // Address and emirate are now required
      profilePicture: '',
      isAdmin: false,
      canSeePrices: true,
      discountType: null,
      discountPercentage: null,
      birthday: birthday || null // Birthday is optional
    }

    // Store user in database
    let createdUser: Awaited<ReturnType<typeof addUser>>
    try {
      createdUser = await addUser(newUser)
    } catch (e: unknown) {
      // Race-safe: if another request created the user after our existence check, return a friendly error.
      const code =
        typeof e === 'object' && e && 'code' in e
          ? String((e as { code?: unknown }).code || '')
          : ''
      if (code === 'P2002') {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
      }
      throw e
    }

    // Set lastLoginAt on registration (treat registration as first login)
    // This ensures new users appear in the "Recent Logins" section
    try {
      await updateUser(createdUser.id, { lastLoginAt: new Date().toISOString() })
      // Refresh createdUser with updated lastLoginAt
      const refreshedUser = await findUserByEmail(normalizedEmail)
      if (refreshedUser) {
        Object.assign(createdUser, refreshedUser)
      }
    } catch (error) {
      errorLog('Error updating lastLoginAt on registration:', error)
      // Don't fail registration if timestamp update fails
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
      user: userWithoutPassword
    })
  } catch (error) {
    errorLog('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}