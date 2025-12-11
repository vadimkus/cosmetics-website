/**
 * Image Performance Monitoring and Optimization
 * Advanced performance tracking for GENOSYS product images
 */

import { debugLog, warnLog } from '@/lib/logger'

interface ImageMetrics {
  url: string
  loadTime: number
  size: number
  format: string
  cached: boolean
  lcp?: boolean
  fcp?: boolean
  timestamp: number
}

interface PerformanceThresholds {
  loadTimeWarning: number // ms
  loadTimeError: number // ms
  sizeWarning: number // bytes
  sizeError: number // bytes
  lcpTarget: number // ms
}

class ImagePerformanceMonitor {
  private metrics: ImageMetrics[] = []
  private observers: PerformanceObserver[] = []
  private lcpEntries: PerformanceEntry[] = []
  
  private readonly thresholds: PerformanceThresholds = {
    loadTimeWarning: 1000, // 1 second
    loadTimeError: 3000,   // 3 seconds
    sizeWarning: 100000,   // 100KB
    sizeError: 500000,     // 500KB
    lcpTarget: 2500        // 2.5 seconds (Core Web Vital target)
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring()
    }
  }

  /**
   * Initialize performance monitoring
   */
  private initializeMonitoring(): void {
    // Monitor resource loading
    this.monitorResourceLoading()
    
    // Monitor Largest Contentful Paint
    this.monitorLCP()
    
    // Monitor First Contentful Paint
    this.monitorFCP()
  }

  /**
   * Monitor image resource loading
   */
  private monitorResourceLoading(): void {
    if (!('PerformanceObserver' in window)) return

    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[]
      
      entries.forEach((entry) => {
        if (this.isImageResource(entry.name)) {
          this.recordImageMetrics(entry)
        }
      })
    })

    resourceObserver.observe({ entryTypes: ['resource'] })
    this.observers.push(resourceObserver)
  }

  /**
   * Monitor Largest Contentful Paint
   */
  private monitorLCP(): void {
    if (!('PerformanceObserver' in window)) return

    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      this.lcpEntries.push(...entries)
      
      // Mark the latest LCP entry
      const latestEntry = entries[entries.length - 1]
      if (latestEntry) {
        this.markLCPImage(latestEntry)
      }
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)
    } catch (error) {
      warnLog('LCP observer not supported:', error)
    }
  }

  /**
   * Monitor First Contentful Paint
   */
  private monitorFCP(): void {
    if (!('PerformanceObserver' in window)) return

    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          debugLog(`FCP: ${entry.startTime.toFixed(2)}ms`)
        }
      })
    })

    try {
      fcpObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(fcpObserver)
    } catch (error) {
      warnLog('FCP observer not supported:', error)
    }
  }

  /**
   * Check if resource is an image
   */
  private isImageResource(url: string): boolean {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/i.test(url)
  }

  /**
   * Record image metrics
   */
  private recordImageMetrics(entry: PerformanceResourceTiming): void {
    const metrics: ImageMetrics = {
      url: entry.name,
      loadTime: entry.responseEnd - entry.startTime,
      size: entry.transferSize || entry.encodedBodySize || 0,
      format: this.detectImageFormat(entry.name),
      cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
      timestamp: Date.now()
    }

    this.metrics.push(metrics)
    this.analyzeMetrics(metrics)
  }

  /**
   * Detect image format from URL
   */
  private detectImageFormat(url: string): string {
    const match = url.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)/i)
    return match && match[1] ? match[1].toLowerCase() : 'unknown'
  }

  /**
   * Mark image as LCP element
   */
  private markLCPImage(lcpEntry: PerformanceEntry): void {
    const lcpElement = (lcpEntry as any).element
    if (lcpElement && lcpElement.tagName === 'IMG') {
      const imageUrl = lcpElement.src
      const metric = this.metrics.find(m => m.url === imageUrl)
      if (metric) {
        metric.lcp = true
        debugLog(`LCP Image: ${imageUrl} (${lcpEntry.startTime.toFixed(2)}ms)`)
      }
    }
  }

  /**
   * Analyze metrics and provide warnings
   */
  private analyzeMetrics(metrics: ImageMetrics): void {
    const { url, loadTime, size, format, cached } = metrics

    // Check load time
    if (loadTime > this.thresholds.loadTimeError) {
      warnLog(`🚨 SLOW IMAGE: ${url}`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        size: `${(size / 1024).toFixed(2)}KB`,
        format,
        cached
      })
    } else if (loadTime > this.thresholds.loadTimeWarning) {
      debugLog(`⚠️ SLOW IMAGE: ${url}`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        size: `${(size / 1024).toFixed(2)}KB`,
        format
      })
    }

    // Check file size
    if (size > this.thresholds.sizeError) {
      warnLog(`🚨 LARGE IMAGE: ${url}`, {
        size: `${(size / 1024).toFixed(2)}KB`,
        format,
        recommendation: 'Consider WebP/AVIF or reduce quality'
      })
    } else if (size > this.thresholds.sizeWarning) {
      debugLog(`⚠️ LARGE IMAGE: ${url}`, {
        size: `${(size / 1024).toFixed(2)}KB`,
        format
      })
    }

    // Check format optimization
    if (format === 'png' || format === 'jpg' || format === 'jpeg') {
      debugLog(`💡 IMAGE OPTIMIZATION: Consider WebP/AVIF for ${url}`)
    }
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): {
    totalImages: number
    avgLoadTime: number
    avgSize: number
    cachedPercentage: number
    formatDistribution: Record<string, number>
    slowImages: ImageMetrics[]
    largeImages: ImageMetrics[]
    lcpImage?: ImageMetrics
  } {
    if (this.metrics.length === 0) {
      return {
        totalImages: 0,
        avgLoadTime: 0,
        avgSize: 0,
        cachedPercentage: 0,
        formatDistribution: {},
        slowImages: [],
        largeImages: [],
      }
    }

    const totalLoadTime = this.metrics.reduce((sum, m) => sum + m.loadTime, 0)
    const totalSize = this.metrics.reduce((sum, m) => sum + m.size, 0)
    const cachedImages = this.metrics.filter(m => m.cached).length

    const formatDistribution: Record<string, number> = {}
    this.metrics.forEach(m => {
      formatDistribution[m.format] = (formatDistribution[m.format] || 0) + 1
    })

    const lcpImage = this.metrics.find(m => m.lcp)
    
    return {
      totalImages: this.metrics.length,
      avgLoadTime: totalLoadTime / this.metrics.length,
      avgSize: totalSize / this.metrics.length,
      cachedPercentage: (cachedImages / this.metrics.length) * 100,
      formatDistribution,
      slowImages: this.metrics.filter(m => m.loadTime > this.thresholds.loadTimeWarning),
      largeImages: this.metrics.filter(m => m.size > this.thresholds.sizeWarning),
      ...(lcpImage && { lcpImage })
    }
  }

  /**
   * Get optimization recommendations
   */
  public getOptimizationRecommendations(): string[] {
    const recommendations: string[] = []
    const summary = this.getPerformanceSummary()

    // Load time recommendations
    if (summary.avgLoadTime > this.thresholds.loadTimeWarning) {
      recommendations.push(`Average image load time is ${summary.avgLoadTime.toFixed(2)}ms - consider image optimization`)
    }

    // Size recommendations
    if (summary.avgSize > this.thresholds.sizeWarning) {
      recommendations.push(`Average image size is ${(summary.avgSize / 1024).toFixed(2)}KB - consider compression`)
    }

    // Format recommendations
    const oldFormats = (summary.formatDistribution.jpg || 0) + 
                      (summary.formatDistribution.jpeg || 0) + 
                      (summary.formatDistribution.png || 0)
    const modernFormats = (summary.formatDistribution.webp || 0) + 
                         (summary.formatDistribution.avif || 0)
    
    if (oldFormats > modernFormats) {
      recommendations.push('Consider using modern formats (WebP, AVIF) for better compression')
    }

    // Caching recommendations
    if (summary.cachedPercentage < 80) {
      recommendations.push(`Only ${summary.cachedPercentage.toFixed(1)}% of images are cached - improve cache headers`)
    }

    // LCP recommendations
    if (summary.lcpImage && summary.lcpImage.loadTime > this.thresholds.lcpTarget) {
      recommendations.push(`LCP image loads in ${summary.lcpImage.loadTime.toFixed(2)}ms - optimize critical image`)
    }

    return recommendations
  }

  /**
   * Log performance report
   */
  public logPerformanceReport(): void {
    const summary = this.getPerformanceSummary()
    const recommendations = this.getOptimizationRecommendations()

    debugLog('📊 IMAGE PERFORMANCE REPORT', {
      summary,
      recommendations
    })
  }

  /**
   * Cleanup observers
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics = []
    this.lcpEntries = []
  }
}

// Global instance
let imagePerformanceMonitor: ImagePerformanceMonitor | null = null

/**
 * Get or create performance monitor instance
 */
export const getImagePerformanceMonitor = (): ImagePerformanceMonitor => {
  if (!imagePerformanceMonitor) {
    imagePerformanceMonitor = new ImagePerformanceMonitor()
  }
  return imagePerformanceMonitor
}

/**
 * Hook for image performance monitoring
 */
export const useImagePerformanceMonitoring = () => {
  const monitor = getImagePerformanceMonitor()

  const logReport = () => monitor.logPerformanceReport()
  const getRecommendations = () => monitor.getOptimizationRecommendations()
  const getSummary = () => monitor.getPerformanceSummary()

  return {
    logReport,
    getRecommendations,
    getSummary
  }
}

/**
 * Image performance utilities
 */
export const imagePerformanceUtils = {
  /**
   * Measure image load time
   */
  measureImageLoadTime: (imageElement: HTMLImageElement): Promise<number> => {
    return new Promise((resolve) => {
      const startTime = performance.now()
      
      const onLoad = () => {
        const loadTime = performance.now() - startTime
        cleanup()
        resolve(loadTime)
      }
      
      const onError = () => {
        cleanup()
        resolve(-1) // Error indicator
      }
      
      const cleanup = () => {
        imageElement.removeEventListener('load', onLoad)
        imageElement.removeEventListener('error', onError)
      }
      
      if (imageElement.complete) {
        resolve(0) // Already loaded
      } else {
        imageElement.addEventListener('load', onLoad)
        imageElement.addEventListener('error', onError)
      }
    })
  },

  /**
   * Check if image format is modern
   */
  isModernFormat: (url: string): boolean => {
    return /\.(webp|avif)(\?.*)?$/i.test(url)
  },

  /**
   * Estimate image file size from dimensions
   */
  estimateImageSize: (width: number, height: number, format: string = 'jpeg'): number => {
    const pixels = width * height
    
    // Rough estimates based on typical compression
    const bytesPerPixel: Record<string, number> = {
      'jpeg': 0.5,
      'jpg': 0.5,
      'png': 2.5,
      'webp': 0.3,
      'avif': 0.2
    }
    
    return pixels * (bytesPerPixel[format.toLowerCase()] || 1)
  }
}