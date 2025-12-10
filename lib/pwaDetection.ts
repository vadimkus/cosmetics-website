/**
 * Detect if the app is running in PWA (standalone) mode
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for standalone display mode (Android PWA, iOS PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }
  
  // Check for iOS standalone mode
  if ((window.navigator as any).standalone === true) {
    return true
  }
  
  return false
}
