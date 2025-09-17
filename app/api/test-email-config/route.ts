import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const config = {
      gmailUser: process.env.GMAIL_USER ? '✅ Set' : '❌ Missing',
      gmailAppPassword: process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing',
      nodeEnv: process.env.NODE_ENV || 'Not set',
      vercelEnv: process.env.VERCEL_ENV || 'Not set'
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email configuration check',
      config,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
