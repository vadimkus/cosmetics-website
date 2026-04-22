import CartClient from '../../cart/CartClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Корзина - Профессиональная корейская дерматокосметика GENOSYS | Genosys Middle East FZ-LLC',
  description: 'Просмотрите выбранные профессиональные корейские продукты GENOSYS. Безопасная оплата с профессиональными скидками и доставкой в ОАЭ.',
  keywords: 'Корзина GENOSYS, корзина корейской косметики, корзина профессионального ухода за кожей, покупка косметики ОАЭ, оплата GENOSYS',
  openGraph: {
    title: 'Корзина - Профессиональная корейская дерматокосметика GENOSYS',
    description: 'Просмотрите выбранные профессиональные корейские продукты GENOSYS. Безопасная оплата с профессиональными скидками.',
    type: 'website',
    url: 'https://genosys.ae/ru/cart',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Корзина GENOSYS',
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
    title: 'Корзина - Профессиональная корейская дерматокосметика GENOSYS',
    description: 'Просмотрите выбранные профессиональные корейские продукты GENOSYS.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/cart',
    languages: {
      'en': 'https://genosys.ae/cart',
      'ar': 'https://genosys.ae/ar/cart',
      'ru': 'https://genosys.ae/ru/cart',
    },
  },
}

export default function RussianCartPage() {
  return (
    <div className="bg-gray-50 md:bg-white min-h-[100dvh] cart-page">
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Продукция', url: '/ru/products' },
          { name: 'Корзина', url: '/ru/cart' }
        ]}
      />
      <CartClient />
    </div>
  )
}



