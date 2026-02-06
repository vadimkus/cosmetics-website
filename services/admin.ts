/**
 * Admin service – centralized API calls for admin operations.
 */

import { api } from './api'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AdminOrder {
  id: string
  orderNumber?: string
  status: string
  total: number
  email: string
  createdAt: string
  items: unknown[]
}

export interface AdminPromotion {
  id: string
  code: string
  discountPercent: number
  active: boolean
  expiresAt?: string
}

export interface SalesReport {
  totalSales: number
  totalOrders: number
  dailySales: { date: string; amount: number; count: number }[]
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Fetch admin orders list.
 */
export async function fetchAdminOrders() {
  return api.get<AdminOrder[]>('/api/admin/orders')
}

/**
 * Fetch a single admin order by ID.
 */
export async function fetchAdminOrder(orderId: string) {
  return api.get<AdminOrder>(`/api/admin/orders/${orderId}`)
}

/**
 * Fetch admin products list.
 */
export async function fetchAdminProducts() {
  return api.get<unknown[]>('/api/admin/products')
}

/**
 * Fetch promotions.
 */
export async function fetchPromotions() {
  return api.get<AdminPromotion[]>('/api/admin/promotions')
}

/**
 * Create a promotion.
 */
export async function createPromotion(data: Record<string, unknown>) {
  return api.post<AdminPromotion>('/api/admin/promotions', data)
}

/**
 * Update a promotion.
 */
export async function updatePromotion(id: string, data: Record<string, unknown>) {
  return api.put<AdminPromotion>(`/api/admin/promotions/${id}`, data)
}

/**
 * Resend order notification email.
 */
export async function resendOrderNotification(data: Record<string, unknown>) {
  return api.post<{ success: boolean }>('/api/admin/resend-order-notification', data)
}

/**
 * Fetch sales reports.
 */
export async function fetchSalesReport(days: string = 'all') {
  return api.get<SalesReport>(`/api/admin/reports/sales?days=${days}`)
}

/**
 * Fetch chat stats.
 */
export async function fetchChatStats(days: number = 7) {
  return api.get<unknown>(`/api/admin/chat-stats?days=${days}`)
}

/**
 * Send a push notification.
 */
export async function sendPushNotification(data: Record<string, unknown>) {
  return api.post<{ success: boolean }>('/api/push/send', data)
}

/**
 * Delete a push notification.
 */
export async function deletePushNotification(id: string) {
  return api.delete<{ success: boolean }>(`/api/push/send/${id}`)
}

/**
 * Delete a user (admin action).
 */
export async function deleteUser(userId: string) {
  return api.delete<{ success: boolean }>(`/api/admin/users/${userId}`)
}
