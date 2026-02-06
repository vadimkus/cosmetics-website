/**
 * Enhanced error tracking integration
 * Integrates with existing error handling and monitoring
 */

import React from 'react'
import { trackError, trackMessage, addBreadcrumb, setUserContext } from './monitoring'
import { errorHandling, CustomError, ErrorType, ErrorSeverity } from './errorHandling'

/**
 * Enhanced error tracking that integrates with monitoring services
 */
export const enhancedErrorTracking = {
  /**
   * Track error with enhanced context
   */
  trackError: async (error: Error, context?: {
    userId?: string
    userEmail?: string
    sessionId?: string
    url?: string
    userAgent?: string
    severity?: 'low' | 'medium' | 'high' | 'critical'
    tags?: Record<string, string>
    extra?: Record<string, unknown>
  }): Promise<void> => {
    // Add breadcrumb before tracking
    await addBreadcrumb(`Error occurred: ${error.message}`, 'error', 'error')
    
    // Track with monitoring services
    await trackError(error, context)
    
    // Also log with existing error handling system
    const appError = error instanceof CustomError ? error : errorHandling.createError(
      error.message,
      ErrorType.UNKNOWN,
      context?.severity === 'critical' ? ErrorSeverity.CRITICAL : 
      context?.severity === 'high' ? ErrorSeverity.HIGH :
      context?.severity === 'medium' ? ErrorSeverity.MEDIUM : ErrorSeverity.LOW,
      context
    )
    
    errorHandling.logError(appError, 
      context?.severity === 'critical' ? ErrorSeverity.CRITICAL : 
      context?.severity === 'high' ? ErrorSeverity.HIGH :
      context?.severity === 'medium' ? ErrorSeverity.MEDIUM : ErrorSeverity.LOW
    )
  },

  /**
   * Track API errors
   */
  trackApiError: async (
    endpoint: string,
    method: string,
    error: Error,
    statusCode?: number,
    context?: {
      userId?: string
      userEmail?: string
      requestBody?: unknown
      responseBody?: unknown
    }
  ): Promise<void> => {
    await addBreadcrumb(`API Error: ${method} ${endpoint}`, 'api-error', 'error')
    
    await trackError(error, {
      ...context,
      tags: {
        endpoint,
        method,
        statusCode: statusCode?.toString() || 'unknown',
        type: 'api_error'
      },
      severity: statusCode && statusCode >= 500 ? 'high' : 'medium',
      extra: {
        requestBody: context?.requestBody,
        responseBody: context?.responseBody
      }
    })
  },

  /**
   * Track client-side errors
   */
  trackClientError: async (
    error: Error,
    component?: string,
    context?: {
      userId?: string
      userEmail?: string
      url?: string
      userAgent?: string
    }
  ): Promise<void> => {
    await addBreadcrumb(`Client Error in ${component || 'unknown component'}`, 'client-error', 'error')
    
    await trackError(error, {
      ...context,
      tags: {
        component: component || 'unknown',
        type: 'client_error'
      },
      severity: 'medium'
    })
  },

  /**
   * Track database errors
   */
  trackDatabaseError: async (
    error: Error,
    operation: string,
    context?: {
      userId?: string
      userEmail?: string
      query?: string
      table?: string
    }
  ): Promise<void> => {
    await addBreadcrumb(`Database Error: ${operation}`, 'database-error', 'error')
    
    await trackError(error, {
      ...context,
      tags: {
        operation,
        table: context?.table || 'unknown',
        type: 'database_error'
      },
      severity: 'high',
      extra: {
        query: context?.query
      }
    })
  },

  /**
   * Track authentication errors
   */
  trackAuthError: async (
    error: Error,
    action: string,
    context?: {
      userId?: string
      userEmail?: string
      ipAddress?: string
      userAgent?: string
    }
  ): Promise<void> => {
    await addBreadcrumb(`Auth Error: ${action}`, 'auth-error', 'error')
    
    await trackError(error, {
      ...context,
      tags: {
        action,
        type: 'auth_error'
      },
      severity: 'high',
      extra: {
        ipAddress: context?.ipAddress
      }
    })
  },

  /**
   * Track payment errors
   */
  trackPaymentError: async (
    error: Error,
    paymentMethod: string,
    amount?: number,
    context?: {
      userId?: string
      userEmail?: string
      orderId?: string
    }
  ): Promise<void> => {
    await addBreadcrumb(`Payment Error: ${paymentMethod}`, 'payment-error', 'error')
    
    await trackError(error, {
      ...context,
      tags: {
        paymentMethod,
        type: 'payment_error'
      },
      severity: 'critical',
      extra: {
        amount,
        orderId: context?.orderId
      }
    })
  },

  /**
   * Track performance issues
   */
  trackPerformanceIssue: async (
    issue: string,
    metrics: {
      duration?: number
      memoryUsage?: number
      bundleSize?: number
    },
    context?: {
      userId?: string
      userEmail?: string
      url?: string
    }
  ): Promise<void> => {
    await addBreadcrumb(`Performance Issue: ${issue}`, 'performance', 'warning')
    
    await trackMessage(`Performance Issue: ${issue}`, 'warning', {
      ...context,
      tags: {
        type: 'performance_issue'
      },
      extra: metrics
    })
  },

  /**
   * Set user context for all tracking
   */
  setUser: async (userId: string, userEmail?: string, extra?: Record<string, any>): Promise<void> => {
    await setUserContext(userId, userEmail, extra)
  },

  /**
   * Track user journey
   */
  trackUserJourney: async (
    step: string,
    context?: {
      userId?: string
      userEmail?: string
      fromPage?: string
      toPage?: string
    }
  ): Promise<void> => {
    await addBreadcrumb(`User Journey: ${step}`, 'user-journey', 'info')
    
    await trackMessage(`User Journey: ${step}`, 'info', {
      ...context,
      tags: {
        type: 'user_journey',
        step
      }
    })
  }
}

/**
 * React Error Boundary integration
 */
export const withErrorTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  return class ErrorBoundaryComponent extends React.Component<P, { hasError: boolean; error?: Error }> {
    constructor(props: P) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
      return { hasError: true, error }
    }

    override componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
      enhancedErrorTracking.trackClientError(error, componentName, {
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : ''
      })
    }

    override render() {
      if (this.state.hasError && this.state.error) {
        return React.createElement('div', {
          className: "min-h-screen flex items-center justify-center bg-white"
        }, React.createElement('div', {
          className: "text-center"
        }, React.createElement('h1', {
          className: "text-2xl font-bold text-gray-800 mb-4"
        }, "Something went wrong"), React.createElement('p', {
          className: "text-gray-600 mb-6"
        }, "We are notified already via alert mail and will fix it shortly."), React.createElement('button', {
          onClick: () => this.setState({ hasError: false }),
          className: "bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        }, "Try Again")))
      }

      return React.createElement(Component, this.props)
    }
  }
}

/**
 * API route error tracking wrapper
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Legacy Pages Router handler pattern
export const withApiErrorTracking = (
  handler: (req: any, res: any) => Promise<any>
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: any, res: any) => {
    try {
      return await handler(req, res)
    } catch (error) {
      await enhancedErrorTracking.trackApiError(
        req.url || 'unknown',
        req.method || 'unknown',
        error as Error,
        res.statusCode,
        {
          userId: req.user?.id,
          userEmail: req.user?.email,
          requestBody: req.body,
          responseBody: res.body
        }
      )
      throw error
    }
  }
}

export default enhancedErrorTracking
