import { NextRequest, NextResponse } from 'next/server'
import { addUser, findUserByEmail, updateUser } from '@/lib/userStorageDb'
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
    const { name, email, password, phone } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
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

    const emailValidation = validateLength(email, INPUT_LIMITS.USER_EMAIL, 'Email')
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    if (phone) {
      const phoneValidation = validateLength(phone, INPUT_LIMITS.USER_PHONE, 'Phone')
      if (!phoneValidation.valid) {
        return NextResponse.json(
          { error: phoneValidation.error },
          { status: 400 }
        )
      }
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password with bcrypt before storing
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user object
    const newUser = {
      name,
      email,
      password: hashedPassword, // Store hashed password
      phone: phone || '',
      address: '',
      profilePicture: '',
      isAdmin: false,
      canSeePrices: true,
      discountType: null,
      discountPercentage: null,
      birthday: ''
    }

    // Store user in database
    const createdUser = await addUser(newUser)

    // Set lastLoginAt on registration (treat registration as first login)
    // This ensures new users appear in the "Recent Logins" section
    try {
      await updateUser(createdUser.id, { lastLoginAt: new Date().toISOString() })
      // Refresh createdUser with updated lastLoginAt
      const refreshedUser = await findUserByEmail(email)
      if (refreshedUser) {
        Object.assign(createdUser, refreshedUser)
      }
    } catch (error) {
      console.error('Error updating lastLoginAt on registration:', error)
      // Don't fail registration if timestamp update fails
    }

    // Track user registration
    await trackUserAction({
      action: 'user_registered',
      userEmail: email,
      details: `New user registered: ${name}`
    })

    // Send welcome email to user
    try {
      await sendWelcomeEmail(name, email)
      console.log('✅ Welcome email sent to:', email)
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError)
      // Don't fail registration if email fails
    }

    // Send admin notification
    try {
      await sendAdminNewUserNotification(name, email)
      console.log('✅ Admin notification sent for new user:', email)
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError)
      // Don't fail registration if email fails
    }

    // Return success response (without password)
    const { password: _, ...userWithoutPassword } = createdUser
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}