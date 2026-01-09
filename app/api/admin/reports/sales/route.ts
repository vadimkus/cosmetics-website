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

    // Optimize: Use database aggregation for totals with single query
    // Only count DELIVERED orders for accurate sales reporting
    const totalsAggregation = await prisma.order.aggregate({
      where: {
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
        status: 'DELIVERED'
      },
      _sum: { total: true },
      _count: { id: true }
    })

    const totalRevenue = totalsAggregation._sum.total || 0
    const totalOrders = totalsAggregation._count.id || 0
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Optimize: Use database aggregation for revenue by day
    // Only count DELIVERED orders for accurate sales reporting
    const revenueByDayQuery = startDate
      ? await prisma.$queryRaw<Array<{
          date: string
          revenue: number
          orders: number
        }>>`
          SELECT 
            DATE("createdAt") as date,
            SUM(total) as revenue,
            COUNT(*) as orders
          FROM "orders" 
          WHERE status = 'DELIVERED' AND "createdAt" >= ${startDate}
          GROUP BY DATE("createdAt")
          ORDER BY date ASC
        `
      : await prisma.$queryRaw<Array<{
          date: string
          revenue: number
          orders: number
        }>>`
          SELECT 
            DATE("createdAt") as date,
            SUM(total) as revenue,
            COUNT(*) as orders
          FROM "orders" 
          WHERE status = 'DELIVERED'
          GROUP BY DATE("createdAt")
          ORDER BY date ASC
        `
    
    const revenueByDay = revenueByDayQuery.map(item => ({
      date: item.date,
      revenue: Number(item.revenue),
      orders: Number(item.orders)
    }))

    // Optimize: Use database aggregation for revenue by month
    // Only count DELIVERED orders for accurate sales reporting
    const revenueByMonthQuery = startDate
      ? await prisma.$queryRaw<Array<{
          month: string
          revenue: number
          orders: number
        }>>`
          SELECT 
            TO_CHAR("createdAt", 'YYYY-MM') as month,
            SUM(total) as revenue,
            COUNT(*) as orders
          FROM "orders" 
          WHERE status = 'DELIVERED' AND "createdAt" >= ${startDate}
          GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
          ORDER BY month ASC
        `
      : await prisma.$queryRaw<Array<{
          month: string
          revenue: number
          orders: number
        }>>`
          SELECT 
            TO_CHAR("createdAt", 'YYYY-MM') as month,
            SUM(total) as revenue,
            COUNT(*) as orders
          FROM "orders" 
          WHERE status = 'DELIVERED'
          GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
          ORDER BY month ASC
        `
    
    const revenueByMonth = revenueByMonthQuery.map(item => ({
      month: item.month,
      revenue: Number(item.revenue),
      orders: Number(item.orders)
    }))

    // Optimize: Use database aggregation for revenue by status
    // Only count DELIVERED orders for accurate sales reporting
    const revenueByStatusQuery = await prisma.order.groupBy({
      by: ['status'],
      where: {
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
        status: 'DELIVERED'
      },
      _sum: { total: true },
      _count: { id: true }
    })
    
    const revenueByStatus = revenueByStatusQuery
      .map(item => ({
        status: item.status,
        revenue: item._sum.total || 0,
        orders: item._count.id || 0
      }))
      .sort((a, b) => b.revenue - a.revenue)

    // Optimize: Use database aggregation for top products
    // Only count DELIVERED orders for accurate sales reporting
    const topProductsQuery = startDate
      ? await prisma.$queryRaw<Array<{
          productId: string
          productName: string
          revenue: number
          quantity: number
          orders: number
        }>>`
          SELECT 
            oi."productId",
            oi."productName",
            SUM(oi.price * oi.quantity) as revenue,
            SUM(oi.quantity) as quantity,
            COUNT(DISTINCT oi."orderId") as orders
          FROM "order_items" oi
          JOIN "orders" o ON o.id = oi."orderId"
          WHERE o.status = 'DELIVERED' AND o."createdAt" >= ${startDate}
          GROUP BY oi."productId", oi."productName"
          ORDER BY revenue DESC
          LIMIT 20
        `
      : await prisma.$queryRaw<Array<{
          productId: string
          productName: string
          revenue: number
          quantity: number
          orders: number
        }>>`
          SELECT 
            oi."productId",
            oi."productName",
            SUM(oi.price * oi.quantity) as revenue,
            SUM(oi.quantity) as quantity,
            COUNT(DISTINCT oi."orderId") as orders
          FROM "order_items" oi
          JOIN "orders" o ON o.id = oi."orderId"
          WHERE o.status = 'DELIVERED'
          GROUP BY oi."productId", oi."productName"
          ORDER BY revenue DESC
          LIMIT 20
        `
    
    const topProducts = topProductsQuery.map(item => ({
      productId: item.productId,
      productName: item.productName,
      revenue: Number(item.revenue),
      quantity: Number(item.quantity),
      orders: Number(item.orders)
    }))

    // Optimize: Use database aggregation for top customers
    // Only count DELIVERED orders for accurate sales reporting
    const topCustomersQuery = startDate
      ? await prisma.$queryRaw<Array<{
          email: string
          name: string
          revenue: number
          orders: number
          lastOrderDate: string
        }>>`
          SELECT 
            o."customerEmail" as email,
            o."customerName" as name,
            SUM(o.total) as revenue,
            COUNT(*) as orders,
            MAX(o."createdAt") as "lastOrderDate"
          FROM "orders" o
          WHERE o.status = 'DELIVERED' AND o."createdAt" >= ${startDate}
          GROUP BY o."customerEmail", o."customerName"
          ORDER BY revenue DESC
          LIMIT 20
        `
      : await prisma.$queryRaw<Array<{
          email: string
          name: string
          revenue: number
          orders: number
          lastOrderDate: string
        }>>`
          SELECT 
            o."customerEmail" as email,
            o."customerName" as name,
            SUM(o.total) as revenue,
            COUNT(*) as orders,
            MAX(o."createdAt") as "lastOrderDate"
          FROM "orders" o
          WHERE o.status = 'DELIVERED'
          GROUP BY o."customerEmail", o."customerName"
          ORDER BY revenue DESC
          LIMIT 20
        `
    
    const topCustomers = topCustomersQuery.map(item => ({
      email: item.email,
      name: item.name,
      revenue: Number(item.revenue),
      orders: Number(item.orders),
      lastOrderDate: new Date(item.lastOrderDate).toISOString()
    }))

    // Return empty arrays if no orders, but still return the structure
    return NextResponse.json({
      totalRevenue: totalRevenue || 0,
      totalOrders: totalOrders || 0,
      averageOrderValue: averageOrderValue || 0,
      revenueByDay: revenueByDay || [],
      revenueByMonth: revenueByMonth || [],
      revenueByStatus: revenueByStatus || [],
      topProducts: topProducts || [],
      topCustomers: topCustomers || []
    })
  } catch (error) {
    errorLog('Error fetching sales report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales report' },
      { status: 500 }
    )
  }
}

