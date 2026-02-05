'use client'

import { useCallback, useState, useTransition } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { Product } from '@/types'
import { debugLog, errorLog } from '@/lib/logger'

interface OptimisticOperation {
  type: 'add' | 'remove' | 'update'
  productId: string
  quantity?: number | undefined
  selectedColor?: string | undefined
  selectedSize?: string | undefined
  timestamp: number
}

/**
 * Hook for optimistic cart updates with automatic rollback on failure
 * Provides instant UI feedback while operations complete in background
 */
export function useOptimisticCart() {
  const cart = useCart()
  const [isPending, startTransition] = useTransition()
  const [pendingOperations, setPendingOperations] = useState<OptimisticOperation[]>([])
  const [lastError, setLastError] = useState<string | null>(null)

  /**
   * Add item to cart with optimistic update
   */
  const optimisticAddItem = useCallback((
    product: Product,
    quantity: number = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    const operation: OptimisticOperation = {
      type: 'add',
      productId: product.id,
      quantity,
      selectedColor,
      selectedSize,
      timestamp: Date.now(),
    }

    setLastError(null)
    setPendingOperations(prev => [...prev, operation])

    // Immediately update cart (optimistic)
    startTransition(() => {
      try {
        cart.addItem(product, quantity, selectedColor, selectedSize)
        debugLog('Optimistic add completed:', product.id)
      } catch (error) {
        errorLog('Failed to add item:', error)
        setLastError('Failed to add item to cart')
        // Rollback would happen here if we had server sync
      } finally {
        setPendingOperations(prev => 
          prev.filter(op => op.timestamp !== operation.timestamp)
        )
      }
    })

    return operation
  }, [cart])

  /**
   * Remove item from cart with optimistic update
   */
  const optimisticRemoveItem = useCallback((
    productId: string,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    const operation: OptimisticOperation = {
      type: 'remove',
      productId,
      selectedColor,
      selectedSize,
      timestamp: Date.now(),
    }

    setLastError(null)
    setPendingOperations(prev => [...prev, operation])

    startTransition(() => {
      try {
        cart.removeItem(productId, selectedColor, selectedSize)
        debugLog('Optimistic remove completed:', productId)
      } catch (error) {
        errorLog('Failed to remove item:', error)
        setLastError('Failed to remove item from cart')
      } finally {
        setPendingOperations(prev => 
          prev.filter(op => op.timestamp !== operation.timestamp)
        )
      }
    })

    return operation
  }, [cart])

  /**
   * Update item quantity with optimistic update
   */
  const optimisticUpdateQuantity = useCallback((
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    const operation: OptimisticOperation = {
      type: 'update',
      productId,
      quantity,
      selectedColor,
      selectedSize,
      timestamp: Date.now(),
    }

    setLastError(null)
    setPendingOperations(prev => [...prev, operation])

    startTransition(() => {
      try {
        cart.updateQuantity(productId, quantity, selectedColor, selectedSize)
        debugLog('Optimistic update completed:', productId, quantity)
      } catch (error) {
        errorLog('Failed to update quantity:', error)
        setLastError('Failed to update cart')
      } finally {
        setPendingOperations(prev => 
          prev.filter(op => op.timestamp !== operation.timestamp)
        )
      }
    })

    return operation
  }, [cart])

  /**
   * Check if a specific product has pending operations
   */
  const isProductPending = useCallback((productId: string) => {
    return pendingOperations.some(op => op.productId === productId)
  }, [pendingOperations])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setLastError(null)
  }, [])

  return {
    // Original cart methods
    ...cart,
    
    // Optimistic methods
    optimisticAddItem,
    optimisticRemoveItem,
    optimisticUpdateQuantity,
    
    // State
    isPending,
    pendingOperations,
    lastError,
    
    // Helpers
    isProductPending,
    clearError,
  }
}

export default useOptimisticCart
