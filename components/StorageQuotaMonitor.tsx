'use client'

import { useStorageQuota } from '@/hooks/useStorageQuota'
import { AlertTriangle, HardDrive, Trash2, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

interface StorageQuotaMonitorProps {
  className?: string
  showDetails?: boolean
}

export default function StorageQuotaMonitor({ 
  className = '',
  showDetails = false 
}: StorageQuotaMonitorProps) {
  const { t } = useTranslation()
  const { status, isLoading, error, checkQuota, clearOldCaches, isWarning, isCritical } = useStorageQuota()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCaches = async () => {
    if (confirm('Clear old caches to free up space? This is safe and will not affect your data.')) {
      setIsClearing(true)
      await clearOldCaches()
      setIsClearing(false)
    }
  }

  // Don't show if not supported or no warning
  if (!status?.supported || (!isWarning && !showDetails)) {
    return null
  }

  // Critical warning (>90%)
  if (isCritical) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 max-w-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
              Storage Almost Full
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">
              {status.usageFormatted} of {status.quotaFormatted} used ({(status.percentUsed * 100).toFixed(1)}%)
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mb-3">
              Clear old caches to free up space and improve performance.
            </p>

            <button
              onClick={handleClearCaches}
              disabled={isClearing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded transition-colors disabled:cursor-not-allowed"
            >
              {isClearing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('pwaUi.clearing')}</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>{t('pwaUi.clearCaches')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Warning (>80%)
  if (isWarning) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 max-w-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
              Storage Running Low
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              {status.usageFormatted} of {status.quotaFormatted} used ({(status.percentUsed * 100).toFixed(1)}%)
            </p>

            <button
              onClick={handleClearCaches}
              disabled={isClearing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white text-sm font-medium rounded transition-colors disabled:cursor-not-allowed"
            >
              {isClearing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('pwaUi.clearing')}</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>{t('pwaUi.clearCaches')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Details view (for debugging/admin)
  if (showDetails) {
    return (
      <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            Storage Quota
          </h3>
          <button
            onClick={checkQuota}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            aria-label="Refresh quota"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : status ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Used:</span>
              <span className="font-medium text-gray-900 dark:text-white">{status.usageFormatted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total:</span>
              <span className="font-medium text-gray-900 dark:text-white">{status.quotaFormatted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Available:</span>
              <span className="font-medium text-gray-900 dark:text-white">{status.availableFormatted}</span>
            </div>

            {/* Progress bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>{t('pwaUi.usage')}</span>
                <span>{(status.percentUsed * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isCritical
                      ? 'bg-red-500'
                      : isWarning
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(status.percentUsed * 100, 100)}%` }}
                />
              </div>
            </div>

            {(isWarning || isCritical) && (
              <button
                onClick={handleClearCaches}
                disabled={isClearing}
                className="w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded transition-colors disabled:cursor-not-allowed"
              >
                {isClearing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('pwaUi.clearing')}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{t('pwaUi.clearOldCaches')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('pwaUi.loading')}</p>
        )}
      </div>
    )
  }

  return null
}


