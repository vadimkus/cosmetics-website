import { Suspense } from 'react'
import PaymentSuccessClient from './PaymentSuccessClient'
import { PaymentErrorBoundary } from '@/components/error-boundaries'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export default function PaymentSuccessPage() {
  return (
    <PaymentErrorBoundary>
      <Suspense fallback={
        <div className="cera-page genosys-page flex min-h-screen items-center justify-center p-4">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[var(--cera-line)] border-t-[var(--cera-rose)]"></div>
            <p className="mt-4 text-sm text-[var(--cera-muted)]">Loading payment details...</p>
          </div>
        </div>
      }>
        <PaymentSuccessClient />
      </Suspense>
    </PaymentErrorBoundary>
  )
}
