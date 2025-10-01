/**
 * External monitoring and error tracking utilities
 * Supports multiple monitoring services for production error tracking
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
  extra?: Record<string, any>
}

export interface PerformanceMetrics {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count'
  tags?: Record<string, string>
  timestamp?: Date
}

/**
 * Base monitoring service interface
 */
abstract class MonitoringService {
  abstract init(): Promise<void>
  abstract captureError(error: Error, context?: ErrorContext): Promise<void>
  abstract captureMessage(message: string, level: 'info' | 'warning' | 'error', context?: ErrorContext): Promise<void>
  abstract capturePerformance(metrics: PerformanceMetrics): Promise<void>
  abstract setUser(userId: string, userEmail?: string, extra?: Record<string, any>): Promise<void>
  abstract addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error'): Promise<void>
}

/**
 * Console monitoring service (development)
 */
class ConsoleMonitoringService extends MonitoringService {
  async init(): Promise<void> {
    console.log('🔍 Console monitoring initialized')
  }

  async captureError(error: Error, context?: ErrorContext): Promise<void> {
    console.group('🚨 Error Captured')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    if (context) {
      console.log('Context:', context)
    }
    console.groupEnd()
  }

  async captureMessage(message: string, level: 'info' | 'warning' | 'error', context?: ErrorContext): Promise<void> {
    const emoji = level === 'error' ? '🚨' : level === 'warning' ? '⚠️' : 'ℹ️'
    console.log(`${emoji} ${message}`, context || '')
  }

  async capturePerformance(metrics: PerformanceMetrics): Promise<void> {
    console.log(`📊 Performance: ${metrics.name} = ${metrics.value}${metrics.unit}`, metrics.tags || '')
  }

  async setUser(userId: string, userEmail?: string, extra?: Record<string, any>): Promise<void> {
    console.log(`👤 User set: ${userId} (${userEmail})`, extra || '')
  }

  async addBreadcrumb(message: string, category?: string, _level?: 'info' | 'warning' | 'error'): Promise<void> {
    console.log(`🍞 Breadcrumb [${category || 'default'}]: ${message}`)
  }
}

/**
 * Sentry monitoring service (production)
 */
class SentryMonitoringService extends MonitoringService {
  private sentry: any = null

  async init(): Promise<void> {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        // Dynamic import to avoid bundling in development
        const Sentry = await import('@sentry/nextjs')
        this.sentry = Sentry
        console.log('🔍 Sentry monitoring initialized')
      } catch (error) {
        console.warn('Sentry not available:', error)
      }
    }
  }

  async captureError(error: Error, context?: ErrorContext): Promise<void> {
    if (!this.sentry) return

    this.sentry.captureException(error, {
      tags: context?.tags,
      user: context?.userId ? { id: context.userId, email: context.userEmail } : undefined,
      extra: context?.extra,
      level: context?.severity === 'critical' ? 'fatal' : context?.severity || 'error'
    })
  }

  async captureMessage(message: string, level: 'info' | 'warning' | 'error', context?: ErrorContext): Promise<void> {
    if (!this.sentry) return

    this.sentry.captureMessage(message, level, {
      tags: context?.tags,
      user: context?.userId ? { id: context.userId, email: context.userEmail } : undefined,
      extra: context?.extra
    })
  }

  async capturePerformance(metrics: PerformanceMetrics): Promise<void> {
    if (!this.sentry) return

    this.sentry.addBreadcrumb({
      message: `Performance: ${metrics.name}`,
      category: 'performance',
      data: {
        value: metrics.value,
        unit: metrics.unit,
        tags: metrics.tags
      }
    })
  }

  async setUser(userId: string, userEmail?: string, extra?: Record<string, any>): Promise<void> {
    if (!this.sentry) return

    this.sentry.setUser({
      id: userId,
      email: userEmail,
      ...extra
    })
  }

  async addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error'): Promise<void> {
    if (!this.sentry) return

    this.sentry.addBreadcrumb({
      message,
      category: category || 'default',
      level: level || 'info'
    })
  }
}

/**
 * LogRocket monitoring service (production)
 */
class LogRocketMonitoringService extends MonitoringService {
  private logRocket: any = null

  async init(): Promise<void> {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        // Dynamic import to avoid bundling in development
        const LogRocket = await import('logrocket')
        this.logRocket = LogRocket.default
        console.log('🔍 LogRocket monitoring initialized')
      } catch (error) {
        console.warn('LogRocket not available:', error)
      }
    }
  }

  async captureError(error: Error, _context?: ErrorContext): Promise<void> {
    if (!this.logRocket) return

    this.logRocket.captureException(error)
  }

  async captureMessage(message: string, level: 'info' | 'warning' | 'error', context?: ErrorContext): Promise<void> {
    if (!this.logRocket) return

    this.logRocket.log(message, {
      level,
      context
    })
  }

  async capturePerformance(metrics: PerformanceMetrics): Promise<void> {
    if (!this.logRocket) return

    this.logRocket.log(`Performance: ${metrics.name}`, {
      value: metrics.value,
      unit: metrics.unit,
      tags: metrics.tags
    })
  }

  async setUser(userId: string, userEmail?: string, extra?: Record<string, any>): Promise<void> {
    if (!this.logRocket) return

    this.logRocket.identify(userId, {
      email: userEmail,
      ...extra
    })
  }

  async addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error'): Promise<void> {
    if (!this.logRocket) return

    this.logRocket.log(`Breadcrumb: ${message}`, {
      category,
      level
    })
  }
}

/**
 * Monitoring manager that coordinates multiple services
 */
class MonitoringManager {
  private services: MonitoringService[] = []
  private initialized = false

  constructor() {
    // Add services based on environment
    if (process.env.NODE_ENV === 'production') {
      this.services.push(new SentryMonitoringService())
      this.services.push(new LogRocketMonitoringService())
    } else {
      this.services.push(new ConsoleMonitoringService())
    }
  }

  async init(): Promise<void> {
    if (this.initialized) return

    await Promise.all(this.services.map(service => service.init()))
    this.initialized = true
    console.log('🔍 Monitoring manager initialized with', this.services.length, 'services')
  }

  async captureError(error: Error, context?: ErrorContext): Promise<void> {
    await this.init()
    await Promise.all(this.services.map(service => 
      service.captureError(error, context).catch(console.warn)
    ))
  }

  async captureMessage(message: string, level: 'info' | 'warning' | 'error', context?: ErrorContext): Promise<void> {
    await this.init()
    await Promise.all(this.services.map(service => 
      service.captureMessage(message, level, context).catch(console.warn)
    ))
  }

  async capturePerformance(metrics: PerformanceMetrics): Promise<void> {
    await this.init()
    await Promise.all(this.services.map(service => 
      service.capturePerformance(metrics).catch(console.warn)
    ))
  }

  async setUser(userId: string, userEmail?: string, extra?: Record<string, any>): Promise<void> {
    await this.init()
    await Promise.all(this.services.map(service => 
      service.setUser(userId, userEmail, extra).catch(console.warn)
    ))
  }

  async addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error'): Promise<void> {
    await this.init()
    await Promise.all(this.services.map(service => 
      service.addBreadcrumb(message, category, level).catch(console.warn)
    ))
  }
}

// Global monitoring instance
const monitoring = new MonitoringManager()

/**
 * Enhanced error tracking with context
 */
export const trackError = async (error: Error, context?: ErrorContext): Promise<void> => {
  await monitoring.captureError(error, {
    ...context,
    timestamp: new Date(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : ''
  })
}

/**
 * Track custom messages
 */
export const trackMessage = async (
  message: string, 
  level: 'info' | 'warning' | 'error' = 'info',
  context?: ErrorContext
): Promise<void> => {
  await monitoring.captureMessage(message, level, {
    ...context,
    timestamp: new Date()
  })
}

/**
 * Track performance metrics
 */
export const trackPerformance = async (metrics: PerformanceMetrics): Promise<void> => {
  await monitoring.capturePerformance({
    ...metrics,
    timestamp: new Date()
  })
}

/**
 * Set user context for all monitoring services
 */
export const setUserContext = async (
  userId: string, 
  userEmail?: string, 
  extra?: Record<string, any>
): Promise<void> => {
  await monitoring.setUser(userId, userEmail, extra)
}

/**
 * Add breadcrumb for user journey tracking
 */
export const addBreadcrumb = async (
  message: string, 
  category?: string, 
  level?: 'info' | 'warning' | 'error'
): Promise<void> => {
  await monitoring.addBreadcrumb(message, category, level)
}

/**
 * Initialize monitoring services
 */
export const initMonitoring = async (): Promise<void> => {
  await monitoring.init()
}

/**
 * Track page views
 */
export const trackPageView = async (page: string, context?: ErrorContext): Promise<void> => {
  await trackMessage(`Page view: ${page}`, 'info', context)
  await addBreadcrumb(`Viewed ${page}`, 'navigation', 'info')
}

/**
 * Track user actions
 */
export const trackUserAction = async (action: string, context?: ErrorContext): Promise<void> => {
  await trackMessage(`User action: ${action}`, 'info', context)
  await addBreadcrumb(`Action: ${action}`, 'user-action', 'info')
}

/**
 * Track API calls
 */
export const trackApiCall = async (
  endpoint: string, 
  method: string, 
  status: number, 
  duration?: number,
  context?: ErrorContext
): Promise<void> => {
  const level = status >= 400 ? 'error' : 'info'
  await trackMessage(`API ${method} ${endpoint} - ${status}`, level, context)
  
  if (duration) {
    await trackPerformance({
      name: 'api_call_duration',
      value: duration,
      unit: 'ms',
      tags: { endpoint, method, status: status.toString() }
    })
  }
}

export default monitoring
