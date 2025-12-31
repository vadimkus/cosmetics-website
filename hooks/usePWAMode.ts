'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect if the app is running in PWA/standalone mode
 * 
 * Returns true when:
 * - display-mode: standalone (Android, Desktop PWA)
 * - navigator.standalone (iOS Safari PWA)
 * - display-mode: fullscreen
 */
export function usePWAMode() {
  const [isPWA, setIsPWA] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const checkPWAMode = () => {
      // Check display-mode: standalone (Android, Desktop)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      
      // Check iOS Safari standalone mode
      const isIOSStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
      
      // Check if launched from home screen (some browsers)
      const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
      
      return isStandalone || isIOSStandalone || isFullscreen
    }
    
    setIsPWA(checkPWAMode())
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPWA(e.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return { isPWA, isClient }
}

