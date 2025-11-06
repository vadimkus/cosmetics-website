import { warnLog } from '@/lib/logger'
/**
 * Request body size limit middleware
 * Prevents DoS attacks via large payloads
 */

import { NextRequest, NextResponse } from 'next/server'

// Request size limits (in bytes)
export const REQUEST_SIZE_LIMITS = {
  JSON: 1024 * 1024, // 1MB for JSON payloads
  FORM_DATA: 10 * 1024 * 1024, // 10MB for form data (includes file uploads)
  TEXT: 512 * 1024, // 512KB for plain text
  DEFAULT: 1024 * 1024, // 1MB default
} as const

/**
 * Check if request body size exceeds limits
 */
export function checkRequestBodySize(
  request: NextRequest,
  maxSize: number = REQUEST_SIZE_LIMITS.JSON
): { valid: boolean; size?: number; maxSize?: number; response?: NextResponse } {
  const contentLength = request.headers.get('content-length')
  
  if (!contentLength) {
    // No content-length header - we'll need to check during body parsing
    // This is a warning but not a blocker (some requests don't have content-length)
    return { valid: true }
  }
  
  const bodySize = parseInt(contentLength, 10)
  
  if (isNaN(bodySize)) {
    // Invalid content-length - allow through but log warning
    warnLog('Invalid content-length header:', contentLength)
    return { valid: true }
  }
  
  if (bodySize > maxSize) {
    return {
      valid: false,
      size: bodySize,
      maxSize,
      response: NextResponse.json(
        {
          error: 'Request body too large',
          message: `Request body size (${(bodySize / 1024).toFixed(1)}KB) exceeds maximum allowed size (${(maxSize / 1024).toFixed(1)}KB)`,
          maxSize: `${(maxSize / 1024 / 1024).toFixed(1)}MB`,
        },
        { status: 413 } // 413 Payload Too Large
      ),
    }
  }
  
  return { valid: true, size: bodySize, maxSize }
}

/**
 * Middleware wrapper to enforce request body size limits
 * Use this in API routes before parsing the request body
 */
export function requireBodySizeLimit(
  request: NextRequest,
  maxSize: number = REQUEST_SIZE_LIMITS.JSON
): { valid: boolean; response?: NextResponse } {
  const check = checkRequestBodySize(request, maxSize)
  
  if (!check.valid) {
    if (check.response) {
      return {
        valid: false,
        response: check.response,
      }
    }
    // If no response, return error response
    return {
      valid: false,
      response: NextResponse.json(
        {
          error: 'Request body too large',
          message: 'Request body size exceeds maximum allowed size',
        },
        { status: 413 }
      ),
    }
  }
  
  return { valid: true }
}

/**
 * Get appropriate size limit based on content type
 */
export function getSizeLimitForContentType(request: NextRequest): number {
  const contentType = request.headers.get('content-type') || ''
  
  if (contentType.includes('multipart/form-data')) {
    return REQUEST_SIZE_LIMITS.FORM_DATA
  }
  
  if (contentType.includes('application/json')) {
    return REQUEST_SIZE_LIMITS.JSON
  }
  
  if (contentType.includes('text/')) {
    return REQUEST_SIZE_LIMITS.TEXT
  }
  
  return REQUEST_SIZE_LIMITS.DEFAULT
}

