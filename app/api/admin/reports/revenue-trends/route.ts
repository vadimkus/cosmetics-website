import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
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

    // Group by period (daily for < 90 days, weekly for < 365 days, monthly otherwise)
    const periodType = days === null || days >= 365 ? 'monthly' : days >= 90 ? 'weekly' : 'daily'
    
    // Optimize: Use database aggregation based on period type
    let trendsQuery: Array<{ period: string; revenue: number; orders: number }>
    
    if (periodType === 'daily') {
      const dailyQuery = startDate
        ? await prisma.$queryRaw<Array<{
            period: string
            revenue: number
            orders: number
          }>>`
            SELECT 
              DATE("createdAt") as period,
              SUM(total) as revenue,
              COUNT(*) as orders
            FROM "Order" 
            WHERE status != 'CANCELLED' AND "createdAt" >= ${startDate}
            GROUP BY DATE("createdAt")
            ORDER BY period ASC
          `
        : await prisma.$queryRaw<Array<{
            period: string
            revenue: number
            orders: number
          }>>`
            SELECT 
              DATE("createdAt") as period,
              SUM(total) as revenue,
              COUNT(*) as orders
            FROM "Order" 
            WHERE status != 'CANCELLED'
            GROUP BY DATE("createdAt")
            ORDER BY period ASC
          `
      trendsQuery = dailyQuery
    } else if (periodType === 'weekly') {
      const weeklyQuery = startDate
        ? await prisma.$queryRaw<Array<{
            period: string
            revenue: number
            orders: number
          }>>`
            SELECT 
              TO_CHAR(DATE_TRUNC('week', "createdAt"), 'YYYY-MM-DD') || ' (Week)' as period,
              SUM(total) as revenue,
              COUNT(*) as orders
            FROM "Order" 
            WHERE status != 'CANCELLED' AND "createdAt" >= ${startDate}
            GROUP BY DATE_TRUNC('week', "createdAt")
            ORDER BY DATE_TRUNC('week', "createdAt") ASC
          `
        : await prisma.$queryRaw<Array<{
            period: string
            revenue: number
            orders: number
          }>>`
            SELECT 
              TO_CHAR(DATE_TRUNC('week', "createdAt"), 'YYYY-MM-DD') || ' (Week)' as period,
              SUM(total) as revenue,
              COUNT(*) as orders
            FROM "Order" 
            WHERE status != 'CANCELLED'
            GROUP BY DATE_TRUNC('week', "createdAt")
            ORDER BY DATE_TRUNC('week', "createdAt") ASC
          `
      trendsQuery = weeklyQuery
    } else {
      const monthlyQuery = startDate
        ? await prisma.$queryRaw<Array<{
            period: string
            revenue: number
            orders: number
          }>>`
            SELECT 
              TO_CHAR("createdAt", 'YYYY-MM') as period,
              SUM(total) as revenue,
              COUNT(*) as orders
            FROM "Order" 
            WHERE status != 'CANCELLED' AND "createdAt" >= ${startDate}
            GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
            ORDER BY period ASC
          `
        : await prisma.$queryRaw<Array<{
            period: string
            revenue: number
            orders: number
          }>>`
            SELECT 
              TO_CHAR("createdAt", 'YYYY-MM') as period,
              SUM(total) as revenue,
              COUNT(*) as orders
            FROM "Order" 
            WHERE status != 'CANCELLED'
            GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
            ORDER BY period ASC
          `
      trendsQuery = monthlyQuery
    }

    // Calculate trends with growth from optimized query results
    const trends: Array<{ period: string; revenue: number; orders: number; averageOrderValue: number; growth: number }> = []
    let previousRevenue = 0

    trendsQuery.forEach((item) => {
      const revenue = Number(item.revenue)
      const orders = Number(item.orders)
      const averageOrderValue = orders > 0 ? revenue / orders : 0
      const growth = previousRevenue > 0 ? ((revenue - previousRevenue) / previousRevenue) * 100 : 0
      
      trends.push({
        period: item.period,
        revenue,
        orders,
        averageOrderValue,
        growth
      })
      
      previousRevenue = revenue
    })

    return NextResponse.json({ trends })
  } catch {
    errorLog('Error fetching revenue trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue trends' },
      { status: 500 }
    )
  }
}

