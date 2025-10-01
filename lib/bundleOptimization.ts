/**
 * Bundle optimization utilities
 */

import React from 'react'

/**
 * Lazy load components with loading fallback
 */
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  _fallback?: React.ComponentType
) => {
  return React.lazy(importFunc)
}

/**
 * Dynamic imports for code splitting
 */
export const dynamicImport = {
  /**
   * Import component only when needed
   */
  component: <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>
  ) => {
    return React.lazy(importFunc)
  },

  /**
   * Import utility function
   */
  utility: async <T>(importFunc: () => Promise<T>): Promise<T> => {
    return importFunc()
  },

  /**
   * Import with retry mechanism
   */
  withRetry: async <T>(
    importFunc: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> => {
    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await importFunc()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          throw lastError
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }

    throw lastError!
  }
}

/**
 * Preload critical resources
 */
export const preload = {
  /**
   * Preload component
   */
  component: (importFunc: () => Promise<any>) => {
    // Start loading in the background
    importFunc().catch(console.warn)
  },

  /**
   * Preload image
   */
  image: (src: string) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  },

  /**
   * Preload font
   */
  font: (src: string, type: string = 'font/woff2') => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = type
    link.href = src
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  },

  /**
   * Preload route
   */
  route: (href: string) => {
    // Prefetch the route
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }
}

/**
 * Bundle analysis utilities
 */
export const bundleAnalysis = {
  /**
   * Get bundle size information
   */
  getBundleInfo: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      const jsResources = resources.filter(r => r.name.endsWith('.js'))
      const cssResources = resources.filter(r => r.name.endsWith('.css'))
      
      return {
        totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        jsSize: jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        cssSize: cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        jsCount: jsResources.length,
        cssCount: cssResources.length
      }
    }
    return null
  },

  /**
   * Log bundle performance
   */
  logPerformance: () => {
    const info = bundleAnalysis.getBundleInfo()
    if (info) {
      console.group('Bundle Performance')
      console.log(`Total Size: ${(info.totalSize / 1024).toFixed(2)} KB`)
      console.log(`JS Size: ${(info.jsSize / 1024).toFixed(2)} KB (${info.jsCount} files)`)
      console.log(`CSS Size: ${(info.cssSize / 1024).toFixed(2)} KB (${info.cssCount} files)`)
      console.log(`Load Time: ${info.loadTime.toFixed(2)} ms`)
      console.groupEnd()
    }
  }
}

/**
 * Memory management utilities
 */
export const memoryManagement = {
  /**
   * Clean up event listeners
   */
  cleanup: (element: HTMLElement, eventType: string, handler: EventListener) => {
    element.removeEventListener(eventType, handler)
  },

  /**
   * Clear unused references
   */
  clearReferences: (refs: Record<string, any>) => {
    Object.keys(refs).forEach(key => {
      delete refs[key]
    })
  },

  /**
   * Debounce function calls
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  /**
   * Throttle function calls
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

/**
 * Performance monitoring
 */
export const performanceMonitoring = {
  /**
   * Measure function execution time
   */
  measure: <T extends (...args: any[]) => any>(
    func: T,
    name: string
  ): T => {
    return ((...args: Parameters<T>) => {
      const start = performance.now()
      const result = func(...args)
      const end = performance.now()
      
      console.log(`${name} executed in ${(end - start).toFixed(2)}ms`)
      return result
    }) as T
  },

  /**
   * Monitor component render time
   */
  monitorRender: (componentName: string) => {
    const start = performance.now()
    
    return () => {
      const end = performance.now()
      console.log(`${componentName} rendered in ${(end - start).toFixed(2)}ms`)
    }
  },

  /**
   * Track Core Web Vitals
   */
  trackWebVitals: () => {
    if (typeof window !== 'undefined') {
      // Track Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry?.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // Track First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input' && 'processingStart' in entry) {
            console.log('FID:', (entry as any).processingStart - entry.startTime)
          }
        })
      }).observe({ entryTypes: ['first-input'] })

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'layout-shift' && 'hadRecentInput' in entry && 'value' in entry) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
        })
        console.log('CLS:', clsValue)
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }
}
