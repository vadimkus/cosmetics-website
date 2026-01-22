'use client'

import { ReactNode } from 'react'
import { FileText, RefreshCw } from 'lucide-react'
import { BaseErrorBoundary, ErrorBoundaryConfig } from './BaseErrorBoundary'

interface BlogErrorBoundaryProps {
  children: ReactNode
  /** Custom error handler */
  onError?: ErrorBoundaryConfig['onError']
}

/**
 * BlogErrorBoundary
 * 
 * Error boundary for blog and article pages.
 * Provides blog-specific error messaging and navigation options.
 */
export function BlogErrorBoundary({ children, onError }: BlogErrorBoundaryProps) {
  const config: ErrorBoundaryConfig = {
    featureName: 'Blog',
    title: 'Unable to load article',
    description: "We're having trouble loading this content. Please try again or browse other articles.",
    icon: (
      <div className="relative">
        <FileText className="h-16 w-16 text-gray-400 mx-auto" />
        <RefreshCw className="absolute -bottom-1 -right-1 h-8 w-8 text-blue-400" />
      </div>
    ),
    primaryAction: {
      label: 'Browse All Articles',
      href: '/blog',
    },
    secondaryAction: {
      label: 'Go to Homepage',
      href: '/',
    },
    bgColor: 'bg-blue-50',
    accentColor: 'text-blue-500',
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

export default BlogErrorBoundary
