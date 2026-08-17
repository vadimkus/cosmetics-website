import LoginClient from '../../login/LoginClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تسجيل الدخول - مستحضرات التجميل الكورية الاحترافية GENOSYS',
  description: 'الوصول إلى حساب GENOSYS الخاص بك. سجل الدخول لعرض الأسعار وإدارة الطلبات والوصول إلى منتجات مستحضرات التجميل الكورية الاحترافية.',
  keywords: [
    'تسجيل الدخول GENOSYS',
    'تسجيل الدخول لمستحضرات التجميل الكورية',
    'حساب العناية بالبشرة الاحترافية',
    'تسجيل الدخول لمستحضرات التجميل الإمارات',
    'الوصول إلى حساب GENOSYS'
  ],
  openGraph: {
    title: 'تسجيل الدخول - مستحضرات التجميل الكورية الاحترافية GENOSYS',
    description: 'الوصول إلى حسابك المهني في GENOSYS. سجل الدخول لعرض الأسعار وإدارة الطلبات.',
    type: 'website',
    url: 'https://genosys.ae/ar/login',
    siteName: 'GENOSYS',
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
    title: 'تسجيل الدخول - مستحضرات التجميل الكورية الاحترافية GENOSYS',
    description: 'الوصول إلى حسابك المهني في GENOSYS. سجل الدخول لعرض الأسعار وإدارة الطلبات.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/login',
    languages: {
      'en': 'https://genosys.ae/login',
      'ar': 'https://genosys.ae/ar/login',
      'ru': 'https://genosys.ae/ru/login',
    },
  },
}

export default function ArabicLoginPage() {
  return (
    <div>
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

