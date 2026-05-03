import { debugLog, errorLog } from '@/lib/logger'

// Server-side page view tracking for database.
export const trackPageViewToDatabase = async (data: {
  page: string;
  ipAddress: string;
  country?: string;
  city?: string;
  userAgent: string;
  referrer?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  screenWidth?: number;
  screenHeight?: number;
  userEmail?: string;
}) => {
  try {
    const { prisma } = await import('./prisma')

    await prisma.pageView.create({
      data: {
        page: data.page,
        ipAddress: data.ipAddress,
        country: data.country || null,
        city: data.city || null,
        userAgent: data.userAgent,
        referrer: data.referrer || null,
        deviceType: data.deviceType || null,
        browser: data.browser || null,
        os: data.os || null,
        screenWidth: data.screenWidth || null,
        screenHeight: data.screenHeight || null,
        userEmail: data.userEmail || null,
        timestamp: new Date(),
      },
    })

    debugLog('✅ Page view stored in database:', data.page)
  } catch (error) {
    errorLog('❌ Error storing page view:', error)
  }
}

// Track user session in database.
export const trackUserSession = async (data: {
  sessionId: string;
  ipAddress: string;
  country?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  screenWidth?: number;
  screenHeight?: number;
  userEmail?: string;
  referrer?: string;
}) => {
  try {
    const { prisma } = await import('./prisma')

    // Check if session exists and is still active (within last 30 minutes)
    const thirtyMinutesAgo = new Date()
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30)

    const existingSession = await prisma.userSession.findUnique({
      where: { sessionId: data.sessionId },
    })

    if (existingSession && existingSession.startTime >= thirtyMinutesAgo && !existingSession.endTime) {
      // Update existing active session
      const now = new Date()
      const duration = Math.floor((now.getTime() - existingSession.startTime.getTime()) / 1000)
      const newPageViews = existingSession.pageViews + 1

      await prisma.userSession.update({
        where: { sessionId: data.sessionId },
        data: {
          pageViews: newPageViews,
          duration,
          isBounce: newPageViews <= 1,
          deviceType: existingSession.deviceType || data.deviceType || null,
          browser: existingSession.browser || data.browser || null,
          os: existingSession.os || data.os || null,
          screenWidth: existingSession.screenWidth || data.screenWidth || null,
          screenHeight: existingSession.screenHeight || data.screenHeight || null,
        },
      })

      debugLog('✅ Session updated:', data.sessionId, 'pageViews:', newPageViews, 'duration:', duration)
    } else {
      // Create new session
      const newSession = await prisma.userSession.create({
        data: {
          sessionId: data.sessionId,
          ipAddress: data.ipAddress,
          country: data.country || null,
          deviceType: data.deviceType || null,
          browser: data.browser || null,
          os: data.os || null,
          screenWidth: data.screenWidth || null,
          screenHeight: data.screenHeight || null,
          userEmail: data.userEmail || null,
          referrer: data.referrer || null,
          pageViews: 1,
          isBounce: true,
          startTime: new Date(),
        },
      })

      debugLog('✅ New session created:', data.sessionId, 'ID:', newSession.id)
    }
  } catch (error) {
    errorLog('❌ Error tracking session:', error)
    if (error instanceof Error) {
      errorLog('Error details:', error.message, error.stack)
    }
  }
}
