'use client'

import Link from 'next/link'
import { ArrowLeft, Package, X } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem } from '@prisma/client'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import OrderHistory from '@/components/profile/OrderHistory'

// Custom type that includes the items relation
type OrderWithItems = Order & {
  items: OrderItem[]
}

/**
 * Orders Page - Dedicated order history page
 * 
 * This page shows the user's order history in a clean, focused layout.
 * Ideal for PWA footer navigation where users expect quick access to orders.
 */
export default function OrdersPage() {
  const { t, locale, dir } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push(getLocalizedPath('/login', locale))
    }
  }, [user, router, locale])

  // Fetch CSRF token
  useEffect(() => {
    fetchCsrfToken().catch(err => {
      errorLog('Failed to fetch CSRF token:', err)
    })
  }, [])

  // Fetch user orders
  useEffect(() => {
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

    fetchOrders()
  }, [user?.email])

  const handleCancelOrderClick = (orderId: string) => {
    setOrderToCancel(orderId)
    setShowCancelConfirm(true)
  }

  const cancelOrder = async () => {
    if (!orderToCancel) return

    try {
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        return
      }

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

  // Show nothing while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.orders') || 'Orders', url: getLocalizedPath('/orders', locale) }
        ]}
      />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href={getLocalizedPath('/products', locale)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className={`h-5 w-5 text-gray-600 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  {t('navigation.orders') || 'My Orders'}
                </h1>
              </div>
            </div>
            
            {/* Order count badge */}
            {orders.length > 0 && (
              <span className="bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="container mx-auto px-4 py-6">
        <OrderHistory
          orders={orders}
          loadingOrders={loadingOrders}
          onCancelOrder={handleCancelOrderClick}
        />
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {t('profile.cancelOrder') || 'Cancel Order'}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {t('profile.cancelOrderConfirmation') || 'Are you sure you want to cancel this order? This action cannot be undone.'}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelOrder}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                <X className="h-5 w-5" />
                {t('common.yes') || 'Yes'}, {t('profile.cancelOrder') || 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false)
                  setOrderToCancel(null)
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                {t('common.no') || 'No'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

