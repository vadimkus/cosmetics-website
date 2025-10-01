'use client'

import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { initMonitoring, setUserContext, addBreadcrumb } from '@/lib/monitoring'
import { enhancedErrorTracking } from '@/lib/errorTracking'

interface MonitoringContextType {
  trackError: (error: Error, context?: any) => Promise<void>
  trackMessage: (message: string, level?: 'info' | 'warning' | 'error', context?: any) => Promise<void>
  setUser: (userId: string, userEmail?: string, extra?: Record<string, any>) => Promise<void>
  addBreadcrumb: (message: string, category?: string, level?: 'info' | 'warning' | 'error') => Promise<void>
}

const MonitoringContext = createContext<MonitoringContextType | null>(null)

interface MonitoringProviderProps {
  children: ReactNode
}

export function MonitoringProvider({ children }: MonitoringProviderProps) {
  useEffect(() => {
    // Initialize monitoring services
    initMonitoring().catch(console.error)
    
    // Add initial breadcrumb
    addBreadcrumb('Application started', 'app-lifecycle', 'info').catch(console.error)
  }, [])

  const contextValue: MonitoringContextType = {
    trackError: enhancedErrorTracking.trackError,
    trackMessage: async (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: any) => {
      const { trackMessage } = await import('@/lib/monitoring')
      return trackMessage(message, level, context)
    },
    setUser: setUserContext,
    addBreadcrumb
  }

  return (
    <MonitoringContext.Provider value={contextValue}>
      {children}
    </MonitoringContext.Provider>
  )
}

export function useMonitoring(): MonitoringContextType {
  const context = useContext(MonitoringContext)
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider')
  }
  return context
}

/**
 * Hook for tracking user actions
 */
export function useUserTracking() {
  const { trackMessage, addBreadcrumb } = useMonitoring()

  const trackAction = async (action: string, context?: any) => {
    await addBreadcrumb(`User action: ${action}`, 'user-action', 'info')
    await trackMessage(`User action: ${action}`, 'info', context)
  }

  const trackPageView = async (page: string, context?: any) => {
    await addBreadcrumb(`Page view: ${page}`, 'navigation', 'info')
    await trackMessage(`Page view: ${page}`, 'info', context)
  }

  const trackError = async (error: Error, context?: any) => {
    await enhancedErrorTracking.trackClientError(error, 'user-interaction', context)
  }

  return {
    trackAction,
    trackPageView,
    trackError
  }
}

/**
 * Hook for performance tracking
 */
export function usePerformanceTracking() {
  const { trackMessage } = useMonitoring()

  const trackPerformance = async (name: string, value: number, unit: 'ms' | 'bytes' | 'count' = 'ms', tags?: Record<string, string>) => {
    const { trackPerformance } = await import('@/lib/monitoring')
    await trackPerformance({ name, value, unit, tags: tags || {} })
  }

  const trackSlowOperation = async (operation: string, duration: number, threshold: number = 1000) => {
    if (duration > threshold) {
      await trackMessage(`Slow operation: ${operation} (${duration}ms)`, 'warning', {
        operation,
        duration,
        threshold
      })
    }
  }

  return {
    trackPerformance,
    trackSlowOperation
  }
}

export default MonitoringProvider
