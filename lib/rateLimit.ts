import { NextRequest } from 'next/server'

interface RateLimitOptions {
  windowMs: number
  max: number
  message?: string
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, message = 'Too many requests' } = options

  return (request: NextRequest) => {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up expired entries
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })

    // Get or create entry for this IP
    if (!store[ip] || store[ip].resetTime < now) {
      store[ip] = {
        count: 0,
        resetTime: now + windowMs
      }
    }

    // Increment count
    store[ip].count++

    // Check if limit exceeded
    if (store[ip].count > max) {
      return {
        success: false,
        message,
        resetTime: store[ip].resetTime
      }
    }

    return {
      success: true,
      count: store[ip].count,
      resetTime: store[ip].resetTime
    }
  }
}
