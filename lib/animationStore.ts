'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Check if user's system prefers reduced motion
 * Returns false on server or if media query is not supported
 */
function getSystemReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface AnimationState {
  /** Whether animations are enabled (user preference) */
  enabled: boolean
  /** Whether the system prefers reduced motion */
  systemReducedMotion: boolean
  /** Whether animations should actually be played (respects both preferences) */
  shouldAnimate: boolean
  /** Toggle user animation preference */
  toggleAnimation: () => void
  /** Set system reduced motion preference */
  setSystemReducedMotion: (value: boolean) => void
  /** Initialize system preference (call on client mount) */
  initSystemPreference: () => void
}

export const useAnimationStore = create<AnimationState>()(
  persist(
    (set, get) => ({
      enabled: false, // Default: animations off (user preference)
      systemReducedMotion: false, // Will be set by initSystemPreference
      
      // Computed property - respects both user pref and system pref
      get shouldAnimate() {
        const state = get()
        // Only animate if user enabled AND system doesn't prefer reduced motion
        return state.enabled && !state.systemReducedMotion
      },
      
      toggleAnimation: () => set((state) => ({ 
        enabled: !state.enabled 
      })),
      
      setSystemReducedMotion: (value: boolean) => set({ 
        systemReducedMotion: value 
      }),
      
      initSystemPreference: () => {
        const systemPref = getSystemReducedMotion()
        set({ systemReducedMotion: systemPref })
        
        // Listen for changes in system preference
        if (typeof window !== 'undefined' && window.matchMedia) {
          const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
          
          const handleChange = (e: MediaQueryListEvent) => {
            set({ systemReducedMotion: e.matches })
          }
          
          // Modern browsers
          if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange)
          }
        }
      },
    }),
    {
      name: 'animation-preference', // localStorage key
      partialize: (state) => ({ enabled: state.enabled }), // Only persist user preference
    }
  )
)

/**
 * Hook to use actual animation state (respects both user and system preferences)
 * Use this instead of directly accessing `enabled`
 */
export function useShouldAnimate(): boolean {
  const { enabled, systemReducedMotion } = useAnimationStore()
  return enabled && !systemReducedMotion
}