import type { Metadata } from 'next'
import ProfilePageRefactored from '../../profile/page'

export const metadata: Metadata = {
  title: 'Профиль - Управление аккаунтом GENOSYS',
  description: 'Управляйте своим профилем GENOSYS, просматривайте историю заказов, обновляйте личную информацию и настройки. Доступ к профессиональным ценам и эксклюзивным продуктам корейской дерматокосметики.',
  keywords: ['Профиль GENOSYS', 'Управление аккаунтом', 'История заказов', 'Настройки профиля', 'Профессиональный аккаунт', 'GENOSYS ОАЭ'],
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: 'Профиль - Управление аккаунтом GENOSYS',
    description: 'Управляйте своим профилем GENOSYS, просматривайте историю заказов и обновляйте личную информацию.',
    locale: 'ru_AE',
    type: 'website',
    url: 'https://genosys.ae/ru/profile',
    siteName: 'GENOSYS',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Профиль GENOSYS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Профиль - Управление аккаунтом GENOSYS',
    description: 'Управляйте своим профилем GENOSYS, просматривайте историю заказов и обновляйте личную информацию',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/profile',
    languages: {
      'en': 'https://genosys.ae/profile',
      'ar': 'https://genosys.ae/ar/profile',
      'ru': 'https://genosys.ae/ru/profile',
    },
  },
}

export default function RussianProfilePage() {
  return <ProfilePageRefactored />
}

