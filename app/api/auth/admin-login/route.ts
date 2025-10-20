import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
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
    
    let isValid = false
    if (user) {
      try {
        if (user.password && user.password.startsWith('$2')) {
          isValid = await bcrypt.compare(password, user.password)
        } else {
          isValid = user.password === password
        }
      } catch (e) {
        isValid = false
      }
    }

    if (user && user.isAdmin && isValid) {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: true
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Haha, better luck next time, cowboy!' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}