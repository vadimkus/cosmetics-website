'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  resistance?: number
  disabled?: boolean
}

interface PullToRefreshState {
  isPulling: boolean
  isRefreshing: boolean
  pullDistance: number
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
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
  const elementRef = useRef<HTMLElement | null>(null)

  const handleRefresh = useCallback(async () => {
    if (state.isRefreshing) return

    setState((prev) => ({ ...prev, isRefreshing: true }))
    
    try {
      await onRefresh()
    } catch (error) {
      console.error('Pull to refresh error:', error)
    } finally {
      // Reset after a short delay for smooth animation
      setTimeout(() => {
        setState({
          isPulling: false,
          isRefreshing: false,
          pullDistance: 0,
        })
      }, 300)
    }
  }, [onRefresh, state.isRefreshing])

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled || state.isRefreshing) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      // Only trigger if at the top of the page
      if (scrollTop > 0) return

      const touch = e.touches[0]
      if (!touch) return

      startY.current = touch.clientY
      currentY.current = touch.clientY
      isDragging.current = true
    },
    [disabled, state.isRefreshing]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current || disabled || state.isRefreshing) return

      const touch = e.touches[0]
      if (!touch) return

      currentY.current = touch.clientY

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      // Only allow pull down if at the top
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

      // Only allow downward pull
      if (deltaY > 0) {
        e.preventDefault() // Prevent default scroll behavior
        
        // Apply resistance (makes it harder to pull as you go further)
        const distance = Math.min(deltaY / resistance, threshold * 1.5)
        
        setState({
          isPulling: true,
          isRefreshing: false,
          pullDistance: distance,
        })
      } else {
        setState({
          isPulling: false,
          isRefreshing: false,
          pullDistance: 0,
        })
      }
    },
    [disabled, state.isRefreshing, threshold, resistance]
  )

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current || disabled) return

    isDragging.current = false

    // Trigger refresh if threshold is met
    if (state.pullDistance >= threshold && !state.isRefreshing) {
      handleRefresh()
    } else {
      // Reset if not enough pull
      setState({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
      })
    }
  }, [disabled, state.pullDistance, state.isRefreshing, threshold, handleRefresh])

  useEffect(() => {
    if (disabled) return

    // Only enable on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouchDevice) return

    const element = elementRef.current || document.body

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, disabled])

  return {
    ...state,
    elementRef,
    pullProgress: Math.min(state.pullDistance / threshold, 1),
  }
}

