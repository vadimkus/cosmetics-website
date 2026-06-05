'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  safeLocalStorageGetItem,
  safeLocalStorageRemoveItem,
  safeLocalStorageSetItem,
} from '@/lib/browserStorage'

/**
 * Theme options
 * - 'light': Force light mode
 * - 'dark': Force dark mode
 * - 'system': Follow system preference (default)
 */
export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'genosys-theme'

/**
 * useTheme Hook
 * 
 * Manages theme state with system preference support and localStorage persistence.
 * 
 * Features:
 * - Respects user's system preference by default
 * - Persists user's manual choice to localStorage
 * - Provides smooth theme transitions
 * - SSR-safe (prevents hydration mismatch)
 * 
 * Usage:
 * ```tsx
 * const { theme, resolvedTheme, setTheme, toggleTheme, isSystemTheme } = useTheme()
 * ```
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')
  const [isClient, setIsClient] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setIsClient(true)
    
    // Check for stored preference
    const storedTheme = safeLocalStorageGetItem(STORAGE_KEY) as Theme | null
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setThemeState(storedTheme)
    }

    // Set up system preference listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const systemIsDark = e.matches
      setResolvedTheme(systemIsDark ? 'dark' : 'light')
      
      // Only apply if user prefers system theme
      const currentTheme = safeLocalStorageGetItem(STORAGE_KEY) as Theme | null
      if (!currentTheme || currentTheme === 'system') {
        applyTheme(systemIsDark ? 'dark' : 'light')
      }
    }

    // Initial check
    handleSystemThemeChange(mediaQuery)

    // Listen for changes
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  // Apply theme when it changes
  useEffect(() => {
    if (!isClient) return

    if (theme === 'system') {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const resolved = systemIsDark ? 'dark' : 'light'
      setResolvedTheme(resolved)
      applyTheme(resolved)
    } else {
      setResolvedTheme(theme)
      applyTheme(theme)
    }
  }, [theme, isClient])

  // Apply theme to document
  const applyTheme = useCallback((themeToApply: ResolvedTheme) => {
    const root = document.documentElement
    
    // Remove existing theme classes/attributes
    root.removeAttribute('data-theme')
    root.classList.remove('light', 'dark')
    
    // Apply new theme
    root.setAttribute('data-theme', themeToApply)
    root.classList.add(themeToApply)
    
    // Update meta theme-color for PWA
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeToApply === 'dark' ? '#1c1c1e' : '#ffffff')
    }
  }, [])

  // Set theme with persistence
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    
    if (newTheme === 'system') {
      safeLocalStorageRemoveItem(STORAGE_KEY)
    } else {
      safeLocalStorageSetItem(STORAGE_KEY, newTheme)
    }
  }, [])

  // Toggle between light and dark (skips system)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  // Cycle through all themes: light -> dark -> system -> light
  const cycleTheme = useCallback(() => {
    const themeOrder: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themeOrder.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    const nextTheme = themeOrder[nextIndex] ?? 'system'
    setTheme(nextTheme)
  }, [theme, setTheme])

  return {
    /** Current theme setting ('light', 'dark', or 'system') */
    theme,
    /** Resolved theme value ('light' or 'dark') - what's actually applied */
    resolvedTheme,
    /** Set theme to a specific value */
    setTheme,
    /** Toggle between light and dark mode */
    toggleTheme,
    /** Cycle through all theme options */
    cycleTheme,
    /** Whether the current theme follows system preference */
    isSystemTheme: theme === 'system',
    /** Whether we're running on the client (for SSR safety) */
    isClient,
  }
}

export default useTheme
