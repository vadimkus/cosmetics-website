import { NextRequest, NextResponse } from 'next/server'
import { trackPageView, trackUserAction } from '@/lib/analytics'
import { getGeolocationData } from '@/lib/geolocation'
import { parseUserAgent } from '@/lib/deviceDetection'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Get referrer
    const referrer = request.headers.get('referer') || 'unknown'

    if (type === 'pageview') {
      // Get geolocation data from IP address (includes country and city)
      const geolocationData = await getGeolocationData(ip)
      
      // Parse device information from user agent
      const deviceInfo = parseUserAgent(userAgent)
      
      await trackPageView({
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
        screenHeight: data.screenHeight
      })
    } else if (type === 'action') {
      await trackUserAction(data)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}
