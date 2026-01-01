'use client'

import { ReactNode, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { useServiceWorkerContext } from '@/components/ServiceWorkerProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { errorLog } from '@/lib/logger'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh?: () => Promise<void> | void
  disabled?: boolean
}

export function PullToRefresh({ children, onRefresh, disabled = false }: PullToRefreshProps) {
  const { checkForUpdates } = useServiceWorkerContext()
  const { t, dir } = useTranslation()
  const router = useRouter()

  const handleRefresh = async () => {
    // Check for service worker updates
    try {
      await checkForUpdates()
    } catch (error) {
      errorLog('Failed to check for updates:', error)
    }

    // Call custom refresh handler if provided
    if (onRefresh) {
      await onRefresh()
    } else {
      // Use Next.js router.refresh() instead of full page reload
      // This preserves React state and auth context, preventing flash of login page
      router.refresh()
    }
  }

  const { isPulling, isRefreshing, pullDistance, pullProgress, isPWA } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    disabled: disabled,
  })

  // IMPORTANT: Only enable in PWA mode
  // For regular browsers, render children without any pull-to-refresh functionality
  // Prevent body scroll when pulling
  useEffect(() => {
    if (isPWA && (isPulling || isRefreshing)) {
      document.body.style.overflow = isPulling ? 'hidden' : ''
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isPWA, isPulling, isRefreshing])

  if (!isPWA) {
    return <>{children}</>
  }

  // Smooth rotation and scale calculations
  const rotation = pullProgress * 180
  const opacity = Math.min(pullProgress * 1.5, 1)
  const scale = 0.5 + pullProgress * 0.5

  return (
    <>
      {/* Pull to refresh indicator - show for all PWA */}
      {(isPulling || isRefreshing) && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate3d(0, ${Math.min(pullDistance, 80)}px, 0)`,
            transition: isRefreshing ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div
            className="flex flex-col items-center justify-center bg-white rounded-full shadow-lg p-4"
            style={{
              opacity,
              transform: `translate3d(0, 0, 0) scale(${scale})`,
              transition: isRefreshing ? 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              willChange: 'opacity, transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <RefreshCw
              className={`h-6 w-6 text-primary-600 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: `translate3d(0, 0, 0) rotate(${rotation}deg)`,
                transition: isRefreshing ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
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
          transform: isPulling ? `translate3d(0, ${Math.min(pullDistance, 80)}px, 0)` : 'translate3d(0, 0, 0)',
          transition: isRefreshing || !isPulling ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          willChange: isPulling ? 'transform' : 'auto',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {children}
      </div>
    </>
  )
}
