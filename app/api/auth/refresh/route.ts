import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    debugLog('🔄 Refresh endpoint called')
    const { email } = await request.json()
    
    if (!email) {
      debugLog('❌ No email provided')
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    debugLog('🔍 Looking for user:', email)
    const user = await findUserByEmail(email)
    
    if (!user) {
      debugLog('❌ User not found:', email)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    
    debugLog('✅ User found, returning data for:', email)
    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    })
  } catch (error) {
    errorLog('❌ User refresh error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
