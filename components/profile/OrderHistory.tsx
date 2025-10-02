'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, Clock, CheckCircle, Truck, X, Eye, RefreshCw, ArrowLeft } from 'lucide-react'
import { OrderWithItems } from '@/types/profile'

interface OrderHistoryProps {
  orders: OrderWithItems[]
  loading: boolean
  onOrderCancel: (orderId: string) => Promise<void>
}

export default function OrderHistory({ orders, loading, onOrderCancel }: OrderHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <Package className="h-4 w-4" />
      case 'cancelled':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount)
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    
    setCancellingOrder(orderId)
    try {
      await onOrderCancel(orderId)
    } catch (error) {
      console.error('Error cancelling order:', error)
    } finally {
      setCancellingOrder(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Your order history will appear here once you make a purchase.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (selectedOrder) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </button>
          <div className="text-sm text-gray-500">
            Order #{selectedOrder.id?.slice(-8) || 'N/A'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Information</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Order Number:</span> {selectedOrder.orderNumber}</div>
              <div><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
              <div><span className="font-medium">Status:</span> 
                <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>
              <div><span className="font-medium">Total:</span> {formatCurrency(selectedOrder.total)}</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Name:</span> {selectedOrder.customerName}</div>
              <div><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</div>
              <div><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</div>
              <div><span className="font-medium">Address:</span> {selectedOrder.customerAddress}</div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {selectedOrder.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">{item.productName}</div>
                <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(item.price)}</div>
                <div className="text-sm text-gray-600">each</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        <span className="text-sm text-gray-600">{orders.length} orders</span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-gray-900">
                  Order #{order.id?.slice(-8) || 'N/A'}
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(order.total)}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>{new Date(order.createdAt).toLocaleDateString('en-AE')}</span>
              <span>{order.items.length} items</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center gap-1 px-3 py-1 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingOrder === order.id}
                    className="flex items-center gap-1 px-3 py-1 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    {cancellingOrder === order.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

