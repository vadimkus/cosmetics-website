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
 * POST /api/push/mark-read
 * 
 * Mark a notification as read for the current user.
 * Can mark single notification or all notifications.
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
    const { notificationId, markAll } = body

    if (markAll) {
      // Mark all unread notifications as read
      const unreadNotifications = await prisma.pWANotification.findMany({
        where: {
          reads: {
            none: { userId: user.id }
          }
        },
        select: { id: true }
      })

      // Create read records for all unread notifications
      await prisma.notificationRead.createMany({
        data: unreadNotifications.map(n => ({
          notificationId: n.id,
          userId: user.id
        })),
        skipDuplicates: true
      })

      debugLog('[PUSH_MARK_READ] Marked all as read:', {
        userId: user.id,
        count: unreadNotifications.length
      })

      return NextResponse.json({
        success: true,
        message: `Marked ${unreadNotifications.length} notifications as read`
      })
    }

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'notificationId or markAll required' },
        { status: 400 }
      )
    }

    // Check if notification exists
    const notification = await prisma.pWANotification.findUnique({
      where: { id: notificationId }
    })

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Upsert read record (in case of duplicate requests)
    await prisma.notificationRead.upsert({
      where: {
        notificationId_userId: {
          notificationId,
          userId: user.id
        }
      },
      update: {
        readAt: new Date()
      },
      create: {
        notificationId,
        userId: user.id
      }
    })

    debugLog('[PUSH_MARK_READ] Notification marked as read:', {
      userId: user.id,
      notificationId
    })

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    })

  } catch (error) {
    errorLog('[PUSH_MARK_READ] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/push/mark-read
 * 
 * Get unread count for the current user (for badge display).
 */
export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const user = await getUserFromSession(request)
    if (!user) {
      return NextResponse.json({ unreadCount: 0 })
    }

    // Count unread notifications
    const unreadCount = await prisma.pWANotification.count({
      where: {
        reads: {
          none: { userId: user.id }
        }
      }
    })

    return NextResponse.json({
      success: true,
      unreadCount
    })

  } catch (error) {
    errorLog('[PUSH_MARK_READ] GET error:', error)
    return NextResponse.json({ unreadCount: 0 })
  }
}

