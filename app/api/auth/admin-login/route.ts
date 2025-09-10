import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Simple admin authentication (no database)
    if (email === 'admin@genosys.ae' && password === 'admin5') {
      return NextResponse.json({
        success: true,
        user: {
          id: 'admin',
          email: 'admin@genosys.ae',
          name: 'Admin',
          isAdmin: true
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
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