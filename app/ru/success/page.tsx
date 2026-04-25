import SuccessClient from '@/app/success/SuccessClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Заказ успешно оформлен - GENOSYS Professional Korean Dermacosmetics | Genosys',
  description: 'Ваш заказ профессиональной корейской дерматокосметики GENOSYS успешно оформлен. Спасибо за выбор GENOSYS.',
  keywords: 'GENOSYS заказ успешно, корейская дерматокосметика заказ подтвержден, профессиональный уход за кожей заказ, успешная покупка косметики ОАЭ',
  openGraph: {
    title: 'Заказ успешно оформлен - GENOSYS Professional Korean Dermacosmetics',
    description: 'Ваш заказ профессиональной корейской дерматокосметики GENOSYS успешно оформлен.',
    type: 'website',
    url: 'https://genosys.ae/ru/success',
    siteName: 'GENOSYS',
    locale: 'ru_AE',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Заказ успешно оформлен',
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
    title: 'Заказ успешно оформлен - GENOSYS Professional Korean Dermacosmetics',
    description: 'Ваш заказ профессиональной корейской дерматокосметики GENOSYS успешно оформлен.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/success',
    languages: {
      'en': 'https://genosys.ae/success',
      'ar': 'https://genosys.ae/ar/success',
      'ru': 'https://genosys.ae/ru/success',
    },
  },
}

export default function RussianSuccessPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Успешно', url: '/ru/success' }
        ]}
      />
      <SuccessClient />
    </>
  )
}

