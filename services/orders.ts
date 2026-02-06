/**
 * Order service – centralized API calls for order management.
 */

import { api } from './api'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Order {
  id: string
  orderNumber?: string
  status: string
  total: number
  items: OrderItem[]
  createdAt: string
  updatedAt?: string
  paymentMethod?: string
  shippingAddress?: string
  trackingNumber?: string
  email?: string
}

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
  image?: string
  selectedColor?: string
  selectedSize?: string
}

export interface OrderFilters {
  email?: string
  status?: string
  limit?: number
  page?: number
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Fetch orders for a user by email.
 */
export async function fetchOrders(filters?: OrderFilters) {
  const params = new URLSearchParams()
  if (filters?.email) params.set('email', filters.email)
  if (filters?.status) params.set('status', filters.status)
  if (filters?.limit) params.set('limit', String(filters.limit))
  if (filters?.page) params.set('page', String(filters.page))

  const qs = params.toString()
  const url = `/api/orders${qs ? `?${qs}` : ''}`
  return api.get<Order[]>(url)
}

/**
 * Cancel an order by ID.
 */
export async function cancelOrder(orderId: string) {
  return api.post<{ success: boolean }>(`/api/orders/${orderId}/cancel`)
}

/**
 * Track an order by order number.
 */
export async function trackOrder(orderNumber: string) {
  return api.get<Order>(`/api/orders/track/${orderNumber}`)
}

/**
 * Fetch order success details.
 */
export async function fetchOrderSuccess(orderId: string) {
  return api.get<Order>(`/api/orders/success/${orderId}`)
}

/**
 * Submit a COD (Cash on Delivery) order confirmation.
 */
export async function submitCODOrder(orderData: Record<string, unknown>) {
  return api.post<{ success: boolean; orderId: string }>('/api/orders/cod-confirmation', orderData)
}

/**
 * Submit a support-link order.
 */
export async function submitSupportLinkOrder(orderData: Record<string, unknown>) {
  return api.post<{ success: boolean; orderId: string }>('/api/orders/support-link', orderData)
}

/**
 * Generate an invoice for an order.
 */
export async function generateInvoice(orderData: Record<string, unknown>) {
  return api.post<{ url: string }>('/api/invoice/generate', orderData)
}
