import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user exists in database and is admin
    const user = await findUserByEmail(email)
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Only allow bcrypt hashed passwords - no plaintext support
    if (!user.password || !user.password.startsWith('$2')) {
      return NextResponse.json(
        { error: 'Account requires password reset. Please contact support.' },
        { status: 401 }
      )
    }

    // Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login timestamp
    try {
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
    } catch (error) {
      console.error('Error updating admin last login timestamp:', error)
      // Don't fail login if timestamp update fails
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: true
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

