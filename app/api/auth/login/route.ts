import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await loginLimiter(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Simple authentication (no database)
    if (email === 'admin@genosys.ae' && password === 'admin5') {
      // Admin login
      return NextResponse.json({
        user: {
          id: 'admin',
          email: 'admin@genosys.ae',
          name: 'Admin',
          isAdmin: true
        },
        message: 'Login successful'
      })
    } else if (email === 'f.this.that@gmail.com' && password === 'Gestapo9') {
      // Regular user login
      return NextResponse.json({
        user: {
          id: 'user1',
          email: 'f.this.that@gmail.com',
          name: 'User',
          isAdmin: false
        },
        message: 'Login successful'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}