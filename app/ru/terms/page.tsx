import type { Metadata } from 'next'
import TermsClient from '../../terms/TermsClient'

export const metadata: Metadata = {
  title: 'Условия использования - GENOSYS Middle East FZ-LLC',
  description: 'Ознакомьтесь с условиями использования услуг, продуктов и сайта GENOSYS в ОАЭ.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Условия использования - GENOSYS Middle East FZ-LLC',
    type: 'website',
    url: 'https://genosys.ae/ru/terms',
    siteName: 'GENOSYS',
    locale: 'ru_RU',
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/terms',
    languages: {
      'en': 'https://genosys.ae/terms',
      'ar': 'https://genosys.ae/ar/terms',
      'ru': 'https://genosys.ae/ru/terms',
      'x-default': 'https://genosys.ae/terms',
    },
  },
}

export default function RussianTermsPage() {
  return <TermsClient />
}
