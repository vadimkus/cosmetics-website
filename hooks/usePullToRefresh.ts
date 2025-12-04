'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  disabled?: boolean
}

interface PullToRefreshState {
  isPulling: boolean
  isRefreshing: boolean
  pullDistance: number
}

// Detect iOS
function isIOS(): boolean {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

// Detect if running as PWA
function isPWA(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  disabled = false,
}: UsePullToRefreshOptions) {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
  })

  const startY = useRef<number>(0)
  const currentY = useRef<number>(0)
  const isDragging = useRef<boolean>(false)
  const rafId = useRef<number | null>(null)
  const lastPullDistance = useRef<number>(0)
  const velocity = useRef<number>(0)
  const lastTime = useRef<number>(0)

  const ios = isIOS()
  const pwa = isPWA()
  const useNative = ios && pwa

  const handleRefresh = useCallback(async () => {
    if (state.isRefreshing) return

    setState((prev) => ({ ...prev, isRefreshing: true }))
    
    try {
      await onRefresh()
    } catch (error) {
      console.error('Pull to refresh error:', error)
    } finally {
      // Smooth reset animation
      const resetAnimation = () => {
        if (rafId.current) {
          cancelAnimationFrame(rafId.current)
        }

        let currentDistance = state.pullDistance
        const startTime = performance.now()

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const duration = 300 // 300ms reset animation
          const progress = Math.min(elapsed / duration, 1)
          
          // Ease-out cubic for smooth deceleration
          const easeOutCubic = 1 - Math.pow(1 - progress, 3)
          currentDistance = state.pullDistance * (1 - easeOutCubic)

          setState((prev) => ({
            ...prev,
            pullDistance: currentDistance,
          }))

          if (progress < 1) {
            rafId.current = requestAnimationFrame(animate)
          } else {
            rafId.current = null
            setState({
              isPulling: false,
              isRefreshing: false,
              pullDistance: 0,
            })
            lastPullDistance.current = 0
            velocity.current = 0
          }
        }

        rafId.current = requestAnimationFrame(animate)
      }

      resetAnimation()
    }
  }, [onRefresh, state.isRefreshing, state.pullDistance])

  // Smooth distance update with spring physics
  const updatePullDistance = useCallback((rawDistance: number) => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }

    const currentTime = performance.now()
    const deltaTime = lastTime.current ? currentTime - lastTime.current : 16
    lastTime.current = currentTime

    // Calculate velocity for smooth momentum
    const currentVelocity = (rawDistance - lastPullDistance.current) / deltaTime
    velocity.current = currentVelocity * 0.2 + velocity.current * 0.8 // Smooth velocity tracking
    lastPullDistance.current = rawDistance

    // Apply resistance with smooth curve (iOS-like)
    const resistance = 2.5
    const maxPull = threshold * 1.5
    let distance = rawDistance / resistance
    
    // Apply smooth resistance curve (easier at start, harder as you pull more)
    if (distance > threshold) {
      const excess = distance - threshold
      distance = threshold + excess * 0.3 // Much harder to pull past threshold
    }
    
    distance = Math.min(distance, maxPull)

    setState((prev) => ({
      ...prev,
      isPulling: distance > 0,
      pullDistance: distance,
    }))
  }, [threshold])

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled || state.isRefreshing || useNative) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      if (scrollTop > 0) return

      const touch = e.touches[0]
      if (!touch) return

      startY.current = touch.clientY
      currentY.current = touch.clientY
      lastPullDistance.current = 0
      velocity.current = 0
      lastTime.current = performance.now()
      isDragging.current = true
    },
    [disabled, state.isRefreshing, useNative]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current || disabled || state.isRefreshing || useNative) return

      const touch = e.touches[0]
      if (!touch) return

      currentY.current = touch.clientY
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      if (scrollTop > 0) {
        isDragging.current = false
        setState((prev) => ({
          ...prev,
          isPulling: false,
          pullDistance: 0,
        }))
        return
      }

      const deltaY = currentY.current - startY.current

      if (deltaY > 0) {
        e.preventDefault()
        updatePullDistance(deltaY)
      } else {
        setState((prev) => ({
          ...prev,
          isPulling: false,
          pullDistance: 0,
        }))
      }
    },
    [disabled, state.isRefreshing, useNative, updatePullDistance]
  )

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current || disabled || useNative) return

    isDragging.current = false

    if (state.pullDistance >= threshold && !state.isRefreshing) {
      handleRefresh()
    } else {
      // Smooth spring-back animation
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }

      let currentDistance = state.pullDistance
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const duration = 400 // 400ms spring-back
        
        if (elapsed < duration) {
          // Spring physics with damping
          const damping = 0.85
          const spring = 0.15
          
          // Apply spring physics
          currentDistance = currentDistance * (1 - spring) * damping
          
          setState((prev) => ({
            ...prev,
            pullDistance: Math.max(0, currentDistance),
          }))

          if (currentDistance > 0.5) {
            rafId.current = requestAnimationFrame(animate)
          } else {
            rafId.current = null
            setState((prev) => ({
              ...prev,
              isPulling: false,
              pullDistance: 0,
            }))
            lastPullDistance.current = 0
            velocity.current = 0
          }
        } else {
          rafId.current = null
          setState({
            isPulling: false,
            isRefreshing: false,
            pullDistance: 0,
          })
          lastPullDistance.current = 0
          velocity.current = 0
        }
      }

      rafId.current = requestAnimationFrame(animate)
    }
  }, [disabled, state.pullDistance, state.isRefreshing, threshold, handleRefresh, useNative, velocity])

  // Setup touch listeners for custom implementation
  useEffect(() => {
    if (disabled || useNative) return

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouchDevice) return

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, disabled, useNative])

  // For native iOS PWA, use native pull-to-refresh
  useEffect(() => {
    if (disabled || !useNative) return

    // Native iOS pull-to-refresh automatically reloads the page
    // We can detect when it happens via page visibility or focus events
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !state.isRefreshing) {
        // Page became visible - might be after native pull-to-refresh
        handleRefresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleRefresh)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleRefresh)
    }
  }, [disabled, useNative, handleRefresh, state.isRefreshing])

  return {
    ...state,
    pullProgress: Math.min(state.pullDistance / threshold, 1),
    isNative: useNative,
  }
}
