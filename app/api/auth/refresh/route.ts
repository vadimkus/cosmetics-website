import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorage'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = findUserByEmail(email)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    })
  } catch (error) {
    console.error('User refresh error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
