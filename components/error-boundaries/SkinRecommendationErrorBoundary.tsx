'use client'

import { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import { BaseErrorBoundary, ErrorBoundaryConfig } from './BaseErrorBoundary'

interface SkinRecommendationErrorBoundaryProps {
  children: ReactNode
  /** Custom error handler */
  onError?: ErrorBoundaryConfig['onError']
}

/**
 * SkinRecommendationErrorBoundary
 * 
 * Error boundary for the skin recommendation / analysis feature.
 * Provides recommendation-specific error messaging and recovery options.
 */
export function SkinRecommendationErrorBoundary({ children, onError }: SkinRecommendationErrorBoundaryProps) {
  const config: ErrorBoundaryConfig = {
    featureName: 'SkinRecommendation',
    title: 'Unable to load skin recommendation',
    description: "We couldn't load the skin analysis tool. Please try again or browse our full product range.",
    icon: (
      <div className="relative">
        <Sparkles className="h-16 w-16 text-gray-400 mx-auto" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      </div>
    ),
    primaryAction: {
      label: 'Browse All Products',
      href: '/products',
    },
    secondaryAction: {
      label: 'Go to Homepage',
      href: '/',
    },
    bgColor: 'bg-gray-50',
    accentColor: 'text-primary-500',
    showHomeLink: false,
    showRetry: true,
    onError,
  }

  return (
    <BaseErrorBoundary config={config}>
      {children}
    </BaseErrorBoundary>
  )
}

export default SkinRecommendationErrorBoundary
