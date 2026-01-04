'use client'

import { useState, useEffect, useCallback } from 'react'
import { debugLog, errorLog, warnLog } from '@/lib/logger'

export interface StorageQuotaStatus {
  supported: boolean
  usage: number
  quota: number
  percentUsed: number
  available: number
  usageFormatted: string
  quotaFormatted: string
  availableFormatted: string
  error?: string
}

export interface UseStorageQuotaReturn {
  status: StorageQuotaStatus | null
  isLoading: boolean
  error: string | null
  checkQuota: () => Promise<void>
  clearOldCaches: () => Promise<void>
  isWarning: boolean
  isCritical: boolean
}

const QUOTA_WARNING_THRESHOLD = 0.8 // 80%
const QUOTA_CRITICAL_THRESHOLD = 0.9 // 90%

export function useStorageQuota(): UseStorageQuotaReturn {
  const [status, setStatus] = useState<StorageQuotaStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkQuota = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if Storage API is supported
      if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
        debugLog('Storage API not supported')
        setStatus({
          supported: false,
          usage: 0,
          quota: 0,
          percentUsed: 0,
          available: 0,
          usageFormatted: '0 Bytes',
          quotaFormatted: '0 Bytes',
          availableFormatted: '0 Bytes',
          error: 'Storage API not supported'
        })
        return
      }

      // Get storage estimate
      const estimate = await navigator.storage.estimate()
      const usage = estimate.usage || 0
      const quota = estimate.quota || 0
      const percentUsed = quota > 0 ? (usage / quota) : 0
      const available = quota - usage

      const newStatus: StorageQuotaStatus = {
        supported: true,
        usage,
        quota,
        percentUsed,
        available,
        usageFormatted: formatBytes(usage),
        quotaFormatted: formatBytes(quota),
        availableFormatted: formatBytes(available)
      }

      setStatus(newStatus)

      // Log warnings if needed
      if (percentUsed >= QUOTA_CRITICAL_THRESHOLD) {
        warnLog(`Storage quota critical: ${(percentUsed * 100).toFixed(2)}%`)
      } else if (percentUsed >= QUOTA_WARNING_THRESHOLD) {
        warnLog(`Storage quota warning: ${(percentUsed * 100).toFixed(2)}%`)
      }

      debugLog('Storage quota checked:', newStatus)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check storage quota'
      errorLog('Storage quota check failed:', err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearOldCaches = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if service worker is available
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported')
      }

      const registration = await navigator.serviceWorker.ready

      if (!registration.active) {
        throw new Error('No active service worker')
      }

      // Send message to service worker to clear caches
      const messageChannel = new MessageChannel()
      
      const response = await new Promise<{ success: boolean }>((resolve, reject) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.success) {
            resolve(event.data)
          } else {
            reject(new Error('Cache cleanup failed'))
          }
        }

        registration.active!.postMessage(
          { type: 'CLEAR_OLD_CACHES' },
          [messageChannel.port2]
        )

        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Cache cleanup timeout')), 10000)
      })

      if (response.success) {
        debugLog('Old caches cleared successfully')
        // Re-check quota after cleanup
        await checkQuota()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear caches'
      errorLog('Cache cleanup failed:', err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [checkQuota])

  // Check quota on mount
  useEffect(() => {
    checkQuota()
  }, [checkQuota])

  // Periodic quota check (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      checkQuota()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [checkQuota])

  const isWarning = status ? status.percentUsed >= QUOTA_WARNING_THRESHOLD : false
  const isCritical = status ? status.percentUsed >= QUOTA_CRITICAL_THRESHOLD : false

  return {
    status,
    isLoading,
    error,
    checkQuota,
    clearOldCaches,
    isWarning,
    isCritical
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}


