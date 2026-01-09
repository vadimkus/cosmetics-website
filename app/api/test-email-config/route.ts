import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireDevelopment } from '@/lib/apiErrorHandler'

export async function GET(request: NextRequest) {
  // Development-only route
  const devCheck = requireDevelopment()
  if (devCheck) return devCheck

  // Require admin authentication
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

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
