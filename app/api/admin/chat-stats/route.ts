import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'

// Helper to return empty stats (used when table doesn't exist yet)
function getEmptyStats() {
  return {
    success: true,
    stats: {
      overview: {
        totalConversations: 0,
        todayConversations: 0,
        totalMessages: 0,
        avgMessagesPerConversation: 0,
      },
      byLocale: [],
      byDevice: [],
      dailyStats: [],
      hourlyActivity: [],
      recentConversations: [],
    },
    message: 'No chat data yet. Stats will appear once users start chatting with Genie!',
  }
}

// Admin API to fetch chatbot statistics
export async function GET(request: NextRequest) {
  try {
    // Verify admin access via signed admin session cookie
    const auth = await requireAdminAuth(request)
    if (!auth.authorized) {
      return auth.response
    }

    // Get date range from query params (default: last 30 days)
    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Check if table exists by trying a simple count
    // If table doesn't exist, return empty stats gracefully
    let totalConversations: number
    try {
      totalConversations = await prisma.chatConversation.count()
    } catch {
      // Table likely doesn't exist yet - return empty stats
      debugLog('[ADMIN CHAT STATS] Table may not exist yet, returning empty stats')
      return NextResponse.json(getEmptyStats())
    }

    // If no conversations yet, return empty stats quickly
    if (totalConversations === 0) {
      return NextResponse.json(getEmptyStats())
    }

    // Fetch aggregate stats
    const [
      todayConversations,
      totalMessages,
      conversationsByLocale,
      conversationsByDevice,
      recentConversations,
    ] = await Promise.all([
      // Today's conversations
      prisma.chatConversation.count({
        where: {
          startedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      
      // Total messages (sum of messageCount)
      prisma.chatConversation.aggregate({
        _sum: { messageCount: true },
      }),
      
      // Conversations by locale
      prisma.chatConversation.groupBy({
        by: ['locale'],
        _count: { locale: true },
        where: { startedAt: { gte: startDate } },
        orderBy: { _count: { locale: 'desc' } },
      }),
      
      // Conversations by device type
      prisma.chatConversation.groupBy({
        by: ['deviceType'],
        _count: { deviceType: true },
        where: { startedAt: { gte: startDate } },
        orderBy: { _count: { deviceType: 'desc' } },
      }),
      
      // Recent conversations (last 50)
      prisma.chatConversation.findMany({
        orderBy: { lastMessageAt: 'desc' },
        take: 50,
        select: {
          id: true,
          sessionId: true,
          locale: true,
          messageCount: true,
          userMessages: true,
          botMessages: true,
          firstMessage: true,
          deviceType: true,
          browser: true,
          country: true,
          city: true,
          startedAt: true,
          lastMessageAt: true,
        },
      }),
    ])

    // Hourly activity - use try/catch for raw query
    let hourlyActivity: Array<{ hour: number; count: number }> = []
    try {
      const rawHourly = await prisma.$queryRaw`
        SELECT 
          EXTRACT(HOUR FROM "startedAt") as hour,
          COUNT(*) as count
        FROM "chat_conversations"
        WHERE "startedAt" >= NOW() - INTERVAL '24 hours'
        GROUP BY EXTRACT(HOUR FROM "startedAt")
        ORDER BY hour
      ` as Array<{ hour: number; count: bigint }>
      hourlyActivity = rawHourly.map((h) => ({
        hour: Number(h.hour),
        count: Number(h.count),
      }))
    } catch {
      debugLog('[ADMIN CHAT STATS] Hourly activity query failed, using empty array')
    }

    // Daily stats - use try/catch for raw query
    let dailyStats: Array<{ date: Date; conversations: number; messages: number }> = []
    try {
      const rawDaily = await prisma.$queryRaw`
        SELECT 
          DATE("startedAt") as date,
          COUNT(*) as conversations,
          SUM("messageCount") as messages
        FROM "chat_conversations"
        WHERE "startedAt" >= ${startDate}
        GROUP BY DATE("startedAt")
        ORDER BY date DESC
      ` as Array<{ date: Date; conversations: bigint; messages: bigint }>
      dailyStats = rawDaily.map((d) => ({
        date: d.date,
        conversations: Number(d.conversations),
        messages: Number(d.messages),
      }))
    } catch {
      debugLog('[ADMIN CHAT STATS] Daily stats query failed, using empty array')
    }

    // Calculate average messages per conversation
    const avgMessagesPerConversation = totalConversations > 0
      ? Math.round((totalMessages._sum.messageCount || 0) / totalConversations * 10) / 10
      : 0

    return NextResponse.json({
      success: true,
      stats: {
        overview: {
          totalConversations,
          todayConversations,
          totalMessages: totalMessages._sum.messageCount || 0,
          avgMessagesPerConversation,
        },
        byLocale: conversationsByLocale.map((l) => ({
          locale: l.locale,
          count: l._count.locale,
        })),
        byDevice: conversationsByDevice.map((d) => ({
          device: d.deviceType || 'unknown',
          count: d._count.deviceType,
        })),
        dailyStats,
        hourlyActivity,
        recentConversations,
      },
    })
  } catch (error) {
    errorLog('[ADMIN CHAT STATS] Error:', error)
    
    // Check if it's a "table doesn't exist" error
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('does not exist') || errorMessage.includes('relation') || errorMessage.includes('P2021')) {
      return NextResponse.json(getEmptyStats())
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch chat statistics' },
      { status: 500 }
    )
  }
}
