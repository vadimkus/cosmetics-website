import type { Metadata } from 'next'
import PrivacyPolicyClient from './PrivacyPolicyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy - GENOSYS Middle East FZ-LLC | Data Protection & Your Rights',
  description: 'Read our comprehensive privacy policy. Learn how GENOSYS Middle East FZ-LLC protects your personal data, processes information, and respects your privacy rights in the UAE.',
  keywords: [
    'privacy policy',
    'data protection',
    'personal information',
    'GDPR',
    'privacy rights',
    'data security',
    'GENOSYS privacy'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy - GENOSYS Middle East FZ-LLC',
    description: 'Learn how GENOSYS Middle East FZ-LLC protects your personal data and respects your privacy rights.',
    type: 'website',
    url: 'https://genosys.ae/privacy-policy',
    siteName: 'GENOSYS Middle East FZ-LLC',
  },
  alternates: {
    canonical: 'https://genosys.ae/privacy-policy',
    languages: {
      'en': 'https://genosys.ae/privacy-policy',
      'ar': 'https://genosys.ae/ar/privacy-policy',
      'ru': 'https://genosys.ae/ru/privacy-policy',
    },
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />
}





