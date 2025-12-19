'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Zap, Wifi } from 'lucide-react'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { cn } from '@/lib/utils'
import { errorLog } from '@/lib/logger'

// Detect if device is mobile
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  
  return mobileRegex.test(userAgent)
}

interface PWAInstallPromptProps {
  className?: string
  variant?: 'banner' | 'modal' | 'card'
  showDelay?: number // Delay in seconds before showing the prompt
}

export default function PWAInstallPrompt({ 
  className, 
  variant = 'banner',
  showDelay = 30 
}: PWAInstallPromptProps) {
  const { isInstallable, showPrompt, dismissPrompt } = usePWAInstall()
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  // Don't show PWA prompt on desktop
  if (!isMobileDevice()) {
    return null
  }

  useEffect(() => {
    if (!isInstallable) return

    // Show prompt after delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, showDelay * 1000)

    return () => clearTimeout(timer)
  }, [isInstallable, showDelay])

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const success = await showPrompt()
      if (success) {
        setIsVisible(false)
      }
    } catch (error) {
      errorLog('Install failed:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    dismissPrompt()
  }

  if (!isInstallable || !isVisible) {
    return null
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Install GENOSYS App
            </h3>
            <p className="text-gray-600">
              Get the full app experience with faster loading and offline access to our premium beauty products.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Lightning fast performance</span>
            </div>
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Works offline</span>
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Native app experience</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isInstalling ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Install
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        'bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg',
        className
      )}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Get the GENOSYS App</h3>
              <p className="text-primary-100 text-sm">Install for the best experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/60 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex-1 bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isInstalling ? (
              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Install App
          </button>
        </div>
      </div>
    )
  }

  // Banner variant (default)
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg p-4',
      className
    )}>
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Install GENOSYS</h4>
            <p className="text-xs text-gray-600">Get the app for faster access</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleDismiss}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            {isInstalling ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3 h-3" />
            )}
            Install
          </button>
        </div>
      </div>
    </div>
  )
}