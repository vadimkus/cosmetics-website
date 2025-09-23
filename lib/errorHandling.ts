/**
 * Comprehensive error handling utilities
 */

import React from 'react'

export interface AppError extends Error {
  code?: string
  statusCode?: number
  context?: Record<string, any>
  timestamp: Date
  userId?: string
  sessionId?: string
}

export class CustomError extends Error implements AppError {
  public code?: string
  public statusCode?: number
  public context?: Record<string, any>
  public timestamp: Date
  public userId?: string
  public sessionId?: string

  constructor(
    message: string,
    options: {
      code?: string
      statusCode?: number
      context?: Record<string, any>
      userId?: string
      sessionId?: string
    } = {}
  ) {
    super(message)
    this.name = 'CustomError'
    this.code = options.code
    this.statusCode = options.statusCode
    this.context = options.context
    this.timestamp = new Date()
    this.userId = options.userId
    this.sessionId = options.sessionId
  }
}

/**
 * Error types for better categorization
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  NETWORK = 'NETWORK_ERROR',
  SERVER = 'SERVER_ERROR',
  CLIENT = 'CLIENT_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Error handling utilities
 */
export const errorHandling = {
  /**
   * Create a standardized error
   */
  createError: (
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, any>
  ): AppError => {
    const error = new CustomError(message, {
      code: type,
      statusCode: errorHandling.getStatusCode(type),
      context
    })
    
    errorHandling.logError(error, severity)
    return error
  },

  /**
   * Get appropriate HTTP status code for error type
   */
  getStatusCode: (type: ErrorType): number => {
    switch (type) {
      case ErrorType.VALIDATION:
        return 400
      case ErrorType.AUTHENTICATION:
        return 401
      case ErrorType.AUTHORIZATION:
        return 403
      case ErrorType.NOT_FOUND:
        return 404
      case ErrorType.NETWORK:
        return 503
      case ErrorType.SERVER:
        return 500
      case ErrorType.CLIENT:
        return 400
      default:
        return 500
    }
  },

  /**
   * Log error with appropriate level
   */
  logError: (error: AppError, severity: ErrorSeverity = ErrorSeverity.MEDIUM) => {
    const logData = {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      context: error.context,
      timestamp: error.timestamp,
      userId: error.userId,
      sessionId: error.sessionId,
      stack: error.stack
    }

    switch (severity) {
      case ErrorSeverity.LOW:
        console.info('Error (Low):', logData)
        break
      case ErrorSeverity.MEDIUM:
        console.warn('Error (Medium):', logData)
        break
      case ErrorSeverity.HIGH:
        console.error('Error (High):', logData)
        break
      case ErrorSeverity.CRITICAL:
        console.error('Error (Critical):', logData)
        // In production, you might want to send to external logging service
        // errorHandling.sendToExternalLogger(logData)
        break
    }
  },

  /**
   * Handle API errors
   */
  handleApiError: (error: any): AppError => {
    if (error instanceof CustomError) {
      return error
    }

    if (error.response) {
      // Server responded with error status
      return errorHandling.createError(
        error.response.data?.message || 'Server error occurred',
        ErrorType.SERVER,
        ErrorSeverity.MEDIUM,
        {
          status: error.response.status,
          data: error.response.data
        }
      )
    } else if (error.request) {
      // Request was made but no response received
      return errorHandling.createError(
        'Network error - please check your connection',
        ErrorType.NETWORK,
        ErrorSeverity.HIGH,
        { request: error.request }
      )
    } else {
      // Something else happened
      return errorHandling.createError(
        error.message || 'An unexpected error occurred',
        ErrorType.UNKNOWN,
        ErrorSeverity.MEDIUM,
        { originalError: error }
      )
    }
  },

  /**
   * Handle validation errors
   */
  handleValidationError: (errors: Record<string, string[]>): AppError => {
    const message = Object.entries(errors)
      .map(([field, fieldErrors]) => `${field}: ${fieldErrors.join(', ')}`)
      .join('; ')

    return errorHandling.createError(
      `Validation failed: ${message}`,
      ErrorType.VALIDATION,
      ErrorSeverity.LOW,
      { validationErrors: errors }
    )
  },

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage: (error: AppError): string => {
    switch (error.code) {
      case ErrorType.VALIDATION:
        return 'Please check your input and try again.'
      case ErrorType.AUTHENTICATION:
        return 'Please log in to continue.'
      case ErrorType.AUTHORIZATION:
        return 'You do not have permission to perform this action.'
      case ErrorType.NOT_FOUND:
        return 'The requested resource was not found.'
      case ErrorType.NETWORK:
        return 'Network error. Please check your connection and try again.'
      case ErrorType.SERVER:
        return 'Server error. Please try again later.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  },

  /**
   * Retry mechanism for failed operations
   */
  retry: async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          throw errorHandling.createError(
            `Operation failed after ${maxRetries} attempts: ${lastError.message}`,
            ErrorType.SERVER,
            ErrorSeverity.HIGH,
            { attempts: maxRetries, lastError }
          )
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
      }
    }

    throw lastError!
  }
}

/**
 * Error boundary helper
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: AppError }>
) => {
  return class ErrorBoundaryWrapper extends React.Component<P, { hasError: boolean; error?: AppError }> {
    constructor(props: P) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): { hasError: boolean; error: AppError } {
      const appError = error instanceof CustomError 
        ? error 
        : errorHandling.createError(error.message, ErrorType.UNKNOWN, ErrorSeverity.MEDIUM)
      
      return { hasError: true, error: appError }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      const appError = error instanceof CustomError 
        ? error 
        : errorHandling.createError(
            error.message, 
            ErrorType.UNKNOWN, 
            ErrorSeverity.HIGH,
            { errorInfo }
          )
      
      errorHandling.logError(appError, ErrorSeverity.HIGH)
    }

    render() {
      if (this.state.hasError && this.state.error) {
        if (fallback) {
          return React.createElement(fallback, { error: this.state.error })
        }
        
        return React.createElement('div', {
          className: "min-h-screen flex items-center justify-center bg-white"
        }, React.createElement('div', {
          className: "text-center"
        }, React.createElement('h1', {
          className: "text-2xl font-bold text-gray-800 mb-4"
        }, "Something went wrong"), React.createElement('p', {
          className: "text-gray-600 mb-6"
        }, errorHandling.getUserFriendlyMessage(this.state.error)), React.createElement('button', {
          onClick: () => this.setState({ hasError: false, error: undefined }),
          className: "bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        }, "Try Again")))
      }

      return React.createElement(Component, this.props)
    }
  }
}
