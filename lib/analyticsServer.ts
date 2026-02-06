import { debugLog } from '@/lib/logger'
// Server-side analytics functions for admin dashboard
import { prisma } from './prisma'

export const getAnalyticsData = async (days: number | null = 30) => {
  const startDate = days === null ? null : (() => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  })()

  const [
    totalPageViews,
    uniqueVisitors,
    totalOrders,
    totalRevenue,
    pdfDownloads,
    topPages,
    topCountries,
    deviceStats,
    browserStats,
    userRegistrations
  ] = await Promise.all([
    prisma.pageView.count({
      where: { ...(startDate ? { timestamp: { gte: startDate } } : {}) }
    }),
    prisma.pageView.groupBy({
      by: ['ipAddress'],
      where: { ...(startDate ? { timestamp: { gte: startDate } } : {}) }
    }).then(result => result.length),
    prisma.order.count({
      where: { 
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
        status: 'DELIVERED'  // Only count delivered orders
      }
    }),
    prisma.order.aggregate({
      where: { 
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
        status: 'DELIVERED'  // Only sum revenue from delivered orders
      },
      _sum: { total: true }
    }),
    prisma.pDFDownload.count({
      where: { ...(startDate ? { timestamp: { gte: startDate } } : {}) }
    }),
    // Get top pages
    prisma.pageView.groupBy({
      by: ['page'],
      where: { ...(startDate ? { timestamp: { gte: startDate } } : {}) },
      _count: { page: true },
      orderBy: { _count: { page: 'desc' } },
      take: 10
    }),
    // Get top countries
    prisma.pageView.groupBy({
      by: ['country'],
      where: { 
        ...(startDate ? { timestamp: { gte: startDate } } : {}),
        country: { not: null }
      },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 10
    }),
    // Get device stats
    prisma.pageView.groupBy({
      by: ['deviceType'],
      where: { 
        ...(startDate ? { timestamp: { gte: startDate } } : {}),
        deviceType: { not: null }
      },
      _count: { deviceType: true }
    }),
    // Get browser stats
    prisma.pageView.groupBy({
      by: ['browser'],
      where: { 
        ...(startDate ? { timestamp: { gte: startDate } } : {}),
        browser: { not: null }
      },
      _count: { browser: true },
      orderBy: { _count: { browser: 'desc' } },
      take: 5
    }),
    // Get user registrations
    prisma.user.count({
      where: { 
        ...(startDate ? { createdAt: { gte: startDate } } : {})
      }
    })
  ])

  // Format the data to match component expectations
  const deviceAnalytics = {
    mobile: deviceStats.find(d => d.deviceType === 'mobile')?._count.deviceType || 0,
    tablet: deviceStats.find(d => d.deviceType === 'tablet')?._count.deviceType || 0,
    desktop: deviceStats.find(d => d.deviceType === 'desktop')?._count.deviceType || 0,
    topBrowsers: browserStats.map(b => ({
      browser: b.browser || 'Unknown',
      count: b._count.browser
    })),
    topOS: [] // We don't track OS separately, but component expects this
  }

  return {
    totalVisitors: uniqueVisitors, // Map uniqueVisitors to totalVisitors
    totalPageViews,
    uniqueVisitors,
    topPages: topPages.map(p => ({
      page: p.page || 'Unknown',
      views: p._count.page
    })),
    topCountries: topCountries.map(c => ({
      country: c.country || 'Unknown',
      visitors: c._count.country
    })),
    topCities: [], // Will be populated by separate API call
    deviceAnalytics,
    uxMetrics: {
      bounceRate: 0, // Will be calculated separately
      avgSessionDuration: 0, // Will be calculated separately
      avgPageViewsPerSession: 0 // Will be calculated separately
    },
    recentActivity: [], // Will be populated by timeline API
    userRegistrations,
    ordersPlaced: totalOrders,
    conversionRate: uniqueVisitors > 0 ? (totalOrders / uniqueVisitors) * 100 : 0,
    totalRevenue: totalRevenue._sum.total || 0,
    pdfDownloads
  }
}

export const getRealTimeVisitors = async () => {
  const fiveMinutesAgo = new Date()
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)
  
  const recentVisitors = await prisma.pageView.count({
    where: { timestamp: { gte: fiveMinutesAgo } }
  })
  
  return recentVisitors
}

export const getUserActivityTimeline = async (days: number | null = 30) => {
  const startDate = days === null ? null : (() => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  })()

  const timeline = await prisma.pageView.findMany({
    where: { ...(startDate ? { timestamp: { gte: startDate } } : {}) },
    select: {
      timestamp: true,
      page: true,
      userEmail: true,
      ipAddress: true,
      country: true,
      city: true
    },
    orderBy: { timestamp: 'desc' },
    take: 100
  })

  return timeline
}

export const getTopCountries = async (days: number | null = 30) => {
  const startDate = days === null ? null : (() => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  })()

  const countries = await prisma.pageView.groupBy({
    by: ['country'],
    where: {
      ...(startDate ? { timestamp: { gte: startDate } } : {}),
      country: { not: null }
    },
    _count: { country: true },
    orderBy: { _count: { country: 'desc' } },
    take: 10
  })

  return countries.map(c => ({
    country: c.country || 'Unknown',
    count: c._count.country
  }))
}

export const getTopCities = async (days: number | null = 30) => {
  const startDate = days === null ? null : (() => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
  })()

  const cities = await prisma.pageView.groupBy({
    by: ['city'],
    where: {
      ...(startDate ? { timestamp: { gte: startDate } } : {}),
      city: { not: null }
    },
    _count: { city: true },
    orderBy: { _count: { city: 'desc' } },
    take: 10
  })

  return cities.map(c => ({
    city: c.city || 'Unknown',
    count: c._count.city
  }))
}

export const trackUserAction = async (data: {
  action: string;
  userEmail?: string;
  details?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}) => {
  // This function is for server-side tracking
  // For client-side tracking, use the gtag functions in analytics.ts
  debugLog('User action tracked:', data)
  
  // You can add database logging here if needed
  // await prisma.userAction.create({
  //   data: {
  //     action: data.action,
  //     userEmail: data.userEmail,
  //     details: data.details,
  //     metadata: data.metadata
  //   }
  // })
}
