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

    // Get orders with items
    const orders = await prisma.order.findMany({
      where: {
        ...(startDate ? { createdAt: { gte: startDate } } : {}),
        status: { not: 'CANCELLED' }
      },
      include: {
        items: true
      }
    })

    // Get product views
    const pageViews = await prisma.pageView.findMany({
      where: {
        ...(startDate ? { timestamp: { gte: startDate } } : {}),
        page: { startsWith: '/products/' }
      }
    })

    // Calculate product performance
    const productMap = new Map<string, {
      productName: string
      category: string
      totalRevenue: number
      totalQuantity: number
      totalOrders: Set<string>
      views: number
    }>()

    // Process orders
    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.productId) || {
          productName: item.productName,
          category: '', // Will be filled from product lookup
          totalRevenue: 0,
          totalQuantity: 0,
          totalOrders: new Set<string>(),
          views: 0
        }
        existing.totalRevenue += item.price * item.quantity
        existing.totalQuantity += item.quantity
        existing.totalOrders.add(order.id)
        productMap.set(item.productId, existing)
      })
    })

    // Process views
    pageViews.forEach(view => {
      const productIdMatch = view.page.match(/\/products\/(\d+)/)
      if (productIdMatch && productIdMatch[1]) {
        const productId = productIdMatch[1]
        const existing = productMap.get(productId) || {
          productName: '',
          category: '',
          totalRevenue: 0,
          totalQuantity: 0,
          totalOrders: new Set<string>(),
          views: 0
        }
        existing.views += 1
        productMap.set(productId, existing)
      }
    })

    // Get product details for categories
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

    // Build performance array
    const performance = Array.from(productMap.entries())
      .map(([productId, data]) => {
        const productDetails = productDetailsMap.get(productId)
        const totalOrders = data.totalOrders.size
        const averagePrice = data.totalQuantity > 0 ? data.totalRevenue / data.totalQuantity : (productDetails?.price || 0)
        const conversionRate = data.views > 0 ? (totalOrders / data.views) * 100 : 0

        return {
          productId,
          productName: productDetails?.name || data.productName || 'Unknown',
          category: productDetails?.category || 'Uncategorized',
          totalRevenue: data.totalRevenue,
          totalQuantity: data.totalQuantity,
          totalOrders,
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

