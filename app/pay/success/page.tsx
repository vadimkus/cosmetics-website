import { Suspense } from 'react'
import PaymentSuccessClient from './PaymentSuccessClient'
import { PaymentErrorBoundary } from '@/components/error-boundaries'

export default function PaymentSuccessPage() {
  return (
    <PaymentErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading payment details...</p>
          </div>
        </div>
      }>
        <PaymentSuccessClient />
      </Suspense>
    </PaymentErrorBoundary>
  )
}
