import ErrorPage from '@/components/ErrorPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة - 404 | GENOSYS Middle East FZ-LLC',
  description: 'الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها، أو قمت بإدخال عنوان URL خاطئ.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'الصفحة غير موجودة - 404 | GENOSYS Middle East FZ-LLC',
    description: 'الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها، أو قمت بإدخال عنوان URL خاطئ.',
    type: 'website',
    url: 'https://genosys.ae/ar/not-found',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'الصفحة غير موجودة - 404',
    description: 'الصفحة التي تبحث عنها غير موجودة.',
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/not-found',
    languages: {
      'en': 'https://genosys.ae/not-found',
      'ar': 'https://genosys.ae/ar/not-found',
    },
  },
}

export default function ArabicNotFound() {
  return (
    <ErrorPage
      type="not-found"
      showRetry={false}
      showBack={false}
      showHome={true}
    />
  )
}
