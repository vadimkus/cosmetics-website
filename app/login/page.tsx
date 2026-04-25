import LoginClient from './LoginClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - GENOSYS Professional Korean Dermacosmetics | Genosys',
  description: 'Access your GENOSYS professional account. Login to view prices, manage orders, and access exclusive professional Korean dermacosmetics products.',
  keywords: [
    'GENOSYS login',
    'Korean dermacosmetics login',
    'professional skincare account',
    'UAE cosmetics login',
    'GENOSYS account access'
  ],
  openGraph: {
    title: 'Login - GENOSYS Professional Korean Dermacosmetics',
    description: 'Access your GENOSYS professional account. Login to view prices and manage orders.',
    type: 'website',
    url: 'https://genosys.ae/login',
    siteName: 'GENOSYS',
    locale: 'en_AE',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Login',
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
    title: 'Login - GENOSYS Professional Korean Dermacosmetics',
    description: 'Access your GENOSYS professional account. Login to view prices and manage orders.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/login',
    languages: {
      'en': 'https://genosys.ae/login',
      'ar': 'https://genosys.ae/ar/login',
      'ru': 'https://genosys.ae/ru/login',
    },
  },
}

export default function LoginPage() {
  return (
    <div className="bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Login', url: '/login' }
        ]}
      />
      <LoginClient />
    </div>
  )
}