'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, RefreshCw, Home, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Check initial online status
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    window.location.reload()
  }

  if (isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Wifi className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Back Online!</h1>
          <p className="text-gray-600 mb-4">You're connected to the internet again.</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-8">
          <WifiOff className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            You're Offline
          </h1>
          <p className="text-gray-600 mb-6">
            It looks like you're not connected to the internet. Don't worry, 
            you can still browse some of our content that's been cached.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-2">Available Offline</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Browse cached product pages</li>
              <li>• View product images</li>
              <li>• Read about our brand</li>
              <li>• Contact information</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Limited Functionality</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Cannot place new orders</li>
              <li>• Cannot login/register</li>
              <li>• Cannot sync cart/favorites</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            disabled={retryCount >= 3}
            className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${retryCount >= 3 ? 'animate-spin' : ''}`} />
            {retryCount >= 3 ? 'Retrying...' : 'Try Again'}
          </button>

          <Link 
            href="/products"
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Browse Cached Products
          </Link>

          <Link 
            href="/"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Homepage
          </Link>
        </div>

        {retryCount > 0 && (
          <p className="text-xs text-gray-500 mt-4">
            Retry attempts: {retryCount}/3
          </p>
        )}

        <div className="mt-8 text-xs text-gray-500">
          <p>Genosys Middle East FZ-LLC</p>
          <p>Premium Beauty Products</p>
        </div>
      </div>
    </div>
  )
}
