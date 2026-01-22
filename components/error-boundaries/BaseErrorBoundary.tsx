'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { errorLog } from '@/lib/logger'

/**
 * Error Boundary Configuration
 * 
 * Allows feature-specific customization of error handling and UI.
 */
export interface ErrorBoundaryConfig {
  /** Feature name for error reporting */
  featureName: string
  /** Custom title for error state */
  title?: string
  /** Custom description for error state */
  description?: string
  /** Custom icon component */
  icon?: ReactNode
  /** Primary action button config */
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /** Secondary action button config */
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  /** Background color class */
  bgColor?: string
  /** Accent color class */
  accentColor?: string
  /** Whether to show "Go Home" link */
  showHomeLink?: boolean
  /** Whether to show retry button */
  showRetry?: boolean
  /** Custom error reporter function */
  onError?: ((error: Error, errorInfo: ErrorInfo, featureName: string) => void) | undefined
}

export interface BaseErrorBoundaryProps {
  children: ReactNode
  config: ErrorBoundaryConfig
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | undefined
  errorInfo: ErrorInfo | undefined
}

/**
 * BaseErrorBoundary
 * 
 * A configurable error boundary that can be customized for different features.
 * Provides consistent error handling while allowing feature-specific UI.
 */
export class BaseErrorBoundary extends Component<BaseErrorBoundaryProps, State> {
  constructor(props: BaseErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: undefined, errorInfo: undefined }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { config } = this.props
    
    // Log error with feature context
    errorLog(`[${config.featureName}] Error caught:`, error, errorInfo)
    
    this.setState({ errorInfo })
    
    // Call custom error handler if provided
    if (config.onError) {
      config.onError(error, errorInfo, config.featureName)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  override render() {
    const { hasError, error } = this.state
    const { children, config, fallback } = this.props

    if (!hasError) {
      return children
    }

    // Use custom fallback if provided
    if (fallback) {
      return fallback
    }

    const {
      featureName,
      title = 'Something went wrong',
      description = "We're sorry, but something unexpected happened. Please try again.",
      icon,
      primaryAction,
      secondaryAction,
      bgColor = 'bg-gray-50',
      accentColor = 'text-red-500',
      showHomeLink = true,
      showRetry = true,
    } = config

    return (
      <div className={`min-h-[400px] flex items-center justify-center ${bgColor} rounded-xl p-6`}>
        <div className="max-w-md mx-auto text-center">
          {/* Icon */}
          <div className="mb-6">
            {icon || <AlertTriangle className={`h-16 w-16 ${accentColor} mx-auto`} />}
          </div>

          {/* Title & Description */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>

          {/* Actions */}
          <div className="space-y-3">
            {/* Primary Action */}
            {primaryAction && (
              primaryAction.href ? (
                <Link
                  href={primaryAction.href}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  {primaryAction.label}
                </Link>
              ) : (
                <button
                  onClick={primaryAction.onClick}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  {primaryAction.label}
                </button>
              )
            )}

            {/* Retry Button */}
            {showRetry && (
              <button
                onClick={this.handleRetry}
                className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            )}

            {/* Secondary Action */}
            {secondaryAction && (
              secondaryAction.href ? (
                <Link
                  href={secondaryAction.href}
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {secondaryAction.label}
                </Link>
              ) : (
                <button
                  onClick={secondaryAction.onClick}
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {secondaryAction.label}
                </button>
              )
            )}

            {/* Home Link */}
            {showHomeLink && !primaryAction?.href?.includes('/') && (
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Home className="h-4 w-4" />
                Return to Homepage
              </Link>
            )}
          </div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details ({featureName})
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto max-h-48">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }
}

export default BaseErrorBoundary
