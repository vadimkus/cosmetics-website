'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft, RefreshCw, CreditCard, MapPin } from 'lucide-react'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
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
    return date.toLocaleDateString('en-AE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status icon and color
  const getStatusDisplay = (status: string): { icon: React.ReactNode; color: string; bgColor: string; label: string } => {
    const statusMap: Record<string, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
      'PENDING': { 
        icon: <Clock className="w-5 h-5" />, 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-50',
        label: 'Order Pending' 
      },
      'CONFIRMED': { 
        icon: <CheckCircle className="w-5 h-5" />, 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50',
        label: 'Order Confirmed' 
      },
      'PROCESSING': { 
        icon: <Package className="w-5 h-5" />, 
        color: 'text-indigo-600', 
        bgColor: 'bg-indigo-50',
        label: 'Processing' 
      },
      'SHIPPED': { 
        icon: <Truck className="w-5 h-5" />, 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-50',
        label: 'Shipped' 
      },
      'OUT_FOR_DELIVERY': { 
        icon: <Truck className="w-5 h-5" />, 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-50',
        label: 'Out for Delivery' 
      },
      'DELIVERED': { 
        icon: <CheckCircle className="w-5 h-5" />, 
        color: 'text-green-600', 
        bgColor: 'bg-green-50',
        label: 'Delivered' 
      },
      'CANCELLED': { 
        icon: <XCircle className="w-5 h-5" />, 
        color: 'text-red-600', 
        bgColor: 'bg-red-50',
        label: 'Cancelled' 
      }
    }
    return statusMap[status] ?? {
      icon: <Clock className="w-5 h-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      label: 'Unknown Status'
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isMobileWeb ? 'pb-32' : ''}`} dir={dir}>
        {/* Mobile Header for Loading State */}
        {isMobileWeb && (
          <div className={`sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => router.push(getLocalizedPath('/profile?tab=orders', locale))}
              className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-base text-red-600">
                {t('orders.title')}
              </span>
            </button>
            <span className="text-base font-semibold text-gray-900">
              {t('orders.trackOrder')}
            </span>
            <button
              onClick={handleProfileClick}
              className="min-w-[80px] flex justify-end"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">G</span>
                </div>
              </div>
            </button>
          </div>
        )}
        
        <div className={`flex items-center justify-center p-4 ${isMobileWeb ? 'min-h-[calc(100vh-180px)]' : 'min-h-screen'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading') || 'Loading tracking information...'}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-50 ${isMobileWeb ? 'pb-32' : ''}`} dir={dir}>
        {/* Mobile Header for Error State */}
        {isMobileWeb && (
          <div className={`sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => router.push(getLocalizedPath('/profile?tab=orders', locale))}
              className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-base text-red-600">
                {t('orders.title')}
              </span>
            </button>
            <span className="text-base font-semibold text-gray-900">
              {t('orders.trackOrder')}
            </span>
            <button
              onClick={handleProfileClick}
              className="min-w-[80px] flex justify-end"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">G</span>
                </div>
              </div>
            </button>
          </div>
        )}
        
        <div className={`flex items-center justify-center p-4 ${isMobileWeb ? 'min-h-[calc(100vh-180px)]' : 'min-h-screen'}`}>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">{t('orders.orderNotFound') || 'Order Not Found'}</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={fetchTrackingData}
                className={`w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <RefreshCw className="w-4 h-4" />
                {t('common.tryAgain') || 'Try Again'}
              </button>
              <Link
                href={getLocalizedPath('/', locale)}
                className={`w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                {t('common.backHome') || 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!trackingData) return null

  const statusDisplay = getStatusDisplay(trackingData.status)

  return (
    <div className={`min-h-screen bg-gray-50 ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      {/* Mobile Header */}
      {isAppLikeMode && (
        <div className={`sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={handleBack}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-base text-red-600">
              {t('orders.title')}
            </span>
          </button>
          <span className="text-base font-semibold text-gray-900">
            {t('orders.trackOrder')}
          </span>
          <button
            onClick={handleProfileClick}
            className="min-w-[80px] flex justify-end"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {trackingData?.customerFirstName?.charAt(0) || 'G'}
                </span>
              </div>
              {/* Green online dot - only when tracking data exists (implies logged in order) */}
              {trackingData && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
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
              href="/profile?tab=orders"
              className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
              <button
                onClick={fetchTrackingData}
                className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Status Card */}
        <div className={`rounded-xl p-6 mb-6 ${statusDisplay.bgColor}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-white ${statusDisplay.color}`}>
              {statusDisplay.icon}
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-lg ${statusDisplay.color}`}>
                {statusDisplay.label}
              </p>
              <p className="text-gray-600 text-sm">
                Order #{trackingData.orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-lg text-gray-900">
                {trackingData.total.toFixed(2)} AED
              </p>
            </div>
          </div>
          
          {/* Estimated Delivery */}
          {trackingData.estimatedDelivery && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Estimated Delivery to {trackingData.emirate}:</span>
                <span>
                  {trackingData.estimatedDelivery.type === 'hours' ? (
                    // Dubai: Show hours-based delivery (e.g., "1-2 hours")
                    <>
                      {trackingData.estimatedDelivery.minHours === trackingData.estimatedDelivery.maxHours ? (
                        <span className="text-green-600 font-semibold">
                          {trackingData.estimatedDelivery.minHours === 0.5 ? '30 minutes' : `${trackingData.estimatedDelivery.minHours} hour${trackingData.estimatedDelivery.minHours !== 1 ? 's' : ''}`}
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          {trackingData.estimatedDelivery.minHours === 0.5 ? '30 min' : `${trackingData.estimatedDelivery.minHours}`}-{trackingData.estimatedDelivery.maxHours} hours
                        </span>
                      )}
                    </>
                  ) : (
                    // Other emirates: Show date-based delivery
                    <>
                      {new Date(trackingData.estimatedDelivery.min).toLocaleDateString('en-AE', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {trackingData.estimatedDelivery.min !== trackingData.estimatedDelivery.max && (
                        <> - {new Date(trackingData.estimatedDelivery.max).toLocaleDateString('en-AE', { weekday: 'short', month: 'short', day: 'numeric' })}</>
                      )}
                    </>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Order Timeline</h2>
          <div className="space-y-4">
            {trackingData.timeline.map((step, index) => {
              const isLast = index === trackingData.timeline.length - 1
              return (
                <div key={step.status} className="flex gap-4">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      step.completed 
                        ? 'bg-green-500 border-green-500' 
                        : step.current 
                          ? 'bg-primary-600 border-primary-600 animate-pulse' 
                          : 'bg-white border-gray-300'
                    }`}>
                      {step.completed && (
                        <CheckCircle className="w-3 h-3 text-white -mt-0.5 -ml-0.5" />
                      )}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-8 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  
                  {/* Step content */}
                  <div className="flex-1 pb-4">
                    <p className={`font-medium ${
                      step.current ? 'text-primary-600' : step.completed ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    {step.timestamp && (
                      <p className="text-sm text-gray-500">
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
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Information
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900 capitalize">
                {trackingData.paymentMethod === 'cod' ? 'Cash on Delivery' : trackingData.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Payment Status</p>
              <p className={`font-medium capitalize ${
                trackingData.paymentStatus === 'paid' ? 'text-green-600' :
                trackingData.paymentStatus === 'pending' ? 'text-yellow-600' :
                'text-gray-900'
              }`}>
                {trackingData.paymentStatus}
              </p>
            </div>
            {trackingData.paidAt && (
              <div className="col-span-2">
                <p className="text-gray-500">Paid At</p>
                <p className="font-medium text-gray-900">{formatDate(trackingData.paidAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Order Items ({trackingData.itemCount} items)
          </h2>
          <div className="divide-y divide-gray-100">
            {trackingData.items.map((item, index) => (
              <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || '/images/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>Qty: {item.quantity}</span>
                    {item.size && <span>Size: {translateSize(item.size, locale)}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support via WhatsApp */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-2">
            Need help with your order?
          </p>
          <a 
            href={`https://wa.me/971585487665?text=${encodeURIComponent(`Hi, I need help with my order #${orderNumber}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 hover:underline inline-flex items-center gap-1 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
