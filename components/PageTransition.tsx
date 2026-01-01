'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useAnimationStore } from '@/lib/animationStore'
import { usePWAMode } from '@/hooks/usePWAMode'
import { ReactNode } from 'react'

const pageVariants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  enter: { 
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: { 
    opacity: 0,
    y: -20,
    scale: 1.02
  }
}

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const { enabled: animationsEnabled } = useAnimationStore()
  const { isPWA } = usePWAMode()
  
  // Disable animations in PWA mode for better performance, or if user disabled them
  if (isPWA || !animationsEnabled) {
    return <>{children}</>
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}