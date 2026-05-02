'use client'

import { useEffect, useState } from 'react'
import { usePWAMode } from '@/hooks/usePWAMode'

export interface DesktopExperienceState {
  isClient: boolean
  isDesktop: boolean
  isPWA: boolean
  prefersReducedMotion: boolean
  supportsWebGL: boolean
  enabled: boolean
  reason: 'loading' | 'mobile' | 'pwa' | 'reduced-motion' | 'no-webgl' | 'ready'
}

interface UseDesktopExperienceOptions {
  minWidth?: number | undefined
  disableForPWA?: boolean | undefined
  disableForReducedMotion?: boolean | undefined
}

function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Shared gate for the desktop-only immersive rebuild.
 *
 * Mobile web and installed PWA paths keep the existing DOM experience. Desktop
 * gets R3F only when the browser can actually render WebGL and the user has not
 * requested reduced motion.
 */
export function useDesktopExperience({
  minWidth = 1024,
  disableForPWA = true,
  disableForReducedMotion = true,
}: UseDesktopExperienceOptions = {}): DesktopExperienceState {
  const { isPWA } = usePWAMode()
  const [state, setState] = useState<Omit<DesktopExperienceState, 'isPWA' | 'enabled' | 'reason'>>({
    isClient: false,
    isDesktop: false,
    prefersReducedMotion: false,
    supportsWebGL: false,
  })

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => {
      setState({
        isClient: true,
        isDesktop: window.innerWidth >= minWidth,
        prefersReducedMotion: reducedMotionQuery.matches,
        supportsWebGL: hasWebGLSupport(),
      })
    }

    update()
    window.addEventListener('resize', update)
    reducedMotionQuery.addEventListener('change', update)

    return () => {
      window.removeEventListener('resize', update)
      reducedMotionQuery.removeEventListener('change', update)
    }
  }, [minWidth])

  let reason: DesktopExperienceState['reason'] = 'ready'
  if (!state.isClient) reason = 'loading'
  else if (!state.isDesktop) reason = 'mobile'
  else if (disableForPWA && isPWA) reason = 'pwa'
  else if (disableForReducedMotion && state.prefersReducedMotion) reason = 'reduced-motion'
  else if (!state.supportsWebGL) reason = 'no-webgl'

  return {
    ...state,
    isPWA,
    reason,
    enabled: reason === 'ready',
  }
}
