/**
 * SWR hooks for product data fetching with automatic caching and deduplication.
 *
 * Replaces manual useEffect + fetch patterns for product data.
 *
 * Usage:
 *   const { products, isLoading, error } = useProducts()
 *   const { product, isLoading } = useProduct('36')
 */

import useSWR from 'swr'
import { fetcher } from '@/lib/swr'
import type { Product } from '@/types'

// ---------------------------------------------------------------------------
// All products (optionally filtered)
// ---------------------------------------------------------------------------

interface UseProductsOptions {
  category?: string
  search?: string
  /** Set to false to disable fetching */
  enabled?: boolean
}

export function useProducts(options: UseProductsOptions = {}) {
  const { category, search, enabled = true } = options

  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (search) params.set('search', search)
  const qs = params.toString()
  const key = enabled ? `/api/products${qs ? `?${qs}` : ''}` : null

  const { data, error, isLoading, isValidating, mutate } = useSWR<Product[]>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10_000, // Products rarely change – 10s dedup
    }
  )

  return {
    products: data ?? [],
    isLoading,
    isValidating,
    error: error as Error | undefined,
    mutate,
  }
}

// ---------------------------------------------------------------------------
// Single product by ID
// ---------------------------------------------------------------------------

export function useProduct(productId: string | number | null | undefined) {
  const key = productId ? `/api/products/${productId}` : null

  const { data, error, isLoading, mutate } = useSWR<Product>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000, // Single product – 30s dedup
    }
  )

  return {
    product: data ?? null,
    isLoading,
    error: error as Error | undefined,
    mutate,
  }
}

// ---------------------------------------------------------------------------
// Multiple products by IDs (batch)
// ---------------------------------------------------------------------------

export function useProductsByIds(productIds: (string | number)[]) {
  // Create a stable key from sorted IDs
  const sortedIds = [...productIds].sort()
  const key = sortedIds.length > 0 ? `products-batch:${sortedIds.join(',')}` : null

  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    key,
    async () => {
      const results = await Promise.all(
        sortedIds.map(id =>
          fetch(`/api/products/${id}`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch product ${id}`)
            return res.json() as Promise<Product>
          })
        )
      )
      return results
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    }
  )

  return {
    products: data ?? [],
    isLoading,
    error: error as Error | undefined,
    mutate,
  }
}
