import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

export async function GET() {
  try {
    debugLog('🏥 Health check: Testing database connection...')
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    debugLog('✅ Database connection successful')
    
    // Test products table
    const productCount = await prisma.product.count()
    debugLog(`✅ Products table accessible: ${productCount} products found`)
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      products: productCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    errorLog('❌ Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}