import type { Metadata } from 'next'
import ProfilePageRefactored from '../../profile/page'

export const metadata: Metadata = {
  title: 'الملف الشخصي | GENOSYS',
  description: 'إدارة ملفك الشخصي، عرض سجل الطلبات، وتحديث معلوماتك الشخصية',
  keywords: ['الملف الشخصي', 'GENOSYS', 'سجل الطلبات', 'الإعدادات', 'الخصوصية'],
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: 'الملف الشخصي | GENOSYS',
    description: 'إدارة ملفك الشخصي، عرض سجل الطلبات، وتحديث معلوماتك الشخصية',
    locale: 'ar_AE',
    type: 'website',
    url: 'https://genosys.ae/ar/profile',
    siteName: 'GENOSYS Middle East FZ-LLC',
  },
  twitter: {
    card: 'summary',
    title: 'الملف الشخصي | GENOSYS',
    description: 'إدارة ملفك الشخصي، عرض سجل الطلبات، وتحديث معلوماتك الشخصية',
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/profile',
    languages: {
      'en': 'https://genosys.ae/profile',
      'ar': 'https://genosys.ae/ar/profile',
    },
  },
}

export default function ArabicProfilePage() {
  return <ProfilePageRefactored />
}

