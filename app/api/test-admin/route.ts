import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Test admin API called')
    
    const { email, password } = await request.json()
    console.log('📧 Email:', email)
    console.log('🔑 Password provided:', !!password)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user exists in database and is admin
    console.log('🔍 Looking up user...')
    const user = await findUserByEmail(email)
    console.log('👤 User found:', !!user)
    
    if (!user || !user.isAdmin) {
      console.log('❌ User not found or not admin')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('✅ User is admin, checking password...')
    console.log('🔐 Password hash starts with $2:', user.password.startsWith('$2'))

    // Only allow bcrypt hashed passwords - no plaintext support
    if (!user.password || !user.password.startsWith('$2')) {
      console.log('❌ Password not properly hashed')
      return NextResponse.json(
        { error: 'Account requires password reset. Please contact support.' },
        { status: 401 }
      )
    }

    // Verify password with bcrypt
    console.log('🔍 Verifying password with bcrypt...')
    const isValid = await bcrypt.compare(password, user.password)
    console.log('✅ Password verification result:', isValid)

    if (!isValid) {
      console.log('❌ Password verification failed')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('✅ Admin login successful')
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
    console.error('❌ Test admin API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

