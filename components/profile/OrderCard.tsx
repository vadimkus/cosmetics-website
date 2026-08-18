'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Package, Fish } from 'lucide-react'
import { OrderWithItems } from '@/types/profile'
import { useTranslation } from '@/hooks/useTranslation'

type OrderItemWithOptionalFields = OrderWithItems['items'][0] & {
  selectedSize?: string
  selectedColor?: string
  size?: string
  color?: string
}

interface OrderCardProps {
  order: OrderWithItems
  onCancel: (orderId: string) => void
  formatCurrency: (amount: number) => string
  getProductImage: (productName: string) => string
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactNode
}

export default function OrderCard({ 
  order, 
  onCancel, 
  formatCurrency,
  getProductImage,
  getStatusColor,
  getStatusIcon
}: OrderCardProps) {
  const { t } = useTranslation()
  
  const getOrderIcon = (orderNumber: string | null) => {
    // Use pot emoji for SUP orders
    if (orderNumber && orderNumber.startsWith('SUP')) {
      return <span className="text-xl">🍲</span>
    }
    // Use fish icon for COD orders
    if (orderNumber && orderNumber.startsWith('COD')) {
      return <Fish className="h-5 w-5 text-blue-600" />
    }
    // Default Package icon for other orders
    return <Package className="h-5 w-5 text-[var(--cera-body)]" />
  }
  
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
            order.orderNumber?.startsWith('SUP') ? 'bg-orange-50' : 
            order.orderNumber?.startsWith('COD') ? 'bg-blue-50' : 
            'bg-white'
          }`}>
            {getOrderIcon(order.orderNumber)}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--cera-ink)]">Order #{order.orderNumber || order.id.slice(-8)}</h3>
            <p className="text-sm text-[var(--cera-body)]">
              {new Date(order.createdAt).toLocaleDateString('en-AE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-[var(--cera-ink)]">{formatCurrency(order.total)}</p>
          <p className="text-sm text-[var(--cera-body)]">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item, index: number) => {
          const itemWithOptional = item as OrderItemWithOptionalFields
          // Use item.image if available, otherwise fallback to getProductImage
          const imageSrc = item.image || getProductImage(item.productName);
          return (
            <div key={index} className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="w-12 h-12 bg-[var(--cera-cream-deep)] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src={imageSrc}
                  alt={item.productName}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement | null;
                    if (!target) return;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-[var(--cera-muted)] text-xs">📦</div>';
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[var(--cera-ink)] truncate">{item.productName}</h4>
                <p className="text-sm text-[var(--cera-body)]">
                  {item.quantity} × {formatCurrency(item.price)}
                </p>
                {(itemWithOptional.size || itemWithOptional.selectedSize) && (
                  <p className="text-xs text-[var(--cera-muted)]">{t('product.size')}: {itemWithOptional.size || itemWithOptional.selectedSize}</p>
                )}
                {(itemWithOptional.color || itemWithOptional.selectedColor) && (
                  <p className="text-xs text-[var(--cera-muted)]">{t('product.color')}: {itemWithOptional.color || itemWithOptional.selectedColor}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-[var(--cera-ink)]">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--cera-line)]">
        <div className={`flex items-center gap-2 p-2 rounded-lg ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="text-sm font-medium text-[var(--cera-body)] capitalize">
            {order.status.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onCancel(order.id)}
              className="px-3 py-1 text-sm text-[var(--cera-rose-ink)] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <Link
            href={`/products/${order.items[0]?.productId || ''}`}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  )
}
