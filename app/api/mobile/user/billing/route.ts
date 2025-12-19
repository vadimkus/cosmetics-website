import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Mobile Billing Endpoint
 *
 * GET  /api/mobile/user/billing  -> returns billingAddress + vatNumber
 * PUT  /api/mobile/user/billing  -> updates billingAddress + vatNumber
 *
 * Headers:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt>
 */

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('Authorization'))
    const auth = validateMobileAuth(apiKey, token)
    if (!auth.valid) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status || 500 })
    }
    if (!auth.payload) {
      return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })
    }

    const user = await findUserByEmail(auth.payload.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // NOTE: requires DB columns: users.billingAddress (TEXT), users.vatNumber (TEXT)
    const billingAddress = (user as any).billingAddress ?? null
    const vatNumber = (user as any).vatNumber ?? null

    return NextResponse.json({ success: true, data: { billingAddress, vatNumber } })
  } catch (error) {
    errorLog('[MOBILE_BILLING] GET error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_BILLING] PUT request started')
  try {
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('Authorization'))
    const auth = validateMobileAuth(apiKey, token)
    if (!auth.valid) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status || 500 })
    }
    if (!auth.payload) {
      return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })
    }

    const user = await findUserByEmail(auth.payload.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const billingAddressRaw = body?.billingAddress
    const vatNumberRaw = body?.vatNumber

    const updates: any = {}
    if (billingAddressRaw !== undefined) {
      if (billingAddressRaw === null || billingAddressRaw === '') updates.billingAddress = null
      else if (typeof billingAddressRaw !== 'string') {
        return NextResponse.json({ success: false, error: 'billingAddress must be a string' }, { status: 400 })
      } else updates.billingAddress = billingAddressRaw.trim()
    }
    if (vatNumberRaw !== undefined) {
      if (vatNumberRaw === null || vatNumberRaw === '') updates.vatNumber = null
      else if (typeof vatNumberRaw !== 'string') {
        return NextResponse.json({ success: false, error: 'vatNumber must be a string' }, { status: 400 })
      } else updates.vatNumber = vatNumberRaw.trim()
    }

    const ok = await updateUser(user.id, updates)
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Failed to update billing information' }, { status: 500 })
    }

    debugLog('[MOBILE_BILLING] PUT completed', Date.now() - startTime, 'ms')
    return NextResponse.json({ success: true, data: updates })
  } catch (error) {
    errorLog('[MOBILE_BILLING] PUT error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}





