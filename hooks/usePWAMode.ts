'use client'

import { useEffect, useState } from 'react'
// debugLog import removed - logging commented out to reduce console noise

/**
 * Hook to detect if the app is running in PWA/standalone mode
 * 
 * Returns true when:
 * - display-mode: standalone (Android, Desktop PWA)
 * - navigator.standalone (iOS Safari PWA)
 * - display-mode: fullscreen
 * - minimal-ui mode (some browsers)
 * - iOS detection via window properties
 */
export function usePWAMode() {
  const [isPWA, setIsPWA] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const checkPWAMode = () => {
      // Check display-mode: standalone (Android, Desktop)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      
      // Check iOS Safari standalone mode - this is the primary iOS detection
      const nav = navigator as Navigator & { standalone?: boolean }
      const isIOSStandalone = nav.standalone === true
      
      // Check if launched from home screen (some browsers)
      const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
      
      // Check minimal-ui mode
      const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches
      
      // Only use reliable PWA detection methods.
      // The previous heuristic (innerHeight/screen.height + empty referrer) caused
      // false positives for Chrome/Safari on iOS, incorrectly routing regular mobile
      // web users to the PWA login page.
      const result = isStandalone || isIOSStandalone || isFullscreen || isMinimalUI
      
      // Debug logging disabled - was spamming console with ~50+ component instances
      // Uncomment for debugging PWA detection issues:
      // debugLog('PWA Detection:', { isStandalone, isIOSStandalone, result })
      
      return result
    }
    
    setIsPWA(checkPWAMode())
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleChange = (e: MediaQueryListEvent) => {
      const nav = navigator as Navigator & { standalone?: boolean }
      setIsPWA(e.matches || nav.standalone === true)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return { isPWA, isClient }
}

