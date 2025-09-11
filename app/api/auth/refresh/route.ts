import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Refresh endpoint called')
    const { email } = await request.json()
    
    if (!email) {
      console.log('❌ No email provided')
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    console.log('🔍 Looking for user:', email)
    const user = await findUserByEmail(email)
    
    if (!user) {
      console.log('❌ User not found:', email)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    
    console.log('✅ User found, returning data for:', email)
    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    })
  } catch (error) {
    console.error('❌ User refresh error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
