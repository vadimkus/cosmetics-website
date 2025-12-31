'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, X, Clock, CheckCircle, Truck, XCircle, RefreshCw, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem } from '@prisma/client'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { usePWAMode } from '@/hooks/usePWAMode'

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const defaultConfig = { 
    icon: <Clock className="w-3.5 h-3.5" />, 
    bg: 'bg-gray-50', 
    text: 'text-gray-700',
    label: status
  }

  const statusConfig: Record<string, { icon: React.ReactNode; bg: string; text: string; label: string }> = {
    pending: { 
      icon: <Clock className="w-3.5 h-3.5" />, 
      bg: 'bg-amber-50', 
      text: 'text-amber-700',
      label: 'Pending'
    },
    processing: { 
      icon: <RefreshCw className="w-3.5 h-3.5" />, 
      bg: 'bg-blue-50', 
      text: 'text-blue-700',
      label: 'Processing'
    },
    shipped: { 
      icon: <Truck className="w-3.5 h-3.5" />, 
      bg: 'bg-indigo-50', 
      text: 'text-indigo-700',
      label: 'Shipped'
    },
    delivered: { 
      icon: <CheckCircle className="w-3.5 h-3.5" />, 
      bg: 'bg-green-50', 
      text: 'text-green-700',
      label: 'Delivered'
    },
    cancelled: { 
      icon: <XCircle className="w-3.5 h-3.5" />, 
      bg: 'bg-red-50', 
      text: 'text-red-700',
      label: 'Cancelled'
    },
  }

  const config = statusConfig[status.toLowerCase()] || defaultConfig
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  )
}

/**
 * Orders Page - Professional standalone order history
 * 
 * Clean, focused layout optimized for both PWA and browser.
 * Shows order history with professional styling.
 */
export default function OrdersPage() {
  const { t, locale, dir } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const { isPWA, isClient } = usePWAMode()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const isRTL = dir === 'rtl'

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isClient && !user) {
      router.push(getLocalizedPath('/login', locale))
    }
  }, [user, router, locale, isClient])

  // Fetch CSRF token
  useEffect(() => {
    fetchCsrfToken().catch(err => {
      errorLog('Failed to fetch CSRF token:', err)
    })
  }, [])

  // Fetch user orders
  const fetchOrders = async () => {
    if (!user?.email) return
    
    setLoadingOrders(true)
    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        errorLog('Failed to fetch orders:', response.statusText)
      }
    } catch (error) {
      errorLog('Error fetching orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [user?.email])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrders()
    setRefreshing(false)
  }

  const handleCancelOrderClick = (orderId: string) => {
    setOrderToCancel(orderId)
    setShowCancelConfirm(true)
  }

  const cancelOrder = async () => {
    if (!orderToCancel) return

    try {
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) return

      const response = await fetch(`/api/orders/${encodeURIComponent(orderToCancel)}/cancel`, {
        method: 'POST',
        headers: getCsrfHeaders(),
        body: JSON.stringify(addCsrfToBody({}))
      })
      
      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderToCancel))
      }
    } catch (error) {
      errorLog('Failed to cancel order:', error)
    } finally {
      setShowCancelConfirm(false)
      setOrderToCancel(null)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} AED`
  }

  // Loading state
  if (!isClient || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-red-600"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-white ${isPWA ? 'pb-32' : ''}`}>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.orders') || 'Orders', url: getLocalizedPath('/orders', locale) }
        ]}
      />
      
      {/* Page Header - Only show on non-PWA (PWA has its own header) */}
      {!isPWA && (
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link 
                  href={getLocalizedPath('/products', locale)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className={`h-5 w-5 text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Package className="h-6 w-6 text-red-600" />
                  <h1 className="text-xl font-bold text-gray-900">
                    {t('navigation.orders') || 'My Orders'}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA Title Section */}
      {isPWA && (
        <div className="px-4 pt-4 pb-2">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <Package className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t('navigation.orders') || 'My Orders'}
                </h1>
                <p className="text-xs text-gray-500">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              aria-label="Refresh orders"
            >
              <RefreshCw className={`h-5 w-5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Orders Content */}
      <div className={`${isPWA ? 'px-4 py-2' : 'container mx-auto px-4 py-6'}`}>
        {loadingOrders ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-4 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('orders.noOrders') || 'No orders yet'}
            </h2>
            <p className="text-gray-500 text-center mb-6 max-w-xs">
              {t('orders.noOrdersDescription') || 'When you place orders, they will appear here.'}
            </p>
            <Link
              href={getLocalizedPath('/products', locale)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              {t('navigation.products') || 'Browse Products'}
            </Link>
          </div>
        ) : (
          // Orders list
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className={`px-4 py-3 bg-gray-50 border-b border-gray-100 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        {t('orders.orderNumber') || 'Order'} #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4">
                  <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Product Images */}
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div 
                          key={idx}
                          className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white overflow-hidden flex-shrink-0"
                          style={{ zIndex: 3 - idx }}
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.productName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div 
                          className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center flex-shrink-0"
                          style={{ zIndex: 0 }}
                        >
                          <span className="text-xs font-medium text-gray-600">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {formatCurrency(Number(order.total))}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Link
                      href={getLocalizedPath(`/orders/${order.id}`, locale)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl text-sm font-medium text-center hover:bg-gray-200 transition-colors"
                    >
                      {t('orders.viewDetails') || 'View Details'}
                    </Link>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrderClick(order.id)}
                        className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
                      >
                        {t('orders.cancel') || 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className={`flex items-center gap-4 mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 bg-red-100 rounded-xl flex-shrink-0">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-lg font-bold text-gray-900">
                  {t('orders.cancelOrder') || 'Cancel Order?'}
                </h3>
                <p className="text-sm text-gray-500">
                  {t('orders.cancelWarning') || 'This cannot be undone'}
                </p>
              </div>
            </div>
            
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => {
                  setShowCancelConfirm(false)
                  setOrderToCancel(null)
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {t('common.no') || 'No, Keep'}
              </button>
              <button
                onClick={cancelOrder}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                {t('common.yes') || 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
