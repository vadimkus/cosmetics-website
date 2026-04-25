import LoginClient from '../login/LoginClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - GENOSYS Professional Korean Dermacosmetics',
  description: 'Create your GENOSYS professional account. Sign up to access professional Korean dermacosmetics products, pricing, and ordering.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://genosys.ae/signup',
    languages: {
      en: 'https://genosys.ae/signup',
      ar: 'https://genosys.ae/ar/signup',
      ru: 'https://genosys.ae/ru/signup',
    },
  },
}

export default function SignupPage() {
  return (
    <div className="bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Sign Up', url: '/signup' },
        ]}
      />
      <LoginClient />
    </div>
  )
}




