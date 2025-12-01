/**
 * Standardized error handling for Next.js API routes
 * Provides consistent error responses across all API endpoints
 */

import { NextResponse } from 'next/server'
import { errorLog } from '@/lib/logger'
import { errorHandling } from '@/lib/errorHandling'

/**
 * Standard error response structure
 */
interface ApiErrorResponse {
  error: string
  message: string
  details?: {
    message?: string
    stack?: string
    timestamp?: string
  }
}

/**
 * Handle API errors consistently
 * @param error - The error that occurred
 * @param context - Additional context about where the error occurred
 * @returns NextResponse with appropriate error status and message
 */
export function handleApiError(
  error: unknown,
  context?: string
): NextResponse<ApiErrorResponse> {
  // Log the error with context
  const errorContext = context ? `[${context}]` : ''
  errorLog(`❌ API Error ${errorContext}:`, error)

  // Convert to AppError using errorHandling utilities
  const appError = errorHandling.handleApiError(error)

  // Determine appropriate status code
  const statusCode = appError.statusCode || 500

  // Build error response
  const errorResponse: ApiErrorResponse = {
    error: appError.code || 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? errorHandling.getUserFriendlyMessage(appError)
      : appError.message,
  }

  // Include details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = {
      message: appError.message,
      ...(appError.stack && { stack: appError.stack }),
      timestamp: appError.timestamp.toISOString(),
    }
  }

  return NextResponse.json(errorResponse, { status: statusCode })
}

/**
 * Handle validation errors
 * @param errors - Validation error object with field names as keys
 * @returns NextResponse with 400 status
 */
export function handleValidationError(
  errors: Record<string, string[]>
): NextResponse<ApiErrorResponse> {
  const validationError = errorHandling.handleValidationError(errors)
  
  const response: ApiErrorResponse = {
    error: 'VALIDATION_ERROR',
    message: validationError.message,
  }
  
  if (process.env.NODE_ENV === 'development') {
    response.details = {
      message: validationError.message,
      timestamp: validationError.timestamp.toISOString(),
    }
  }
  
  return NextResponse.json(response, { status: 400 })
}

/**
 * Handle not found errors
 * @param resource - Name of the resource that was not found
 * @returns NextResponse with 404 status
 */
export function handleNotFoundError(resource: string = 'Resource'): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: 'NOT_FOUND',
      message: `${resource} not found`,
    },
    { status: 404 }
  )
}

/**
 * Handle unauthorized errors
 * @param message - Optional custom message
 * @returns NextResponse with 401 status
 */
export function handleUnauthorizedError(message?: string): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: 'UNAUTHORIZED',
      message: message || 'Authentication required',
    },
    { status: 401 }
  )
}

/**
 * Handle forbidden errors
 * @param message - Optional custom message
 * @returns NextResponse with 403 status
 */
export function handleForbiddenError(message?: string): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: 'FORBIDDEN',
      message: message || 'You do not have permission to perform this action',
    },
    { status: 403 }
  )
}

/**
 * Wrapper for API route handlers with automatic error handling
 * @param handler - The API route handler function
 * @param context - Context name for error logging
 * @returns Wrapped handler with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<NextResponse>>(
  handler: T,
  context?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error, context)
    }
  }) as T
}

