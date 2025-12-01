import { debugLog, errorLog, warnLog } from '@/lib/logger'
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
  extra?: Record<string, unknown>
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
    debugLog('🔍 Console monitoring initialized')
  }

  async captureError(error: Error, context?: ErrorContext): Promise<void> {
    console.group('🚨 Error Captured')
    errorLog('Error:', error.message)
    errorLog('Stack:', error.stack)
    if (context) {
      debugLog('Context:', context)
    }
    console.groupEnd()
  }

  async captureMessage(message: string, level: 'info' | 'warning' | 'error', context?: ErrorContext): Promise<void> {
    const emoji = level === 'error' ? '🚨' : level === 'warning' ? '⚠️' : 'ℹ️'
    debugLog(`${emoji} ${message}`, context || '')
  }

  async capturePerformance(metrics: PerformanceMetrics): Promise<void> {
    debugLog(`📊 Performance: ${metrics.name} = ${metrics.value}${metrics.unit}`, metrics.tags || '')
  }

  async setUser(userId: string, userEmail?: string, extra?: Record<string, any>): Promise<void> {
    debugLog(`👤 User set: ${userId} (${userEmail})`, extra || '')
  }

  async addBreadcrumb(message: string, category?: string, _level?: 'info' | 'warning' | 'error'): Promise<void> {
    debugLog(`🍞 Breadcrumb [${category || 'default'}]: ${message}`)
  }
}

/**
 * Sentry monitoring service (production)
 */
class SentryMonitoringService extends MonitoringService {
  private sentry: unknown = null

  async init(): Promise<void> {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        // Dynamic import to avoid bundling in development
        const Sentry = await import('@sentry/nextjs')
        this.sentry = Sentry
        debugLog('🔍 Sentry monitoring initialized')
      } catch (error) {
        warnLog('Sentry not available:', error)
      }
    }
  }

  async captureError(error: Error, context?: ErrorContext): Promise<void> {
    if (!this.sentry) return

    const sentry = this.sentry as { captureException: (error: Error, options?: any) => void }
    const options: {
      tags?: Record<string, string>
      user?: { id: string; email?: string }
      extra?: Record<string, unknown>
      level: string
    } = {
      level: context?.severity === 'critical' ? 'fatal' : context?.severity || 'error'
    }
    
    if (context?.tags) {
      options.tags = context.tags
    }
    
    if (context?.userId) {
      options.user = {
        id: context.userId,
        ...(context.userEmail && { email: context.userEmail })
      }
    }
    
    if (context?.extra) {
      options.extra = context.extra
    }
    
    sentry.captureException(error, options)
  }

  async captureMessage(message: string, level: 'info' | 'warning' | 'error', context?: ErrorContext): Promise<void> {
    if (!this.sentry) return

    const sentry = this.sentry as { captureMessage: (message: string, level: string, options?: any) => void }
    const options: {
      tags?: Record<string, string>
      user?: { id: string; email?: string }
      extra?: Record<string, unknown>
    } = {}
    
    if (context?.tags) {
      options.tags = context.tags
    }
    
    if (context?.userId) {
      options.user = {
        id: context.userId,
        ...(context.userEmail && { email: context.userEmail })
      }
    }
    
    if (context?.extra) {
      options.extra = context.extra
    }
    
    sentry.captureMessage(message, level, options)
  }

  async capturePerformance(metrics: PerformanceMetrics): Promise<void> {
    if (!this.sentry) return

    const sentry = this.sentry as { addBreadcrumb: (breadcrumb: any) => void }
    const breadcrumbData: {
      value: number
      unit: string
      tags?: Record<string, string>
    } = {
      value: metrics.value,
      unit: metrics.unit
    }
    
    if (metrics.tags) {
      breadcrumbData.tags = metrics.tags
    }
    
    sentry.addBreadcrumb({
      message: `Performance: ${metrics.name}`,
      category: 'performance',
      data: breadcrumbData
    })
  }

  async setUser(userId: string, userEmail?: string, extra?: Record<string, any>): Promise<void> {
    if (!this.sentry) return

    const sentry = this.sentry as { setUser: (user: any) => void }
    const userData: {
      id: string
      email?: string
      [key: string]: any
    } = {
      id: userId
    }
    
    if (userEmail) {
      userData.email = userEmail
    }
    
    if (extra) {
      Object.assign(userData, extra)
    }
    
    sentry.setUser(userData)
  }

  async addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error'): Promise<void> {
    if (!this.sentry) return

    const sentry = this.sentry as { addBreadcrumb: (breadcrumb: any) => void }
    sentry.addBreadcrumb({
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private logRocket: unknown = null

  async init(): Promise<void> {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        // Dynamic import to avoid bundling in development
        const LogRocket = await import('logrocket')
        this.logRocket = LogRocket.default
        debugLog('🔍 LogRocket monitoring initialized')
      } catch (error) {
        warnLog('LogRocket not available:', error)
      }
    }
  }

  async captureError(error: Error, _context?: ErrorContext): Promise<void> {
    if (!this.logRocket) return

    const logRocket = this.logRocket as { captureException: (error: Error) => void }
    logRocket.captureException(error)
  }

  async captureMessage(message: string, level: 'info' | 'warning' | 'error', context?: ErrorContext): Promise<void> {
    if (!this.logRocket) return

    const logRocket = this.logRocket as { log: (message: string, options: any) => void }
    logRocket.log(message, {
      level,
      context
    })
  }

  async capturePerformance(metrics: PerformanceMetrics): Promise<void> {
    if (!this.logRocket) return

    const logRocket = this.logRocket as { log: (message: string, options: any) => void }
    const logData: {
      value: number
      unit: string
      tags?: Record<string, string>
    } = {
      value: metrics.value,
      unit: metrics.unit
    }
    
    if (metrics.tags) {
      logData.tags = metrics.tags
    }
    
    logRocket.log(`Performance: ${metrics.name}`, logData)
  }

  async setUser(userId: string, userEmail?: string, extra?: Record<string, any>): Promise<void> {
    if (!this.logRocket) return

    const logRocket = this.logRocket as { identify: (userId: string, data: any) => void }
    const userData: {
      email?: string
      [key: string]: any
    } = {}
    
    if (userEmail) {
      userData.email = userEmail
    }
    
    if (extra) {
      Object.assign(userData, extra)
    }
    
    logRocket.identify(userId, userData)
  }

  async addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error'): Promise<void> {
    if (!this.logRocket) return

    const logRocket = this.logRocket as { log: (message: string, options: any) => void }
    logRocket.log(`Breadcrumb: ${message}`, {
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
    debugLog('🔍 Monitoring manager initialized with', this.services.length, 'services')
  }

  async captureError(error: Error, context?: ErrorContext): Promise<void> {
    await this.init()
    await Promise.all(this.services.map(service => 
      service.captureError(error, context).catch(warnLog)
    ))
  }

  async captureMessage(message: string, level: 'info' | 'warning' | 'error', context?: ErrorContext): Promise<void> {
    await this.init()
    await Promise.all(this.services.map(service => 
      service.captureMessage(message, level, context).catch(warnLog)
    ))
  }

  async capturePerformance(metrics: PerformanceMetrics): Promise<void> {
    await this.init()
    await Promise.all(this.services.map(service => 
      service.capturePerformance(metrics).catch(warnLog)
    ))
  }

  async setUser(userId: string, userEmail?: string, extra?: Record<string, any>): Promise<void> {
    await this.init()
    await Promise.all(this.services.map(service => 
      service.setUser(userId, userEmail, extra).catch(warnLog)
    ))
  }

  async addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error'): Promise<void> {
    await this.init()
    await Promise.all(this.services.map(service => 
      service.addBreadcrumb(message, category, level).catch(warnLog)
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
  extra?: Record<string, unknown>
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
