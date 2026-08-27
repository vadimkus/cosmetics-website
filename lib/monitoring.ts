import * as Sentry from '@sentry/nextjs'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * External monitoring and error tracking utilities.
 *
 * Sentry is initialized once per runtime via the Next.js instrumentation
 * hooks (see `instrumentation.ts`, `instrumentation-client.ts`, and
 * `sentry.*.config.ts`). This module provides a thin, environment-aware
 * wrapper so the rest of the codebase can emit structured events without
 * knowing whether Sentry is configured (it silently no-ops when no DSN is
 * present).
 *
 * LogRocket was dropped in April 2026 - bundle cost outweighed the value of
 * session replay for a small e-commerce surface. Reintroduce Sentry's
 * `replayIntegration()` if that need returns.
 */

export interface ErrorContext {
  userId?: string
  userEmail?: string
  sessionId?: string
  url?: string
  userAgent?: string
  timestamp?: Date
  severity?: 'low' | 'medium' | 'high' | 'critical'
  tags?: Record<string, string>
  extra?: Record<string, unknown>
}

export interface PerformanceMetrics {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count'
  tags?: Record<string, string>
  timestamp?: Date
}

type Level = 'info' | 'warning' | 'error'

// Sentry.init() is a no-op without a DSN, but we also guard here so the
// debug log channel only fires when monitoring is actually wired up.
const isEnabled = (): boolean => {
  const dsn =
    typeof window === 'undefined'
      ? process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
      : process.env.NEXT_PUBLIC_SENTRY_DSN
  return Boolean(dsn)
}

const severityToLevel = (severity?: ErrorContext['severity']): Level => {
  if (severity === 'critical' || severity === 'high') return 'error'
  if (severity === 'medium') return 'warning'
  return 'info'
}

const applyContext = (
  scope: Sentry.Scope,
  context?: ErrorContext,
  fallbackLevel?: Level
): void => {
  if (!context) {
    if (fallbackLevel) scope.setLevel(fallbackLevel)
    return
  }
  if (context.userId) {
    scope.setUser({
      id: context.userId,
      ...(context.userEmail ? { email: context.userEmail } : {}),
    })
  }
  if (context.tags) {
    Object.entries(context.tags).forEach(([key, value]) => {
      scope.setTag(key, value)
    })
  }
  if (context.extra) {
    Object.entries(context.extra).forEach(([key, value]) => {
      scope.setExtra(key, value)
    })
  }
  const level = severityToLevel(context.severity) || fallbackLevel
  if (level) scope.setLevel(level)
}

/**
 * Capture an unexpected error with optional context.
 * Falls back to `errorLog` when Sentry isn't configured so developers still
 * see the stack trace locally.
 */
export const trackError = async (
  error: Error,
  context?: ErrorContext
): Promise<void> => {
  if (!isEnabled()) {
    errorLog('[monitoring:trackError]', error.message, context || '')
    return
  }
  Sentry.withScope((scope) => {
    applyContext(scope, context, 'error')
    Sentry.captureException(error)
  })
}

/**
 * Capture a non-error message (audit trail, user journey, warnings).
 */
export const trackMessage = async (
  message: string,
  level: Level = 'info',
  context?: ErrorContext
): Promise<void> => {
  if (!isEnabled()) {
    debugLog(`[monitoring:trackMessage:${level}]`, message, context || '')
    return
  }
  Sentry.withScope((scope) => {
    applyContext(scope, context, level)
    Sentry.captureMessage(message, level)
  })
}

/**
 * Record a performance metric as a breadcrumb.
 * Avoid hot-path usage; for true metrics use Sentry spans or Web Vitals.
 */
export const trackPerformance = async (
  metrics: PerformanceMetrics
): Promise<void> => {
  if (!isEnabled()) {
    debugLog(
      `[monitoring:trackPerformance] ${metrics.name}=${metrics.value}${metrics.unit}`,
      metrics.tags || ''
    )
    return
  }
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `Performance: ${metrics.name}`,
    level: 'info',
    data: {
      value: metrics.value,
      unit: metrics.unit,
      ...(metrics.tags ? { tags: metrics.tags } : {}),
    },
  })
}

/**
 * Associate all subsequent events with a user.
 * Prefer passing a stable opaque ID; emails are scrubbed client-side in
 * `instrumentation-client.ts` to avoid shipping PII to Sentry.
 */
export const setUserContext = async (
  userId: string,
  userEmail?: string,
  extra?: Record<string, unknown>
): Promise<void> => {
  if (!isEnabled()) {
    debugLog('[monitoring:setUser]', userId, userEmail || '', extra || '')
    return
  }
  Sentry.setUser({
    id: userId,
    ...(userEmail ? { email: userEmail } : {}),
    ...(extra || {}),
  })
}

/**
 * Add a breadcrumb for journey tracking. Breadcrumbs ship only when an event
 * is captured, so they're cheap to emit liberally.
 */
export const addBreadcrumb = async (
  message: string,
  category?: string,
  level?: Level
): Promise<void> => {
  if (!isEnabled()) {
    debugLog(`[monitoring:breadcrumb:${category || 'default'}]`, message)
    return
  }
  Sentry.addBreadcrumb({
    message,
    category: category || 'default',
    level: level || 'info',
  })
}

/**
 * No-op kept for backward compatibility with existing call sites that use
 * `initMonitoring()` in Provider mount effects. Real initialization happens
 * in the Sentry instrumentation files.
 */
export const initMonitoring = async (): Promise<void> => {
  if (isEnabled()) {
    debugLog('Monitoring active (Sentry)')
  }
}

export const trackPageView = async (
  page: string,
  context?: ErrorContext
): Promise<void> => {
  await trackMessage(`Page view: ${page}`, 'info', context)
  await addBreadcrumb(`Viewed ${page}`, 'navigation', 'info')
}

export const trackUserAction = async (
  action: string,
  context?: ErrorContext
): Promise<void> => {
  await trackMessage(`User action: ${action}`, 'info', context)
  await addBreadcrumb(`Action: ${action}`, 'user-action', 'info')
}

export const trackApiCall = async (
  endpoint: string,
  method: string,
  status: number,
  duration?: number,
  context?: ErrorContext
): Promise<void> => {
  const level: Level = status >= 400 ? 'error' : 'info'
  await trackMessage(`API ${method} ${endpoint} - ${status}`, level, context)
  if (duration) {
    await trackPerformance({
      name: 'api_call_duration',
      value: duration,
      unit: 'ms',
      tags: { endpoint, method, status: status.toString() },
    })
  }
}

export default {
  trackError,
  trackMessage,
  trackPerformance,
  setUserContext,
  addBreadcrumb,
  initMonitoring,
  trackPageView,
  trackUserAction,
  trackApiCall,
}
