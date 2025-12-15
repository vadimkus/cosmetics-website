import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Mobile User Settings Endpoint
 *
 * GET /api/mobile/user/settings  - Get user app settings (currently: language/locale)
 * PUT /api/mobile/user/settings  - Update user app settings
 *
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt_token>
 */

const normalizeLocale = (value: unknown): 'en' | 'ru' | 'ar' => {
  const v = String(value || 'en').toLowerCase().trim()
  if (v.startsWith('ar')) return 'ar'
  if (v.startsWith('ru')) return 'ru'
  return 'en'
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_SETTINGS] Get settings request started')

  try {
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('Authorization'))

    const authValidation = validateMobileAuth(apiKey, token)
    if (!authValidation.valid) {
      return NextResponse.json({ success: false, error: authValidation.error }, { status: authValidation.status || 500 })
    }
    if (!authValidation.payload) {
      return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })
    }

    const user = await findUserByEmail(authValidation.payload.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const language = normalizeLocale((user as any).locale)
    debugLog('[MOBILE_SETTINGS] Get settings completed', Date.now() - startTime, 'ms')

    return NextResponse.json(
      { success: true, data: { language } },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (error) {
    errorLog('[MOBILE_SETTINGS] Get settings error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_SETTINGS] Update settings request started')

  try {
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('Authorization'))

    const authValidation = validateMobileAuth(apiKey, token)
    if (!authValidation.valid) {
      return NextResponse.json({ success: false, error: authValidation.error }, { status: authValidation.status || 500 })
    }
    if (!authValidation.payload) {
      return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })
    }

    const user = await findUserByEmail(authValidation.payload.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({} as any))
    const language = normalizeLocale(body?.language ?? body?.locale)

    const ok = await updateUser(user.id, { locale: language })
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 })
    }

    debugLog('[MOBILE_SETTINGS] Update settings completed', Date.now() - startTime, 'ms')

    return NextResponse.json(
      { success: true, data: { language } },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (error) {
    errorLog('[MOBILE_SETTINGS] Update settings error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}


