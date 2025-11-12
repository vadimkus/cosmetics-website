'use client'

import { Package, RefreshCw } from 'lucide-react'
import OrderCard from './OrderCard'
import { OrderWithItems } from '@/types/profile'
import EmptyState from '@/components/shared/EmptyState'

interface OrderHistorySectionProps {
  orders: OrderWithItems[]
  loadingOrders: boolean
  onCancel: (orderId: string) => void
  formatCurrency: (amount: number) => string
  getProductImage: (productName: string) => string
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactNode
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
          <EmptyState
            icon={<Package className="h-12 w-12 text-gray-300" />}
            title="No orders yet"
            description="Your order history will appear here once you make your first purchase."
            action={{
              label: 'Browse Products',
              href: '/products',
              onClick: () => {}
            }}
          />
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
