import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Simple environment test...')
    console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('🔍 DATABASE_URL length:', process.env.DATABASE_URL?.length)
    console.log('🔍 DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20))
    
    // Test if we can parse the URL
    let parsedUrl
    try {
      parsedUrl = new URL(process.env.DATABASE_URL || '')
      console.log('✅ URL parsing successful')
    } catch (urlError) {
      console.error('❌ URL parsing failed:', urlError)
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Environment test completed',
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      urlLength: process.env.DATABASE_URL?.length,
      urlStart: process.env.DATABASE_URL?.substring(0, 20),
      parsedUrl: parsedUrl ? {
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        pathname: parsedUrl.pathname
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
