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
 * GET /api/push/notifications
 * 
 * Get all notifications for the current user with read status.
 * Returns unread count for badge display.
 */
export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const user = await getUserFromSession(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get locale from query params
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'

    // Get all notifications with read status for this user
    const notifications = await prisma.pWANotification.findMany({
      orderBy: { sentAt: 'desc' },
      take: 50,
      include: {
        reads: {
          where: { userId: user.id }
        }
      }
    })

    // Format notifications with localized content and read status
    const formattedNotifications = notifications.map(n => {
      // Get localized title and body
      let title = n.title
      let body = n.body
      
      if (locale === 'ru' && n.titleRu) title = n.titleRu
      if (locale === 'ar' && n.titleAr) title = n.titleAr
      if (locale === 'ru' && n.bodyRu) body = n.bodyRu
      if (locale === 'ar' && n.bodyAr) body = n.bodyAr

      return {
        id: n.id,
        title,
        body,
        url: n.url,
        sentAt: n.sentAt,
        isRead: n.reads.length > 0,
        readAt: n.reads[0]?.readAt || null
      }
    })

    // Count unread notifications
    const unreadCount = formattedNotifications.filter(n => !n.isRead).length

    debugLog('[PUSH_NOTIFICATIONS] Fetched for user:', {
      userId: user.id,
      total: notifications.length,
      unread: unreadCount
    })

    return NextResponse.json({
      success: true,
      notifications: formattedNotifications,
      unreadCount
    })

  } catch (error) {
    errorLog('[PUSH_NOTIFICATIONS] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

