/**
 * Apple-Style Animation System
 * ============================================================================
 * 
 * This file contains Apple-inspired animation configurations using spring physics
 * and gesture-driven interactions that match iOS/macOS Human Interface Guidelines.
 * 
 * Key principles:
 * - Spring animations over easing curves (more natural, physics-based)
 * - Responsive to user gestures (swipe, drag, tap)
 * - Momentum and velocity preservation
 * - Rubber-band effects for overscroll
 */

import { type Transition, type Variants, type PanInfo } from 'framer-motion'

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

/**
 * Apple-style spring presets matching iOS animation curves
 * 
 * stiffness: Controls the "snap" - higher = more rigid
 * damping: Controls the "bounce" - lower = more bouncy
 * mass: Controls the "weight" - higher = slower, heavier feel
 */
export const springPresets = {
  // iOS default - smooth and responsive
  default: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    mass: 1,
  },
  
  // Snappy interactions (buttons, toggles)
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 30,
    mass: 0.8,
  },
  
  // Bouncy - for playful elements (notifications, badges)
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
    mass: 1,
  },
  
  // Gentle - for larger elements (modals, sheets)
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
    mass: 1.2,
  },
  
  // Slow - for page transitions
  slow: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 20,
    mass: 1.5,
  },
  
  // Rubber band - for overscroll effects
  rubberBand: {
    type: 'spring' as const,
    stiffness: 600,
    damping: 35,
    mass: 0.5,
  },
  
  // Quick snap back - for dismissing items
  quickSnap: {
    type: 'spring' as const,
    stiffness: 700,
    damping: 40,
    mass: 0.5,
  },
} as const

// Type for spring preset keys
export type SpringPreset = keyof typeof springPresets

// ============================================================================
// TRANSITION HELPERS
// ============================================================================

/**
 * Get a spring transition with optional customization
 */
export function getSpringTransition(
  preset: SpringPreset = 'default',
  overrides?: Partial<Transition>
): Transition {
  return {
    ...springPresets[preset],
    ...overrides,
  }
}

/**
 * iOS-style staggered children animation
 */
export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
} as const

/**
 * iOS-style list item animation
 */
export const listItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: springPresets.default,
  },
  exit: {
    opacity: 0,
    x: -100,
    scale: 0.9,
    transition: {
      ...springPresets.quickSnap,
      opacity: { duration: 0.15 },
    },
  },
}

// ============================================================================
// PAGE TRANSITION VARIANTS
// ============================================================================

/**
 * iOS-style page push transition (left to right)
 */
export const pagePushVariants: Variants = {
  initial: { 
    opacity: 0,
    x: '100%',
    scale: 0.95,
  },
  enter: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springPresets.gentle,
  },
  exit: { 
    opacity: 0,
    x: '-30%',
    scale: 0.95,
    transition: springPresets.gentle,
  },
}

/**
 * iOS-style fade up transition
 */
export const fadeUpVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 30,
    scale: 0.97,
  },
  enter: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springPresets.default,
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
 * iOS-style modal/sheet presentation
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    y: '100%',
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springPresets.gentle,
  },
  exit: {
    opacity: 0,
    y: '100%',
    scale: 0.95,
    transition: springPresets.snappy,
  },
}

/**
 * iOS-style overlay backdrop
 */
export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

// ============================================================================
// GESTURE HELPERS
// ============================================================================

/**
 * Swipe to delete configuration
 */
export const swipeToDeleteConfig = {
  // Minimum distance to trigger delete (in pixels)
  threshold: 100,
  // Velocity threshold to trigger delete (in px/s)
  velocityThreshold: 500,
  // Maximum drag distance (as percentage of container width)
  maxDrag: 0.5,
}

/**
 * Calculate swipe action based on offset and velocity
 */
export function calculateSwipeAction(
  offset: number,
  velocity: number,
  _containerWidth?: number
): 'delete' | 'snap-back' {
  const { threshold, velocityThreshold } = swipeToDeleteConfig
  
  // Delete if dragged past threshold OR if velocity is high enough
  if (Math.abs(offset) > threshold || Math.abs(velocity) > velocityThreshold) {
    return 'delete'
  }
  
  return 'snap-back'
}

/**
 * Get drag constraints for swipe-to-delete
 */
export function getSwipeDragConstraints(containerWidth: number) {
  const maxDrag = containerWidth * swipeToDeleteConfig.maxDrag
  return {
    left: -maxDrag,
    right: 0,
    top: 0,
    bottom: 0,
  }
}

/**
 * Calculate rubber band resistance for overscroll
 * Returns a dampened value that feels natural
 */
export function rubberBandClamp(
  value: number,
  min: number,
  max: number,
  factor: number = 0.55
): number {
  if (value < min) {
    const overscroll = min - value
    return min - overscroll * factor * (1 - overscroll / (overscroll + factor * (max - min)))
  }
  if (value > max) {
    const overscroll = value - max
    return max + overscroll * factor * (1 - overscroll / (overscroll + factor * (max - min)))
  }
  return value
}

// ============================================================================
// HOVER & TAP ANIMATIONS
// ============================================================================

/**
 * iOS-style button press animation
 */
export const buttonPressAnimation = {
  whileTap: { 
    scale: 0.97,
    transition: springPresets.snappy,
  },
  whileHover: {
    scale: 1.02,
    transition: springPresets.default,
  },
}

/**
 * iOS-style card hover animation
 */
export const cardHoverAnimation = {
  whileHover: { 
    y: -4,
    scale: 1.01,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    transition: springPresets.default,
  },
  whileTap: {
    scale: 0.98,
    transition: springPresets.snappy,
  },
}

/**
 * iOS-style list item press animation
 */
export const listItemPressAnimation = {
  whileTap: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    scale: 0.99,
    transition: springPresets.snappy,
  },
}

// ============================================================================
// SHARED ELEMENT TRANSITIONS (View Transitions API)
// ============================================================================

/**
 * Generate a unique view transition name for an element
 */
export function getViewTransitionName(type: string, id: string | number): string {
  return `${type}-${id}`
}

/**
 * Apply view transition styles to an element
 */
export function applyViewTransitionStyles(
  element: HTMLElement,
  transitionName: string
): void {
  element.style.viewTransitionName = transitionName
}

/**
 * Check if View Transitions API is supported
 */
export function isViewTransitionsSupported(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

/**
 * Start a view transition with fallback
 */
export async function startViewTransition(
  callback: () => void | Promise<void>
): Promise<void> {
  if (isViewTransitionsSupported()) {
    const transition = document.startViewTransition(callback)
    await transition.finished
  } else {
    await callback()
  }
}

// ============================================================================
// ANIMATION CONTEXT HELPERS
// ============================================================================

/**
 * Detect if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get appropriate spring config based on user preferences
 */
export function getAccessibleSpring(preset: SpringPreset = 'default'): Transition {
  if (prefersReducedMotion()) {
    return { duration: 0.01 } // Nearly instant for reduced motion
  }
  return springPresets[preset]
}

// ============================================================================
// MOMENTUM SCROLL HELPERS
// ============================================================================

/**
 * Calculate deceleration for momentum scrolling
 * Based on iOS scroll physics
 */
export function calculateMomentumScroll(
  velocity: number,
  deceleration: number = 0.998
): { distance: number; duration: number } {
  // iOS-style momentum calculation
  const absVelocity = Math.abs(velocity)
  
  // Distance traveled during deceleration
  const distance = (absVelocity * deceleration) / (1 - deceleration)
  
  // Duration until velocity reaches ~0
  const duration = Math.log(0.01 / absVelocity) / Math.log(deceleration)
  
  return {
    distance: velocity > 0 ? distance : -distance,
    duration: Math.min(Math.max(duration / 1000, 0.3), 2), // Clamp between 0.3s and 2s
  }
}

/**
 * Handle pan gesture end with momentum
 */
export function handlePanEndWithMomentum(
  info: PanInfo,
  onMomentumScroll: (distance: number, duration: number) => void
): void {
  const { velocity } = info
  const { distance, duration } = calculateMomentumScroll(velocity.y)
  
  if (Math.abs(distance) > 10) {
    onMomentumScroll(distance, duration)
  }
}

export default {
  springPresets,
  getSpringTransition,
  listItemVariants,
  pagePushVariants,
  fadeUpVariants,
  modalVariants,
  overlayVariants,
  buttonPressAnimation,
  cardHoverAnimation,
  listItemPressAnimation,
  calculateSwipeAction,
  getSwipeDragConstraints,
  rubberBandClamp,
  isViewTransitionsSupported,
  startViewTransition,
  prefersReducedMotion,
  getAccessibleSpring,
}
