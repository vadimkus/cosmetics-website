'use client'

import { useState, useEffect } from 'react'
import { X, RefreshCw, Download } from 'lucide-react'
import { debugLog, errorLog } from '@/lib/logger'

interface ServiceWorkerUpdateNotificationProps {
  className?: string
}

export default function ServiceWorkerUpdateNotification({ 
  className = '' 
}: ServiceWorkerUpdateNotificationProps) {
  const [showUpdate, setShowUpdate] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Listen for custom SW update event
    const handleUpdateAvailable = (event: Event) => {
      const customEvent = event as CustomEvent<{ registration: ServiceWorkerRegistration }>
      debugLog('Service Worker update available:', customEvent.detail)
      
      setRegistration(customEvent.detail.registration)
      setShowUpdate(true)
    }

    window.addEventListener('sw-update-available', handleUpdateAvailable)

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable)
    }
  }, [])

  const handleUpdate = async () => {
    if (!registration || !registration.waiting) {
      errorLog('No waiting service worker found')
      return
    }

    setIsUpdating(true)

    try {
      // Send skip waiting message to service worker
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })

      // Listen for controlling service worker change
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        debugLog('New service worker activated, reloading page...')
        window.location.reload()
      })

      debugLog('Update triggered, waiting for new SW to activate...')
    } catch (error) {
      errorLog('Failed to update service worker:', error)
      setIsUpdating(false)
    }
  }

  const handleDismiss = () => {
    setShowUpdate(false)
    debugLog('Service Worker update dismissed by user')
  }

  if (!showUpdate) {
    return null
  }

  return (
    <div 
      className={`fixed top-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 animate-slide-in ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Update Available
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            A new version of the app is ready to install. Update now for the latest features and improvements.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Update now"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Update Now</span>
                </>
              )}
            </button>

            <button
              onClick={handleDismiss}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-lg"
              aria-label="Dismiss update notification"
            >
              Later
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          disabled={isUpdating}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress indicator when updating */}
      {isUpdating && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-progress" />
            </div>
            <span>Applying update...</span>
          </div>
        </div>
      )}
    </div>
  )
}

