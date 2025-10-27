'use client'

import Image from 'next/image'
import Link from 'next/link'

interface OrderCardProps {
  order: any
  onCancel: (orderId: string) => void
  formatCurrency: (amount: number) => string
  getProductImage: (productName: string) => string
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => any
}

export default function OrderCard({ 
  order, 
  onCancel, 
  formatCurrency, 
  getProductImage, 
  getStatusColor, 
  getStatusIcon 
}: OrderCardProps) {
  const StatusIcon = getStatusIcon(order.status)
  
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
            <StatusIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Order #{order.id.slice(-8)}</h3>
            <p className="text-sm text-gray-600">
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
          <p className="font-bold text-lg text-gray-800">{formatCurrency(order.total)}</p>
          <p className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-lg">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src={getProductImage(item.productName)}
                alt={item.productName}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-800 truncate">{item.productName}</h4>
              <p className="text-sm text-gray-600">
                {item.quantity} × {formatCurrency(item.price)}
              </p>
              {item.selectedSize && (
                <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
              )}
              {item.selectedColor && (
                <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700 capitalize">
            {order.status.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onCancel(order.id)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
