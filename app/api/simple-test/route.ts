import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Simple environment test...')
    console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('🔍 PRISMA_DATABASE_URL exists:', !!process.env.PRISMA_DATABASE_URL)
    console.log('🔍 DATABASE_URL length:', process.env.DATABASE_URL?.length)
    console.log('🔍 PRISMA_DATABASE_URL length:', process.env.PRISMA_DATABASE_URL?.length)
    console.log('🔍 DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20))
    console.log('🔍 PRISMA_DATABASE_URL starts with:', process.env.PRISMA_DATABASE_URL?.substring(0, 20))
    
    // Test if we can parse the URLs
    let parsedUrl, parsedPrismaUrl
    try {
      parsedUrl = new URL(process.env.DATABASE_URL || '')
      console.log('✅ DATABASE_URL parsing successful')
    } catch (urlError) {
      console.error('❌ DATABASE_URL parsing failed:', urlError)
    }
    
    try {
      parsedPrismaUrl = new URL(process.env.PRISMA_DATABASE_URL || '')
      console.log('✅ PRISMA_DATABASE_URL parsing successful')
    } catch (urlError) {
      console.error('❌ PRISMA_DATABASE_URL parsing failed:', urlError)
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Environment test completed',
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasPrismaDatabaseUrl: !!process.env.PRISMA_DATABASE_URL,
      urlLength: process.env.DATABASE_URL?.length,
      prismaUrlLength: process.env.PRISMA_DATABASE_URL?.length,
      urlStart: process.env.DATABASE_URL?.substring(0, 20),
      prismaUrlStart: process.env.PRISMA_DATABASE_URL?.substring(0, 20),
      parsedUrl: parsedUrl ? {
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        pathname: parsedUrl.pathname
      } : null,
      parsedPrismaUrl: parsedPrismaUrl ? {
        protocol: parsedPrismaUrl.protocol,
        hostname: parsedPrismaUrl.hostname,
        port: parsedPrismaUrl.port,
        pathname: parsedPrismaUrl.pathname
      } : null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Simple test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Simple test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
