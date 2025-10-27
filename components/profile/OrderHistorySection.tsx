'use client'

import { Package, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import OrderCard from './OrderCard'

interface OrderHistorySectionProps {
  orders: any[]
  loadingOrders: boolean
  onCancel: (orderId: string) => void
  formatCurrency: (amount: number) => string
  getProductImage: (productName: string) => string
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => any
}

export default function OrderHistorySection({
  orders,
  loadingOrders,
  onCancel,
  formatCurrency,
  getProductImage,
  getStatusColor,
  getStatusIcon
}: OrderHistorySectionProps) {
  if (loadingOrders) {
    return (
      <div className="space-y-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading orders...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Your order history will appear here once you make your first purchase.</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={onCancel}
                formatCurrency={formatCurrency}
                getProductImage={getProductImage}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
