import { prisma } from './prisma'

export interface AnalyticsData {
  totalVisitors: number
  totalPageViews: number
  uniqueVisitors: number
  topPages: Array<{ page: string; views: number }>
  recentActivity: Array<{ timestamp: Date; action: string; details: string }>
  userRegistrations: number
  ordersPlaced: number
  conversionRate: number
}

export interface PageView {
  id: string
  page: string
  userId?: string
  userEmail?: string
  timestamp: Date
  userAgent?: string
  ipAddress?: string
  referrer?: string
}

// Track a page view
export async function trackPageView(data: {
  page: string
  userId?: string
  userEmail?: string
  userAgent?: string
  ipAddress?: string
  referrer?: string
}): Promise<void> {
  try {
    await prisma.pageView.create({
      data: {
        page: data.page,
        userId: data.userId,
        userEmail: data.userEmail,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        referrer: data.referrer,
        timestamp: new Date()
      }
    })
    console.log('✅ Page view tracked:', data.page)
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

// Track user action
export async function trackUserAction(data: {
  action: string
  userId?: string
  userEmail?: string
  details?: string
}): Promise<void> {
  try {
    await prisma.userAction.create({
      data: {
        action: data.action,
        userId: data.userId,
        userEmail: data.userEmail,
        details: data.details,
        timestamp: new Date()
      }
    })
    console.log('✅ User action tracked:', data.action)
  } catch (error) {
    console.error('Error tracking user action:', error)
  }
}

// Get analytics data for admin dashboard
export async function getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get total page views
    const totalPageViews = await prisma.pageView.count({
      where: {
        timestamp: {
          gte: startDate
        }
      }
    })

    // Get unique visitors (by IP address)
    const uniqueVisitors = await prisma.pageView.findMany({
      where: {
        timestamp: {
          gte: startDate
        }
      },
      select: {
        ipAddress: true
      },
      distinct: ['ipAddress']
    })

    // Get top pages
    const topPages = await prisma.pageView.groupBy({
      by: ['page'],
      where: {
        timestamp: {
          gte: startDate
        }
      },
      _count: {
        page: true
      },
      orderBy: {
        _count: {
          page: 'desc'
        }
      },
      take: 10
    })

    // Get recent activity
    const recentActivity = await prisma.userAction.findMany({
      where: {
        timestamp: {
          gte: startDate
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 20
    })

    // Get user registrations
    const userRegistrations = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    // Get orders placed
    const ordersPlaced = await prisma.order.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    // Calculate conversion rate
    const conversionRate = uniqueVisitors.length > 0 
      ? (ordersPlaced / uniqueVisitors.length) * 100 
      : 0

    return {
      totalVisitors: uniqueVisitors.length,
      totalPageViews,
      uniqueVisitors: uniqueVisitors.length,
      topPages: topPages.map(p => ({
        page: p.page,
        views: p._count.page
      })),
      recentActivity: recentActivity.map(a => ({
        timestamp: a.timestamp,
        action: a.action,
        details: a.details || ''
      })),
      userRegistrations,
      ordersPlaced,
      conversionRate: Math.round(conversionRate * 100) / 100
    }
  } catch (error) {
    console.error('Error getting analytics data:', error)
    return {
      totalVisitors: 0,
      totalPageViews: 0,
      uniqueVisitors: 0,
      topPages: [],
      recentActivity: [],
      userRegistrations: 0,
      ordersPlaced: 0,
      conversionRate: 0
    }
  }
}

// Get real-time visitor count (last 24 hours)
export async function getRealTimeVisitors(): Promise<number> {
  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const uniqueVisitors = await prisma.pageView.findMany({
      where: {
        timestamp: {
          gte: yesterday
        }
      },
      select: {
        ipAddress: true
      },
      distinct: ['ipAddress']
    })

    return uniqueVisitors.length
  } catch (error) {
    console.error('Error getting real-time visitors:', error)
    return 0
  }
}

// Get page views for a specific page
export async function getPageViews(page: string, days: number = 30): Promise<number> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return await prisma.pageView.count({
      where: {
        page,
        timestamp: {
          gte: startDate
        }
      }
    })
  } catch (error) {
    console.error('Error getting page views:', error)
    return 0
  }
}

// Get user activity timeline
export async function getUserActivityTimeline(days: number = 7): Promise<Array<{ date: string; visitors: number; pageViews: number }>> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const pageViews = await prisma.pageView.findMany({
      where: {
        timestamp: {
          gte: startDate
        }
      },
      select: {
        timestamp: true,
        ipAddress: true
      }
    })

    // Group by date
    const dailyData: { [key: string]: { visitors: Set<string>; pageViews: number } } = {}
    
    pageViews.forEach(view => {
      const date = view.timestamp.toISOString().split('T')[0]
      if (!dailyData[date]) {
        dailyData[date] = { visitors: new Set(), pageViews: 0 }
      }
      dailyData[date].visitors.add(view.ipAddress || 'unknown')
      dailyData[date].pageViews++
    })

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      visitors: data.visitors.size,
      pageViews: data.pageViews
    })).sort((a, b) => a.date.localeCompare(b.date))
  } catch (error) {
    console.error('Error getting user activity timeline:', error)
    return []
  }
}
