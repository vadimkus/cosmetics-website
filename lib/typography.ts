/**
 * Typography System Utilities
 * 
 * Professional typography system for the GENOSYS cosmetics website and PWA.
 * 
 * Font Strategy:
 * - Primary: SF Pro Display (headings) / SF Pro Text (body) on Apple devices
 * - Fallback: Inter variable font for cross-platform consistency
 * 
 * Features:
 * - Dynamic Type support for iOS accessibility
 * - Responsive typography using clamp()
 * - Proper font weight hierarchy
 * - 44pt minimum touch targets for accessibility (Apple HIG)
 */

// ============================================================================
// TYPOGRAPHY CLASS UTILITIES
// ============================================================================

/**
 * Display typography classes for hero headlines and splash screens
 */
export const displayClasses = {
  lg: 'text-display-lg', // Hero headlines
  md: 'text-display-md', // Large titles
  sm: 'text-display-sm', // Section titles
} as const

/**
 * Heading typography classes with proper semantic hierarchy
 */
export const headingClasses = {
  h1: 'text-heading-1',
  h2: 'text-heading-2',
  h3: 'text-heading-3',
  h4: 'text-heading-4',
  h5: 'text-heading-5',
  h6: 'text-heading-6',
} as const

/**
 * Body typography classes for content text
 */
export const bodyClasses = {
  lg: 'text-body-lg',   // Large body text
  md: 'text-body-md',   // Default body text
  sm: 'text-body-sm',   // Small text / captions
  xs: 'text-body-xs',   // Extra small / legal text
} as const

/**
 * Font weight utility classes
 */
export const fontWeightClasses = {
  thin: 'font-weight-thin',
  extralight: 'font-weight-extralight',
  light: 'font-weight-light',
  normal: 'font-weight-normal',
  medium: 'font-weight-medium',
  semibold: 'font-weight-semibold',
  bold: 'font-weight-bold',
  extrabold: 'font-weight-extrabold',
  black: 'font-weight-black',
} as const

/**
 * Line height utility classes
 */
export const leadingClasses = {
  display: 'leading-display',   // For headlines (1.15)
  heading: 'leading-heading',   // For headings (1.3)
  body: 'leading-body',         // For body text (1.5)
  reading: 'leading-reading',   // For long-form content (1.65)
  spacious: 'leading-spacious', // For maximum readability (1.85)
} as const

/**
 * Letter spacing utility classes
 */
export const trackingClasses = {
  headline: 'tracking-headline',     // Tight for headlines (-0.03em)
  subheading: 'tracking-subheading', // Slightly tight (-0.015em)
  body: 'tracking-body',             // Normal (0)
  caption: 'tracking-caption',       // Wide for captions (0.015em)
  label: 'tracking-label',           // Wider for labels (0.03em)
  uppercase: 'tracking-uppercase',   // Widest for uppercase (0.06em)
} as const

// ============================================================================
// TOUCH TARGET UTILITIES (Apple HIG: 44pt minimum)
// ============================================================================

/**
 * Touch target classes for accessibility compliance
 */
export const touchTargetClasses = {
  min: 'touch-target-min',             // 44px - Apple HIG minimum
  comfortable: 'touch-target-comfortable', // 48px - Material Design
  spacious: 'touch-target-spacious',   // 56px - Extra accessibility
  inline: 'touch-target-inline',       // For inline links/buttons
  area: 'touch-target-area',           // Invisible expanded tap area
} as const

// ============================================================================
// DYNAMIC TYPE CLASSES (iOS Accessibility)
// ============================================================================

/**
 * iOS Dynamic Type classes for accessibility
 * These automatically scale with user's system text size preferences
 */
export const dynamicTypeClasses = {
  body: 'dynamic-type-body',
  headline: 'dynamic-type-headline',
  title1: 'dynamic-type-title1',
  title2: 'dynamic-type-title2',
  title3: 'dynamic-type-title3',
  caption1: 'dynamic-type-caption1',
  caption2: 'dynamic-type-caption2',
  footnote: 'dynamic-type-footnote',
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Combines multiple class names, filtering out undefined/null values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Creates a typography class string for a heading with optional modifiers
 * @param level - Heading level (1-6)
 * @param options - Optional modifiers (weight, tracking, leading)
 */
export function heading(
  level: 1 | 2 | 3 | 4 | 5 | 6,
  options?: {
    weight?: keyof typeof fontWeightClasses
    tracking?: keyof typeof trackingClasses
    leading?: keyof typeof leadingClasses
  }
): string {
  const baseClass = headingClasses[`h${level}`]
  const weightClass = options?.weight ? fontWeightClasses[options.weight] : undefined
  const trackingClass = options?.tracking ? trackingClasses[options.tracking] : undefined
  const leadingClass = options?.leading ? leadingClasses[options.leading] : undefined
  
  return cn(baseClass, weightClass, trackingClass, leadingClass)
}

/**
 * Creates a typography class string for body text with optional modifiers
 * @param size - Size variant (lg, md, sm, xs)
 * @param options - Optional modifiers (weight, tracking, leading)
 */
export function body(
  size: keyof typeof bodyClasses = 'md',
  options?: {
    weight?: keyof typeof fontWeightClasses
    tracking?: keyof typeof trackingClasses
    leading?: keyof typeof leadingClasses
  }
): string {
  const baseClass = bodyClasses[size]
  const weightClass = options?.weight ? fontWeightClasses[options.weight] : undefined
  const trackingClass = options?.tracking ? trackingClasses[options.tracking] : undefined
  const leadingClass = options?.leading ? leadingClasses[options.leading] : undefined
  
  return cn(baseClass, weightClass, trackingClass, leadingClass)
}

/**
 * Creates a display typography class string for hero elements
 * @param size - Size variant (lg, md, sm)
 * @param options - Optional modifiers
 */
export function display(
  size: keyof typeof displayClasses = 'md',
  options?: {
    weight?: keyof typeof fontWeightClasses
    tracking?: keyof typeof trackingClasses
    leading?: keyof typeof leadingClasses
  }
): string {
  const baseClass = displayClasses[size]
  const weightClass = options?.weight ? fontWeightClasses[options.weight] : undefined
  const trackingClass = options?.tracking ? trackingClasses[options.tracking] : undefined
  const leadingClass = options?.leading ? leadingClasses[options.leading] : undefined
  
  return cn(baseClass, weightClass, trackingClass, leadingClass)
}

/**
 * Returns the appropriate touch target class for the use case
 * @param variant - Touch target variant
 */
export function touchTarget(
  variant: keyof typeof touchTargetClasses = 'min'
): string {
  return touchTargetClasses[variant]
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type DisplaySize = keyof typeof displayClasses
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type BodySize = keyof typeof bodyClasses
export type FontWeight = keyof typeof fontWeightClasses
export type LineHeight = keyof typeof leadingClasses
export type LetterSpacing = keyof typeof trackingClasses
export type TouchTargetSize = keyof typeof touchTargetClasses
export type DynamicTypeStyle = keyof typeof dynamicTypeClasses
