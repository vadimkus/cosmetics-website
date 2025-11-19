import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { debugLog, errorLog } from '@/lib/logger'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  // Require admin authentication and CSRF protection
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    debugLog('🔍 Test admin API called')
    
    const { email, password } = await request.json()
    debugLog('📧 Email:', email)
    debugLog('🔑 Password provided:', !!password)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user exists in database and is admin
    debugLog('🔍 Looking up user...')
    const user = await findUserByEmail(email)
    debugLog('👤 User found:', !!user)
    
    if (!user || !user.isAdmin) {
      debugLog('❌ User not found or not admin')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    debugLog('✅ User is admin, checking password...')
    debugLog('🔐 Password hash starts with $2:', user.password?.startsWith('$2') || false)

    // Check password - handle both bcrypt and legacy plaintext passwords
    let isValid = false
    let needsPasswordUpgrade = false
    
    if (user.password && user.password.startsWith('$2')) {
      // bcrypt hash - normal verification
      debugLog('🔍 Verifying password with bcrypt...')
      isValid = await bcrypt.compare(password, user.password)
      debugLog('✅ Password verification result:', isValid)
    } else {
      // Legacy plaintext password - check if it matches, then upgrade to bcrypt
      debugLog('⚠️ Legacy plaintext password detected')
      if (user.password === password) {
        isValid = true
        needsPasswordUpgrade = true
        debugLog('✅ Plaintext password matches, will upgrade to bcrypt')
      } else {
        isValid = false
        debugLog('❌ Plaintext password does not match')
      }
    }

    if (!isValid) {
      debugLog('❌ Password verification failed')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Upgrade plaintext password to bcrypt if needed
    if (needsPasswordUpgrade) {
      try {
        debugLog('🔄 Upgrading plaintext password to bcrypt...')
        const hashedPassword = await bcrypt.hash(password, 12)
        await updateUser(user.id, { password: hashedPassword })
        debugLog('✅ Password successfully upgraded to bcrypt')
      } catch (upgradeError) {
        errorLog('❌ Error upgrading password:', upgradeError)
        // Don't fail login if upgrade fails
      }
    }

    debugLog('✅ Admin login successful')
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
    errorLog('❌ Test admin API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

