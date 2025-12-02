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

    // Get orders grouped by period
    const orders = await prisma.order.findMany({
      where: {
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
        status: { not: 'CANCELLED' }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Group by period (daily for < 90 days, weekly for < 365 days, monthly otherwise)
    const periodType = days === null || days >= 365 ? 'monthly' : days >= 90 ? 'weekly' : 'daily'
    
    const trendsMap = new Map<string, { revenue: number; orders: number }>()
    
    orders.forEach(order => {
      let periodKey: string
      const date = new Date(order.createdAt)
      
      if (periodType === 'daily') {
        periodKey = date.toISOString().split('T')[0] || date.toISOString().substring(0, 10) // YYYY-MM-DD
      } else if (periodType === 'weekly') {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        periodKey = weekStart.toISOString().substring(0, 10) + ' (Week)'
      } else {
        periodKey = date.toISOString().substring(0, 7) // YYYY-MM
      }
      
      const existing = trendsMap.get(periodKey) || { revenue: 0, orders: 0 }
      existing.revenue += order.total
      existing.orders += 1
      trendsMap.set(periodKey, existing)
    })

    const trends: Array<{ period: string; revenue: number; orders: number; averageOrderValue: number; growth: number }> = []
    let previousRevenue = 0

    Array.from(trendsMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([period, data]) => {
        const averageOrderValue = data.orders > 0 ? data.revenue / data.orders : 0
        const growth = previousRevenue > 0 ? ((data.revenue - previousRevenue) / previousRevenue) * 100 : 0
        
        trends.push({
          period,
          revenue: data.revenue,
          orders: data.orders,
          averageOrderValue,
          growth
        })
        
        previousRevenue = data.revenue
      })

    return NextResponse.json({ trends })
  } catch (error) {
    errorLog('Error fetching revenue trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue trends' },
      { status: 500 }
    )
  }
}

