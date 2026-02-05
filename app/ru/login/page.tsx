import LoginClient from '../../login/LoginClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Вход - Профессиональная корейская дерматокосметика GENOSYS | Genosys Middle East FZ-LLC',
  description: 'Доступ к вашему профессиональному аккаунту GENOSYS. Войдите, чтобы просмотреть цены, управлять заказами и получить доступ к эксклюзивным продуктам профессиональной корейской дерматокосметики.',
  keywords: 'Вход GENOSYS, вход корейской косметики, аккаунт профессионального ухода за кожей, вход косметики ОАЭ, доступ к аккаунту GENOSYS',
  openGraph: {
    title: 'Вход - Профессиональная корейская дерматокосметика GENOSYS',
    description: 'Доступ к вашему профессиональному аккаунту GENOSYS. Войдите, чтобы просмотреть цены и управлять заказами.',
    type: 'website',
    url: 'https://genosys.ae/ru/login',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Вход GENOSYS',
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
    title: 'Вход - Профессиональная корейская дерматокосметика GENOSYS',
    description: 'Доступ к вашему профессиональному аккаунту GENOSYS. Войдите, чтобы просмотреть цены и управлять заказами.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/login',
    languages: {
      'en': 'https://genosys.ae/login',
      'ar': 'https://genosys.ae/ar/login',
      'ru': 'https://genosys.ae/ru/login',
    },
  },
}

export default function RussianLoginPage() {
  return (
    <div className="bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Вход', url: '/ru/login' }
        ]}
      />
      <LoginClient />
    </div>
  )
}



