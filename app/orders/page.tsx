'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, RefreshCw, ShoppingBag, ChevronDown } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect, useRef, useCallback } from 'react'
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

// iOS-style Status badge component
function StatusBadge({ status, locale = 'en' }: { status: string; locale?: string }) {
  const statusKey = status.toLowerCase()
  const label = statusLabels[statusKey]?.[locale] || statusLabels[statusKey]?.en || status

  // iOS-style colors with your red accent
  const statusConfig: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
    processing: { bg: 'bg-red-500/10', text: 'text-red-600' },
    shipped: { bg: 'bg-purple-500/10', text: 'text-purple-600' },
    delivered: { bg: 'bg-green-500/10', text: 'text-green-600' },
    cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-600' },
  }

  const config = statusConfig[statusKey] || { bg: 'bg-gray-100', text: 'text-gray-600' }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[13px] font-medium ${config.bg} ${config.text}`}>
      {label}
    </span>
  )
}

/**
 * Orders Page - Apple iOS Style Design
 * 
 * Clean, focused layout with iOS design principles.
 * Uses system-like typography, spacing, and interactions.
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
  const [showWhatsAppHelp, setShowWhatsAppHelp] = useState<string | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isLongPressRef = useRef(false)

  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'

  // Redirect to login if not authenticated
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

  // WhatsApp long-press handlers
  const handleWhatsAppPressStart = useCallback((orderNumber: string) => {
    isLongPressRef.current = false
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true
      const message = locale === 'ar' 
        ? `مرحباً، لدي استفسار حول الطلب رقم ${orderNumber}`
        : locale === 'ru'
          ? `Здравствуйте, у меня вопрос по заказу ${orderNumber}`
          : `Hi, I have a question about order ${orderNumber}`
      const whatsappUrl = `https://wa.me/971585487665?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }, 500)
  }, [locale])

  const handleWhatsAppPressEnd = useCallback((orderNumber: string) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
    if (!isLongPressRef.current) {
      setShowWhatsAppHelp(orderNumber)
    }
  }, [])

  const handleWhatsAppPressCancel = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }, [])

  // Loading state
  if (!isClient || authLoading || !user) {
    return (
      <div className={`min-h-screen ${isPWA ? 'bg-[#F2F2F7]' : 'bg-white'} flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-red-600"></div>
          <p className="text-[15px] text-[#8E8E93]">{authLoading ? 'Loading...' : 'Checking authentication...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isPWA ? 'bg-[#F2F2F7] pb-32' : 'bg-white'}`}>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.orders') || 'Orders', url: getLocalizedPath('/orders', locale) }
        ]}
      />
      
      {/* iOS-style Navigation Header */}
      {isPWA && (
        <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-10 border-b border-gray-200/50">
          <div className={`flex items-center justify-between px-4 py-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
              className={`flex items-center gap-0.5 text-red-600 active:opacity-50 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <svg className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span className="text-[17px]">
                {fromProfile ? (locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account') : (locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Продукты' : 'Products')}
              </span>
            </button>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 active:opacity-50 disabled:opacity-30"
              aria-label="Refresh orders"
            >
              <RefreshCw className={`h-5 w-5 text-red-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {/* iOS Large Title */}
          <div className={`px-4 pb-3 ${isRTL ? 'text-right' : ''}`}>
            <h1 className="text-[34px] font-bold tracking-tight text-black">
              {t('navigation.orders') || 'Orders'}
            </h1>
            <p className="text-[15px] text-[#8E8E93] mt-0.5">
              {orders.length} {orders.length === 1 
                ? (locale === 'ar' ? 'طلب' : locale === 'ru' ? 'заказ' : 'order')
                : (locale === 'ar' ? 'طلبات' : locale === 'ru' ? 'заказов' : 'orders')}
            </p>
          </div>
        </div>
      )}
      
      {/* Page Header - Only show on non-PWA */}
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

      {/* Orders Content */}
      <div className={`${isPWA ? 'px-4 py-4' : 'container mx-auto px-4 py-6'}`}>
        {loadingOrders ? (
          // iOS-style Loading skeleton
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-4 w-28 bg-[#E5E5EA] rounded-md" />
                  <div className="h-6 w-20 bg-[#E5E5EA] rounded-full" />
                </div>
                <div className="h-3 w-20 bg-[#E5E5EA] rounded-md" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          // iOS-style Empty state
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-20 h-20 rounded-full bg-[#F2F2F7] flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-[#8E8E93]" />
            </div>
            <h2 className="text-[20px] font-semibold text-black mb-2">
              {locale === 'ar' ? 'لا توجد طلبات' : locale === 'ru' ? 'Нет заказов' : 'No Orders'}
            </h2>
            <p className="text-[15px] text-[#8E8E93] text-center mb-6">
              {locale === 'ar' 
                ? 'سيظهر سجل الطلبات هنا' 
                : locale === 'ru' 
                  ? 'История заказов появится здесь' 
                  : 'Your order history will appear here'}
            </p>
            <Link
              href={getLocalizedPath('/products', locale)}
              className={`bg-red-600 text-white px-6 py-3.5 rounded-xl text-[17px] font-semibold active:opacity-80 inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {locale === 'ar' ? 'تصفح المنتجات' : locale === 'ru' ? 'Смотреть товары' : 'Browse Products'}
            </Link>
          </div>
        ) : (
          // iOS-style Orders list
          <div className="space-y-3">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="bg-white rounded-xl overflow-hidden"
              >
                {/* Order Header */}
                <div className={`px-4 py-3 border-b border-[#E5E5EA]/60 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="text-[15px] font-semibold text-black">
                        {order.orderNumber}
                      </p>
                      <p className="text-[13px] text-[#8E8E93] mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <StatusBadge status={order.status} locale={locale} />
                      {/* WhatsApp Support Icon */}
                      {isPWA && (
                        <button
                          onTouchStart={() => handleWhatsAppPressStart(order.orderNumber)}
                          onTouchEnd={() => handleWhatsAppPressEnd(order.orderNumber)}
                          onTouchCancel={handleWhatsAppPressCancel}
                          onMouseDown={() => handleWhatsAppPressStart(order.orderNumber)}
                          onMouseUp={() => handleWhatsAppPressEnd(order.orderNumber)}
                          onMouseLeave={handleWhatsAppPressCancel}
                          className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center active:opacity-70 touch-manipulation"
                          aria-label="Contact support about this order"
                        >
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Content - Expandable */}
                <div className="px-4 py-3">
                  {/* Clickable Row */}
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
                    className={`w-full flex items-center justify-between active:opacity-70 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {/* Product Images Stack */}
                      <div className={`flex ${isRTL ? 'space-x-reverse -space-x-2' : '-space-x-2'}`}>
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div 
                            key={idx}
                            className="w-11 h-11 rounded-lg bg-[#F2F2F7] border-2 border-white overflow-hidden flex-shrink-0"
                            style={{ zIndex: 3 - idx }}
                          >
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.productName}
                                width={44}
                                height={44}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-[#8E8E93]" />
                              </div>
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div 
                            className="w-11 h-11 rounded-lg bg-[#E5E5EA] border-2 border-white flex items-center justify-center flex-shrink-0"
                            style={{ zIndex: 0 }}
                          >
                            <span className="text-[13px] font-medium text-[#8E8E93]">
                              +{order.items.length - 3}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="text-[15px] font-medium text-black">
                          {order.items.length} {order.items.length === 1 
                            ? (locale === 'ar' ? 'منتج' : locale === 'ru' ? 'товар' : 'item')
                            : (locale === 'ar' ? 'منتجات' : locale === 'ru' ? 'товаров' : 'items')}
                        </p>
                        <p className="text-[17px] font-semibold text-black mt-0.5">
                          {formatCurrency(Number(order.total))}
                        </p>
                      </div>
                    </div>

                    {/* Chevron */}
                    <ChevronDown 
                      className={`w-5 h-5 text-[#C7C7CC] transition-transform duration-200 flex-shrink-0 ${isRTL ? 'mr-2' : 'ml-2'} ${expandedOrders.has(order.id) ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Expanded Details */}
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${expandedOrders.has(order.id) ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-[#E5E5EA]/60 pt-4 space-y-4">
                      
                      {/* Items List */}
                      <div className="space-y-3">
                        <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">
                          {locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Товары' : 'Items'}
                        </p>
                        {order.items.map((item, idx) => (
                          <div 
                            key={idx}
                            className={`flex justify-between items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                          >
                            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                              <p className="text-[15px] text-black">{item.productName}</p>
                              <p className="text-[13px] text-[#8E8E93] mt-0.5">
                                {locale === 'ar' ? 'الكمية' : locale === 'ru' ? 'Кол-во' : 'Qty'}: {item.quantity}
                                {item.size && ` · ${item.size}`}
                                {item.color && ` · ${item.color}`}
                              </p>
                            </div>
                            <p className="text-[15px] text-black flex-shrink-0">
                              {formatCurrency(Number(item.price) * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary Card */}
                      <div className="bg-[#F2F2F7] rounded-xl p-4 space-y-2.5">
                        <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
                          {locale === 'ar' ? 'ملخص الطلب' : locale === 'ru' ? 'Сумма заказа' : 'Summary'}
                        </p>
                        
                        <div className={`flex justify-between text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[#8E8E93]">
                            {locale === 'ar' ? 'المجموع الفرعي' : locale === 'ru' ? 'Подытог' : 'Subtotal'}
                          </span>
                          <span className="text-black">{formatCurrency(Number(order.subtotal))}</span>
                        </div>

                        {Number(order.discountAmount) > 0 && (
                          <div className={`flex justify-between text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-green-600">
                              {locale === 'ar' ? 'الخصم' : locale === 'ru' ? 'Скидка' : 'Discount'}
                            </span>
                            <span className="text-green-600">-{formatCurrency(Number(order.discountAmount))}</span>
                          </div>
                        )}

                        <div className={`flex justify-between text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[#8E8E93]">
                            {locale === 'ar' ? 'الشحن' : locale === 'ru' ? 'Доставка' : 'Shipping'}
                          </span>
                          <span className={Number(order.shipping) === 0 ? 'text-green-600 font-medium' : 'text-black'}>
                            {Number(order.shipping) === 0 
                              ? (locale === 'ar' ? 'مجاني' : locale === 'ru' ? 'Бесплатно' : 'Free')
                              : formatCurrency(Number(order.shipping))
                            }
                          </span>
                        </div>

                        <div className={`flex justify-between text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[#8E8E93]">
                            {locale === 'ar' ? 'ضريبة القيمة المضافة' : locale === 'ru' ? 'НДС (5%)' : 'VAT (5%)'}
                          </span>
                          <span className="text-black">{formatCurrency(Number(order.vat))}</span>
                        </div>

                        <div className={`flex justify-between pt-2.5 border-t border-[#D1D1D6] ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[17px] font-semibold text-black">
                            {locale === 'ar' ? 'الإجمالي' : locale === 'ru' ? 'Итого' : 'Total'}
                          </span>
                          <span className="text-[17px] font-bold text-black">{formatCurrency(Number(order.total))}</span>
                        </div>
                      </div>

                      {/* Delivery Information */}
                      <div className="space-y-2">
                        <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">
                          {locale === 'ar' ? 'معلومات التوصيل' : locale === 'ru' ? 'Доставка' : 'Delivery'}
                        </p>
                        <div className={`text-[15px] space-y-1 ${isRTL ? 'text-right' : ''}`}>
                          <p className="text-black font-medium">{order.customerName}</p>
                          <p className="text-[#8E8E93]">{order.customerPhone}</p>
                          <p className="text-[#8E8E93]">{order.customerAddress}</p>
                          <p className="text-[#8E8E93]">{order.customerEmirate}</p>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className={`flex justify-between items-center text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[#8E8E93]">
                          {locale === 'ar' ? 'طريقة الدفع' : locale === 'ru' ? 'Способ оплаты' : 'Payment'}
                        </span>
                        <span className="text-black font-medium">
                          {order.paymentMethod === 'cod' 
                            ? (locale === 'ar' ? 'الدفع عند الاستلام' : locale === 'ru' ? 'При получении' : 'Cash on Delivery')
                            : order.paymentMethod === 'stripe'
                            ? (locale === 'ar' ? 'بطاقة/Apple Pay' : locale === 'ru' ? 'Карта/Apple Pay' : 'Card/Apple Pay')
                            : (locale === 'ar' ? 'رابط الدفع' : locale === 'ru' ? 'Ссылка на оплату' : 'Payment Link')
                          }
                        </span>
                      </div>

                      {/* Order Notes */}
                      {order.orderNotes && (
                        <div className="space-y-1">
                          <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide">
                            {locale === 'ar' ? 'ملاحظات' : locale === 'ru' ? 'Примечания' : 'Notes'}
                          </p>
                          <p className={`text-[15px] text-[#8E8E93] ${isRTL ? 'text-right' : ''}`}>{order.orderNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cancel Button - Only for pending orders */}
                  {order.status === 'pending' && (
                    <div className={`mt-4 pt-4 border-t border-[#E5E5EA]/60 ${isRTL ? 'text-right' : ''}`}>
                      <button
                        onClick={() => handleCancelOrderClick(order.id)}
                        className="text-red-600 text-[15px] font-medium active:opacity-50"
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

      {/* iOS-style Action Sheet for Cancel */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <div 
            className="bg-white w-full max-w-lg rounded-t-2xl animate-[slideUp_0.3s_ease-out]"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 32px)' }}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-9 h-1 bg-[#D1D1D6] rounded-full" />
            </div>
            
            <div className="px-6 pt-2 pb-6 text-center">
              <h3 className="text-[20px] font-semibold text-black mb-2">
                {t('orders.cancelOrder') || 'Cancel Order?'}
              </h3>
              <p className="text-[15px] text-[#8E8E93]">
                {t('orders.cancelWarning') || 'This action cannot be undone.'}
              </p>
            </div>
            
            <div className="px-4 space-y-2 pb-2">
              <button
                onClick={cancelOrder}
                className="w-full bg-red-600 text-white py-4 rounded-xl text-[17px] font-semibold active:opacity-80"
              >
                {locale === 'ar' ? 'إلغاء الطلب' : locale === 'ru' ? 'Отменить заказ' : 'Cancel Order'}
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false)
                  setOrderToCancel(null)
                }}
                className="w-full bg-[#F2F2F7] text-red-600 py-4 rounded-xl text-[17px] font-semibold active:opacity-80"
              >
                {locale === 'ar' ? 'إبقاء الطلب' : locale === 'ru' ? 'Оставить заказ' : 'Keep Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS-style WhatsApp Help Sheet */}
      {showWhatsAppHelp && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <div 
            className="bg-white w-full max-w-lg rounded-t-2xl animate-[slideUp_0.3s_ease-out]"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 32px)' }}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-9 h-1 bg-[#D1D1D6] rounded-full" />
            </div>

            <div className="flex flex-col items-center px-6 pt-2 pb-6">
              {/* WhatsApp Icon */}
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>

              <h3 className="text-[20px] font-semibold text-black mb-2">
                {locale === 'ar' ? 'دعم واتساب' : locale === 'ru' ? 'Поддержка WhatsApp' : 'WhatsApp Support'}
              </h3>

              <p className="text-[15px] text-[#8E8E93] text-center mb-2">
                {locale === 'ar' 
                  ? 'اضغط مطولاً للتواصل مع الدعم'
                  : locale === 'ru'
                    ? 'Удерживайте для связи с поддержкой'
                    : 'Long press to chat with support'}
              </p>

              <p className="text-[15px] text-[#8E8E93] mb-6">
                {locale === 'ar' ? 'رقم الطلب:' : locale === 'ru' ? 'Заказ:' : 'Order:'}{' '}
                <span className="font-semibold text-black">{showWhatsAppHelp}</span>
              </p>
            </div>
            
            <div className="px-4 space-y-2 pb-2">
              <button
                onClick={() => {
                  const message = locale === 'ar' 
                    ? `مرحباً، لدي استفسار حول الطلب رقم ${showWhatsAppHelp}`
                    : locale === 'ru'
                      ? `Здравствуйте, у меня вопрос по заказу ${showWhatsAppHelp}`
                      : `Hi, I have a question about order ${showWhatsAppHelp}`
                  window.open(`https://wa.me/971585487665?text=${encodeURIComponent(message)}`, '_blank')
                  setShowWhatsAppHelp(null)
                }}
                className="w-full bg-green-500 text-white py-4 rounded-xl text-[17px] font-semibold active:opacity-80"
              >
                {locale === 'ar' ? 'افتح واتساب' : locale === 'ru' ? 'Открыть WhatsApp' : 'Open WhatsApp'}
              </button>
              <button
                onClick={() => setShowWhatsAppHelp(null)}
                className="w-full bg-[#F2F2F7] text-black py-4 rounded-xl text-[17px] font-semibold active:opacity-80"
              >
                {locale === 'ar' ? 'إلغاء' : locale === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation for slide up */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
