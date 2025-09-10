'use client'

import { useEffect, useState } from 'react'

interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  isOnline: boolean
  registration: ServiceWorkerRegistration | null
  error: string | null
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isOnline: navigator.onLine,
    registration: null,
    error: null,
  })

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

        console.log('Service Worker registered successfully:', registration)

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, prompt user to refresh
                if (confirm('New version available! Refresh to update?')) {
                  window.location.reload()
                }
              }
            })
          }
        })

      } catch (error) {
        console.error('Service Worker registration failed:', error)
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Registration failed',
        }))
      }
    }

    // Handle online/offline events
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Register service worker
    registerSW()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Manual update check
  const checkForUpdates = async () => {
    if (state.registration) {
      try {
        await state.registration.update()
      } catch (error) {
        console.error('Failed to check for updates:', error)
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
        console.error('Failed to unregister service worker:', error)
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
      console.log('All caches cleared')
    } catch (error) {
      console.error('Failed to clear caches:', error)
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
      console.error('Failed to get cache status:', error)
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
