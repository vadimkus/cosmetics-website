import { prisma } from './prisma'

interface RateLimitOptions {
  windowMs: number
  max: number
  message?: string
}

interface RateLimitResult {
  success: boolean
  message?: string
  count?: number
  resetTime?: number
}

export function rateLimitSimple(options: RateLimitOptions) {
  const { windowMs, max, message = 'Too many requests' } = options

  return async (identifier: string): Promise<RateLimitResult> => {
    try {
      const now = new Date()
      const newResetTime = new Date(now.getTime() + windowMs)

      // Clean up old entries
      await prisma.rateLimit.deleteMany({
        where: {
          resetTime: {
            lt: now
          }
        }
      })

      // Check if rate limit entry exists
      const existingEntry = await prisma.rateLimit.findUnique({
        where: { identifier }
      })

      let rateLimitEntry

      if (!existingEntry || existingEntry.resetTime < now) {
        // Entry doesn't exist or is expired - create/reset with new window
        rateLimitEntry = await prisma.rateLimit.upsert({
          where: { identifier },
          update: {
            count: 1,
            resetTime: newResetTime
          },
          create: {
            identifier,
            count: 1,
            resetTime: newResetTime
          }
        })
      } else {
        // Entry exists and is still valid - only increment count, don't update resetTime
        rateLimitEntry = await prisma.rateLimit.update({
          where: { identifier },
          data: {
            count: {
              increment: 1
            }
            // Note: resetTime is NOT updated here - that's the fix!
          }
        })
      }

      // Check if limit exceeded
      if (rateLimitEntry.count > max) {
        return {
          success: false,
          message,
          count: rateLimitEntry.count,
          resetTime: rateLimitEntry.resetTime.getTime()
        }
      }

      return {
        success: true,
        count: rateLimitEntry.count,
        resetTime: rateLimitEntry.resetTime.getTime()
      }
    } catch (error) {
      console.error('Rate limiting error:', error)
      // Fail closed - reject request if rate limiting fails
      // This is more secure than allowing requests through when rate limiting is down
      return {
        success: false,
        message: 'Rate limiting service unavailable. Please try again later.',
        count: 0,
        resetTime: Date.now() + (windowMs)
      }
    }
  }
}

// Helper function to get client identifier from NextRequest
export function getClientIdentifierFromNextRequest(request: any): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // Add user agent to make identifier more unique
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const identifier = `${ip}-${Buffer.from(userAgent).toString('base64').slice(0, 10)}`
  
  return identifier
}
