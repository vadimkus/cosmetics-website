'use client'

import { useCallback } from 'react'
import { usePWAMode } from '@/hooks/usePWAMode'
import { debugLog } from '@/lib/logger'

/**
 * Haptic feedback patterns for different interactions
 * Values are vibration durations in milliseconds
 */
export const HapticPatterns: Record<string, number[]> = {
  // Light tap - for button presses, selections
  light: [10],
  
  // Medium tap - for confirmations, toggles
  medium: [25],
  
  // Heavy tap - for important actions
  heavy: [50],
  
  // Success - for completed actions (add to cart, order placed)
  success: [10, 50, 10, 50, 100],
  
  // Error - for failed actions
  error: [100, 50, 100],
  
  // Warning - for important alerts
  warning: [50, 30, 50],
  
  // Selection change - subtle feedback for switching options
  selection: [5, 5],
  
  // Double tap - for like/favorite actions
  double: [30, 50, 30],
  
  // Notification - for new notifications
  notification: [50, 100, 50],
  
  // Celebration - for special moments (order complete, achievement)
  celebration: [50, 30, 50, 30, 100, 50, 150],
  
  // Pull to refresh - when threshold is reached
  pullRefresh: [20, 10, 20],
  
  // Swipe action - for delete confirmations
  swipe: [40],
}

export type HapticPattern = 
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'error'
  | 'warning'
  | 'selection'
  | 'double'
  | 'notification'
  | 'celebration'
  | 'pullRefresh'
  | 'swipe'

interface UseHapticFeedbackOptions {
  /** Only trigger haptics in PWA mode (default: true) */
  pwaOnly?: boolean
  /** Enable/disable haptics (default: true) */
  enabled?: boolean
}

interface UseHapticFeedbackReturn {
  /** Check if haptic feedback is supported */
  isSupported: boolean
  /** Check if we're in PWA mode */
  isPWA: boolean
  /** Trigger a predefined haptic pattern */
  trigger: (pattern: HapticPattern) => void
  /** Trigger a custom vibration pattern */
  vibrate: (pattern: number | number[]) => void
  /** Light tap feedback */
  light: () => void
  /** Medium tap feedback */
  medium: () => void
  /** Heavy tap feedback */
  heavy: () => void
  /** Success feedback */
  success: () => void
  /** Error feedback */
  error: () => void
  /** Warning feedback */
  warning: () => void
  /** Selection feedback */
  selection: () => void
  /** Double tap feedback (like/favorite) */
  double: () => void
  /** Notification feedback */
  notification: () => void
  /** Celebration feedback */
  celebration: () => void
}

/**
 * Hook for triggering haptic feedback in PWA mode
 * 
 * @example
 * ```tsx
 * const { trigger, success, error } = useHapticFeedback()
 * 
 * // On button click
 * const handleClick = () => {
 *   trigger('light')
 *   // do something
 * }
 * 
 * // On success
 * const handleSuccess = () => {
 *   success()
 * }
 * ```
 */
export function useHapticFeedback(options: UseHapticFeedbackOptions = {}): UseHapticFeedbackReturn {
  const { pwaOnly = true, enabled = true } = options
  const { isPWA } = usePWAMode()

  // Check if vibration API is supported
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  // Core vibration function
  const vibrate = useCallback((pattern: number | number[]) => {
    if (!enabled) return
    if (!isSupported) return
    if (pwaOnly && !isPWA) return

    try {
      navigator.vibrate(pattern)
      debugLog('📳 Haptic:', pattern)
    } catch (err) {
      // Silently fail - haptics are not critical
    }
  }, [enabled, isSupported, pwaOnly, isPWA])

  // Trigger a predefined pattern
  const trigger = useCallback((pattern: HapticPattern) => {
    const patternArray = HapticPatterns[pattern]
    if (patternArray) {
      vibrate(patternArray)
    }
  }, [vibrate])

  // Convenience methods for common patterns
  const light = useCallback(() => trigger('light'), [trigger])
  const medium = useCallback(() => trigger('medium'), [trigger])
  const heavy = useCallback(() => trigger('heavy'), [trigger])
  const success = useCallback(() => trigger('success'), [trigger])
  const error = useCallback(() => trigger('error'), [trigger])
  const warning = useCallback(() => trigger('warning'), [trigger])
  const selection = useCallback(() => trigger('selection'), [trigger])
  const double = useCallback(() => trigger('double'), [trigger])
  const notification = useCallback(() => trigger('notification'), [trigger])
  const celebration = useCallback(() => trigger('celebration'), [trigger])

  return {
    isSupported,
    isPWA,
    trigger,
    vibrate,
    light,
    medium,
    heavy,
    success,
    error,
    warning,
    selection,
    double,
    notification,
    celebration,
  }
}

/**
 * Higher-order function to wrap event handlers with haptic feedback
 * 
 * @example
 * ```tsx
 * const { withHaptic } = useHapticWrapper()
 * 
 * <button onClick={withHaptic(() => addToCart(), 'success')}>
 *   Add to Cart
 * </button>
 * ```
 */
export function useHapticWrapper() {
  const haptic = useHapticFeedback()

  const withHaptic = useCallback(
    <T extends (...args: unknown[]) => unknown>(
      fn: T,
      pattern: HapticPattern = 'light'
    ): ((...args: Parameters<T>) => ReturnType<T>) => {
      return (...args: Parameters<T>): ReturnType<T> => {
        haptic.trigger(pattern)
        return fn(...args) as ReturnType<T>
      }
    },
    [haptic]
  )

  return { withHaptic, haptic }
}

export default useHapticFeedback

