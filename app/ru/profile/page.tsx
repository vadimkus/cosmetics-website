import type { Metadata } from 'next'
import ProfilePageClient from '../../ar/profile/ProfilePageClient'

export const metadata: Metadata = {
  title: 'Профиль | GENOSYS',
  description: 'Управляйте своим профилем, просматривайте историю заказов и обновляйте личную информацию',
  keywords: ['Профиль', 'GENOSYS', 'История заказов', 'Настройки', 'Конфиденциальность'],
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: 'Профиль | GENOSYS',
    description: 'Управляйте своим профилем, просматривайте историю заказов и обновляйте личную информацию',
    locale: 'ru_AE',
    type: 'website',
    url: 'https://genosys.ae/ru/profile',
    siteName: 'GENOSYS Middle East FZ-LLC',
  },
  twitter: {
    card: 'summary',
    title: 'Профиль | GENOSYS',
    description: 'Управляйте своим профилем, просматривайте историю заказов и обновляйте личную информацию',
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
  return <ProfilePageClient />
}

