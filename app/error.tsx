'use client'

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
    console.error('Application error:', error)
  }, [error])

  return (
    <ErrorPage
      title="Something went wrong"
      message="An unexpected error occurred. Our team has been notified and is working to fix the issue."
      error={error.message}
      type="server"
      onRetry={reset}
      showBack={false}
      showHome={true}
    />
  )
}
