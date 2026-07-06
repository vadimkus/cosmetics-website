import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'
import { headers } from 'next/headers'
import { verifySessionToken } from '@/lib/jwt'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'

// Public, unauthenticated tracker → cap per IP to prevent table flooding.
const pdfLimiter = rateLimitSimple({ windowMs: 60 * 60 * 1000, max: 40 })

export async function POST(request: NextRequest) {
  const rl = await pdfLimiter(`pdf:${getClientIdentifierFromNextRequest(request)}`)
  if (!rl.success) {
    return NextResponse.json({ error: rl.message || 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { filename } = body

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    // Identity is derived from the session cookie, NOT the request body —
    // otherwise anyone could associate arbitrary emails with download events.
    let userId: string | null = null
    let userEmail: string | null = null
    const sessionCookie = request.cookies.get('genosys_session')
    if (sessionCookie?.value) {
      const session = verifySessionToken(sessionCookie.value)
      if (session?.id) {
        userId = session.id
        userEmail = session.email || null
      }
    }

    // Get request headers for analytics data
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown'
    const referrer = headersList.get('referer') || ''

    // Extract device and browser info from user agent
    const deviceType = getDeviceType(userAgent)
    const browser = getBrowser(userAgent)
    const os = getOS(userAgent)

    // Create PDF download record
    const pdfDownload = await prisma.pDFDownload.create({
      data: {
        filename,
        userId: userId || null,
        userEmail: userEmail || null,
        ipAddress,
        userAgent,
        country: null, // Could be enhanced with IP geolocation
        city: null,
        deviceType,
        browser,
        os,
        referrer
      }
    })

    debugLog(`📄 PDF download tracked: ${filename} by ${userEmail || 'anonymous'}`)

    return NextResponse.json({ 
      success: true, 
      downloadId: pdfDownload.id 
    })

  } catch (error) {
    errorLog('Error tracking PDF download:', error)
    return NextResponse.json(
      { error: 'Failed to track PDF download' },
      { status: 500 }
    )
  }
}

// Helper functions to extract device info from user agent
function getDeviceType(userAgent: string): string {
  if (/mobile|android|iphone|ipad|tablet/i.test(userAgent)) {
    return 'Mobile'
  }
  if (/tablet|ipad/i.test(userAgent)) {
    return 'Tablet'
  }
  return 'Desktop'
}

function getBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'Unknown'
}

function getOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS')) return 'iOS'
  return 'Unknown'
}
