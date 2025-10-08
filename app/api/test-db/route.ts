import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('🔍 DATABASE_URL length:', process.env.DATABASE_URL?.length)
    
    // Create a new Prisma client with explicit configuration
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      log: ['query', 'error', 'warn']
    })
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database query successful:', result)
    
    // Test products table
    const productCount = await prisma.product.count()
    console.log('✅ Products table accessible:', productCount)
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      productCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
