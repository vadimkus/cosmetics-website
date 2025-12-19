'use client'

import { useState, useCallback, useRef } from 'react'
import { Package, RefreshCw, Eye, Truck, CheckCircle, X as XIcon, Trash2, AlertCircle, Check } from 'lucide-react'
import { Order, OrderItem } from '@prisma/client'
import { errorLog } from '@/lib/logger'
import StatusBadge from '@/components/shared/StatusBadge'
import { addCsrfToBody } from '@/lib/csrfClient'

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

interface AdminOrdersManagerProps {
  orders: OrderWithItems[]
  ordersLoading: boolean
  ordersRefreshing: boolean
  selectedOrders: string[]
  isDeletingOrders: boolean
  onRefreshOrders: () => Promise<void>
  onSelectOrder: (order: OrderWithItems) => void
  onSelectOrders: (orderIds: string[]) => void
  onDeleteOrders: () => Promise<void>
  getAdminHeaders: (additionalHeaders?: Record<string, string>) => HeadersInit
}

// Toast notification types
type ToastType = 'success' | 'error' | 'warning'
type Toast = {
  id: number
  message: string
  type: ToastType
}

export default function AdminOrdersManager({
  orders,
  ordersLoading,
  ordersRefreshing,
  selectedOrders,
  isDeletingOrders,
  onRefreshOrders,
  onSelectOrder,
  onSelectOrders,
  onDeleteOrders,
  getAdminHeaders
}: AdminOrdersManagerProps) {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdCounter = useRef(0)

  // Add toast notification
  const showToast = (message: string, type: ToastType = 'success') => {
    const id = toastIdCounter.current++
    setToasts(prev => [...prev, { id, message, type }])
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }

  // Remove toast manually
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Format currency in AED
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount)
  }

  const getDisplayOrderNumber = (order: OrderWithItems) => {
    const n = String((order as any)?.orderNumber || '').trim()
    if (n) return n
    return String(order.id).slice(-8)
  }

  const handleStatusUpdate = useCallback(async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({ status: newStatus }))
      })

      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status}`)
      }

      showToast(`Order status updated to ${newStatus}`, 'success')
      await onRefreshOrders()
    } catch {
      errorLog('Error updating order status:', error)
      showToast('Failed to update order status. Please try again.', 'error')
    } finally {
      setUpdatingStatus(null)
    }
  }, [getAdminHeaders, onRefreshOrders])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      onSelectOrders(orders.map(order => order.id))
    } else {
      onSelectOrders([])
    }
  }, [orders, onSelectOrders])

  const handleSelectOrder = useCallback((orderId: string, checked: boolean) => {
    if (checked) {
      onSelectOrders([...selectedOrders, orderId])
    } else {
      onSelectOrders(selectedOrders.filter(id => id !== orderId))
    }
  }, [selectedOrders, onSelectOrders])


  const allSelected = selectedOrders.length === orders.length && orders.length > 0
  const someSelected = selectedOrders.length > 0 && selectedOrders.length < orders.length

  return (
    <div className="space-y-6">
      {/* Orders Header */}
      <div className="bg-white rounded-lg border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-2 mr-3">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Orders</h2>
              <p className="text-sm text-gray-500">Manage customer orders</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {selectedOrders.length > 0 && (
              <button
                onClick={onDeleteOrders}
                disabled={isDeletingOrders}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedOrders.length})
              </button>
            )}
            <button
              onClick={onRefreshOrders}
              disabled={ordersRefreshing}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${ordersRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg border">
        {ordersLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="animate-spin h-8 w-8 text-primary-500 mx-auto mb-4" />
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Package className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-400">Orders will appear here as customers make purchases.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:-mx-4 md:mx-0 scrollbar-hide">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someSelected
                          }}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Order</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Customer</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Total</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-3 md:px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{getDisplayOrderNumber(order)}</div>
                          {String(order.id).slice(-8) !== getDisplayOrderNumber(order) && (
                            <div className="text-xs text-gray-400">ID #{String(order.id).slice(-8)}</div>
                          )}
                          <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onSelectOrder(order)}
                              className="text-primary-600 hover:text-primary-900 transition-colors touch-manipulation p-1"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {order.status === 'PAID' && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'SHIPPED')}
                                disabled={updatingStatus === order.id}
                                className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50 touch-manipulation p-1"
                                title="Mark as Shipped"
                              >
                                <Truck className="h-4 w-4" />
                              </button>
                            )}
                            {order.status === 'SHIPPED' && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                disabled={updatingStatus === order.id}
                                className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50 touch-manipulation p-1"
                                title="Mark as Delivered"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {(order.status === 'PENDING' || order.status === 'PAID') && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                disabled={updatingStatus === order.id}
                                className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 touch-manipulation p-1"
                                title="Cancel Order"
                              >
                                <XIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 animate-slide-in ${
              toast.type === 'success' ? 'bg-green-50/95 border border-green-200' :
              toast.type === 'error' ? 'bg-red-50/95 border border-red-200' :
              'bg-yellow-50/95 border border-yellow-200'
            }`}
          >
            {toast.type === 'success' && <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <XIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />}
            
            <p className={`text-sm flex-1 ${
              toast.type === 'success' ? 'text-green-800' :
              toast.type === 'error' ? 'text-red-800' :
              'text-yellow-800'
            }`}>
              {toast.message}
            </p>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}