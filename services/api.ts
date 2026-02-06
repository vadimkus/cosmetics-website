/**
 * Base API client with centralized error handling, CSRF, and type safety.
 *
 * All service modules should use this client instead of raw fetch().
 */

import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog, debugLog } from '@/lib/logger'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T
  ok: true
}

export interface ApiError {
  ok: false
  status: number
  message: string
  /** Raw body text when JSON parsing fails */
  raw?: string
}

export type ApiResult<T> = ApiResponse<T> | ApiError

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** JSON body – automatically stringified */
  body?: Record<string, unknown> | unknown[] | undefined
  /** Include CSRF token (default: true for mutations) */
  csrf?: boolean | undefined
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isApiError(result: ApiResult<unknown>): result is ApiError {
  return !result.ok
}

async function ensureCsrf(): Promise<void> {
  try {
    await fetchCsrfToken()
  } catch {
    debugLog('[api] CSRF token fetch failed – continuing without token')
  }
}

// ---------------------------------------------------------------------------
// Core request function
// ---------------------------------------------------------------------------

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const { body, csrf, headers: extraHeaders, ...rest } = options
  const method = (rest.method ?? 'GET').toUpperCase()
  const isMutation = method !== 'GET' && method !== 'HEAD'

  // CSRF for mutations unless explicitly disabled
  if (isMutation && csrf !== false) {
    await ensureCsrf()
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extraHeaders as Record<string, string>),
  }

  // Add CSRF headers for mutations
  if (isMutation && csrf !== false) {
    const csrfHeaders = getCsrfHeaders()
    Object.assign(headers, csrfHeaders)
  }

  let finalBody: string | undefined
  if (body !== undefined) {
    const enriched = isMutation && csrf !== false
      ? addCsrfToBody(body as Record<string, unknown>)
      : body
    finalBody = JSON.stringify(enriched)
  }

  try {
    const res = await fetch(endpoint, {
      ...rest,
      method,
      headers,
      ...(finalBody !== undefined ? { body: finalBody } : {}),
    })

    // Try parsing JSON
    let data: T
    const text = await res.text()
    try {
      data = JSON.parse(text) as T
    } catch {
      if (!res.ok) {
        return { ok: false, status: res.status, message: res.statusText, raw: text }
      }
      // Non-JSON success (shouldn't normally happen)
      data = text as unknown as T
    }

    if (!res.ok) {
      const msg =
        (data as Record<string, unknown>)?.error ??
        (data as Record<string, unknown>)?.message ??
        res.statusText
      return { ok: false, status: res.status, message: String(msg) }
    }

    return { ok: true, data }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    errorLog('[api] Request failed:', endpoint, message)
    return { ok: false, status: 0, message }
  }
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

export const api = {
  get: <T>(endpoint: string, opts?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<T>(endpoint, { ...opts, method: 'GET' }),

  post: <T>(endpoint: string, body?: Record<string, unknown> | unknown[], opts?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<T>(endpoint, { ...opts, method: 'POST', body }),

  put: <T>(endpoint: string, body?: Record<string, unknown> | unknown[], opts?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<T>(endpoint, { ...opts, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: Record<string, unknown> | unknown[], opts?: Omit<RequestOptions, 'body' | 'method'>) =>
    request<T>(endpoint, { ...opts, method: 'PATCH', body }),

  delete: <T>(endpoint: string, opts?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...opts, method: 'DELETE' }),

  /** Type guard for checking API errors */
  isError: isApiError,
}

export default api
