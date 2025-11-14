import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import { errorLog } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists in database and is admin
    const user = await findUserByEmail(email)
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Invalid admin session' },
        { status: 401 }
      )
    }

    // Return admin user data (without password)
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
    errorLog('Admin session verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}









