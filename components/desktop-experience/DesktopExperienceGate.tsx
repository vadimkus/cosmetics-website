'use client'

import type { ReactNode } from 'react'
import { useDesktopExperience, type DesktopExperienceState } from '@/hooks/useDesktopExperience'
import { cn } from '@/lib/utils'

interface DesktopExperienceGateProps {
  children: ReactNode | ((state: DesktopExperienceState) => ReactNode)
  fallback?: ReactNode | ((state: DesktopExperienceState) => ReactNode)
  className?: string | undefined
  minWidth?: number | undefined
}

export default function DesktopExperienceGate({
  children,
  fallback = null,
  className,
  minWidth,
}: DesktopExperienceGateProps) {
  const state = useDesktopExperience({ minWidth })

  const content = state.enabled
    ? typeof children === 'function'
      ? children(state)
      : children
    : typeof fallback === 'function'
      ? fallback(state)
      : fallback

  if (!content) return null

  return (
    <div className={cn('hidden lg:block', className)} data-desktop-experience={state.reason}>
      {content}
    </div>
  )
}
