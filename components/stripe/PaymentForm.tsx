'use client'

import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Lock, CreditCard, AlertCircle } from 'lucide-react'

interface PaymentFormProps {
  total: number
  orderId: string
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
  locale?: string
}

export default function PaymentForm({
  total,
  orderId,
  onSuccess,
  onError,
  locale = 'en'
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isArabic = locale === 'ar'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${baseUrl}/checkout/success?payment_intent={PAYMENT_INTENT_ID}&order_id=${orderId}`,
        },
        redirect: 'if_required',
      })

      if (error) {
        // Handle specific error types
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message || (isArabic ? 'فشل الدفع' : 'Payment failed'))
        } else {
          setErrorMessage(isArabic ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred')
        }
        onError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded without redirect
        onSuccess(paymentIntent.id)
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // 3D Secure or other authentication required - Stripe handles redirect
        // This branch may not be reached if redirect happens automatically
        setErrorMessage(isArabic ? 'يتطلب الدفع مصادقة إضافية' : 'Payment requires additional authentication')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed'
      setErrorMessage(message)
      onError(message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{isArabic ? 'رقم الطلب' : 'Order'}</span>
          <span className="font-mono">{orderId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-medium">
            {isArabic ? 'المبلغ الإجمالي' : 'Total Amount'}
          </span>
          <span className="text-xl font-bold text-gray-900">
            AED {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Element */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard className="w-4 h-4" />
          <span>{isArabic ? 'معلومات البطاقة' : 'Card Information'}</span>
        </div>
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-white
          flex items-center justify-center gap-2
          transition-all duration-200
          ${isProcessing || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
          }
        `}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            <span>{isArabic ? 'جاري المعالجة...' : 'Processing...'}</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>
              {isArabic ? `ادفع AED ${total.toFixed(2)}` : `Pay AED ${total.toFixed(2)}`}
            </span>
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock className="w-3 h-3" />
        <span>
          {isArabic 
            ? 'مدفوعات آمنة بواسطة Stripe'
            : 'Secure payments powered by Stripe'
          }
        </span>
      </div>
    </form>
  )
}
