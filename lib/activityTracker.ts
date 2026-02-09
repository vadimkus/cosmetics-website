/**
 * User Activity Tracker
 * Tracks user's lastActiveAt timestamp for online status in admin dashboard.
 * 
 * Design principles:
 * - Fail-safe: Never throws, never blocks requests
 * - Throttled: Updates at most once per minute per user
 * - Lightweight: Minimal performance impact
 */

import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

// In-memory throttle map: userId -> last update timestamp
const lastUpdateMap = new Map<string, number>()

// Throttle period in milliseconds (1 minute)
const THROTTLE_MS = 60 * 1000

/**
 * Update user's lastActiveAt timestamp (throttled)
 * Safe to call on every authenticated request - will only update DB once per minute
 * 
 * @param userId - The user ID to update
 * @returns void - Never throws, always resolves
 */
export async function trackUserActivity(userId: string): Promise<void> {
  if (!userId) return

  try {
    const now = Date.now()
    const lastUpdate = lastUpdateMap.get(userId) || 0

    // Skip if updated within throttle period
    if (now - lastUpdate < THROTTLE_MS) {
      return
    }

    // Update throttle map first (optimistic)
    lastUpdateMap.set(userId, now)

    // Clean up old entries periodically (prevent memory leak)
    if (lastUpdateMap.size > 1000) {
      const cutoff = now - THROTTLE_MS * 10 // Keep entries from last 10 minutes
      const entries = Array.from(lastUpdateMap.entries())
      for (const [id, timestamp] of entries) {
        if (timestamp < cutoff) {
          lastUpdateMap.delete(id)
        }
      }
    }

    // Update database (fire and forget - don't await in request path)
    prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() }
    }).catch((err) => {
      // Log but don't throw - activity tracking is non-critical
      debugLog('Activity tracking update failed:', err?.message || err)
    })

  } catch (error) {
    // Never throw - activity tracking is non-critical
    errorLog('Activity tracker error:', error)
  }
}

/**
 * Update user's lastActiveAt timestamp immediately (no throttle)
 * Use for important events like login
 * 
 * @param userId - The user ID to update
 */
export async function trackUserActivityNow(userId: string): Promise<void> {
  if (!userId) return

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() }
    })
    lastUpdateMap.set(userId, Date.now())
  } catch (error) {
    // Log but don't throw
    debugLog('Immediate activity update failed:', error)
  }
}

/**
 * Check if a user is considered "online" based on lastActiveAt
 * Users are considered online if active within the last 5 minutes
 * 
 * @param lastActiveAt - The user's lastActiveAt timestamp
 * @returns boolean - true if user is online
 */
export function isUserOnline(lastActiveAt: Date | null | undefined): boolean {
  if (!lastActiveAt) return false
  
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
  return new Date(lastActiveAt).getTime() > fiveMinutesAgo
}

/**
 * Format last active time for display
 * 
 * @param lastActiveAt - The user's lastActiveAt timestamp
 * @returns Formatted string like "Online", "5 min ago", "2 hours ago", "Yesterday"
 */
export function formatLastActive(lastActiveAt: Date | null | undefined): string {
  if (!lastActiveAt) return 'Never'
  
  const now = Date.now()
  const timestamp = new Date(lastActiveAt).getTime()
  const diffMs = now - timestamp
  const diffMinutes = Math.floor(diffMs / (60 * 1000))
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000))
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))

  if (diffMinutes < 5) return 'Online'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return new Date(lastActiveAt).toLocaleDateString()
}
