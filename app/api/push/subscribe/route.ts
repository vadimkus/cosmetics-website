import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'
import { findUserByEmail, findUserById } from '@/lib/userStorageDb'
import { verifySessionToken } from '@/lib/jwt'

// Helper to get user from session cookie
async function getUserFromSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('genosys_session')
  
  if (!sessionCookie) {
    return null
  }

  try {
    // Use verifySessionToken which handles both JWT and legacy JSON formats
    const sessionData = verifySessionToken(sessionCookie.value)
    
    if (!sessionData || (!sessionData.email && !sessionData.id)) {
      return null
    }

    const user = sessionData.id
      ? await findUserById(sessionData.id)
      : await findUserByEmail(sessionData.email)
    
    return user
  } catch (error) {
    errorLog('Error parsing session cookie:', error)
    return null
  }
}

/**
 * POST /api/push/subscribe
 * 
 * Stores a Web Push subscription for a PWA user.
 * Called when user grants notification permission in PWA.
 */
export async function POST(request: NextRequest) {
  try {
    // Get user from session
    const user = await getUserFromSession(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { subscription } = body

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription data' },
        { status: 400 }
      )
    }

    const { endpoint, keys } = subscription
    const { p256dh, auth } = keys

    if (!p256dh || !auth) {
      return NextResponse.json(
        { success: false, error: 'Missing encryption keys' },
        { status: 400 }
      )
    }

    // Get user agent for device tracking
    const userAgent = request.headers.get('user-agent') || null

    // Upsert subscription (update if endpoint exists, create if not)
    const pushSubscription = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        userId: user.id,
        p256dh,
        auth,
        userAgent,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        endpoint,
        p256dh,
        auth,
        userAgent
      }
    })

    debugLog('[PUSH_SUBSCRIBE] Subscription saved:', {
      userId: user.id,
      subscriptionId: pushSubscription.id,
      endpoint: endpoint.substring(0, 50) + '...'
    })

    return NextResponse.json({
      success: true,
      message: 'Push subscription saved',
      subscriptionId: pushSubscription.id
    })

  } catch (error) {
    errorLog('[PUSH_SUBSCRIBE] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save subscription' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/push/subscribe
 * 
 * Removes a push subscription (when user disables notifications).
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint } = body

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: 'Endpoint required' },
        { status: 400 }
      )
    }

    // Delete subscription by endpoint
    await prisma.pushSubscription.deleteMany({
      where: { endpoint }
    })

    debugLog('[PUSH_SUBSCRIBE] Subscription deleted:', {
      endpoint: endpoint.substring(0, 50) + '...'
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription removed'
    })

  } catch (error) {
    errorLog('[PUSH_SUBSCRIBE] Delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove subscription' },
      { status: 500 }
    )
  }
}

