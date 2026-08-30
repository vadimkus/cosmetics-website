'use client'

import { useEffect, useState, useRef } from 'react'
import { useBackgroundSync } from '@/hooks/useBackgroundSync'
import { usePWAMode } from '@/hooks/usePWAMode'
import { Cloud, CloudOff, RefreshCw, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SyncStatusIndicatorProps {
  className?: string
  showAlways?: boolean
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left'
}

export function SyncStatusIndicator({
  className,
  showAlways = false,
  position = 'bottom-right',
}: SyncStatusIndicatorProps) {
  const { isPWA } = usePWAMode()
  const { isOnline, pendingCount, isSyncing, lastSyncTime, syncError } = useBackgroundSync()
  const [showSuccess, setShowSuccess] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [lastPendingCount, setLastPendingCount] = useState(0)
  const successTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Show success animation when sync completes
  useEffect(() => {
    if (lastPendingCount > 0 && pendingCount === 0 && !isSyncing) {
      setShowSuccess(true)
      successTimerRef.current = setTimeout(() => setShowSuccess(false), 2000)
    }
    setLastPendingCount(pendingCount)
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current)
    }
  }, [pendingCount, isSyncing, lastPendingCount])

  // Determine visibility
  useEffect(() => {
    const shouldShow = showAlways || !isOnline || pendingCount > 0 || isSyncing || showSuccess || !!syncError
    setIsVisible(shouldShow)
  }, [showAlways, isOnline, pendingCount, isSyncing, showSuccess, syncError])

  // Only show in PWA mode
  if (!isPWA) return null

  // Don't render if not visible
  if (!isVisible) return null

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-24 right-4', // Above footer nav
    'bottom-left': 'bottom-24 left-4',
    'top-left': 'top-4 left-4',
  }

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300 ease-out',
        positionClasses[position],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
    >
      {/* Apple-style glass card */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg',
          'backdrop-blur-xl border',
          // Background based on status
          syncError
            ? 'bg-red-50/90 border-red-200/50'
            : !isOnline
            ? 'bg-gray-100/90 border-gray-200/50'
            : showSuccess
            ? 'bg-green-50/90 border-green-200/50'
            : 'bg-white/90 border-gray-200/50'
        )}
        style={{
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {syncError ? (
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
          ) : !isOnline ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <CloudOff className="w-4 h-4 text-gray-500" />
            </div>
          ) : isSyncing ? (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-primary-600 animate-spin" />
            </div>
          ) : showSuccess ? (
            <div className="w-8 h-8 rounded-full bg-[var(--cera-ok-bg)] flex items-center justify-center">
              <Check className="w-4 h-4 text-[var(--cera-ok)]" />
            </div>
          ) : pendingCount > 0 ? (
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-amber-600" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--cera-ok-bg)] flex items-center justify-center">
              <Cloud className="w-4 h-4 text-[var(--cera-ok)]" />
            </div>
          )}
        </div>

        {/* Status Text */}
        <div className="flex flex-col">
          <span
            className={cn(
              'text-sm font-medium',
              syncError
                ? 'text-red-900'
                : !isOnline
                ? 'text-gray-700'
                : showSuccess
                ? 'text-[var(--cera-ok)]'
                : 'text-gray-900'
            )}
          >
            {syncError
              ? 'Sync Failed'
              : !isOnline
              ? 'You\'re Offline'
              : isSyncing
              ? 'Syncing...'
              : showSuccess
              ? 'All Synced!'
              : pendingCount > 0
              ? `${pendingCount} Pending`
              : 'Connected'}
          </span>

          {/* Subtitle */}
          <span className="text-xs text-gray-500">
            {syncError
              ? 'Tap to retry'
              : !isOnline
              ? 'Changes saved locally'
              : isSyncing
              ? 'Updating your data'
              : pendingCount > 0
              ? 'Will sync when online'
              : lastSyncTime
              ? `Last sync: ${formatRelativeTime(lastSyncTime)}`
              : 'All changes saved'}
          </span>
        </div>

        {/* Badge for pending count */}
        {pendingCount > 0 && !isSyncing && (
          <div className="flex-shrink-0 ml-1">
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary-600 rounded-full">
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Format relative time like iOS
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return new Date(timestamp).toLocaleDateString()
}

/**
 * Minimal inline indicator for headers/navbars
 */
export function SyncStatusDot() {
  const { isPWA } = usePWAMode()
  const { isOnline, pendingCount, isSyncing } = useBackgroundSync()

  if (!isPWA) return null
  if (isOnline && pendingCount === 0 && !isSyncing) return null

  return (
    <div className="relative">
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          !isOnline
            ? 'bg-gray-400'
            : isSyncing
            ? 'bg-primary-500 animate-pulse'
            : 'bg-amber-500'
        )}
      />
      {pendingCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 text-[8px] text-white items-center justify-center font-bold">
            {pendingCount > 9 ? '!' : pendingCount}
          </span>
        </span>
      )}
    </div>
  )
}

