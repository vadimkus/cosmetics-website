import { prisma } from './prisma'
import { parseUserAgent, generateSessionId } from './deviceDetection'

export interface AnalyticsData {
  totalVisitors: number
  totalPageViews: number
  uniqueVisitors: number
  topPages: Array<{ page: string; views: number }>
  topCountries: Array<{ country: string; visitors: number }>
  deviceAnalytics: {
    mobile: number
    tablet: number
    desktop: number
    topBrowsers: Array<{ browser: string; count: number }>
    topOS: Array<{ os: string; count: number }>
  }
  uxMetrics: {
    bounceRate: number
    avgSessionDuration: number
    avgPageViewsPerSession: number
  }
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
  country?: string
  referrer?: string
  deviceType?: string
  browser?: string
  os?: string
  screenWidth?: number
  screenHeight?: number
}

// Track a page view
export async function trackPageView(data: {
  page: string
  userId?: string
  userEmail?: string
  userAgent?: string
  ipAddress?: string
  country?: string
  referrer?: string
  deviceType?: string
  browser?: string
  os?: string
  screenWidth?: number
  screenHeight?: number
}): Promise<void> {
  try {
    await prisma.pageView.create({
      data: {
        page: data.page,
        userId: data.userId,
        userEmail: data.userEmail,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        country: data.country,
        referrer: data.referrer,
        deviceType: data.deviceType,
        browser: data.browser,
        os: data.os,
        screenWidth: data.screenWidth,
        screenHeight: data.screenHeight,
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

    // Get top countries
    const topCountries = await prisma.pageView.groupBy({
      by: ['country'],
      where: {
        timestamp: {
          gte: startDate
        },
        country: {
          not: null
        }
      },
      _count: {
        country: true
      },
      orderBy: {
        _count: {
          country: 'desc'
        }
      },
      take: 10
    })

    // Get device analytics
    const deviceStats = await prisma.pageView.groupBy({
      by: ['deviceType'],
      where: {
        timestamp: {
          gte: startDate
        },
        deviceType: {
          not: null
        }
      },
      _count: {
        deviceType: true
      }
    })

    // Get browser analytics
    const browserStats = await prisma.pageView.groupBy({
      by: ['browser'],
      where: {
        timestamp: {
          gte: startDate
        },
        browser: {
          not: null
        }
      },
      _count: {
        browser: true
      },
      orderBy: {
        _count: {
          browser: 'desc'
        }
      },
      take: 5
    })

    // Get OS analytics
    const osStats = await prisma.pageView.groupBy({
      by: ['os'],
      where: {
        timestamp: {
          gte: startDate
        },
        os: {
          not: null
        }
      },
      _count: {
        os: true
      },
      orderBy: {
        _count: {
          os: 'desc'
        }
      },
      take: 5
    })

    // Get UX metrics from sessions
    const sessions = await prisma.userSession.findMany({
      where: {
        startTime: {
          gte: startDate
        }
      }
    })

    const totalSessions = sessions.length
    const bounceSessions = sessions.filter(s => s.isBounce).length
    const bounceRate = totalSessions > 0 ? (bounceSessions / totalSessions) * 100 : 0
    
    const avgSessionDuration = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length 
      : 0
    
    const avgPageViewsPerSession = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.pageViews, 0) / sessions.length
      : 0

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

    // Get orders placed (excluding cancelled orders)
    const ordersPlaced = await prisma.order.count({
      where: {
        createdAt: {
          gte: startDate
        },
        status: {
          not: 'CANCELLED'
        }
      }
    })

    // Calculate conversion rate
    const conversionRate = uniqueVisitors.length > 0 
      ? (ordersPlaced / uniqueVisitors.length) * 100 
      : 0

    // Process device stats
    const deviceAnalytics = {
      mobile: deviceStats.find(d => d.deviceType === 'mobile')?._count.deviceType || 0,
      tablet: deviceStats.find(d => d.deviceType === 'tablet')?._count.deviceType || 0,
      desktop: deviceStats.find(d => d.deviceType === 'desktop')?._count.deviceType || 0,
      topBrowsers: browserStats.map(b => ({
        browser: b.browser || 'Unknown',
        count: b._count.browser
      })),
      topOS: osStats.map(o => ({
        os: o.os || 'Unknown',
        count: o._count.os
      }))
    }

    return {
      totalVisitors: uniqueVisitors.length,
      totalPageViews,
      uniqueVisitors: uniqueVisitors.length,
      topPages: topPages.map(p => ({
        page: p.page,
        views: p._count.page
      })),
      topCountries: topCountries.map(c => ({
        country: c.country || 'Unknown',
        visitors: c._count.country
      })),
      deviceAnalytics,
      uxMetrics: {
        bounceRate: Math.round(bounceRate * 100) / 100,
        avgSessionDuration: Math.round(avgSessionDuration),
        avgPageViewsPerSession: Math.round(avgPageViewsPerSession * 100) / 100
      },
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
      topCountries: [],
      deviceAnalytics: {
        mobile: 0,
        tablet: 0,
        desktop: 0,
        topBrowsers: [],
        topOS: []
      },
      uxMetrics: {
        bounceRate: 0,
        avgSessionDuration: 0,
        avgPageViewsPerSession: 0
      },
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

// Get top countries data
export async function getTopCountries(days: number = 30): Promise<Array<{ country: string; visitors: number }>> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const topCountries = await prisma.pageView.groupBy({
      by: ['country'],
      where: {
        timestamp: {
          gte: startDate
        },
        country: {
          not: null
        }
      },
      _count: {
        country: true
      },
      orderBy: {
        _count: {
          country: 'desc'
        }
      },
      take: 20
    })

    return topCountries.map(c => ({
      country: c.country || 'Unknown',
      visitors: c._count.country
    }))
  } catch (error) {
    console.error('Error getting top countries:', error)
    return []
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
