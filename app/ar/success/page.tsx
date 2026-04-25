import SuccessClient from '@/app/success/SuccessClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تم تأكيد الطلب - GENOSYS Professional Korean Dermacosmetics',
  description: 'تم تأكيد طلبك من منتجات العناية بالبشرة الاحترافية GENOSYS بنجاح. شكراً لاختيارك Genosys.',
  keywords: 'GENOSYS طلب ناجح, مستحضرات تجميل كورية طلب مؤكد, عناية بالبشرة احترافية طلب, شراء ناجح مستحضرات الإمارات',
  openGraph: {
    title: 'تم تأكيد الطلب - GENOSYS Professional Korean Dermacosmetics',
    description: 'تم تأكيد طلبك من منتجات العناية بالبشرة الاحترافية GENOSYS بنجاح.',
    type: 'website',
    url: 'https://genosys.ae/ar/success',
    siteName: 'GENOSYS',
    locale: 'ar_AE',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS تم تأكيد الطلب',
      },
    ],
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
    title: 'تم تأكيد الطلب - GENOSYS Professional Korean Dermacosmetics',
    description: 'تم تأكيد طلبك من منتجات العناية بالبشرة الاحترافية GENOSYS بنجاح.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/success',
    languages: {
      'en': 'https://genosys.ae/success',
      'ar': 'https://genosys.ae/ar/success',
      'ru': 'https://genosys.ae/ru/success',
    },
  },
}

export default function ArabicSuccessPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'تم بنجاح', url: '/ar/success' }
        ]}
      />
      <SuccessClient />
    </>
  )
}
