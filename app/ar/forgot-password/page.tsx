import type { Metadata } from 'next'
import ForgotPasswordClient from '../../forgot-password/page'

export const metadata: Metadata = {
  title: 'استعادة كلمة المرور - GENOSYS',
  description: 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://genosys.ae/ar/forgot-password',
    languages: {
      'en': 'https://genosys.ae/forgot-password',
      'ar': 'https://genosys.ae/ar/forgot-password',
      'ru': 'https://genosys.ae/ru/forgot-password',
    },
  },
}

export default function ArabicForgotPasswordPage() {
  return <ForgotPasswordClient />
}
