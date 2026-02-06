'use client'

import { ReactNode } from 'react'
import { Shield } from 'lucide-react'
import { BaseErrorBoundary, ErrorBoundaryConfig } from './BaseErrorBoundary'

interface AdminErrorBoundaryProps {
  children: ReactNode
  /** Custom error handler */
  onError?: ErrorBoundaryConfig['onError']
}

/**
 * AdminErrorBoundary
 *
 * Error boundary for admin dashboard pages (orders, certificates, etc.).
 * Provides admin-specific error messaging and recovery options.
 */
export function AdminErrorBoundary({ children, onError }: AdminErrorBoundaryProps) {
  const config: ErrorBoundaryConfig = {
    featureName: 'Admin',
    title: 'Unable to load admin panel',
    description: 'Something went wrong loading the admin panel. Please try again or return to the dashboard.',
    icon: (
      <div className="relative">
        <Shield className="h-16 w-16 text-gray-400 mx-auto" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      </div>
    ),
    primaryAction: {
      label: 'Go to Admin Dashboard',
      href: '/admin',
    },
    secondaryAction: {
      label: 'Go to Homepage',
      href: '/',
    },
    bgColor: 'bg-gray-50',
    accentColor: 'text-red-500',
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

export default AdminErrorBoundary
