import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'

export async function POST(request: NextRequest) {
  try {
    // Admin-only: leaks aggregate DB stats otherwise
    const auth = await requireAdminAuth(request)
    if (!auth.authorized) {
      return auth.response
    }

    debugLog('🚀 Checking database status (DB-only)...')
    const existingProducts = await prisma.product.count()
    return NextResponse.json({
      success: true,
      message: `Database is active. Products in DB: ${existingProducts}`
    })
  } catch (error) {
    errorLog('Error checking database status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check database status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin-only: leaks user/order/product counts otherwise
    const auth = await requireAdminAuth(request)
    if (!auth.authorized) {
      return auth.response
    }

    const productCount = await prisma.product.count()
    const userCount = await prisma.user.count()
    const orderCount = await prisma.order.count()

    return NextResponse.json({
      success: true,
      database: {
        products: productCount,
        users: userCount,
        orders: orderCount
      }
    })
  } catch (error) {
    errorLog('Error checking database status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check database status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
