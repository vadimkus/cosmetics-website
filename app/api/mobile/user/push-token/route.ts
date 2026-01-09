import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Mobile Push Token Endpoint
 *
 * GET    /api/mobile/user/push-token  -> current token (if any)
 * PUT    /api/mobile/user/push-token  -> set/update token
 * DELETE /api/mobile/user/push-token  -> clear token
 *
 * Headers:
 * - x-api-key
 * - Authorization: Bearer <jwt>
 */

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('Authorization'))
    const auth = validateMobileAuth(apiKey, token)
    if (!auth.valid) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status || 500 })
    if (!auth.payload) return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })

    const user = await findUserByEmail(auth.payload.email)
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    return NextResponse.json({
      success: true,
      data: { expoPushToken: user.expoPushToken ?? null },
    })
  } catch (error) {
    errorLog('[MOBILE_PUSH_TOKEN] GET error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  try {
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('Authorization'))
    const auth = validateMobileAuth(apiKey, token)
    if (!auth.valid) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status || 500 })
    if (!auth.payload) return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })

    const user = await findUserByEmail(auth.payload.email)
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    const body = await request.json().catch(() => ({}))
    const expoPushTokenRaw = body?.expoPushToken
    if (typeof expoPushTokenRaw !== 'string' || !expoPushTokenRaw.trim()) {
      return NextResponse.json({ success: false, error: 'expoPushToken is required' }, { status: 400 })
    }
    const expoPushToken = expoPushTokenRaw.trim()

    const ok = await updateUser(user.id, { expoPushToken })
    if (!ok) return NextResponse.json({ success: false, error: 'Failed to save push token' }, { status: 500 })

    debugLog('[MOBILE_PUSH_TOKEN] PUT ok', { ms: Date.now() - startTime })
    return NextResponse.json({ success: true, data: { expoPushToken } })
  } catch (error) {
    errorLog('[MOBILE_PUSH_TOKEN] PUT error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('Authorization'))
    const auth = validateMobileAuth(apiKey, token)
    if (!auth.valid) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status || 500 })
    if (!auth.payload) return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })

    const user = await findUserByEmail(auth.payload.email)
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    const ok = await updateUser(user.id, { expoPushToken: null })
    if (!ok) return NextResponse.json({ success: false, error: 'Failed to clear push token' }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
    errorLog('[MOBILE_PUSH_TOKEN] DELETE error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}






