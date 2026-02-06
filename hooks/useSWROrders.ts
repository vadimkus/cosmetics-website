/**
 * SWR hooks for order data fetching with automatic caching and deduplication.
 *
 * Usage:
 *   const { orders, isLoading, cancel } = useOrders('user@example.com')
 *   const { order, isLoading } = useOrderTracking('ORD-12345')
 */

import useSWR from 'swr'
import { fetcher } from '@/lib/swr'
import { cancelOrder as cancelOrderApi } from '@/services/orders'
import { errorLog } from '@/lib/logger'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrderData {
  id: string
  orderNumber?: string
  status: string
  total: number
  items: unknown[]
  createdAt: string
  updatedAt?: string
  paymentMethod?: string
  email?: string
}

// ---------------------------------------------------------------------------
// Orders list (by email)
// ---------------------------------------------------------------------------

export function useOrders(email: string | null | undefined) {
  const key = email ? `/api/orders?email=${encodeURIComponent(email)}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<OrderData[]>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
    }
  )

  const cancel = async (orderId: string): Promise<boolean> => {
    try {
      const result = await cancelOrderApi(orderId)
      if (result.ok) {
        // Revalidate orders list after cancellation
        await mutate()
        return true
      }
      return false
    } catch (err: unknown) {
      errorLog('[useOrders] Cancel failed:', err instanceof Error ? err.message : String(err))
      return false
    }
  }

  return {
    orders: data ?? [],
    isLoading,
    isValidating,
    error: error as Error | undefined,
    cancel,
    mutate,
  }
}

// ---------------------------------------------------------------------------
// Single order tracking
// ---------------------------------------------------------------------------

export function useOrderTracking(orderNumber: string | null | undefined) {
  const key = orderNumber ? `/api/orders/track/${orderNumber}` : null

  const { data, error, isLoading, mutate } = useSWR<OrderData>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30_000, // Auto-refresh tracking every 30s
    }
  )

  return {
    order: data ?? null,
    isLoading,
    error: error as Error | undefined,
    mutate,
  }
}
