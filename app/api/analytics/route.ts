import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsData, getRealTimeVisitors, getUserActivityTimeline, getTopCountries, getTopCities } from '@/lib/analyticsServer'
import { errorLog } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  // Admin-only: this returns revenue, visitor geolocation, and PDF-download
  // PII (emails). Only the admin dashboard calls it (via the httpOnly
  // admin-session cookie, sent automatically same-origin).
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    const { searchParams } = new URL(request.url)
    const daysParam = searchParams.get('days') || '30'
    const days = daysParam === 'all' ? null : (Number.isNaN(parseInt(daysParam)) ? 30 : parseInt(daysParam))
    const type = searchParams.get('type') || 'overview'
    
    // Calculate start date for all cases that need it (null means all time)
    const startDate = days === null ? null : (() => {
      const date = new Date()
      date.setDate(date.getDate() - days)
      return date
    })()

    switch (type) {
      case 'overview': {
        const analyticsData = await getAnalyticsData(days)
        
        // Fetch UX metrics using aggregate queries (not findMany) to avoid 5MB response limit
        const sessionWhere = startDate ? { startTime: { gte: startDate } } : {}
        
        const [totalSessions, bounceSessions, sessionAggregates] = await Promise.all([
          prisma.userSession.count({ where: sessionWhere }),
          prisma.userSession.count({ where: { ...sessionWhere, isBounce: true } }),
          prisma.userSession.aggregate({
            where: sessionWhere,
            _avg: { duration: true, pageViews: true },
          }),
        ])
        
        const bounceRate = totalSessions > 0 ? (bounceSessions / totalSessions) * 100 : 0
        const avgSessionDuration = sessionAggregates._avg.duration || 0
        const avgPageViewsPerSession = sessionAggregates._avg.pageViews || 0
        
        // Merge UX metrics into analytics data
        const analyticsWithUX = {
          ...analyticsData,
          uxMetrics: {
            bounceRate: Math.round(bounceRate * 100) / 100,
            avgSessionDuration: Math.round(avgSessionDuration),
            avgPageViewsPerSession: Math.round(avgPageViewsPerSession * 100) / 100
          }
        }
        
        return NextResponse.json(analyticsWithUX)
      }
      
      case 'realtime': {
        const realTimeVisitors = await getRealTimeVisitors()
        return NextResponse.json({ visitors: realTimeVisitors })
      }
      
      case 'timeline': {
        const timeline = await getUserActivityTimeline(days)
        return NextResponse.json(timeline)
      }
      
      case 'countries': {
        const countries = await getTopCountries(days)
        return NextResponse.json(countries)
      }
      
      case 'cities': {
        const cities = await getTopCities(days)
        return NextResponse.json(cities)
      }
      
      case 'devices': {
        const deviceStats = await prisma.pageView.groupBy({
          by: ['deviceType'],
          where: {
            ...(startDate ? { timestamp: { gte: startDate } } : {}),
            deviceType: {
              not: null
            }
          },
          _count: {
            deviceType: true
          }
        })
        
        return NextResponse.json(deviceStats.map(d => ({
          deviceType: d.deviceType || 'Unknown',
          count: d._count.deviceType
        })))
      }
      
      case 'browsers': {
        const browserStats = await prisma.pageView.groupBy({
          by: ['browser'],
          where: {
            ...(startDate ? { timestamp: { gte: startDate } } : {}),
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
          take: 10
        })
        
        return NextResponse.json(browserStats.map(b => ({
          browser: b.browser || 'Unknown',
          count: b._count.browser
        })))
      }
      
      case 'ux-metrics': {
        // Use aggregate queries (not findMany) to avoid 5MB response limit
        const uxSessionWhere = startDate ? { startTime: { gte: startDate } } : {}
        
        const [uxTotalSessions, uxBounceSessions, uxAggregates, nonCancelledOrders] = await Promise.all([
          prisma.userSession.count({ where: uxSessionWhere }),
          prisma.userSession.count({ where: { ...uxSessionWhere, isBounce: true } }),
          prisma.userSession.aggregate({
            where: uxSessionWhere,
            _avg: { duration: true, pageViews: true },
          }),
          prisma.order.count({
            where: {
              ...(startDate ? { createdAt: { gte: startDate } } : {}),
              status: { not: 'CANCELLED' }
            }
          })
        ])
        
        const uxBounceRate = uxTotalSessions > 0 ? (uxBounceSessions / uxTotalSessions) * 100 : 0
        
        return NextResponse.json({
          bounceRate: Math.round(uxBounceRate * 100) / 100,
          avgSessionDuration: Math.round(uxAggregates._avg.duration || 0),
          avgPageViewsPerSession: Math.round((uxAggregates._avg.pageViews || 0) * 100) / 100,
          totalSessions: uxTotalSessions,
          ordersPlaced: nonCancelledOrders
        })
      }
      
      case 'pdf-downloads': {
        const pdfDownloads = await prisma.pDFDownload.findMany({
          where: {
            ...(startDate ? { timestamp: { gte: startDate } } : {})
          },
          orderBy: {
            timestamp: 'desc'
          }
        })
        
        // Get total downloads count
        const totalDownloads = pdfDownloads.length
        
        // Get downloads by filename
        const downloadsByFile = pdfDownloads.reduce((acc, download) => {
          acc[download.filename] = (acc[download.filename] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        // Get downloads by device type
        const downloadsByDevice = pdfDownloads.reduce((acc, download) => {
          const device = download.deviceType || 'Unknown'
          acc[device] = (acc[device] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        // Get downloads by browser
        const downloadsByBrowser = pdfDownloads.reduce((acc, download) => {
          const browser = download.browser || 'Unknown'
          acc[browser] = (acc[browser] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        // Get recent downloads (last 10)
        const recentDownloads = pdfDownloads.slice(0, 10).map(download => ({
          filename: download.filename,
          userEmail: download.userEmail,
          timestamp: download.timestamp,
          deviceType: download.deviceType,
          browser: download.browser
        }))
        
        return NextResponse.json({
          totalDownloads,
          downloadsByFile,
          downloadsByDevice,
          downloadsByBrowser,
          recentDownloads
        })
      }
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    errorLog('Error fetching analytics:', { message: errorMessage, stack: errorStack })
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', detail: errorMessage },
      { status: 500 }
    )
  }
}
