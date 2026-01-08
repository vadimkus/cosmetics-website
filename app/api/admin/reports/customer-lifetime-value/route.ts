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
    const daysParam = searchParams.get('days') || 'all'
    const days = daysParam === 'all' ? null : (Number.isNaN(parseInt(daysParam)) ? null : parseInt(daysParam))
    
    const startDate = days === null ? null : (() => {
      const date = new Date()
      date.setDate(date.getDate() - days)
      return date
    })()

    // Get only completed orders (PAID, SHIPPED, DELIVERED)
    // Exclude PENDING, CANCELLED, and any other incomplete statuses
    const completedStatuses = ['PAID', 'SHIPPED', 'DELIVERED']
    
    const orders = await prisma.order.findMany({
      where: {
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
        status: { in: completedStatuses }
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Calculate customer lifetime value
    const customerMap = new Map<string, {
      name: string
      email: string
      totalRevenue: number
      totalOrders: number
      firstOrderDate: string
      lastOrderDate: string
    }>()

    orders.forEach(order => {
      const existing = customerMap.get(order.customerEmail) || {
        name: order.customer.name || order.customerName,
        email: order.customerEmail,
        totalRevenue: 0,
        totalOrders: 0,
        firstOrderDate: order.createdAt.toISOString(),
        lastOrderDate: order.createdAt.toISOString()
      }
      
      existing.totalRevenue += order.total
      existing.totalOrders += 1
      
      if (new Date(order.createdAt) < new Date(existing.firstOrderDate)) {
        existing.firstOrderDate = order.createdAt.toISOString()
      }
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt.toISOString()
      }
      
      customerMap.set(order.customerEmail, existing)
    })

    const now = new Date()
    const customers = Array.from(customerMap.values())
      .map(customer => {
        const averageOrderValue = customer.totalOrders > 0 ? customer.totalRevenue / customer.totalOrders : 0
        const daysSinceFirstOrder = Math.floor((now.getTime() - new Date(customer.firstOrderDate).getTime()) / (1000 * 60 * 60 * 24))
        const daysSinceLastOrder = Math.floor((now.getTime() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
        
        // Calculate lifetime value (total revenue + projected future value based on average order frequency)
        // Simple calculation: assume customer continues ordering at same rate
        const daysActive = Math.max(daysSinceFirstOrder, 1)
        const ordersPerDay = customer.totalOrders / daysActive
        const projectedDays = 365 // Project for next year
        const projectedOrders = ordersPerDay * projectedDays
        const projectedRevenue = projectedOrders * averageOrderValue
        const lifetimeValue = customer.totalRevenue + (projectedRevenue * 0.5) // Discount future value by 50%

        return {
          email: customer.email,
          name: customer.name,
          totalRevenue: customer.totalRevenue,
          totalOrders: customer.totalOrders,
          averageOrderValue,
          firstOrderDate: customer.firstOrderDate,
          lastOrderDate: customer.lastOrderDate,
          daysSinceFirstOrder,
          daysSinceLastOrder,
          lifetimeValue
        }
      })
      .filter(c => c.totalOrders > 0)
      .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
      .slice(0, 100) // Top 100 customers

    return NextResponse.json({ customers })
  } catch (error) {
    errorLog('Error fetching customer lifetime value:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer lifetime value' },
      { status: 500 }
    )
  }
}

