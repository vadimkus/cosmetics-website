import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import DeliveryPageClient from '@/app/delivery/DeliveryPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'معلومات التوصيل - شحن سريع الإمارات',
  description: 'خدمة توصيل سريعة وموثوقة في جميع أنحاء الإمارات. توصيل خلال ساعة واحدة في دبي، 24-36 ساعة في جميع أنحاء الإمارات. شحن مجاني على الطلبات التي تزيد عن 1,000 درهم.',
  keywords: [
    'توصيل الإمارات',
    'شحن سريع دبي',
    'توصيل Careem',
    'توصيل QuipQup',
    'شحن مجاني الإمارات',
    'توصيل مستحضرات التجميل الكورية'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'معلومات التوصيل - شحن سريع الإمارات',
    description: 'خدمة توصيل سريعة وموثوقة في جميع أنحاء الإمارات. توصيل خلال ساعة واحدة في دبي، 24-36 ساعة في جميع أنحاء الإمارات. شحن مجاني على الطلبات التي تزيد عن 1,000 درهم.',
    type: 'website',
    url: 'https://genosys.ae/ar/delivery',
    siteName: 'GENOSYS',
    locale: 'ar_AE',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'خدمة توصيل GENOSYS الإمارات',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'معلومات التوصيل - شحن سريع الإمارات',
    description: 'خدمة توصيل سريعة وموثوقة في جميع أنحاء الإمارات. توصيل خلال ساعة واحدة في دبي، 24-36 ساعة في جميع أنحاء الإمارات.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/delivery',
    languages: {
      'ar': 'https://genosys.ae/ar/delivery',
      'en': 'https://genosys.ae/delivery',
      'ru': 'https://genosys.ae/ru/delivery',
    },
  },
}


export default function ArabicDeliveryPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'التوصيل', url: '/ar/delivery' }
        ]}
      />
      <DeliveryPageClient />
    </>
  )
}
