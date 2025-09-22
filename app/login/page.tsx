import LoginClient from './LoginClient'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - GENOSYS Professional Korean Dermacosmetics | Genosys Middle East FZ-LLC',
  description: 'Access your GENOSYS professional account. Login to view prices, manage orders, and access exclusive professional Korean dermacosmetics products.',
  keywords: 'GENOSYS login, Korean dermacosmetics login, professional skincare account, UAE cosmetics login, GENOSYS account access',
  openGraph: {
    title: 'Login - GENOSYS Professional Korean Dermacosmetics',
    description: 'Access your GENOSYS professional account. Login to view prices and manage orders.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Login',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_me',
    creator: '@genosys_me',
    title: 'Login - GENOSYS Professional Korean Dermacosmetics',
    description: 'Access your GENOSYS professional account. Login to view prices and manage orders.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/login',
  },
}

export default function LoginPage() {
  return (
    <div className="bg-white min-h-screen">
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