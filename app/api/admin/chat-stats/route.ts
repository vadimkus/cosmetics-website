import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

// Admin API to fetch chatbot statistics
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const adminEmail = request.headers.get('X-Admin-Email')
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the user is an admin
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { isAdmin: true },
    })

    if (!admin?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get date range from query params (default: last 30 days)
    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch aggregate stats
    const [
      totalConversations,
      todayConversations,
      totalMessages,
      conversationsByLocale,
      conversationsByDevice,
      recentConversations,
      hourlyActivity,
    ] = await Promise.all([
      // Total conversations all time
      prisma.chatConversation.count(),
      
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
      
      // Hourly activity for last 24 hours
      prisma.$queryRaw`
        SELECT 
          EXTRACT(HOUR FROM "startedAt") as hour,
          COUNT(*) as count
        FROM "chat_conversations"
        WHERE "startedAt" >= NOW() - INTERVAL '24 hours'
        GROUP BY EXTRACT(HOUR FROM "startedAt")
        ORDER BY hour
      ` as Promise<Array<{ hour: number; count: bigint }>>,
    ])

    // Calculate average messages per conversation
    const avgMessagesPerConversation = totalConversations > 0
      ? Math.round((totalMessages._sum.messageCount || 0) / totalConversations * 10) / 10
      : 0

    // Daily conversations for chart (last N days)
    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE("startedAt") as date,
        COUNT(*) as conversations,
        SUM("messageCount") as messages
      FROM "chat_conversations"
      WHERE "startedAt" >= ${startDate}
      GROUP BY DATE("startedAt")
      ORDER BY date DESC
    ` as Array<{ date: Date; conversations: bigint; messages: bigint }>

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
        dailyStats: dailyStats.map((d) => ({
          date: d.date,
          conversations: Number(d.conversations),
          messages: Number(d.messages),
        })),
        hourlyActivity: hourlyActivity.map((h) => ({
          hour: Number(h.hour),
          count: Number(h.count),
        })),
        recentConversations,
      },
    })
  } catch (error) {
    errorLog('[ADMIN CHAT STATS] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat statistics' },
      { status: 500 }
    )
  }
}
