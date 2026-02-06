'use client'

import { ReactNode } from 'react'
import { Share2 } from 'lucide-react'
import { BaseErrorBoundary, ErrorBoundaryConfig } from './BaseErrorBoundary'

interface ShareErrorBoundaryProps {
  children: ReactNode
  /** Custom error handler */
  onError?: ErrorBoundaryConfig['onError']
}

/**
 * ShareErrorBoundary
 * 
 * Error boundary for the share handler page.
 * Provides share-specific error messaging and recovery options.
 */
export function ShareErrorBoundary({ children, onError }: ShareErrorBoundaryProps) {
  const config: ErrorBoundaryConfig = {
    featureName: 'Share',
    title: 'Unable to load shared content',
    description: "We couldn't load the shared content. The link may be invalid or expired.",
    icon: (
      <div className="relative">
        <Share2 className="h-16 w-16 text-gray-400 mx-auto" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      </div>
    ),
    primaryAction: {
      label: 'Browse Products',
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

export default ShareErrorBoundary
