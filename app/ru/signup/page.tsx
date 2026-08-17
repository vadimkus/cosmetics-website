import LoginClient from '../../login/LoginClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Регистрация - GENOSYS Professional Korean Dermacosmetics',
  description: 'Создайте профессиональный аккаунт GENOSYS, чтобы получить доступ к продуктам, ценам и заказам.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/signup',
    languages: {
      en: 'https://genosys.ae/signup',
      ar: 'https://genosys.ae/ar/signup',
      ru: 'https://genosys.ae/ru/signup',
    },
  },
}

export default function RussianSignupPage() {
  return (
    <div>
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Регистрация', url: '/ru/signup' },
        ]}
      />
      <LoginClient />
    </div>
  )
}




