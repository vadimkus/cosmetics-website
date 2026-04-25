import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PartnersSchema from '@/components/schema/PartnersSchema'
import PartnersPageClient from './PartnersPageClient'

export const metadata: Metadata = {
  title: 'GENOSYS Partners in UAE - Trusted Korean Dermacosmetics Distributors | Genosys Middle East',
  description: 'Discover our network of trusted GENOSYS partners across UAE. Professional Korean dermacosmetics distributors in Dubai, Abu Dhabi, Sharjah, and more. Find authorized GENOSYS retailers near you.',
  keywords: [
    'GENOSYS partners UAE',
    'Korean dermacosmetics distributors Dubai',
    'GENOSYS authorized retailers',
    'professional skincare partners UAE',
    'Korean beauty distributors',
    'dermacosmetics partners Dubai',
    'GENOSYS stockists UAE',
    'Korean skincare distributors',
    'beauty salon partners Dubai',
    'aesthetic clinic partners UAE'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'GENOSYS Partners in UAE - Trusted Korean Dermacosmetics Distributors',
    description: 'Find authorized GENOSYS partners across UAE. Professional Korean dermacosmetics distributors in Dubai, Abu Dhabi, Sharjah, and all Emirates.',
    type: 'website',
    url: 'https://genosys.ae/partners',
    siteName: 'GENOSYS',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Partners Network in UAE',
      },
    ],
    locale: 'en_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Partners in UAE - Trusted Korean Dermacosmetics Distributors',
    description: 'Find authorized GENOSYS partners across UAE. Professional Korean dermacosmetics distributors.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/partners',
    languages: {
      'en': 'https://genosys.ae/partners',
      'ar': 'https://genosys.ae/ar/partners',
      'ru': 'https://genosys.ae/ru/partners',
    },
  },
}

export default function PartnersPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Partners', url: '/partners' }
        ]}
      />
      <PartnersSchema />
      <PartnersPageClient />
    </>
  )
}
