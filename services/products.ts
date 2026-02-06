/**
 * Product service – centralized API calls for product data.
 */

import { api } from './api'
import type { Product } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductListResponse {
  products: Product[]
  total?: number
}

export interface ProductFilters {
  category?: string
  search?: string
  limit?: number
  offset?: number
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Fetch all products, optionally filtered by category or search term.
 */
export async function fetchProducts(filters?: ProductFilters) {
  const params = new URLSearchParams()
  if (filters?.category) params.set('category', filters.category)
  if (filters?.search) params.set('search', filters.search)
  if (filters?.limit) params.set('limit', String(filters.limit))
  if (filters?.offset) params.set('offset', String(filters.offset))

  const qs = params.toString()
  const url = `/api/products${qs ? `?${qs}` : ''}`
  return api.get<Product[]>(url)
}

/**
 * Fetch a single product by ID.
 */
export async function fetchProductById(productId: string | number) {
  return api.get<Product>(`/api/products/${productId}`)
}

/**
 * Search products by name or keyword.
 */
export async function searchProducts(query: string) {
  return api.get<Product[]>(`/api/products?search=${encodeURIComponent(query)}`)
}

/**
 * Fetch product reviews.
 */
export async function fetchProductReviews(productId: string | number) {
  return api.get<unknown[]>(`/api/products/${productId}/reviews`)
}

/**
 * Submit a product review.
 */
export async function submitProductReview(
  productId: string | number,
  review: { rating: number; comment: string; name?: string }
) {
  return api.post<{ success: boolean }>(`/api/products/${productId}/reviews`, review as unknown as Record<string, unknown>)
}

/**
 * Delete a product review.
 */
export async function deleteProductReview(productId: string | number, reviewId: string) {
  return api.delete<{ success: boolean }>(`/api/products/${productId}/reviews/${reviewId}`)
}
