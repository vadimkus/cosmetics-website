import CheckoutClient from '../../checkout/CheckoutClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Безопасная оплата - Профессиональная корейская дерматокосметика GENOSYS | Genosys Middle East FZ-LLC',
  description: 'Завершите заказ профессиональной корейской дерматокосметики GENOSYS безопасно. Профессиональные скидки, доставка в ОАЭ и безопасная обработка платежей.',
  keywords: 'Оплата GENOSYS, оплата корейской косметики, заказ профессионального ухода за кожей, покупка косметики ОАЭ, безопасная оплата',
  openGraph: {
    title: 'Безопасная оплата - Профессиональная корейская дерматокосметика GENOSYS',
    description: 'Завершите заказ профессиональной корейской дерматокосметики GENOSYS безопасно. Профессиональные скидки и доставка в ОАЭ.',
    type: 'website',
    url: 'https://genosys.ae/ru/checkout',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Безопасная оплата GENOSYS',
      },
    ],
    locale: 'ru_AE',
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
    title: 'Безопасная оплата - Профессиональная корейская дерматокосметика GENOSYS',
    description: 'Завершите заказ профессиональной корейской дерматокосметики GENOSYS безопасно.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/checkout',
    languages: {
      'en': 'https://genosys.ae/checkout',
      'ar': 'https://genosys.ae/ar/checkout',
      'ru': 'https://genosys.ae/ru/checkout',
    },
  },
}

export default function RussianCheckoutPage() {
  return (
    <div className="bg-gray-50 md:bg-white min-h-[100dvh] checkout-page">
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Продукция', url: '/ru/products' },
          { name: 'Корзина', url: '/ru/cart' },
          { name: 'Оплата', url: '/ru/checkout' }
        ]}
      />
      <CheckoutClient />
    </div>
  )
}



