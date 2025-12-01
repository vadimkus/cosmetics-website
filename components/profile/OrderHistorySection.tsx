'use client'

import { Package, RefreshCw } from 'lucide-react'
import OrderCard from './OrderCard'
import { OrderWithItems } from '@/types/profile'
import EmptyState from '@/components/shared/EmptyState'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

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
  const { t, locale } = useTranslation()
  if (loadingOrders) {
    return (
      <div className="space-y-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t('common.orderHistoryTitle')}</h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>{t('common.loadingOrders')}</span>
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
          <h2 className="text-2xl font-bold text-gray-800">{t('common.orderHistoryTitle')}</h2>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12 text-gray-300" />}
            title={t('common.noOrdersYetTitle')}
            description={t('common.noOrdersYetDescription')}
            action={{
              label: t('profile.browseProducts'),
              href: getLocalizedPath('/products', locale),
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
