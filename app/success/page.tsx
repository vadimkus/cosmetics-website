'use client'

import { useSearchParams } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('order_id')

  useEffect(() => {
    // Clear the cart after successful payment
    if (sessionId || orderId) {
      clearCart()
    }
  }, [sessionId, orderId, clearCart])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Order submission - Success!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your order has been confirmed.
            {orderId && (
              <span className="block mt-2 text-lg font-semibold text-blue-600">
                Order ID: {orderId}
              </span>
            )}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
              <span className="text-gray-700">You'll receive an email confirmation with your order details</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
              <span className="text-gray-700">We'll process and ship your order ASAP</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
              <span className="text-gray-700">You'll receive tracking information once your order ships</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Continue Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link 
            href="/contact"
            className="inline-flex items-center border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>

        {sessionId && (
          <div className="mt-8 text-sm text-gray-500">
            <p>Order ID: {sessionId}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
