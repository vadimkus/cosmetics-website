import { NextRequest } from 'next/server'
import { extractTokenFromHeader, validateMobileAuth } from '@/lib/jwt'
import { validateCsrfToken } from '@/lib/csrf'

type ReviewMutationAuth =
  | { valid: true; mobileEmail: string | null }
  | { valid: false; error: string; status: number }

/**
 * Browser review writes use the existing double-submit CSRF protection.
 * Native app writes cannot use browser cookies, so they authenticate with the
 * same API-key + JWT pair as every protected /api/mobile endpoint.
 */
export async function validateReviewMutationAuth(
  request: NextRequest
): Promise<ReviewMutationAuth> {
  const apiKey = request.headers.get('x-api-key')
  const token = extractTokenFromHeader(request.headers.get('Authorization'))
  const hasMobileCredentials = Boolean(apiKey || token)

  if (hasMobileCredentials) {
    const mobileAuth = validateMobileAuth(apiKey, token)
    if (!mobileAuth.valid || !mobileAuth.payload?.email) {
      return {
        valid: false,
        error: mobileAuth.error || 'Mobile authentication required',
        status: mobileAuth.status || 401,
      }
    }

    return { valid: true, mobileEmail: mobileAuth.payload.email }
  }

  const csrfCheck = await validateCsrfToken(request)
  if (!csrfCheck.valid) {
    return {
      valid: false,
      error: csrfCheck.error || 'Invalid CSRF token',
      status: 403,
    }
  }

  return { valid: true, mobileEmail: null }
}
