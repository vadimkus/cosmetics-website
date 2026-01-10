'use client'

import { useState, useEffect, useCallback } from 'react'
import { debugLog } from '@/lib/logger'

// Extended window interface for Opera browser
interface WindowWithOpera extends Window {
  opera?: string
}

// Extended navigator interface for iOS standalone mode
interface NavigatorStandalone extends Navigator {
  standalone?: boolean
}

// Detect if device is mobile
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as WindowWithOpera).opera || ''
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  return mobileRegex.test(userAgent) || (isTouchDevice && window.innerWidth <= 1024)
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface UsePWAInstallReturn {
  isInstallable: boolean
  isInstalled: boolean
  isSupported: boolean
  showPrompt: () => Promise<boolean>
  dismissPrompt: () => void
  installOutcome: string | null
}

export const usePWAInstall = (): UsePWAInstallReturn => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installOutcome, setInstallOutcome] = useState<string | null>(null)

  // Check if running as PWA
  const checkIfInstalled = useCallback(() => {
    if (typeof window === 'undefined') return false
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as NavigatorStandalone).standalone === true ||
                        document.referrer.includes('android-app://')
    
    return isStandalone
  }, [])

  useEffect(() => {
    // Only enable PWA on mobile devices
    if (!isMobileDevice()) {
      debugLog('PWA disabled on desktop device')
      setInstallPrompt(null)
      setIsInstalled(false)
      return
    }

    // Check initial installation status
    setIsInstalled(checkIfInstalled())

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent
      debugLog('PWA install prompt available on mobile device')
      
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      
      // Save the event so it can be triggered later
      setInstallPrompt(event)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      debugLog('PWA was installed')
      setIsInstalled(true)
      setInstallPrompt(null)
      setInstallOutcome('accepted')
    }

    // Listen for display mode changes (iOS)
    const handleDisplayModeChange = () => {
      setIsInstalled(checkIfInstalled())
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('resize', handleDisplayModeChange)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('resize', handleDisplayModeChange)
    }
  }, [checkIfInstalled])

  const showPrompt = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) {
      debugLog('No install prompt available')
      return false
    }

    try {
      // Show the install prompt
      await installPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const choiceResult = await installPrompt.userChoice
      
      debugLog('Install prompt result:', choiceResult.outcome)
      setInstallOutcome(choiceResult.outcome)
      
      if (choiceResult.outcome === 'accepted') {
        setInstallPrompt(null)
        return true
      }
      
      return false
    } catch (error) {
      debugLog('Error showing install prompt:', error)
      return false
    }
  }, [installPrompt])

  const dismissPrompt = useCallback(() => {
    setInstallPrompt(null)
    setInstallOutcome('dismissed')
  }, [])

  return {
    isInstallable: !!installPrompt && !isInstalled && isMobileDevice(),
    isInstalled: isInstalled && isMobileDevice(),
    isSupported: typeof window !== 'undefined' && 'serviceWorker' in navigator && isMobileDevice(),
    showPrompt,
    dismissPrompt,
    installOutcome
  }
}