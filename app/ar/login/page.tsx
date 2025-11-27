import LoginClient from '../../login/LoginClient'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تسجيل الدخول - مستحضرات التجميل الكورية المهنية GENOSYS | Genosys Middle East FZ-LLC',
  description: 'الوصول إلى حسابك المهني في GENOSYS. سجل الدخول لعرض الأسعار وإدارة الطلبات والوصول إلى منتجات مستحضرات التجميل الكورية المهنية الحصرية.',
  keywords: 'تسجيل الدخول GENOSYS، تسجيل الدخول لمستحضرات التجميل الكورية، حساب العناية بالبشرة المهنية، تسجيل الدخول لمستحضرات التجميل الإمارات، الوصول إلى حساب GENOSYS',
  openGraph: {
    title: 'تسجيل الدخول - مستحضرات التجميل الكورية المهنية GENOSYS',
    description: 'الوصول إلى حسابك المهني في GENOSYS. سجل الدخول لعرض الأسعار وإدارة الطلبات.',
    type: 'website',
    url: 'https://genosys.ae/ar/login',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'تسجيل الدخول GENOSYS',
      },
    ],
    locale: 'ar_AE',
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'تسجيل الدخول - مستحضرات التجميل الكورية المهنية GENOSYS',
    description: 'الوصول إلى حسابك المهني في GENOSYS. سجل الدخول لعرض الأسعار وإدارة الطلبات.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/login',
    languages: {
      'en': 'https://genosys.ae/login',
      'ar': 'https://genosys.ae/ar/login',
    },
  },
}

export default function ArabicLoginPage() {
  return (
    <div className="bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'تسجيل الدخول', url: '/ar/login' }
        ]}
      />
      <LoginClient />
    </div>
  )
}

