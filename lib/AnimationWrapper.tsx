'use client'
import { motion, TargetAndTransition, VariantLabels, Transition, Variants } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import { ReactNode, CSSProperties } from 'react'

type AnimationTarget = TargetAndTransition | VariantLabels

// Props interface - keeping it simple to avoid HTMLAttributes/MotionProps conflicts
interface AnimationWrapperProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  id?: string
  whileHover?: AnimationTarget
  whileTap?: AnimationTarget
  initial?: AnimationTarget | boolean
  animate?: AnimationTarget
  transition?: Transition
  variants?: Variants
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
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
  className,
  style,
  id,
  onClick,
  onMouseEnter,
  onMouseLeave
}: AnimationWrapperProps) => {
  const { enabled: animationsEnabled } = useAnimationStore()
  
  // Build div props conditionally to avoid passing undefined to strict types
  const divProps: Record<string, unknown> = {}
  if (className !== undefined) divProps.className = className
  if (style !== undefined) divProps.style = style
  if (id !== undefined) divProps.id = id
  if (onClick !== undefined) divProps.onClick = onClick
  if (onMouseEnter !== undefined) divProps.onMouseEnter = onMouseEnter
  if (onMouseLeave !== undefined) divProps.onMouseLeave = onMouseLeave
  
  // If animations are disabled, render as a regular div
  if (!animationsEnabled) {
    return <div {...divProps}>{children}</div>
  }
  
  // If animations are enabled, render as motion.div with all animation props
  // Build props object conditionally to avoid passing undefined to strict types
  const motionAnimProps: Record<string, unknown> = {}
  if (whileHover !== undefined) motionAnimProps.whileHover = whileHover
  if (whileTap !== undefined) motionAnimProps.whileTap = whileTap
  if (initial !== undefined) motionAnimProps.initial = initial
  if (animate !== undefined) motionAnimProps.animate = animate
  if (transition !== undefined) motionAnimProps.transition = transition
  if (variants !== undefined) motionAnimProps.variants = variants
  
  return (
    <motion.div {...divProps} {...motionAnimProps}>
      {children}
    </motion.div>
  )
}

// Animation config type for the hook
interface AnimationConfig {
  whileHover?: AnimationTarget
  whileTap?: AnimationTarget
  initial?: AnimationTarget | boolean
  animate?: AnimationTarget
  transition?: Transition
  variants?: Variants
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
  
  const getAnimationProps = <T extends AnimationConfig>(animationConfig: T): T | Record<string, never> => {
    return enabled ? animationConfig : {}
  }
  
  return {
    enabled,
    getAnimationProps
  }
}