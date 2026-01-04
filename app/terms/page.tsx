import type { Metadata } from 'next'
import TermsClient from './TermsClient'

export const metadata: Metadata = {
  title: 'Terms & Conditions - GENOSYS Middle East FZ-LLC | Service Terms',
  description: 'Read our terms and conditions. Learn about the rules and regulations governing your use of GENOSYS services, products, and website in the UAE.',
  keywords: [
    'terms and conditions',
    'service terms',
    'user agreement',
    'terms of service',
    'GENOSYS terms'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms & Conditions - GENOSYS Middle East FZ-LLC',
    description: 'Learn about the terms and conditions governing your use of GENOSYS services and products.',
    type: 'website',
    url: 'https://genosys.ae/terms',
    siteName: 'GENOSYS Middle East FZ-LLC',
  },
  alternates: {
    canonical: 'https://genosys.ae/terms',
    languages: {
      'en': 'https://genosys.ae/terms',
      'ar': 'https://genosys.ae/ar/terms',
      'ru': 'https://genosys.ae/ru/terms',
    },
  },
}

export default function TermsPage() {
  return <TermsClient />
}


