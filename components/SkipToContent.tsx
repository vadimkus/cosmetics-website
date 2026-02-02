'use client'

import { useTranslation } from '@/hooks/useTranslation'

/**
 * Skip to Content Link
 * 
 * Provides keyboard users and screen reader users a way to skip
 * navigation and go directly to the main content.
 * 
 * Accessibility features:
 * - Hidden visually but accessible to screen readers
 * - Becomes visible on focus (keyboard navigation)
 * - Uses high contrast colors for visibility
 * - Positioned at the very top of the page
 */
export default function SkipToContent() {
  const { t } = useTranslation()
  
  const skipToContentText = t('accessibility.skipToContent') || 'Skip to main content'
  
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-3 focus:rounded-lg focus:bg-primary-600 focus:text-white focus:font-semibold focus:text-sm focus:shadow-lg focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 focus:outline-none transition-all duration-200"
      aria-label={skipToContentText}
    >
      {skipToContentText}
    </a>
  )
}
