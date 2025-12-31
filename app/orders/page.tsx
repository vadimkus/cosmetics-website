'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, X, Clock, CheckCircle, Truck, XCircle, RefreshCw, ShoppingBag, ChevronDown } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

// Status translations
const statusLabels: Record<string, Record<string, string>> = {
  pending: { en: 'Pending', ar: 'قيد الانتظار', ru: 'В ожидании' },
  processing: { en: 'Processing', ar: 'قيد المعالجة', ru: 'В обработке' },
  shipped: { en: 'Shipped', ar: 'تم الشحن', ru: 'Отправлено' },
  delivered: { en: 'Delivered', ar: 'تم التوصيل', ru: 'Доставлено' },
  cancelled: { en: 'Cancelled', ar: 'ملغاة', ru: 'Отменено' },
}

// Status badge component
function StatusBadge({ status, locale = 'en' }: { status: string; locale?: string }) {
  const statusKey = status.toLowerCase()
  const label = statusLabels[statusKey]?.[locale] || statusLabels[statusKey]?.en || status

  const defaultConfig = { 
    icon: <Clock className="w-3.5 h-3.5" />, 
    bg: 'bg-gray-50', 
    text: 'text-gray-700'
  }

  const statusConfig: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
    pending: { 
      icon: <Clock className="w-3.5 h-3.5" />, 
      bg: 'bg-amber-50', 
      text: 'text-amber-700'
    },
    processing: { 
      icon: <RefreshCw className="w-3.5 h-3.5" />, 
      bg: 'bg-blue-50', 
      text: 'text-blue-700'
    },
    shipped: { 
      icon: <Truck className="w-3.5 h-3.5" />, 
      bg: 'bg-indigo-50', 
      text: 'text-indigo-700'
    },
    delivered: { 
      icon: <CheckCircle className="w-3.5 h-3.5" />, 
      bg: 'bg-green-50', 
      text: 'text-green-700'
    },
    cancelled: { 
      icon: <XCircle className="w-3.5 h-3.5" />, 
      bg: 'bg-red-50', 
      text: 'text-red-700'
    },
  }

  const config = statusConfig[statusKey] || defaultConfig
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {label}
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
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isPWA, isClient } = usePWAMode()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'

  // Redirect to login if not authenticated - wait for auth to finish loading first
  useEffect(() => {
    if (isClient && !authLoading && !user) {
      router.push(getLocalizedPath('/login', locale))
    }
  }, [user, authLoading, router, locale, isClient])

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

  // Loading state - wait for auth to finish loading before showing content
  if (!isClient || authLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-red-600"></div>
          <p className="text-sm text-gray-500">{authLoading ? 'Loading...' : 'Checking authentication...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isPWA ? 'bg-gray-50 pb-32' : 'bg-white'}`}>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.orders') || 'Orders', url: getLocalizedPath('/orders', locale) }
        ]}
      />
      
      {/* PWA Simple Navigation Header */}
      {isPWA && (
        <div className={`flex items-center justify-between px-5 py-4 bg-white ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base text-red-600">
              {fromProfile ? (t('pwaProfile.account') || 'Account') : (t('pwaProfile.home') || 'Home')}
            </span>
          </button>
          <span className="text-base font-semibold text-gray-900">
            {t('navigation.orders') || 'Orders'}
          </span>
          {/* Profile Icon with green dot */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {/* Green online dot */}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </button>
        </div>
      )}
      
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
          // Empty state - styled like favorites page
          <div className="max-w-md mx-auto text-center py-8 md:py-16 px-4">
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
              {/* Unicorn illustration */}
              <div className="mb-4">
                <Image
                  src="/images/avatar/uni.png"
                  alt="No orders"
                  width={80}
                  height={80}
                  className="mx-auto"
                />
              </div>
              
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
                {locale === 'ar' ? 'لا توجد طلبات بعد' : locale === 'ru' ? 'Заказов пока нет' : 'No orders yet'}
              </h2>
              <p className="text-sm md:text-base text-gray-500 mb-6">
                {locale === 'ar' 
                  ? 'عندما تقوم بإجراء طلبات، ستظهر هنا' 
                  : locale === 'ru' 
                    ? 'Когда вы сделаете заказы, они появятся здесь' 
                    : 'When you place orders, they will appear here'}
              </p>
              
              <Link
                href={getLocalizedPath('/products', locale)}
                className={`inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 active:bg-red-800 transition-colors shadow-lg shadow-red-200 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <ShoppingBag className="w-5 h-5" />
                {locale === 'ar' ? 'تصفح المنتجات' : locale === 'ru' ? 'Смотреть товары' : 'Browse Products'}
              </Link>
            </div>
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
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} locale={locale} />
                  </div>
                </div>

                {/* Order Summary - Expandable */}
                <div className="p-4">
                  {/* Clickable Header */}
                  <button
                    onClick={() => {
                      const newExpanded = new Set(expandedOrders)
                      if (newExpanded.has(order.id)) {
                        newExpanded.delete(order.id)
                      } else {
                        newExpanded.add(order.id)
                      }
                      setExpandedOrders(newExpanded)
                    }}
                    className={`w-full flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {/* Product Images */}
                      <div className={`flex ${isRTL ? 'space-x-reverse -space-x-2' : '-space-x-2'}`}>
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
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {order.items.length} {order.items.length === 1 
                            ? (locale === 'ar' ? 'منتج' : locale === 'ru' ? 'товар' : 'item')
                            : (locale === 'ar' ? 'منتجات' : locale === 'ru' ? 'товаров' : 'items')}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {formatCurrency(Number(order.total))}
                        </p>
                      </div>
                    </div>

                    {/* Chevron */}
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isRTL ? 'mr-2' : 'ml-2'} ${expandedOrders.has(order.id) ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Expanded Order Details */}
                  <div className={`overflow-hidden transition-all duration-200 ${expandedOrders.has(order.id) ? 'max-h-[800px] mt-4' : 'max-h-0'}`}>
                    <div className="border-t border-gray-100 pt-4 space-y-4">
                      
                      {/* Items List - Text Only */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Товары' : 'Items'}
                        </p>
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx}
                            className={`flex justify-between items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                          >
                            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                              <p className="text-sm text-gray-900">{item.productName}</p>
                              <p className="text-xs text-gray-500">
                                {locale === 'ar' ? 'الكمية' : locale === 'ru' ? 'Кол-во' : 'Qty'}: {item.quantity}
                                {item.size && ` • ${item.size}`}
                                {item.color && ` • ${item.color}`}
                              </p>
                            </div>
                            <p className={`text-sm text-gray-900 flex-shrink-0`}>
                              {formatCurrency(Number(item.price) * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          {locale === 'ar' ? 'ملخص الطلب' : locale === 'ru' ? 'Сумма заказа' : 'Order Summary'}
                        </p>
                        
                        {/* Subtotal */}
                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600">
                            {locale === 'ar' ? 'المجموع الفرعي' : locale === 'ru' ? 'Подытог' : 'Subtotal'}
                          </span>
                          <span className="text-gray-900">{formatCurrency(Number(order.subtotal))}</span>
                        </div>

                        {/* Discount - only show if there's a discount */}
                        {Number(order.discountAmount) > 0 && (
                          <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-green-600">
                              {locale === 'ar' ? 'الخصم' : locale === 'ru' ? 'Скидка' : 'Discount'}
                            </span>
                            <span className="text-green-600">-{formatCurrency(Number(order.discountAmount))}</span>
                          </div>
                        )}

                        {/* Shipping */}
                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600">
                            {locale === 'ar' ? 'الشحن' : locale === 'ru' ? 'Доставка' : 'Shipping'}
                          </span>
                          <span className={Number(order.shipping) === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                            {Number(order.shipping) === 0 
                              ? (locale === 'ar' ? 'مجاني' : locale === 'ru' ? 'Бесплатно' : 'FREE')
                              : formatCurrency(Number(order.shipping))
                            }
                          </span>
                        </div>

                        {/* VAT */}
                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600">
                            {locale === 'ar' ? 'ضريبة القيمة المضافة (5%)' : locale === 'ru' ? 'НДС (5%)' : 'VAT (5%)'}
                          </span>
                          <span className="text-gray-900">{formatCurrency(Number(order.vat))}</span>
                        </div>

                        {/* Total */}
                        <div className={`flex justify-between pt-2 border-t border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm font-semibold text-gray-900">
                            {locale === 'ar' ? 'الإجمالي' : locale === 'ru' ? 'Итого' : 'Total'}
                          </span>
                          <span className="text-base font-bold text-gray-900">{formatCurrency(Number(order.total))}</span>
                        </div>
                      </div>

                      {/* Delivery Information */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {locale === 'ar' ? 'معلومات التوصيل' : locale === 'ru' ? 'Информация о доставке' : 'Delivery Information'}
                        </p>
                        <div className={`text-sm space-y-1 ${isRTL ? 'text-right' : ''}`}>
                          <p className="text-gray-900 font-medium">{order.customerName}</p>
                          <p className="text-gray-600">{order.customerPhone}</p>
                          <p className="text-gray-600">{order.customerAddress}</p>
                          <p className="text-gray-600">{order.customerEmirate}</p>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className={`flex justify-between items-center text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-500">
                          {locale === 'ar' ? 'طريقة الدفع' : locale === 'ru' ? 'Способ оплаты' : 'Payment'}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {order.paymentMethod === 'cod' 
                            ? (locale === 'ar' ? 'الدفع عند الاستلام' : locale === 'ru' ? 'При получении' : 'Cash on Delivery')
                            : order.paymentMethod === 'stripe'
                            ? (locale === 'ar' ? 'بطاقة/Apple Pay' : locale === 'ru' ? 'Карта/Apple Pay' : 'Card/Apple Pay')
                            : (locale === 'ar' ? 'رابط الدفع' : locale === 'ru' ? 'Ссылка на оплату' : 'Payment Link')
                          }
                        </span>
                      </div>

                      {/* Order Notes - if any */}
                      {order.orderNotes && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {locale === 'ar' ? 'ملاحظات' : locale === 'ru' ? 'Примечания' : 'Notes'}
                          </p>
                          <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : ''}`}>{order.orderNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cancel Button - Only for pending orders */}
                  {order.status === 'pending' && (
                    <div className={`mt-4 pt-4 border-t border-gray-100 ${isRTL ? 'text-right' : ''}`}>
                      <button
                        onClick={() => handleCancelOrderClick(order.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        {t('orders.cancel') || 'Cancel Order'}
                      </button>
                    </div>
                  )}
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
