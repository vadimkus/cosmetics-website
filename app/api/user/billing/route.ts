import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import { verifySessionToken } from '@/lib/jwt'

/**
 * Web User Billing Endpoint (Session-based auth)
 * 
 * GET /api/user/billing - Get billing information
 * PUT /api/user/billing - Update billing information
 * 
 * Uses session cookie for authentication
 */

async function getUserFromSession(): Promise<{ email: string; userId: string } | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('genosys_session')
    
    if (!sessionCookie?.value) {
      return null
    }
    
    // Use verifySessionToken which handles both JWT and legacy JSON formats
    const sessionData = verifySessionToken(sessionCookie.value)
    
    if (!sessionData?.email) {
      return null
    }
    
    return {
      email: sessionData.email,
      userId: sessionData.id
    }
  } catch (error) {
    errorLog('[USER_BILLING] Session parse error:', error)
    return null
  }
}

export async function GET(_request: NextRequest) {
  const startTime = Date.now()
  debugLog('[USER_BILLING] Get billing request started')

  try {
    const session = await getUserFromSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await findUserByEmail(session.email)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get billing fields
    const billingAddress = user.billingAddress ?? null
    const vatNumber = user.vatNumber ?? null
    
    debugLog('[USER_BILLING] Get billing completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      billingAddress,
      vatNumber
    })

  } catch (error) {
    errorLog('[USER_BILLING] Get billing error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[USER_BILLING] Update billing request started')

  try {
    const session = await getUserFromSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await findUserByEmail(session.email)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json().catch(() => ({}))
    const billingAddressRaw = body?.billingAddress
    const vatNumberRaw = body?.vatNumber

    const updates: Record<string, unknown> = {}
    
    // Validate and sanitize billingAddress
    if (billingAddressRaw !== undefined) {
      if (billingAddressRaw === null || billingAddressRaw === '') {
        updates.billingAddress = null
      } else if (typeof billingAddressRaw !== 'string') {
        return NextResponse.json(
          { success: false, error: 'billingAddress must be a string' },
          { status: 400 }
        )
      } else {
        updates.billingAddress = billingAddressRaw.trim()
      }
    }

    // Validate and sanitize vatNumber
    if (vatNumberRaw !== undefined) {
      if (vatNumberRaw === null || vatNumberRaw === '') {
        updates.vatNumber = null
      } else if (typeof vatNumberRaw !== 'string') {
        return NextResponse.json(
          { success: false, error: 'vatNumber must be a string' },
          { status: 400 }
        )
      } else {
        updates.vatNumber = vatNumberRaw.trim()
      }
    }

    // Check if there are any updates to apply
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update user billing info
    const updateSuccess = await updateUser(user.id, updates)
    
    if (!updateSuccess) {
      return NextResponse.json(
        { success: false, error: 'Failed to update billing information' },
        { status: 500 }
      )
    }

    debugLog('[USER_BILLING] Update billing completed', Date.now() - startTime, 'ms')
    
    return NextResponse.json({
      success: true,
      message: 'Billing information updated successfully',
      data: updates
    })

  } catch (error) {
    errorLog('[USER_BILLING] Update billing error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

