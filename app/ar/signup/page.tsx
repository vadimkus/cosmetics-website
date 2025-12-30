import LoginClient from '../../login/LoginClient'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'إنشاء حساب - مستحضرات التجميل الكورية المهنية GENOSYS | Genosys Middle East FZ-LLC',
  description: 'أنشئ حسابك المهني في GENOSYS للوصول إلى المنتجات والأسعار والطلبات.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/signup',
    languages: {
      en: 'https://genosys.ae/signup',
      ar: 'https://genosys.ae/ar/signup',
      ru: 'https://genosys.ae/ru/signup',
    },
  },
}

export default function ArabicSignupPage() {
  return (
    <div className="bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'إنشاء حساب', url: '/ar/signup' },
        ]}
      />
      <LoginClient />
    </div>
  )
}




