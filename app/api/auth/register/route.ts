import { NextRequest, NextResponse } from 'next/server'
import { addUser, findUserByEmail } from '@/lib/userStorageDb'
import { trackUserAction } from '@/lib/analytics'
import { sendWelcomeEmail, sendAdminNewUserNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
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

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create new user object
    const newUser = {
      name,
      email,
      password, // Store password for login purposes
      phone: phone || '',
      address: '',
      profilePicture: '',
      isAdmin: false,
      canSeePrices: false,
      discountType: null,
      discountPercentage: null,
      birthday: ''
    }

    // Store user in database
    const createdUser = await addUser(newUser)

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