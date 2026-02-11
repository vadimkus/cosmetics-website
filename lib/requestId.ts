/**
 * Request ID Helper
 * 
 * Extracts the request correlation ID set by middleware.ts.
 * Use this in API routes and server components for logging
 * and error tracking.
 * 
 * Usage:
 *   import { getRequestId } from '@/lib/requestId'
 *   const requestId = getRequestId(request)
 *   logger.info(`[${requestId}] Processing order...`)
 */

import { headers } from 'next/headers'

/**
 * Get request ID from the current request context (Server Components / API Routes)
 */
export async function getRequestId(): Promise<string> {
  try {
    const headersList = await headers()
    return headersList.get('x-request-id') || generateFallbackId()
  } catch {
    return generateFallbackId()
  }
}

/**
 * Get request ID from a NextRequest object (API Routes)
 */
export function getRequestIdFromRequest(request: Request): string {
  return request.headers.get('x-request-id') || generateFallbackId()
}

/**
 * Generate a fallback request ID if middleware didn't set one
 */
function generateFallbackId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)
  return `req_${timestamp}_${random}`
}

export default { getRequestId, getRequestIdFromRequest }
