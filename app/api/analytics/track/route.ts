import { NextRequest, NextResponse } from 'next/server'
import { trackPageViewToDatabase, trackUserSession } from '@/lib/analytics'
import { errorLog } from '@/lib/logger'
import { trackUserAction } from '@/lib/analyticsServer'
import { getGeolocationData } from '@/lib/geolocation'
import { parseUserAgent } from '@/lib/deviceDetection'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = (forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip')) || 'unknown'

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Get referrer
    const referrer = request.headers.get('referer') || 'unknown'

    if (type === 'pageview') {
      // Get geolocation data from IP address (includes country and city)
      const geolocationData = await getGeolocationData(ip || '127.0.0.1')
      
      // Parse device information from user agent
      const deviceInfo = parseUserAgent(userAgent)
      
      // Get user email from session cookie if available
      let userEmail = data.userEmail
      if (!userEmail) {
        try {
          const sessionCookie = request.cookies.get('genosys_session')
          if (sessionCookie) {
            const sessionData = JSON.parse(sessionCookie.value)
            userEmail = sessionData.email || null
          }
        } catch (error) {
          // Ignore parsing errors
        }
      }
      
      // Get or create session ID from cookie
      let sessionId = request.cookies.get('genosys_session_id')?.value
      if (!sessionId) {
        sessionId = randomBytes(16).toString('hex')
      }
      
      // Track page view
      await trackPageViewToDatabase({
        ...data,
        ipAddress: ip,
        country: geolocationData?.country,
        city: geolocationData?.city,
        userAgent,
        referrer,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        screenWidth: data.screenWidth,
        screenHeight: data.screenHeight,
        userEmail
      })
      
      // Track session
      await trackUserSession({
        sessionId,
        ipAddress: ip || 'unknown',
        ...(geolocationData?.country && { country: geolocationData.country }),
        ...(deviceInfo.deviceType && { deviceType: deviceInfo.deviceType }),
        ...(deviceInfo.browser && { browser: deviceInfo.browser }),
        ...(deviceInfo.os && { os: deviceInfo.os }),
        ...(data.screenWidth && { screenWidth: data.screenWidth }),
        ...(data.screenHeight && { screenHeight: data.screenHeight }),
        ...(userEmail && { userEmail }),
        ...(referrer && referrer !== 'unknown' && { referrer })
      })
      
      // Set session ID cookie (30 minutes expiration)
      const response = NextResponse.json({ success: true })
      response.cookies.set('genosys_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 60, // 30 minutes
        path: '/',
      })
      return response
    } else if (type === 'action') {
      await trackUserAction(data)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    errorLog('Error tracking analytics:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}
