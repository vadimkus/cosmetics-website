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

    // Get all orders
    const orders = await prisma.order.findMany({
      where: {
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
        status: { not: 'CANCELLED' }
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Revenue by day
    const revenueByDayMap = new Map<string, { revenue: number; orders: number }>()
    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0] || order.createdAt.toISOString().substring(0, 10)
      const existing = revenueByDayMap.get(dateKey) || { revenue: 0, orders: 0 }
      revenueByDayMap.set(dateKey, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1
      })
    })
    const revenueByDay = Array.from(revenueByDayMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Revenue by month
    const revenueByMonthMap = new Map<string, { revenue: number; orders: number }>()
    orders.forEach(order => {
      const monthKey = order.createdAt.toISOString().substring(0, 7) // YYYY-MM
      const existing = revenueByMonthMap.get(monthKey) || { revenue: 0, orders: 0 }
      revenueByMonthMap.set(monthKey, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1
      })
    })
    const revenueByMonth = Array.from(revenueByMonthMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Revenue by status
    const revenueByStatusMap = new Map<string, { revenue: number; orders: number }>()
    orders.forEach(order => {
      const existing = revenueByStatusMap.get(order.status) || { revenue: 0, orders: 0 }
      revenueByStatusMap.set(order.status, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1
      })
    })
    const revenueByStatus = Array.from(revenueByStatusMap.entries())
      .map(([status, data]) => ({ status, ...data }))
      .sort((a, b) => b.revenue - a.revenue)

    // Top products
    const productMap = new Map<string, { productName: string; revenue: number; quantity: number; orders: Set<string> }>()
    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.productId) || {
          productName: item.productName,
          revenue: 0,
          quantity: 0,
          orders: new Set<string>()
        }
        existing.revenue += item.price * item.quantity
        existing.quantity += item.quantity
        existing.orders.add(order.id)
        productMap.set(item.productId, existing)
      })
    })
    const topProducts = Array.from(productMap.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.productName,
        revenue: data.revenue,
        quantity: data.quantity,
        orders: data.orders.size
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20)

    // Top customers
    const customerMap = new Map<string, { name: string; revenue: number; orders: number; lastOrderDate: string }>()
    orders.forEach(order => {
      const existing = customerMap.get(order.customerEmail) || {
        name: order.customerName,
        revenue: 0,
        orders: 0,
        lastOrderDate: order.createdAt.toISOString()
      }
      existing.revenue += order.total
      existing.orders += 1
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt.toISOString()
      }
      customerMap.set(order.customerEmail, existing)
    })
    const topCustomers = Array.from(customerMap.entries())
      .map(([email, data]) => ({
        email,
        ...data
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20)

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

