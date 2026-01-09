import { errorLog, debugLog } from '@/lib/logger'
import { prisma } from './prisma'
import { NextRequest } from 'next/server'

interface RateLimitOptions {
  windowMs: number
  max: number
  message?: string
  /** Use in-memory only (faster, but resets on server restart). Default: false (hybrid mode) */
  memoryOnly?: boolean
}

interface RateLimitResult {
  success: boolean
  message?: string
  count?: number
  resetTime?: number
}

interface InMemoryEntry {
  count: number
  resetTime: number
}

// In-memory cache for fast rate limiting
// Note: This resets on server restart, but provides sub-millisecond performance
const inMemoryCache = new Map<string, InMemoryEntry>()

// Periodic cleanup interval (every 5 minutes)
let cleanupInterval: NodeJS.Timeout | null = null

function startCleanupInterval() {
  if (cleanupInterval) return
  
  cleanupInterval = setInterval(() => {
    const now = Date.now()
    let cleaned = 0
    const keysToDelete: string[] = []
    
    // Collect keys to delete (avoiding iterator issues)
    inMemoryCache.forEach((entry, key) => {
      if (entry.resetTime < now) {
        keysToDelete.push(key)
      }
    })
    
    // Delete expired entries
    keysToDelete.forEach(key => {
      inMemoryCache.delete(key)
      cleaned++
    })
    
    if (cleaned > 0) {
      debugLog(`[RateLimit] Cleaned ${cleaned} expired entries from memory cache`)
    }
  }, 5 * 60 * 1000) // 5 minutes
  
  // Don't prevent process exit
  if (cleanupInterval.unref) {
    cleanupInterval.unref()
  }
}

// Start cleanup on module load
startCleanupInterval()

/**
 * Fast in-memory rate limiting with optional database persistence
 * 
 * Performance modes:
 * - memoryOnly: true  -> ~0.1ms per check (fastest, resets on restart)
 * - memoryOnly: false -> ~0.1ms for cached, falls back to DB for persistence
 */
export function rateLimitSimple(options: RateLimitOptions) {
  const { windowMs, max, message = 'Too many requests', memoryOnly = false } = options

  return async (identifier: string): Promise<RateLimitResult> => {
    const now = Date.now()
    const newResetTime = now + windowMs

    // Step 1: Check in-memory cache first (fast path)
    const cached = inMemoryCache.get(identifier)
    
    if (cached && cached.resetTime > now) {
      // Cache hit - increment in memory
      cached.count++
      
      if (cached.count > max) {
        return {
          success: false,
          message,
          count: cached.count,
          resetTime: cached.resetTime
        }
      }
      
      // Async sync to database in background (non-blocking) for hybrid mode
      if (!memoryOnly) {
        syncToDatabase(identifier, cached.count, new Date(cached.resetTime)).catch(err => {
          debugLog('[RateLimit] Background DB sync error (non-blocking):', err)
        })
      }
      
      return {
        success: true,
        count: cached.count,
        resetTime: cached.resetTime
      }
    }

    // Step 2: Cache miss or expired - create new entry
    const newEntry: InMemoryEntry = {
      count: 1,
      resetTime: newResetTime
    }
    inMemoryCache.set(identifier, newEntry)
    
    // For memory-only mode, we're done
    if (memoryOnly) {
      return {
        success: true,
        count: 1,
        resetTime: newResetTime
      }
    }

    // Step 3: Hybrid mode - check database for existing rate limit (in case of server restart)
    try {
      const dbEntry = await prisma.rateLimit.findUnique({
        where: { identifier }
      })

      if (dbEntry && dbEntry.resetTime.getTime() > now) {
        // DB has valid entry - sync to memory and use DB count
        const dbCount = dbEntry.count + 1
        newEntry.count = dbCount
        newEntry.resetTime = dbEntry.resetTime.getTime()
        inMemoryCache.set(identifier, newEntry)

        // Update DB count
        prisma.rateLimit.update({
          where: { identifier },
          data: { count: { increment: 1 } }
        }).catch(err => {
          debugLog('[RateLimit] DB update error (non-blocking):', err)
        })

        if (dbCount > max) {
          return {
            success: false,
            message,
            count: dbCount,
            resetTime: newEntry.resetTime
          }
        }

        return {
          success: true,
          count: dbCount,
          resetTime: newEntry.resetTime
        }
      }

      // No valid DB entry - create new one in background
      prisma.rateLimit.upsert({
        where: { identifier },
        update: { count: 1, resetTime: new Date(newResetTime) },
        create: { identifier, count: 1, resetTime: new Date(newResetTime) }
      }).catch(err => {
        debugLog('[RateLimit] DB upsert error (non-blocking):', err)
      })

      // Clean up old entries periodically (non-blocking)
      if (Math.random() < 0.01) { // 1% chance to trigger cleanup
        prisma.rateLimit.deleteMany({
          where: { resetTime: { lt: new Date() } }
        }).catch(err => {
          debugLog('[RateLimit] DB cleanup error (non-blocking):', err)
        })
      }

      return {
        success: true,
        count: 1,
        resetTime: newResetTime
      }

    } catch (error) {
      errorLog('[RateLimit] Database error, using memory-only:', error)
      // Database failed - continue with in-memory rate limiting
      // This is safer than failing completely
      return {
        success: true,
        count: newEntry.count,
        resetTime: newEntry.resetTime
      }
    }
  }
}

/**
 * Sync rate limit count to database (non-blocking)
 */
async function syncToDatabase(identifier: string, count: number, resetTime: Date): Promise<void> {
  await prisma.rateLimit.upsert({
    where: { identifier },
    update: { count, resetTime },
    create: { identifier, count, resetTime }
  })
}

/**
 * Get statistics about the in-memory rate limit cache
 */
export function getRateLimitStats(): { entries: number; memoryUsage: string } {
  const entries = inMemoryCache.size
  // Rough estimate: ~100 bytes per entry
  const memoryBytes = entries * 100
  const memoryUsage = memoryBytes < 1024 
    ? `${memoryBytes} B` 
    : memoryBytes < 1024 * 1024 
      ? `${(memoryBytes / 1024).toFixed(1)} KB`
      : `${(memoryBytes / 1024 / 1024).toFixed(2)} MB`
  
  return { entries, memoryUsage }
}

/**
 * Clear all in-memory rate limit entries (for testing)
 */
export function clearRateLimitCache(): void {
  inMemoryCache.clear()
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
