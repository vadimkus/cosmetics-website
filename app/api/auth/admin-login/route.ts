import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'

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
    
    if (user && user.isAdmin && user.password === password) {
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