'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft, RefreshCw, CreditCard, MapPin } from 'lucide-react'

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
  estimatedDelivery: { min: string; max: string } | null
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchTrackingData}
              className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!trackingData) return null

  const statusDisplay = getStatusDisplay(trackingData.status)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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
                  {new Date(trackingData.estimatedDelivery.min).toLocaleDateString('en-AE', { weekday: 'short', month: 'short', day: 'numeric' })}
                  {trackingData.estimatedDelivery.min !== trackingData.estimatedDelivery.max && (
                    <> - {new Date(trackingData.estimatedDelivery.max).toLocaleDateString('en-AE', { weekday: 'short', month: 'short', day: 'numeric' })}</>
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
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Need help with your order?{' '}
            <Link href="/contact" className="text-primary-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
