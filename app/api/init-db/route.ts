import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function POST(_request: NextRequest) {
  try {
    console.log('🚀 Checking database status (DB-only)...')
    const existingProducts = await prisma.product.count()
    return NextResponse.json({
      success: true,
      message: `Database is active. Products in DB: ${existingProducts}`
    })
  } catch (error) {
    console.error('Error checking database status:', error)
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

export async function GET(_request: NextRequest) {
  try {
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
    console.error('Error checking database status:', error)
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
