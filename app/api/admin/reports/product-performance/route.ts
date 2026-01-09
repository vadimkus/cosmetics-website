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

    // Optimize: Use database aggregation for order items with single query
    // Only count DELIVERED orders for accurate sales reporting
    const orderItemsAggregation = await prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      where: {
        order: {
          ...(startDate ? { createdAt: { gte: startDate } } : {}),
          status: 'DELIVERED'
        }
      },
      _sum: {
        quantity: true,
        price: true
      },
      _count: {
        orderId: true
      }
    })

    // Optimize: Use database aggregation for product views with single query
    const productViewsAggregation = await prisma.pageView.groupBy({
      by: ['page'],
      where: {
        ...(startDate ? { timestamp: { gte: startDate } } : {}),
        page: { startsWith: '/products/' }
      },
      _count: {
        id: true
      }
    })

    // Optimize: Get distinct order counts per product with single query
    // Only count DELIVERED orders for accurate sales reporting
    const orderCountsQuery = startDate 
      ? await prisma.$queryRaw<Array<{
          productId: string
          uniqueOrders: number
        }>>`
          SELECT 
            oi."productId",
            COUNT(DISTINCT oi."orderId") as "uniqueOrders"
          FROM "order_items" oi
          JOIN "orders" o ON o.id = oi."orderId"
          WHERE o.status = 'DELIVERED' AND o."createdAt" >= ${startDate}
          GROUP BY oi."productId"
        `
      : await prisma.$queryRaw<Array<{
          productId: string
          uniqueOrders: number
        }>>`
          SELECT 
            oi."productId",
            COUNT(DISTINCT oi."orderId") as "uniqueOrders"
          FROM "order_items" oi
          JOIN "orders" o ON o.id = oi."orderId"
          WHERE o.status = 'DELIVERED'
          GROUP BY oi."productId"
        `

    const orderCountsMap = new Map(
      orderCountsQuery.map(item => [item.productId, Number(item.uniqueOrders)])
    )

    // Process aggregated data efficiently
    const productMap = new Map<string, {
      productName: string
      totalRevenue: number
      totalQuantity: number
      totalOrders: number
      views: number
    }>()

    // Process order items aggregation
    orderItemsAggregation.forEach(item => {
      const revenue = (item._sum.price || 0) * (item._sum.quantity || 0)
      productMap.set(item.productId, {
        productName: item.productName || 'Unknown',
        totalRevenue: revenue,
        totalQuantity: item._sum.quantity || 0,
        totalOrders: orderCountsMap.get(item.productId) || 0,
        views: 0
      })
    })

    // Process views aggregation
    productViewsAggregation.forEach(view => {
      const productIdMatch = view.page.match(/\/products\/(\d+)/)
      if (productIdMatch && productIdMatch[1]) {
        const productId = productIdMatch[1]
        const existing = productMap.get(productId)
        if (existing) {
          existing.views = view._count.id || 0
        } else {
          productMap.set(productId, {
            productName: '',
            totalRevenue: 0,
            totalQuantity: 0,
            totalOrders: 0,
            views: view._count.id || 0
          })
        }
      }
    })

    // Optimize: Single query for product details only for products we need
    const productIds = Array.from(productMap.keys())
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
      select: {
        id: true,
        name: true,
        category: true,
        price: true
      }
    })

    const productDetailsMap = new Map(products.map(p => [p.id, p]))

    // Build optimized performance array
    const performance = Array.from(productMap.entries())
      .map(([productId, data]) => {
        const productDetails = productDetailsMap.get(productId)
        const averagePrice = data.totalQuantity > 0 ? data.totalRevenue / data.totalQuantity : (productDetails?.price || 0)
        const conversionRate = data.views > 0 ? (data.totalOrders / data.views) * 100 : 0

        return {
          productId,
          productName: productDetails?.name || data.productName || 'Unknown',
          category: productDetails?.category || 'Uncategorized',
          totalRevenue: data.totalRevenue,
          totalQuantity: data.totalQuantity,
          totalOrders: data.totalOrders,
          averagePrice,
          conversionRate,
          views: data.views
        }
      })
      .filter(p => p.totalOrders > 0 || p.views > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)

    return NextResponse.json({ products: performance })
  } catch (error) {
    errorLog('Error fetching product performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product performance' },
      { status: 500 }
    )
  }
}

