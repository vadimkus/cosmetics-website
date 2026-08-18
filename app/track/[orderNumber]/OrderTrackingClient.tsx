'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft, RefreshCw, CreditCard, MapPin } from 'lucide-react'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'
import { translateSize } from '@/utils/sizeTranslations'

interface TrackingData {
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
  paidAt: string | null
  emirate: string
  customerFirstName: string
  itemCount: number
  total: number
  shipping: number
  timeline: Array<{
    status: string
    label: string
    timestamp: string | null
    completed: boolean
    current: boolean
  }>
  estimatedDelivery: { 
    min: string
    max: string
    type: 'hours' | 'days'
    minHours?: number
    maxHours?: number
    minDays?: number
    maxDays?: number
  } | null
  items: Array<{
    name: string
    quantity: number
    image: string
    color?: string
    size?: string
  }>
}

interface OrderTrackingClientProps {
  orderNumber: string
}

export default function OrderTrackingClient({ orderNumber }: OrderTrackingClientProps) {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isPWA, isClient } = usePWAMode()
  const { t, locale, dir } = useTranslation()
  const router = useRouter()
  const isRTL = dir === 'rtl'
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  useEffect(() => {
    if (isClient) {
      setIsMobileWeb(window.innerWidth < 768 && !isPWA)
    }
  }, [isClient, isPWA])
  
  const isAppLikeMode = (isClient && isPWA) || isMobileWeb
  
  const handleBack = () => {
    router.push(getLocalizedPath('/profile?tab=orders', locale))
  }
  
  const handleProfileClick = () => {
    router.push(getLocalizedPath('/profile', locale))
  }

  const fetchTrackingData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/orders/track/${orderNumber}`)
      const data = await response.json()
      
      if (!data.success) {
        setError(data.error || 'Failed to load tracking information')
        setTrackingData(null)
      } else {
        setTrackingData(data.data)
      }
    } catch {
      setError('Failed to connect. Please try again.')
      setTrackingData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrackingData()
  }, [orderNumber])

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const dateLocale = locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE'
    return date.toLocaleDateString(dateLocale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status icon and color
  // Translate timeline step labels from API (which returns English)
  const translateTimelineLabel = (label: string): string => {
    const labelMap: Record<string, string> = {
      'Order Placed': t('orders.statusOrderPlaced') || 'Order Placed',
      'Payment Confirmed': t('orders.statusPaymentConfirmed') || 'Payment Confirmed',
      'Order Confirmed': t('orders.statusConfirmed') || 'Order Confirmed',
      'Processing': t('orders.statusProcessing') || 'Processing',
      'Shipped': t('orders.statusShipped') || 'Shipped',
      'Out for Delivery': t('orders.statusOutForDelivery') || 'Out for Delivery',
      'Delivered': t('orders.statusDelivered') || 'Delivered',
      'Order Cancelled': t('orders.statusOrderCancelled') || 'Order Cancelled',
    }
    return labelMap[label] || label
  }

  const getStatusDisplay = (status: string): { icon: React.ReactNode; color: string; bgColor: string; label: string } => {
    const statusMap: Record<string, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
      'PENDING': { 
        icon: <Clock className="w-5 h-5" />, 
        color: 'text-[var(--cera-rose-ink)]',
        bgColor: 'bg-[var(--cera-blush)]',
        label: t('orders.statusPending') || 'Order Pending'
      },
      'CONFIRMED': { 
        icon: <CheckCircle className="w-5 h-5" />, 
        color: 'text-[var(--cera-rose-ink)]',
        bgColor: 'bg-[var(--cera-blush)]',
        label: t('orders.statusConfirmed') || 'Order Confirmed'
      },
      'PROCESSING': { 
        icon: <Package className="w-5 h-5" />, 
        color: 'text-[var(--cera-rose-ink)]',
        bgColor: 'bg-[var(--cera-blush)]',
        label: t('orders.statusProcessing') || 'Processing'
      },
      'SHIPPED': { 
        icon: <Truck className="w-5 h-5" />, 
        color: 'text-[var(--cera-rose-ink)]',
        bgColor: 'bg-[var(--cera-blush)]',
        label: t('orders.statusShipped') || 'Shipped'
      },
      'OUT_FOR_DELIVERY': { 
        icon: <Truck className="w-5 h-5" />, 
        color: 'text-[var(--cera-rose-ink)]',
        bgColor: 'bg-[var(--cera-blush)]',
        label: t('orders.statusOutForDelivery') || 'Out for Delivery'
      },
      'DELIVERED': { 
        icon: <CheckCircle className="w-5 h-5" />, 
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        label: t('orders.statusDelivered') || 'Delivered'
      },
      'CANCELLED': { 
        icon: <XCircle className="w-5 h-5" />, 
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        label: t('orders.statusCancelled') || 'Cancelled'
      }
    }
    return statusMap[status] ?? {
      icon: <Clock className="w-5 h-5" />,
      color: 'text-[var(--cera-rose-ink)]',
      bgColor: 'bg-[var(--cera-blush)]',
      label: t('orders.statusUnknown') || 'Unknown Status'
    }
  }

  if (loading) {
    return (
      <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh] ${isMobileWeb ? 'pb-32' : ''}`} dir={dir}>
        {/* Mobile Header for Loading State */}
        {isMobileWeb && (
          <div className={`sticky top-0 z-40 flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)] px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => router.push(getLocalizedPath('/profile?tab=orders', locale))}
              className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-base text-[var(--cera-rose-ink)]">
                {t('orders.title')}
              </span>
            </button>
            <span className="text-base font-semibold text-[var(--cera-ink)]">
              {t('orders.trackOrder')}
            </span>
            <button
              onClick={handleProfileClick}
              className="min-w-[80px] flex justify-end"
            >
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cera-muted)]">
                  <span className="text-sm font-semibold text-white">G</span>
                </div>
              </div>
            </button>
          </div>
        )}
        
        <div className={`flex items-center justify-center p-4 ${isMobileWeb ? 'min-h-[calc(100dvh-180px)]' : 'min-h-[100dvh]'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[var(--cera-line)] border-t-[var(--cera-rose)] mx-auto mb-4"></div>
            <p className="text-[var(--cera-muted)]">{t('common.loading') || 'Loading tracking information...'}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh] ${isMobileWeb ? 'pb-32' : ''}`} dir={dir}>
        {/* Mobile Header for Error State */}
        {isMobileWeb && (
          <div className={`sticky top-0 z-40 flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)] px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => router.push(getLocalizedPath('/profile?tab=orders', locale))}
              className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-base text-[var(--cera-rose-ink)]">
                {t('orders.title')}
              </span>
            </button>
            <span className="text-base font-semibold text-[var(--cera-ink)]">
              {t('orders.trackOrder')}
            </span>
            <button
              onClick={handleProfileClick}
              className="min-w-[80px] flex justify-end"
            >
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cera-muted)]">
                  <span className="text-sm font-semibold text-white">G</span>
                </div>
              </div>
            </button>
          </div>
        )}
        
        <div className={`flex items-center justify-center p-4 ${isMobileWeb ? 'min-h-[calc(100dvh-180px)]' : 'min-h-[100dvh]'}`}>
          <div className="w-full max-w-md rounded-[28px] border border-[var(--cera-line)] bg-white p-8 text-center shadow-[0_24px_60px_-40px_rgba(23,20,15,0.45)]">
            {/* Red stays: the order could not be found. */}
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600">
              <XCircle className="h-7 w-7" aria-hidden="true" />
            </span>
            <h1 className="cera-serif mt-6 text-[24px] leading-tight text-[var(--cera-ink)]">{t('orders.orderNotFound') || 'Order Not Found'}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--cera-body)]">{error}</p>
            <div className="mt-7 space-y-3">
              <button
                onClick={fetchTrackingData}
                className={`ed-cta w-full py-3.5 text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <RefreshCw className="h-4 w-4" />
                {t('common.tryAgain') || 'Try Again'}
              </button>
              <Link
                href={getLocalizedPath('/', locale)}
                className={`ed-ghost w-full py-3.5 text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                {t('common.backHome') || 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!trackingData) {
    return (
      <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh] flex items-center justify-center`} dir={dir}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[var(--cera-line)] border-t-[var(--cera-rose)] mx-auto mb-4"></div>
          <p className="text-[var(--cera-muted)]">{t('common.loading') || 'Loading tracking information...'}</p>
        </div>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay(trackingData.status)

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh] ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      {/* Mobile Header */}
      {isAppLikeMode && (
        <div className={`sticky top-0 z-40 flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)] px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={handleBack}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-base text-[var(--cera-rose-ink)]">
              {t('orders.title')}
            </span>
          </button>
          <span className="text-base font-semibold text-[var(--cera-ink)]">
            {t('orders.trackOrder')}
          </span>
          <button
            onClick={handleProfileClick}
            className="min-w-[80px] flex justify-end"
          >
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cera-ink)]">
                <span className="text-sm font-semibold text-white">
                  {trackingData?.customerFirstName?.charAt(0) || 'G'}
                </span>
              </div>
              {/* Green online dot - only when tracking data exists (implies logged in order) */}
              {trackingData && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-[var(--cera-cream)]" />
              )}
            </div>
          </button>
        </div>
      )}
      
      <div className={`max-w-3xl mx-auto ${isAppLikeMode ? 'px-4 py-4' : 'py-8 px-4'}`}>
        {/* Desktop Header - hide on mobile */}
        {!isAppLikeMode && (
          <div className="mb-6">
            <Link 
              href={getLocalizedPath('/profile?tab=orders', locale)}
              className={`mb-4 inline-flex items-center text-sm font-semibold text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose)] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {t('orders.backToOrders') || 'Back to Orders'}
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="cera-serif text-[30px] leading-tight text-[var(--cera-ink)]">{t('orders.orderTracking') || 'Order Tracking'}</h1>
              <button
                onClick={fetchTrackingData}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--cera-muted)] transition-colors hover:bg-[var(--cera-cream-deep)] hover:text-[var(--cera-ink)]"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Status Card */}
        <div className={`mb-6 rounded-[24px] border border-[var(--cera-line)] p-6 ${statusDisplay.bgColor}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`rounded-full bg-white p-3 ${statusDisplay.color}`}>
              {statusDisplay.icon}
            </div>
            <div className="flex-1">
              <p className={`cera-serif text-[21px] leading-tight ${statusDisplay.color}`}>
                {statusDisplay.label}
              </p>
              <p className="mt-0.5 text-sm text-[var(--cera-muted)]" dir="ltr">
                {t('orders.orderNumber') || 'Order'} #{trackingData.orderNumber}
              </p>
            </div>
            <div className={isRTL ? 'text-left' : 'text-right'}>
              <p className="cera-eyebrow">{t('orders.total') || 'Total'}</p>
              <p dir="ltr" className="cera-serif cera-numeral mt-1 text-[21px] leading-none text-[var(--cera-ink)]">
                {trackingData.total.toFixed(2)} AED
              </p>
            </div>
          </div>
          
          {/* Estimated Delivery */}
          {trackingData.estimatedDelivery && (
            <div className="mt-4 border-t border-[var(--cera-line)] pt-4">
              <div className={`flex flex-wrap items-center gap-2 text-[var(--cera-body)] ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{(t('orders.estimatedDeliveryTo') || 'Estimated Delivery to {emirate}').replace('{emirate}', trackingData.emirate)}:</span>
                <span>
                  {trackingData.estimatedDelivery.type === 'hours' ? (
                    <>
                      {trackingData.estimatedDelivery.minHours === trackingData.estimatedDelivery.maxHours ? (
                        <span className="font-semibold text-green-700">
                          {trackingData.estimatedDelivery.minHours === 0.5 ? `30 ${t('orders.minutes') || 'minutes'}` : `${trackingData.estimatedDelivery.minHours} ${trackingData.estimatedDelivery.minHours !== 1 ? (t('orders.hours') || 'hours') : (t('orders.hour') || 'hour')}`}
                        </span>
                      ) : (
                        <span className="font-semibold text-green-700">
                          {trackingData.estimatedDelivery.minHours === 0.5 ? '30 min' : `${trackingData.estimatedDelivery.minHours}`}-{trackingData.estimatedDelivery.maxHours} {t('orders.hours') || 'hours'}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {(() => {
                        const dateLocale = locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE'
                        return new Date(trackingData.estimatedDelivery.min).toLocaleDateString(dateLocale, { weekday: 'short', month: 'short', day: 'numeric' })
                      })()}
                      {trackingData.estimatedDelivery.min !== trackingData.estimatedDelivery.max && (
                        <> - {(() => {
                          const dateLocale = locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE'
                          return new Date(trackingData.estimatedDelivery.max).toLocaleDateString(dateLocale, { weekday: 'short', month: 'short', day: 'numeric' })
                        })()}</>
                      )}
                    </>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="mb-6 rounded-[24px] border border-[var(--cera-line)] bg-white p-6 shadow-[0_18px_50px_-38px_rgba(23,20,15,0.4)]">
          <h2 className="cera-serif mb-4 text-[19px] leading-tight text-[var(--cera-ink)]">{t('orders.orderTimeline') || 'Order Timeline'}</h2>
          <div className="space-y-4">
            {trackingData.timeline.map((step, index) => {
              const isLast = index === trackingData.timeline.length - 1
              return (
                <div key={step.status} className="flex gap-4">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      step.completed 
                        ? 'border-[var(--cera-ink)] bg-[var(--cera-ink)]' 
                        : step.current 
                          ? 'animate-pulse border-[var(--cera-rose)] bg-[var(--cera-rose)]' 
                          : 'border-[var(--cera-blush-deep)] bg-white'
                    }`}>
                      {step.completed && (
                        <CheckCircle className="w-3 h-3 text-white -mt-0.5 -ml-0.5" />
                      )}
                    </div>
                    {!isLast && (
                      <div className={`h-8 w-0.5 ${
                        step.completed ? 'bg-[var(--cera-ink)]' : 'bg-[var(--cera-line)]'
                      }`} />
                    )}
                  </div>
                  
                  {/* Step content */}
                  <div className="flex-1 pb-4">
                    <p className={`font-medium ${
                      step.current ? 'text-[var(--cera-rose-ink)]' : step.completed ? 'text-[var(--cera-ink)]' : 'text-[var(--cera-muted)]'
                    }`}>
                      {translateTimelineLabel(step.label)}
                    </p>
                    {step.timestamp && (
                      <p className="text-sm text-[var(--cera-muted)]">
                        {formatDate(step.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-6 rounded-[24px] border border-[var(--cera-line)] bg-white p-6 shadow-[0_18px_50px_-38px_rgba(23,20,15,0.4)]">
          <h2 className={`cera-serif mb-4 flex items-center gap-2 text-[19px] leading-tight text-[var(--cera-ink)] ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CreditCard className="w-5 h-5" />
            {t('orders.paymentInformation') || 'Payment Information'}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="cera-eyebrow">{t('orders.paymentMethod') || 'Payment Method'}</p>
              <p className="mt-1 font-medium capitalize text-[var(--cera-ink)]">
                {trackingData.paymentMethod === 'cod' ? (t('orders.cashOnDelivery') || 'Cash on Delivery') : trackingData.paymentMethod}
              </p>
            </div>
            <div>
              <p className="cera-eyebrow">{t('orders.paymentStatus') || 'Payment Status'}</p>
              <p className={`mt-1 font-medium capitalize ${
                trackingData.paymentStatus === 'paid' ? 'text-green-700' :
                trackingData.paymentStatus === 'pending' ? 'text-amber-700' :
                'text-[var(--cera-ink)]'
              }`}>
                {trackingData.paymentStatus}
              </p>
            </div>
            {trackingData.paidAt && (
              <div className="col-span-2">
                <p className="cera-eyebrow">{t('orders.paidAt') || 'Paid At'}</p>
                <p className="mt-1 font-medium text-[var(--cera-ink)]">{formatDate(trackingData.paidAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-[24px] border border-[var(--cera-line)] bg-white p-6 shadow-[0_18px_50px_-38px_rgba(23,20,15,0.4)]">
          <h2 className="cera-serif mb-4 text-[19px] leading-tight text-[var(--cera-ink)]">
            {t('orders.orderItems') || 'Order Items'} ({trackingData.itemCount} {t('orders.items') || 'items'})
          </h2>
          <div className="divide-y divide-[var(--cera-line)]">
            {trackingData.items.map((item, index) => (
              <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)]">
                  <Image
                    src={item.image || '/images/genosys-logo-transparent.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-[var(--cera-ink)]">{item.name}</p>
                  <div className={`flex items-center gap-3 mt-1 text-sm text-[var(--cera-muted)] ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{t('orders.qty') || 'Qty'}: {item.quantity}</span>
                    {item.size && <span>{t('orders.size') || 'Size'}: {translateSize(item.size, locale)}</span>}
                    {item.color && <span>{t('orders.color') || 'Color'}: {item.color}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support via WhatsApp */}
        <div className="mt-6 text-center">
          <p className="mb-2 text-sm text-[var(--cera-body)]">
            {t('orders.needHelp') || 'Need help with your order?'}
          </p>
          <a 
            href={`https://wa.me/971585487665?text=${encodeURIComponent(
              locale === 'ru' ? `Здравствуйте, мне нужна помощь с заказом #${orderNumber}` :
              locale === 'ar' ? `مرحباً، أحتاج مساعدة في طلبي #${orderNumber}` :
              `Hi, I need help with my order #${orderNumber}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-green-600 hover:text-green-700 hover:underline inline-flex items-center gap-1 text-sm font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('orders.contactSupport') || 'Contact Support'}
          </a>
        </div>
      </div>
    </div>
  )
}
