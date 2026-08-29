'use client'

import { useEffect } from 'react'
import { RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BundleBuilderError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[BundleBuilder] Page error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12 bg-white">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-[var(--cera-ink)] mb-2 text-center">
        Something went wrong
      </h2>
      <p className="text-[var(--cera-muted)] text-sm text-center mb-8 max-w-sm">
        We couldn&apos;t load the Bundle Builder. This is usually temporary - please try again.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--cera-cta)] text-white rounded-xl font-medium text-sm hover:bg-[var(--cera-rose-ink)] active:scale-[0.98] transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>

        <Link
          href="/products?categories=beauty-boxes"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-[var(--cera-line)] text-[var(--cera-body)] rounded-xl font-medium text-sm hover:bg-[var(--cera-cream-deep)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Link>
      </div>
    </div>
  )
}
