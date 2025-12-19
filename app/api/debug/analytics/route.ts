import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  // Require admin authentication
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { searchParams } = new URL(request.url)
    const daysParam = searchParams.get('days') || '30'
    const days = daysParam === 'all' ? null : (Number.isNaN(parseInt(daysParam)) ? 30 : parseInt(daysParam))
    
    const startDate = days === null ? null : (() => {
      const date = new Date()
      date.setDate(date.getDate() - days)
      return date
    })()

    // Get basic analytics data
    const [
      totalPageViews,
      uniqueVisitors,
      recentPageViews,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.pageView.count({
        where: { ...(startDate ? { timestamp: { gte: startDate } } : {}) }
      }),
      prisma.pageView.groupBy({
        by: ['ipAddress'],
        where: { ...(startDate ? { timestamp: { gte: startDate } } : {}) }
      }).then(result => result.length),
      prisma.pageView.findMany({
        where: { ...(startDate ? { timestamp: { gte: startDate } } : {}) },
        orderBy: { timestamp: 'desc' },
        take: 10,
        select: {
          timestamp: true,
          page: true,
          ipAddress: true,
          country: true,
          city: true,
          deviceType: true,
          browser: true
        }
      }),
      prisma.order.count({
        where: { 
          ...(startDate ? { createdAt: { gte: startDate } } : {}),
          status: { not: 'CANCELLED' }
        }
      }),
      prisma.order.aggregate({
        where: { 
          ...(startDate ? { createdAt: { gte: startDate } } : {}),
          status: { not: 'CANCELLED' }
        },
        _sum: { total: true }
      })
    ])

    // Get device breakdown
    const deviceStats = await prisma.pageView.groupBy({
      by: ['deviceType'],
      where: { 
        ...(startDate ? { timestamp: { gte: startDate } } : {}),
        deviceType: { not: null }
      },
      _count: { deviceType: true }
    })

    // Get country breakdown
    const countryStats = await prisma.pageView.groupBy({
      by: ['country'],
      where: { 
        ...(startDate ? { timestamp: { gte: startDate } } : {}),
        country: { not: null }
      },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 5
    })

    return NextResponse.json({
      success: true,
      debug: {
        timeRange: days === null ? 'all' : `${days} days`,
        startDate: startDate ? startDate.toISOString() : 'all time',
        currentDate: new Date().toISOString()
      },
      analytics: {
        totalPageViews,
        uniqueVisitors,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        deviceBreakdown: deviceStats.map(d => ({
          deviceType: d.deviceType || 'Unknown',
          count: d._count.deviceType
        })),
        countryBreakdown: countryStats.map(c => ({
          country: c.country || 'Unknown',
          count: c._count.country
        }))
      },
      recentActivity: recentPageViews,
      message: 'Analytics debug completed'
    })

  } catch (error) {
    errorLog('Analytics debug error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch analytics debug data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
