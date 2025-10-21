'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Mail } from 'lucide-react'

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
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [resending, setResending] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // Get all recent orders by fetching from a known email or implementing a getAllOrders function
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const resendNotification = async (orderNumber: string) => {
    try {
      setResending(orderNumber)
      const response = await fetch('/api/admin/resend-order-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderNumber }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Admin notification sent successfully!')
      } else {
        alert('Failed to send notification: ' + result.error)
      }
    } catch (error) {
      console.error('Error resending notification:', error)
      alert('Error sending notification')
    } finally {
      setResending(null)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toFixed(2)}`
  }

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
                
                {/* Order Breakdown Summary */}
                <div className="bg-gray-50 rounded-lg p-3 text-xs">
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
