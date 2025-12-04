'use client'

import { ReactNode, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { useServiceWorkerContext } from '@/components/ServiceWorkerProvider'
import { useTranslation } from '@/hooks/useTranslation'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh?: () => Promise<void> | void
  disabled?: boolean
}

export function PullToRefresh({ children, onRefresh, disabled = false }: PullToRefreshProps) {
  const [isMobile, setIsMobile] = useState(false)
  const { checkForUpdates } = useServiceWorkerContext()
  const { t, dir } = useTranslation()

  // Only enable on mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(isTouchDevice && isSmallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleRefresh = async () => {
    // Check for service worker updates
    try {
      await checkForUpdates()
    } catch (error) {
      console.error('Failed to check for updates:', error)
    }

    // Call custom refresh handler if provided
    if (onRefresh) {
      await onRefresh()
    } else {
      // Default: reload the page
      window.location.reload()
    }
  }

  const { isPulling, isRefreshing, pullDistance, pullProgress } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    resistance: 2.5,
    disabled: disabled || !isMobile,
  })

  // Prevent body scroll when pulling
  useEffect(() => {
    if (isPulling || isRefreshing) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isPulling, isRefreshing])

  const rotation = pullProgress * 180
  const opacity = Math.min(pullProgress * 1.5, 1)
  const scale = 0.5 + pullProgress * 0.5

  return (
    <>
      {/* Pull to refresh indicator */}
      {(isPulling || isRefreshing) && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            transform: `translateY(${Math.min(pullDistance, 80)}px)`,
            transition: isRefreshing ? 'transform 0.3s ease-out' : 'none',
          }}
        >
          <div
            className="flex flex-col items-center justify-center bg-white rounded-full shadow-lg p-4"
            style={{
              opacity,
              transform: `scale(${scale})`,
              transition: isRefreshing ? 'opacity 0.3s, transform 0.3s' : 'none',
            }}
          >
            <RefreshCw
              className={`h-6 w-6 text-primary-600 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isRefreshing ? 'transform 0.3s' : 'none',
              }}
            />
            {pullProgress >= 1 && !isRefreshing && (
              <span className="text-xs text-gray-600 mt-1 whitespace-nowrap" dir={dir}>
                {t('common.releaseToRefresh')}
              </span>
            )}
            {isRefreshing && (
              <span className="text-xs text-gray-600 mt-1 whitespace-nowrap" dir={dir}>
                {t('common.refreshing')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content wrapper with pull effect */}
      <div
        style={{
          transform: isPulling ? `translateY(${Math.min(pullDistance, 80)}px)` : 'translateY(0)',
          transition: isRefreshing ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        {children}
      </div>
    </>
  )
}

