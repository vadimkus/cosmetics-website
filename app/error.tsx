'use client'
import { errorLog } from '@/lib/logger'

import * as Sentry from '@sentry/nextjs'
import ErrorPage from '@/components/ErrorPage'
import { useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { isIgnorableBrowserNavigationError } from '@/lib/browserErrorNoise'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    if (isIgnorableBrowserNavigationError(error)) return

    errorLog('Application error:', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <ErrorPage
      title={t('common.somethingWentWrong')}
      message={t('common.errorMessage')}
      // Only expose the raw error string in development. In production a
      // client-side throw could otherwise render an internal message to users.
      {...(process.env.NODE_ENV !== 'production' ? { error: error.message } : {})}
      type="server"
      onRetry={reset}
      showBack={false}
      showHome={true}
    />
  )
}
