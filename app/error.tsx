'use client'
import { errorLog } from '@/lib/logger'

import ErrorPage from '@/components/ErrorPage'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    errorLog('Application error:', error)
  }, [error])

  return (
    <ErrorPage
      title="Something went wrong"
      message="We are notified already via alert mail and will fix it shortly."
      error={error.message}
      type="server"
      onRetry={reset}
      showBack={false}
      showHome={true}
    />
  )
}
