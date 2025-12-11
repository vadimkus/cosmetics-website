import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER
    
    return NextResponse.json({
      success: true,
      adminEmail: adminEmail || 'NOT_SET',
      environment: {
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'NOT_SET',
        GMAIL_USER: process.env.GMAIL_USER || 'NOT_SET', 
        EMAIL_USER: process.env.EMAIL_USER || 'NOT_SET'
      },
      resolved: adminEmail || 'NO_EMAIL_CONFIGURED'
    })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to check admin email configuration' },
      { status: 500 }
    )
  }
}
