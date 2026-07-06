import type { Metadata } from 'next'
import ForgotPasswordClient from '../../forgot-password/page'

export const metadata: Metadata = {
  title: 'Восстановление пароля - GENOSYS',
  description: 'Введите ваш email, и мы отправим ссылку для сброса пароля.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://genosys.ae/ru/forgot-password',
    languages: {
      'en': 'https://genosys.ae/forgot-password',
      'ar': 'https://genosys.ae/ar/forgot-password',
      'ru': 'https://genosys.ae/ru/forgot-password',
    },
  },
}

export default function RussianForgotPasswordPage() {
  return <ForgotPasswordClient />
}
