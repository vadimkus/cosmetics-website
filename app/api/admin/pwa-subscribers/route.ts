import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'

/**
 * GET /api/admin/pwa-subscribers
 * 
 * Get list of all PWA push subscribers (admin only)
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    // Get all push subscriptions with user info
    const subscriptions = await prisma.pushSubscription.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Get user info for each subscription
    const subscribersWithInfo = await Promise.all(
      subscriptions.map(async (sub) => {
        let userInfo = null
        try {
          const user = await prisma.user.findUnique({
            where: { id: sub.userId },
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              createdAt: true
            }
          })
          userInfo = user
        } catch {
          // User might not exist
        }

        return {
          id: sub.id,
          userId: sub.userId,
          endpoint: sub.endpoint,
          userAgent: sub.userAgent,
          createdAt: sub.createdAt,
          updatedAt: sub.updatedAt,
          user: userInfo
        }
      })
    )

    return NextResponse.json({
      success: true,
      count: subscribersWithInfo.length,
      subscribers: subscribersWithInfo
    })

  } catch (error) {
    errorLog('[PWA_SUBSCRIBERS] GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}


