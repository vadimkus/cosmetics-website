'use client'
import { debugLog, errorLog } from '@/lib/logger'

import { useEffect, useState, useRef } from 'react'

interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  isOnline: boolean
  registration: ServiceWorkerRegistration | null
  error: string | null
}

// Helper to defer execution until browser is idle
const deferUntilIdle = (callback: () => void): number | NodeJS.Timeout => {
  if ('requestIdleCallback' in window) {
    return (window as typeof window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(callback, { timeout: 2000 })
  }
  // Fallback for Safari and older browsers
  return setTimeout(callback, 1000)
}

const cancelIdleCallback = (id: number | NodeJS.Timeout) => {
  if ('cancelIdleCallback' in window) {
    (window as typeof window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id as number)
  } else {
    clearTimeout(id as NodeJS.Timeout)
  }
}

/**
 * Register periodic background sync if supported
 * 
 * Periodic Background Sync allows the PWA to periodically sync content
 * in the background, even when the app is not open. This is useful for:
 * - Keeping products up to date
 * - Refreshing promotional content
 * - Pre-caching new content
 * 
 * Browser heuristics determine actual sync frequency based on:
 * - Site engagement level
 * - Network conditions
 * - Battery status
 * - User preferences
 */
async function registerPeriodicSync(registration: ServiceWorkerRegistration) {
  // Check if periodic sync is supported
  if (!('periodicSync' in registration)) {
    debugLog('Periodic Background Sync not supported')
    return
  }

  try {
    // Check permission status
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync' as PermissionName,
    })

    if (status.state !== 'granted') {
      // debugLog('Periodic Background Sync permission not granted:', status.state)
      return
    }

    // Type assertion for periodic sync
    const periodicSyncManager = (registration as ServiceWorkerRegistration & {
      periodicSync: {
        register: (tag: string, options: { minInterval: number }) => Promise<void>
        getTags: () => Promise<string[]>
      }
    }).periodicSync

    // Check if already registered
    const tags = await periodicSyncManager.getTags()
    
    // Register content sync (every 12 hours minimum)
    if (!tags.includes('content-sync')) {
      await periodicSyncManager.register('content-sync', {
        minInterval: 12 * 60 * 60 * 1000 // 12 hours
      })
      debugLog('✅ Registered periodic sync: content-sync (12h interval)')
    }

    // Register products update (every 24 hours minimum)
    if (!tags.includes('products-update')) {
      await periodicSyncManager.register('products-update', {
        minInterval: 24 * 60 * 60 * 1000 // 24 hours
      })
      debugLog('✅ Registered periodic sync: products-update (24h interval)')
    }

  } catch (error) {
    // Periodic sync may fail due to lack of engagement or other browser heuristics
    debugLog('Periodic Background Sync registration failed (this is normal for new installs):', error)
  }
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    registration: null,
    error: null,
  })
  
  const idleCallbackRef = useRef<number | NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      setState(prev => ({ ...prev, isSupported: false }))
      return
    }

    setState(prev => ({ ...prev, isSupported: true }))

    // Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration,
          error: null,
        }))

        // debugLog('Service Worker registered successfully:', registration)

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, dispatch custom event
                debugLog('New service worker installed, dispatching update event')
                window.dispatchEvent(new CustomEvent('sw-update-available', {
                  detail: { registration }
                }))
              }
            })
          }
        })

        // Register periodic background sync (if supported)
        await registerPeriodicSync(registration)

      } catch (error) {
        errorLog('Service Worker registration failed:', error)
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Registration failed',
        }))
      }
    }

    // Deferred registration - wait for page load, then idle time
    const deferredRegister = () => {
      // debugLog('Deferring service worker registration until idle...')
      idleCallbackRef.current = deferUntilIdle(() => {
        // debugLog('Browser idle, registering service worker...')
        registerSW()
      })
    }

    // Handle online/offline events
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Wait for window.load before deferring registration
    // This ensures we don't impact FCP/LCP metrics
    if (document.readyState === 'complete') {
      // Page already loaded, defer registration
      deferredRegister()
    } else {
      // Wait for page to fully load
      const handleLoad = () => {
        // debugLog('Page loaded, scheduling deferred SW registration...')
        deferredRegister()
      }
      window.addEventListener('load', handleLoad)
      
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        window.removeEventListener('load', handleLoad)
        if (idleCallbackRef.current) {
          cancelIdleCallback(idleCallbackRef.current)
        }
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current)
      }
    }
  }, [])

  // Manual update check
  const checkForUpdates = async () => {
    if (state.registration) {
      try {
        await state.registration.update()
      } catch (error) {
        errorLog('Failed to check for updates:', error)
      }
    }
  }

  // Unregister service worker
  const unregister = async () => {
    if (state.registration) {
      try {
        await state.registration.unregister()
        setState(prev => ({
          ...prev,
          isRegistered: false,
          registration: null,
        }))
      } catch (error) {
        errorLog('Failed to unregister service worker:', error)
      }
    }
  }

  // Clear all caches
  const clearCaches = async () => {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      debugLog('All caches cleared')
    } catch (error) {
      errorLog('Failed to clear caches:', error)
    }
  }

  // Get cache status
  const getCacheStatus = async () => {
    try {
      const cacheNames = await caches.keys()
      const cacheStatus = await Promise.all(
        cacheNames.map(async (cacheName) => {
          const cache = await caches.open(cacheName)
          const keys = await cache.keys()
          return {
            name: cacheName,
            size: keys.length,
            keys: keys.map(key => key.url),
          }
        })
      )
      return cacheStatus
    } catch (error) {
      errorLog('Failed to get cache status:', error)
      return []
    }
  }

  return {
    ...state,
    checkForUpdates,
    unregister,
    clearCaches,
    getCacheStatus,
  }
}
