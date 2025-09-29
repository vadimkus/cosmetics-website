import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get basic analytics data
    const [
      totalPageViews,
      uniqueVisitors,
      recentPageViews,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.pageView.count({
        where: { timestamp: { gte: startDate } }
      }),
      prisma.pageView.groupBy({
        by: ['ipAddress'],
        where: { timestamp: { gte: startDate } }
      }).then(result => result.length),
      prisma.pageView.findMany({
        where: { timestamp: { gte: startDate } },
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
          createdAt: { gte: startDate },
          status: { not: 'CANCELLED' }
        }
      }),
      prisma.order.aggregate({
        where: { 
          createdAt: { gte: startDate },
          status: { not: 'CANCELLED' }
        },
        _sum: { total: true }
      })
    ])

    // Get device breakdown
    const deviceStats = await prisma.pageView.groupBy({
      by: ['deviceType'],
      where: { 
        timestamp: { gte: startDate },
        deviceType: { not: null }
      },
      _count: { deviceType: true }
    })

    // Get country breakdown
    const countryStats = await prisma.pageView.groupBy({
      by: ['country'],
      where: { 
        timestamp: { gte: startDate },
        country: { not: null }
      },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 5
    })

    return NextResponse.json({
      success: true,
      debug: {
        timeRange: `${days} days`,
        startDate: startDate.toISOString(),
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
    console.error('Analytics debug error:', error)
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
