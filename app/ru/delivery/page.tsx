import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import DeliveryPageClient from '@/app/delivery/DeliveryPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Информация о доставке - Быстрая доставка ОАЭ',
  description: 'Быстрая и надежная служба доставки по всему ОАЭ. Доставка в течение 1 часа в Дубае, 24-36 часов по всему ОАЭ. Бесплатная доставка при заказе свыше 1,000 дирхамов.',
  keywords: [
    'доставка ОАЭ',
    'быстрая доставка Дубай',
    'доставка Careem',
    'доставка QuipQup',
    'бесплатная доставка ОАЭ',
    'доставка корейской косметики'
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
    title: 'Информация о доставке - Быстрая доставка ОАЭ',
    description: 'Быстрая и надежная служба доставки по всему ОАЭ. Доставка в течение 1 часа в Дубае, 24-36 часов по всему ОАЭ. Бесплатная доставка при заказе свыше 1,000 дирхамов.',
    type: 'website',
    url: 'https://genosys.ae/ru/delivery',
    siteName: 'GENOSYS',
    locale: 'ru_AE',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Служба доставки GENOSYS ОАЭ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Информация о доставке - Быстрая доставка ОАЭ',
    description: 'Быстрая и надежная служба доставки по всему ОАЭ. Доставка в течение 1 часа в Дубае, 24-36 часов по всему ОАЭ.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/delivery',
    languages: {
      'en': 'https://genosys.ae/delivery',
      'ar': 'https://genosys.ae/ar/delivery',
      'ru': 'https://genosys.ae/ru/delivery',
    },
  },
}


export default function RussianDeliveryPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Доставка', url: '/ru/delivery' }
        ]}
      />
      <DeliveryPageClient />
    </>
  )
}
