import { errorLog } from '@/lib/logger'
import { prisma } from './prisma'
import { NextRequest } from 'next/server'

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

      // Check if rate limit entry exists first (faster path)
      const existingEntry = await prisma.rateLimit.findUnique({
        where: { identifier }
      })
      
      // Only clean up old entries if the entry doesn't exist or is expired
      // This avoids expensive cleanup on every request
      if (!existingEntry || existingEntry.resetTime < now) {
        // Clean up old entries (async, don't wait for completion)
        prisma.rateLimit.deleteMany({
          where: {
            resetTime: {
              lt: now
            }
          }
        }).catch(error => {
          errorLog('Rate limit cleanup error (non-blocking):', error)
        })
      }

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
    } catch {
      errorLog('Rate limiting error:', error)
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
export function getClientIdentifierFromNextRequest(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // Add user agent to make identifier more unique
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const identifier = `${ip}-${Buffer.from(userAgent).toString('base64').slice(0, 10)}`
  
  return identifier
}
