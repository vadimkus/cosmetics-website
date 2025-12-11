'use client'

import { useState } from 'react'
import { Smartphone, Badge, Share2, Download, Zap } from 'lucide-react'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { useAppBadge } from '@/hooks/useAppBadge'
import { useWebShare } from '@/hooks/useWebShare'
import { cn } from '@/lib/utils'

interface PWAFeaturesDemoProps {
  className?: string
}

export default function PWAFeaturesDemo({ className }: PWAFeaturesDemoProps) {
  const { isInstallable, isInstalled, showPrompt } = usePWAInstall()
  const { setBadge, clearBadge, isSupported: isBadgeSupported } = useAppBadge()
  const { share, isSupported: isShareSupported } = useWebShare()
  const [badgeCount, setBadgeCount] = useState(0)

  const handleInstallTest = async () => {
    if (isInstallable) {
      await showPrompt()
    }
  }

  const handleBadgeTest = () => {
    const newCount = badgeCount + 1
    setBadgeCount(newCount)
    setBadge(newCount)
  }

  const handleClearBadge = () => {
    setBadgeCount(0)
    clearBadge()
  }

  const handleShareTest = async () => {
    await share({
      title: 'GENOSYS PWA Features',
      text: 'Check out these amazing PWA features in action!',
      url: window.location.href
    })
  }

  return (
    <div className={cn('bg-white rounded-xl border p-6 space-y-6', className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          PWA Features Demo
        </h3>
        <p className="text-sm text-gray-600">
          Test the new Progressive Web App capabilities
        </p>
      </div>

      {/* Install Prompt Feature */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">
              Custom Install Prompt
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Enhanced app installation experience with custom UI
            </p>
            <div className="flex items-center gap-2">
              {isInstalled ? (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  App is installed
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleInstallTest}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  Install App
                </button>
              ) : (
                <div className="text-sm text-gray-500">
                  Install prompt not available (app may already be installed)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* App Badge Feature */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Badge className="w-5 h-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">
              App Badge API
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Show notification count on app icon (Chrome 81+)
            </p>
            <div className="flex items-center gap-2">
              {isBadgeSupported ? (
                <>
                  <button
                    onClick={handleBadgeTest}
                    className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Add Badge ({badgeCount})
                  </button>
                  <button
                    onClick={handleClearBadge}
                    className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  Not supported in this browser
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Web Share Feature */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Share2 className="w-5 h-5 text-green-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">
              Web Share API
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Native sharing with system share sheet
            </p>
            <div className="flex items-center gap-2">
              {isShareSupported ? (
                <button
                  onClick={handleShareTest}
                  className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-3 h-3" />
                  Share Page
                </button>
              ) : (
                <div className="text-sm text-gray-500">
                  Not supported (fallback sharing available)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PWA Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          PWA Status
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Service Worker:</span>
            <span className="text-green-600">✓ Active</span>
          </div>
          <div className="flex justify-between">
            <span>Offline Support:</span>
            <span className="text-green-600">✓ Available</span>
          </div>
          <div className="flex justify-between">
            <span>Install Prompt:</span>
            <span className={isInstallable ? 'text-green-600' : 'text-gray-500'}>
              {isInstallable ? '✓ Ready' : '⊝ Not available'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>App Badge:</span>
            <span className={isBadgeSupported ? 'text-green-600' : 'text-gray-500'}>
              {isBadgeSupported ? '✓ Supported' : '⊝ Not supported'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Web Share:</span>
            <span className={isShareSupported ? 'text-green-600' : 'text-gray-500'}>
              {isShareSupported ? '✓ Supported' : '⊝ Fallback only'}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          PWA features may vary by browser and device
        </p>
      </div>
    </div>
  )
}