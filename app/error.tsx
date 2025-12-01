'use client'
import { errorLog } from '@/lib/logger'

import ErrorPage from '@/components/ErrorPage'
import { useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()
  
  useEffect(() => {
    // Log the error to an error reporting service
    errorLog('Application error:', error)
  }, [error])

  return (
    <ErrorPage
      title={t('common.somethingWentWrong')}
      message={t('common.errorMessage')}
      error={error.message}
      type="server"
      onRetry={reset}
      showBack={false}
      showHome={true}
    />
  )
}
