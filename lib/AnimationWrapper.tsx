'use client'
import { motion } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import { ReactNode } from 'react'

interface AnimationWrapperProps {
  children: ReactNode
  className?: string
  whileHover?: any
  whileTap?: any
  initial?: any
  animate?: any
  transition?: any
  variants?: any
  [key: string]: any
}

/**
 * A wrapper component that conditionally applies Framer Motion animations
 * based on the global animation preference set by the user.
 * 
 * Usage:
 * <AnimationWrapper whileHover={{ y: -8 }} className="your-styles">
 *   <YourComponent />
 * </AnimationWrapper>
 */
export const AnimationWrapper = ({ 
  children, 
  whileHover, 
  whileTap, 
  initial, 
  animate, 
  transition, 
  variants,
  ...props 
}: AnimationWrapperProps) => {
  const { enabled: animationsEnabled } = useAnimationStore()
  
  // If animations are disabled, render as a regular div
  if (!animationsEnabled) {
    return <div {...props}>{children}</div>
  }
  
  // If animations are enabled, render as motion.div with all animation props
  const animationProps = {
    ...(whileHover && { whileHover }),
    ...(whileTap && { whileTap }),
    ...(initial && { initial }),
    ...(animate && { animate }),
    ...(transition && { transition }),
    ...(variants && { variants }),
  }
  
  return (
    <motion.div {...props} {...animationProps}>
      {children}
    </motion.div>
  )
}

/**
 * Hook to get animation preferences and create conditional animation props
 * 
 * Usage:
 * const { enabled, getAnimationProps } = useAnimationPreferences()
 * 
 * <motion.div {...getAnimationProps({ whileHover: { scale: 1.05 } })}>
 *   Content
 * </motion.div>
 */
export const useAnimationPreferences = () => {
  const { enabled } = useAnimationStore()
  
  const getAnimationProps = (animationConfig: any) => {
    return enabled ? animationConfig : {}
  }
  
  return {
    enabled,
    getAnimationProps
  }
}