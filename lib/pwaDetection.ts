/**
 * Detect if the app is running in PWA (standalone) mode
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    // Check for standalone display mode (Android PWA, iOS PWA, Chrome PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true
    }
    
    // Check for iOS standalone mode (Safari PWA)
    if ((window.navigator as any).standalone === true) {
      return true
    }
    
    // Check if running in fullscreen mode (some PWAs)
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
      return true
    }
    
    // Additional check: if window is standalone (no browser UI)
    // This works for most modern browsers
    if ((window.navigator as any).standalone !== undefined) {
      return (window.navigator as any).standalone === true
    }
    
    // Check if launched from home screen (heuristic)
    // If there's no referrer and it's not a regular browser window
    if (!document.referrer && window.navigator.userAgent.includes('Mobile')) {
      // Additional check: window size matches screen size (likely PWA)
      if (window.screen.width === window.innerWidth && window.screen.height === window.innerHeight) {
        return true
      }
    }
  } catch (error) {
    // If any check fails, return false
    console.warn('PWA detection error:', error)
  }
  
  return false
}
