import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsData, getRealTimeVisitors, getUserActivityTimeline, getTopCountries, getTopCities } from '@/lib/analyticsServer'
import { errorLog } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const type = searchParams.get('type') || 'overview'
    
    // Calculate start date for all cases that need it
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    switch (type) {
      case 'overview':
        const analyticsData = await getAnalyticsData(days)
        return NextResponse.json(analyticsData)
      
      case 'realtime':
        const realTimeVisitors = await getRealTimeVisitors()
        return NextResponse.json({ visitors: realTimeVisitors })
      
      case 'timeline':
        const timeline = await getUserActivityTimeline(days)
        return NextResponse.json(timeline)
      
      case 'countries':
        const countries = await getTopCountries(days)
        return NextResponse.json(countries)
      
      case 'cities':
        const cities = await getTopCities(days)
        return NextResponse.json(cities)
      
      case 'devices':
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
        
        return NextResponse.json(deviceStats.map(d => ({
          deviceType: d.deviceType || 'Unknown',
          count: d._count.deviceType
        })))
      
      case 'browsers':
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
          take: 10
        })
        
        return NextResponse.json(browserStats.map(b => ({
          browser: b.browser || 'Unknown',
          count: b._count.browser
        })))
      
      case 'ux-metrics':
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
        
        // Get non-cancelled orders count for consistency
        const nonCancelledOrders = await prisma.order.count({
          where: {
            createdAt: {
              gte: startDate
            },
            status: {
              not: 'CANCELLED'
            }
          }
        })
        
        return NextResponse.json({
          bounceRate: Math.round(bounceRate * 100) / 100,
          avgSessionDuration: Math.round(avgSessionDuration),
          avgPageViewsPerSession: Math.round(avgPageViewsPerSession * 100) / 100,
          totalSessions,
          ordersPlaced: nonCancelledOrders
        })
      
      case 'pdf-downloads':
        const pdfDownloads = await prisma.pDFDownload.findMany({
          where: {
            timestamp: {
              gte: startDate
            }
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
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }
  } catch (error) {
    errorLog('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
