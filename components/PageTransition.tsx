'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useAnimationStore } from '@/lib/animationStore'
import { usePWAMode } from '@/hooks/usePWAMode'
import { ReactNode, useEffect, useRef } from 'react'
import { 
  springPresets, 
  isViewTransitionsSupported,
  prefersReducedMotion 
} from '@/lib/appleAnimations'

/**
 * Apple-style page transition variants
 * Uses spring physics for natural, iOS-like feel
 */
const pageVariants = {
  initial: { 
    opacity: 0,
    y: 30,
    scale: 0.97,
  },
  enter: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...springPresets.gentle,
      opacity: { duration: 0.25, ease: 'easeOut' },
    },
  },
  exit: { 
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      ...springPresets.snappy,
      opacity: { duration: 0.15 },
    },
  },
}

/**
 * iOS-style push transition (for navigation)
 */
const pushVariants = {
  initial: { 
    opacity: 0,
    x: '15%',
    scale: 0.98,
  },
  enter: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springPresets.gentle,
  },
  exit: { 
    opacity: 0,
    x: '-10%',
    scale: 0.98,
    transition: {
      ...springPresets.snappy,
      opacity: { duration: 0.1 },
    },
  },
}

interface PageTransitionProps {
  children: ReactNode
  /** Use push animation (horizontal slide) instead of fade up */
  variant?: 'fade' | 'push'
}

export default function PageTransition({ children, variant = 'fade' }: PageTransitionProps) {
  const pathname = usePathname()
  const { enabled: animationsEnabled } = useAnimationStore()
  const { isPWA } = usePWAMode()
  const prevPathRef = useRef(pathname)
  
  // Check for View Transitions API support
  const supportsViewTransitions = typeof window !== 'undefined' && isViewTransitionsSupported()
  
  // Determine if we should use native View Transitions
  const useNativeTransitions = supportsViewTransitions && !prefersReducedMotion()
  
  // Track navigation direction for push animations
  useEffect(() => {
    prevPathRef.current = pathname
  }, [pathname])
  
  // Disable Framer Motion animations in PWA mode, if user disabled them,
  // or if we're using native View Transitions
  if (isPWA || !animationsEnabled || useNativeTransitions) {
    return <>{children}</>
  }
  
  // Select variants based on prop
  const selectedVariants = variant === 'push' ? pushVariants : pageVariants
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={selectedVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="min-h-screen"
        style={{
          // Enable hardware acceleration
          willChange: 'transform, opacity',
          // Prevent content from being clipped during animation
          overflow: 'visible',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Lightweight transition wrapper for components within a page
 * Uses spring animation for smooth entrance
 */
export function ComponentTransition({ 
  children, 
  delay = 0,
  className = ''
}: { 
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { enabled: animationsEnabled } = useAnimationStore()
  
  if (!animationsEnabled) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...springPresets.default,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Staggered children animation wrapper
 * Animates children sequentially with spring physics
 */
export function StaggerContainer({ 
  children, 
  staggerDelay = 0.05,
  className = ''
}: { 
  children: ReactNode
  staggerDelay?: number
  className?: string
}) {
  const { enabled: animationsEnabled } = useAnimationStore()
  
  if (!animationsEnabled) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Child item for StaggerContainer
 */
export function StaggerItem({ 
  children, 
  className = ''
}: { 
  children: ReactNode
  className?: string
}) {
  const { enabled: animationsEnabled } = useAnimationStore()
  
  if (!animationsEnabled) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: springPresets.default,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}