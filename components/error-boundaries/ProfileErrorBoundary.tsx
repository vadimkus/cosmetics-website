'use client'

import { ReactNode } from 'react'
import { UserCircle, AlertCircle } from 'lucide-react'
import { BaseErrorBoundary, ErrorBoundaryConfig } from './BaseErrorBoundary'

interface ProfileErrorBoundaryProps {
  children: ReactNode
  /** Custom error handler */
  onError?: ErrorBoundaryConfig['onError']
}

/**
 * ProfileErrorBoundary
 * 
 * Error boundary for user profile and account pages.
 * Provides profile-specific error messaging and account recovery options.
 */
export function ProfileErrorBoundary({ children, onError }: ProfileErrorBoundaryProps) {
  const config: ErrorBoundaryConfig = {
    featureName: 'Profile',
    title: 'Unable to load profile',
    description: "We couldn't load your profile information. Please try again or contact support if the issue persists.",
    icon: (
      <div className="relative">
        <UserCircle className="h-16 w-16 text-gray-400 mx-auto" />
        <AlertCircle className="absolute -bottom-1 -right-1 h-8 w-8 text-amber-500" />
      </div>
    ),
    primaryAction: {
      label: 'Try Logging In Again',
      href: '/login',
    },
    secondaryAction: {
      label: 'Contact Support',
      href: 'https://wa.me/971585487665',
    },
    bgColor: 'bg-blue-50',
    accentColor: 'text-blue-500',
    showHomeLink: true,
    showRetry: true,
    onError,
  }

  return (
    <BaseErrorBoundary config={config}>
      {children}
    </BaseErrorBoundary>
  )
}

export default ProfileErrorBoundary
