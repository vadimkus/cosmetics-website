'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Mail } from 'lucide-react'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  color?: string
  size?: string
}

interface Order {
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  subtotal?: number
  shipping?: number
  vat?: number
  discountAmount?: number
  customerEmirate?: string
  itemCount: number
  status: string
  createdAt: string
  items?: OrderItem[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [resending, setResending] = useState<string | null>(null)

  // Helper to get admin email from session
  const getAdminEmail = (): string | null => {
    if (typeof window === 'undefined') return null
    try {
      const session = localStorage.getItem('admin_session')
      if (session) {
        const parsed = JSON.parse(session)
        return parsed.email || null
      }
    } catch (e) {
      return null
    }
    return null
  }

  // Helper to get admin headers with CSRF
  const getAdminHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getCsrfHeaders() as Record<string, string>
    }
    const email = getAdminEmail()
    if (email) {
      headers['X-Admin-Email'] = email
    }
    return headers as HeadersInit
  }, [])

  // Fetch CSRF token on mount
  useEffect(() => {
    fetchCsrfToken().catch(err => {
      errorLog('Failed to fetch CSRF token:', err)
    })
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      // Get all recent orders by fetching from a known email or implementing a getAllOrders function
      const response = await fetch('/api/admin/orders', {
        headers: getAdminHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      errorLog('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [getAdminHeaders])

  const resendNotification = async (orderNumber: string) => {
    try {
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        return
      }

      setResending(orderNumber)
      const response = await fetch('/api/admin/resend-order-notification', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({ orderNumber })),
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Admin notification sent successfully!')
      } else {
        alert('Failed to send notification: ' + result.error)
      }
    } catch (error) {
      errorLog('Error resending notification:', error)
      alert('Error sending notification')
    } finally {
      setResending(null)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toFixed(2)}`
  }

  // Calculate totals
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalSubtotal = orders.reduce((sum, order) => sum + (order.subtotal || 0), 0)
  const totalShipping = orders.reduce((sum, order) => sum + (order.shipping || 0), 0)
  const totalVat = orders.reduce((sum, order) => sum + (order.vat || 0), 0)
  const totalItems = orders.reduce((sum, order) => sum + order.itemCount, 0)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <button 
          onClick={fetchOrders} 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Section */}
      {!loading && orders.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm opacity-90">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Subtotal</p>
              <p className="text-xl font-semibold">{formatCurrency(totalSubtotal)}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Shipping</p>
              <p className="text-xl font-semibold">{formatCurrency(totalShipping)}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total VAT</p>
              <p className="text-xl font-semibold">{formatCurrency(totalVat)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-red-500">
            <p className="text-sm opacity-90">Total Items</p>
            <p className="text-xl font-semibold">{totalItems} items</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.orderNumber} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.customerName} ({order.customerEmail})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'PENDING' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => resendNotification(order.orderNumber)}
                      disabled={resending === order.orderNumber}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      {resending === order.orderNumber ? 'Sending...' : 'Resend Email'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-medium text-gray-600">Total Amount</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(order.total)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Items</p>
                    <p className="text-lg">{order.itemCount}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Order Date</p>
                    <p className="text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'PENDING' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-xs bg-white p-2 rounded border border-gray-100">
                          <div className="font-medium text-gray-800">{item.productName}</div>
                          <div className="text-gray-600 mt-1">
                            Qty: {item.quantity} × {formatCurrency(item.price)} = {formatCurrency(item.price * item.quantity)}
                          </div>
                          {(item.color || item.size) && (
                            <div className="flex gap-3 mt-2 text-xs">
                              {item.color && (
                                <div className="text-gray-600">
                                  <span className="text-gray-500">Color:</span> <span className="font-semibold text-gray-800 bg-blue-50 px-2 py-0.5 rounded">{item.color}</span>
                                </div>
                              )}
                              {item.size && (
                                <div className="text-gray-600">
                                  <span className="text-gray-500">Size:</span> <span className="font-semibold text-gray-800 bg-green-50 px-2 py-0.5 rounded">{item.size}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Order Breakdown Summary */}
                <div className="bg-gray-50 rounded-lg p-3 text-xs mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="ml-1 font-medium">{formatCurrency(order.subtotal || 0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Shipping:</span>
                      <span className="ml-1 font-medium">{formatCurrency(order.shipping || 0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">VAT:</span>
                      <span className="ml-1 font-medium">{formatCurrency(order.vat || 0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Emirate:</span>
                      <span className="ml-1 font-medium">{order.customerEmirate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
