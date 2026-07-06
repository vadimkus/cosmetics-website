import type { Metadata } from 'next'
import TermsClient from '../../terms/TermsClient'

export const metadata: Metadata = {
  title: 'الشروط والأحكام - GENOSYS Middle East FZ-LLC',
  description: 'اقرأ الشروط والأحكام التي تحكم استخدامك لخدمات ومنتجات وموقع GENOSYS في الإمارات.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'الشروط والأحكام - GENOSYS Middle East FZ-LLC',
    type: 'website',
    url: 'https://genosys.ae/ar/terms',
    siteName: 'GENOSYS',
    locale: 'ar_AE',
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/terms',
    languages: {
      'en': 'https://genosys.ae/terms',
      'ar': 'https://genosys.ae/ar/terms',
      'ru': 'https://genosys.ae/ru/terms',
    },
  },
}

export default function ArabicTermsPage() {
  return <TermsClient />
}
