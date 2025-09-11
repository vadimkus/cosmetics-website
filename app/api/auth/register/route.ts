import { NextRequest, NextResponse } from 'next/server'
import { addUser, findUserByEmail } from '@/lib/userStorageHybrid'

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