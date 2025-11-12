'use client'

import Image from 'next/image'
import { Package, ShoppingBag, Calendar, X, CreditCard, Truck, CheckCircle, Clock } from 'lucide-react'
import { Order, OrderItem } from '@prisma/client'
import StatusBadge from '@/components/shared/StatusBadge'
import EmptyState from '@/components/shared/EmptyState'

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

interface OrderHistoryProps {
  orders: OrderWithItems[]
  loadingOrders: boolean
  onCancelOrder: (orderId: string) => void
}

export default function OrderHistory({ orders, loadingOrders, onCancelOrder }: OrderHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getProductImage = (productName: string) => {
    const imageMap: Record<string, string> = {
      // Add your product image mappings here
      'Microneedle Roller': '/images/genosys-microneedling-devices.jpg',
      'Needle Pen-K': '/images/Needle-pen.jpg',
      'SNOW O₂ CLEANSER': '/images/SNOW.jpg',
      'SNOW BOOSTER': '/images/BOOS.jpg',
      'MULTI VITA RADIANCE CREAM': '/images/RAA.jpg',
      'MULTI VITA RADIANCE SERUM': '/images/RADS.jpg',
      'MULTI FUNCTIONAL ANTI-WRINKLE SERUM': '/images/MSSS.jpg',
      'ND Cell ANTI-WRINKLE CREAM': '/images/ND.jpg',
      'SOOTHING REPAIR POSTCREAM': '/images/SRC.jpg',
      'SKIN RENEWAL PEELING SYSTEM (SRS)': '/images/SRS.jpg',
      'PEPTIDE GEL MASK': '/images/PEP.jpg',
      'SKIN RESCUE OVERNIGHT CREAM MASK': '/images/SKIN.jpg',
      'SOOTHING BOMB SEA ALGAE MASK': '/images/SEA.jpg',
      'MULTI SUN CREAM [SPF 40 PA++]': '/images/SSUN.jpg',
      'ULTRA SHIELD SUN CREAM [SPF 50+ PA++++]': '/images/SPF50.jpg',
      'BIO-FERMENT AGE DEFYING POWDER MASK': '/images/BFAD.png',
      'SKIN REBOOT PDRN MASK PACK': '/images/REB.png',
      'Test Product': '/images/placeholder.jpg',
      'Support Product': '/images/placeholder.jpg'
    }
    
    return imageMap[productName] || '/images/placeholder.jpg'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CreditCard className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
          <Package className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
      </div>
      
      {loadingOrders ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12 text-gray-300" />}
          title="No orders yet"
          description="Start shopping to see your order history here!"
          action={{
            label: 'Browse Products',
            href: '/products',
            onClick: () => {}
          }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Package className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Order #{order.orderNumber || order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-AE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={order.status}
                      icon={getStatusIcon(order.status)}
                      className="px-4 py-2 text-sm border"
                    />
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-gray-500">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Products Ordered
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(order.items || []).slice(0, 6).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                          <Image
                            src={getProductImage(item.productName)}
                            alt={item.productName}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">📦</div>';
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 6 && (
                      <div className="flex items-center justify-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">
                          +{order.items.length - 6} more products
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Ordered on {new Date(order.createdAt).toLocaleDateString('en-AE', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {(order.status === 'pending' || order.status === 'paid') && (
                    <button
                      onClick={() => onCancelOrder(order.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-sm rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200 min-h-[44px] touch-manipulation"
                    >
                      <X className="h-4 w-4" />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}