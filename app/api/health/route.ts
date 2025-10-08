import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🏥 Health check: Testing database connection...')
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Test products table
    const productCount = await prisma.product.count()
    console.log(`✅ Products table accessible: ${productCount} products found`)
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      products: productCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}