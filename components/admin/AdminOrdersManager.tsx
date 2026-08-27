'use client'

import { useState, useCallback, useRef } from 'react'
import { Package, RefreshCw, Eye, Truck, CheckCircle, X as XIcon, Trash2, AlertCircle, Check, BadgeDollarSign } from 'lucide-react'
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
  const [orderFilter, setOrderFilter] = useState<'all' | 'partner' | 'consignment' | 'credit'>('all')
  const [markingPaid, setMarkingPaid] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdCounter = useRef(0)

  // Partner orders: PART… order numbers (new) or legacy paymentMethod 'partner'.
  const isPartnerOrder = (o: Order) =>
    String(o.orderNumber || '').startsWith('PART') || String(o.paymentMethod || '').startsWith('partner')
  const isConsignmentOrder = (o: Order) => String(o.paymentMethod || '') === 'partner_consignment'
  const isCreditOrder = (o: Order) => String(o.paymentMethod || '') === 'partner_credit'
  // Settlement tracking: consignment + credit orders carry an open balance
  // until admin marks the payment received.
  const isSettlementOrder = (o: Order) => isConsignmentOrder(o) || isCreditOrder(o)
  const isPaid = (o: Order) => String(o.paymentStatus || '') === 'paid'
  const isOverdue = (o: Order) =>
    isCreditOrder(o) && !isPaid(o) && o.paymentDueDate != null && new Date(o.paymentDueDate) < new Date()
  const partnerCount = orders.filter(isPartnerOrder).length
  const consignmentCount = orders.filter(isConsignmentOrder).length
  const creditCount = orders.filter(isCreditOrder).length
  const visibleOrders =
    orderFilter === 'partner' ? orders.filter(isPartnerOrder)
    : orderFilter === 'consignment' ? orders.filter(isConsignmentOrder)
    : orderFilter === 'credit' ? orders.filter(isCreditOrder)
    : orders

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
    const n = String(order.orderNumber || '').trim()
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
    } catch (error) {
      errorLog('Error updating order status:', error)
      showToast('Failed to update order status. Please try again.', 'error')
    } finally {
      setUpdatingStatus(null)
    }
  }, [getAdminHeaders, onRefreshOrders])

  const handleMarkPaid = useCallback(async (order: OrderWithItems) => {
    if (!window.confirm(`Mark payment received for #${order.orderNumber} (${order.total.toFixed(2)} AED)?`)) return
    setMarkingPaid(order.id)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({ paymentReceived: true }))
      })
      if (!response.ok) throw new Error(`Failed: ${response.status}`)
      showToast(`Payment received for #${order.orderNumber}`, 'success')
      await onRefreshOrders()
    } catch (error) {
      errorLog('Error marking payment received:', error)
      showToast('Failed to mark payment received. Please try again.', 'error')
    } finally {
      setMarkingPaid(null)
    }
  }, [getAdminHeaders, onRefreshOrders])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      onSelectOrders(visibleOrders.map(order => order.id))
    } else {
      onSelectOrders([])
    }
  }, [visibleOrders, onSelectOrders])

  const handleSelectOrder = useCallback((orderId: string, checked: boolean) => {
    if (checked) {
      onSelectOrders([...selectedOrders, orderId])
    } else {
      onSelectOrders(selectedOrders.filter(id => id !== orderId))
    }
  }, [selectedOrders, onSelectOrders])


  const allSelected = selectedOrders.length === visibleOrders.length && visibleOrders.length > 0
  const someSelected = selectedOrders.length > 0 && selectedOrders.length < visibleOrders.length

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

        {/* Filter tabs - All / Partner / Consignment / Credit */}
        {partnerCount > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${orderFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All orders ({orders.length})
            </button>
            <button
              onClick={() => setOrderFilter('partner')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${orderFilter === 'partner' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
            >
              Partner Portal ({partnerCount})
            </button>
            {consignmentCount > 0 && (
              <button
                onClick={() => setOrderFilter('consignment')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${orderFilter === 'consignment' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
              >
                Consignment ({consignmentCount})
              </button>
            )}
            {creditCount > 0 && (
              <button
                onClick={() => setOrderFilter('credit')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${orderFilter === 'credit' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
              >
                Credit ({creditCount})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg border">
        {ordersLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="animate-spin h-8 w-8 text-primary-500 mx-auto mb-4" />
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Package className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{orderFilter === 'partner' ? 'No partner orders yet' : 'No orders yet'}</h3>
            <p className="text-gray-400">{orderFilter === 'partner' ? 'Orders placed via the Partner Portal will appear here.' : 'Orders will appear here as customers make purchases.'}</p>
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
                    {visibleOrders.map((order) => (
                      <tr key={order.id} className={`hover:bg-gray-50 ${isPartnerOrder(order) ? 'bg-red-50/40' : ''}`}>
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
                          {isPartnerOrder(order) && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wide">
                              Partner Portal
                            </span>
                          )}
                          {isConsignmentOrder(order) && (
                            <span className="inline-flex items-center gap-1 mt-1 ml-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wide">
                              Consignment
                            </span>
                          )}
                          {isCreditOrder(order) && (
                            <span className="inline-flex items-center gap-1 mt-1 ml-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wide">
                              Credit {order.creditDays ? `${order.creditDays}d` : ''}
                            </span>
                          )}
                          {isSettlementOrder(order) && (
                            isPaid(order) ? (
                              <div className="text-[11px] font-semibold text-green-700 mt-0.5">
                                Paid{order.paidAt ? ` · ${new Date(order.paidAt).toLocaleDateString('en-GB')}` : ''}
                              </div>
                            ) : (
                              <div className={`text-[11px] font-semibold mt-0.5 ${isOverdue(order) ? 'text-red-600' : 'text-amber-700'}`}>
                                {isCreditOrder(order) && order.paymentDueDate
                                  ? `${isOverdue(order) ? 'OVERDUE - due' : 'Due'} ${new Date(order.paymentDueDate).toLocaleDateString('en-GB')}`
                                  : 'Payment pending'}
                              </div>
                            )
                          )}
                          {/* Customer name - visible on mobile only (Customer column is hidden on mobile) */}
                          <div className="text-xs text-blue-600 font-medium mt-0.5 sm:hidden">{order.customerName}</div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap">
                          {/* Fulfillment stays primary. Credit/consignment payment
                              is a second badge - never overwrite order.status. */}
                          <div className="flex flex-col items-start gap-1">
                            <StatusBadge status={order.status} />
                            {isSettlementOrder(order) && order.status !== 'CANCELLED' && (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                  isPaid(order)
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isOverdue(order)
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-amber-100 text-amber-900'
                                }`}
                                title={
                                  isPaid(order) && order.paidAt
                                    ? `Paid ${new Date(order.paidAt).toLocaleDateString('en-GB')}`
                                    : isCreditOrder(order) && order.paymentDueDate
                                      ? `Due ${new Date(order.paymentDueDate).toLocaleDateString('en-GB')}`
                                      : undefined
                                }
                              >
                                {isPaid(order)
                                  ? isCreditOrder(order)
                                    ? 'Credit paid'
                                    : 'Settled'
                                  : isOverdue(order)
                                    ? 'Credit overdue'
                                    : isCreditOrder(order)
                                      ? 'Credit open'
                                      : 'Unpaid'}
                              </span>
                            )}
                          </div>
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
                            {isSettlementOrder(order) && !isPaid(order) && order.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handleMarkPaid(order)}
                                disabled={markingPaid === order.id}
                                className="text-green-700 hover:text-green-900 transition-colors disabled:opacity-50 touch-manipulation p-1"
                                title="Mark payment received"
                              >
                                <BadgeDollarSign className="h-4 w-4" />
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